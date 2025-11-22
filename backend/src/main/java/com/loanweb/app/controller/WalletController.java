package com.loanweb.app.controller;

import com.loanweb.app.entity.Wallet;
import com.loanweb.app.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/wallets")
@CrossOrigin(origins = "*")
public class WalletController {
    @Autowired
    private WalletService service;

    @GetMapping
    public List<Wallet> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public Wallet getById(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    public Wallet create(@RequestBody Wallet wallet) { return service.create(wallet); }

    @PutMapping("/{id}")
    public Wallet update(@PathVariable Long id, @RequestBody Wallet wallet) { return service.update(id, wallet); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}