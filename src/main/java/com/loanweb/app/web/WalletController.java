package com.loanweb.app.web;

import com.loanweb.app.domain.transaction.TransactionRepository;
import com.loanweb.app.domain.user.UserRepository;
import com.loanweb.app.domain.wallet.WalletRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/wallet")
public class WalletController {
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public WalletController(WalletRepository walletRepository,
                           TransactionRepository transactionRepository,
                           UserRepository userRepository) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public String wallet(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        var user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        var wallet = walletRepository.findByUserId(user.id()).orElse(null);
        var transactions = transactionRepository.findByUserId(user.id()).stream().limit(10).toList();

        model.addAttribute("title", "My Wallet");
        model.addAttribute("user", user);
        model.addAttribute("wallet", wallet);
        model.addAttribute("transactions", transactions);
        return "wallet/index";
    }
}
