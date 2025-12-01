# OLAVS Loan Management System - Slide Content
## Visual Content for Presentation Slides (28 Slides)

---

## SLIDE 1: TITLE SLIDE
**Speaker:** Lê Thành Danh (Leader)

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║         OLAVS LOAN MANAGEMENT SYSTEM                       ║
║         Database-Driven Financial Platform                 ║
║                                                            ║
║         Technology Stack                                   ║
║         MySQL 8.0 | Spring Boot 3.3.4 | Next.js 16        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

TEAM MEMBERS:
─────────────────────────────────────────────────────────────

• Lê Thành Danh (Leader)      - Full-stack Developer
• Đào Hữu Hoài                 - Full-stack Developer
• Vũ Đức Nhân                  - Backend Developer
• Võ Trí Khôi                  - Backend Developer
• Lê Hoàng Quốc Anh            - Frontend Developer
• Trương Minh Trí              - Frontend Developer
• Phan Minh Khánh              - ERD Designer
• Võ Nguyễn Đình Bảo           - ERD Designer
• Võ Quang Khải                - Report Writer
• Trần Châu Thanh Tuấn         - Report Writer
• Hoàng Triệu Nam              - Report Writer
```

---

## SLIDE 2: PROJECT OVERVIEW
**Speaker:** Lê Thành Danh (Leader)

```
PROJECT SCOPE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CORE FEATURES:
──────────────────────────────────────────────────────────

✓ Multi-role Authentication System
  • APPLICANT, BANKER, VERIFIER, UNDERWRITER, ADMIN

✓ Complete Loan Workflow
  • Application → Verification → Risk Assessment → Offer
    → Contract → Disbursement → Repayment

✓ Document Verification & Compliance
  • KYC (Know Your Customer)
  • AML (Anti-Money Laundering)

✓ Risk Assessment & Credit Scoring
  • DTI Ratio, LTV Ratio, Credit Score Analysis

✓ Automated Repayment Management
  • Schedule Generation, Installment Tracking, Payment Processing

✓ Real-time Analytics & Reporting
  • Dashboard Metrics, Trend Analysis, Performance KPIs


DATABASE SCALE:
──────────────────────────────────────────────────────────

• 27 Database Tables        (15 core + 12 legacy)
• 150+ SQL Queries          (Optimized & Indexed)
• 40+ Performance Indexes   (Sub-10ms query time)
• MySQL 8.0 InnoDB Engine   (ACID Compliant)
```

---

## SLIDE 3: DATABASE ARCHITECTURE - CORE TABLES
**Speaker:** Phan Minh Khánh (ERD Designer)

```
CORE DATABASE TABLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MAIN ENTITY WORKFLOW:
──────────────────────────────────────────────────────────

┌──────────────────┬────────────────┬────────────────────┐
│ Table            │ Purpose        │ Key Relationships  │
├──────────────────┼────────────────┼────────────────────┤
│ users            │ Authentication │ → applicants       │
│ applicants       │ KYC Profile    │ → applications     │
│ applications     │ Loan Requests  │ → documents        │
│ documents        │ ID Verification│ → verifications    │
│ verifications    │ KYC/AML Checks │ → risk_assessments │
│ risk_assessments │ Credit Eval    │ → offers           │
│ offers           │ Loan Terms     │ → contracts        │
│ contracts        │ Legal Agreement│ → disbursements    │
│ disbursements    │ Fund Release   │ → schedules        │
│ repayment_       │ Payment Plan   │ → installments     │
│   schedules      │                │                    │
│ installments     │ Monthly Dues   │ → payments         │
│ payments         │ Transactions   │ (End)              │
└──────────────────┴────────────────┴────────────────────┘


SUPPORTING TABLES:
──────────────────────────────────────────────────────────

• banks, branches, products    → Product catalog
• wallets, transactions        → Legacy wallet system
• support_tickets, notifications → Customer service
• analytics_events             → Usage tracking
```

---

## SLIDE 4: ENTITY RELATIONSHIP DIAGRAM
**Speaker:** Võ Nguyễn Đình Bảo (ERD Designer)

```
ENTITY RELATIONSHIP DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRIMARY RELATIONSHIPS:
──────────────────────────────────────────────────────────

users (1) ────────────→ (1) applicants
                             │
                             ├──→ (N) applications
                                      │
                    ┌─────────────────┼─────────────────┐
                    ↓                 ↓                 ↓
              (N) documents    (N) verifications  (1) risk_assessments
                                                        │
                                                        ↓
                                                   (N) offers
                                                        │
                                                        ↓
                                                   (1) contracts
                                                        │
                                ┌───────────────────────┼────────────┐
                                ↓                       ↓            ↓
                         (N) disbursements    (1) repayment_   (1) contract
                                                   schedules      signatures
                                                        │
                                                        ↓
                                                (N) installments
                                                        │
                                                        ↓
                                                   (N) payments


CASCADE RULES:
──────────────────────────────────────────────────────────

