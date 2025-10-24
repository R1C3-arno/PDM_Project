package com.loanweb.app.domain.ticket;

import java.time.LocalDateTime;

public record SupportTicket(
    Long id,
    Long userId,
    String subject,
    String description,
    TicketCategory category,
    TicketPriority priority,
    TicketStatus status,
    Long assignedTo,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    LocalDateTime resolvedAt
) {
    public enum TicketCategory {
        GENERAL, BILLING, TECHNICAL, ACCOUNT, LOAN
    }

    public enum TicketPriority {
        LOW, MEDIUM, HIGH, URGENT
    }

    public enum TicketStatus {
        OPEN, IN_PROGRESS, RESOLVED, CLOSED
    }
}
