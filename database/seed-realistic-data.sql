-- ============================================================================
-- OLAVS LOAN MANAGEMENT SYSTEM - REALISTIC SEED DATA
-- This file contains realistic sample data for development and demonstration
-- Generated: November 26, 2025
-- ============================================================================

-- Clear existing data (optional - comment out if you want to preserve data)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE payments;
-- TRUNCATE TABLE installments;
-- TRUNCATE TABLE repayment_schedules;
-- TRUNCATE TABLE disbursements;
-- TRUNCATE TABLE contracts;
-- TRUNCATE TABLE offers;
-- TRUNCATE TABLE risk_assessments;
-- TRUNCATE TABLE verifications;
-- TRUNCATE TABLE documents;
-- TRUNCATE TABLE applications;
-- TRUNCATE TABLE applicants;
-- TRUNCATE TABLE notifications;
-- TRUNCATE TABLE support_tickets;
-- TRUNCATE TABLE transactions;
-- TRUNCATE TABLE loans;
-- TRUNCATE TABLE wallets;
-- TRUNCATE TABLE users;
-- TRUNCATE TABLE products;
-- TRUNCATE TABLE branches;
-- TRUNCATE TABLE banks;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 1. INSERT BANKS
-- ============================================================================

INSERT INTO banks (name, code, swift_code, address, city, country, phone, email, website, status) VALUES
('Vietnam Commercial Bank', 'VCB', 'BFTVVNVX', '9 Tran Hung Dao, Hoan Kiem District', 'Hanoi', 'Vietnam', '+84 24 3934 3388', 'contact@vietcombank.com', 'https://vietcombank.com.vn', 'ACTIVE'),
('Asia Commercial Bank', 'ACB', 'ASCBVNVX', '442 Nguyen Thi Minh Khai, District 3', 'Ho Chi Minh City', 'Vietnam', '+84 28 3929 3929', 'info@acb.com.vn', 'https://acb.com.vn', 'ACTIVE'),
('Techcombank', 'TCB', 'VTCBVNVX', '191 Ba Trieu, Hai Ba Trung District', 'Hanoi', 'Vietnam', '+84 24 3942 2222', 'support@techcombank.com.vn', 'https://techcombank.com.vn', 'ACTIVE'),
('Sacombank', 'STB', 'SGTTVNVX', '266 Nam Ky Khoi Nghia, District 3', 'Ho Chi Minh City', 'Vietnam', '+84 28 3526 6060', 'contact@sacombank.com', 'https://sacombank.com.vn', 'ACTIVE');

-- ============================================================================
-- 2. INSERT BRANCHES
-- ============================================================================

INSERT INTO branches (bank_id, name, code, address, city, state, postal_code, phone, email, manager_name, status) VALUES
(1, 'VCB Hanoi Central', 'VCB-HN-001', '198 Tran Quang Khai', 'Hanoi', 'Hanoi', '100000', '+84 24 3942 8888', 'hanoi.central@vietcombank.com', 'Nguyen Van A', 'ACTIVE'),
(1, 'VCB Saigon Branch', 'VCB-HCM-001', '29 Ben Chuong Duong', 'Ho Chi Minh City', 'HCM', '700000', '+84 28 3829 9999', 'saigon@vietcombank.com', 'Tran Thi B', 'ACTIVE'),
(2, 'ACB District 1 Branch', 'ACB-HCM-D1', '196 Cach Mang Thang Tam', 'Ho Chi Minh City', 'HCM', '700000', '+84 28 3930 1111', 'district1@acb.com.vn', 'Le Van C', 'ACTIVE'),
(3, 'Techcombank Cau Giay', 'TCB-HN-CG', '234 Pham Van Dong', 'Hanoi', 'Hanoi', '100000', '+84 24 3755 8888', 'caugiay@techcombank.com.vn', 'Pham Thi D', 'ACTIVE');

-- ============================================================================
-- 3. INSERT PRODUCTS (Loan Products)
-- ============================================================================

INSERT INTO products (bank_id, name, code, product_type, description, min_amount, max_amount, min_term_months, max_term_months, base_interest_rate, processing_fee_percent, requires_collateral, min_credit_score, max_ltv_percent, max_dti_percent, status) VALUES
(1, 'Personal Loan - Standard', 'VCB-PL-001', 'PERSONAL', 'Quick personal loan with competitive rates for salaried individuals', 5000000.00, 200000000.00, 6, 60, 12.50, 1.50, FALSE, 600, NULL, 40.00, 'ACTIVE'),
(1, 'Home Loan - Premium', 'VCB-HL-001', 'HOME', 'Home purchase loan with low interest rates and flexible repayment', 100000000.00, 5000000000.00, 60, 300, 8.50, 1.00, TRUE, 650, 80.00, 35.00, 'ACTIVE'),
(2, 'Business Expansion Loan', 'ACB-BL-001', 'BUSINESS', 'Loan for SME business expansion and working capital', 50000000.00, 2000000000.00, 12, 120, 10.00, 2.00, FALSE, 650, NULL, 45.00, 'ACTIVE'),
(2, 'Auto Loan - New Vehicles', 'ACB-AL-001', 'AUTO', 'Finance your dream car with attractive rates', 100000000.00, 1500000000.00, 24, 84, 9.50, 1.50, TRUE, 600, 90.00, 40.00, 'ACTIVE'),
(3, 'Education Loan', 'TCB-EL-001', 'EDUCATION', 'Support higher education in Vietnam and abroad', 20000000.00, 500000000.00, 12, 120, 7.50, 0.50, FALSE, 550, NULL, 30.00, 'ACTIVE'),
(4, 'Gold-backed Loan', 'STB-GL-001', 'GOLD', 'Quick loan against gold collateral with instant approval', 10000000.00, 500000000.00, 3, 36, 15.00, 1.00, TRUE, NULL, 90.00, 50.00, 'ACTIVE');

