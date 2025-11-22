package com.loanweb.app.service;

import com.loanweb.app.entity.Wallet;
import com.loanweb.app.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WalletService {
    @Autowired
    private WalletRepository repo;

    public List<Wallet> getAll() { return repo.findAll(); }
    public Wallet getById(Long id) { return repo.findById(id).orElse(null); }
    public Wallet create(Wallet wallet) { return repo.save(wallet); }
    public Wallet update(Long id, Wallet wallet) {
        wallet.setId(id);
        return repo.save(wallet);
    }
    public void delete(Long id) { repo.deleteById(id); }
}