package com.loanweb.app.service;

import com.loanweb.app.entity.Transaction;
import com.loanweb.app.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

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
}