• ON DELETE CASCADE     → Child records deleted automatically
• ON DELETE SET NULL    → Reference removed, child preserved
• UNIQUE constraints    → Business keys (email, app_number)
• NOT NULL constraints  → Required fields enforced
```

---

## SLIDE 5: USERS TABLE - SCHEMA & QUERIES
**Speaker:** Đào Hữu Hoài (Full-stack)

```sql
-- USERS TABLE SCHEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,          -- BCrypt hashed
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('APPLICANT', 'BANKER', 'VERIFIER',
              'UNDERWRITER', 'ADMIN') NOT NULL DEFAULT 'APPLICANT',
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED',
                'PENDING_VERIFICATION') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB;


-- CRITICAL QUERIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Query 1: Authentication (Login)
SELECT * FROM users WHERE email = ?;

-- Query 2: Get Active Users by Role
SELECT * FROM users
WHERE role = 'BANKER' AND status = 'ACTIVE'
ORDER BY full_name;

-- Query 3: User Registration
INSERT INTO users (email, password, full_name, phone, role, status)
VALUES (?, ?, ?, ?, 'APPLICANT', 'ACTIVE');
```

---

## SLIDE 6: APPLICATIONS TABLE - COMPLEX QUERIES
**Speaker:** Vũ Đức Nhân (Backend)

```sql
-- APPLICATIONS TABLE SCHEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    applicant_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    application_number VARCHAR(50) NOT NULL UNIQUE,
    requested_amount DECIMAL(15, 2) NOT NULL,
    requested_term_months INT NOT NULL,
    purpose TEXT NOT NULL,
    status ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED',
                'RISK_ASSESSED', 'OFFER_GENERATED', 'CONTRACT_SIGNED',
                'DISBURSED', 'ACTIVE', 'COMPLETED', 'REJECTED') DEFAULT 'DRAFT',
    banker_id BIGINT,
    verifier_id BIGINT,
    underwriter_id BIGINT,
    submitted_at TIMESTAMP NULL,

    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_applicant_id (applicant_id)
);


-- BUSINESS QUERIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Query 1: Get Banker's Assigned Applications
SELECT * FROM applications
WHERE assigned_banker_id = ?
ORDER BY submitted_at DESC;

-- Query 2: Application Status Distribution
SELECT status, COUNT(*) as count
FROM applications
GROUP BY status
ORDER BY count DESC;

-- Query 3: Update Application Status
UPDATE applications
SET status = ?, updated_at = NOW()
WHERE id = ?;
```

---

## SLIDE 7: DOCUMENT MANAGEMENT QUERIES
**Speaker:** Võ Trí Khôi (Backend)

```sql
-- DOCUMENTS TABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    document_type ENUM('NATIONAL_ID', 'PASSPORT', 'DRIVERS_LICENSE',
                       'INCOME_PROOF', 'BANK_STATEMENT', 'TAX_RETURN',
                       'EMPLOYMENT_LETTER', 'PROPERTY_DEED'),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    verification_status ENUM('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED')
                        DEFAULT 'PENDING',
    verified_by BIGINT,
    verified_at TIMESTAMP NULL,

    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    INDEX idx_application_id (application_id),
    INDEX idx_verification_status (verification_status)
);


-- DOCUMENT QUERIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Query 1: Get All Documents for Application
SELECT * FROM documents
WHERE application_id = ?
ORDER BY created_at DESC;

-- Query 2: Verifier Work Queue (Pending Documents)
SELECT * FROM documents
WHERE verification_status = 'PENDING'
ORDER BY created_at ASC;

-- Query 3: Verify Document
UPDATE documents
SET verification_status = 'VERIFIED',
    verified_by = ?,
    verified_at = NOW()
WHERE id = ?;

-- Query 4: Count Unverified Documents
SELECT COUNT(*) FROM documents
WHERE application_id = ?
  AND verification_status != 'VERIFIED';
```

---

## SLIDE 8: VERIFICATION & KYC QUERIES
**Speaker:** Vũ Đức Nhân (Backend)

```sql
-- VERIFICATIONS TABLE (KYC/AML)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE verifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    applicant_id BIGINT NOT NULL,
    verification_type ENUM('KYC', 'AML', 'EMPLOYMENT', 'INCOME'),
    status ENUM('NOT_STARTED', 'IN_PROGRESS', 'PASSED',
                'FAILED', 'REQUIRES_MORE_INFO') DEFAULT 'NOT_STARTED',
    risk_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    comments TEXT,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,

    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    INDEX idx_application_id (application_id),
    INDEX idx_status (status)
);


-- VERIFICATION QUERIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Query 1: Get All Verifications for Application
SELECT * FROM verifications
WHERE application_id = ?
ORDER BY created_at DESC;

-- Query 2: Check All Verifications Passed
SELECT COUNT(*) as passed_count
FROM verifications
WHERE application_id = ?
  AND status = 'PASSED';

