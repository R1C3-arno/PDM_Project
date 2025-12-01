-- ============================================================================
-- PDM LOAN MANAGEMENT SYSTEM - ADDITIONAL SEED DATA
-- Add more realistic test data for demo purposes
-- ============================================================================

-- ============================================================================
-- 1. ADD MORE USERS (10 additional users across all roles)
-- ============================================================================
-- Password for all users: password123 (BCrypt hash)
INSERT INTO users (email, password, full_name, phone, role, status) VALUES
-- 2 More Bankers
('banker3@loanweb.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Michael Banker', '0901234574', 'BANKER', 'ACTIVE'),
('banker4@loanweb.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Lisa Banker', '0901234575', 'BANKER', 'ACTIVE'),

-- 2 More Verifiers
('verifier3@loanweb.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Robert Verifier', '0901234576', 'VERIFIER', 'ACTIVE'),
('verifier4@loanweb.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Emma Verifier', '0901234577', 'VERIFIER', 'ACTIVE'),

-- 2 More Underwriters
('underwriter3@loanweb.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'James Underwriter', '0901234578', 'UNDERWRITER', 'ACTIVE'),
('underwriter4@loanweb.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Olivia Underwriter', '0901234579', 'UNDERWRITER', 'ACTIVE'),

-- 10 More Applicants
('applicant5@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Hoang Van Minh', '0912345682', 'APPLICANT', 'ACTIVE'),
('applicant6@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Nguyen Thi Lan', '0912345683', 'APPLICANT', 'ACTIVE'),
('applicant7@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Tran Van Hung', '0912345684', 'APPLICANT', 'ACTIVE'),
('applicant8@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Le Thi Mai', '0912345685', 'APPLICANT', 'ACTIVE'),
('applicant9@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Pham Van Duc', '0912345686', 'APPLICANT', 'ACTIVE'),
('applicant10@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Vo Thi Huong', '0912345687', 'APPLICANT', 'ACTIVE'),
('applicant11@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Dang Van Tuan', '0912345688', 'APPLICANT', 'ACTIVE'),
('applicant12@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Bui Thi Phuong', '0912345689', 'APPLICANT', 'ACTIVE'),
('applicant13@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ngo Van Khanh', '0912345690', 'APPLICANT', 'ACTIVE'),
('applicant14@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Truong Thi Thuy', '0912345691', 'APPLICANT', 'ACTIVE');

-- ============================================================================
-- 2. ADD MORE APPLICANTS (Extended Profiles)
-- ============================================================================
INSERT INTO applicants (user_id, date_of_birth, national_id, address, city, state, postal_code, employment_status, employer_name, occupation, monthly_income, monthly_expenses, existing_debts, credit_score, kyc_status, aml_status) VALUES
-- High Credit Score Applicants
(12, '1988-03-15', '079088001234', '45 Le Lai Street', 'Ho Chi Minh City', 'Ho Chi Minh', '700000', 'EMPLOYED', 'Samsung Vietnam', 'Senior Engineer', 35000000, 12000000, 8000000, 780, 'VERIFIED', 'CLEARED'),
(13, '1990-07-22', '079090002345', '78 Nguyen Thai Hoc', 'Hanoi', 'Hanoi', '100000', 'EMPLOYED', 'VinGroup', 'Project Manager', 40000000, 15000000, 10000000, 750, 'VERIFIED', 'CLEARED'),

-- Medium Credit Score Applicants
(14, '1985-12-10', '079085003456', '123 Tran Phu Street', 'Da Nang', 'Da Nang', '550000', 'SELF_EMPLOYED', 'Freelance IT Consultant', 'IT Consultant', 28000000, 10000000, 6000000, 690, 'VERIFIED', 'CLEARED'),
(15, '1992-05-18', '079092004567', '56 Hai Ba Trung', 'Ho Chi Minh City', 'Ho Chi Minh', '700000', 'EMPLOYED', 'FPT Software', 'Developer', 22000000, 8000000, 4000000, 710, 'VERIFIED', 'CLEARED'),

-- Lower Credit Score Applicants (but still acceptable)
(16, '1987-09-25', '079087005678', '234 Phan Chu Trinh', 'Can Tho', 'Can Tho', '900000', 'EMPLOYED', 'Local Trading Company', 'Sales Manager', 20000000, 9000000, 7000000, 640, 'IN_PROGRESS', 'IN_PROGRESS'),
(17, '1993-11-30', '079093006789', '89 Quang Trung', 'Hue', 'Thua Thien Hue', '530000', 'EMPLOYED', 'Tourism Company', 'Tour Guide', 15000000, 7000000, 3000000, 660, 'VERIFIED', 'CLEARED'),

-- Fresh Applicants (New to system)
(18, '1991-04-12', '079091007890', '67 Ly Thuong Kiet', 'Ho Chi Minh City', 'Ho Chi Minh', '700000', 'EMPLOYED', 'Grab Vietnam', 'Operations Manager', 32000000, 13000000, 9000000, 720, 'NOT_STARTED', 'NOT_STARTED'),
(19, '1989-08-08', '079089008901', '145 Le Hong Phong', 'Hanoi', 'Hanoi', '100000', 'SELF_EMPLOYED', 'Coffee Shop Owner', 'Business Owner', 25000000, 11000000, 5000000, 670, 'NOT_STARTED', 'NOT_STARTED'),
(20, '1994-02-14', '079094009012', '23 Nguyen Hue', 'Da Nang', 'Da Nang', '550000', 'EMPLOYED', 'Tech Startup', 'Marketing Lead', 27000000, 10000000, 6000000, 700, 'NOT_STARTED', 'NOT_STARTED'),
(21, '1986-06-20', '079086010123', '456 Dien Bien Phu', 'Vung Tau', 'Ba Ria - Vung Tau', '790000', 'EMPLOYED', 'Oil & Gas Company', 'Engineer', 38000000, 14000000, 11000000, 730, 'NOT_STARTED', 'NOT_STARTED');

-- ============================================================================
-- 3. CREATE WALLETS FOR NEW USERS
-- ============================================================================
INSERT INTO wallets (user_id, balance, currency, status) VALUES
(12, 5000000, 'VND', 'ACTIVE'),
(13, 8000000, 'VND', 'ACTIVE'),
(14, 3000000, 'VND', 'ACTIVE'),
(15, 4500000, 'VND', 'ACTIVE'),
(16, 2000000, 'VND', 'ACTIVE'),
(17, 1500000, 'VND', 'ACTIVE'),
(18, 6000000, 'VND', 'ACTIVE'),
(19, 3500000, 'VND', 'ACTIVE'),
(20, 4000000, 'VND', 'ACTIVE'),
(21, 7000000, 'VND', 'ACTIVE');

-- ============================================================================
-- 4. ADD MORE APPLICATIONS (15 applications in various stages)
-- ============================================================================
INSERT INTO applications (applicant_id, product_id, branch_id, application_number, requested_amount, requested_term_months, purpose, collateral_description, collateral_value, status, banker_id, verifier_id, underwriter_id, submitted_at, reviewed_at, decision_at) VALUES

-- COMPLETED/ACTIVE LOANS (3)
(5, 1, 1, 'APP-2025-00006', 80000000, 36, 'Small business working capital', NULL, NULL, 'ACTIVE', 2, 4, 6, '2024-11-01 09:00:00', '2024-11-02 14:30:00', '2024-11-05 10:00:00'),
(6, 3, 3, 'APP-2025-00007', 150000000, 60, 'Purchase new car', 'Toyota Camry 2024', 200000000, 'ACTIVE', 3, 5, 7, '2024-11-05 11:20:00', '2024-11-06 15:45:00', '2024-11-08 09:30:00'),
(7, 5, 4, 'APP-2025-00008', 45000000, 48, 'Master degree tuition fees', NULL, NULL, 'COMPLETED', 2, 4, 6, '2024-08-01 10:00:00', '2024-08-02 11:00:00', '2024-08-05 14:00:00'),

-- CONTRACT_SIGNED (Ready for disbursement) (2)
(8, 1, 1, 'APP-2025-00009', 60000000, 24, 'Home renovation', NULL, NULL, 'CONTRACT_SIGNED', 2, 4, 6, '2025-01-20 14:30:00', '2025-01-21 10:00:00', '2025-01-23 16:00:00'),
(9, 4, 3, 'APP-2025-00010', 200000000, 48, 'Expand restaurant business', 'Restaurant property deed', 300000000, 'CONTRACT_SIGNED', 3, 5, 7, '2025-01-18 09:15:00', '2025-01-19 11:30:00', '2025-01-22 14:45:00'),

-- OFFER_SENT (Waiting for applicant decision) (3)
(10, 1, 2, 'APP-2025-00011', 75000000, 30, 'Debt consolidation', NULL, NULL, 'OFFER_SENT', 2, 4, 6, '2025-01-21 10:45:00', '2025-01-22 09:30:00', '2025-01-23 15:20:00'),
(11, 2, 1, 'APP-2025-00012', 1500000000, 180, 'Purchase apartment', 'Apartment in District 7', 2000000000, 'OFFER_SENT', 3, 5, 7, '2025-01-19 13:20:00', '2025-01-20 10:15:00', '2025-01-22 16:40:00'),
(5, 6, 4, 'APP-2025-00013', 35000000, 12, 'Emergency medical expenses', 'Gold jewelry (500g)', 40000000, 'OFFER_SENT', 2, 4, 6, '2025-01-22 16:00:00', '2025-01-23 09:00:00', '2025-01-23 14:30:00'),

-- RISK_ASSESSED (Underwriting complete) (2)
(6, 1, 3, 'APP-2025-00014', 95000000, 36, 'Wedding expenses', NULL, NULL, 'RISK_ASSESSED', 3, 5, 7, '2025-01-22 11:30:00', '2025-01-23 10:00:00', NULL),
(7, 4, 2, 'APP-2025-00015', 180000000, 60, 'Open new cafe', 'Cafe equipment and deposit', 250000000, 'RISK_ASSESSED', 2, 4, 6, '2025-01-21 15:45:00', '2025-01-22 13:20:00', NULL),

-- VERIFICATION_IN_PROGRESS (2)
(8, 1, 1, 'APP-2025-00016', 55000000, 18, 'Buy motorcycle', NULL, NULL, 'VERIFICATION_IN_PROGRESS', 2, 4, NULL, '2025-01-23 09:30:00', '2025-01-23 14:00:00', NULL),
(9, 5, 3, 'APP-2025-00017', 70000000, 60, 'MBA program', NULL, NULL, 'VERIFICATION_IN_PROGRESS', 3, 5, NULL, '2025-01-23 10:15:00', '2025-01-23 15:30:00', NULL),

-- UNDER_REVIEW (Banker reviewing) (2)
(10, 1, 2, 'APP-2025-00018', 48000000, 24, 'Computer equipment for freelance work', NULL, NULL, 'UNDER_REVIEW', 2, NULL, NULL, '2025-01-23 13:45:00', NULL, NULL),
(11, 3, 4, 'APP-2025-00019', 125000000, 48, 'Buy used car', 'Honda Accord 2022', 150000000, 'UNDER_REVIEW', 3, NULL, NULL, '2025-01-23 15:20:00', NULL, NULL),

-- SUBMITTED (Just submitted, not assigned yet) (1)
(5, 1, 1, 'APP-2025-00020', 65000000, 30, 'Home office setup', NULL, NULL, 'SUBMITTED', NULL, NULL, NULL, '2025-01-24 09:00:00', NULL, NULL);

-- ============================================================================
-- 5. ADD VERIFICATIONS (for applications in progress)
-- ============================================================================
INSERT INTO verifications (application_id, applicant_id, verifier_id, verification_type, status, verification_method, risk_level, comments, started_at, completed_at) VALUES
-- Completed verifications
(6, 5, 4, 'KYC', 'PASSED', 'MANUAL', 'LOW', 'All identity documents verified successfully', '2024-11-02 10:00:00', '2024-11-02 15:30:00'),
(6, 5, 5, 'AML', 'PASSED', 'AUTOMATED', 'LOW', 'No red flags in AML screening', '2024-11-02 10:00:00', '2024-11-02 12:00:00'),
(6, 5, 4, 'EMPLOYMENT', 'PASSED', 'MANUAL', 'LOW', 'Employment verified with HR department', '2024-11-02 13:00:00', '2024-11-02 16:00:00'),
(6, 5, 4, 'INCOME', 'PASSED', 'MANUAL', 'LOW', 'Salary slips and bank statements verified', '2024-11-02 13:00:00', '2024-11-02 16:30:00'),

(7, 6, 5, 'KYC', 'PASSED', 'MANUAL', 'LOW', 'Identity verified', '2024-11-06 09:00:00', '2024-11-06 14:00:00'),
(7, 6, 5, 'AML', 'PASSED', 'AUTOMATED', 'LOW', 'Clean AML check', '2024-11-06 09:00:00', '2024-11-06 11:00:00'),
(7, 6, 5, 'COLLATERAL', 'PASSED', 'MANUAL', 'LOW', 'Vehicle documents verified', '2024-11-06 14:00:00', '2024-11-06 17:00:00'),

-- In-progress verifications
(11, 10, 4, 'KYC', 'IN_PROGRESS', 'MANUAL', 'MEDIUM', 'Pending address verification', '2025-01-22 10:00:00', NULL),
(11, 10, 5, 'AML', 'PASSED', 'AUTOMATED', 'LOW', 'Clean record', '2025-01-22 10:00:00', '2025-01-22 11:30:00'),

(16, 8, 4, 'KYC', 'IN_PROGRESS', 'MANUAL', 'LOW', 'Documents under review', '2025-01-23 14:30:00', NULL),
(17, 9, 5, 'KYC', 'IN_PROGRESS', 'MANUAL', 'LOW', 'Initial checks passed', '2025-01-23 16:00:00', NULL);

-- ============================================================================
-- 6. ADD RISK ASSESSMENTS (for applications past verification)
-- ============================================================================
INSERT INTO risk_assessments (application_id, applicant_id, underwriter_id, credit_score, dti_ratio, ltv_ratio, income_verification_status, employment_stability_score, collateral_adequacy_score, overall_risk_score, risk_category, recommended_apr, recommended_amount, recommended_term_months, recommendation, conditions, assessment_notes, assessed_at) VALUES

-- Approved assessments
(6, 5, 6, 720, 35.5, NULL, 'VERIFIED', 82, NULL, 75, 'LOW', 7.80, 80000000, 36, 'APPROVE', 'Monthly income verification required', 'Strong employment history, good credit score', '2024-11-05 09:30:00'),
(7, 6, 7, 750, 28.3, 75.0, 'VERIFIED', 88, 85, 82, 'VERY_LOW', 7.20, 150000000, 60, 'APPROVE', 'Collateral insurance required', 'Excellent profile, strong collateral', '2024-11-08 08:45:00'),
(9, 8, 6, 710, 32.8, NULL, 'VERIFIED', 80, NULL, 73, 'LOW', 7.90, 60000000, 24, 'APPROVE', 'Auto-debit mandatory', 'Good credit, stable employment', '2025-01-23 15:30:00'),
(10, 9, 7, 670, 38.5, 66.7, 'VERIFIED', 75, 78, 68, 'MEDIUM', 8.70, 200000000, 48, 'APPROVE_WITH_CONDITIONS', 'Annual business review required, Maintain 20% equity', 'Acceptable risk with monitoring', '2025-01-22 14:15:00'),

-- Recently assessed
(11, 10, 6, 690, 36.2, NULL, 'VERIFIED', 78, NULL, 71, 'LOW', 8.00, 75000000, 30, 'APPROVE', 'Quarterly income verification', 'DTI slightly high but manageable', '2025-01-23 14:50:00'),
(12, 11, 7, 730, 30.5, 75.0, 'VERIFIED', 85, 90, 80, 'VERY_LOW', 6.20, 1500000000, 180, 'APPROVE', 'Property insurance mandatory, Annual property valuation', 'Excellent home loan candidate', '2025-01-22 16:20:00'),
(13, 5, 6, 720, 25.0, 87.5, 'VERIFIED', 82, 80, 76, 'LOW', 5.80, 35000000, 12, 'APPROVE', 'Gold must remain in custody', 'Low LTV, short term, minimal risk', '2025-01-23 14:00:00'),

-- Under assessment
(14, 6, 7, 750, 33.8, NULL, 'VERIFIED', 88, NULL, 79, 'LOW', 7.60, 95000000, 36, 'APPROVE', 'Standard terms', 'Strong applicant', '2025-01-23 16:45:00'),
(15, 7, 6, 660, 40.5, 72.0, 'VERIFIED', 72, 75, 65, 'MEDIUM', 8.90, 180000000, 60, 'APPROVE_WITH_CONDITIONS', 'Business plan review required, Quarterly revenue verification', 'Borderline DTI, needs monitoring', '2025-01-23 17:20:00');

-- ============================================================================
-- 7. ADD OFFERS (for assessed applications)
-- ============================================================================
INSERT INTO offers (application_id, risk_assessment_id, offer_number, approved_amount, term_months, interest_rate, monthly_payment, total_payment, total_interest, processing_fee, conditions, valid_until, status, generated_by, sent_at, viewed_at) VALUES

-- Active loan offers (already accepted and contracted)
(6, 3, 'OFF-2025-00002', 80000000, 36, 7.80, 2490000, 89640000, 9640000, 800000, 'Monthly income verification required', '2024-11-30', 'ACCEPTED', 6, '2024-11-05 10:30:00', '2024-11-05 14:00:00'),
(7, 4, 'OFF-2025-00003', 150000000, 60, 7.20, 2980000, 178800000, 28800000, 1500000, 'Collateral insurance required', '2024-12-05', 'ACCEPTED', 7, '2024-11-08 09:15:00', '2024-11-08 13:30:00'),

-- Ready for contract (accepted)
(9, 5, 'OFF-2025-00004', 60000000, 24, 7.90, 2720000, 65280000, 5280000, 600000, 'Auto-debit mandatory', '2025-02-15', 'ACCEPTED', 6, '2025-01-23 16:00:00', '2025-01-23 18:30:00'),
(10, 6, 'OFF-2025-00005', 200000000, 48, 8.70, 4920000, 236160000, 36160000, 2000000, 'Annual business review required, Maintain 20% equity', '2025-02-15', 'ACCEPTED', 7, '2025-01-22 14:45:00', '2025-01-22 16:20:00'),

-- Sent, waiting for response
(11, 7, 'OFF-2025-00006', 75000000, 30, 8.00, 2720000, 81600000, 6600000, 750000, 'Quarterly income verification', '2025-02-20', 'SENT', 6, '2025-01-23 15:15:00', NULL),
(12, 8, 'OFF-2025-00007', 1500000000, 180, 6.20, 11240000, 2023200000, 523200000, 15000000, 'Property insurance mandatory, Annual property valuation', '2025-02-20', 'SENT', 7, '2025-01-22 16:45:00', '2025-01-23 09:00:00'),
(13, 9, 'OFF-2025-00008', 35000000, 12, 5.80, 2970000, 35640000, 640000, 350000, 'Gold must remain in custody', '2025-02-20', 'SENT', 6, '2025-01-23 14:30:00', '2025-01-23 16:45:00');

-- ============================================================================
-- 8. ADD CONTRACTS (for accepted offers)
-- ============================================================================
INSERT INTO contracts (application_id, offer_id, contract_number, principal_amount, interest_rate, term_months, monthly_payment, total_amount, processing_fee, start_date, end_date, first_payment_date, contract_terms, status, signed_by_applicant, signed_by_bank, applicant_signature_date, bank_signature_date, bank_representative_id) VALUES

-- Active contracts (already disbursed)
(6, 2, 'CNT-2025-00002', 80000000, 7.80, 36, 2490000, 89640000, 800000, '2024-11-10', '2027-11-10', '2024-12-10', 'Standard personal loan terms and conditions apply. Borrower agrees to make monthly payments on time.', 'ACTIVE', TRUE, TRUE, '2024-11-06 10:00:00', '2024-11-06 14:00:00', 2),
(7, 3, 'CNT-2025-00003', 150000000, 7.20, 60, 2980000, 178800000, 1500000, '2024-11-15', '2029-11-15', '2024-12-15', 'Auto loan secured by vehicle. Insurance mandatory. Vehicle cannot be sold without bank approval.', 'ACTIVE', TRUE, TRUE, '2024-11-09 11:00:00', '2024-11-09 15:30:00', 3),

-- Signed, ready for disbursement
(9, 4, 'CNT-2025-00004', 60000000, 7.90, 24, 2720000, 65280000, 600000, '2025-02-01', '2027-02-01', '2025-03-01', 'Personal loan for home renovation. Auto-debit authorization granted.', 'SIGNED', TRUE, TRUE, '2025-01-23 19:00:00', '2025-01-24 09:00:00', 2),
(10, 5, 'CNT-2025-00005', 200000000, 48, 8.70, 4920000, 236160000, 2000000, '2025-02-01', '2029-02-01', '2025-03-01', 'Business loan secured by commercial property. Annual financial review required.', 'SIGNED', TRUE, TRUE, '2025-01-22 17:00:00', '2025-01-23 10:00:00', 3);

-- ============================================================================
-- 9. ADD DISBURSEMENTS (for active contracts)
-- ============================================================================
INSERT INTO disbursements (contract_id, disbursement_number, amount, disbursement_method, recipient_account_number, recipient_account_name, recipient_bank_code, transaction_reference, status, scheduled_date, disbursed_at, processed_by) VALUES

-- Completed disbursements
(1, 'DISB-2025-00002', 79200000, 'BANK_TRANSFER', '0234567890', 'Hoang Van Minh', 'VCB', 'TXN-20241110-002', 'COMPLETED', '2024-11-10', '2024-11-10 10:30:00', 2),
(2, 'DISB-2025-00003', 148500000, 'BANK_TRANSFER', '0345678901', 'Nguyen Thi Lan', 'TCB', 'TXN-20241115-003', 'COMPLETED', '2024-11-15', '2024-11-15 11:15:00', 3),

-- Pending disbursements
(3, 'DISB-2025-00004', 59400000, 'BANK_TRANSFER', '0456789012', 'Le Thi Mai', 'VCB', 'TXN-20250201-004', 'PENDING', '2025-02-01', NULL, NULL),
(4, 'DISB-2025-00005', 198000000, 'BANK_TRANSFER', '0567890123', 'Pham Van Duc', 'TCB', 'TXN-20250201-005', 'PENDING', '2025-02-01', NULL, NULL);

-- ============================================================================
-- 10. ADD REPAYMENT SCHEDULES (for disbursed loans)
-- ============================================================================
INSERT INTO repayment_schedules (contract_id, total_installments, frequency, total_principal, total_interest, total_amount, amount_paid, principal_paid, interest_paid, outstanding_balance, status) VALUES

-- Active repayment schedules
(1, 36, 'MONTHLY', 80000000, 9640000, 89640000, 7470000, 6580000, 890000, 73420000, 'ACTIVE'),
(2, 60, 'MONTHLY', 150000000, 28800000, 178800000, 8940000, 7800000, 1140000, 142200000, 'ACTIVE');

-- ============================================================================
-- 11. ADD INSTALLMENTS (first 6 months for active schedules)
-- ============================================================================
-- Schedule 1 (Contract 1 - 36 months, started Nov 2024)
INSERT INTO installments (schedule_id, installment_number, due_date, principal_amount, interest_amount, total_amount, opening_balance, closing_balance, amount_paid, principal_paid, interest_paid, penalty_amount, status, paid_date, days_overdue) VALUES
-- Month 1 (December 2024) - PAID
(1, 1, '2024-12-10', 2010000, 480000, 2490000, 80000000, 77990000, 2490000, 2010000, 480000, 0, 'PAID', '2024-12-09 14:30:00', 0),
-- Month 2 (January 2025) - PAID
(1, 2, '2025-01-10', 2025000, 465000, 2490000, 77990000, 75965000, 2490000, 2025000, 465000, 0, 'PAID', '2025-01-08 15:20:00', 0),
-- Month 3 (February 2025) - PAID
(1, 3, '2025-02-10', 2040000, 450000, 2490000, 75965000, 73925000, 2490000, 2040000, 450000, 0, 'PAID', '2025-02-07 16:10:00', 0),
-- Month 4 (March 2025) - DUE (upcoming)
(1, 4, '2025-03-10', 2055000, 435000, 2490000, 73925000, 71870000, 0, 0, 0, 0, 'DUE', NULL, 0),
-- Month 5 (April 2025) - UPCOMING
(1, 5, '2025-04-10', 2070000, 420000, 2490000, 71870000, 69800000, 0, 0, 0, 0, 'UPCOMING', NULL, 0),
-- Month 6 (May 2025) - UPCOMING
(1, 6, '2025-05-10', 2085000, 405000, 2490000, 69800000, 67715000, 0, 0, 0, 0, 'UPCOMING', NULL, 0);

-- Schedule 2 (Contract 2 - 60 months, started Nov 2024)
INSERT INTO installments (schedule_id, installment_number, due_date, principal_amount, interest_amount, total_amount, opening_balance, closing_balance, amount_paid, principal_paid, interest_paid, penalty_amount, status, paid_date, days_overdue) VALUES
-- Month 1 (December 2024) - PAID
(2, 1, '2024-12-15', 2080000, 900000, 2980000, 150000000, 147920000, 2980000, 2080000, 900000, 0, 'PAID', '2024-12-14 10:00:00', 0),
-- Month 2 (January 2025) - PAID
(2, 2, '2025-01-15', 2095000, 885000, 2980000, 147920000, 145825000, 2980000, 2095000, 885000, 0, 'PAID', '2025-01-14 11:30:00', 0),
-- Month 3 (February 2025) - PAID
(2, 3, '2025-02-15', 2110000, 870000, 2980000, 145825000, 143715000, 2980000, 2110000, 870000, 0, 'PAID', '2025-02-13 09:45:00', 0),
-- Month 4 (March 2025) - DUE (upcoming)
(2, 4, '2025-03-15', 2125000, 855000, 2980000, 143715000, 141590000, 0, 0, 0, 0, 'DUE', NULL, 0),
-- Month 5 (April 2025) - UPCOMING
(2, 5, '2025-04-15', 2140000, 840000, 2980000, 141590000, 139450000, 0, 0, 0, 0, 'UPCOMING', NULL, 0),
-- Month 6 (May 2025) - UPCOMING
(2, 6, '2025-05-15', 2155000, 825000, 2980000, 139450000, 137295000, 0, 0, 0, 0, 'UPCOMING', NULL, 0);

-- ============================================================================
-- 12. ADD PAYMENTS (for paid installments)
-- ============================================================================
INSERT INTO payments (installment_id, schedule_id, contract_id, payment_number, amount, principal_portion, interest_portion, penalty_portion, payment_method, transaction_reference, payment_date, status, processed_by) VALUES

-- Schedule 1 payments
(1, 1, 1, 'PAY-2024-12-001', 2490000, 2010000, 480000, 0, 'AUTO_DEBIT', 'TXN-PAY-20241209-001', '2024-12-09 14:30:00', 'COMPLETED', 2),
(2, 1, 1, 'PAY-2025-01-001', 2490000, 2025000, 465000, 0, 'AUTO_DEBIT', 'TXN-PAY-20250108-001', '2025-01-08 15:20:00', 'COMPLETED', 2),
(3, 1, 1, 'PAY-2025-02-001', 2490000, 2040000, 450000, 0, 'AUTO_DEBIT', 'TXN-PAY-20250207-001', '2025-02-07 16:10:00', 'COMPLETED', 2),

-- Schedule 2 payments
(7, 2, 2, 'PAY-2024-12-002', 2980000, 2080000, 900000, 0, 'AUTO_DEBIT', 'TXN-PAY-20241214-002', '2024-12-14 10:00:00', 'COMPLETED', 3),
(8, 2, 2, 'PAY-2025-01-002', 2980000, 2095000, 885000, 0, 'AUTO_DEBIT', 'TXN-PAY-20250114-002', '2025-01-14 11:30:00', 'COMPLETED', 3),
(9, 2, 2, 'PAY-2025-02-002', 2980000, 2110000, 870000, 0, 'AUTO_DEBIT', 'TXN-PAY-20250213-002', '2025-02-13 09:45:00', 'COMPLETED', 3);

-- ============================================================================
-- 13. ADD SUPPORT TICKETS
-- ============================================================================
INSERT INTO support_tickets (user_id, subject, description, status, priority, category, assigned_to, created_at, updated_at, resolved_at) VALUES
(12, 'Question about early repayment', 'I want to pay off my loan early. Are there any penalties?', 'RESOLVED', 'MEDIUM', 'LOAN', 2, '2024-12-15 10:00:00', '2024-12-15 14:30:00', '2024-12-15 14:30:00'),
(13, 'Need loan statement for tax', 'Can you provide a statement showing all my payments for 2024?', 'RESOLVED', 'LOW', 'LOAN', 2, '2025-01-05 09:30:00', '2025-01-06 11:00:00', '2025-01-06 11:00:00'),
(14, 'Update my phone number', 'I have a new phone number and need to update my account', 'IN_PROGRESS', 'LOW', 'GENERAL', 2, '2025-01-20 14:15:00', '2025-01-20 14:15:00', NULL),
(15, 'Cannot access my account', 'I forgot my password and cannot reset it', 'OPEN', 'HIGH', 'TECHNICAL', NULL, '2025-01-23 16:30:00', '2025-01-23 16:30:00', NULL),
(16, 'Loan application status', 'It has been 2 days since I submitted. What is the status?', 'OPEN', 'MEDIUM', 'LOAN', NULL, '2025-01-24 08:45:00', '2025-01-24 08:45:00', NULL);

-- ============================================================================
-- 14. ADD NOTIFICATIONS
-- ============================================================================
INSERT INTO notifications (user_id, title, message, type, is_read, link, created_at, read_at) VALUES

-- Applicant notifications
(12, 'Loan Application Approved', 'Congratulations! Your loan application #APP-2025-00006 has been approved. Amount: 80,000,000 VND', 'SUCCESS', TRUE, '/applications/6', '2024-11-05 10:30:00', '2024-11-05 11:00:00'),
(12, 'Payment Due Soon', 'Your next payment of 2,490,000 VND is due on March 10, 2025', 'PAYMENT', FALSE, '/repayments', '2025-02-28 09:00:00', NULL),
(12, 'Support Ticket Resolved', 'Your support ticket about early repayment has been resolved', 'SUPPORT', TRUE, '/tickets/1', '2024-12-15 14:30:00', '2024-12-15 15:00:00'),

(13, 'Loan Application Approved', 'Your auto loan application #APP-2025-00007 has been approved', 'SUCCESS', TRUE, '/applications/7', '2024-11-08 09:15:00', '2024-11-08 10:30:00'),
(13, 'Payment Due Soon', 'Your next payment of 2,980,000 VND is due on March 15, 2025', 'PAYMENT', FALSE, '/repayments', '2025-03-01 09:00:00', NULL),
(13, 'Document Requested', 'Your loan statement has been generated and is ready for download', 'INFO', TRUE, '/documents', '2025-01-06 11:00:00', '2025-01-06 12:00:00'),

(14, 'Loan Offer Sent', 'You have received a loan offer for 95,000,000 VND. Please review and respond.', 'LOAN', FALSE, '/applications/14/offer', '2025-01-23 15:15:00', NULL),
(15, 'Documents Required', 'Please upload the requested documents to proceed with your application', 'WARNING', FALSE, '/applications/15/documents', '2025-01-22 16:00:00', NULL),
(16, 'Application Under Review', 'Your application #APP-2025-00016 is now under verification', 'INFO', TRUE, '/applications/16', '2025-01-23 14:00:00', '2025-01-23 14:30:00'),

-- Banker notifications
(2, 'New Application Assigned', 'Application #APP-2025-00018 has been assigned to you for review', 'ADMIN', FALSE, '/staff/applications/18', '2025-01-23 13:45:00', NULL),
(3, 'Contract Ready for Signature', 'Contract #CNT-2025-00005 is ready for bank signature', 'ADMIN', FALSE, '/staff/contracts/4', '2025-01-23 10:00:00', NULL),

-- Verifier notifications
(4, 'Verification Task Assigned', 'Please verify documents for application #APP-2025-00016', 'ADMIN', FALSE, '/staff/verifications/16', '2025-01-23 14:30:00', NULL),
(5, 'Verification Task Assigned', 'Please verify documents for application #APP-2025-00017', 'ADMIN', FALSE, '/staff/verifications/17', '2025-01-23 16:00:00', NULL),

-- Underwriter notifications
(6, 'Risk Assessment Required', 'Application #APP-2025-00014 needs risk assessment', 'ADMIN', FALSE, '/staff/risk-assessment/14', '2025-01-23 16:00:00', NULL),
(7, 'Risk Assessment Required', 'Application #APP-2025-00015 needs risk assessment', 'ADMIN', FALSE, '/staff/risk-assessment/15', '2025-01-23 16:30:00', NULL);

-- ============================================================================
-- 15. ADD LEGACY TRANSACTIONS (for wallet activities)
-- ============================================================================
INSERT INTO transactions (user_id, wallet_id, loan_id, amount, type, status, description, reference_number, created_at) VALUES
(12, 7, NULL, 5000000, 'DEPOSIT', 'COMPLETED', 'Initial wallet deposit', 'TXN-DEP-20241101-001', '2024-11-01 08:00:00'),
(13, 8, NULL, 8000000, 'DEPOSIT', 'COMPLETED', 'Initial wallet deposit', 'TXN-DEP-20241105-001', '2024-11-05 09:00:00'),
(14, 9, NULL, 3000000, 'DEPOSIT', 'COMPLETED', 'Initial wallet deposit', 'TXN-DEP-20250110-001', '2025-01-10 10:00:00'),
(15, 10, NULL, 4500000, 'DEPOSIT', 'COMPLETED', 'Initial wallet deposit', 'TXN-DEP-20250115-001', '2025-01-15 11:00:00'),

-- Loan disbursement transactions
(12, 7, NULL, 79200000, 'LOAN_DISBURSEMENT', 'COMPLETED', 'Loan disbursement for APP-2025-00006', 'TXN-20241110-002', '2024-11-10 10:30:00'),
(13, 8, NULL, 148500000, 'LOAN_DISBURSEMENT', 'COMPLETED', 'Loan disbursement for APP-2025-00007', 'TXN-20241115-003', '2024-11-15 11:15:00'),

-- Repayment transactions
(12, 7, NULL, -2490000, 'LOAN_PAYMENT', 'COMPLETED', 'Monthly loan payment - December 2024', 'TXN-PAY-20241209-001', '2024-12-09 14:30:00'),
(12, 7, NULL, -2490000, 'LOAN_PAYMENT', 'COMPLETED', 'Monthly loan payment - January 2025', 'TXN-PAY-20250108-001', '2025-01-08 15:20:00'),
(12, 7, NULL, -2490000, 'LOAN_PAYMENT', 'COMPLETED', 'Monthly loan payment - February 2025', 'TXN-PAY-20250207-001', '2025-02-07 16:10:00'),

(13, 8, NULL, -2980000, 'LOAN_PAYMENT', 'COMPLETED', 'Monthly loan payment - December 2024', 'TXN-PAY-20241214-002', '2024-12-14 10:00:00'),
(13, 8, NULL, -2980000, 'LOAN_PAYMENT', 'COMPLETED', 'Monthly loan payment - January 2025', 'TXN-PAY-20250114-002', '2025-01-14 11:30:00'),
(13, 8, NULL, -2980000, 'LOAN_PAYMENT', 'COMPLETED', 'Monthly loan payment - February 2025', 'TXN-PAY-20250213-002', '2025-02-13 09:45:00');

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Total added:
-- - 20 new users (4 bankers, 4 verifiers, 4 underwriters, 10 applicants)
-- - 10 new applicant profiles (varied credit scores and employment)
-- - 10 new wallets
-- - 15 new applications (various stages from SUBMITTED to ACTIVE)
-- - 10 new verifications (completed and in-progress)
-- - 9 new risk assessments
-- - 7 new offers
-- - 4 new contracts (2 active, 2 signed)
-- - 4 new disbursements (2 completed, 2 pending)
-- - 2 new repayment schedules
-- - 12 new installments (6 per schedule, first 3 months paid)
-- - 6 new payments
-- - 5 new support tickets
-- - 15 new notifications
-- - 12 new transactions

SELECT 'Seed data loaded successfully!' as message;
