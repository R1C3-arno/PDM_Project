-- ============================================================================
-- PDM LOAN MANAGEMENT SYSTEM - EXTENDED SCHEMA
-- Version: 2.0 - Complete Implementation
-- Database: MySQL 8.0
-- ============================================================================

-- Drop existing tables if recreating
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS installments CASCADE;
DROP TABLE IF EXISTS repayment_schedules CASCADE;
DROP TABLE IF EXISTS disbursements CASCADE;
DROP TABLE IF EXISTS contracts CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS risk_assessments CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS verifications CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS applicants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS banks CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- 1. USERS TABLE (Enhanced with Role System)
-- ============================================================================
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('APPLICANT', 'BANKER', 'VERIFIER', 'UNDERWRITER', 'ADMIN') NOT NULL DEFAULT 'APPLICANT',
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. APPLICANTS TABLE (Extended User Profile for Loan Applicants)
-- ============================================================================
CREATE TABLE applicants (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    date_of_birth DATE,
    national_id VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Vietnam',
    employment_status ENUM('EMPLOYED', 'SELF_EMPLOYED', 'UNEMPLOYED', 'RETIRED', 'STUDENT') NOT NULL,
    employer_name VARCHAR(255),
    occupation VARCHAR(100),
    monthly_income DECIMAL(15, 2),
    monthly_expenses DECIMAL(15, 2),
    existing_debts DECIMAL(15, 2) DEFAULT 0,
    credit_score INT,
    kyc_status ENUM('NOT_STARTED', 'IN_PROGRESS', 'VERIFIED', 'FAILED') DEFAULT 'NOT_STARTED',
    aml_status ENUM('NOT_STARTED', 'IN_PROGRESS', 'CLEARED', 'FLAGGED') DEFAULT 'NOT_STARTED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_kyc_status (kyc_status),
    INDEX idx_aml_status (aml_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. BANKS TABLE
-- ============================================================================
CREATE TABLE banks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    swift_code VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Vietnam',
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4. BRANCHES TABLE
-- ============================================================================
CREATE TABLE branches (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    bank_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    manager_name VARCHAR(255),
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bank_id) REFERENCES banks(id) ON DELETE CASCADE,
    UNIQUE KEY unique_branch_code (bank_id, code),
    INDEX idx_bank_id (bank_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. PRODUCTS TABLE (Loan Products)
-- ============================================================================
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    bank_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    product_type ENUM('PERSONAL', 'HOME', 'AUTO', 'BUSINESS', 'EDUCATION', 'GOLD') NOT NULL,
    description TEXT,
    min_amount DECIMAL(15, 2) NOT NULL,
    max_amount DECIMAL(15, 2) NOT NULL,
    min_term_months INT NOT NULL,
    max_term_months INT NOT NULL,
    base_interest_rate DECIMAL(5, 2) NOT NULL,
    processing_fee_percent DECIMAL(5, 2) DEFAULT 1.00,
    requires_collateral BOOLEAN DEFAULT FALSE,
    min_credit_score INT,
    max_ltv_percent DECIMAL(5, 2),
    max_dti_percent DECIMAL(5, 2) DEFAULT 40.00,
    status ENUM('ACTIVE', 'INACTIVE', 'DISCONTINUED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bank_id) REFERENCES banks(id) ON DELETE CASCADE,
    INDEX idx_bank_id (bank_id),
    INDEX idx_product_type (product_type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 6. APPLICATIONS TABLE (Loan Application Workflow)
-- ============================================================================
CREATE TABLE applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    applicant_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    branch_id BIGINT,
    application_number VARCHAR(50) NOT NULL UNIQUE,
    requested_amount DECIMAL(15, 2) NOT NULL,
    requested_term_months INT NOT NULL,
    purpose TEXT NOT NULL,
    collateral_description TEXT,
    collateral_value DECIMAL(15, 2),
    status ENUM(
        'DRAFT',
        'SUBMITTED',
        'UNDER_REVIEW',
        'DOCUMENTS_REQUESTED',
        'VERIFICATION_IN_PROGRESS',
        'VERIFIED',
        'RISK_ASSESSMENT_IN_PROGRESS',
        'RISK_ASSESSED',
        'OFFER_GENERATED',
        'OFFER_SENT',
        'OFFER_ACCEPTED',
        'OFFER_REJECTED',
        'CONTRACT_CREATED',
        'CONTRACT_SIGNED',
        'DISBURSED',
        'ACTIVE',
        'COMPLETED',
        'REJECTED',
        'WITHDRAWN',
        'CANCELLED'
    ) NOT NULL DEFAULT 'DRAFT',
    banker_id BIGINT,
    verifier_id BIGINT,
    underwriter_id BIGINT,
    submitted_at TIMESTAMP NULL,
    reviewed_at TIMESTAMP NULL,
    decision_at TIMESTAMP NULL,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (banker_id) REFERENCES users(id),
    FOREIGN KEY (verifier_id) REFERENCES users(id),
    FOREIGN KEY (underwriter_id) REFERENCES users(id),
    INDEX idx_applicant_id (applicant_id),
    INDEX idx_product_id (product_id),
    INDEX idx_status (status),
    INDEX idx_application_number (application_number),
    INDEX idx_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 7. DOCUMENTS TABLE
-- ============================================================================
CREATE TABLE documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    document_type ENUM(
        'NATIONAL_ID',
        'PASSPORT',
        'DRIVERS_LICENSE',
        'PROOF_OF_ADDRESS',
        'INCOME_PROOF',
        'BANK_STATEMENT',
        'TAX_RETURN',
        'EMPLOYMENT_LETTER',
        'COLLATERAL_DOCUMENT',
        'PROPERTY_DEED',
        'VEHICLE_REGISTRATION',
        'OTHER'
    ) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_by BIGINT NOT NULL,
    verification_status ENUM('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED') DEFAULT 'PENDING',
    verified_by BIGINT,
    verified_at TIMESTAMP NULL,
    verification_notes TEXT,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    FOREIGN KEY (verified_by) REFERENCES users(id),
    INDEX idx_application_id (application_id),
    INDEX idx_document_type (document_type),
    INDEX idx_verification_status (verification_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 8. VERIFICATIONS TABLE (KYC/AML Verification)
-- ============================================================================
CREATE TABLE verifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    applicant_id BIGINT NOT NULL,
    verifier_id BIGINT,
    verification_type ENUM('KYC', 'AML', 'EMPLOYMENT', 'INCOME', 'COLLATERAL') NOT NULL,
    status ENUM('NOT_STARTED', 'IN_PROGRESS', 'PASSED', 'FAILED', 'REQUIRES_MORE_INFO') DEFAULT 'NOT_STARTED',
    verification_method ENUM('MANUAL', 'AUTOMATED', 'THIRD_PARTY') DEFAULT 'MANUAL',
    external_reference VARCHAR(255),
    result_data JSON,
    risk_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    comments TEXT,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_id) REFERENCES applicants(id),
    FOREIGN KEY (verifier_id) REFERENCES users(id),
    INDEX idx_application_id (application_id),
    INDEX idx_applicant_id (applicant_id),
    INDEX idx_status (status),
    INDEX idx_verification_type (verification_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 9. RISK_ASSESSMENTS TABLE
-- ============================================================================
CREATE TABLE risk_assessments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    applicant_id BIGINT NOT NULL,
    underwriter_id BIGINT,
    credit_score INT,
    dti_ratio DECIMAL(5, 2),
    ltv_ratio DECIMAL(5, 2),
    income_verification_status ENUM('VERIFIED', 'UNVERIFIED', 'INCONSISTENT'),
    employment_stability_score INT,
    collateral_adequacy_score INT,
    overall_risk_score INT,
    risk_category ENUM('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH') NOT NULL,
    recommended_apr DECIMAL(5, 2),
    recommended_amount DECIMAL(15, 2),
    recommended_term_months INT,
    recommendation ENUM('APPROVE', 'APPROVE_WITH_CONDITIONS', 'REJECT') NOT NULL,
    conditions TEXT,
    assessment_notes TEXT,
    assessed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_id) REFERENCES applicants(id),
    FOREIGN KEY (underwriter_id) REFERENCES users(id),
    INDEX idx_application_id (application_id),
    INDEX idx_risk_category (risk_category),
    INDEX idx_recommendation (recommendation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 10. OFFERS TABLE
-- ============================================================================
CREATE TABLE offers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    risk_assessment_id BIGINT,
    offer_number VARCHAR(50) NOT NULL UNIQUE,
    approved_amount DECIMAL(15, 2) NOT NULL,
    term_months INT NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    monthly_payment DECIMAL(15, 2) NOT NULL,
    total_payment DECIMAL(15, 2) NOT NULL,
    total_interest DECIMAL(15, 2) NOT NULL,
    processing_fee DECIMAL(15, 2),
    conditions TEXT,
    valid_until DATE NOT NULL,
    status ENUM('DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'WITHDRAWN') DEFAULT 'DRAFT',
    generated_by BIGINT NOT NULL,
    sent_at TIMESTAMP NULL,
    viewed_at TIMESTAMP NULL,
    responded_at TIMESTAMP NULL,
    response_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (risk_assessment_id) REFERENCES risk_assessments(id),
    FOREIGN KEY (generated_by) REFERENCES users(id),
    INDEX idx_application_id (application_id),
    INDEX idx_offer_number (offer_number),
    INDEX idx_status (status),
    INDEX idx_valid_until (valid_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 11. CONTRACTS TABLE
-- ============================================================================
CREATE TABLE contracts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    offer_id BIGINT NOT NULL,
    contract_number VARCHAR(50) NOT NULL UNIQUE,
    principal_amount DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    term_months INT NOT NULL,
    monthly_payment DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    processing_fee DECIMAL(15, 2),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    first_payment_date DATE NOT NULL,
    contract_terms TEXT NOT NULL,
    special_conditions TEXT,
    status ENUM('DRAFT', 'PENDING_SIGNATURE', 'SIGNED', 'ACTIVE', 'COMPLETED', 'DEFAULTED', 'CANCELLED') DEFAULT 'DRAFT',
    signed_by_applicant BOOLEAN DEFAULT FALSE,
    signed_by_bank BOOLEAN DEFAULT FALSE,
    applicant_signature_date TIMESTAMP NULL,
    bank_signature_date TIMESTAMP NULL,
    bank_representative_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (offer_id) REFERENCES offers(id),
    FOREIGN KEY (bank_representative_id) REFERENCES users(id),
    INDEX idx_application_id (application_id),
    INDEX idx_contract_number (contract_number),
    INDEX idx_status (status),
    INDEX idx_start_date (start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 12. DISBURSEMENTS TABLE
-- ============================================================================
CREATE TABLE disbursements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    contract_id BIGINT NOT NULL,
    disbursement_number VARCHAR(50) NOT NULL UNIQUE,
    amount DECIMAL(15, 2) NOT NULL,
    disbursement_method ENUM('BANK_TRANSFER', 'CASH', 'CHEQUE', 'WALLET') NOT NULL,
    recipient_account_number VARCHAR(100),
    recipient_account_name VARCHAR(255),
    recipient_bank_code VARCHAR(50),
    transaction_reference VARCHAR(255),
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED') DEFAULT 'PENDING',
    scheduled_date DATE,
    disbursed_at TIMESTAMP NULL,
    processed_by BIGINT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(id),
    INDEX idx_contract_id (contract_id),
    INDEX idx_disbursement_number (disbursement_number),
    INDEX idx_status (status),
    INDEX idx_scheduled_date (scheduled_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 13. REPAYMENT_SCHEDULES TABLE
-- ============================================================================
CREATE TABLE repayment_schedules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    contract_id BIGINT NOT NULL UNIQUE,
    total_installments INT NOT NULL,
    frequency ENUM('MONTHLY', 'BI_WEEKLY', 'WEEKLY', 'QUARTERLY') DEFAULT 'MONTHLY',
    total_principal DECIMAL(15, 2) NOT NULL,
    total_interest DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    amount_paid DECIMAL(15, 2) DEFAULT 0,
    principal_paid DECIMAL(15, 2) DEFAULT 0,
    interest_paid DECIMAL(15, 2) DEFAULT 0,
    outstanding_balance DECIMAL(15, 2) NOT NULL,
    status ENUM('ACTIVE', 'COMPLETED', 'DEFAULTED', 'CANCELLED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    INDEX idx_contract_id (contract_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 14. INSTALLMENTS TABLE
-- ============================================================================
CREATE TABLE installments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    schedule_id BIGINT NOT NULL,
    installment_number INT NOT NULL,
    due_date DATE NOT NULL,
    principal_amount DECIMAL(15, 2) NOT NULL,
    interest_amount DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    opening_balance DECIMAL(15, 2) NOT NULL,
    closing_balance DECIMAL(15, 2) NOT NULL,
    amount_paid DECIMAL(15, 2) DEFAULT 0,
    principal_paid DECIMAL(15, 2) DEFAULT 0,
    interest_paid DECIMAL(15, 2) DEFAULT 0,
    penalty_amount DECIMAL(15, 2) DEFAULT 0,
    status ENUM('UPCOMING', 'DUE', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'DEFAULTED') DEFAULT 'UPCOMING',
    paid_date TIMESTAMP NULL,
    days_overdue INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES repayment_schedules(id) ON DELETE CASCADE,
    UNIQUE KEY unique_installment (schedule_id, installment_number),
    INDEX idx_schedule_id (schedule_id),
    INDEX idx_due_date (due_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 15. PAYMENTS TABLE
-- ============================================================================
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    installment_id BIGINT NOT NULL,
    schedule_id BIGINT NOT NULL,
    contract_id BIGINT NOT NULL,
    payment_number VARCHAR(50) NOT NULL UNIQUE,
    amount DECIMAL(15, 2) NOT NULL,
    principal_portion DECIMAL(15, 2) NOT NULL,
    interest_portion DECIMAL(15, 2) NOT NULL,
    penalty_portion DECIMAL(15, 2) DEFAULT 0,
    payment_method ENUM('BANK_TRANSFER', 'CASH', 'CHEQUE', 'WALLET', 'AUTO_DEBIT') NOT NULL,
    transaction_reference VARCHAR(255),
    payment_date TIMESTAMP NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REVERSED') DEFAULT 'PENDING',
    processed_by BIGINT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (installment_id) REFERENCES installments(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES repayment_schedules(id) ON DELETE CASCADE,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(id),
    INDEX idx_installment_id (installment_id),
    INDEX idx_schedule_id (schedule_id),
    INDEX idx_contract_id (contract_id),
    INDEX idx_payment_number (payment_number),
    INDEX idx_payment_date (payment_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- LEGACY TABLES (Keep for backward compatibility)
-- ============================================================================

-- WALLETS TABLE
CREATE TABLE wallets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'VND',
    status ENUM('ACTIVE', 'FROZEN', 'CLOSED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- LOANS TABLE (Legacy - replaced by applications/contracts)
CREATE TABLE loans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    term_months INT NOT NULL,
    monthly_payment DECIMAL(15, 2) NOT NULL,
    total_payable DECIMAL(15, 2) NOT NULL,
    amount_paid DECIMAL(15, 2) DEFAULT 0,
    remaining_balance DECIMAL(15, 2) NOT NULL,
    purpose TEXT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'DEFAULTED') DEFAULT 'PENDING',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TRANSACTIONS TABLE
CREATE TABLE transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    wallet_id BIGINT,
    loan_id BIGINT,
    amount DECIMAL(15, 2) NOT NULL,
    type ENUM('DEPOSIT', 'WITHDRAWAL', 'LOAN_DISBURSEMENT', 'LOAN_PAYMENT', 'FEE', 'REFUND') NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REVERSED') DEFAULT 'PENDING',
    description TEXT,
    reference_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id),
    FOREIGN KEY (loan_id) REFERENCES loans(id),
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SUPPORT_TICKETS TABLE
CREATE TABLE support_tickets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('GENERAL', 'TECHNICAL', 'BILLING', 'LOAN', 'VERIFICATION', 'COMPLAINT') DEFAULT 'GENERAL',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED') DEFAULT 'OPEN',
    assigned_to BIGINT,
    resolution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('INFO', 'WARNING', 'ERROR', 'SUCCESS', 'LOAN', 'PAYMENT', 'SUPPORT', 'ADMIN') DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

