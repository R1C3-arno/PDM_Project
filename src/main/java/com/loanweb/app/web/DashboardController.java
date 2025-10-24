package com.loanweb.app.web;

import com.loanweb.app.domain.loan.Loan;
import com.loanweb.app.domain.loan.LoanRepository;
import com.loanweb.app.domain.notification.NotificationRepository;
import com.loanweb.app.domain.ticket.SupportTicket;
import com.loanweb.app.domain.ticket.SupportTicketRepository;
import com.loanweb.app.domain.transaction.TransactionRepository;
import com.loanweb.app.domain.user.UserRepository;
import com.loanweb.app.domain.wallet.WalletRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.math.BigDecimal;

@Controller
public class DashboardController {
    private final UserRepository userRepository;
    private final LoanRepository loanRepository;
    private final TransactionRepository transactionRepository;
    private final WalletRepository walletRepository;
    private final SupportTicketRepository ticketRepository;
    private final NotificationRepository notificationRepository;

    public DashboardController(UserRepository userRepository,
                              LoanRepository loanRepository,
                              TransactionRepository transactionRepository,
                              WalletRepository walletRepository,
                              SupportTicketRepository ticketRepository,
                              NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.loanRepository = loanRepository;
        this.transactionRepository = transactionRepository;
        this.walletRepository = walletRepository;
        this.ticketRepository = ticketRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        var user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        var wallet = walletRepository.findByUserId(user.id()).orElse(null);
        var loans = loanRepository.findByUserId(user.id());
        var recentTransactions = transactionRepository.findByUserId(user.id()).stream().limit(5).toList();
        var tickets = ticketRepository.findByUserId(user.id()).stream().limit(3).toList();
        var unreadNotifications = notificationRepository.countUnreadByUserId(user.id());

        // Calculate stats
        long activeLoans = loans.stream()
            .filter(l -> l.status() == Loan.LoanStatus.ACTIVE)
            .count();

        BigDecimal totalOutstanding = loans.stream()
            .filter(l -> l.status() == Loan.LoanStatus.ACTIVE)
            .map(Loan::outstandingBalance)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        long openTickets = tickets.stream()
            .filter(t -> t.status() == SupportTicket.TicketStatus.OPEN)
            .count();

        model.addAttribute("title", "Dashboard");
        model.addAttribute("user", user);
        model.addAttribute("wallet", wallet);
        model.addAttribute("loans", loans);
        model.addAttribute("activeLoansCount", activeLoans);
        model.addAttribute("totalOutstanding", totalOutstanding);
        model.addAttribute("recentTransactions", recentTransactions);
        model.addAttribute("tickets", tickets);
        model.addAttribute("openTicketsCount", openTickets);
        model.addAttribute("unreadNotifications", unreadNotifications);

        return "dashboard/index";
    }
}
