# Database Scripts

This directory contains all database-related scripts for the OLAVS Loan Management System.

## Quick Start

For a fresh installation, use the production schema and seed data:

```bash
# Initialize database with extended schema and data
./init-database.sh
```

Or manually:
```bash
# 1. Create the production schema
mysql -u root -p olavs_db < schema-extended.sql

# 2. Load seed data
mysql -u root -p olavs_db < data-extended.sql

# 3. (Optional) Load more realistic test data
mysql -u root -p olavs_db < seed-realistic-data.sql
```

## File Descriptions

### Production Files (USE THESE)

| File | Description |
|------|-------------|
| `schema-extended.sql` | **PRODUCTION SCHEMA** - Complete schema with 16 entities, 15 ENUMs, triggers, stored procedures, and views |
| `data-extended.sql` | **PRODUCTION SEED DATA** - 21 users, 10 applicants, 15 applications with realistic data |
| `seed-realistic-data.sql` | Additional realistic test data including documents, risk assessments, offers |
| `init-database.sh` | Automated script to initialize database with schema and seed data |
| `dump-database.sh` | Script to backup the database |

### Deprecated Files (DO NOT USE FOR NEW INSTALLATIONS)

| File | Description | Status |
|------|-------------|--------|
| `schema.sql` | Old basic schema with only 6 tables | **DEPRECATED** - Use `schema-extended.sql` |
| `data.sql` | Old basic seed data | **DEPRECATED** - Use `data-extended.sql` |
| `schema-new-features.sql` | Intermediate schema extensions | **DEPRECATED** - Merged into `schema-extended.sql` |

### Root Level SQL Files

| File | Description |
|------|-------------|
| `../pdm-backup-before-extended-schema.sql` | Historical backup before extended schema migration (reference only) |
| `../seed-more-data.sql` | Additional seed data with 10+ users and 15+ applications |

## Database Schema Overview

The production schema (`schema-extended.sql`) includes:

### Core Entities (16 tables)
1. **user** - Authentication and profile
2. **applicant** - Extended profile with employment, income, credit score
3. **bank** - Bank information
4. **branch** - Bank branch locations
5. **product** - Loan product definitions
6. **application** - Loan applications (20-state workflow)
7. **document** - Document records (11 types)
8. **verification** - KYC/AML verification
9. **risk_assessment** - Risk scoring
10. **offer** - Loan offer terms
11. **contract** - Digital contracts
12. **disbursement** - Fund disbursement
13. **repayment_schedule** - Amortization schedules
14. **repayment_installment** - Individual payments
15. **payment** - Payment transactions
16. **wallet** - User wallets
17. **transaction** - All transactions
18. **notification** - User notifications
19. **message** - Internal messaging
20. **support_ticket** - Support tickets
21. **audit_log** - Security audit trail

### ENUMs (15 types)
- UserRole (5): APPLICANT, BANKER, VERIFIER, UNDERWRITER, ADMIN
- ApplicationStatus (20): DRAFT, SUBMITTED, UNDER_REVIEW, etc.
- DocumentType (11): ID, PROOF_OF_INCOME, PAYSLIPS, etc.
- RiskLevel (4): LOW, MEDIUM, HIGH, CRITICAL
- And 11 more...

### Database Features
- Stored Procedures: `sp_generate_repayment_schedule`
- Functions: `fn_calculate_emi`
- Triggers: `trg_offer_accepted`, `trg_check_overdue_installments`
- Views: `v_application_full`, `v_active_portfolio`, `v_overdue_installments`

## Configuration

Database connection settings:

| Setting | Default Value |
|---------|---------------|
| Host | localhost |
| Port | 3306 |
| Database | olavs_db |
| Username | (see .env) |
| Password | (see .env) |

See `pdm-backend/.env.example` for environment configuration.

## Backup Directory

Database backups are stored in `./backups/`. Use `dump-database.sh` to create backups.

## Last Updated

December 1, 2025
