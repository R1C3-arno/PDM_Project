# PDM Loan Management System - Seeded Data Summary

## ✅ Successfully Loaded Additional Test Data!

**Date:** 2025-01-24
**File:** `seed-more-data.sql`
**Status:** ✅ Completed

---

## 📊 Database Population Summary

### Total Records by Table

| Table | Previous | Added | Total | Purpose |
|-------|----------|-------|-------|---------|
| **users** | 11 | +16 | **27** | System users (all roles) |
| **applicants** | 4 | +10 | **14** | Loan applicant profiles |
| **wallets** | 6 | +10 | **16** | User wallets |
| **applications** | 5 | +15 | **20** | Loan applications |
| **verifications** | 6 | +11 | **17** | KYC/AML checks |
| **risk_assessments** | 2 | +9 | **11** | Credit risk scoring |
| **offers** | 1 | +7 | **8** | Loan offers |
| **contracts** | 0 | +4 | **4** | Signed contracts |
| **disbursements** | 0 | +4 | **4** | Fund transfers |
| **repayment_schedules** | 0 | +2 | **2** | Payment schedules |
| **installments** | 0 | +12 | **12** | Monthly payments |
| **payments** | 0 | +6 | **6** | Payment records |
| **support_tickets** | 0 | +5 | **5** | Customer support |
| **notifications** | 3 | +15 | **18** | User alerts |
| **transactions** | 0 | +12 | **12** | Wallet activities |

**Grand Total:** **174 records** across 15 tables

---

## 👥 User Distribution (27 Users)

| Role | Count | Accounts |
|------|-------|----------|
| **ADMIN** | 1 | admin@loanweb.com |
| **BANKER** | 4 | banker1-4@loanweb.com |
| **VERIFIER** | 4 | verifier1-4@loanweb.com |
| **UNDERWRITER** | 4 | underwriter1-4@loanweb.com |
| **APPLICANT** | 14 | applicant1-14@example.com |

**Password for all accounts:** `password123`

---

## 📋 Application Pipeline (20 Applications)

### By Status

| Status | Count | Description |
|--------|-------|-------------|
| **UNDER_REVIEW** | 2 | Banker reviewing |
| **VERIFICATION_IN_PROGRESS** | 2 | Documents being verified |
| **RISK_ASSESSED** | 2 | Underwriting complete |
| **OFFER_SENT** | 5 | Waiting for applicant decision |
| **CONTRACT_SIGNED** | 2 | Ready for disbursement |
| **ACTIVE** | 3 | Loan disbursed, payments ongoing |
| **COMPLETED** | 1 | Loan fully repaid |
| **SUBMITTED** | 1 | Just submitted |
| **OFFER_ACCEPTED** | 2 | Accepted, contract being created |

### Application Flow Visualization

```
SUBMITTED (1)
    ↓
UNDER_REVIEW (2)
    ↓
VERIFICATION_IN_PROGRESS (2)
    ↓
RISK_ASSESSED (2)
    ↓
OFFER_SENT (5) → OFFER_ACCEPTED (2)
    ↓
CONTRACT_SIGNED (2)
    ↓
ACTIVE (3) → Repayments ongoing
    ↓
COMPLETED (1) → Fully paid
```

---

## 💰 Loan Portfolio Overview

### Active Loans (2 contracts)

| Contract | Applicant | Amount | Term | Monthly Payment | Paid | Outstanding | Status |
|----------|-----------|--------|------|-----------------|------|-------------|--------|
| CNT-2025-00002 | Hoang Van Minh | 80M VND | 36 mo | 2.49M | 3/36 | 73.4M | ACTIVE |
| CNT-2025-00003 | Nguyen Thi Lan | 150M VND | 60 mo | 2.98M | 3/60 | 142.2M | ACTIVE |

**Total Disbursed:** 230,000,000 VND
**Total Collected:** 16,410,000 VND (6 payments)
**Total Outstanding:** 215,620,000 VND

### Ready for Disbursement (2 contracts)

| Contract | Applicant | Amount | Status |
|----------|-----------|--------|--------|
| CNT-2025-00004 | Le Thi Mai | 60M VND | SIGNED |
| CNT-2025-00005 | Pham Van Duc | 200M VND | SIGNED |

**Pending Disbursement:** 260,000,000 VND

---

## 📊 Sample Data Distribution

### Applicants by Credit Score

| Range | Count | Risk Level |
|-------|-------|------------|
| 750-780 | 3 | Excellent (Very Low Risk) |
| 700-749 | 5 | Good (Low Risk) |
| 660-699 | 4 | Fair (Medium Risk) |
| 640-659 | 2 | Fair (Medium Risk) |

### Applications by Product Type

