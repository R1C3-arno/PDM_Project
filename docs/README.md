# PDM Loan Management System - Documentation Index

Welcome to the PDM Loan Management System documentation. This index provides quick access to all project documentation organized by category.

## Quick Links

- [Main README](../README.md) - Project overview and quick start
- [Frontend README](../pdm-frontend/README.md) - Frontend setup and development
- [Backend README](../pdm-backend/README.md) - Backend setup and development
- [Contributing Guide](../CONTRIBUTING.md) - Contribution guidelines

## Getting Started

### Setup Guides
- [Quick Start Guide](./guides/QUICK_START.md) - Complete setup and installation instructions
- [Secret Management Guide](./guides/SECRET_MANAGEMENT.md) - Security configuration and best practices
- [Secret Setup Quick Reference](./guides/SECRET_SETUP_QUICKREF.md) - Fast secret configuration reference
- [Testing Guide](./guides/TESTING_GUIDE.md) - Testing strategies and instructions

### Environment Configuration
- Frontend: [`pdm-frontend/.env.example`](../pdm-frontend/.env.example)
- Backend: [`pdm-backend/.env.example`](../pdm-backend/.env.example)

## API Documentation

### Endpoints and Queries
- [SQL Queries Reference](./api/SQL_QUERIES_REFERENCE.md) - Database query examples and patterns

### API Categories
The system provides 75+ REST API endpoints:
- **Authentication**: User registration, login, JWT management
- **Applications**: Loan application lifecycle (DRAFT → SUBMITTED → APPROVED → DISBURSED)
- **Documents**: Upload, verification, and management
- **Verifications**: KYC/AML verification workflows
- **Risk Assessments**: Risk scoring and analysis
- **Offers**: Loan offer generation and acceptance
- **Contracts**: Digital contract creation and signing
- **Disbursements**: Loan disbursement processing
- **Repayments**: Schedule generation and payment tracking
- **Users**: User management and role assignment
- **Wallets**: Wallet operations (deposit, withdraw, balance)
- **Transactions**: Transaction history and tracking
- **Tickets**: Support ticket management
- **Notifications**: User notification system
- **Messages**: Internal messaging between users and staff

For detailed endpoint documentation, see the [Quick Start Guide](./guides/QUICK_START.md).

## Security Documentation

### Security Guides
- [Secret Management](./guides/SECRET_MANAGEMENT.md) - Comprehensive security configuration
- [Security Threat Model](./audit-reports/SECURITY_THREAT_MODEL.md) - Detailed threat analysis
- [Comprehensive Threat Model](./audit-reports/COMPREHENSIVE_THREAT_MODEL.md) - Extended threat modeling
- [Security Hardening Checklist](./audit-reports/SECURITY_HARDENING_CHECKLIST.md) - Security best practices

### Security Reports
- [T1.1: Sensitive Logging Removal Report](./audit-reports/T1.1_SENSITIVE_LOGGING_REMOVAL_REPORT.md)
- [T1.2: Secret Rotation Report](./audit-reports/T1.2_SECRET_ROTATION_REPORT.md)
- [T1.2: Executive Summary](./audit-reports/T1.2_EXECUTIVE_SUMMARY.md)

## Audit Reports

### Comprehensive Audits
- [Comprehensive Audit Executive Summary](./audit-reports/COMPREHENSIVE_AUDIT_EXECUTIVE_SUMMARY.md)
- [Code Quality and Developer Practices Audit](./audit-reports/CODE_QUALITY_AND_DEVELOPER_PRACTICES_AUDIT.md)
- [Frontend UI/UX Audit](./audit-reports/FRONTEND_UI_UX_AUDIT.md)

### Security Audits
- [Security Threat Model](./audit-reports/SECURITY_THREAT_MODEL.md)
- [Comprehensive Threat Model](./audit-reports/COMPREHENSIVE_THREAT_MODEL.md)
- [Security Hardening Checklist](./audit-reports/SECURITY_HARDENING_CHECKLIST.md)

## Project Reports

### Implementation Reports
- [T3.1: CI/CD Implementation Summary](./reports/T3.1_CI_CD_IMPLEMENTATION_SUMMARY.md)
- [Messaging System Implementation](./reports/MESSAGING_SYSTEM_IMPLEMENTATION.md)
- [Session Integration Summary](./reports/SESSION_INTEGRATION_SUMMARY.md)
- [Session Summary](./reports/SESSION_SUMMARY.md)
- [Seeded Data Summary](./reports/SEEDED_DATA_SUMMARY.md)

### Planning and Analysis
- [Improvement Plan](./reports/IMPROVEMENT_PLAN.md)
- [Remediation Execution Plan](./reports/REMEDIATION_EXECUTION_PLAN.md)
- [Remediation Execution Plan Complete](./reports/REMEDIATION_EXECUTION_PLAN_COMPLETE.md)
- [Task Dependency DAG](./reports/TASK_DEPENDENCY_DAG.md)
- [Quick Execution Summary](./reports/QUICK_EXECUTION_SUMMARY.md)

