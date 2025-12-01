package com.loanweb.web;

import com.loanweb.domain.audit.AuditLog;
import com.loanweb.service.AuditService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * REST controller for accessing audit logs.
 *
 * <p>Security:</p>
 * All endpoints require ADMIN role for access.
 *
 * <p>Endpoints:</p>
 * <ul>
 *   <li>GET /api/audit - Get all audit logs (paginated)</li>
 *   <li>GET /api/audit/user/{userId} - Get audit logs for specific user</li>
 *   <li>GET /api/audit/failed - Get failed actions</li>
 *   <li>GET /api/audit/search - Search audit logs with filters</li>
 *   <li>GET /api/audit/recent - Get recent system activity</li>
 *   <li>GET /api/audit/login-attempts/{email} - Get login attempts for user</li>
 *   <li>GET /api/audit/resource/{type}/{id} - Get history for specific resource</li>
 * </ul>
 *
 * @author PDM Security Team
 * @version 1.0
 * @since 2025-11-30
 */
@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class AuditController {

    private static final Logger logger = LoggerFactory.getLogger(AuditController.class);

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    /**
     * Get all audit logs (paginated)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AuditLog>> getAllAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        logger.debug("Fetching all audit logs: page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> auditLogs = auditService.getRecentActivity(pageable);
        return ResponseEntity.ok(auditLogs);
    }

    /**
     * Get audit logs for a specific user
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<Page<AuditLog>> getUserAuditLogs(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        logger.debug("Fetching audit logs for user: userId={}", userId);
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> auditLogs = auditService.getUserAuditLogs(userId, pageable);
        return ResponseEntity.ok(auditLogs);
    }

    /**
     * Get all failed actions
     */
    @GetMapping("/failed")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AuditLog>> getFailedActions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        logger.debug("Fetching failed actions: page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> auditLogs = auditService.getFailedActions(pageable);
        return ResponseEntity.ok(auditLogs);
    }

    /**
     * Search audit logs with multiple filters
     */
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AuditLog>> searchAuditLogs(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String resourceType,
            @RequestParam(required = false) Boolean success,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        logger.debug("Searching audit logs with filters: userId={}, action={}, resourceType={}, success={}, startDate={}, endDate={}",
                userId, action, resourceType, success, startDate, endDate);

        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> auditLogs = auditService.searchAuditLogs(
                userId, action, resourceType, success, startDate, endDate, pageable);
        return ResponseEntity.ok(auditLogs);
    }

    /**
     * Get recent system activity
     */
    @GetMapping("/recent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AuditLog>> getRecentActivity(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        logger.debug("Fetching recent system activity: page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> auditLogs = auditService.getRecentActivity(pageable);
        return ResponseEntity.ok(auditLogs);
    }

    /**
     * Get login attempts for a specific user
     */
    @GetMapping("/login-attempts/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getLoginAttempts(
            @PathVariable String email,
            @RequestParam(defaultValue = "10") int limit) {

        logger.debug("Fetching login attempts for email: {}", email);
        List<AuditLog> loginAttempts = auditService.getRecentLoginAttempts(email, limit);
        return ResponseEntity.ok(loginAttempts);
    }

    /**
     * Get audit history for a specific resource
     */
    @GetMapping("/resource/{type}/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getResourceHistory(
            @PathVariable String type,
            @PathVariable String id) {

        logger.debug("Fetching resource history: type={}, id={}", type, id);
        List<AuditLog> auditLogs = auditService.getResourceHistory(type.toUpperCase(), id);
        return ResponseEntity.ok(auditLogs);
    }

    /**
     * Get audit logs within a date range
     */
    @GetMapping("/range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AuditLog>> getAuditLogsInRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        logger.debug("Fetching audit logs in range: start={}, end={}", start, end);
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> auditLogs = auditService.getAuditLogsInRange(start, end, pageable);
        return ResponseEntity.ok(auditLogs);
    }

    /**
     * Count failed login attempts for a user within a time window
     */
    @GetMapping("/failed-login-count/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> countFailedLoginAttempts(
            @PathVariable String email,
            @RequestParam(required = false) Integer hoursAgo) {

        LocalDateTime since = hoursAgo != null ?
                LocalDateTime.now().minusHours(hoursAgo) :
                LocalDateTime.now().minusHours(24); // Default: last 24 hours

        logger.debug("Counting failed login attempts for {}: since={}", email, since);
        long count = auditService.countFailedLoginAttempts(email, since);
        return ResponseEntity.ok(count);
    }
}
