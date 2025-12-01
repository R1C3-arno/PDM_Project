package com.loanweb.domain.audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for accessing audit log entries.
 *
 * <p>Provides methods for:</p>
 * <ul>
 *   <li>Querying logs by user, action, resource type</li>
 *   <li>Finding logs within time ranges</li>
 *   <li>Searching for failed actions</li>
 *   <li>Retrieving recent activity</li>
 * </ul>
 *
 * @author PDM Security Team
 * @version 1.0
 * @since 2025-11-30
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    /**
     * Find all audit logs for a specific user
     */
    Page<AuditLog> findByUserIdOrderByTimestampDesc(Long userId, Pageable pageable);

    /**
     * Find all audit logs by action type
     */
    Page<AuditLog> findByActionOrderByTimestampDesc(String action, Pageable pageable);

    /**
     * Find all failed actions
     */
    Page<AuditLog> findBySuccessFalseOrderByTimestampDesc(Pageable pageable);

    /**
     * Find audit logs within a time range
     */
    Page<AuditLog> findByTimestampBetweenOrderByTimestampDesc(
            LocalDateTime start,
            LocalDateTime end,
            Pageable pageable
    );

    /**
     * Find audit logs for a specific user within a time range
     */
    Page<AuditLog> findByUserIdAndTimestampBetweenOrderByTimestampDesc(
            Long userId,
            LocalDateTime start,
            LocalDateTime end,
            Pageable pageable
    );

    /**
     * Find audit logs by resource type
     */
    Page<AuditLog> findByResourceTypeOrderByTimestampDesc(String resourceType, Pageable pageable);

    /**
     * Find audit logs by resource type and resource ID
     */
    List<AuditLog> findByResourceTypeAndResourceIdOrderByTimestampDesc(
            String resourceType,
            String resourceId
    );

    /**
     * Find recent login attempts for a user (successful and failed)
     */
    @Query("SELECT a FROM AuditLog a WHERE a.userEmail = :email " +
           "AND a.action IN ('LOGIN_SUCCESS', 'LOGIN_FAILED') " +
           "ORDER BY a.timestamp DESC")
    List<AuditLog> findRecentLoginAttempts(@Param("email") String email, Pageable pageable);

    /**
     * Count failed login attempts for a user within a time window
     */
    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.userEmail = :email " +
           "AND a.action = 'LOGIN_FAILED' " +
           "AND a.timestamp >= :since")
    long countFailedLoginAttempts(
            @Param("email") String email,
            @Param("since") LocalDateTime since
    );

    /**
     * Find all audit logs by IP address (useful for security investigations)
     */
    Page<AuditLog> findByIpAddressOrderByTimestampDesc(String ipAddress, Pageable pageable);

    /**
     * Find recent activity across the system
     */
    @Query("SELECT a FROM AuditLog a ORDER BY a.timestamp DESC")
    Page<AuditLog> findRecentActivity(Pageable pageable);

    /**
     * Search audit logs by multiple criteria
     */
    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:userId IS NULL OR a.userId = :userId) AND " +
           "(:action IS NULL OR a.action = :action) AND " +
           "(:resourceType IS NULL OR a.resourceType = :resourceType) AND " +
           "(:success IS NULL OR a.success = :success) AND " +
           "(:startDate IS NULL OR a.timestamp >= :startDate) AND " +
           "(:endDate IS NULL OR a.timestamp <= :endDate) " +
           "ORDER BY a.timestamp DESC")
    Page<AuditLog> searchLogs(
            @Param("userId") Long userId,
            @Param("action") String action,
            @Param("resourceType") String resourceType,
            @Param("success") Boolean success,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );
}
