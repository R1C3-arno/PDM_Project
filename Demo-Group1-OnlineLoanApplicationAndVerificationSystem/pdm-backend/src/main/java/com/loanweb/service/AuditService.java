package com.loanweb.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loanweb.domain.audit.AuditLog;
import com.loanweb.domain.audit.AuditLogRepository;
import com.loanweb.domain.user.User;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for managing audit logs throughout the application.
 *
 * <p>Responsibilities:</p>
 * <ul>
 *   <li>Recording audit events asynchronously</li>
 *   <li>Extracting request metadata (IP, user agent, etc.)</li>
 *   <li>Associating actions with authenticated users</li>
 *   <li>Querying audit log history</li>
 *   <li>Providing audit analytics</li>
 * </ul>
 *
 * <p>Usage:</p>
 * <pre>
 * // Log successful action
 * auditService.logSuccess("USER_CREATED", "USER", userId.toString(), details);
 *
 * // Log failed action
 * auditService.logFailure("LOGIN_FAILED", email, "Invalid credentials");
 *
 * // Log with custom request
 * auditService.logAction(request, "DATA_EXPORT", true, details);
 * </pre>
 *
 * @author PDM Security Team
 * @version 1.0
 * @since 2025-11-30
 */
@Service
@Transactional
public class AuditService {

    private static final Logger logger = LoggerFactory.getLogger(AuditService.class);

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;
    private final UserService userService;

    public AuditService(
            AuditLogRepository auditLogRepository,
            ObjectMapper objectMapper,
            UserService userService) {
        this.auditLogRepository = auditLogRepository;
        this.objectMapper = objectMapper;
        this.userService = userService;
    }

    /**
     * Log a successful action with automatic request context extraction
     */
    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logSuccess(String action, String resourceType, String resourceId, Map<String, Object> details) {
        try {
            HttpServletRequest request = getCurrentRequest();
            AuditLog auditLog = buildAuditLog(request, action, resourceType, resourceId, true, null, details);
            auditLogRepository.save(auditLog);
            logger.debug("Audit log created: action={}, resource={}:{}", action, resourceType, resourceId);
        } catch (Exception e) {
            logger.error("Failed to create audit log for action {}: {}", action, e.getMessage(), e);
        }
    }

    /**
     * Log a successful action with minimal information
     */
    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logSuccess(String action) {
        logSuccess(action, null, null, null);
    }

    /**
     * Log a failed action with error message
     */
    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logFailure(String action, String resourceType, String resourceId, String errorMessage) {
        try {
            HttpServletRequest request = getCurrentRequest();
            AuditLog auditLog = buildAuditLog(request, action, resourceType, resourceId, false, errorMessage, null);
            auditLogRepository.save(auditLog);
            logger.debug("Audit log created for failure: action={}, error={}", action, errorMessage);
        } catch (Exception e) {
            logger.error("Failed to create audit log for failed action {}: {}", action, e.getMessage(), e);
        }
    }

    /**
     * Log a failed action with minimal information
     */
    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logFailure(String action, String errorMessage) {
        logFailure(action, null, null, errorMessage);
    }

    /**
     * Log an authentication event (login/logout)
     */
    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAuthEvent(HttpServletRequest request, String action, String email, boolean success, String errorMessage) {
        try {
            AuditLog.AuditLogBuilder builder = success ?
                AuditLog.successBuilder() : AuditLog.failureBuilder();

            AuditLog auditLog = builder
                    .action(action)
                    .userEmail(email)
                    .resourceType("AUTH")
                    .httpMethod(request.getMethod())
                    .endpoint(request.getRequestURI())
                    .ipAddress(getClientIp(request))
                    .userAgent(request.getHeader("User-Agent"))
                    .status(success ? 200 : 401)
                    .success(success)
                    .errorMessage(errorMessage)
                    .build();

            auditLogRepository.save(auditLog);
            logger.info("Auth event logged: action={}, email={}, success={}", action, email, success);
        } catch (Exception e) {
            logger.error("Failed to log auth event for {}: {}", email, e.getMessage(), e);
        }
    }

    /**
     * Log a custom action with full control
     */
    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logCustomAction(
            Long userId,
            String userEmail,
            String action,
            String resourceType,
            String resourceId,
            String httpMethod,
            String endpoint,
            Integer status,
            boolean success,
            String errorMessage,
            Map<String, Object> details) {
        try {
            HttpServletRequest request = getCurrentRequest();
            String ipAddress = request != null ? getClientIp(request) : null;
            String userAgent = request != null ? request.getHeader("User-Agent") : null;

            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .userEmail(userEmail)
                    .action(action)
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .httpMethod(httpMethod)
                    .endpoint(endpoint)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .status(status)
                    .success(success)
                    .errorMessage(errorMessage)
                    .details(serializeDetails(details))
                    .build();

            auditLogRepository.save(auditLog);
            logger.debug("Custom audit log created: action={}, userId={}", action, userId);
        } catch (Exception e) {
            logger.error("Failed to create custom audit log: {}", e.getMessage(), e);
        }
    }

