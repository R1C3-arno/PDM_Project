package com.loanweb.app.domain.notification;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class NotificationRepository {
    private final JdbcTemplate jdbc;

    public NotificationRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<Notification> NOTIFICATION_ROW_MAPPER = (rs, rowNum) -> new Notification(
        rs.getLong("id"),
        rs.getLong("user_id"),
        rs.getString("title"),
        rs.getString("message"),
        Notification.NotificationType.valueOf(rs.getString("type")),
        rs.getBoolean("is_read"),
        rs.getTimestamp("created_at").toLocalDateTime()
    );

    public List<Notification> findByUserId(Long userId) {
        return jdbc.query(
            "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
            NOTIFICATION_ROW_MAPPER,
            userId
        );
    }

    public List<Notification> findUnreadByUserId(Long userId) {
        return jdbc.query(
            "SELECT * FROM notifications WHERE user_id = ? AND is_read = FALSE ORDER BY created_at DESC",
            NOTIFICATION_ROW_MAPPER,
            userId
        );
    }

    public int create(Long userId, String title, String message, Notification.NotificationType type) {
        return jdbc.update(
            "INSERT INTO notifications (user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, FALSE)",
            userId, title, message, type.name()
        );
    }

    public int markAsRead(Long id) {
        return jdbc.update(
            "UPDATE notifications SET is_read = TRUE WHERE id = ?",
            id
        );
    }

    public int markAllAsRead(Long userId) {
        return jdbc.update(
            "UPDATE notifications SET is_read = TRUE WHERE user_id = ?",
            userId
        );
    }

    public long countUnreadByUserId(Long userId) {
        return jdbc.queryForObject(
            "SELECT COUNT(*) FROM notifications WHERE user_id = ? AND is_read = FALSE",
            Long.class,
            userId
        );
    }
}
