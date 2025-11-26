package com.loanweb.app.service;

import com.loanweb.app.repository.LoanRepository;
import com.loanweb.app.repository.TransactionRepository;
import com.loanweb.app.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

@Service
public class StatisticsService {
    @Autowired
    private LoanRepository loanRepo;

    @Autowired
    private TransactionRepository transactionRepo;

    @Autowired
    private WalletRepository walletRepo;

    public Map<String, Object> getUserStatistics(Long userId) {
        var userLoans = loanRepo.findAll().stream()
                .filter(l -> l.getUserId().equals(userId))
                .toList();

        var wallet = walletRepo.findAll().stream()
                .filter(w -> w.getUserId().equals(userId))
                .findFirst()
                .orElse(null);

        Map<String, Object> stats = new HashMap<>();
        stats.put("overview", getOverview(userLoans, wallet));
        stats.put("loanProgress", getLoanProgress(userLoans));
        stats.put("breakdown", getBreakdown(userLoans));
        stats.put("upcomingPayments", getUpcomingPayments(userLoans));

        return stats;
    }

    private Map<String, Object> getOverview(List loans, Object wallet) {
        double totalBorrowed = 0;
        double outstandingDebt = 0;
        double totalInterestPaid = 0;

        for (Object obj : loans) {
            var loan = (com.loanweb.app.entity.Loan) obj;
            if (loan.getLoanAmount() != null) {
                totalBorrowed += loan.getLoanAmount();
            }
            if (loan.getOutstandingBalance() != null) {
                outstandingDebt += loan.getOutstandingBalance();
            }
            if (loan.getTotalAmount() != null && loan.getLoanAmount() != null) {
                totalInterestPaid += (loan.getTotalAmount() - loan.getLoanAmount());
            }
        }

        Map<String, Object> nextPayment = getNextPayment(loans);

        Map<String, Object> overview = new HashMap<>();
        overview.put("totalBorrowed", totalBorrowed);
        overview.put("outstandingDebt", outstandingDebt);
        overview.put("totalInterestPaid", totalInterestPaid);
        overview.put("nextPayment", nextPayment);

        return overview;
    }

    private Map<String, Object> getNextPayment(List loans) {
        LocalDate today = LocalDate.now();
        LocalDate nearestDate = null;
        double nearestAmount = 0;

        for (Object obj : loans) {
            var loan = (com.loanweb.app.entity.Loan) obj;
            if (!"active".equals(loan.getStatus()) && !"approved".equals(loan.getStatus())) continue;
            if (loan.getStartDate() == null || loan.getMonthlyPayment() == null) continue;

            LocalDate nextDate = loan.getStartDate().plusMonths(1);
            while (nextDate.isBefore(today)) {
                nextDate = nextDate.plusMonths(1);
            }

            if (nearestDate == null || nextDate.isBefore(nearestDate)) {
                nearestDate = nextDate;
                nearestAmount = loan.getMonthlyPayment();
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("amount", nearestAmount);
        result.put("dueDate", nearestDate != null ? nearestDate.toString() : null);

        return result;
    }

    private List<Map<String, Object>> getLoanProgress(List loans) {
        List<Map<String, Object>> progress = new ArrayList<>();

        for (Object obj : loans) {
            var loan = (com.loanweb.app.entity.Loan) obj;
            if (loan.getLoanAmount() == null || loan.getLoanAmount() == 0) continue;

            double paidAmount = loan.getLoanAmount() - (loan.getOutstandingBalance() != null ? loan.getOutstandingBalance() : loan.getLoanAmount());
            double progressPercent = (paidAmount / loan.getLoanAmount()) * 100;

            Map<String, Object> item = new HashMap<>();
            item.put("loanId", loan.getId());
            item.put("loanType", loan.getLoanType());
            item.put("loanAmount", loan.getLoanAmount());
            item.put("paidAmount", paidAmount);
            item.put("remaining", loan.getOutstandingBalance());
            item.put("progressPercent", Math.round(progressPercent));

            progress.add(item);
        }

        return progress;
    }

    private Map<String, Object> getBreakdown(List loans) {
        double principalAmount = 0;
        double interestAccrued = 0;
        double paidAmount = 0;

        for (Object obj : loans) {
            var loan = (com.loanweb.app.entity.Loan) obj;
            if (loan.getOutstandingBalance() != null) {
                principalAmount += loan.getOutstandingBalance();
            }
            if (loan.getTotalAmount() != null && loan.getLoanAmount() != null) {
                interestAccrued += (loan.getTotalAmount() - loan.getLoanAmount());
            }
            if (loan.getLoanAmount() != null && loan.getOutstandingBalance() != null) {
                paidAmount += (loan.getLoanAmount() - loan.getOutstandingBalance());
            }
        }

        Map<String, Object> breakdown = new HashMap<>();
        breakdown.put("principalAmount", principalAmount);
        breakdown.put("interestAccrued", interestAccrued);
        breakdown.put("paidAmount", paidAmount);

        return breakdown;
    }

    private List<Map<String, Object>> getUpcomingPayments(List loans) {
        List<Map<String, Object>> payments = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (Object obj : loans) {
            var loan = (com.loanweb.app.entity.Loan) obj;
            if (!"active".equals(loan.getStatus()) && !"approved".equals(loan.getStatus())) continue;
            if (loan.getStartDate() == null || loan.getMonthlyPayment() == null) continue;

            LocalDate nextDate = loan.getStartDate().plusMonths(1);
            while (nextDate.isBefore(today)) {
                nextDate = nextDate.plusMonths(1);
            }

            for (int i = 0; i < 4; i++) {
                Map<String, Object> payment = new HashMap<>();
                payment.put("loanId", loan.getId());
                payment.put("loanType", loan.getLoanType());
                payment.put("dueDate", nextDate.toString());
                payment.put("amount", loan.getMonthlyPayment());
                payments.add(payment);

                nextDate = nextDate.plusMonths(1);
            }
        }

        payments.sort((a, b) -> ((String)a.get("dueDate")).compareTo((String)b.get("dueDate")));

        return payments.size() > 10 ? payments.subList(0, 10) : payments;
    }
}