-- ============================================================================
-- 4. INSERT USERS (Various Roles)
-- ============================================================================
-- Password for all users: password123 (BCrypt hashed)

INSERT INTO users (email, password, full_name, phone, role, status, created_at) VALUES
-- Admins
('admin@olavs.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'System Administrator', '0901234567', 'ADMIN', 'ACTIVE', '2024-01-01 08:00:00'),

-- Bankers
('banker1@olavs.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'Nguyen Van Banker', '0912345678', 'BANKER', 'ACTIVE', '2024-01-05 09:00:00'),
('banker2@olavs.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'Tran Thi Banker', '0923456789', 'BANKER', 'ACTIVE', '2024-01-05 09:00:00'),

-- Verifiers
('verifier1@olavs.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'Le Van Verifier', '0934567890', 'VERIFIER', 'ACTIVE', '2024-01-10 10:00:00'),
('verifier2@olavs.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'Pham Thi Verifier', '0945678901', 'VERIFIER', 'ACTIVE', '2024-01-10 10:00:00'),

-- Underwriters
('underwriter1@olavs.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'Hoang Van Risk', '0956789012', 'UNDERWRITER', 'ACTIVE', '2024-01-15 11:00:00'),

-- Applicants (Regular Users)
('applicant@example.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'Nguyen Van Applicant', '0967890123', 'APPLICANT', 'ACTIVE', '2024-02-01 14:00:00'),
('john.doe@gmail.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'John Doe', '0978901234', 'APPLICANT', 'ACTIVE', '2024-02-15 15:30:00'),
('jane.smith@yahoo.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'Jane Smith', '0989012345', 'APPLICANT', 'ACTIVE', '2024-03-01 10:15:00'),
('michael.chen@gmail.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'Michael Chen', '0990123456', 'APPLICANT', 'ACTIVE', '2024-03-10 16:20:00'),
('sarah.nguyen@outlook.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'Sarah Nguyen', '0901234568', 'APPLICANT', 'ACTIVE', '2024-03-20 11:45:00'),
('david.tran@gmail.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'David Tran', '0912345679', 'APPLICANT', 'ACTIVE', '2024-04-01 09:30:00'),
('emily.le@yahoo.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'Emily Le', '0923456780', 'APPLICANT', 'ACTIVE', '2024-04-15 14:10:00'),
('robert.pham@gmail.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'Robert Pham', '0934567891', 'APPLICANT', 'ACTIVE', '2024-05-01 08:50:00'),
('lisa.hoang@outlook.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'Lisa Hoang', '0945678902', 'APPLICANT', 'ACTIVE', '2024-05-20 13:25:00');

-- ============================================================================
-- 5. INSERT APPLICANTS (Extended User Profiles)
-- ============================================================================

INSERT INTO applicants (user_id, date_of_birth, national_id, address, city, state, postal_code, country, employment_status, employer_name, occupation, monthly_income, monthly_expenses, existing_debts, credit_score, kyc_status, aml_status) VALUES
(7, '1990-05-15', '001090123456', '123 Nguyen Trai, District 1', 'Ho Chi Minh City', 'HCM', '700000', 'Vietnam', 'EMPLOYED', 'FPT Software', 'Software Engineer', 35000000.00, 15000000.00, 0.00, 720, 'VERIFIED', 'CLEARED'),
(8, '1985-08-20', '001085987654', '456 Le Loi, District 3', 'Ho Chi Minh City', 'HCM', '700000', 'Vietnam', 'EMPLOYED', 'Viettel Group', 'Project Manager', 55000000.00, 20000000.00, 10000000.00, 750, 'VERIFIED', 'CLEARED'),
(9, '1992-03-10', '001092456789', '789 Tran Hung Dao, Hoan Kiem', 'Hanoi', 'Hanoi', '100000', 'Vietnam', 'SELF_EMPLOYED', 'Jane Smith Consulting', 'Business Consultant', 45000000.00, 18000000.00, 5000000.00, 680, 'VERIFIED', 'CLEARED'),
(10, '1988-11-25', '001088321654', '321 Hai Ba Trung, Dong Da', 'Hanoi', 'Hanoi', '100000', 'Vietnam', 'EMPLOYED', 'Vingroup', 'Senior Analyst', 48000000.00, 19000000.00, 8000000.00, 700, 'VERIFIED', 'CLEARED'),
(11, '1995-01-08', '001095654321', '654 Pham Van Dong, Cau Giay', 'Hanoi', 'Hanoi', '100000', 'Vietnam', 'EMPLOYED', 'Samsung Vietnam', 'Marketing Manager', 42000000.00, 16000000.00, 0.00, 710, 'VERIFIED', 'CLEARED'),
(12, '1987-07-14', '001087147258', '147 Nguyen Hue, District 1', 'Ho Chi Minh City', 'HCM', '700000', 'Vietnam', 'EMPLOYED', 'Grab Vietnam', 'Operations Lead', 52000000.00, 21000000.00, 12000000.00, 690, 'IN_PROGRESS', 'IN_PROGRESS'),
(13, '1993-09-22', '001093258369', '258 Ba Trieu, Hai Ba Trung', 'Hanoi', 'Hanoi', '100000', 'Vietnam', 'EMPLOYED', 'Shopee Vietnam', 'Product Manager', 58000000.00, 22000000.00, 6000000.00, 730, 'VERIFIED', 'CLEARED'),
(14, '1991-04-30', '001091369147', '369 Vo Van Tan, District 3', 'Ho Chi Minh City', 'HCM', '700000', 'Vietnam', 'SELF_EMPLOYED', 'Pham Trading Co.', 'Business Owner', 65000000.00, 25000000.00, 15000000.00, 660, 'VERIFIED', 'CLEARED'),
(15, '1989-12-05', '001089741852', '741 Ly Thuong Kiet, Hoan Kiem', 'Hanoi', 'Hanoi', '100000', 'Vietnam', 'EMPLOYED', 'Masan Group', 'Finance Manager', 62000000.00, 24000000.00, 9000000.00, 740, 'VERIFIED', 'CLEARED');

-- ============================================================================
-- 6. INSERT APPLICATIONS (Various Statuses)
-- ============================================================================

INSERT INTO applications (applicant_id, product_id, branch_id, application_number, requested_amount, requested_term_months, purpose, status, banker_id, verifier_id, underwriter_id, submitted_at, created_at) VALUES
-- Completed/Active Loans
(1, 1, 1, 'APP-2024-001', 50000000.00, 36, 'Home renovation and furniture purchase', 'ACTIVE', 2, 4, 6, '2024-06-01 10:30:00', '2024-05-28 14:20:00'),
(2, 2, 2, 'APP-2024-002', 2500000000.00, 240, 'Purchase apartment in District 2, HCM City', 'ACTIVE', 3, 5, 6, '2024-05-15 09:00:00', '2024-05-10 11:45:00'),
(3, 3, 3, 'APP-2024-003', 150000000.00, 60, 'Expand coffee shop chain to 3 new locations', 'ACTIVE', 2, 4, 6, '2024-07-10 14:15:00', '2024-07-05 16:30:00'),

-- In Process
(4, 1, 4, 'APP-2024-004', 75000000.00, 48, 'Medical expenses and debt consolidation', 'OFFER_GENERATED', 3, 5, 6, '2024-10-20 11:00:00', '2024-10-18 09:15:00'),
(5, 4, 3, 'APP-2024-005', 800000000.00, 60, 'Purchase new Toyota Camry 2024', 'RISK_ASSESSED', 2, 4, 6, '2024-11-01 10:30:00', '2024-10-29 13:20:00'),
(6, 5, 4, 'APP-2024-006', 180000000.00, 72, 'MBA program at National University', 'VERIFICATION_IN_PROGRESS', 3, 4, NULL, '2024-11-15 15:45:00', '2024-11-12 08:00:00'),

-- Recently Submitted
(7, 1, 1, 'APP-2024-007', 60000000.00, 24, 'Wedding expenses and honeymoon trip', 'UNDER_REVIEW', 2, NULL, NULL, '2024-11-20 09:30:00', '2024-11-19 16:45:00'),
(8, 3, 2, 'APP-2024-008', 250000000.00, 84, 'Launch e-commerce platform and inventory', 'SUBMITTED', NULL, NULL, NULL, '2024-11-23 14:20:00', '2024-11-22 11:30:00'),

-- Rejected
(9, 1, 3, 'APP-2024-009', 120000000.00, 60, 'Investment in cryptocurrency trading', 'REJECTED', 3, 5, 6, '2024-09-10 10:00:00', '2024-09-08 15:20:00');

-- Note: IDs will be auto-generated, adjust foreign keys accordingly in next sections

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- This seed data includes:
-- - 4 Banks with 4 Branches
-- - 6 Loan Products (various types)
-- - 15 Users (1 Admin, 2 Bankers, 2 Verifiers, 1 Underwriter, 9 Applicants)
-- - 9 Applicant Profiles with realistic financial data
-- - 9 Loan Applications in various stages
--
-- Password for all users: password123
--
-- To complete the workflow, you would need to add:
-- - Documents for each application
-- - Verifications (KYC/AML)
-- - Risk Assessments for appropriate applications
-- - Offers for approved applications
-- - Contracts, Disbursements, Repayment Schedules, etc.
-- ============================================================================