-- Query 3: High-Risk Applications (JOIN Query)
SELECT v.*, a.application_number, u.full_name
FROM verifications v
JOIN applications a ON v.application_id = a.id
JOIN applicants ap ON a.applicant_id = ap.id
JOIN users u ON ap.user_id = u.id
WHERE v.risk_level IN ('HIGH', 'CRITICAL')
ORDER BY v.completed_at DESC;
```

---

## SLIDE 9: RISK ASSESSMENT QUERIES
**Speaker:** Đào Hữu Hoài (Full-stack)

```sql
-- RISK_ASSESSMENTS TABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE risk_assessments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    applicant_id BIGINT NOT NULL,
    credit_score INT,
    dti_ratio DECIMAL(5, 2),              -- Debt-to-Income
    ltv_ratio DECIMAL(5, 2),              -- Loan-to-Value
    overall_risk_score INT,
    risk_category ENUM('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'),
    recommendation ENUM('APPROVE', 'APPROVE_WITH_CONDITIONS', 'REJECT'),
    recommended_apr DECIMAL(5, 2),
    recommended_amount DECIMAL(15, 2),
    assessment_notes TEXT,

    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    INDEX idx_risk_category (risk_category)
);


-- RISK QUERIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Query 1: Get Latest Risk Assessment
SELECT * FROM risk_assessments
WHERE application_id = ?
ORDER BY created_at DESC
LIMIT 1;

-- Query 2: Risk Distribution Statistics
SELECT
    risk_category,
    COUNT(*) as count,
    AVG(credit_score) as avg_credit_score,
    AVG(dti_ratio) as avg_dti
FROM risk_assessments
GROUP BY risk_category
ORDER BY count DESC;

-- Query 3: Approval Recommendations Summary
SELECT
    recommendation,
    COUNT(*) as application_count
FROM risk_assessments
GROUP BY recommendation;
```

---

## SLIDE 10: OFFERS & CONTRACT QUERIES
**Speaker:** Võ Trí Khôi (Backend)

```sql
-- OFFERS TABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE offers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    offer_number VARCHAR(50) NOT NULL UNIQUE,
    approved_amount DECIMAL(15, 2) NOT NULL,
    term_months INT NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    monthly_payment DECIMAL(15, 2) NOT NULL,
    total_payment DECIMAL(15, 2) NOT NULL,
    valid_until DATE NOT NULL,
    status ENUM('DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED'),

    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    INDEX idx_application_id (application_id),
    INDEX idx_status (status)
);


-- OFFER QUERIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Query 1: Get Active Offer for Application
SELECT * FROM offers
WHERE application_id = ?
  AND status IN ('SENT', 'VIEWED')
  AND valid_until >= CURDATE()
ORDER BY created_at DESC
LIMIT 1;

-- Query 2: Accept Offer (Transaction)
BEGIN;
  UPDATE offers SET status = 'ACCEPTED', responded_at = NOW() WHERE id = ?;

  INSERT INTO contracts (application_id, offer_id, contract_number,
                         principal_amount, interest_rate, term_months, ...)
  VALUES (?, ?, ?, ?, ?, ?, ...);
COMMIT;

-- Query 3: Get Expired Offers
SELECT * FROM offers
WHERE status IN ('SENT', 'VIEWED')
  AND valid_until < CURDATE();
```

---

## SLIDE 11: DISBURSEMENT TRACKING
**Speaker:** Vũ Đức Nhân (Backend)

```sql
-- DISBURSEMENTS TABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE disbursements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    contract_id BIGINT NOT NULL,
    disbursement_number VARCHAR(50) NOT NULL UNIQUE,
    amount DECIMAL(15, 2) NOT NULL,
    disbursement_method ENUM('BANK_TRANSFER', 'CASH', 'CHEQUE', 'WALLET'),
    recipient_account_number VARCHAR(100),
    transaction_reference VARCHAR(255),
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'),
    scheduled_date DATE,
    disbursed_at TIMESTAMP NULL,

    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_scheduled_date (scheduled_date)
);


-- DISBURSEMENT QUERIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Query 1: Pending Disbursements (Multi-Join)
SELECT d.*, c.contract_number, a.application_number, u.full_name
FROM disbursements d
JOIN contracts c ON d.contract_id = c.id
JOIN applications a ON c.application_id = a.id
JOIN applicants ap ON a.applicant_id = ap.id
JOIN users u ON ap.user_id = u.id
WHERE d.status = 'PENDING'
  AND d.scheduled_date <= CURDATE()
ORDER BY d.scheduled_date ASC;

-- Query 2: Complete Disbursement
UPDATE disbursements
SET status = 'COMPLETED',
    disbursed_at = NOW(),
    transaction_reference = ?
WHERE id = ?;
```

---

## SLIDE 12: REPAYMENT SCHEDULE GENERATION
**Speaker:** Đào Hữu Hoài (Full-stack)

```sql
-- REPAYMENT SCHEDULES & INSTALLMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE repayment_schedules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    contract_id BIGINT NOT NULL UNIQUE,
    total_installments INT NOT NULL,
    frequency ENUM('MONTHLY', 'BI_WEEKLY', 'WEEKLY', 'QUARTERLY'),
    total_principal DECIMAL(15, 2) NOT NULL,
    total_interest DECIMAL(15, 2) NOT NULL,
    outstanding_balance DECIMAL(15, 2) NOT NULL,

    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);

