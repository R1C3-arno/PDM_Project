-- ============================================================================
-- PDM LOAN MANAGEMENT SYSTEM - NEW FEATURES MIGRATION
-- Version: 2.1 - Support Ticket Messages & Analytics
-- Created: 2025-11-25
-- Description: Adds ticket_messages and analytics_events tables
-- ============================================================================

-- ============================================================================
-- TICKET_MESSAGES TABLE
-- Enables conversation threads within support tickets
-- ============================================================================
CREATE TABLE IF NOT EXISTS ticket_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ticket_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    sender_type ENUM('APPLICANT', 'STAFF') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_ticket_id (ticket_id),
    INDEX idx_sender_id (sender_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    INDEX idx_ticket_created (ticket_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Support ticket conversation messages';

-- ============================================================================
-- ANALYTICS_EVENTS TABLE
-- Tracks user actions and application usage for analytics and reporting
-- ============================================================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NULL COMMENT 'NULL for anonymous tracking',
    event_type VARCHAR(50) NOT NULL COMMENT 'Type of event (e.g., page_view, loan_application)',
    event_category VARCHAR(50) NOT NULL COMMENT 'Category (e.g., navigation, transaction, authentication)',
    event_action VARCHAR(100) NOT NULL COMMENT 'Specific action taken',
    event_label VARCHAR(255) NULL COMMENT 'Additional context label',
    event_value DECIMAL(15, 2) NULL COMMENT 'Numerical value (e.g., loan amount, page load time)',
    metadata JSON NULL COMMENT 'Additional JSON metadata',
    ip_address VARCHAR(45) NULL COMMENT 'IPv4 or IPv6 address',
    user_agent TEXT NULL COMMENT 'Browser user agent string',
    page_path VARCHAR(500) NULL COMMENT 'URL path where event occurred',
    session_id VARCHAR(100) NULL COMMENT 'Session identifier',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_user_id (user_id),
    INDEX idx_event_type (event_type),
    INDEX idx_event_category (event_category),
    INDEX idx_created_at (created_at),
    INDEX idx_session_id (session_id),
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_type_created (event_type, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Analytics event tracking for user behavior analysis';

-- ============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Composite index for common analytics queries
CREATE INDEX idx_analytics_reporting ON analytics_events(event_category, event_type, created_at);

-- Composite index for ticket message queries
CREATE INDEX idx_ticket_messages_unread ON ticket_messages(ticket_id, is_read, sender_type);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to update support_ticket updated_at when new message is added
DELIMITER //
CREATE TRIGGER update_ticket_timestamp_on_message
AFTER INSERT ON ticket_messages
FOR EACH ROW
BEGIN
    UPDATE support_tickets
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.ticket_id;
END//
DELIMITER ;

-- ============================================================================
-- SAMPLE DATA FOR TESTING (OPTIONAL)
-- ============================================================================

-- Sample ticket message data
-- INSERT INTO ticket_messages (ticket_id, sender_id, message, sender_type, is_read)
-- VALUES
-- (1, 1, 'I need help with my loan application.', 'APPLICANT', TRUE),
-- (1, 2, 'I''ll be happy to help. Can you provide more details?', 'STAFF', FALSE);

-- Sample analytics event data
-- INSERT INTO analytics_events (user_id, event_type, event_category, event_action, page_path)
-- VALUES
-- (1, 'page_view', 'navigation', 'view_dashboard', '/dashboard'),
-- (1, 'loan_application', 'transaction', 'submit_application', '/loans/apply'),
-- (NULL, 'page_view', 'navigation', 'view_homepage', '/');

-- ============================================================================
-- MIGRATION VERIFICATION QUERIES
-- ============================================================================

-- Verify tables were created
-- SELECT
--     TABLE_NAME,
--     TABLE_ROWS,
--     CREATE_TIME,
--     TABLE_COMMENT
-- FROM information_schema.TABLES
-- WHERE TABLE_SCHEMA = DATABASE()
--   AND TABLE_NAME IN ('ticket_messages', 'analytics_events');

-- Verify indexes
-- SELECT
--     TABLE_NAME,
--     INDEX_NAME,
--     COLUMN_NAME,
--     SEQ_IN_INDEX
-- FROM information_schema.STATISTICS
-- WHERE TABLE_SCHEMA = DATABASE()
--   AND TABLE_NAME IN ('ticket_messages', 'analytics_events')
-- ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- ============================================================================
-- ROLLBACK SCRIPT (USE WITH CAUTION)
-- ============================================================================

-- To rollback this migration, uncomment and execute:
-- DROP TRIGGER IF EXISTS update_ticket_timestamp_on_message;
-- DROP TABLE IF EXISTS analytics_events;
-- DROP TABLE IF EXISTS ticket_messages;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