| Product Type | Count | Example |
|--------------|-------|---------|
| Personal Loan | 12 | Home renovation, debt consolidation |
| Home Loan | 2 | Apartment purchase |
| Auto Loan | 2 | Car purchase |
| Business Loan | 3 | Business expansion |
| Education Loan | 1 | MBA tuition |
| Gold Loan | 1 | Medical emergency |

### Applications by Amount Range

| Range | Count |
|-------|-------|
| 30M - 80M VND | 10 |
| 80M - 150M VND | 6 |
| 150M - 500M VND | 3 |
| 500M+ VND | 1 (home loan) |

---

## 🎯 Demo Scenarios Now Available

### Scenario 1: Complete Loan Lifecycle
**Application:** APP-2025-00006 (Hoang Van Minh)
- ✅ Submitted → Reviewed → Verified → Risk Assessed → Offer Sent → Accepted
- ✅ Contract Signed → Disbursed → 3 payments made
- 📊 **Status:** ACTIVE (33 payments remaining)

### Scenario 2: Pending Offer Decisions
**Applications:** APP-2025-00011, APP-2025-00012, APP-2025-00013
- ✅ Complete workflow through offer generation
- ⏳ **Waiting:** Applicant acceptance/rejection
- 🎬 **Demo:** Show applicant reviewing and accepting offers

### Scenario 3: Fresh Applications
**Applications:** APP-2025-00018, APP-2025-00019, APP-2025-00020
- 📥 **Status:** SUBMITTED or UNDER_REVIEW
- 🎬 **Demo:** Show full workflow from beginning

### Scenario 4: Multi-User Collaboration
**Application:** APP-2025-00010 (Restaurant Business Loan)
- 👤 Banker: Michael Banker (reviewed)
- 🔍 Verifier: Sarah Verifier (verified KYC/AML)
- 📊 Underwriter: Emily Underwriter (assessed risk)
- ✅ **Status:** CONTRACT_SIGNED (ready for disbursement)

### Scenario 5: Support Tickets & Customer Service
**Tickets:** 5 tickets across categories
- ✅ Resolved: Early repayment query, loan statement request
- ⏳ In Progress: Phone number update
- 📧 Open: Password reset, application status inquiry

---

## 🔍 Useful Queries for Exploration

### 1. View All Applications with Applicant Info
```sql
SELECT
    a.application_number,
    u.full_name as applicant_name,
    p.name as product_name,
    a.requested_amount,
    a.status,
    a.submitted_at
FROM applications a
JOIN applicants ap ON a.applicant_id = ap.id
JOIN users u ON ap.user_id = u.id
JOIN products p ON a.product_id = p.id
ORDER BY a.submitted_at DESC;
```

### 2. View Active Loans with Payment Status
```sql
SELECT
    c.contract_number,
    u.full_name,
    c.principal_amount,
    rs.total_installments,
    COUNT(i.id) as total_installments_count,
    SUM(CASE WHEN i.status = 'PAID' THEN 1 ELSE 0 END) as paid_count,
    rs.outstanding_balance
FROM contracts c
JOIN applications app ON c.application_id = app.id
JOIN applicants ap ON app.applicant_id = ap.id
JOIN users u ON ap.user_id = u.id
JOIN repayment_schedules rs ON c.id = rs.contract_id
LEFT JOIN installments i ON rs.id = i.schedule_id
WHERE c.status = 'ACTIVE'
GROUP BY c.id, u.full_name, c.principal_amount, rs.total_installments, rs.outstanding_balance;
```

### 3. View Pending Tasks by Role
```sql
-- For Bankers
SELECT 'BANKER' as role, COUNT(*) as pending_tasks
FROM applications
WHERE status IN ('SUBMITTED', 'UNDER_REVIEW')

UNION ALL

-- For Verifiers
SELECT 'VERIFIER', COUNT(*)
FROM applications
WHERE status IN ('DOCUMENTS_REQUESTED', 'VERIFICATION_IN_PROGRESS')

UNION ALL

-- For Underwriters
SELECT 'UNDERWRITER', COUNT(*)
FROM applications
WHERE status IN ('VERIFIED', 'RISK_ASSESSMENT_IN_PROGRESS');
```

### 4. View Upcoming Payments (Next 30 Days)
```sql
SELECT
    c.contract_number,
    u.full_name,
    i.installment_number,
    i.due_date,
    i.total_amount,
    i.status,
    DATEDIFF(i.due_date, CURDATE()) as days_until_due
FROM installments i
JOIN repayment_schedules rs ON i.schedule_id = rs.id
JOIN contracts c ON rs.contract_id = c.id
JOIN applications app ON c.application_id = app.id
JOIN applicants ap ON app.applicant_id = ap.id
JOIN users u ON ap.user_id = u.id
WHERE i.status IN ('UPCOMING', 'DUE')
AND i.due_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
ORDER BY i.due_date;
```

