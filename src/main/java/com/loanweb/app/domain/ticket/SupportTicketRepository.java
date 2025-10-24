package com.loanweb.app.domain.ticket;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class SupportTicketRepository {
    private final JdbcTemplate jdbc;

    public SupportTicketRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<SupportTicket> TICKET_ROW_MAPPER = (rs, rowNum) -> {
        Long assignedTo = rs.getObject("assigned_to", Long.class);
        var resolvedAt = rs.getTimestamp("resolved_at");
        return new SupportTicket(
            rs.getLong("id"),
            rs.getLong("user_id"),
            rs.getString("subject"),
            rs.getString("description"),
            SupportTicket.TicketCategory.valueOf(rs.getString("category")),
            SupportTicket.TicketPriority.valueOf(rs.getString("priority")),
            SupportTicket.TicketStatus.valueOf(rs.getString("status")),
            assignedTo,
            rs.getTimestamp("created_at").toLocalDateTime(),
            rs.getTimestamp("updated_at").toLocalDateTime(),
            resolvedAt != null ? resolvedAt.toLocalDateTime() : null
        );
    };

    public List<SupportTicket> findAll() {
        return jdbc.query(
            "SELECT * FROM support_tickets ORDER BY created_at DESC",
            TICKET_ROW_MAPPER
        );
    }

    public Optional<SupportTicket> findById(Long id) {
        List<SupportTicket> tickets = jdbc.query(
            "SELECT * FROM support_tickets WHERE id = ?",
            TICKET_ROW_MAPPER,
            id
        );
        return tickets.isEmpty() ? Optional.empty() : Optional.of(tickets.get(0));
    }

    public List<SupportTicket> findByUserId(Long userId) {
        return jdbc.query(
            "SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC",
            TICKET_ROW_MAPPER,
            userId
        );
    }

    public List<SupportTicket> findByStatus(SupportTicket.TicketStatus status) {
        return jdbc.query(
            "SELECT * FROM support_tickets WHERE status = ? ORDER BY created_at DESC",
            TICKET_ROW_MAPPER,
            status.name()
        );
    }

    public int create(Long userId, String subject, String description,
                     SupportTicket.TicketCategory category, SupportTicket.TicketPriority priority) {
        return jdbc.update(
            "INSERT INTO support_tickets (user_id, subject, description, category, priority, status) " +
            "VALUES (?, ?, ?, ?, ?, ?)",
            userId, subject, description, category.name(), priority.name(),
            SupportTicket.TicketStatus.OPEN.name()
        );
    }

    public int updateStatus(Long id, SupportTicket.TicketStatus status) {
        return jdbc.update(
            "UPDATE support_tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            status.name(), id
        );
    }

    public int assignTicket(Long id, Long assignedTo) {
        return jdbc.update(
            "UPDATE support_tickets SET assigned_to = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            assignedTo, SupportTicket.TicketStatus.IN_PROGRESS.name(), id
        );
    }

    public long countByStatus(SupportTicket.TicketStatus status) {
        return jdbc.queryForObject(
            "SELECT COUNT(*) FROM support_tickets WHERE status = ?",
            Long.class,
            status.name()
        );
    }
}
