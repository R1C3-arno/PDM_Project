package com.loanweb.app.domain.notification;

import java.time.LocalDateTime;

public record Notification(
    Long id,
    Long userId,
    String title,
    String message,
    NotificationType type,
    Boolean isRead,
    LocalDateTime createdAt
) {
    public enum NotificationType {
        INFO, SUCCESS, WARNING, ERROR, REMINDER
    }
}
