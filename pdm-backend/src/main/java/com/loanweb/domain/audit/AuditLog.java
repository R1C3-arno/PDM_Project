package com.loanweb.domain.audit;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing an audit log entry for tracking system activities.
 *
 * <p>Audit logs capture critical events including:</p>
 * <ul>
 *   <li>Authentication attempts (login, logout, failed logins)</li>
 *   <li>User actions (create, update, delete operations)</li>
 *   <li>API requests and responses</li>
 *   <li>Security events (unauthorized access, permission changes)</li>
 *   <li>Data modifications (entity changes, critical updates)</li>
 * </ul>
 *
 * <p>Stored Information:</p>
 * <ul>
 *   <li>Who: User ID and email</li>
 *   <li>What: Action performed</li>
 *   <li>When: Timestamp</li>
 *   <li>Where: IP address and endpoint</li>
 *   <li>How: HTTP method and status</li>
 *   <li>Why: Additional details and context</li>
 * </ul>
 *
 * @author PDM Security Team
 * @version 1.0
 * @since 2025-11-30
 */
@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_user_id", columnList = "user_id"),
    @Index(name = "idx_audit_action", columnList = "action"),
    @Index(name = "idx_audit_timestamp", columnList = "timestamp"),
    @Index(name = "idx_audit_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * User ID who performed the action (null for anonymous/system actions)
     */
    @Column(name = "user_id")
    private Long userId;

    /**
     * User email for quick reference (denormalized for audit purposes)
     */
    @Column(name = "user_email", length = 255)
    private String userEmail;

    /**
     * Action performed (e.g., LOGIN, LOGOUT, CREATE_USER, UPDATE_PROFILE)
     */
    @Column(nullable = false, length = 100)
    private String action;

    /**
     * Resource/entity affected (e.g., USER, MESSAGE, LOAN)
     */
    @Column(name = "resource_type", length = 100)
    private String resourceType;

    /**
     * Resource ID (if applicable)
     */
    @Column(name = "resource_id")
    private String resourceId;

    /**
     * HTTP method used (GET, POST, PUT, DELETE, etc.)
     */
    @Column(name = "http_method", length = 10)
    private String httpMethod;

    /**
     * Request endpoint/path
     */
    @Column(name = "endpoint", length = 500)
    private String endpoint;

    /**
     * Client IP address
     */
    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    /**
     * User agent (browser/client information)
     */
    @Column(name = "user_agent", length = 500)
    private String userAgent;

    /**
     * HTTP status code (200, 401, 403, 500, etc.)
     */
    @Column(name = "status")
    private Integer status;

    /**
     * Success indicator
     */
    @Column(name = "success", nullable = false)
    private Boolean success = true;

    /**
     * Error message (if action failed)
     */
    @Column(name = "error_message", length = 1000)
    private String errorMessage;

    /**
     * Additional details in JSON format (flexible for different event types)
     */
    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    /**
     * Timestamp when the action occurred
     */
    @CreationTimestamp
    @Column(name = "timestamp", nullable = false, updatable = false)
    private LocalDateTime timestamp;

    /**
     * Session ID (if applicable)
     */
    @Column(name = "session_id", length = 255)
    private String sessionId;

    /**
     * Creates a builder with common success fields pre-set
     */
    public static AuditLogBuilder successBuilder() {
        return AuditLog.builder().success(true);
    }

    /**
     * Creates a builder with common failure fields pre-set
     */
    public static AuditLogBuilder failureBuilder() {
        return AuditLog.builder().success(false);
    }
}