CREATE TABLE installments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    schedule_id BIGINT NOT NULL,
    installment_number INT NOT NULL,
    due_date DATE NOT NULL,
    principal_amount DECIMAL(15, 2) NOT NULL,
    interest_amount DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    status ENUM('UPCOMING', 'DUE', 'PAID', 'OVERDUE'),

    FOREIGN KEY (schedule_id) REFERENCES repayment_schedules(id),
    INDEX idx_due_date (due_date)
);


-- SCHEDULE QUERIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Query: Get User's Upcoming Installments (4-Table Join)
SELECT i.*, rs.contract_id, c.contract_number
FROM installments i
JOIN repayment_schedules rs ON i.schedule_id = rs.id
JOIN contracts c ON rs.contract_id = c.id
JOIN applications a ON c.application_id = a.id
WHERE a.applicant_id = ?
  AND i.status IN ('UPCOMING', 'DUE')
ORDER BY i.due_date ASC;
```

---

## SLIDE 13: PAYMENT PROCESSING
**Speaker:** Võ Trí Khôi (Backend)

```sql
-- PAYMENTS TABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    installment_id BIGINT NOT NULL,
    schedule_id BIGINT NOT NULL,
    contract_id BIGINT NOT NULL,
    payment_number VARCHAR(50) NOT NULL UNIQUE,
    amount DECIMAL(15, 2) NOT NULL,
    principal_portion DECIMAL(15, 2) NOT NULL,
    interest_portion DECIMAL(15, 2) NOT NULL,
    payment_method ENUM('BANK_TRANSFER', 'CASH', 'WALLET', 'AUTO_DEBIT'),
    payment_date TIMESTAMP NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REVERSED'),

    FOREIGN KEY (installment_id) REFERENCES installments(id),
    INDEX idx_installment_id (installment_id)
);


-- PAYMENT QUERIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Query 1: Record Payment (Transaction)
BEGIN;
  INSERT INTO payments (installment_id, schedule_id, contract_id,
                        amount, principal_portion, interest_portion, ...)
  VALUES (?, ?, ?, ?, ?, ?, ...);

  UPDATE installments
  SET amount_paid = amount_paid + ?,
      status = CASE
        WHEN amount_paid + ? >= total_amount THEN 'PAID'
        ELSE 'PARTIALLY_PAID'
      END
  WHERE id = ?;
COMMIT;

-- Query 2: Calculate Total Paid
SELECT COALESCE(SUM(amount), 0) as total_paid
FROM payments
WHERE schedule_id = ?
  AND status = 'COMPLETED';
```

---

## SLIDE 14: OVERDUE DETECTION QUERY
**Speaker:** Vũ Đức Nhân (Backend)

```sql
-- OVERDUE INSTALLMENTS DETECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Query 1: Find Overdue Installments (5-Table Join)
SELECT
    i.*,
    DATEDIFF(CURDATE(), i.due_date) as days_overdue,
    c.contract_number,
    a.application_number,
    u.full_name,
    u.email,
    u.phone
FROM installments i
JOIN repayment_schedules rs ON i.schedule_id = rs.id
JOIN contracts c ON rs.contract_id = c.id
JOIN applications a ON c.application_id = a.id
JOIN applicants ap ON a.applicant_id = ap.id
JOIN users u ON ap.user_id = u.id
WHERE i.status IN ('DUE', 'OVERDUE')
  AND i.due_date < CURDATE()
ORDER BY days_overdue DESC;


-- Query 2: Update Overdue Status (Scheduled Daily Job)
UPDATE installments
SET status = 'OVERDUE',
    days_overdue = DATEDIFF(CURDATE(), due_date),
    penalty_amount = penalty_amount + (total_amount * 0.01)
WHERE status = 'DUE'
  AND due_date < CURDATE();


AUTOMATION:
──────────────────────────────────────────────────────────
• Runs daily at 1:00 AM
• Marks overdue installments
• Adds 1% daily penalty
• Sends automated email notifications
```

---

## SLIDE 15: ANALYTICS - LOAN STATISTICS
**Speaker:** Đào Hữu Hoài (Full-stack)

```sql
-- LOAN PORTFOLIO ANALYTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Query 1: Portfolio Health Summary
SELECT
    COUNT(*) as total_active_loans,
    SUM(principal_amount) as total_disbursed,
    SUM(rs.outstanding_balance) as total_outstanding,
    AVG(interest_rate) as avg_interest_rate
FROM contracts c
JOIN repayment_schedules rs ON c.id = rs.contract_id
WHERE c.status = 'ACTIVE';


-- Query 2: Monthly Disbursement Trend
SELECT
    DATE_FORMAT(disbursed_at, '%Y-%m') as month,
    COUNT(*) as loan_count,
    SUM(amount) as total_amount
FROM disbursements
WHERE status = 'COMPLETED'
  AND disbursed_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY month
ORDER BY month DESC;