### Codebase Analysis
- [Codebase Comparison](./reports/CODEBASE_COMPARISON.md)
- [Comprehensive Report](./reports/Report.md)

## Architecture Documentation

### System Architecture
The PDM Loan Management System follows a three-tier architecture:

```
Frontend Layer (Next.js/React)
        ↓
Application Layer (Spring Boot)
        ↓
Data Layer (MySQL)
```

### Technology Stack

**Frontend**
- Framework: Next.js 16 (App Router)
- Language: TypeScript 5
- Styling: Tailwind CSS 4
- Runtime: React 19

**Backend**
- Framework: Spring Boot 3.x
- Language: Java 17+
- Build Tool: Maven 3.8+
- Security: Spring Security with JWT

**Database**
- Database: MySQL 8.0
- ORM: Spring Data JPA
- Database Name: `olavs_db`

### Port Configuration
- Frontend: 4000
- Backend: 8080 (API at `/api`)
- Database: 3306

## Presentations and Documentation

- [Presentation Slides](./PRESENTATION_SLIDES.md) - Project presentation materials
- [Slide Content](./SLIDE_CONTENT.md) - Detailed slide content
- [Project Documentation](./PROJECT_DOCUMENTATION.md) - Comprehensive project documentation

## Key Features

### Application Workflow
1. **Application Submission** - Applicants create and submit loan applications
2. **Document Upload** - Upload required documents (ID, proof of income, etc.)
3. **Banker Review** - Bankers review application details and documents
4. **KYC/AML Verification** - Verifiers perform identity and AML checks
5. **Risk Assessment** - Underwriters assess risk and generate scores
6. **Offer Generation** - System generates loan offers based on assessment
7. **Contract Creation** - Digital contracts created upon offer acceptance
8. **Disbursement** - Approved loans are disbursed to applicant wallets
9. **Repayment** - Automated repayment schedule tracking

### User Roles
- **APPLICANT**: Submit applications, upload documents, manage loans
- **BANKER**: Review applications, request additional documents
- **VERIFIER**: Perform KYC/AML verification, verify documents
- **UNDERWRITER**: Conduct risk assessments, approve/reject applications
- **ADMIN**: Full system access, user management, system configuration

## Development Guidelines

### Code Standards
- **Backend**: Java 17 features, Spring Boot best practices, JavaDoc documentation
- **Frontend**: TypeScript strict mode, functional components, ESLint compliant
- **Testing**: Minimum 80% backend coverage, 70% frontend coverage
- **Security**: No hardcoded secrets, parameterized queries, JWT authentication

### Testing Requirements
- Unit tests for all services and utilities
- Integration tests for controllers and repositories
- End-to-end tests for critical user flows
- API endpoint testing

### Contributing
See [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- Development workflow
- Branch strategy
- Pull request process
- Coding standards
- Testing requirements
- Commit message guidelines

## Support and Resources

### Getting Help
- **Documentation Issues**: Check this index and linked documents
- **Setup Issues**: See [Quick Start Guide](./guides/QUICK_START.md)
- **Security Questions**: Review [Secret Management](./guides/SECRET_MANAGEMENT.md)
- **GitHub Issues**: Create an issue with detailed description

### Additional Resources
- [Main README](../README.md) - Project overview
- [Frontend README](../pdm-frontend/README.md) - Frontend details
- [Backend README](../pdm-backend/README.md) - Backend details
- [Database Scripts](../database/) - Database setup and migrations

## Project Status

- **Version**: 1.0.0
- **Status**: ~90% Complete (MVP Ready)
- **Last Updated**: December 2025
- **CI/CD**: GitHub Actions (see [T3.1 CI/CD Report](./reports/T3.1_CI_CD_IMPLEMENTATION_SUMMARY.md))

### Completion Summary
| Component | Status |
|-----------|--------|
| Database Schema | 100% (16 entities, 15 ENUMs) |
| Backend Services | 100% (75+ endpoints) |
| Frontend Design System | 100% (OLAVS complete) |
| Frontend Pages | 95% (all routes implemented) |
| Authentication & Security | 100% |
| Testing | 20% (needs expansion) |

## License

See [LICENSE](../LICENSE) file in the root directory.

---

**Navigation Tips**:
- Use the category headers above to find relevant documentation
- All paths are relative to the project root directory
- For quick setup, start with the [Quick Start Guide](./guides/QUICK_START.md)
- For security configuration, see [Secret Management](./guides/SECRET_MANAGEMENT.md)
- For development, review [CONTRIBUTING.md](../CONTRIBUTING.md)

**Need Help?** Check the relevant section above or create an issue on GitHub.
