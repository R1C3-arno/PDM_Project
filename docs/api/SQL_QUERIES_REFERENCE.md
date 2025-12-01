# OLAVS Loan Management System - SQL Queries Reference

**Database:** MySQL 8.0
**Generated:** November 26, 2025
**Total Tables:** 27 (15 extended + 12 legacy)

---

## Table of Contents

1. [Database Schema (DDL)](#database-schema-ddl)
2. [SELECT Queries](#select-queries)
3. [INSERT Queries](#insert-queries)
4. [UPDATE Queries](#update-queries)
5. [DELETE Queries](#delete-queries)
6. [Aggregate & Analytics Queries](#aggregate--analytics-queries)
7. [Sample Data (DML)](#sample-data-dml)
8. [Indexes](#indexes)

---

## Database Schema (DDL)

### Core Tables

#### 1. Users Table
```sql
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
```

#### 2. Applicants Table (Extended User Profile)
```sql
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
```

#### 3. Banks Table
```sql
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
```

#### 4. Branches Table
```sql
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
```

#### 5. Products Table (Loan Products)
```sql
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
```

#### 6. Applications Table (Loan Application Workflow)
```sql
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
        'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'DOCUMENTS_REQUESTED',
        'VERIFICATION_IN_PROGRESS', 'VERIFIED', 'RISK_ASSESSMENT_IN_PROGRESS',
        'RISK_ASSESSED', 'OFFER_GENERATED', 'OFFER_SENT', 'OFFER_ACCEPTED',
        'OFFER_REJECTED', 'CONTRACT_CREATED', 'CONTRACT_SIGNED', 'DISBURSED',
        'ACTIVE', 'COMPLETED', 'REJECTED', 'WITHDRAWN', 'CANCELLED'
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
```

#### 7. Documents Table
```sql
CREATE TABLE documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    document_type ENUM(
        'NATIONAL_ID', 'PASSPORT', 'DRIVERS_LICENSE', 'PROOF_OF_ADDRESS',
        'INCOME_PROOF', 'BANK_STATEMENT', 'TAX_RETURN', 'EMPLOYMENT_LETTER',
        'COLLATERAL_DOCUMENT', 'PROPERTY_DEED', 'VEHICLE_REGISTRATION', 'OTHER'
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
```

#### 8. Verifications Table (KYC/AML)
```sql
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
```

#### 9. Risk Assessments Table
```sql
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
```

#### 10. Offers Table
```sql
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
```

#### 11. Contracts Table
```sql
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
```

#### 12. Disbursements Table
```sql
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
```

#### 13. Repayment Schedules Table
```sql
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
```

#### 14. Installments Table
```sql
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
```

#### 15. Payments Table
```sql
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
```

### Legacy Tables (Backward Compatibility)

#### 16. Wallets Table
```sql
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
```

#### 17. Loans Table (Legacy)
```sql
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
```

#### 18. Transactions Table
```sql
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
```

#### 19. Support Tickets Table
```sql
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
```

#### 20. Notifications Table
```sql
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
```

---

## SELECT Queries

### User Queries
```sql
-- Get all users ordered by creation date
SELECT * FROM users ORDER BY created_at DESC;

-- Find user by ID
SELECT * FROM users WHERE id = ?;

-- Find user by email (for authentication)
SELECT * FROM users WHERE email = ?;
```

### Application Queries
```sql
-- Get all applications
SELECT * FROM Applications ORDER BY created_at DESC;

-- Get application by ID
SELECT * FROM Applications WHERE id = ?;

-- Get application by application number
SELECT * FROM Applications WHERE application_number = ?;

-- Get applications by applicant
SELECT * FROM Applications WHERE applicant_id = ? ORDER BY created_at DESC;

-- Get applications by status
SELECT * FROM Applications WHERE status = ? ORDER BY created_at DESC;

-- Get applications assigned to banker
SELECT * FROM Applications WHERE assigned_banker_id = ? ORDER BY created_at DESC;

-- Get applications assigned to verifier
SELECT * FROM Applications WHERE assigned_verifier_id = ? ORDER BY created_at DESC;

-- Get applications assigned to underwriter
SELECT * FROM Applications WHERE assigned_underwriter_id = ? ORDER BY created_at DESC;

-- Count applications
SELECT COUNT(*) FROM Applications;

-- Count applications by status
SELECT COUNT(*) FROM Applications WHERE status = ?;
```

### Loan Queries
```sql
-- Get all loans
SELECT * FROM loans ORDER BY created_at DESC;

-- Get loan by ID
SELECT * FROM loans WHERE id = ?;

-- Get loans by user
SELECT * FROM loans WHERE user_id = ? ORDER BY created_at DESC;

-- Get loans by status
SELECT * FROM loans WHERE status = ? ORDER BY created_at DESC;
```

### Wallet Queries
```sql
-- Get all wallets
SELECT * FROM wallets;

-- Get wallet by ID
SELECT * FROM wallets WHERE id = ?;

-- Get wallet by user ID
SELECT * FROM wallets WHERE user_id = ?;
```

### Transaction Queries
```sql
-- Get all transactions
SELECT * FROM transactions ORDER BY created_at DESC;

-- Get transaction by ID
SELECT * FROM transactions WHERE id = ?;

-- Get transactions by user
SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC;

-- Get transactions by loan
SELECT * FROM transactions WHERE loan_id = ? ORDER BY created_at DESC;
```

### Document Queries
```sql
-- Get all documents for application
SELECT * FROM documents WHERE application_id = ? ORDER BY created_at DESC;

-- Get documents by type for application
SELECT * FROM documents WHERE application_id = ? AND document_type = ? ORDER BY created_at DESC;

-- Get documents pending verification
SELECT * FROM documents WHERE verification_status = ? ORDER BY created_at ASC;

-- Get document by ID
SELECT * FROM documents WHERE id = ?;

-- Count unverified documents for application
SELECT COUNT(*) FROM documents WHERE application_id = ? AND verification_status != 'VERIFIED';
```

### Verification Queries
```sql
-- Get all verifications for application
SELECT * FROM Verifications WHERE application_id = ? ORDER BY created_at DESC;

-- Get specific verification type for application
SELECT * FROM Verifications WHERE application_id = ? AND verification_type = ? ORDER BY created_at DESC LIMIT 1;

-- Get verifications by KYC status
SELECT * FROM Verifications WHERE kyc_status = ? ORDER BY created_at ASC;

-- Get verifications by AML status
SELECT * FROM Verifications WHERE aml_status = ? ORDER BY created_at ASC;

-- Check if all verifications passed for application
SELECT COUNT(*) FROM Verifications WHERE application_id = ? AND
    (kyc_status = 'VERIFIED' OR aml_status = 'CLEARED');
```

### Risk Assessment Queries
```sql
-- Get latest risk assessment for application
SELECT * FROM risk_assessments WHERE application_id = ? ORDER BY created_at DESC LIMIT 1;

-- Get risk assessment by ID
SELECT * FROM risk_assessments WHERE id = ?;

-- Get risk assessments by underwriter
SELECT * FROM risk_assessments WHERE underwriter_id = ? ORDER BY created_at DESC;

-- Get risk assessments by category
SELECT * FROM risk_assessments WHERE risk_category = ? ORDER BY created_at DESC;
```

### Offer Queries
```sql
-- Get all offers for application
SELECT * FROM offers WHERE application_id = ? ORDER BY created_at DESC;

-- Get latest offer for application
SELECT * FROM offers WHERE application_id = ? ORDER BY created_at DESC LIMIT 1;

-- Get offer by ID
SELECT * FROM offers WHERE id = ?;

-- Get offer by offer number
SELECT * FROM offers WHERE offer_number = ?;

-- Get offers by status
SELECT * FROM offers WHERE status = ? ORDER BY created_at DESC;
```

### Contract Queries
```sql
-- Get contract by ID
SELECT * FROM contracts WHERE id = ?;

-- Get contract by application
SELECT * FROM contracts WHERE application_id = ? ORDER BY created_at DESC LIMIT 1;

-- Get contract by contract number
SELECT * FROM contracts WHERE contract_number = ?;

-- Get contracts by status
SELECT * FROM contracts WHERE status = ? ORDER BY created_at DESC;

-- Check if contract is fully signed
SELECT COUNT(*) FROM contracts WHERE id = ? AND signed_by_applicant = TRUE
    AND signed_by_bank = TRUE;
```

### Disbursement Queries
```sql
-- Get disbursements for contract
SELECT * FROM disbursements WHERE contract_id = ?;

-- Get disbursement by ID
SELECT * FROM disbursements WHERE id = ?;

-- Get disbursement by number
SELECT * FROM disbursements WHERE disbursement_number = ?;

-- Get disbursements by status
SELECT * FROM disbursements WHERE status = ? ORDER BY created_at DESC;

-- Get disbursements by application (via contract)
SELECT * FROM disbursements WHERE application_id = ?;
```

### Repayment Schedule Queries
```sql
-- Get schedule by contract
SELECT * FROM repayment_schedules WHERE contract_id = ?;

-- Get schedule by ID
SELECT * FROM repayment_schedules WHERE id = ?;

-- Get all schedules
SELECT * FROM repayment_schedules ORDER BY created_at DESC;
```

### Installment Queries
```sql
-- Get all installments for schedule
SELECT * FROM installments WHERE schedule_id = ? ORDER BY installment_number;

-- Get installment by ID
SELECT * FROM installments WHERE id = ?;

-- Get installments by status
SELECT * FROM installments WHERE status = ? ORDER BY due_date;

-- Get overdue installments
SELECT * FROM installments WHERE status = 'OVERDUE' AND due_date < CURDATE() ORDER BY due_date;

-- Get upcoming installments in date range
SELECT * FROM installments WHERE status IN ('UPCOMING', 'DUE')
    AND due_date BETWEEN ? AND ? ORDER BY due_date;
```

### Payment Queries
```sql
-- Get payment by ID
SELECT * FROM payments WHERE id = ?;

-- Get payments for installment
SELECT * FROM payments WHERE installment_id = ? ORDER BY payment_date DESC;

-- Get payments for schedule
SELECT * FROM payments WHERE schedule_id = ? ORDER BY payment_date DESC;

-- Get payments for contract
SELECT * FROM payments WHERE contract_id = ? ORDER BY payment_date DESC;

-- Get payment by transaction reference
SELECT * FROM payments WHERE transaction_reference = ?;

-- Get payments by payment method
SELECT * FROM payments WHERE payment_method = ? ORDER BY payment_date DESC;

-- Calculate total paid for schedule
SELECT COALESCE(SUM(amount), 0) FROM payments WHERE schedule_id = ?;
```

### Notification Queries
```sql
-- Get all notifications
SELECT * FROM notifications ORDER BY created_at DESC;

-- Get notification by ID
SELECT * FROM notifications WHERE id = ?;

-- Get all notifications for user
SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC;

-- Get unread notifications for user
SELECT * FROM notifications WHERE user_id = ? AND is_read = false ORDER BY created_at DESC;
```

### Support Ticket Queries
```sql
-- Get all tickets
SELECT * FROM support_tickets ORDER BY created_at DESC;

-- Get ticket by ID
SELECT * FROM support_tickets WHERE id = ?;

-- Get tickets by user
SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC;

-- Get tickets by status
SELECT * FROM support_tickets WHERE status = ? ORDER BY created_at DESC;

-- Get ticket messages
SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC;

-- Count unread messages in ticket
SELECT COUNT(*) FROM ticket_messages WHERE ticket_id = ? AND is_read = FALSE;
```

### Bank & Branch Queries
```sql
-- Get all banks
SELECT * FROM Banks ORDER BY name;

-- Get active banks
SELECT * FROM Banks WHERE is_active = TRUE ORDER BY name;

-- Get bank by ID
SELECT * FROM Banks WHERE id = ?;

-- Get bank by code
SELECT * FROM Banks WHERE code = ?;

-- Get all branches
SELECT * FROM Branches ORDER BY branch_name;

-- Get active branches
SELECT * FROM Branches WHERE is_active = TRUE ORDER BY branch_name;

-- Get branches by bank
SELECT * FROM Branches WHERE bank_id = ? ORDER BY branch_name;

-- Get branches by city
SELECT * FROM Branches WHERE city = ? AND is_active = TRUE ORDER BY branch_name;

-- Get branch by IFSC code
SELECT * FROM Branches WHERE ifsc_code = ?;
```

### Product Queries
```sql
-- Get all products
SELECT * FROM products ORDER BY name;

-- Get active products
SELECT * FROM products WHERE status = 'ACTIVE' ORDER BY name;

-- Get product by ID
SELECT * FROM products WHERE id = ?;

-- Get products by bank
SELECT * FROM products WHERE bank_id = ? ORDER BY name;

-- Get products by type
SELECT * FROM products WHERE product_type = ? ORDER BY name;
```

### Analytics Queries
```sql
-- Get analytics events by user
SELECT * FROM analytics_events WHERE user_id = ? ORDER BY created_at DESC LIMIT 1000;

-- Get analytics events by type
SELECT * FROM analytics_events WHERE event_type = ? ORDER BY created_at DESC LIMIT 1000;

-- Get analytics events by category
SELECT * FROM analytics_events WHERE event_category = ? ORDER BY created_at DESC LIMIT 1000;

-- Get analytics events in date range
SELECT * FROM analytics_events WHERE created_at BETWEEN ? AND ? ORDER BY created_at DESC LIMIT 5000;

-- Group events by type
SELECT event_type, COUNT(*) as count FROM analytics_events
    WHERE created_at >= ? GROUP BY event_type ORDER BY count DESC;

-- Group page views
SELECT page_path, COUNT(*) as views FROM analytics_events
    WHERE event_type = 'page_view' AND created_at >= ?
    GROUP BY page_path ORDER BY views DESC;
```

---

## INSERT Queries

### User Insert
```sql
INSERT INTO users (email, password, full_name, phone, role, status)
VALUES (?, ?, ?, ?, ?, ?);
```

### Applicant Insert
```sql
INSERT INTO Applicants (user_id, date_of_birth, national_id, address, city, state,
    postal_code, country, employment_status, employer_name, occupation, monthly_income,
    monthly_expenses, existing_debts, credit_score, kyc_status, aml_status)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
```

### Application Insert
```sql
INSERT INTO Applications (applicant_id, product_id, branch_id, requested_amount,
    requested_term_months, purpose, collateral_description, collateral_value, status,
    application_number, assigned_banker_id, assigned_verifier_id, assigned_underwriter_id)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
```

### Loan Insert
```sql
INSERT INTO loans (user_id, amount, interest_rate, term_months, monthly_payment,
    total_payable, amount_paid, remaining_balance, status, purpose, start_date, end_date)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
```

### Wallet Insert
```sql
INSERT INTO wallets (user_id, balance, currency, status)
VALUES (?, ?, ?, ?);
```

### Transaction Insert
```sql
INSERT INTO transactions (user_id, loan_id, wallet_id, type, amount, description, status, reference_number)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);
```

### Document Insert
```sql
INSERT INTO documents (application_id, document_type, file_name, file_size, file_path,
    uploaded_by, verification_status)
VALUES (?, ?, ?, ?, ?, ?, ?);
```

### Verification Insert
```sql
INSERT INTO Verifications (application_id, applicant_id, verification_type, kyc_status,
    aml_status, verifier_id, verification_method)
VALUES (?, ?, ?, ?, ?, ?, ?);
```

### Risk Assessment Insert
```sql
INSERT INTO risk_assessments (application_id, applicant_id, underwriter_id, dti_ratio, ltv_ratio,
    risk_score, risk_category, recommendation, assessment_notes)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
```

### Offer Insert
```sql
INSERT INTO offers (application_id, risk_assessment_id, approved_amount, interest_rate,
    term_months, monthly_payment, processing_fee, conditions, valid_until, generated_by, offer_number)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
```

### Contract Insert
```sql
INSERT INTO contracts (application_id, offer_id, contract_number, principal_amount,
    interest_rate, term_months, monthly_payment, total_amount, processing_fee,
    start_date, end_date, first_payment_date, contract_terms, special_conditions)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
```

### Disbursement Insert
```sql
INSERT INTO disbursements (contract_id, disbursement_number, amount, disbursement_method,
    recipient_account_number, recipient_account_name, recipient_bank_code, scheduled_date)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);
```

### Repayment Schedule Insert
```sql
INSERT INTO repayment_schedules (contract_id, total_installments, frequency,
    total_principal, total_interest, total_amount, outstanding_balance)
VALUES (?, ?, ?, ?, ?, ?, ?);
```

### Installment Insert
```sql
INSERT INTO installments (schedule_id, installment_number, due_date, principal_amount,
    interest_amount, total_amount, opening_balance, closing_balance)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);
```

### Payment Insert
```sql
INSERT INTO payments (installment_id, schedule_id, contract_id, payment_number, amount,
    principal_portion, interest_portion, penalty_portion, payment_method,
    transaction_reference, payment_date)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
```

### Notification Insert
```sql
INSERT INTO notifications (user_id, title, message, type, is_read, link)
VALUES (?, ?, ?, ?, ?, ?);
```

### Support Ticket Insert
```sql
INSERT INTO support_tickets (user_id, subject, description, status, priority, category, assigned_to)
VALUES (?, ?, ?, ?, ?, ?, ?);
```

### Ticket Message Insert
```sql
INSERT INTO ticket_messages (ticket_id, sender_id, message, sender_type, is_read, created_at)
VALUES (?, ?, ?, ?, ?, NOW());
```

### Bank Insert
```sql
INSERT INTO Banks (name, code, swift_code, head_office_address, contact_email,
    contact_phone, is_active)
VALUES (?, ?, ?, ?, ?, ?, ?);
```

### Branch Insert
```sql
INSERT INTO Branches (bank_id, branch_name, branch_code, ifsc_code, address,
    city, state, postal_code, phone, email, is_active)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
```

### Product Insert
```sql
INSERT INTO products (bank_id, name, code, product_type, description, min_amount, max_amount,
    min_term_months, max_term_months, base_interest_rate, processing_fee_percent,
    requires_collateral, min_credit_score, max_ltv_percent, max_dti_percent)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
```

### Analytics Event Insert
```sql
INSERT INTO analytics_events (user_id, event_type, event_category, event_action,
    page_path, session_id, user_agent, ip_address, event_metadata)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
```

---

## UPDATE Queries

### User Update
```sql
UPDATE users SET email = ?, full_name = ?, phone = ?, role = ?, status = ?,
    updated_at = NOW() WHERE id = ?;
```

### Application Updates
```sql
-- Update application status
UPDATE Applications SET status = ?, updated_at = NOW() WHERE id = ?;

-- Update application details
UPDATE Applications SET product_id = ?, branch_id = ?, requested_amount = ?,
    requested_term_months = ?, purpose = ?, updated_at = NOW() WHERE id = ?;

-- Assign banker
UPDATE Applications SET assigned_banker_id = ?, updated_at = NOW() WHERE id = ?;

-- Assign verifier
UPDATE Applications SET assigned_verifier_id = ?, updated_at = NOW() WHERE id = ?;

-- Assign underwriter
UPDATE Applications SET assigned_underwriter_id = ?, updated_at = NOW() WHERE id = ?;

-- Add note to application
UPDATE Applications SET notes = CONCAT(COALESCE(notes, ''), ?, '\n'), updated_at = NOW() WHERE id = ?;
```

### Loan Update
```sql
UPDATE loans SET amount = ?, interest_rate = ?, term_months = ?,
    monthly_payment = ?, total_payable = ?, amount_paid = ?, remaining_balance = ?,
    status = ?, purpose = ?, start_date = ?, end_date = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?;
```

### Wallet Update
```sql
UPDATE wallets SET balance = ?, currency = ?, status = ?,
    updated_at = CURRENT_TIMESTAMP WHERE id = ?;
```

### Transaction Update
```sql
UPDATE transactions SET type = ?, amount = ?, description = ?, status = ? WHERE id = ?;
```

### Document Updates
```sql
-- Update document details
UPDATE documents SET document_type = ?, file_name = ?, verification_status = ?,
    expiry_date = ? WHERE id = ?;

-- Verify document
UPDATE documents SET verification_status = ?, verified_by = ?,
    verified_at = NOW(), verification_notes = ? WHERE id = ?;
```

### Verification Update
```sql
UPDATE Verifications SET verification_type = ?, kyc_status = ?, aml_status = ?,
    verification_method = ?, comments = ?, completed_at = NOW(), updated_at = NOW() WHERE id = ?;
```

### Risk Assessment Update
```sql
UPDATE RiskAssessments SET dti_ratio = ?, ltv_ratio = ?, risk_score = ?,
    risk_category = ?, recommendation = ?, assessment_notes = ?, assessed_at = NOW() WHERE id = ?;
```

### Offer Updates
```sql
-- Update offer details
UPDATE offers SET approved_amount = ?, interest_rate = ?, term_months = ?,
    monthly_payment = ?, conditions = ?, valid_until = ?, updated_at = NOW() WHERE id = ?;

-- Update offer status
UPDATE offers SET status = ?, responded_at = NOW() WHERE id = ?;

-- Reject offer
UPDATE offers SET status = 'REJECTED', response_notes = ?, responded_at = NOW() WHERE id = ?;
```

### Contract Updates
```sql
-- Update contract status
UPDATE contracts SET status = ?, updated_at = NOW() WHERE id = ?;

-- Update contract details
UPDATE contracts SET status = ?, contract_terms = ?, special_conditions = ?,
    updated_at = NOW() WHERE id = ?;

-- Sign contract (applicant)
UPDATE contracts SET signed_by_applicant = TRUE, applicant_signature_date = NOW(),
    updated_at = NOW() WHERE id = ?;

-- Sign contract (bank)
UPDATE contracts SET signed_by_bank = TRUE, bank_representative_id = ?,
    bank_signature_date = NOW(), updated_at = NOW() WHERE id = ?;
```

### Disbursement Updates
```sql
-- Update disbursement status
UPDATE disbursements SET status = ?, updated_at = NOW() WHERE id = ?;

-- Complete disbursement
UPDATE disbursements SET status = 'COMPLETED', disbursed_at = NOW(),
    processed_by = ?, transaction_reference = ?, updated_at = NOW() WHERE id = ?;

-- Update disbursement details
UPDATE disbursements SET amount = ?, disbursement_method = ?,
    recipient_account_number = ?, recipient_bank_code = ?,
    scheduled_date = ?, updated_at = NOW() WHERE id = ?;
```

### Repayment Schedule Update
```sql
-- Update schedule totals
UPDATE repayment_schedules SET total_installments = ?, frequency = ?,
    total_principal = ?, total_interest = ?, total_amount = ?,
    amount_paid = ?, principal_paid = ?, interest_paid = ?,
    outstanding_balance = ?, updated_at = NOW() WHERE id = ?;

-- Update payment progress
UPDATE repayment_schedules SET
    amount_paid = amount_paid + ?,
    principal_paid = principal_paid + ?,
    interest_paid = interest_paid + ?,
    outstanding_balance = outstanding_balance - ?,
    updated_at = NOW()
WHERE id = ?;
```

### Installment Updates
```sql
-- Update installment details
UPDATE installments SET due_date = ?, principal_amount = ?, interest_amount = ?,
    total_amount = ?, opening_balance = ?, closing_balance = ?,
    updated_at = NOW() WHERE id = ?;

-- Record payment on installment
UPDATE installments SET amount_paid = amount_paid + ?,
    principal_paid = principal_paid + ?,
    interest_paid = interest_paid + ?,
    status = ?, paid_date = ?,
    updated_at = NOW()
WHERE id = ?;

-- Update installment status
UPDATE installments SET status = ?, updated_at = NOW() WHERE id = ?;

-- Add penalty
UPDATE installments SET penalty_amount = penalty_amount + ?,
    days_overdue = ?, updated_at = NOW() WHERE id = ?;
```

### Payment Update
```sql
UPDATE payments SET amount = ?, principal_portion = ?, interest_portion = ?,
    penalty_portion = ?, payment_method = ?, status = ?, notes = ? WHERE id = ?;
```

### Notification Updates
```sql
-- Mark notification as read
UPDATE notifications SET is_read = true WHERE id = ?;

-- Mark notification as read/unread
UPDATE notifications SET is_read = ? WHERE id = ?;

-- Mark all user notifications as read
UPDATE notifications SET is_read = true WHERE user_id = ?;
```

### Support Ticket Update
```sql
UPDATE support_tickets SET subject = ?, description = ?, status = ?, priority = ?,
    category = ?, assigned_to = ?, resolution = ?, updated_at = NOW() WHERE id = ?;
```

### Ticket Message Updates
```sql
-- Mark message as read
UPDATE ticket_messages SET is_read = TRUE WHERE id = ?;

-- Mark all ticket messages as read (except sender's own messages)
UPDATE ticket_messages SET is_read = TRUE WHERE ticket_id = ? AND sender_type != ?;

-- Update message
UPDATE ticket_messages SET message = ?, is_read = ? WHERE id = ?;
```

### Bank Update
```sql
UPDATE Banks SET name = ?, code = ?, swift_code = ?, head_office_address = ?,
    contact_email = ?, contact_phone = ?, is_active = ?, updated_at = NOW() WHERE id = ?;
```

### Branch Update
```sql
UPDATE Branches SET bank_id = ?, branch_name = ?, branch_code = ?, ifsc_code = ?,
    address = ?, city = ?, state = ?, postal_code = ?, phone = ?, email = ?,
    is_active = ?, updated_at = NOW() WHERE id = ?;
```

### Product Update
```sql
UPDATE products SET bank_id = ?, name = ?, code = ?, product_type = ?, description = ?,
    min_amount = ?, max_amount = ?, min_term_months = ?, max_term_months = ?,
    base_interest_rate = ?, processing_fee_percent = ?, requires_collateral = ?,
    min_credit_score = ?, max_ltv_percent = ?, max_dti_percent = ?, status = ?,
    updated_at = NOW() WHERE id = ?;
```

### Applicant Update
```sql
UPDATE Applicants SET date_of_birth = ?, national_id = ?, address = ?,
    city = ?, state = ?, postal_code = ?, country = ?, employment_status = ?,
    employer_name = ?, occupation = ?, monthly_income = ?, monthly_expenses = ?,
    existing_debts = ?, credit_score = ?, kyc_status = ?, aml_status = ?,
    updated_at = NOW() WHERE id = ?;
```

---

## DELETE Queries

```sql
-- Delete user
DELETE FROM users WHERE id = ?;

-- Delete applicant
DELETE FROM Applicants WHERE id = ?;

-- Delete application
DELETE FROM Applications WHERE id = ?;

-- Delete loan
DELETE FROM loans WHERE id = ?;

-- Delete wallet
DELETE FROM wallets WHERE id = ?;

-- Delete transaction
DELETE FROM transactions WHERE id = ?;

-- Delete document
DELETE FROM documents WHERE id = ?;

-- Delete verification
DELETE FROM Verifications WHERE id = ?;

-- Delete risk assessment
DELETE FROM RiskAssessments WHERE id = ?;

-- Delete offer
DELETE FROM offers WHERE id = ?;

-- Delete contract
DELETE FROM contracts WHERE id = ?;

-- Delete disbursement
DELETE FROM disbursements WHERE id = ?;

-- Delete repayment schedule
DELETE FROM repayment_schedules WHERE id = ?;

-- Delete installment
DELETE FROM installments WHERE id = ?;

-- Delete payment
DELETE FROM payments WHERE id = ?;

-- Delete notification
DELETE FROM notifications WHERE id = ?;

-- Delete support ticket
DELETE FROM support_tickets WHERE id = ?;

-- Delete ticket message
DELETE FROM ticket_messages WHERE id = ?;

-- Delete all messages for ticket
DELETE FROM ticket_messages WHERE ticket_id = ?;

-- Delete bank
DELETE FROM Banks WHERE id = ?;

-- Delete branch
DELETE FROM Branches WHERE id = ?;

-- Delete product
DELETE FROM products WHERE id = ?;

-- Delete old analytics events
DELETE FROM analytics_events WHERE created_at < ?;
```

---

## Aggregate & Analytics Queries

### Loan Statistics
```sql
-- Total disbursed amount
SELECT COALESCE(SUM(amount), 0) as total_disbursed
FROM loans WHERE status IN ('ACTIVE', 'COMPLETED');

-- Average loan amount
SELECT AVG(amount) as avg_loan_amount FROM loans;

-- Loans by status count
SELECT status, COUNT(*) as count FROM loans GROUP BY status;

-- Total outstanding balance
SELECT SUM(remaining_balance) as total_outstanding FROM loans WHERE status = 'ACTIVE';
```

### Application Statistics
```sql
-- Applications by status
SELECT status, COUNT(*) as count FROM applications GROUP BY status;

-- Applications by month
SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count
FROM applications GROUP BY month ORDER BY month DESC;

-- Approval rate
SELECT
    COUNT(CASE WHEN status IN ('APPROVED', 'DISBURSED', 'ACTIVE') THEN 1 END) * 100.0 / COUNT(*) as approval_rate
FROM applications WHERE status NOT IN ('DRAFT', 'WITHDRAWN');
```

### Payment Analytics
```sql
-- Total payments received
SELECT SUM(amount) as total_payments FROM payments WHERE status = 'COMPLETED';

-- Payments by method
SELECT payment_method, COUNT(*) as count, SUM(amount) as total
FROM payments WHERE status = 'COMPLETED'
GROUP BY payment_method;

-- Payments this month
SELECT SUM(amount) as monthly_total
FROM payments
WHERE status = 'COMPLETED'
    AND MONTH(payment_date) = MONTH(CURRENT_DATE)
    AND YEAR(payment_date) = YEAR(CURRENT_DATE);
```

### User Analytics
```sql
-- Users by role
SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- Active users
SELECT COUNT(*) as active_users FROM users WHERE status = 'ACTIVE';

-- New registrations this month
SELECT COUNT(*) as new_users
FROM users
WHERE MONTH(created_at) = MONTH(CURRENT_DATE)
    AND YEAR(created_at) = YEAR(CURRENT_DATE);
```

### Risk Analytics
```sql
-- Applications by risk category
SELECT risk_category, COUNT(*) as count
FROM risk_assessments
GROUP BY risk_category ORDER BY count DESC;

-- Average credit score
SELECT AVG(credit_score) as avg_credit_score FROM risk_assessments;

-- High risk applications
SELECT COUNT(*) as high_risk_count
FROM risk_assessments
WHERE risk_category IN ('HIGH', 'VERY_HIGH');
```

### Page View Analytics
```sql
-- Top pages by views
SELECT page_path, COUNT(*) as views
FROM analytics_events
WHERE event_type = 'page_view' AND created_at >= ?
GROUP BY page_path ORDER BY views DESC LIMIT 10;

-- Events by type
SELECT event_type, COUNT(*) as count
FROM analytics_events
WHERE created_at >= ?
GROUP BY event_type ORDER BY count DESC;
```

---

## Sample Data (DML)

### Sample Users
```sql
-- Default password: password123 (BCrypt hashed)
INSERT INTO users (email, password, full_name, phone, role, status) VALUES
('admin@loanweb.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'Admin User', '0344612654', 'ADMIN', 'ACTIVE'),
('john.doe@example.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'John Doe', '0767178267', 'USER', 'ACTIVE'),
('jane.smith@example.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'Jane Smith', '0363681624', 'USER', 'ACTIVE'),
('bob.johnson@example.com', '$2a$10$rqKjLHEGFSNdlU7SLLEaUOvlqOIrKRzPpPqmMG5Z5bYnWHLEoP2Na', 'Bob Johnson', '0902628125', 'USER', 'ACTIVE');
```

### Sample Wallets
```sql
INSERT INTO wallets (user_id, balance, currency, status) VALUES
(1, 50000.00, 'USD', 'ACTIVE'),
(2, 10500.50, 'USD', 'ACTIVE'),
(3, 25000.00, 'USD', 'ACTIVE'),
(4, 5000.00, 'USD', 'ACTIVE');
```

### Sample Loans
```sql
INSERT INTO loans (user_id, amount, interest_rate, term_months, monthly_payment, total_payable, amount_paid, remaining_balance, status, purpose, start_date, end_date) VALUES
(2, 10000.00, 5.50, 12, 858.33, 10300.00, 2575.00, 7725.00, 'ACTIVE', 'Personal loan for home renovation', '2024-01-15', '2025-01-15'),
(2, 5000.00, 6.00, 24, 221.60, 5318.40, 0.00, 5318.40, 'PENDING', 'Education loan', NULL, NULL),
(3, 20000.00, 5.00, 36, 599.42, 21579.00, 11988.00, 9591.00, 'ACTIVE', 'Business expansion loan', '2023-06-01', '2026-06-01'),
(4, 3000.00, 7.00, 6, 511.50, 3069.00, 3069.00, 0.00, 'COMPLETED', 'Emergency medical loan', '2024-05-01', '2024-11-01');
```

### Sample Transactions
```sql
INSERT INTO transactions (user_id, loan_id, wallet_id, type, amount, description, status, reference_number) VALUES
(2, 1, 2, 'LOAN_DISBURSEMENT', 10000.00, 'Loan #1 disbursed to wallet', 'COMPLETED', 'TXN-20240115-001'),
(2, 1, 2, 'LOAN_PAYMENT', -858.33, 'Monthly payment for Loan #1', 'COMPLETED', 'TXN-20240215-002'),
(3, 3, 3, 'LOAN_DISBURSEMENT', 20000.00, 'Loan #3 disbursed to wallet', 'COMPLETED', 'TXN-20230601-005'),
(3, NULL, 3, 'DEPOSIT', 5000.00, 'Wallet deposit via bank transfer', 'COMPLETED', 'TXN-20241020-006');
```

### Sample Support Tickets
```sql
INSERT INTO support_tickets (user_id, subject, description, status, priority, category, assigned_to) VALUES
(2, 'Question about loan approval', 'I applied for a loan 3 days ago. When will it be approved?', 'OPEN', 'MEDIUM', 'LOAN_INQUIRY', 1),
(3, 'Unable to make payment', 'The payment button is not working on my loan page', 'IN_PROGRESS', 'HIGH', 'TECHNICAL', 1),
(4, 'Request for loan statement', 'I need a statement for my completed loan for tax purposes', 'RESOLVED', 'LOW', 'DOCUMENT_REQUEST', 1);
```

### Sample Notifications
```sql
INSERT INTO notifications (user_id, title, message, type, is_read, link) VALUES
(2, 'Loan Application Received', 'Your loan application for $5,000 has been received and is under review.', 'LOAN', FALSE, '/loans'),
(2, 'Payment Due Soon', 'Your loan payment of $858.33 is due on 2024-05-15.', 'PAYMENT', FALSE, '/loans/1'),
(3, 'Payment Received', 'We have received your payment of $599.42. Thank you!', 'PAYMENT', TRUE, '/transactions'),
(4, 'Loan Completed', 'Congratulations! Your loan #4 has been fully paid off.', 'LOAN', TRUE, '/loans/4');
```

---

## Indexes

### Performance Indexes
```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Application indexes
CREATE INDEX idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX idx_applications_product_id ON applications(product_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_application_number ON applications(application_number);
CREATE INDEX idx_applications_submitted_at ON applications(submitted_at);

-- Loan indexes
CREATE INDEX idx_loans_user_id ON loans(user_id);
CREATE INDEX idx_loans_status ON loans(status);

-- Transaction indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_loan_id ON transactions(loan_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Wallet indexes
CREATE INDEX idx_wallets_user_id ON wallets(user_id);

-- Document indexes
CREATE INDEX idx_documents_application_id ON documents(application_id);
CREATE INDEX idx_documents_document_type ON documents(document_type);
CREATE INDEX idx_documents_verification_status ON documents(verification_status);

-- Installment indexes
CREATE INDEX idx_installments_schedule_id ON installments(schedule_id);
CREATE INDEX idx_installments_due_date ON installments(due_date);
CREATE INDEX idx_installments_status ON installments(status);

-- Payment indexes
CREATE INDEX idx_payments_installment_id ON payments(installment_id);
CREATE INDEX idx_payments_schedule_id ON payments(schedule_id);
CREATE INDEX idx_payments_contract_id ON payments(contract_id);
CREATE INDEX idx_payments_payment_number ON payments(payment_number);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
CREATE INDEX idx_payments_status ON payments(status);

-- Notification indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Support ticket indexes
CREATE INDEX idx_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_tickets_priority ON support_tickets(priority);
```

---

## Query Optimization Tips

### Use Parameterized Queries (Prevents SQL Injection)
```java
// Good - Parameterized
String sql = "SELECT * FROM users WHERE email = ?";
jdbcTemplate.query(sql, userRowMapper, email);

// Bad - String concatenation (vulnerable to SQL injection)
String sql = "SELECT * FROM users WHERE email = '" + email + "'";
```

### Use Appropriate Indexes
```sql
-- Before: Slow query
SELECT * FROM applications WHERE status = 'PENDING';

-- After: Add index
CREATE INDEX idx_applications_status ON applications(status);

-- Result: Fast query using index
```

### Limit Result Sets
```sql
-- Instead of fetching all
SELECT * FROM applications;

-- Use LIMIT for pagination
SELECT * FROM applications ORDER BY created_at DESC LIMIT 20 OFFSET 0;
```

### Use JOINs Instead of Multiple Queries
```sql
-- Instead of N+1 queries
-- Query 1: Get applications
SELECT * FROM applications;
-- Query 2-N: For each application, get applicant
SELECT * FROM applicants WHERE id = ?;

-- Use JOIN
SELECT a.*, ap.* FROM applications a
LEFT JOIN applicants ap ON a.applicant_id = ap.id;
```

### Use Aggregate Functions
```sql
-- Instead of fetching all and counting in code
List<Application> apps = findAll();
int count = apps.size();

-- Use COUNT in database
SELECT COUNT(*) FROM applications;
```

---

**End of SQL Queries Reference**
**Total Queries Documented:** 150+
**Last Updated:** November 26, 2025