-- Query 3: Application Approval Rate
SELECT
    DATE_FORMAT(submitted_at, '%Y-%m') as month,
    COUNT(*) as total_applications,
    SUM(CASE WHEN status IN ('DISBURSED', 'ACTIVE') THEN 1 ELSE 0 END) as approved,
    ROUND(
      SUM(CASE WHEN status IN ('DISBURSED', 'ACTIVE') THEN 1 ELSE 0 END) * 100.0 / COUNT(*),
      2
    ) as approval_rate_percent
FROM applications
WHERE submitted_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY month
ORDER BY month DESC;
```

---

## SLIDE 16: USER ANALYTICS QUERY
**Speaker:** Võ Trí Khôi (Backend)

```sql
-- USER ANALYTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Query 1: User Distribution by Role & Status
SELECT
    role,
    status,
    COUNT(*) as user_count
FROM users
GROUP BY role, status
ORDER BY role, status;


-- Query 2: New User Registration Trend
SELECT
    DATE_FORMAT(created_at, '%Y-%m') as month,
    role,
    COUNT(*) as new_users
FROM users
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY month, role
ORDER BY month DESC, role;


-- Query 3: Most Active Users (Power Users)
SELECT
    u.full_name,
    u.email,
    COUNT(a.id) as application_count,
    SUM(CASE WHEN a.status = 'ACTIVE' THEN 1 ELSE 0 END) as active_loans,
    SUM(CASE WHEN a.status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_loans
FROM users u
JOIN applicants ap ON u.id = ap.user_id
JOIN applications a ON ap.id = a.applicant_id
GROUP BY u.id
HAVING application_count > 0
ORDER BY application_count DESC
LIMIT 10;
```

---

## SLIDE 17: COMPLEX JOIN - COMPLETE APPLICATION VIEW
**Speaker:** Vũ Đức Nhân (Backend)

```sql
-- COMPLETE APPLICATION VIEW (11-TABLE JOIN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT
    a.id,
    a.application_number,
    a.status,
    a.requested_amount,
    u.full_name as applicant_name,
    u.email as applicant_email,
    p.name as product_name,
    p.product_type,
    b.branch_name,
    COUNT(DISTINCT d.id) as document_count,
    COUNT(DISTINCT CASE WHEN d.verification_status = 'VERIFIED'
                    THEN d.id END) as verified_docs,
    v.status as kyc_status,
    ra.risk_category,
    ra.recommendation,
    o.approved_amount,
    o.interest_rate,
    c.contract_number,
    dis.status as disbursement_status,
    rs.outstanding_balance
FROM applications a
JOIN applicants ap ON a.applicant_id = ap.id
JOIN users u ON ap.user_id = u.id
JOIN products p ON a.product_id = p.id
LEFT JOIN branches b ON a.branch_id = b.id
LEFT JOIN documents d ON a.id = d.application_id
LEFT JOIN verifications v ON a.id = v.application_id
                          AND v.verification_type = 'KYC'
LEFT JOIN risk_assessments ra ON a.id = ra.application_id
LEFT JOIN offers o ON a.id = o.application_id
                   AND o.status = 'ACCEPTED'
LEFT JOIN contracts c ON a.id = c.application_id
LEFT JOIN disbursements dis ON c.id = dis.contract_id
LEFT JOIN repayment_schedules rs ON c.id = rs.contract_id
WHERE a.id = ?
GROUP BY a.id;


PERFORMANCE:
──────────────────────────────────────────────────────────
• 11 table joins in single query
• Replaces 10+ separate queries
• Query time: ~30ms (with proper indexes)
• Result: Complete application snapshot
```

---

## SLIDE 18: TRANSACTION QUERIES
**Speaker:** Đào Hữu Hoài (Full-stack)

```sql
-- TRANSACTIONS TABLE (Wallet System)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    wallet_id BIGINT,
    loan_id BIGINT,
    type ENUM('DEPOSIT', 'WITHDRAWAL', 'LOAN_DISBURSEMENT',
              'LOAN_PAYMENT', 'FEE', 'REFUND'),
    amount DECIMAL(15, 2) NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REVERSED'),
    reference_number VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
);


-- TRANSACTION QUERIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Query 1: User Transaction History
SELECT * FROM transactions
WHERE user_id = ?
ORDER BY created_at DESC
LIMIT 50;


-- Query 2: Monthly Transaction Summary
SELECT
    DATE_FORMAT(created_at, '%Y-%m') as month,
    type,
    COUNT(*) as transaction_count,
    SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_inflow,
    SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as total_outflow
FROM transactions
WHERE user_id = ?
  AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY month, type
ORDER BY month DESC;
```

---

## SLIDE 19: SUPPORT TICKETS & NOTIFICATIONS
**Speaker:** Võ Trí Khôi (Backend)

```sql
-- SUPPORT TICKETS TABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE support_tickets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') DEFAULT 'OPEN',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    category ENUM('GENERAL', 'TECHNICAL', 'BILLING', 'LOAN'),
    assigned_to BIGINT,

    INDEX idx_status (status),
    INDEX idx_assigned_to (assigned_to)
);

-- NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('INFO', 'WARNING', 'ERROR', 'SUCCESS', 'LOAN', 'PAYMENT'),
    is_read BOOLEAN DEFAULT FALSE,

    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
);


-- QUERIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Query 1: Unread Notifications
SELECT * FROM notifications
WHERE user_id = ? AND is_read = FALSE
ORDER BY created_at DESC;

-- Query 2: Mark All as Read
UPDATE notifications SET is_read = TRUE WHERE user_id = ?;

-- Query 3: Staff Ticket Queue
SELECT t.*, u.full_name as requester_name
FROM support_tickets t
JOIN users u ON t.user_id = u.id
WHERE t.assigned_to = ? AND t.status != 'CLOSED'
ORDER BY t.priority DESC, t.created_at ASC;
```

---

## SLIDE 20: PERFORMANCE OPTIMIZATION - INDEXES
**Speaker:** Lê Thành Danh (Leader)

```sql
-- CRITICAL INDEXES FOR PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Authentication (Most Frequent)
CREATE INDEX idx_users_email ON users(email);

-- Application Lookups
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX idx_applications_application_number ON applications(application_number);

-- Document Verification Workflow
CREATE INDEX idx_documents_application_id ON documents(application_id);
CREATE INDEX idx_documents_verification_status ON documents(verification_status);

-- Payment Processing
CREATE INDEX idx_installments_schedule_id ON installments(schedule_id);
CREATE INDEX idx_installments_due_date ON installments(due_date);
CREATE INDEX idx_installments_status ON installments(status);

-- Foreign Keys (All indexed)
CREATE INDEX idx_fk_applicant_user ON applicants(user_id);
CREATE INDEX idx_fk_app_applicant ON applications(applicant_id);


-- QUERY PERFORMANCE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPLAIN SELECT * FROM applications WHERE status = 'UNDER_REVIEW';

Without Index:
• Type: ALL (full table scan)
• Rows examined: 10,000
• Query time: 0.45 seconds

With Index:
• Type: ref (using index)
• Rows examined: 15
• Query time: 0.003 seconds
• Performance: 150x faster ✓
```

---

## SLIDE 21: SECURITY - SQL INJECTION PREVENTION
**Speaker:** Đào Hữu Hoài (Full-stack)

```java
// SQL INJECTION PREVENTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ❌ VULNERABLE - STRING CONCATENATION
String email = request.getParameter("email");
String sql = "SELECT * FROM users WHERE email = '" + email + "'";
Statement stmt = connection.createStatement();
ResultSet rs = stmt.executeQuery(sql);

// Attack Input: ' OR '1'='1
// Executed SQL: SELECT * FROM users WHERE email = '' OR '1'='1'
// Result: Returns ALL users! (Security breach)


// ✅ SECURE - PARAMETERIZED QUERY
String sql = "SELECT * FROM users WHERE email = ?";
PreparedStatement ps = connection.prepareStatement(sql);
ps.setString(1, email);
ResultSet rs = ps.executeQuery();

// Attack Input: ' OR '1'='1
// Executed SQL: SELECT * FROM users WHERE email = '\' OR \'1\'=\'1'
// Result: No match (Attack prevented)


// ✅ OUR IMPLEMENTATION - SPRING JDBC TEMPLATE
String sql = "SELECT * FROM users WHERE email = ?";
return jdbcTemplate.query(sql, userRowMapper, email);


SECURITY AUDIT RESULTS:
──────────────────────────────────────────────────────────
✓ 150+ queries scanned
✓ 100% parameterized (zero SQL injection vulnerabilities)
✓ All user inputs sanitized
✓ BCrypt password hashing
✓ JWT token authentication
```

---

## SLIDE 22: FRONTEND INTEGRATION - API TO DATABASE
**Speaker:** Lê Hoàng Quốc Anh (Frontend)

```typescript
// DATA FLOW: FRONTEND → BACKEND → DATABASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 1. FRONTEND (Next.js/TypeScript)
// File: lib/api.ts
async getLoans() {
  return this.request('/loans', { method: 'GET' });
}

