package com.loanweb.app.service;

import com.loanweb.app.repository.LoanRepository;
import com.loanweb.app.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;
import java.util.Locale;

@Service
public class StatsService {
    @Autowired
    private LoanRepository loanRepo;

    @Autowired
    private TransactionRepository transactionRepo;

    public Map<String, Object> getTrends(Long userId, int months) {
        var userLoans = loanRepo.findAll().stream()
                .filter(l -> l.getUserId().equals(userId))
                .toList();

        var userTransactions = transactionRepo.findAll().stream()
                .filter(t -> t.getUserId().equals(userId))
                .toList();

        List<String> labels = new ArrayList<>();
        List<Double> loansData = new ArrayList<>();
        List<Double> paymentsData = new ArrayList<>();

        LocalDate now = LocalDate.now();

        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthDate = now.minusMonths(i);
            String monthLabel = monthDate.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            labels.add(monthLabel);

            double monthLoans = 0;
            for (var loan : userLoans) {
                if (loan.getStartDate() != null &&
                        loan.getStartDate().getMonth() == monthDate.getMonth() &&
                        loan.getStartDate().getYear() == monthDate.getYear()) {
                    monthLoans += loan.getLoanAmount() != null ? loan.getLoanAmount() : 0;
                }
            }
            loansData.add(monthLoans);

            double monthPayments = 0;
            for (var tx : userTransactions) {
                if (tx.getTransactionDate() != null &&
                        tx.getTransactionDate().getMonth() == monthDate.getMonth() &&
                        tx.getTransactionDate().getYear() == monthDate.getYear() &&
                        tx.getAmount() != null && tx.getAmount() < 0) {
                    monthPayments += Math.abs(tx.getAmount());
                }
            }
            paymentsData.add(monthPayments);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("labels", labels);
        result.put("loans", loansData);
        result.put("payments", paymentsData);

        return result;
    }

    public Map<String, Object> getDistribution(Long userId) {
        var userLoans = loanRepo.findAll().stream()
                .filter(l -> l.getUserId().equals(userId))
                .toList();

        Map<String, Double> typeCounts = new HashMap<>();

        for (var loan : userLoans) {
            String type = loan.getLoanType() != null ? loan.getLoanType() : "other";
            typeCounts.put(type, typeCounts.getOrDefault(type, 0.0) + 1);
        }

        List<String> labels = new ArrayList<>(typeCounts.keySet());
        List<Double> values = new ArrayList<>(typeCounts.values());

        Map<String, Object> result = new HashMap<>();
        result.put("labels", labels);
        result.put("values", values);

        return result;
    }

    public Map<String, Object> getMonthly(Long userId) {
        var userTransactions = transactionRepo.findAll().stream()
                .filter(t -> t.getUserId().equals(userId))
                .filter(t -> t.getTransactionDate() != null)
                .toList();

        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);

        List<String> labels = Arrays.asList("Week 1", "Week 2", "Week 3", "Week 4");
        List<Double> income = new ArrayList<>();
        List<Double> expenses = new ArrayList<>();

        for (int week = 0; week < 4; week++) {
            LocalDate weekStart = startOfMonth.plusDays(week * 7);
            LocalDate weekEnd = weekStart.plusDays(7);

            double weekIncome = 0;
            double weekExpenses = 0;

            for (var tx : userTransactions) {
                LocalDate txDate = tx.getTransactionDate().toLocalDate();
                if (!txDate.isBefore(weekStart) && txDate.isBefore(weekEnd)) {
                    if (tx.getAmount() > 0) {
                        weekIncome += tx.getAmount();
                    } else {
                        weekExpenses += Math.abs(tx.getAmount());
                    }
                }
            }

            income.add(weekIncome);
            expenses.add(weekExpenses);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("labels", labels);
        result.put("income", income);
        result.put("expenses", expenses);

        return result;
    }
}