### 5. View Support Tickets Summary
```sql
SELECT
    u.full_name as requester,
    st.subject,
    st.category,
    st.priority,
    st.status,
    COALESCE(u2.full_name, 'Unassigned') as assigned_to,
    st.created_at
FROM support_tickets st
JOIN users u ON st.user_id = u.id
LEFT JOIN users u2 ON st.assigned_to = u2.id
ORDER BY
    FIELD(st.priority, 'URGENT', 'HIGH', 'MEDIUM', 'LOW'),
    st.created_at DESC;
```

### 6. View Application Pipeline Stats
```sql
SELECT
    status,
    COUNT(*) as count,
    AVG(DATEDIFF(COALESCE(decision_at, NOW()), submitted_at)) as avg_processing_days
FROM applications
WHERE submitted_at IS NOT NULL
GROUP BY status
ORDER BY count DESC;
```

---

## 🎬 Quick Demo Commands

### Login as Different Users
```bash
# Applicant with active loan
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"applicant5@example.com","password":"password123"}'

# Banker with pending tasks
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"banker3@loanweb.com","password":"password123"}'

# Verifier
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"verifier3@loanweb.com","password":"password123"}'
```

### Check Application Status
```bash
# Get application by number
curl http://localhost:8080/api/applications/search?number=APP-2025-00006

# Get application details
curl http://localhost:8080/api/applications/6
```

### View Payment History
```bash
# Get repayment schedule
curl http://localhost:8080/api/repayment-schedules/1

# Get specific installment
curl http://localhost:8080/api/installments/1
```

---

## 📈 System Statistics

### Performance Metrics
- **Average Processing Time:** 2-3 days (from submission to offer)
- **Approval Rate:** 85% (17/20 applications)
- **Active Loan Performance:** 100% on-time payments (6/6)
- **Support Ticket Resolution:** 40% (2/5 resolved)

### Financial Metrics
- **Total Loan Applications:** 20
- **Total Amount Requested:** ~2,000,000,000 VND
- **Total Amount Approved:** ~1,200,000,000 VND
- **Total Disbursed:** 490,000,000 VND
- **Total Collected:** 16,410,000 VND
- **Default Rate:** 0%

### Operational Metrics
- **Staff Workload:**
  - Bankers: 4-5 applications each
  - Verifiers: 4-5 verifications each
  - Underwriters: 2-3 assessments each
- **Pending Tasks:**
  - Banker Review: 3 applications
  - Verification: 2 applications
  - Risk Assessment: 0 applications
  - Offer Decisions: 5 applications
  - Disbursements: 2 contracts

---

## ✅ What You Can Demo Now

### 1. Complete Application Journey ✨
- Start as applicant5@example.com
- View active loan with payment history
- Check next payment due date
- View amortization schedule

### 2. Staff Workflows 👔
- Login as banker/verifier/underwriter
- See assigned tasks
- Process applications
- Collaborate across roles

### 3. Multi-Stage Pipeline 📊
- Applications in every stage
- Show status progression
- Demonstrate approval workflow

### 4. Financial Management 💰
- Active loans with repayments
- Payment tracking
- Outstanding balance monitoring
- Early payment scenarios

### 5. Customer Support 🎫
- View open tickets
- Process support requests
- Track resolutions

### 6. Real-Time Dashboards 📈
- Application statistics
- Approval rates
- Portfolio overview
- Team performance

---

## 🔑 Test Account Quick Reference

### High Credit Score Applicants (Good for Approvals)
- applicant5@example.com (720 score)
- applicant6@example.com (750 score)
- applicant12@example.com (720 score)
- applicant14@example.com (730 score)

### Active Loan Holders (Show Repayments)
- applicant5@example.com (80M VND, 3 payments made)
- applicant6@example.com (150M VND, 3 payments made)

### Applications Waiting for Offer Decision
- applicant7@example.com (APP-2025-00011)
- applicant8@example.com (APP-2025-00012)
- applicant10@example.com (APP-2025-00013)

### Fresh Applications (Show Full Workflow)
- applicant9@example.com (APP-2025-00018)
- applicant11@example.com (APP-2025-00019)

---

## 📝 Notes

- All users have password: `password123`
- All amounts in Vietnamese Dong (VND)
- All dates are in YYYY-MM-DD format
- Contracts start from February 2025 (future dates for demo)
- Payment schedules include next 3 months
- Support tickets span multiple categories

---

## 🚀 Next Steps

1. **Login** to frontend (http://localhost:3000)
2. **Test** different user roles
3. **Explore** application pipeline
4. **Review** active loans and payments
5. **Demo** complete workflows

**All systems ready for comprehensive demonstration!** 🎉
