package com.loanweb.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * REST controller for wallet endpoints.
 * Currently returns mock data - full implementation pending.
 */
@RestController
@RequestMapping("/api/wallets")
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class WalletController {

    private static final Logger logger = LoggerFactory.getLogger(WalletController.class);

    // Mock wallet balances per user
    private static final Map<String, Double> userBalances = new HashMap<>();

    static {
        userBalances.put("test@test.com", 1250.50);
        userBalances.put("admin@olavs.com", 5000.00);
    }

    /**
     * Get all wallets (returns current user's wallet)
     */
    @GetMapping
    public ResponseEntity<?> getWallets() {
        return getMyWallet();
    }

    /**
     * Get current user's wallet
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyWallet() {
        logger.info("Fetching wallet for current user");
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth != null ? auth.getName() : "test@test.com";

            double balance = userBalances.getOrDefault(email, 0.0);

            Map<String, Object> wallet = new HashMap<>();
            wallet.put("balance", balance);
            wallet.put("currency", "USD");
            wallet.put("email", email);

            return ResponseEntity.ok(wallet);
        } catch (Exception e) {
            logger.error("Error fetching wallet: {}", e.getMessage(), e);
            return ResponseEntity.ok(Map.of("balance", 0.0, "currency", "USD"));
        }
    }

    /**
     * Deposit funds
     */
    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody Map<String, Object> request) {
        logger.info("Processing deposit");
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth != null ? auth.getName() : "test@test.com";

            double amount = ((Number) request.get("amount")).doubleValue();
            double currentBalance = userBalances.getOrDefault(email, 0.0);
            double newBalance = currentBalance + amount;
            userBalances.put(email, newBalance);

            logger.info("Deposit of {} processed for {}. New balance: {}", amount, email, newBalance);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "balance", newBalance,
                    "message", "Deposit successful"
            ));
        } catch (Exception e) {
            logger.error("Error processing deposit: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Deposit failed"));
        }
    }

    /**
     * Withdraw funds
     */
    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody Map<String, Object> request) {
        logger.info("Processing withdrawal");
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth != null ? auth.getName() : "test@test.com";

            double amount = ((Number) request.get("amount")).doubleValue();
            double currentBalance = userBalances.getOrDefault(email, 0.0);

            if (amount > currentBalance) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Insufficient funds"));
            }

            double newBalance = currentBalance - amount;
            userBalances.put(email, newBalance);

            logger.info("Withdrawal of {} processed for {}. New balance: {}", amount, email, newBalance);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "balance", newBalance,
                    "message", "Withdrawal successful"
            ));
        } catch (Exception e) {
            logger.error("Error processing withdrawal: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Withdrawal failed"));
        }
    }
}
