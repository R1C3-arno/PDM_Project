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
 * REST controller for risk assessment management.
 * Handles risk assessment creation, updates, and retrieval.
 */
@RestController
@RequestMapping("/api/risk")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class RiskController {

    private final AuthorizationService authorizationService;

    // Mock storage for risk assessments
    private static final List<Map<String, Object>> mockAssessments = Collections.synchronizedList(new ArrayList<>());
    private static final AtomicLong nextId = new AtomicLong(1);

    static {
        // Initialize with a mock assessment
        mockAssessments.add(createAssessment(nextId.getAndIncrement(), 1L, 32.5, 75.0, 720, "LOW"));
    }

    private static Map<String, Object> createAssessment(Long id, Long applicationId, Double dti, Double ltv, Integer creditScore, String riskCategory) {
        Map<String, Object> assessment = new HashMap<>();
        assessment.put("id", id);
        assessment.put("applicationId", applicationId);
        assessment.put("dti", dti);
        assessment.put("ltv", ltv);
        assessment.put("creditScore", creditScore);
        assessment.put("riskCategory", riskCategory);
        assessment.put("riskScore", calculateRiskScore(dti, ltv, creditScore));
        assessment.put("notes", "");
        assessment.put("assessedBy", "Staff User");
        assessment.put("createdAt", LocalDateTime.now().toString());
        assessment.put("updatedAt", LocalDateTime.now().toString());
        return assessment;
    }

    private static int calculateRiskScore(Double dti, Double ltv, Integer creditScore) {
        // Simple risk score calculation (0-100, lower is better)
        int score = 0;

        // DTI contribution (0-30)
        if (dti > 50) score += 30;
        else if (dti > 43) score += 20;
        else if (dti > 36) score += 10;

        // LTV contribution (0-30)
        if (ltv > 95) score += 30;
        else if (ltv > 90) score += 20;
        else if (ltv > 80) score += 10;

        // Credit score contribution (0-40)
        if (creditScore < 580) score += 40;
        else if (creditScore < 670) score += 25;
        else if (creditScore < 740) score += 10;

        return score;
    }

    /**
     * Get risk assessment by application ID
     */
    @GetMapping("/application/{applicationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAssessmentByApplication(@PathVariable Long applicationId) {
        log.info("Fetching risk assessment for application: {}", applicationId);

        Optional<Map<String, Object>> assessment = mockAssessments.stream()
                .filter(a -> a.get("applicationId").equals(applicationId))
                .findFirst();

        if (assessment.isPresent()) {
            return ResponseEntity.ok(assessment.get());
        }

        return ResponseEntity.notFound().build();
    }

    /**
     * Get risk assessment by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAssessmentById(@PathVariable Long id) {
        log.info("Fetching risk assessment with ID: {}", id);

        Optional<Map<String, Object>> assessment = mockAssessments.stream()
                .filter(a -> a.get("id").equals(id))
                .findFirst();

        if (assessment.isPresent()) {
            return ResponseEntity.ok(assessment.get());
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Create a new risk assessment
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('UNDERWRITER', 'BANKER', 'ADMIN')")
    public ResponseEntity<?> createAssessment(@RequestBody Map<String, Object> request) {
        User currentUser = authorizationService.getCurrentUser();
        log.info("User {} creating risk assessment", currentUser.getId());

        try {
            Long applicationId = Long.valueOf(request.get("applicationId").toString());
            Double dti = Double.valueOf(request.get("dti").toString());
            Double ltv = Double.valueOf(request.get("ltv").toString());
            Integer creditScore = Integer.valueOf(request.get("creditScore").toString());
            String riskCategory = (String) request.getOrDefault("riskCategory", "MEDIUM");

            Map<String, Object> newAssessment = new HashMap<>();
            newAssessment.put("id", nextId.getAndIncrement());
            newAssessment.put("applicationId", applicationId);
            newAssessment.put("dti", dti);
            newAssessment.put("ltv", ltv);
            newAssessment.put("creditScore", creditScore);
            newAssessment.put("riskCategory", riskCategory);
            newAssessment.put("riskScore", calculateRiskScore(dti, ltv, creditScore));
            newAssessment.put("notes", request.getOrDefault("notes", ""));
            newAssessment.put("assessedBy", currentUser.getFullName());
            newAssessment.put("createdAt", LocalDateTime.now().toString());
            newAssessment.put("updatedAt", LocalDateTime.now().toString());

            mockAssessments.add(newAssessment);
            log.info("Risk assessment created with ID: {}", newAssessment.get("id"));

            return ResponseEntity.status(HttpStatus.CREATED).body(newAssessment);
        } catch (Exception e) {
            log.error("Failed to create risk assessment: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to create risk assessment"));
        }
    }

    /**
     * Update risk assessment
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('UNDERWRITER', 'BANKER', 'ADMIN')")
    public ResponseEntity<?> updateAssessment(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        User currentUser = authorizationService.getCurrentUser();
        log.info("User {} updating risk assessment {}", currentUser.getId(), id);

        Optional<Map<String, Object>> assessmentOpt = mockAssessments.stream()
                .filter(a -> a.get("id").equals(id))
                .findFirst();

        if (assessmentOpt.isPresent()) {
            Map<String, Object> assessment = assessmentOpt.get();

            if (request.containsKey("dti")) {
                assessment.put("dti", Double.valueOf(request.get("dti").toString()));
            }
            if (request.containsKey("ltv")) {
                assessment.put("ltv", Double.valueOf(request.get("ltv").toString()));
            }
            if (request.containsKey("creditScore")) {
                assessment.put("creditScore", Integer.valueOf(request.get("creditScore").toString()));
            }
            if (request.containsKey("riskCategory")) {
                assessment.put("riskCategory", request.get("riskCategory"));
            }
            if (request.containsKey("notes")) {
                assessment.put("notes", request.get("notes"));
            }

            // Recalculate risk score
            Double dti = (Double) assessment.get("dti");
            Double ltv = (Double) assessment.get("ltv");
            Integer creditScore = (Integer) assessment.get("creditScore");
            assessment.put("riskScore", calculateRiskScore(dti, ltv, creditScore));

            assessment.put("assessedBy", currentUser.getFullName());
            assessment.put("updatedAt", LocalDateTime.now().toString());

            return ResponseEntity.ok(assessment);
        }

        return ResponseEntity.notFound().build();
    }
}
