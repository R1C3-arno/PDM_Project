package com.loanweb.app.web;

import com.loanweb.app.domain.user.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public String users(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        var currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        var users = userRepository.findAll();

        model.addAttribute("title", "Users");
        model.addAttribute("currentUser", currentUser);
        model.addAttribute("users", users);
        return "users/index";
    }
}
