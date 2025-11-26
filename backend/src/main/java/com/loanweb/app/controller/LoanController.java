package com.loanweb.app.controller;

import com.loanweb.app.entity.Loan;
import com.loanweb.app.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "*")
public class LoanController {
    @Autowired
    private LoanService service;

    @GetMapping
    public List<Loan> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public Loan getById(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    public Loan create(@RequestBody Loan loan) { return service.create(loan); }

    @PutMapping("/{id}")
    public Loan update(@PathVariable Long id, @RequestBody Loan loan) { return service.update(id, loan); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }

    @GetMapping("/active")
    public Map<String, Object> getActiveLoansSummary(@RequestParam Long userId){
        return service.getActiveLoansSummary(userId);
    }

    @GetMapping("/user/{userId}")
    public List<Loan> getUserLoans(@PathVariable Long userId) {
        return service.getUserLoans(userId);
    }

    @GetMapping("/user/{userId}/stats")
    public Map<String, Object> getUserLoanStats(@PathVariable Long userId) {
        return service.getUserLoanStats(userId);
    }
}