package com.loanweb.app.web;

import com.loanweb.app.domain.user.User;
import com.loanweb.app.domain.user.UserRepository;
import com.loanweb.app.domain.wallet.WalletRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.math.BigDecimal;

@Controller
public class AuthController {
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
                         WalletRepository walletRepository,
                         PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/login")
    public String login(Model model,
                       @RequestParam(required = false) String error,
                       @RequestParam(required = false) String logout) {
        if (error != null) {
            model.addAttribute("error", "Invalid username or password");
        }
        if (logout != null) {
            model.addAttribute("message", "You have been logged out successfully");
        }
        model.addAttribute("title", "Login");
        return "auth/login";
    }

    @GetMapping("/register")
    public String register(Model model) {
        model.addAttribute("title", "Register");
        return "auth/register";
    }

    @PostMapping("/register")
    public String processRegistration(
        @RequestParam String email,
        @RequestParam String password,
        @RequestParam String fullName,
        @RequestParam(required = false) String phone,
        @RequestParam(required = false) String address,
        RedirectAttributes redirectAttributes
    ) {
        try {
            // Check if user already exists
            if (userRepository.findByEmail(email).isPresent()) {
                redirectAttributes.addFlashAttribute("error", "Email already registered");
                return "redirect:/register";
            }

            // Create new user
            String encodedPassword = passwordEncoder.encode(password);
            userRepository.create(email, encodedPassword, fullName, phone, address, User.UserRole.USER);

            // Get the created user and create wallet
            var user = userRepository.findByEmail(email).orElseThrow();
            walletRepository.create(user.id(), new BigDecimal("10000.00")); // Default credit limit

            redirectAttributes.addFlashAttribute("message", "Registration successful! Please login.");
            return "redirect:/login";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Registration failed: " + e.getMessage());
            return "redirect:/register";
        }
    }
}
