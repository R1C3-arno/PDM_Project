-- ============================================================================
-- PDM LOAN MANAGEMENT SYSTEM - SAMPLE DATA
-- Version: 2.0
-- ============================================================================

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE payments;
TRUNCATE TABLE installments;
TRUNCATE TABLE repayment_schedules;
TRUNCATE TABLE disbursements;
TRUNCATE TABLE contracts;
TRUNCATE TABLE offers;
TRUNCATE TABLE risk_assessments;
TRUNCATE TABLE documents;
TRUNCATE TABLE verifications;
TRUNCATE TABLE applications;
TRUNCATE TABLE applicants;
TRUNCATE TABLE products;
TRUNCATE TABLE branches;
TRUNCATE TABLE banks;
TRUNCATE TABLE notifications;
TRUNCATE TABLE support_tickets;
TRUNCATE TABLE transactions;
TRUNCATE TABLE loans;
TRUNCATE TABLE wallets;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 1. USERS (With 5 Roles)
-- ============================================================================
-- Password for all users: password123 (BCrypt hashed)
INSERT INTO users (email, password, full_name, phone, role, status) VALUES
-- Admin
('admin@loanweb.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System Administrator', '0901234567', 'ADMIN', 'ACTIVE'),

-- Bankers
('banker1@loanweb.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John Banker', '0901234568', 'BANKER', 'ACTIVE'),
('banker2@loanweb.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane Banker', '0901234569', 'BANKER', 'ACTIVE'),

-- Verifiers
('verifier1@loanweb.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mike Verifier', '0901234570', 'VERIFIER', 'ACTIVE'),
('verifier2@loanweb.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sarah Verifier', '0901234571', 'VERIFIER', 'ACTIVE'),

