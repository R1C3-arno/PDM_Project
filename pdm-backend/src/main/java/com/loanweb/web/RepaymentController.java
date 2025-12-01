package com.loanweb.web;

import com.loanweb.domain.repayment.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * REST controller for repayment management endpoints.
 */
@RestController
@RequestMapping("/api/repayment")
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class RepaymentController {

    private static final Logger logger = LoggerFactory.getLogger(RepaymentController.class);

    private final RepaymentScheduleRepository scheduleRepository;
    private final RepaymentInstallmentRepository installmentRepository;

    public RepaymentController(RepaymentScheduleRepository scheduleRepository,
                               RepaymentInstallmentRepository installmentRepository) {
        this.scheduleRepository = scheduleRepository;
        this.installmentRepository = installmentRepository;
    }

    /**
     * Get all repayment schedules (staff only).
     */
    @GetMapping("/schedules")
    @PreAuthorize("hasAnyRole('BANKER', 'VERIFIER', 'UNDERWRITER', 'ADMIN')")
    public ResponseEntity<?> getAllSchedules() {
        logger.info("Fetching all repayment schedules");
        try {
            List<RepaymentSchedule> schedules = scheduleRepository.findAll();
            List<Map<String, Object>> result = schedules.stream()
                    .map(this::scheduleToMap)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error fetching schedules: {}", e.getMessage(), e);
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    /**
     * Get schedule by ID.
     */
    @GetMapping("/schedules/{id}")
    @PreAuthorize("hasAnyRole('APPLICANT', 'BANKER', 'VERIFIER', 'UNDERWRITER', 'ADMIN')")
    public ResponseEntity<?> getScheduleById(@PathVariable Long id) {
        logger.info("Fetching schedule with ID: {}", id);
        try {
            Optional<RepaymentSchedule> schedule = scheduleRepository.findById(id);
            if (schedule.isPresent()) {
                return ResponseEntity.ok(scheduleToMap(schedule.get()));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error fetching schedule {}: {}", id, e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get all overdue installments (staff only).
     */
    @GetMapping("/overdue")
    @PreAuthorize("hasAnyRole('BANKER', 'VERIFIER', 'UNDERWRITER', 'ADMIN')")
    public ResponseEntity<?> getOverdueInstallments() {
        logger.info("Fetching overdue installments");
        try {
            List<RepaymentInstallment> overdue = installmentRepository.findAllOverdue();
            List<Map<String, Object>> result = overdue.stream()
                    .map(this::installmentToMap)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error fetching overdue installments: {}", e.getMessage(), e);
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    /**
     * Get installments for a schedule.
     */
    @GetMapping("/schedules/{scheduleId}/installments")
    @PreAuthorize("hasAnyRole('APPLICANT', 'BANKER', 'VERIFIER', 'UNDERWRITER', 'ADMIN')")
    public ResponseEntity<?> getInstallments(@PathVariable Long scheduleId) {
        logger.info("Fetching installments for schedule: {}", scheduleId);
        try {
            List<RepaymentInstallment> installments = installmentRepository
                    .findByScheduleIdOrderByInstallmentNumber(scheduleId);
            List<Map<String, Object>> result = installments.stream()
                    .map(this::installmentToMap)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error fetching installments: {}", e.getMessage(), e);
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    /**
     * Record a payment for an installment.
     */
    @PostMapping("/installments/{id}/pay")
    @PreAuthorize("hasAnyRole('BANKER', 'ADMIN')")
    public ResponseEntity<?> recordPayment(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        logger.info("Recording payment for installment: {}", id);
        try {
            Optional<RepaymentInstallment> optInstallment = installmentRepository.findById(id);
            if (optInstallment.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            RepaymentInstallment installment = optInstallment.get();
            BigDecimal amount = new BigDecimal(request.get("amount").toString());

            installment.setAmountPaid(installment.getAmountPaid().add(amount));
            installment.setPaidDate(LocalDate.now());

            // Check if fully paid
            if (installment.getAmountPaid().compareTo(installment.getTotalAmount()) >= 0) {
                installment.setStatus(InstallmentStatus.PAID);
            } else {
                installment.setStatus(InstallmentStatus.PARTIALLY_PAID);
            }

            installmentRepository.save(installment);

            // Update schedule total
            RepaymentSchedule schedule = installment.getSchedule();
            schedule.setTotalAmountPaid(schedule.getTotalAmountPaid().add(amount));

            // Check if all installments are paid
            boolean allPaid = schedule.getInstallments().stream()
                    .allMatch(i -> i.getStatus() == InstallmentStatus.PAID);
            if (allPaid) {
                schedule.setStatus(RepaymentStatus.COMPLETED);
            }

            scheduleRepository.save(schedule);

            logger.info("Payment of {} recorded for installment {}", amount, id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Payment recorded successfully",
                    "installment", installmentToMap(installment)
            ));
        } catch (Exception e) {
            logger.error("Error recording payment: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Payment failed"));
        }
    }

    /**
     * Get repayment statistics.
     */
    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('BANKER', 'VERIFIER', 'UNDERWRITER', 'ADMIN')")
    public ResponseEntity<?> getStats() {
        logger.info("Fetching repayment statistics");
        try {
            long totalActive = scheduleRepository.countByStatus(RepaymentStatus.ACTIVE);
            long totalCompleted = scheduleRepository.countByStatus(RepaymentStatus.COMPLETED);
            long totalOverdue = installmentRepository.countOverdue();

            List<RepaymentSchedule> allSchedules = scheduleRepository.findAll();
            BigDecimal totalCollected = allSchedules.stream()
                    .map(s -> s.getTotalAmountPaid() != null ? s.getTotalAmountPaid() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalExpected = allSchedules.stream()
                    .map(RepaymentSchedule::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            double collectionRate = totalExpected.compareTo(BigDecimal.ZERO) > 0
                    ? totalCollected.divide(totalExpected, 4, BigDecimal.ROUND_HALF_UP).multiply(new BigDecimal(100)).doubleValue()
                    : 0.0;

            return ResponseEntity.ok(Map.of(
                    "totalActive", totalActive,
                    "totalCompleted", totalCompleted,
                    "totalOverdue", totalOverdue,
                    "totalCollected", totalCollected,
                    "totalExpected", totalExpected,
                    "collectionRate", String.format("%.1f%%", collectionRate)
            ));
        } catch (Exception e) {
            logger.error("Error fetching stats: {}", e.getMessage(), e);
            return ResponseEntity.ok(Map.of(
                    "totalActive", 0,
                    "totalCompleted", 0,
                    "totalOverdue", 0,
                    "totalCollected", 0,
                    "collectionRate", "0%"
            ));
        }
    }

    /**
     * Get current user's repayment schedules.
     */
    @GetMapping("/my-schedules")
    public ResponseEntity<?> getMySchedules() {
        logger.info("Fetching schedules for current user");
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth != null ? auth.getName() : null;

            if (email == null) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            List<RepaymentSchedule> schedules = scheduleRepository.findByBorrowerEmail(email);
            List<Map<String, Object>> result = schedules.stream()
                    .map(this::scheduleToMap)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error fetching user schedules: {}", e.getMessage(), e);
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    // Helper methods
    private Map<String, Object> scheduleToMap(RepaymentSchedule schedule) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", schedule.getId());
        map.put("applicationId", schedule.getApplicationId());
        map.put("borrowerName", schedule.getBorrowerName());
        map.put("totalAmount", schedule.getTotalAmount());
        map.put("totalAmountPaid", schedule.getTotalAmountPaid());
        map.put("remainingBalance", schedule.getRemainingBalance());
        map.put("interestRate", schedule.getInterestRate());
        map.put("termMonths", schedule.getTermMonths());
        map.put("monthlyPayment", schedule.getMonthlyPayment());
        map.put("status", schedule.getStatus().name());
        map.put("startDate", schedule.getStartDate() != null ? schedule.getStartDate().toString() : null);
        map.put("endDate", schedule.getEndDate() != null ? schedule.getEndDate().toString() : null);
        map.put("createdAt", schedule.getCreatedAt() != null ? schedule.getCreatedAt().toString() : null);
        return map;
    }

    private Map<String, Object> installmentToMap(RepaymentInstallment installment) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", installment.getId());
        map.put("scheduleId", installment.getSchedule() != null ? installment.getSchedule().getId() : null);
        map.put("applicationId", installment.getApplicationId());
        map.put("borrowerName", installment.getBorrowerName());
        map.put("installmentNumber", installment.getInstallmentNumber());
        map.put("principalAmount", installment.getPrincipalAmount());
        map.put("interestAmount", installment.getInterestAmount());
        map.put("totalAmount", installment.getTotalAmount());
        map.put("amountPaid", installment.getAmountPaid());
        map.put("dueDate", installment.getDueDate() != null ? installment.getDueDate().toString() : null);
        map.put("paidDate", installment.getPaidDate() != null ? installment.getPaidDate().toString() : null);
        map.put("status", installment.getStatus().name());
        map.put("daysOverdue", installment.getDaysOverdue());
        return map;
    }
}
