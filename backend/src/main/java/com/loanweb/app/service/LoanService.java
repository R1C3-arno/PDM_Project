package com.loanweb.app.service;

import com.loanweb.app.entity.Loan;
import com.loanweb.app.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;


@Service
public class LoanService {
    @Autowired
    private LoanRepository repo;

    public List<Loan> getAll() {
        return repo.findAll();
    }

    public Loan getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Loan create(Loan loan) {
        return repo.save(loan);
    }

    public Loan update(Long id, Loan loan) {
        Loan existing = repo.findById(id).orElse(null);
        if (existing == null) return null;

        if (loan.getUserId() != null) existing.setUserId(loan.getUserId());
        if (loan.getLoanType() != null) existing.setLoanType(loan.getLoanType());
        if (loan.getLoanAmount() != null) existing.setLoanAmount(loan.getLoanAmount());
        if (loan.getInterestRate() != null) existing.setInterestRate(loan.getInterestRate());
        if (loan.getLoanTermMonths() != null) existing.setLoanTermMonths(loan.getLoanTermMonths());
        if (loan.getMonthlyPayment() != null) existing.setMonthlyPayment(loan.getMonthlyPayment());
        if (loan.getTotalAmount() != null) existing.setTotalAmount(loan.getTotalAmount());
        if (loan.getOutstandingBalance() != null) existing.setOutstandingBalance(loan.getOutstandingBalance());
        if (loan.getStatus() != null) existing.setStatus(loan.getStatus());
        if (loan.getPurpose() != null) existing.setPurpose(loan.getPurpose());
        if (loan.getStartDate() != null) existing.setStartDate(loan.getStartDate());
        if (loan.getEndDate() != null) existing.setEndDate(loan.getEndDate());

        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public Map<String, Object> getActiveLoansSummary(Long userId) {
        var activeLoans = repo.findAll().stream()
                .filter(l -> l.getUserId().equals(userId))
                .filter(l -> "active".equals(l.getStatus()) || "approved".equals(l.getStatus()))
                .toList();

        long count = activeLoans.size();
        double total = 0;

        for (var loan : activeLoans) {
            if (loan.getLoanAmount() != null) {
                total += loan.getLoanAmount();
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("count", count);
        summary.put("total", total);

        return summary;
    }

    public List<Loan> getUserLoans(Long userId) {
        return repo.findAll().stream()
                .filter(l -> l.getUserId().equals(userId))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
    }

    public Map<String, Object> getUserLoanStats(Long userId) {
        var userLoans = repo.findAll().stream()
                .filter(l -> l.getUserId().equals(userId))
                .toList();

        long activeCount = userLoans.stream()
                .filter(l -> "active".equals(l.getStatus()) || "approved".equals(l.getStatus()))
                .count();

        long pendingCount = userLoans.stream()
                .filter(l -> "pending".equals(l.getStatus()))
                .count();

        long completedCount = userLoans.stream()
                .filter(l -> "completed".equals(l.getStatus()) || "paid".equals(l.getStatus()))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("activeLoans", activeCount);
        stats.put("pendingLoans", pendingCount);
        stats.put("completedLoans", completedCount);

        return stats;
    }
}