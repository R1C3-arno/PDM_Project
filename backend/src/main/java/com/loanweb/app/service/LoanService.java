package com.loanweb.app.service;

import com.loanweb.app.entity.Loan;
import com.loanweb.app.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LoanService {
    @Autowired
    private LoanRepository repo;

    public List<Loan> getAll() { return repo.findAll(); }
    public Loan getById(Long id) { return repo.findById(id).orElse(null); }
    public Loan create(Loan loan) { return repo.save(loan); }
    public Loan update(Long id, Loan loan) {
        loan.setId(id);
        return repo.save(loan);
    }
    public void delete(Long id) { repo.deleteById(id); }
}