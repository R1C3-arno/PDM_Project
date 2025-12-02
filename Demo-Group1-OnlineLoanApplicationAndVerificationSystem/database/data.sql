-- ============================================================================
-- DEPRECATED: This seed data is outdated and should NOT be used for new installations.
--
-- USE INSTEAD: data-extended.sql
--
-- This file contains basic seed data for the old 6-table schema.
-- The production seed data (data-extended.sql) includes 21 users, 10 applicants,
-- 15 applications with realistic data for all 16+ entities.
--
-- Last Updated: December 1, 2025
-- ============================================================================

-- Sample data for development and testing
-- Default password for all test users: password123

-- Insert sample users (passwords are BCrypt hashed)
INSERT INTO users (email, password, full_name, phone, role, status) VALUES
('admin@loanweb.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'Admin User', '0344612654', 'ADMIN', 'ACTIVE'),
('john.doe@example.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'John Doe', '0767178267', 'USER', 'ACTIVE'),
('jane.smith@example.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'Jane Smith', '0363681624', 'USER', 'ACTIVE'),
('bob.johnson@example.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'Bob Johnson', '0902628125', 'USER', 'ACTIVE');

-- Insert wallets for users
INSERT INTO wallets (user_id, balance, currency, status) VALUES
(1, 50000.00, 'USD', 'ACTIVE'),
(2, 10500.50, 'USD', 'ACTIVE'),
(3, 25000.00, 'USD', 'ACTIVE'),
(4, 5000.00, 'USD', 'ACTIVE');

-- Insert sample loans
INSERT INTO loans (user_id, amount, interest_rate, term_months, monthly_payment, total_payable, amount_paid, remaining_balance, status, purpose, start_date, end_date) VALUES
(2, 10000.00, 5.50, 12, 858.33, 10300.00, 2575.00, 7725.00, 'ACTIVE', 'Personal loan for home renovation', '2024-01-15', '2025-01-15'),
(2, 5000.00, 6.00, 24, 221.60, 5318.40, 0.00, 5318.40, 'PENDING', 'Education loan', NULL, NULL),
(3, 20000.00, 5.00, 36, 599.42, 21579.00, 11988.00, 9591.00, 'ACTIVE', 'Business expansion loan', '2023-06-01', '2026-06-01'),
(4, 3000.00, 7.00, 6, 511.50, 3069.00, 3069.00, 0.00, 'COMPLETED', 'Emergency medical loan', '2024-05-01', '2024-11-01');

-- Insert sample transactions
INSERT INTO transactions (user_id, loan_id, wallet_id, type, amount, description, status, reference_number) VALUES
(2, 1, 2, 'LOAN_DISBURSEMENT', 10000.00, 'Loan #1 disbursed to wallet', 'COMPLETED', 'TXN-20240115-001'),
(2, 1, 2, 'LOAN_PAYMENT', -858.33, 'Monthly payment for Loan #1', 'COMPLETED', 'TXN-20240215-002'),
(2, 1, 2, 'LOAN_PAYMENT', -858.33, 'Monthly payment for Loan #1', 'COMPLETED', 'TXN-20240315-003'),
(2, 1, 2, 'LOAN_PAYMENT', -858.34, 'Monthly payment for Loan #1', 'COMPLETED', 'TXN-20240415-004'),
(3, 3, 3, 'LOAN_DISBURSEMENT', 20000.00, 'Loan #3 disbursed to wallet', 'COMPLETED', 'TXN-20230601-005'),
(3, NULL, 3, 'DEPOSIT', 5000.00, 'Wallet deposit via bank transfer', 'COMPLETED', 'TXN-20241020-006'),
(4, 4, 4, 'LOAN_DISBURSEMENT', 3000.00, 'Loan #4 disbursed to wallet', 'COMPLETED', 'TXN-20240501-007'),
(4, 4, 4, 'LOAN_PAYMENT', -511.50, 'Monthly payment for Loan #4', 'COMPLETED', 'TXN-20240601-008');

-- Insert sample support tickets
INSERT INTO support_tickets (user_id, subject, description, status, priority, category, assigned_to) VALUES
(2, 'Question about loan approval', 'I applied for a loan 3 days ago. When will it be approved?', 'OPEN', 'MEDIUM', 'LOAN_INQUIRY', 1),
(3, 'Unable to make payment', 'The payment button is not working on my loan page', 'IN_PROGRESS', 'HIGH', 'TECHNICAL', 1),
(4, 'Request for loan statement', 'I need a statement for my completed loan for tax purposes', 'RESOLVED', 'LOW', 'DOCUMENT_REQUEST', 1),
(2, 'Change phone number', 'I need to update my phone number in the system', 'OPEN', 'LOW', 'ACCOUNT', NULL);

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, is_read, link) VALUES
(2, 'Loan Application Received', 'Your loan application for $5,000 has been received and is under review.', 'LOAN', FALSE, '/loans'),
(2, 'Payment Due Soon', 'Your loan payment of $858.33 is due on 2024-05-15.', 'PAYMENT', FALSE, '/loans/1'),
(3, 'Payment Received', 'We have received your payment of $599.42. Thank you!', 'PAYMENT', TRUE, '/transactions'),
(3, 'Support Ticket Update', 'Your support ticket #2 has been updated. Status: In Progress', 'SUPPORT', FALSE, '/tickets/2'),
(4, 'Loan Completed', 'Congratulations! Your loan #4 has been fully paid off.', 'LOAN', TRUE, '/loans/4'),
(1, 'New Support Ticket', 'A new support ticket #4 has been assigned to you.', 'ADMIN', FALSE, '/admin/tickets/4');
