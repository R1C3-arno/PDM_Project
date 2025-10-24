package com.loanweb.app.web;

import com.loanweb.app.domain.transaction.TransactionRepository;
import com.loanweb.app.domain.user.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/transactions")
public class TransactionController {
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionController(TransactionRepository transactionRepository,
                                UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public String transactions(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        var user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        var transactions = transactionRepository.findByUserId(user.id());

        model.addAttribute("title", "Transactions");
        model.addAttribute("user", user);
        model.addAttribute("transactions", transactions);
        return "transactions/index";
    }
}