    /**
     * Query audit logs for a specific user
     */
    public Page<AuditLog> getUserAuditLogs(Long userId, Pageable pageable) {
        return auditLogRepository.findByUserIdOrderByTimestampDesc(userId, pageable);
    }

    /**
     * Query failed actions
     */
    public Page<AuditLog> getFailedActions(Pageable pageable) {
        return auditLogRepository.findBySuccessFalseOrderByTimestampDesc(pageable);
    }

    /**
     * Query audit logs within a time range
     */
    public Page<AuditLog> getAuditLogsInRange(LocalDateTime start, LocalDateTime end, Pageable pageable) {
        return auditLogRepository.findByTimestampBetweenOrderByTimestampDesc(start, end, pageable);
    }

    /**
     * Get recent login attempts for a user
     */
    public List<AuditLog> getRecentLoginAttempts(String email, int limit) {
        return auditLogRepository.findRecentLoginAttempts(email, Pageable.ofSize(limit));
    }

    /**
     * Count failed login attempts within a time window
     */
    public long countFailedLoginAttempts(String email, LocalDateTime since) {
        return auditLogRepository.countFailedLoginAttempts(email, since);
    }

    /**
     * Search audit logs with multiple criteria
     */
    public Page<AuditLog> searchAuditLogs(
            Long userId,
            String action,
            String resourceType,
            Boolean success,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable) {
        return auditLogRepository.searchLogs(userId, action, resourceType, success, startDate, endDate, pageable);
    }

    /**
     * Get recent system activity
     */
    public Page<AuditLog> getRecentActivity(Pageable pageable) {
        return auditLogRepository.findRecentActivity(pageable);
    }

    /**
     * Get audit logs by resource
     */
    public List<AuditLog> getResourceHistory(String resourceType, String resourceId) {
        return auditLogRepository.findByResourceTypeAndResourceIdOrderByTimestampDesc(resourceType, resourceId);
    }

    // === Helper Methods ===

    /**
     * Build an audit log from request context
     */
    private AuditLog buildAuditLog(
            HttpServletRequest request,
            String action,
            String resourceType,
            String resourceId,
            boolean success,
            String errorMessage,
            Map<String, Object> details) {

        // Get current user from security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = null;
        String userEmail = null;

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            userEmail = auth.getName();
            try {
                User user = userService.findByEmail(userEmail);
                userId = user.getId();
            } catch (Exception e) {
                logger.warn("Could not find user for email {}: {}", userEmail, e.getMessage());
            }
        }

        // Build audit log
        AuditLog.AuditLogBuilder builder = success ?
            AuditLog.successBuilder() : AuditLog.failureBuilder();

        return builder
                .userId(userId)
                .userEmail(userEmail)
                .action(action)
                .resourceType(resourceType)
                .resourceId(resourceId)
                .httpMethod(request != null ? request.getMethod() : null)
                .endpoint(request != null ? request.getRequestURI() : null)
                .ipAddress(request != null ? getClientIp(request) : null)
                .userAgent(request != null ? request.getHeader("User-Agent") : null)
                .status(success ? 200 : 500)
                .success(success)
                .errorMessage(errorMessage)
                .details(serializeDetails(details))
                .build();
    }

    /**
     * Get client IP address, checking for proxy headers
     */
    private String getClientIp(HttpServletRequest request) {
        String[] headerCandidates = {
            "X-Forwarded-For",
            "Proxy-Client-IP",
            "WL-Proxy-Client-IP",
            "HTTP_X_FORWARDED_FOR",
            "HTTP_X_FORWARDED",
            "HTTP_X_CLUSTER_CLIENT_IP",
            "HTTP_CLIENT_IP",
            "HTTP_FORWARDED_FOR",
            "HTTP_FORWARDED",
            "HTTP_VIA",
            "REMOTE_ADDR"
        };

        for (String header : headerCandidates) {
            String ip = request.getHeader(header);
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                // X-Forwarded-For can contain multiple IPs, take the first one
                return ip.split(",")[0].trim();
            }
        }

        return request.getRemoteAddr();
    }

    /**
     * Get current HTTP request from context
     */
    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attributes =
            (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attributes != null ? attributes.getRequest() : null;
    }

    /**
     * Serialize details map to JSON string
     */
    private String serializeDetails(Map<String, Object> details) {
        if (details == null || details.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(details);
        } catch (JsonProcessingException e) {
            logger.warn("Failed to serialize audit details: {}", e.getMessage());
            return details.toString();
        }
    }
}
