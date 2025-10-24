package com.loanweb.app.web;

import com.loanweb.app.domain.ticket.SupportTicketRepository;
import com.loanweb.app.domain.user.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/tickets")
public class SupportTicketController {
    private final SupportTicketRepository ticketRepository;
    private final UserRepository userRepository;

    public SupportTicketController(SupportTicketRepository ticketRepository,
                                   UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public String tickets(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        var user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        var tickets = ticketRepository.findByUserId(user.id());

        model.addAttribute("title", "Support Tickets");
        model.addAttribute("user", user);
        model.addAttribute("tickets", tickets);
        return "tickets/index";
    }
}
