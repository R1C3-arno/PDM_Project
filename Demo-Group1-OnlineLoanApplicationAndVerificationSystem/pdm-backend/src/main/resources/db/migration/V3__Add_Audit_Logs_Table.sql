-- Create audit_logs table for comprehensive system audit tracking
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NULL,
    user_email VARCHAR(255) NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NULL,
    resource_id VARCHAR(255) NULL,
    http_method VARCHAR(10) NULL,
    endpoint VARCHAR(500) NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(500) NULL,
    status INT NULL,
    success BOOLEAN NOT NULL DEFAULT TRUE,
    error_message VARCHAR(1000) NULL,
    details TEXT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(255) NULL,

    INDEX idx_audit_user_id (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_timestamp (timestamp),
    INDEX idx_audit_status (status),
    INDEX idx_audit_user_email (user_email),
    INDEX idx_audit_resource (resource_type, resource_id),
    INDEX idx_audit_success (success),
    INDEX idx_audit_ip_address (ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
