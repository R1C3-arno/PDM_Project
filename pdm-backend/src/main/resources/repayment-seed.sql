-- Repayment Schema and Seed Data
-- Run this after the application creates the tables via Hibernate

-- Note: Tables are created automatically by Hibernate based on JPA entities
-- This file contains seed data for testing

-- Insert repayment schedules (borrower_id references users table)
INSERT INTO repayment_schedules (application_id, borrower_id, borrower_name, total_amount, total_amount_paid, interest_rate, term_months, monthly_payment, status, start_date, end_date, created_at, updated_at)
VALUES
(1001, 1, 'Test User', 15000.00, 5000.00, 8.50, 12, 1312.50, 'ACTIVE', '2025-06-01 00:00:00', '2026-06-01 00:00:00', NOW(), NOW()),
(1002, 1, 'Test User', 25000.00, 25000.00, 7.50, 24, 1125.00, 'COMPLETED', '2024-01-01 00:00:00', '2025-12-01 00:00:00', NOW(), NOW()),
(1003, 1, 'Test User', 50000.00, 12500.00, 9.00, 36, 1590.28, 'ACTIVE', '2025-03-01 00:00:00', '2028-03-01 00:00:00', NOW(), NOW()),
(1004, 1, 'Test User', 8000.00, 2000.00, 6.50, 12, 691.67, 'ACTIVE', '2025-07-01 00:00:00', '2026-07-01 00:00:00', NOW(), NOW()),
(1005, 1, 'Test User', 30000.00, 30000.00, 7.00, 18, 1750.00, 'COMPLETED', '2024-06-01 00:00:00', '2025-11-01 00:00:00', NOW(), NOW());

-- Insert installments for schedule 1 (Active loan with some payments)
INSERT INTO repayment_installments (schedule_id, installment_number, principal_amount, interest_amount, total_amount, amount_paid, due_date, paid_date, status, days_overdue, created_at, updated_at)
VALUES
(1, 1, 1206.25, 106.25, 1312.50, 1312.50, '2025-07-01', '2025-07-01', 'PAID', 0, NOW(), NOW()),
(1, 2, 1214.77, 97.73, 1312.50, 1312.50, '2025-08-01', '2025-08-03', 'PAID', 0, NOW(), NOW()),
(1, 3, 1223.37, 89.13, 1312.50, 1312.50, '2025-09-01', '2025-09-01', 'PAID', 0, NOW(), NOW()),
(1, 4, 1232.03, 80.47, 1312.50, 1062.50, '2025-10-01', NULL, 'PARTIALLY_PAID', 0, NOW(), NOW()),
(1, 5, 1240.77, 71.73, 1312.50, 0.00, '2025-11-01', NULL, 'OVERDUE', 30, NOW(), NOW()),
(1, 6, 1249.57, 62.93, 1312.50, 0.00, '2025-12-01', NULL, 'DUE', 0, NOW(), NOW()),
(1, 7, 1258.44, 54.06, 1312.50, 0.00, '2026-01-01', NULL, 'PENDING', 0, NOW(), NOW()),
(1, 8, 1267.38, 45.12, 1312.50, 0.00, '2026-02-01', NULL, 'PENDING', 0, NOW(), NOW()),
(1, 9, 1276.38, 36.12, 1312.50, 0.00, '2026-03-01', NULL, 'PENDING', 0, NOW(), NOW()),
(1, 10, 1285.45, 27.05, 1312.50, 0.00, '2026-04-01', NULL, 'PENDING', 0, NOW(), NOW()),
(1, 11, 1294.59, 17.91, 1312.50, 0.00, '2026-05-01', NULL, 'PENDING', 0, NOW(), NOW()),
(1, 12, 1303.80, 8.70, 1312.50, 0.00, '2026-06-01', NULL, 'PENDING', 0, NOW(), NOW());

-- Insert installments for schedule 3 (Active loan with overdue)
INSERT INTO repayment_installments (schedule_id, installment_number, principal_amount, interest_amount, total_amount, amount_paid, due_date, paid_date, status, days_overdue, created_at, updated_at)
VALUES
(3, 1, 1215.28, 375.00, 1590.28, 1590.28, '2025-04-01', '2025-04-01', 'PAID', 0, NOW(), NOW()),
(3, 2, 1224.40, 365.88, 1590.28, 1590.28, '2025-05-01', '2025-05-02', 'PAID', 0, NOW(), NOW()),
(3, 3, 1233.60, 356.68, 1590.28, 1590.28, '2025-06-01', '2025-06-01', 'PAID', 0, NOW(), NOW()),
(3, 4, 1242.88, 347.40, 1590.28, 1590.28, '2025-07-01', '2025-07-01', 'PAID', 0, NOW(), NOW()),
(3, 5, 1252.23, 338.05, 1590.28, 1590.28, '2025-08-01', '2025-08-05', 'PAID', 0, NOW(), NOW()),
(3, 6, 1261.67, 328.61, 1590.28, 1590.28, '2025-09-01', '2025-09-01', 'PAID', 0, NOW(), NOW()),
(3, 7, 1271.18, 319.10, 1590.28, 1590.28, '2025-10-01', '2025-10-01', 'PAID', 0, NOW(), NOW()),
(3, 8, 1280.77, 309.51, 1590.28, 958.32, '2025-11-01', NULL, 'PARTIALLY_PAID', 30, NOW(), NOW()),
(3, 9, 1290.44, 299.84, 1590.28, 0.00, '2025-12-01', NULL, 'DUE', 0, NOW(), NOW());

-- Insert installments for schedule 4 (Active loan with overdue)
INSERT INTO repayment_installments (schedule_id, installment_number, principal_amount, interest_amount, total_amount, amount_paid, due_date, paid_date, status, days_overdue, created_at, updated_at)
VALUES
(4, 1, 648.34, 43.33, 691.67, 691.67, '2025-08-01', '2025-08-01', 'PAID', 0, NOW(), NOW()),
(4, 2, 651.85, 39.82, 691.67, 691.67, '2025-09-01', '2025-09-02', 'PAID', 0, NOW(), NOW()),
(4, 3, 655.38, 36.29, 691.67, 616.66, '2025-10-01', NULL, 'PARTIALLY_PAID', 0, NOW(), NOW()),
(4, 4, 658.93, 32.74, 691.67, 0.00, '2025-11-01', NULL, 'OVERDUE', 30, NOW(), NOW()),
(4, 5, 662.50, 29.17, 691.67, 0.00, '2025-12-01', NULL, 'DUE', 0, NOW(), NOW());
