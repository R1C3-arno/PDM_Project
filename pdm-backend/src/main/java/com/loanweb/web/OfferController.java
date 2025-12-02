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
 * REST controller for loan offer management.
 * Handles offer creation, retrieval, acceptance, and rejection.
 */
@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class OfferController {

    private final AuthorizationService authorizationService;

    // Mock storage for offers
    private static final List<Map<String, Object>> mockOffers = Collections.synchronizedList(new ArrayList<>());
    private static final AtomicLong nextId = new AtomicLong(1);

    static {
        // Initialize with mock offers
        mockOffers.add(createOffer(nextId.getAndIncrement(), 1L, 5000.0, 12.0, 12, "PENDING"));
    }

    private static Map<String, Object> createOffer(Long id, Long applicationId, Double amount, Double rate, Integer term, String status) {
        double monthlyPayment = calculateEMI(amount, rate, term);
        Map<String, Object> offer = new HashMap<>();
        offer.put("id", id);
        offer.put("applicationId", applicationId);
        offer.put("approvedAmount", amount);
        offer.put("interestRate", rate);
        offer.put("term", term);
        offer.put("monthlyPayment", Math.round(monthlyPayment * 100.0) / 100.0);
        offer.put("totalPayment", Math.round(monthlyPayment * term * 100.0) / 100.0);
        offer.put("processingFee", 500.0);
        offer.put("status", status);
        offer.put("conditions", "Standard terms and conditions apply");
        offer.put("validUntil", LocalDateTime.now().plusDays(30).toString());
        offer.put("createdAt", LocalDateTime.now().toString());
        offer.put("createdBy", "Staff User");
        return offer;
    }

    private static double calculateEMI(double principal, double annualRate, int months) {
        double monthlyRate = annualRate / 100 / 12;
        return principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    }

    /**
     * Get offer by application ID
     */
    @GetMapping("/application/{applicationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getOfferByApplication(@PathVariable Long applicationId) {
        log.info("Fetching offer for application: {}", applicationId);

        Optional<Map<String, Object>> offer = mockOffers.stream()
                .filter(o -> o.get("applicationId").equals(applicationId))
                .findFirst();

        if (offer.isPresent()) {
            return ResponseEntity.ok(offer.get());
        }

        return ResponseEntity.notFound().build();
    }

    /**
     * Get offer by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getOfferById(@PathVariable Long id) {
        log.info("Fetching offer with ID: {}", id);

        Optional<Map<String, Object>> offer = mockOffers.stream()
                .filter(o -> o.get("id").equals(id))
                .findFirst();

        if (offer.isPresent()) {
            return ResponseEntity.ok(offer.get());
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Create a new offer (staff only)
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('BANKER', 'UNDERWRITER', 'ADMIN')")
    public ResponseEntity<?> createOffer(@RequestBody Map<String, Object> request) {
        User currentUser = authorizationService.getCurrentUser();
        log.info("User {} creating new offer", currentUser.getId());

        try {
            Long applicationId = Long.valueOf(request.get("applicationId").toString());
            Double approvedAmount = Double.valueOf(request.get("approvedAmount").toString());
            Double interestRate = Double.valueOf(request.get("interestRate").toString());
            Integer term = Integer.valueOf(request.get("term").toString());

            double monthlyPayment = calculateEMI(approvedAmount, interestRate, term);

            Map<String, Object> newOffer = new HashMap<>();
            newOffer.put("id", nextId.getAndIncrement());
            newOffer.put("applicationId", applicationId);
            newOffer.put("approvedAmount", approvedAmount);
            newOffer.put("interestRate", interestRate);
            newOffer.put("term", term);
            newOffer.put("monthlyPayment", Math.round(monthlyPayment * 100.0) / 100.0);
            newOffer.put("totalPayment", Math.round(monthlyPayment * term * 100.0) / 100.0);
            newOffer.put("processingFee", request.getOrDefault("processingFee", 500.0));
            newOffer.put("status", "PENDING");
            newOffer.put("conditions", request.getOrDefault("conditions", "Standard terms apply"));
            newOffer.put("validUntil", request.getOrDefault("validUntil", LocalDateTime.now().plusDays(30).toString()));
            newOffer.put("createdAt", LocalDateTime.now().toString());
            newOffer.put("createdBy", currentUser.getFullName());

            mockOffers.add(newOffer);
            log.info("Offer created with ID: {}", newOffer.get("id"));

            return ResponseEntity.status(HttpStatus.CREATED).body(newOffer);
        } catch (Exception e) {
            log.error("Failed to create offer: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to create offer"));
        }
    }

    /**
     * Accept an offer
     */
    @PostMapping("/{id}/accept")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> acceptOffer(@PathVariable Long id) {
        User currentUser = authorizationService.getCurrentUser();
        log.info("User {} accepting offer {}", currentUser.getId(), id);

        Optional<Map<String, Object>> offerOpt = mockOffers.stream()
                .filter(o -> o.get("id").equals(id))
                .findFirst();

        if (offerOpt.isPresent()) {
            Map<String, Object> offer = offerOpt.get();
            offer.put("status", "ACCEPTED");
            offer.put("acceptedAt", LocalDateTime.now().toString());
            offer.put("acceptedBy", currentUser.getFullName());

            return ResponseEntity.ok(Map.of(
                    "message", "Offer accepted successfully",
                    "offer", offer
            ));
        }

        return ResponseEntity.notFound().build();
    }

    /**
     * Reject an offer
     */
    @PostMapping("/{id}/reject")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> rejectOffer(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        User currentUser = authorizationService.getCurrentUser();
        log.info("User {} rejecting offer {}", currentUser.getId(), id);

        Optional<Map<String, Object>> offerOpt = mockOffers.stream()
                .filter(o -> o.get("id").equals(id))
                .findFirst();

        if (offerOpt.isPresent()) {
            Map<String, Object> offer = offerOpt.get();
            offer.put("status", "REJECTED");
            offer.put("rejectedAt", LocalDateTime.now().toString());
            offer.put("rejectionReason", request.getOrDefault("reason", "No reason provided"));

            return ResponseEntity.ok(Map.of(
                    "message", "Offer rejected",
                    "offer", offer
            ));
        }

        return ResponseEntity.notFound().build();
    }
}
