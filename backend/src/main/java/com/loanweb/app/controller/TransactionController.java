package com.loanweb.app.controller;

import com.loanweb.app.entity.Transaction;
import com.loanweb.app.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    @Autowired
    private TransactionService service;

    @GetMapping
    public List<Transaction> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public Transaction getById(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    public Transaction create(@RequestBody Transaction transaction) { return service.create(transaction); }

    @PutMapping("/{id}")
    public Transaction update(@PathVariable Long id, @RequestBody Transaction transaction) { return service.update(id, transaction); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}