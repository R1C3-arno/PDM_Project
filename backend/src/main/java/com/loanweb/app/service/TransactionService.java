package com.loanweb.app.service;

import com.loanweb.app.entity.Transaction;
import com.loanweb.app.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository repo;

    public List<Transaction> getAll() { return repo.findAll(); }
    public Transaction getById(Long id) { return repo.findById(id).orElse(null); }
    public Transaction create(Transaction transaction) { return repo.save(transaction); }
    public Transaction update(Long id, Transaction transaction) {
        transaction.setId(id);
        return repo.save(transaction);
    }
    public void delete(Long id) { repo.deleteById(id); }
    public List<Transaction> getRecentTransactions(Long userId, int limit) {
        return repo.findAll().stream()
                .filter(t -> t.getUserId().equals(userId))
                .sorted((a, b) -> b.getTransactionDate().compareTo(a.getTransactionDate()))
                .limit(limit)
                .collect(Collectors.toList());
    }
    public List<Transaction> getUserTransactions(Long userId, String type, int limit) {
        var stream = repo.findAll().stream()
                .filter(t -> t.getUserId().equals(userId));

        if (type != null && !type.isEmpty() && !"all".equalsIgnoreCase(type)) {
            stream = stream.filter(t -> type.equalsIgnoreCase(t.getTransactionType()));
        }

        return stream
                .sorted((a, b) -> b.getTransactionDate().compareTo(a.getTransactionDate()))
                .limit(limit)
                .collect(Collectors.toList());
    }
}