# 🚀 Quick Start Guide

## ⚠️ First Time Setup

**Before starting the servers, you MUST configure environment variables:**

```bash
# Backend setup
cd pdm-backend
cp .env.example .env

# Generate secrets (see SECRET_MANAGEMENT.md for details)
openssl rand -base64 64  # For JWT_SECRET
openssl rand -base64 32  # For DB_PASSWORD
openssl rand -base64 32  # For MYSQL_ROOT_PASSWORD

# Edit .env and add the generated secrets
nano .env
```

```bash
# Frontend setup
cd pdm-frontend
cp .env.example .env.local
# Default values are usually fine for local development
```

**📚 For detailed secret management instructions, see [SECRET_MANAGEMENT.md](./SECRET_MANAGEMENT.md)**

---

## Start Backend

```bash
./start-backend.sh
```

OR manually:
```bash
cd pdm-backend
mvn spring-boot:run
```

Backend runs on: `http://localhost:8080/api`

## Start Frontend

```bash
./start-frontend.sh
```

OR manually:
```bash
cd pdm-frontend
npm run dev
```

Frontend runs on: `http://localhost:3000`

## Test API Routes

```bash
./test-api-routes.sh
```

This will test all 75+ API endpoints.

## All API Endpoints

### Auth (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (requires auth)
- `GET /health` - Health check

### Applications (`/api/v2/applications`)
- `GET /` - Get all applications
- `GET /{id}` - Get application by ID
- `POST /` - Create application
- `POST /{id}/submit` - Submit application
- `GET /banker/queue` - Banker queue
- `GET /verifier/queue` - Verifier queue
- `GET /underwriter/queue` - Underwriter queue
- `PUT /{id}` - Update application
- `PUT /{id}/status` - Update status
- `POST /{id}/assign` - Assign reviewer
- `POST /{id}/transition` - Move to next state
- `DELETE /{id}` - Delete application

### Documents (`/api/v2/documents`)
- `GET /application/{applicationId}` - Get documents for application
- `GET /{id}` - Get document by ID
- `POST /upload` - Upload document
- `PUT /{id}/verify` - Verify document
- `DELETE /{id}` - Delete document

### Verifications (`/api/v2/verifications`)
- `POST /kyc/start` - Start KYC verification
- `POST /aml/start` - Start AML verification
- `GET /application/{applicationId}` - Get verifications
- `GET /pending/kyc` - Pending KYC
- `GET /pending/aml` - Pending AML
- `POST /{id}/perform` - Perform verification
- `POST /{id}/kyc` - Update KYC status
- `POST /{id}/aml` - Update AML status

### Risk Assessments (`/api/v2/risk-assessments`)
- `POST /perform` - Perform risk assessment
- `GET /{id}` - Get assessment
- `GET /application/{applicationId}` - Get by application
- `PUT /{id}` - Update assessment

### Offers (`/api/v2/offers`)
- `POST /generate` - Generate offer
- `POST /{id}/send` - Send offer
- `GET /{id}` - Get offer
- `GET /application/{applicationId}` - Get by application
- `POST /{id}/accept` - Accept offer
- `POST /{id}/reject` - Reject offer
- `POST /calculate/monthly-payment` - Calculate EMI

### Contracts (`/api/v2/contracts`)
- `POST /create` - Create contract
- `GET /{id}` - Get contract
- `GET /application/{applicationId}` - Get by application
- `POST /{id}/sign-applicant` - Applicant signs
- `POST /{id}/sign-bank` - Bank signs

### Disbursements (`/api/v2/disbursements`)
- `POST /create` - Create disbursement
- `GET /{id}` - Get disbursement
- `POST /{id}/process` - Process disbursement

### Repayments (`/api/v2/repayments`)
- `POST /schedule` - Generate schedule
- `GET /schedule/{id}` - Get schedule
- `GET /installments/schedule/{scheduleId}` - Get installments
- `GET /installments/overdue` - Overdue installments
- `POST /payments` - Record payment

### Users (`/api/users`)
- `GET /` - Get all users
- `GET /{id}` - Get user by ID
- `PUT /{id}` - Update user
- `DELETE /{id}` - Delete user

### Wallets (`/api/wallets`)
- `GET /me` - Get my wallet
- `POST /deposit` - Deposit
- `POST /withdraw` - Withdraw

### Transactions (`/api/transactions`)
- `GET /` - Get all transactions
- `GET /{id}` - Get transaction

### Tickets (`/api/tickets`)
- `GET /` - Get all tickets
- `POST /` - Create ticket
- `PUT /{id}/status` - Update status

### Notifications (`/api/notifications`)
- `GET /` - Get notifications
- `PUT /{id}/read` - Mark as read
- `PUT /read-all` - Mark all read

---

**Total: 75+ API endpoints**

