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
 * REST controller for loan application endpoints.
 * Currently returns mock data - full implementation pending.
 */
@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class ApplicationController {

    private static final Logger logger = LoggerFactory.getLogger(ApplicationController.class);

    // In-memory mock data store
    private static final List<Map<String, Object>> mockApplications = new ArrayList<>();
    private static long nextId = 1;

    static {
        // Initialize with some mock applications
        mockApplications.add(createMockApplication(nextId++, 1L, 5000.0, 12, "Home Improvement", "SUBMITTED", "Personal Loan"));
        mockApplications.add(createMockApplication(nextId++, 1L, 25000.0, 24, "Business Expansion", "UNDER_REVIEW", "Business Loan"));
        mockApplications.add(createMockApplication(nextId++, 1L, 10000.0, 18, "Education", "APPROVED", "Education Loan"));
    }

    private static Map<String, Object> createMockApplication(long id, long userId, double amount, int term, String purpose, String status, String productName) {
        Map<String, Object> app = new HashMap<>();
        app.put("id", id);
        app.put("userId", userId);
        app.put("requestedAmount", amount);
        app.put("requestedTermMonths", term);
        app.put("purpose", purpose);
        app.put("status", status);
        app.put("productName", productName);
        app.put("productId", 1);
        app.put("createdAt", LocalDateTime.now().minusDays((int)(Math.random() * 30)).toString());
        app.put("updatedAt", LocalDateTime.now().toString());
        return app;
    }

    /**
     * Get all applications (filtered by user role)
     */
    @GetMapping
    public ResponseEntity<?> getAllApplications() {
        logger.info("Fetching all applications");
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth != null ? auth.getName() : null;
            logger.debug("User {} fetching applications", email);

            // Return all mock applications
            return ResponseEntity.ok(mockApplications);
        } catch (Exception e) {
            logger.error("Error fetching applications: {}", e.getMessage(), e);
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    /**
     * Get application by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable Long id) {
        logger.info("Fetching application with ID: {}", id);
        try {
            Optional<Map<String, Object>> app = mockApplications.stream()
                    .filter(a -> a.get("id").equals(id))
                    .findFirst();

            if (app.isPresent()) {
                return ResponseEntity.ok(app.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error fetching application {}: {}", id, e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Create new application
     */
    @PostMapping
    public ResponseEntity<?> createApplication(@RequestBody Map<String, Object> request) {
        logger.info("Creating new application");
        try {
            Map<String, Object> newApp = new HashMap<>();
            newApp.put("id", nextId++);
            newApp.put("userId", 1L);
            newApp.put("productId", request.get("productId"));
            newApp.put("requestedAmount", request.get("requestedAmount"));
            newApp.put("requestedTermMonths", request.get("requestedTermMonths"));
            newApp.put("purpose", request.get("purpose"));
            newApp.put("status", "SUBMITTED");
            newApp.put("productName", "Personal Loan");
            newApp.put("createdAt", LocalDateTime.now().toString());
            newApp.put("updatedAt", LocalDateTime.now().toString());

            mockApplications.add(newApp);
            logger.info("Application created with ID: {}", newApp.get("id"));

            return ResponseEntity.ok(newApp);
        } catch (Exception e) {
            logger.error("Error creating application: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to create application"));
        }
    }

    /**
     * Update application status (staff only)
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateApplication(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        logger.info("Updating application with ID: {}", id);
        try {
            Optional<Map<String, Object>> appOpt = mockApplications.stream()
                    .filter(a -> a.get("id").equals(id))
                    .findFirst();

            if (appOpt.isPresent()) {
                Map<String, Object> app = appOpt.get();
                if (updates.containsKey("status")) {
                    app.put("status", updates.get("status"));
                }
                app.put("updatedAt", LocalDateTime.now().toString());
                return ResponseEntity.ok(app);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating application {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to update application"));
        }
    }
}
