-- Insert sample users (password: password123)
INSERT INTO users (email, password, full_name, phone, address, role, status) VALUES
('admin@loanweb.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin User', '123-456-7890', '123 Admin St, City', 'ADMIN', 'ACTIVE'),
('john.doe@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John Doe', '555-0101', '456 Main St, City', 'USER', 'ACTIVE'),
('jane.smith@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane Smith', '555-0102', '789 Oak Ave, City', 'USER', 'ACTIVE'),
('bob.johnson@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Bob Johnson', '555-0103', '321 Elm St, City', 'USER', 'ACTIVE'),
('alice.williams@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Alice Williams', '555-0104', '654 Pine Rd, City', 'USER', 'ACTIVE');

-- Insert sample loans
INSERT INTO loans (user_id, loan_type, loan_amount, interest_rate, loan_term_months, monthly_payment, total_amount, outstanding_balance, status, purpose, start_date, end_date) VALUES
(2, 'PERSONAL', 10000.00, 5.5, 24, 445.00, 10680.00, 8240.00, 'ACTIVE', 'Home renovation', '2024-01-15', '2026-01-15'),
(2, 'AUTO', 25000.00, 4.5, 60, 466.00, 27960.00, 25000.00, 'ACTIVE', 'Car purchase', '2024-03-01', '2029-03-01'),
(3, 'PERSONAL', 5000.00, 6.0, 12, 430.00, 5160.00, 2580.00, 'ACTIVE', 'Medical expenses', '2024-02-01', '2025-02-01'),
(4, 'BUSINESS', 50000.00, 7.5, 36, 1556.00, 56016.00, 50000.00, 'PENDING', 'Business expansion', NULL, NULL),
(5, 'PERSONAL', 15000.00, 5.0, 36, 450.00, 16200.00, 13500.00, 'ACTIVE', 'Debt consolidation', '2023-12-01', '2026-12-01');

-- Insert sample wallets
INSERT INTO wallets (user_id, balance, available_credit, total_borrowed, total_repaid) VALUES
(1, 0.00, 100000.00, 0.00, 0.00),
(2, 2500.00, 50000.00, 35000.00, 2440.00),
(3, 1200.00, 25000.00, 5000.00, 2580.00),
(4, 5000.00, 75000.00, 50000.00, 0.00),
(5, 3000.00, 30000.00, 15000.00, 2700.00);

-- Insert sample transactions
INSERT INTO transactions (user_id, loan_id, transaction_type, amount, description, status, reference_number) VALUES
(2, 1, 'LOAN_DISBURSEMENT', 10000.00, 'Loan disbursement for personal loan', 'COMPLETED', 'TXN-2024-001'),
(2, 1, 'PAYMENT', -445.00, 'Monthly payment for loan #1', 'COMPLETED', 'TXN-2024-002'),
(2, 1, 'PAYMENT', -445.00, 'Monthly payment for loan #1', 'COMPLETED', 'TXN-2024-003'),
(2, 2, 'LOAN_DISBURSEMENT', 25000.00, 'Loan disbursement for auto loan', 'COMPLETED', 'TXN-2024-004'),
(3, 3, 'LOAN_DISBURSEMENT', 5000.00, 'Loan disbursement for personal loan', 'COMPLETED', 'TXN-2024-005'),
(3, 3, 'PAYMENT', -430.00, 'Monthly payment for loan #3', 'COMPLETED', 'TXN-2024-006'),
(3, 3, 'PAYMENT', -430.00, 'Monthly payment for loan #3', 'COMPLETED', 'TXN-2024-007'),
(5, 5, 'LOAN_DISBURSEMENT', 15000.00, 'Loan disbursement for debt consolidation', 'COMPLETED', 'TXN-2024-008'),
(5, 5, 'PAYMENT', -450.00, 'Monthly payment for loan #5', 'COMPLETED', 'TXN-2024-009'),
(2, NULL, 'DEPOSIT', 2500.00, 'Wallet deposit', 'COMPLETED', 'TXN-2024-010'),
(3, NULL, 'DEPOSIT', 1200.00, 'Wallet deposit', 'COMPLETED', 'TXN-2024-011');

-- Insert sample support tickets
INSERT INTO support_tickets (user_id, subject, description, category, priority, status, assigned_to) VALUES
(2, 'Question about loan payment', 'I have a question about my monthly payment schedule', 'BILLING', 'MEDIUM', 'OPEN', 1),
(3, 'Unable to access dashboard', 'I am getting an error when trying to access my dashboard', 'TECHNICAL', 'HIGH', 'IN_PROGRESS', 1),
(4, 'Loan application status', 'When will my loan application be approved?', 'GENERAL', 'MEDIUM', 'OPEN', NULL),
(5, 'Request to increase credit limit', 'I would like to request an increase in my credit limit', 'ACCOUNT', 'LOW', 'RESOLVED', 1);

-- Insert sample ticket messages
INSERT INTO ticket_messages (ticket_id, user_id, message, is_staff_reply) VALUES
(1, 2, 'I have a question about my monthly payment schedule', FALSE),
(1, 1, 'Hello! I would be happy to help. Can you please provide your loan ID?', TRUE),
(2, 3, 'I am getting an error when trying to access my dashboard', FALSE),
(2, 1, 'We are looking into this issue. Can you please try clearing your browser cache?', TRUE),
(3, 4, 'When will my loan application be approved?', FALSE),
(4, 5, 'I would like to request an increase in my credit limit', FALSE),
(4, 1, 'Your request has been reviewed and approved. Your new credit limit is $50,000', TRUE);

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(2, 'Payment Due Soon', 'Your loan payment of $445 is due in 3 days', 'REMINDER', FALSE),
(2, 'Payment Successful', 'Your payment of $445 has been processed successfully', 'SUCCESS', TRUE),
(3, 'Loan Payment Reminder', 'Your loan payment of $430 is due tomorrow', 'REMINDER', FALSE),
(4, 'Loan Application Update', 'Your loan application is under review', 'INFO', FALSE),
(5, 'Credit Limit Increased', 'Your credit limit has been increased to $50,000', 'SUCCESS', TRUE);

-- Insert sample analytics events
INSERT INTO analytics_events (user_id, event_type, event_data, ip_address) VALUES
(2, 'LOGIN', '{"browser": "Chrome", "os": "Windows"}', '192.168.1.100'),
(2, 'VIEW_DASHBOARD', '{}', '192.168.1.100'),
(3, 'LOGIN', '{"browser": "Firefox", "os": "MacOS"}', '192.168.1.101'),
(3, 'VIEW_LOANS', '{}', '192.168.1.101'),
(4, 'APPLY_LOAN', '{"amount": 50000, "type": "BUSINESS"}', '192.168.1.102');
