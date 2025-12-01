package com.loanweb.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * REST controller for loan endpoints.
 * Returns mock data for testing purposes.
 */
@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class LoanController {

    private static final Logger logger = LoggerFactory.getLogger(LoanController.class);

    /**
     * Get all loans for current user
     */
    @GetMapping
    public ResponseEntity<?> getLoans() {
        logger.info("Fetching loans for current user");
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth != null ? auth.getName() : "unknown";
            logger.info("User: {}", email);

            List<Map<String, Object>> loans = generateMockLoans();
            return ResponseEntity.ok(loans);
        } catch (Exception e) {
            logger.error("Error fetching loans: {}", e.getMessage(), e);
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    /**
     * Get loan by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getLoan(@PathVariable Long id) {
        logger.info("Fetching loan: {}", id);
        try {
            Map<String, Object> loan = generateMockLoan(id);
            return ResponseEntity.ok(loan);
        } catch (Exception e) {
            logger.error("Error fetching loan: {}", e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Make a payment on a loan
     */
    @PostMapping("/{id}/payment")
    public ResponseEntity<?> makePayment(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        logger.info("Processing payment for loan: {}", id);
        try {
            double amount = ((Number) request.get("amount")).doubleValue();

            Map<String, Object> loan = generateMockLoan(id);
            double amountPaid = ((Number) loan.get("amountPaid")).doubleValue() + amount;
            double totalPayable = ((Number) loan.get("totalPayable")).doubleValue();
            double remainingBalance = totalPayable - amountPaid;

            loan.put("amountPaid", amountPaid);
            loan.put("remainingBalance", Math.max(0, remainingBalance));

            if (remainingBalance <= 0) {
                loan.put("status", "PAID_OFF");
            }

            logger.info("Payment of {} processed for loan {}. Remaining: {}", amount, id, remainingBalance);
            return ResponseEntity.ok(loan);
        } catch (Exception e) {
            logger.error("Error processing payment: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", "Payment failed"));
        }
    }

    private List<Map<String, Object>> generateMockLoans() {
        List<Map<String, Object>> loans = new ArrayList<>();

        // Sample loans
        loans.add(createLoan(1L, "Personal Loan", 10000.0, 8.5, 24, "ACTIVE", 3500.0));
        loans.add(createLoan(2L, "Home Improvement", 25000.0, 7.5, 36, "ACTIVE", 8000.0));
        loans.add(createLoan(3L, "Education Loan", 5000.0, 6.5, 12, "PAID_OFF", 5750.0));

        return loans;
    }

    private Map<String, Object> generateMockLoan(Long id) {
        return switch (id.intValue()) {
            case 1 -> createLoan(1L, "Personal Loan", 10000.0, 8.5, 24, "ACTIVE", 3500.0);
            case 2 -> createLoan(2L, "Home Improvement", 25000.0, 7.5, 36, "ACTIVE", 8000.0);
            case 3 -> createLoan(3L, "Education Loan", 5000.0, 6.5, 12, "PAID_OFF", 5750.0);
            default -> createLoan(id, "Loan #" + id, 10000.0, 8.0, 24, "ACTIVE", 2000.0);
        };
    }

    private Map<String, Object> createLoan(Long id, String purpose, double amount, double interestRate,
                                           int termMonths, String status, double amountPaid) {
        Map<String, Object> loan = new HashMap<>();

        double totalPayable = amount * (1 + (interestRate / 100) * (termMonths / 12.0));
        double monthlyPayment = totalPayable / termMonths;
        double remainingBalance = totalPayable - amountPaid;

        loan.put("id", id);
        loan.put("purpose", purpose);
        loan.put("amount", amount);
        loan.put("interestRate", interestRate);
        loan.put("termMonths", termMonths);
        loan.put("monthlyPayment", Math.round(monthlyPayment * 100.0) / 100.0);
        loan.put("totalPayable", Math.round(totalPayable * 100.0) / 100.0);
        loan.put("amountPaid", amountPaid);
        loan.put("remainingBalance", Math.max(0, Math.round(remainingBalance * 100.0) / 100.0));
        loan.put("status", status);
        loan.put("startDate", LocalDate.now().minusMonths(termMonths / 2).toString());
        loan.put("createdAt", LocalDateTime.now().minusMonths(termMonths / 2).toString());

        return loan;
    }
}
