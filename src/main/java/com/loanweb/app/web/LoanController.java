package com.loanweb.app.web;

import com.loanweb.app.domain.loan.LoanRepository;
import com.loanweb.app.domain.user.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/loans")
public class LoanController {
    private final LoanRepository loanRepository;
    private final UserRepository userRepository;

    public LoanController(LoanRepository loanRepository, UserRepository userRepository) {
        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public String loans(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        var user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        var loans = loanRepository.findByUserId(user.id());

        model.addAttribute("title", "My Loans");
        model.addAttribute("user", user);
        model.addAttribute("loans", loans);
        return "loans/index";
    }
}
