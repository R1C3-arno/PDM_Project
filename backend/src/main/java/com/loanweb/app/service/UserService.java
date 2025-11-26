package com.loanweb.app.service;

import com.loanweb.app.entity.User;
import com.loanweb.app.repository.UserRepository;
import com.loanweb.app.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class UserService {
    @Autowired
    private UserRepository repo;

    @Autowired
    private LoanRepository loanRepo;

    public List<User> getAll() { return repo.findAll(); }
    public User getById(Long id) { return repo.findById(id).orElse(null); }
    public User create(User user) { return repo.save(user); }

    public User update(Long id, User user) {
        User existing = repo.findById(id).orElse(null);
        if (existing == null) return null;

        if (user.getEmail() != null) existing.setEmail(user.getEmail());
        if (user.getPassword() != null) existing.setPassword(user.getPassword());
        if (user.getFullName() != null) existing.setFullName(user.getFullName());
        if (user.getPhone() != null) existing.setPhone(user.getPhone());
        if (user.getAddress() != null) existing.setAddress(user.getAddress());
        if (user.getRole() != null) existing.setRole(user.getRole());
        if (user.getStatus() != null) existing.setStatus(user.getStatus());
        if (user.getAvatar() != null) existing.setAvatar(user.getAvatar());

        return repo.save(existing);
    }

    public void delete(Long id) { repo.deleteById(id); }

    public Map<String, Object> getUserStats(Long userId) {
        var userLoans = loanRepo.findAll().stream()
                .filter(l -> l.getUserId().equals(userId))
                .toList();

        long totalLoans = userLoans.size();

        long activeLoans = userLoans.stream()
                .filter(l -> "active".equals(l.getStatus()) || "approved".equals(l.getStatus()))
                .count();

        double totalBorrowed = 0;
        double outstandingBalance = 0;

        for (var loan : userLoans) {
            if (loan.getLoanAmount() != null) {
                totalBorrowed += loan.getLoanAmount();
            }
            if (loan.getOutstandingBalance() != null) {
                outstandingBalance += loan.getOutstandingBalance();
            }
        }

        double totalRepaid = totalBorrowed - outstandingBalance;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalLoans", totalLoans);
        stats.put("activeLoans", activeLoans);
        stats.put("totalBorrowed", totalBorrowed);
        stats.put("totalRepaid", totalRepaid);
        stats.put("outstandingBalance", outstandingBalance);
        stats.put("availableCredit", 50000);
        stats.put("walletBalance", 0);

        return stats;
    }
    public boolean changePassword(Long userId, String oldPassword, String newPassword) {
        User user = repo.findById(userId).orElse(null);
        if (user == null) return false;

        if (!user.getPassword().equals(oldPassword)) {
            return false;
        }

        user.setPassword(newPassword);
        repo.save(user);
        return true;
    }
}