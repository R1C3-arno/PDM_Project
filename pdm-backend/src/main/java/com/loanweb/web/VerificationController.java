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
 * REST controller for KYC/AML verification management.
 * Handles verification creation, updates, and status checks.
 */
@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class VerificationController {

    private final AuthorizationService authorizationService;

    // Mock storage for verifications
    private static final List<Map<String, Object>> mockVerifications = Collections.synchronizedList(new ArrayList<>());
    private static final AtomicLong nextId = new AtomicLong(1);

    static {
        // Initialize with a mock verification
        mockVerifications.add(createVerification(nextId.getAndIncrement(), 1L, "VERIFIED", "VERIFIED"));
    }

    private static Map<String, Object> createVerification(Long id, Long applicationId, String kycStatus, String amlStatus) {
        Map<String, Object> verification = new HashMap<>();
        verification.put("id", id);
        verification.put("applicationId", applicationId);
        verification.put("kycStatus", kycStatus);
        verification.put("amlStatus", amlStatus);
        verification.put("kycVerifiedAt", "VERIFIED".equals(kycStatus) ? LocalDateTime.now().toString() : null);
        verification.put("amlVerifiedAt", "VERIFIED".equals(amlStatus) ? LocalDateTime.now().toString() : null);
        verification.put("notes", "");
        verification.put("verifiedBy", "VERIFIED".equals(kycStatus) ? "Staff User" : null);
        verification.put("createdAt", LocalDateTime.now().toString());
        verification.put("updatedAt", LocalDateTime.now().toString());
        return verification;
    }

    /**
     * Get verification by application ID
     */
    @GetMapping("/application/{applicationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getVerificationByApplication(@PathVariable Long applicationId) {
        log.info("Fetching verification for application: {}", applicationId);

        Optional<Map<String, Object>> verification = mockVerifications.stream()
                .filter(v -> v.get("applicationId").equals(applicationId))
                .findFirst();

        if (verification.isPresent()) {
            return ResponseEntity.ok(verification.get());
        }

        return ResponseEntity.notFound().build();
    }

    /**
     * Get verification by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getVerificationById(@PathVariable Long id) {
        log.info("Fetching verification with ID: {}", id);

        Optional<Map<String, Object>> verification = mockVerifications.stream()
                .filter(v -> v.get("id").equals(id))
                .findFirst();

        if (verification.isPresent()) {
            return ResponseEntity.ok(verification.get());
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Create a new verification record
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('VERIFIER', 'BANKER', 'UNDERWRITER', 'ADMIN')")
    public ResponseEntity<?> createVerification(@RequestBody Map<String, Object> request) {
        User currentUser = authorizationService.getCurrentUser();
        log.info("User {} creating verification", currentUser.getId());

        try {
            Long applicationId = Long.valueOf(request.get("applicationId").toString());

            Map<String, Object> newVerification = new HashMap<>();
            newVerification.put("id", nextId.getAndIncrement());
            newVerification.put("applicationId", applicationId);
            newVerification.put("kycStatus", request.getOrDefault("kycStatus", "PENDING"));
            newVerification.put("amlStatus", request.getOrDefault("amlStatus", "PENDING"));
            newVerification.put("notes", request.getOrDefault("notes", ""));
            newVerification.put("verifiedBy", currentUser.getFullName());
            newVerification.put("createdAt", LocalDateTime.now().toString());
            newVerification.put("updatedAt", LocalDateTime.now().toString());

            mockVerifications.add(newVerification);
            log.info("Verification created with ID: {}", newVerification.get("id"));

            return ResponseEntity.status(HttpStatus.CREATED).body(newVerification);
        } catch (Exception e) {
            log.error("Failed to create verification: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to create verification"));
        }
    }

    /**
     * Update verification record
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('VERIFIER', 'BANKER', 'UNDERWRITER', 'ADMIN')")
    public ResponseEntity<?> updateVerification(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        User currentUser = authorizationService.getCurrentUser();
        log.info("User {} updating verification {}", currentUser.getId(), id);

        Optional<Map<String, Object>> verificationOpt = mockVerifications.stream()
                .filter(v -> v.get("id").equals(id))
                .findFirst();

        if (verificationOpt.isPresent()) {
            Map<String, Object> verification = verificationOpt.get();

            if (request.containsKey("kycStatus")) {
                String kycStatus = (String) request.get("kycStatus");
                verification.put("kycStatus", kycStatus);
                if ("VERIFIED".equals(kycStatus)) {
                    verification.put("kycVerifiedAt", LocalDateTime.now().toString());
                }
            }

            if (request.containsKey("amlStatus")) {
                String amlStatus = (String) request.get("amlStatus");
                verification.put("amlStatus", amlStatus);
                if ("VERIFIED".equals(amlStatus)) {
                    verification.put("amlVerifiedAt", LocalDateTime.now().toString());
                }
            }

            if (request.containsKey("notes")) {
                verification.put("notes", request.get("notes"));
            }

            verification.put("verifiedBy", currentUser.getFullName());
            verification.put("updatedAt", LocalDateTime.now().toString());

            return ResponseEntity.ok(verification);
        }

        return ResponseEntity.notFound().build();
    }
}
