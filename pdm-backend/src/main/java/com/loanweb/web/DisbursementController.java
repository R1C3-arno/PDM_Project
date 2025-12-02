package com.loanweb.web;

import com.loanweb.domain.user.User;
import com.loanweb.service.AuthorizationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

/**
 * REST controller for loan disbursement management.
 * Handles disbursement initiation, processing, and tracking.
 */
@RestController
@RequestMapping("/api/disbursement")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class DisbursementController {

    private final AuthorizationService authorizationService;

    // Mock storage for disbursements
    private static final List<Map<String, Object>> mockDisbursements = Collections.synchronizedList(new ArrayList<>());
    private static final AtomicLong nextId = new AtomicLong(1);

    static {
        // Initialize with a mock disbursement
        mockDisbursements.add(createDisbursement(nextId.getAndIncrement(), 1L, 5000.0, "COMPLETED"));
    }

    private static Map<String, Object> createDisbursement(Long id, Long applicationId, Double amount, String status) {
        Map<String, Object> disbursement = new HashMap<>();
        disbursement.put("id", id);
        disbursement.put("applicationId", applicationId);
        disbursement.put("amount", amount);
        disbursement.put("disbursementMethod", "BANK_TRANSFER");
        disbursement.put("accountNumber", "****1234");
        disbursement.put("status", status);
        disbursement.put("referenceNumber", "DIS-" + String.format("%06d", id));
        disbursement.put("initiatedAt", LocalDateTime.now().minusDays(1).toString());
        disbursement.put("processedAt", "COMPLETED".equals(status) ? LocalDateTime.now().toString() : null);
        disbursement.put("initiatedBy", "Staff User");
        return disbursement;
    }

    /**
     * Get disbursement by application ID
     */
    @GetMapping("/application/{applicationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getDisbursementByApplication(@PathVariable Long applicationId) {
        log.info("Fetching disbursement for application: {}", applicationId);

        Optional<Map<String, Object>> disbursement = mockDisbursements.stream()
                .filter(d -> d.get("applicationId").equals(applicationId))
                .findFirst();

        if (disbursement.isPresent()) {
            return ResponseEntity.ok(disbursement.get());
        }

        return ResponseEntity.notFound().build();
    }

    /**
     * Get disbursement by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getDisbursementById(@PathVariable Long id) {
        log.info("Fetching disbursement with ID: {}", id);

        Optional<Map<String, Object>> disbursement = mockDisbursements.stream()
                .filter(d -> d.get("id").equals(id))
                .findFirst();

        if (disbursement.isPresent()) {
            return ResponseEntity.ok(disbursement.get());
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Initiate a new disbursement
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('BANKER', 'UNDERWRITER', 'ADMIN')")
    public ResponseEntity<?> initiateDisbursement(@RequestBody Map<String, Object> request) {
        User currentUser = authorizationService.getCurrentUser();
        log.info("User {} initiating disbursement", currentUser.getId());

        try {
            Long applicationId = Long.valueOf(request.get("applicationId").toString());
            String method = (String) request.getOrDefault("disbursementMethod", "BANK_TRANSFER");
            String accountNumber = (String) request.getOrDefault("accountNumber", "****0000");

            Map<String, Object> newDisbursement = new HashMap<>();
            Long id = nextId.getAndIncrement();
            newDisbursement.put("id", id);
            newDisbursement.put("applicationId", applicationId);
            newDisbursement.put("amount", request.getOrDefault("amount", 5000.0));
            newDisbursement.put("disbursementMethod", method);
            newDisbursement.put("accountNumber", accountNumber);
            newDisbursement.put("status", "PENDING");
            newDisbursement.put("referenceNumber", "DIS-" + String.format("%06d", id));
            newDisbursement.put("initiatedAt", LocalDateTime.now().toString());
            newDisbursement.put("processedAt", null);
            newDisbursement.put("initiatedBy", currentUser.getFullName());

            mockDisbursements.add(newDisbursement);
            log.info("Disbursement initiated with ID: {}", id);

            return ResponseEntity.status(HttpStatus.CREATED).body(newDisbursement);
        } catch (Exception e) {
            log.error("Failed to initiate disbursement: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to initiate disbursement"));
        }
    }

    /**
     * Process a pending disbursement
     */
    @PostMapping("/{id}/process")
    @PreAuthorize("hasAnyRole('BANKER', 'UNDERWRITER', 'ADMIN')")
    public ResponseEntity<?> processDisbursement(@PathVariable Long id) {
        User currentUser = authorizationService.getCurrentUser();
        log.info("User {} processing disbursement {}", currentUser.getId(), id);

        Optional<Map<String, Object>> disbursementOpt = mockDisbursements.stream()
                .filter(d -> d.get("id").equals(id))
                .findFirst();

        if (disbursementOpt.isPresent()) {
            Map<String, Object> disbursement = disbursementOpt.get();

            if (!"PENDING".equals(disbursement.get("status"))) {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "Disbursement is not in PENDING status"
                ));
            }

            disbursement.put("status", "COMPLETED");
            disbursement.put("processedAt", LocalDateTime.now().toString());
            disbursement.put("processedBy", currentUser.getFullName());

            return ResponseEntity.ok(Map.of(
                    "message", "Disbursement processed successfully",
                    "disbursement", disbursement
            ));
        }

        return ResponseEntity.notFound().build();
    }

    /**
     * Cancel a pending disbursement
     */
    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('BANKER', 'UNDERWRITER', 'ADMIN')")
    public ResponseEntity<?> cancelDisbursement(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        User currentUser = authorizationService.getCurrentUser();
        log.info("User {} cancelling disbursement {}", currentUser.getId(), id);

        Optional<Map<String, Object>> disbursementOpt = mockDisbursements.stream()
                .filter(d -> d.get("id").equals(id))
                .findFirst();

        if (disbursementOpt.isPresent()) {
            Map<String, Object> disbursement = disbursementOpt.get();

            if (!"PENDING".equals(disbursement.get("status"))) {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "Only pending disbursements can be cancelled"
                ));
            }

            disbursement.put("status", "CANCELLED");
            disbursement.put("cancelledAt", LocalDateTime.now().toString());
            disbursement.put("cancelledBy", currentUser.getFullName());
            disbursement.put("cancellationReason", request.getOrDefault("reason", "No reason provided"));

            return ResponseEntity.ok(Map.of(
                    "message", "Disbursement cancelled",
                    "disbursement", disbursement
            ));
        }

        return ResponseEntity.notFound().build();
    }
}