-- Underwriters
('underwriter1@loanweb.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'David Underwriter', '0901234572', 'UNDERWRITER', 'ACTIVE'),
('underwriter2@loanweb.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Emily Underwriter', '0901234573', 'UNDERWRITER', 'ACTIVE'),

-- Applicants
('applicant1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Nguyen Van An', '0912345678', 'APPLICANT', 'ACTIVE'),
('applicant2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Tran Thi Binh', '0912345679', 'APPLICANT', 'ACTIVE'),
('applicant3@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Le Van Cuong', '0912345680', 'APPLICANT', 'ACTIVE'),
('applicant4@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Pham Thi Dung', '0912345681', 'APPLICANT', 'ACTIVE');

-- ============================================================================
-- 2. APPLICANTS (Extended Profiles)
-- ============================================================================
INSERT INTO applicants (user_id, date_of_birth, national_id, address, city, state, postal_code, employment_status, employer_name, occupation, monthly_income, monthly_expenses, existing_debts, credit_score, kyc_status, aml_status) VALUES
(8, '1990-05-15', '079090012345', '123 Nguyen Hue Street', 'Ho Chi Minh City', 'Ho Chi Minh', '700000', 'EMPLOYED', 'Tech Corp Vietnam', 'Software Engineer', 25000000, 8000000, 5000000, 720, 'VERIFIED', 'CLEARED'),
(9, '1985-08-20', '079085023456', '456 Le Loi Street', 'Hanoi', 'Hanoi', '100000', 'EMPLOYED', 'Finance Group', 'Accountant', 18000000, 7000000, 3000000, 680, 'VERIFIED', 'CLEARED'),
(10, '1992-03-10', '079092034567', '789 Tran Hung Dao Street', 'Da Nang', 'Da Nang', '550000', 'SELF_EMPLOYED', 'Own Business', 'Business Owner', 30000000, 12000000, 8000000, 650, 'IN_PROGRESS', 'IN_PROGRESS'),
(11, '1988-11-25', '079088045678', '321 Hai Ba Trung Street', 'Ho Chi Minh City', 'Ho Chi Minh', '700000', 'EMPLOYED', 'Marketing Agency', 'Marketing Manager', 22000000, 9000000, 4000000, 700, 'NOT_STARTED', 'NOT_STARTED');

-- ============================================================================
-- 3. BANKS
-- ============================================================================
INSERT INTO banks (name, code, swift_code, address, city, country, phone, email, website, status) VALUES
('Vietnam Commercial Bank', 'VCB', 'VCBVVNVX', '198 Tran Quang Khai, Hoan Kiem', 'Hanoi', 'Vietnam', '1900545413', 'contact@vcb.com.vn', 'www.vcb.com.vn', 'ACTIVE'),
('Vietnam Technological & Commercial Bank', 'TECHCOMBANK', 'VTCBVNVX', '191 Ba Trieu, Hai Ba Trung', 'Hanoi', 'Vietnam', '1800588822', 'contact@techcombank.com.vn', 'www.techcombank.com.vn', 'ACTIVE'),
('Vietnam International Bank', 'VIB', 'VNIBVNVX', '1 Me Linh Square, Ben Nghe Ward', 'Ho Chi Minh City', 'Vietnam', '1900545411', 'contact@vib.com.vn', 'www.vib.com.vn', 'ACTIVE');

-- ============================================================================
-- 4. BRANCHES
-- ============================================================================
INSERT INTO branches (bank_id, name, code, address, city, state, postal_code, phone, email, manager_name, status) VALUES
(1, 'VCB District 1 Branch', 'VCB-D1', '235 Dong Khoi Street', 'Ho Chi Minh City', 'Ho Chi Minh', '700000', '0283822788', 'district1@vcb.com.vn', 'Nguyen Van A', 'ACTIVE'),
(1, 'VCB Hanoi Central Branch', 'VCB-HN-CT', '198 Tran Quang Khai', 'Hanoi', 'Hanoi', '100000', '0243823823', 'hanoi@vcb.com.vn', 'Tran Van B', 'ACTIVE'),
(2, 'Techcombank District 3 Branch', 'TCB-D3', '191 Ba Trieu', 'Ho Chi Minh City', 'Ho Chi Minh', '700000', '0283823456', 'district3@techcombank.com.vn', 'Le Thi C', 'ACTIVE'),
(3, 'VIB Ben Nghe Branch', 'VIB-BN', '1 Me Linh Square', 'Ho Chi Minh City', 'Ho Chi Minh', '700000', '0283824567', 'bennghe@vib.com.vn', 'Pham Van D', 'ACTIVE');

-- ============================================================================
-- 5. PRODUCTS (Loan Products)
-- ============================================================================
INSERT INTO products (bank_id, name, code, product_type, description, min_amount, max_amount, min_term_months, max_term_months, base_interest_rate, processing_fee_percent, requires_collateral, min_credit_score, max_ltv_percent, max_dti_percent, status) VALUES
(1, 'Personal Loan Express', 'VCB-PL-001', 'PERSONAL', 'Quick personal loan for salaried individuals', 5000000, 500000000, 6, 60, 7.50, 1.00, FALSE, 650, NULL, 40.00, 'ACTIVE'),
(1, 'Home Loan Premium', 'VCB-HL-001', 'HOME', 'Home purchase loan with competitive rates', 100000000, 5000000000, 60, 300, 6.00, 1.50, TRUE, 700, 80.00, 35.00, 'ACTIVE'),
(2, 'Auto Loan Standard', 'TCB-AL-001', 'AUTO', 'New and used car financing', 50000000, 2000000000, 12, 84, 7.00, 1.00, TRUE, 650, 90.00, 40.00, 'ACTIVE'),
(2, 'Business Loan SME', 'TCB-BL-001', 'BUSINESS', 'For small and medium enterprises', 50000000, 10000000000, 12, 120, 8.50, 2.00, TRUE, 680, 70.00, 45.00, 'ACTIVE'),
(3, 'Education Loan', 'VIB-EL-001', 'EDUCATION', 'For higher education expenses', 10000000, 500000000, 12, 84, 6.50, 0.50, FALSE, 600, NULL, 35.00, 'ACTIVE'),
(3, 'Gold Loan Quick', 'VIB-GL-001', 'GOLD', 'Loan against gold collateral', 5000000, 1000000000, 3, 36, 5.50, 0.75, TRUE, NULL, 75.00, NULL, 'ACTIVE');

-- ============================================================================
-- 6. APPLICATIONS (Sample Loan Applications)
-- ============================================================================
INSERT INTO applications (applicant_id, product_id, branch_id, application_number, requested_amount, requested_term_months, purpose, collateral_description, collateral_value, status, banker_id, verifier_id, underwriter_id, submitted_at) VALUES
(1, 1, 1, 'APP-2025-00001', 50000000, 24, 'Home renovation', NULL, NULL, 'OFFER_SENT', 2, 4, 6, '2025-01-15 10:30:00'),
(2, 2, 2, 'APP-2025-00002', 2500000000, 240, 'Purchase apartment in District 2', 'Apartment property deed', 3000000000, 'RISK_ASSESSED', 2, 4, 6, '2025-01-18 14:20:00'),
(3, 4, 3, 'APP-2025-00003', 150000000, 36, 'Expand retail business', 'Shop property', 200000000, 'VERIFICATION_IN_PROGRESS', 3, 5, NULL, '2025-01-20 09:15:00'),
(4, 1, 1, 'APP-2025-00004', 30000000, 18, 'Debt consolidation', NULL, NULL, 'SUBMITTED', NULL, NULL, NULL, '2025-01-22 11:45:00'),
(1, 3, 3, 'APP-2025-00005', 800000000, 60, 'Purchase new car Toyota Camry', 'Vehicle registration', 850000000, 'DRAFT', NULL, NULL, NULL, NULL);

-- ============================================================================
-- 7. VERIFICATIONS
-- ============================================================================
INSERT INTO verifications (application_id, applicant_id, verifier_id, verification_type, status, verification_method, risk_level, comments, started_at, completed_at) VALUES
(1, 1, 4, 'KYC', 'PASSED', 'MANUAL', 'LOW', 'All documents verified successfully', '2025-01-15 11:00:00', '2025-01-15 15:30:00'),
(1, 1, 4, 'AML', 'PASSED', 'AUTOMATED', 'LOW', 'No red flags found', '2025-01-15 11:00:00', '2025-01-15 12:00:00'),
(1, 1, 4, 'INCOME', 'PASSED', 'MANUAL', 'LOW', 'Salary slips verified', '2025-01-15 13:00:00', '2025-01-15 14:00:00'),
(2, 2, 4, 'KYC', 'PASSED', 'MANUAL', 'LOW', 'Identity verified', '2025-01-18 15:00:00', '2025-01-18 16:30:00'),
(2, 2, 4, 'COLLATERAL', 'PASSED', 'MANUAL', 'MEDIUM', 'Property valuation completed', '2025-01-19 10:00:00', '2025-01-19 17:00:00'),
(3, 3, 5, 'KYC', 'IN_PROGRESS', 'MANUAL', NULL, 'Waiting for additional documents', '2025-01-20 10:00:00', NULL);

-- ============================================================================
-- 8. RISK_ASSESSMENTS
-- ============================================================================
INSERT INTO risk_assessments (application_id, applicant_id, underwriter_id, credit_score, dti_ratio, ltv_ratio, income_verification_status, employment_stability_score, collateral_adequacy_score, overall_risk_score, risk_category, recommended_apr, recommended_amount, recommended_term_months, recommendation, conditions, assessed_at) VALUES
(1, 1, 6, 720, 32.00, NULL, 'VERIFIED', 85, NULL, 75, 'LOW', 7.80, 50000000, 24, 'APPROVE', NULL, '2025-01-16 10:00:00'),
(2, 2, 6, 680, 38.89, 83.33, 'VERIFIED', 80, 90, 70, 'MEDIUM', 6.50, 2400000000, 240, 'APPROVE_WITH_CONDITIONS', 'Require additional guarantor', '2025-01-19 14:00:00');

-- ============================================================================
-- 9. OFFERS
-- ============================================================================
INSERT INTO offers (application_id, risk_assessment_id, offer_number, approved_amount, term_months, interest_rate, monthly_payment, total_payment, total_interest, processing_fee, valid_until, status, generated_by, sent_at) VALUES
(1, 1, 'OFFER-2025-00001', 50000000, 24, 7.80, 2285000, 54840000, 4840000, 500000, '2025-02-15', 'SENT', 2, '2025-01-16 11:00:00');

-- ============================================================================
-- 10. WALLETS (Legacy)
-- ============================================================================
INSERT INTO wallets (user_id, balance, currency, status) VALUES
(1, 1000000, 'VND', 'ACTIVE'),
(2, 500000, 'VND', 'ACTIVE'),
(8, 2000000, 'VND', 'ACTIVE'),
(9, 1500000, 'VND', 'ACTIVE'),
(10, 3000000, 'VND', 'ACTIVE'),
(11, 500000, 'VND', 'ACTIVE');

-- ============================================================================
-- 11. NOTIFICATIONS
-- ============================================================================
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(8, 'Loan Application Submitted', 'Your application APP-2025-00001 has been submitted successfully', 'LOAN', FALSE),
(8, 'Offer Generated', 'A loan offer has been generated for your application', 'LOAN', FALSE),
(9, 'Application Under Review', 'Your application APP-2025-00002 is being reviewed', 'LOAN', TRUE);

-- ============================================================================
-- END OF SAMPLE DATA
-- ============================================================================

