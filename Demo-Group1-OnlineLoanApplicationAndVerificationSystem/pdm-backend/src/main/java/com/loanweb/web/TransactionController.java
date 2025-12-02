package com.loanweb.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/**
 * REST controller for transaction endpoints.
 * Returns mock data for testing purposes.
 */
@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class TransactionController {

    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

    /**
     * Get all transactions for current user
     */
    @GetMapping
    public ResponseEntity<?> getTransactions(
            @RequestParam(required = false) Long loanId,
            @RequestParam(required = false) String type) {
        logger.info("Fetching transactions, loanId: {}, type: {}", loanId, type);
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth != null ? auth.getName() : "unknown";
            logger.info("User: {}", email);

            List<Map<String, Object>> transactions = generateMockTransactions();

            // Filter by loanId if provided
            if (loanId != null) {
                transactions = transactions.stream()
                    .filter(t -> loanId.equals(t.get("loanId")))
                    .toList();
            }

            // Filter by type if provided
            if (type != null && !type.isEmpty()) {
                transactions = transactions.stream()
                    .filter(t -> type.equalsIgnoreCase((String) t.get("type")))
                    .toList();
            }

            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            logger.error("Error fetching transactions: {}", e.getMessage(), e);
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    /**
     * Get transaction by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getTransaction(@PathVariable Long id) {
        logger.info("Fetching transaction: {}", id);
        try {
            Map<String, Object> transaction = new HashMap<>();
            transaction.put("id", id);
            transaction.put("type", "PAYMENT");
            transaction.put("amount", -500.00);
            transaction.put("description", "Loan payment");
            transaction.put("status", "COMPLETED");
            transaction.put("referenceNumber", "TXN-" + String.format("%06d", id));
            transaction.put("createdAt", LocalDateTime.now().minusDays(id).toString());

            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            logger.error("Error fetching transaction: {}", e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }

    private List<Map<String, Object>> generateMockTransactions() {
        List<Map<String, Object>> transactions = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        // Sample transactions
        Object[][] data = {
            {1L, "DEPOSIT", 5000.00, "Initial deposit", "COMPLETED", 1L},
            {2L, "PAYMENT", -500.00, "Loan payment - January", "COMPLETED", 1L},
            {3L, "PAYMENT", -500.00, "Loan payment - February", "COMPLETED", 1L},
            {4L, "DEPOSIT", 2000.00, "Salary credit", "COMPLETED", null},
            {5L, "WITHDRAWAL", -300.00, "ATM withdrawal", "COMPLETED", null},
            {6L, "PAYMENT", -500.00, "Loan payment - March", "PENDING", 1L},
        };

        for (int i = 0; i < data.length; i++) {
            Map<String, Object> txn = new HashMap<>();
            txn.put("id", data[i][0]);
            txn.put("type", data[i][1]);
            txn.put("amount", data[i][2]);
            txn.put("description", data[i][3]);
            txn.put("status", data[i][4]);
            txn.put("loanId", data[i][5]);
            txn.put("referenceNumber", "TXN-" + String.format("%06d", (Long) data[i][0]));
            txn.put("createdAt", now.minusDays(30 - i * 5).toString());
            transactions.add(txn);
        }

        return transactions;
    }
}
