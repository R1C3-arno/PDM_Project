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
 * REST controller for user notifications.
 * Handles notification retrieval, marking as read, and preferences.
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class NotificationController {

    private final AuthorizationService authorizationService;

    // Mock storage for notifications
    private static final Map<Long, List<Map<String, Object>>> userNotifications = Collections.synchronizedMap(new HashMap<>());
    private static final AtomicLong nextId = new AtomicLong(1);

    static {
        // Initialize with mock notifications for user 1
        List<Map<String, Object>> user1Notifications = new ArrayList<>();
        user1Notifications.add(createNotification(nextId.getAndIncrement(), 1L, "APPLICATION_UPDATE", "Your application status has been updated", false));
        user1Notifications.add(createNotification(nextId.getAndIncrement(), 1L, "DOCUMENT_VERIFIED", "Your ID proof has been verified", true));
        user1Notifications.add(createNotification(nextId.getAndIncrement(), 1L, "OFFER_RECEIVED", "You have received a loan offer", false));
        userNotifications.put(1L, user1Notifications);
    }

    private static Map<String, Object> createNotification(Long id, Long userId, String type, String message, boolean isRead) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("id", id);
        notification.put("userId", userId);
        notification.put("type", type);
        notification.put("title", getNotificationTitle(type));
        notification.put("message", message);
        notification.put("isRead", isRead);
        notification.put("createdAt", LocalDateTime.now().minusHours(id).toString());
        notification.put("readAt", isRead ? LocalDateTime.now().toString() : null);
        return notification;
    }

    private static String getNotificationTitle(String type) {
        return switch (type) {
            case "APPLICATION_UPDATE" -> "Application Update";
            case "DOCUMENT_VERIFIED" -> "Document Verified";
            case "OFFER_RECEIVED" -> "New Offer";
            case "CONTRACT_READY" -> "Contract Ready";
            case "PAYMENT_DUE" -> "Payment Reminder";
            case "PAYMENT_RECEIVED" -> "Payment Confirmed";
            default -> "Notification";
        };
    }

    /**
     * Get all notifications for current user
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getNotifications() {
        User currentUser = authorizationService.getCurrentUser();
        log.info("Fetching notifications for user: {}", currentUser.getId());

        List<Map<String, Object>> notifications = userNotifications.getOrDefault(currentUser.getId(), new ArrayList<>());
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get unread notification count
     */
    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        User currentUser = authorizationService.getCurrentUser();

        List<Map<String, Object>> notifications = userNotifications.getOrDefault(currentUser.getId(), new ArrayList<>());
        long count = notifications.stream()
                .filter(n -> !Boolean.TRUE.equals(n.get("isRead")))
                .count();

        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * Mark notification as read
     */
    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        User currentUser = authorizationService.getCurrentUser();
        log.info("User {} marking notification {} as read", currentUser.getId(), id);

        List<Map<String, Object>> notifications = userNotifications.getOrDefault(currentUser.getId(), new ArrayList<>());

        Optional<Map<String, Object>> notificationOpt = notifications.stream()
                .filter(n -> n.get("id").equals(id))
                .findFirst();

        if (notificationOpt.isPresent()) {
            Map<String, Object> notification = notificationOpt.get();
            notification.put("isRead", true);
            notification.put("readAt", LocalDateTime.now().toString());

            return ResponseEntity.ok(notification);
        }

        return ResponseEntity.notFound().build();
    }

    /**
     * Mark all notifications as read
     */
    @PutMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markAllAsRead() {
        User currentUser = authorizationService.getCurrentUser();
        log.info("User {} marking all notifications as read", currentUser.getId());

        List<Map<String, Object>> notifications = userNotifications.getOrDefault(currentUser.getId(), new ArrayList<>());
        String now = LocalDateTime.now().toString();

        notifications.forEach(n -> {
            n.put("isRead", true);
            n.put("readAt", now);
        });

        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    /**
     * Delete a notification
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        User currentUser = authorizationService.getCurrentUser();
        log.info("User {} deleting notification {}", currentUser.getId(), id);

        List<Map<String, Object>> notifications = userNotifications.getOrDefault(currentUser.getId(), new ArrayList<>());
        boolean removed = notifications.removeIf(n -> n.get("id").equals(id));

        if (removed) {
            return ResponseEntity.ok(Map.of("message", "Notification deleted"));
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Create notification (internal use or admin)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createNotification(@RequestBody Map<String, Object> request) {
        log.info("Creating notification");

        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String type = (String) request.getOrDefault("type", "SYSTEM");
            String message = (String) request.get("message");

            Map<String, Object> notification = new HashMap<>();
            notification.put("id", nextId.getAndIncrement());
            notification.put("userId", userId);
            notification.put("type", type);
            notification.put("title", getNotificationTitle(type));
            notification.put("message", message);
            notification.put("isRead", false);
            notification.put("createdAt", LocalDateTime.now().toString());

            userNotifications.computeIfAbsent(userId, k -> new ArrayList<>()).add(notification);

            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        } catch (Exception e) {
            log.error("Failed to create notification: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to create notification"));
        }
    }
}