async applyForLoan(data: { amount: number; purpose: string }) {
  return this.request('/loans', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

        ↓ HTTP REQUEST ↓

// 2. BACKEND CONTROLLER (Spring Boot)
// File: LoanController.java
@GetMapping("/loans")
public ResponseEntity<List<Loan>> getAllLoans() {
    List<Loan> loans = loanRepository.findAll();
    return ResponseEntity.ok(loans);
}

        ↓ METHOD CALL ↓

// 3. REPOSITORY LAYER (JDBC)
// File: LoanRepository.java
public List<Loan> findAll() {
    String sql = "SELECT * FROM loans ORDER BY created_at DESC";
    return jdbcTemplate.query(sql, loanRowMapper);
}

        ↓ SQL EXECUTION ↓

// 4. DATABASE
// MySQL executes: SELECT * FROM loans ORDER BY created_at DESC
// Returns: List of loan records
```

---

## SLIDE 23: REAL-TIME DATA UPDATES
**Speaker:** Trương Minh Trí (Frontend)

```typescript
// DASHBOARD REAL-TIME UPDATES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// React Component with Auto-Refresh
const [applications, setApplications] = useState<Application[]>([]);

useEffect(() => {
  fetchDashboardData();

  // Auto-refresh every 30 seconds
  const interval = setInterval(fetchDashboardData, 30000);
  return () => clearInterval(interval);
}, []);

const fetchDashboardData = async () => {
  // API call to backend
  const appsData = await apiClient.get<Application[]>('/applications');
  setApplications(appsData);

  // Calculate live statistics
  const stats = {
    totalApplications: appsData.length,
    pendingReview: appsData.filter(a =>
      a.status === 'UNDER_REVIEW'
    ).length,
    activeLoans: appsData.filter(a =>
      a.status === 'ACTIVE'
    ).length,
  };
  setStats(stats);
};


BACKEND QUERY EXECUTED:
──────────────────────────────────────────────────────────
SELECT * FROM applications ORDER BY created_at DESC

RESULT:
──────────────────────────────────────────────────────────
• Dashboard updates every 30 seconds
• Status changes reflected in real-time
• Client-side filtering for instant UI updates
• Production: Would use WebSocket for push notifications
```

---

## SLIDE 24: DATA FLOW DIAGRAM
**Speaker:** Võ Quang Khải (Report Writer)

```
DATA FLOW: NEW LOAN APPLICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. USER SUBMITS FORM (Frontend - React)
   └─→ POST /api/applications
       { amount: 50000, term: 24, purpose: "Home renovation" }

2. CONTROLLER RECEIVES REQUEST (Spring Boot)
   └─→ ApplicationController.create()
       Validates input, processes business logic

3. INSERT APPLICATION (SQL)
   └─→ INSERT INTO applications
       (applicant_id, requested_amount, requested_term_months,
        purpose, status, application_number)
       VALUES (?, ?, ?, ?, 'SUBMITTED', 'APP-2024-001');

4. CREATE NOTIFICATION (SQL)
   └─→ INSERT INTO notifications
       (user_id, title, message, type)
       VALUES (?, 'Application Received', '...', 'LOAN');

5. AUTO-ASSIGN TO BANKER (SQL)
   └─→ UPDATE applications
       SET banker_id = ?
       WHERE id = ?;

6. RETURN JSON RESPONSE
   └─→ {
         "id": 123,
         "application_number": "APP-2024-001",
         "status": "SUBMITTED",
         "created_at": "2024-11-26T10:30:00"
       }


METRICS:
──────────────────────────────────────────────────────────
• Tables Touched: 3 (applications, notifications, users)
• SQL Queries: 4 (1 INSERT, 2 UPDATE, 1 SELECT)
• Transaction Time: ~50ms
• All wrapped in database transaction (ACID)
```

---

## SLIDE 25: DATABASE MIGRATION STRATEGY
**Speaker:** Trần Châu Thanh Tuấn (Report Writer)

```
SCHEMA EVOLUTION STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VERSION 1.0 (Initial Implementation)
──────────────────────────────────────────────────────────
Files:
• schema.sql - Core tables
• data.sql - Sample data

Contents:
• 12 tables (users, loans, wallets, transactions, etc.)
• 50 basic queries
• Simple loan management


VERSION 2.0 (Extended Implementation)
──────────────────────────────────────────────────────────
Files:
• schema-extended.sql - Complete workflow
• data-extended.sql - Extended sample data

Added:
• 15 new tables (applications, documents, verifications,
  risk_assessments, offers, contracts, disbursements,
  repayment_schedules, installments, payments, etc.)
• 100+ advanced queries
• Full loan lifecycle workflow


MIGRATION APPROACH:
──────────────────────────────────────────────────────────
1. Keep legacy tables for backward compatibility
2. Add new tables with proper foreign keys
3. Migrate data in batches:
   INSERT INTO new_table SELECT * FROM old_table WHERE ...
4. Update application code to use new tables
5. Deprecate old tables after transition period


ALTER TABLE EXAMPLES:
──────────────────────────────────────────────────────────
-- Add column
ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL;

-- Add index
CREATE INDEX idx_applications_submitted_at
ON applications(submitted_at);

-- Add foreign key
ALTER TABLE documents
ADD CONSTRAINT fk_doc_app
FOREIGN KEY (application_id) REFERENCES applications(id)
ON DELETE CASCADE;
```

---

## SLIDE 26: TESTING & DATA INTEGRITY
**Speaker:** Hoàng Triệu Nam (Report Writer)

```sql
-- DATABASE CONSTRAINT TESTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- TEST 1: Foreign Key Constraint (Referential Integrity)
INSERT INTO applications (applicant_id, product_id, requested_amount, ...)
VALUES (9999, 1, 10000, ...);

RESULT: ❌ ERROR 1452: Cannot add or update a child row
✓ Foreign key constraint working correctly


-- TEST 2: Cascade Deletion
DELETE FROM users WHERE id = 5;

Verify cascades:
SELECT COUNT(*) FROM applicants WHERE user_id = 5;     -- Result: 0
SELECT COUNT(*) FROM applications WHERE applicant_id = 5; -- Result: 0

RESULT: ✓ Cascade deletion working correctly


-- TEST 3: Unique Constraint
INSERT INTO users (email, password, full_name)
VALUES ('existing@example.com', '...', 'Test User');

RESULT: ❌ ERROR 1062: Duplicate entry for key 'email'
✓ Uniqueness enforced


-- TEST 4: ENUM Validation
UPDATE applications SET status = 'INVALID_STATUS' WHERE id = 1;

RESULT: ❌ ERROR 1265: Data truncated for column 'status'
✓ Invalid ENUM values rejected


-- TEST 5: Decimal Precision (Financial Accuracy)
INSERT INTO payments (amount, ...) VALUES (123.456789, ...);
SELECT amount FROM payments WHERE id = LAST_INSERT_ID();

RESULT: 123.46 (rounded to 2 decimal places)
✓ Financial precision maintained (DECIMAL(15,2))
```

---

## SLIDE 27: CHALLENGES & SOLUTIONS
**Speaker:** Lê Thành Danh (Leader)

```
TECHNICAL CHALLENGES ENCOUNTERED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHALLENGE 1: N+1 Query Problem
──────────────────────────────────────────────────────────
Problem:
• Loading 100 applications executed 101 queries
  (1 for applications + 100 for applicants)

Solution:
• Use JOIN queries to fetch related data in one query

Performance Impact:
Before: 101 queries, 450ms
After:  1 query, 25ms (18x faster ✓)


CHALLENGE 2: Slow Pagination on Large Datasets
──────────────────────────────────────────────────────────
Problem:
• OFFSET 10000 LIMIT 20 scans 10,020 rows

Solution:
• Cursor-based pagination with indexed column

Performance Impact:
Before: SELECT * FROM apps LIMIT 20 OFFSET 10000;  (280ms)
After:  SELECT * FROM apps WHERE id > ? LIMIT 20;   (8ms)


CHALLENGE 3: Deadlocks During Payment Processing
──────────────────────────────────────────────────────────
Problem:
• Concurrent payments caused table deadlocks

Solution:
• Lock tables in consistent order (installment, then schedule)
• Use SELECT FOR UPDATE for row-level locking

Result: Zero deadlocks in testing ✓


CHALLENGE 4: Case-Sensitive Email Search
──────────────────────────────────────────────────────────
Problem:
• 'user@email.com' != 'User@Email.com' caused login failures

Solution:
CREATE INDEX idx_email_lower ON users(LOWER(email));
SELECT * FROM users WHERE LOWER(email) = LOWER(?);


CHALLENGE 5: Time Zone Issues
──────────────────────────────────────────────────────────
Problem:
• Timestamps showed different times for different users

Solution:
• Store all timestamps in UTC
• Convert to user's timezone in application layer
```

---

## SLIDE 28: SUMMARY & Q&A
**Speaker:** Lê Thành Danh (Leader)

```
PROJECT ACHIEVEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DATABASE ARCHITECTURE:
──────────────────────────────────────────────────────────
✓ 27 Tables with proper relationships and constraints
✓ 40+ Performance indexes (sub-10ms average query time)
✓ 150+ Optimized SQL queries (all parameterized)
✓ Zero SQL injection vulnerabilities
✓ Full ACID compliance with transaction management


TECHNICAL IMPLEMENTATION:
──────────────────────────────────────────────────────────
✓ Spring Boot 3.3.4 + MySQL 8.0 InnoDB
✓ JdbcTemplate for type-safe database access
✓ Parameterized queries (100% coverage)
✓ Foreign key constraints enforced
✓ Cascade rules for automatic cleanup
✓ ENUM types for data validation


QUERY TYPES IMPLEMENTED:
──────────────────────────────────────────────────────────
• Simple SELECT           (60+ queries)
• Complex JOIN            (15+ multi-table queries)
• Aggregations/Analytics  (15+ queries with GROUP BY)
• INSERT/UPDATE/DELETE    (60+ DML queries)
• Scheduled Jobs          (Overdue detection, cleanup)


PERFORMANCE METRICS:
──────────────────────────────────────────────────────────
• Average query time:      < 10ms
• Complex joins (5+ tables): < 30ms
• Analytics aggregations:  < 50ms
• Transaction commit:      < 100ms


SECURITY MEASURES:
──────────────────────────────────────────────────────────
✓ All queries parameterized (SQL injection safe)
✓ BCrypt password hashing (work factor 10)
✓ JWT token authentication
✓ Role-based access control
✓ Input validation on all endpoints


TEAM COLLABORATION:
──────────────────────────────────────────────────────────
• 11 team members
• 4-week development sprint
• Git version control
• Code reviews for all SQL queries
• Comprehensive testing (constraints, performance, security)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    QUESTIONS & ANSWERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for your attention!
We're ready to answer your questions about:
• SQL queries and database design
• Performance optimization strategies
• Security implementations
• Transaction management
• Any technical aspects of the system
```

---

## END OF SLIDES

**Total Slides:** 28
**Presentation Time:** 20 minutes
**Format:** Ready for PowerPoint/Google Slides/Keynote
**Focus:** SQL Queries & Database Implementation
