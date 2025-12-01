# PDM Loan Management System - Complete Remediation Execution Plan
# Grade F+ (48/100) → A+++ (95+/100)

**Date:** 2025-11-27
**Current Grade:** F+ (48/100)
**Target Grade:** A+++ (95+/100)
**Estimated Timeline:** 8-10 weeks
**Required Team:** 2-3 developers + 1 security consultant

---

## Executive Summary

This execution plan provides a directed acyclic graph (DAG) of all remediation tasks required to bring the PDM Loan Management System from its current F+ grade to production-ready A+++ status. The plan addresses:

- **27 security vulnerabilities** (8 Critical, 12 High, 7 Medium)
- **0% test coverage** → 80%+ coverage
- **No authentication system** → Full Spring Security + JWT
- **Massive components** (1,026 lines) → Modular architecture
- **No CI/CD pipeline** → Complete automation
- **Poor code quality** → Professional standards

---

## Task Dependency DAG (Directed Acyclic Graph)

```
PHASE 1: CRITICAL SECURITY (Week 1-2)
│
├── T1.1: Implement Spring Security + JWT [CRITICAL] [8 days] → auth-gatekeeper
│   ├── No dependencies
│   └── Blocks: T2.1, T2.2, T2.3, T3.1
│
├── T1.2: Rotate All Secrets + Secret Management [CRITICAL] [3 days] → devops-pipeline-architect
│   ├── No dependencies
│   └── Blocks: T3.2, T4.4
│
├── T1.3: Database Security (SSL/TLS + Encryption) [CRITICAL] [5 days] → security-threat-modeler
│   ├── Depends on: T1.2
│   └── Blocks: T3.3
│
└── T1.4: Remove X-User-Id Header Auth [CRITICAL] [2 days] → api-service-builder
    ├── Depends on: T1.1
    └── Blocks: T2.1

PHASE 2: AUTHORIZATION & ACCESS CONTROL (Week 2-3)
│
├── T2.1: Role-Based Access Control (RBAC) [HIGH] [4 days] → auth-gatekeeper
│   ├── Depends on: T1.1, T1.4
│   └── Blocks: T3.1, T6.1
│
├── T2.2: CSRF Protection [HIGH] [2 days] → api-service-builder
│   ├── Depends on: T1.1
│   └── Blocks: T3.1
│
├── T2.3: Rate Limiting [HIGH] [2 days] → api-service-builder
│   ├── Depends on: T1.1
│   └── Blocks: None
│
└── T2.4: Audit Logging System [HIGH] [3 days] → api-service-builder
    ├── Depends on: T1.1
    └── Blocks: T6.1

PHASE 3: INFRASTRUCTURE & DEPLOYMENT (Week 3-4)
│
├── T3.1: CI/CD Pipeline Setup [CRITICAL] [5 days] → devops-pipeline-architect
│   ├── Depends on: T1.1, T2.1, T2.2
│   └── Blocks: T4.1, T4.2, T4.3
│
├── T3.2: Environment Configuration [HIGH] [3 days] → devops-pipeline-architect
│   ├── Depends on: T1.2
│   └── Blocks: T3.1
│
├── T3.3: Database Migration Framework [MEDIUM] [2 days] → api-service-builder
│   ├── Depends on: T1.3
│   └── Blocks: T5.4
│
└── T3.4: Monitoring & Alerting [HIGH] [3 days] → devops-pipeline-architect
    ├── Depends on: T3.1
    └── Blocks: T6.1

PHASE 4: TESTING INFRASTRUCTURE (Week 4-5) - PARALLEL EXECUTION
│
├── T4.1: Backend Testing Setup [CRITICAL] [3 days] → test-assurance
│   ├── Depends on: T3.1
│   └── Blocks: T4.3
│
├── T4.2: Frontend Testing Setup [CRITICAL] [3 days] → test-assurance
│   ├── Depends on: T3.1
│   └── Blocks: T4.3
│
├── T4.3: Critical Path Tests [HIGH] [8 days] → test-assurance
│   ├── Depends on: T4.1, T4.2
│   └── Blocks: None (tests run continuously)
│
└── T4.4: E2E Test Suite [HIGH] [5 days] → test-assurance
    ├── Depends on: T4.2, T1.2
    └── Blocks: None

PHASE 5: CODE QUALITY & REFACTORING (Week 5-7) - PARALLEL EXECUTION
│
├── T5.1: Refactor Massive Components [HIGH] [8 days] → frontend-integrator
│   ├── Depends on: T4.2
│   └── Blocks: T5.6
│
├── T5.2: Fix TypeScript Issues (Remove 'any') [HIGH] [4 days] → frontend-integrator
│   ├── Depends on: T5.1
│   └── Blocks: None
│
├── T5.3: CSS Migration (Inline → Modules/Tailwind) [HIGH] [6 days] → frontend-integrator
│   ├── Depends on: T5.1
│   └── Blocks: None
│
├── T5.4: Design System Consolidation [HIGH] [5 days] → ux-flow-mapper
│   ├── Depends on: T5.1
│   └── Blocks: T5.5
│
├── T5.5: Remove Console.log + Proper Logging [MEDIUM] [2 days] → frontend-integrator
│   ├── Depends on: T5.4
│   └── Blocks: None
│
├── T5.6: Add Missing Reusable Components [MEDIUM] [6 days] → frontend-integrator
│   ├── Depends on: T5.1
│   └── Blocks: None
│
└── T5.7: Backend Code Quality Tools [MEDIUM] [3 days] → api-service-builder
    ├── Depends on: T3.1
    └── Blocks: None

PHASE 6: COMPLIANCE & DOCUMENTATION (Week 7-8)
│
├── T6.1: Security Compliance Audit [HIGH] [3 days] → security-threat-modeler
│   ├── Depends on: T2.1, T2.4, T3.4
│   └── Blocks: T6.5
│
├── T6.2: Accessibility (a11y) Remediation [HIGH] [5 days] → ux-flow-mapper
│   ├── Depends on: T5.1
│   └── Blocks: None
│
├── T6.3: API Documentation (Swagger/OpenAPI) [HIGH] [3 days] → docs-engine
│   ├── Depends on: T2.1
│   └── Blocks: None
│
├── T6.4: README + Developer Documentation [MEDIUM] [4 days] → docs-engine
│   ├── Depends on: T3.1
│   └── Blocks: None
│
├── T6.5: Penetration Testing [CRITICAL] [5 days] → security-threat-modeler
│   ├── Depends on: T6.1
│   └── Blocks: T7.1
│
└── T6.6: Performance Optimization [MEDIUM] [5 days] → frontend-integrator
    ├── Depends on: T5.3
    └── Blocks: None

PHASE 7: FINAL VALIDATION & DEPLOYMENT (Week 8-10)
│
├── T7.1: Security Fixes from Pen Test [CRITICAL] [5 days] → ALL AGENTS
│   ├── Depends on: T6.5
│   └── Blocks: T7.3
│
├── T7.2: Production Environment Setup [HIGH] [3 days] → devops-pipeline-architect
│   ├── Depends on: T3.1, T3.2
│   └── Blocks: T7.3
│
├── T7.3: Pre-Production Testing [HIGH] [5 days] → test-assurance
│   ├── Depends on: T7.1, T7.2
│   └── Blocks: T7.4
│
└── T7.4: Production Deployment [CRITICAL] [2 days] → devops-pipeline-architect
    ├── Depends on: T7.3
    └── Blocks: None (FINAL TASK)
```

---

## Parallel Execution Opportunities

### Week 1-2: Critical Security (All Sequential)
- **NO PARALLELISM** - Security tasks must be done in order
- T1.1 → T1.4 → (T2.1, T2.2, T2.3 can run parallel)

### Week 3-4: Infrastructure + Authorization (Partial Parallel)
- **PARALLEL GROUP 1:**
  - T2.1 (RBAC)
  - T2.2 (CSRF)
  - T2.3 (Rate Limiting)
  - T2.4 (Audit Logging)
- **SEQUENTIAL:** T3.1 (CI/CD) waits for Group 1

### Week 4-5: Testing Infrastructure (Highly Parallel)
- **PARALLEL GROUP 2:**
  - T4.1 (Backend tests)
  - T4.2 (Frontend tests)
  - T4.4 (E2E tests - after T4.2 completes)
- **SEQUENTIAL:** T4.3 (Critical path tests) waits for T4.1 + T4.2

### Week 5-7: Code Quality (Highly Parallel)
- **PARALLEL GROUP 3:**
  - T5.1 (Component refactoring) - START FIRST
  - T5.2 (TypeScript fixes) - after T5.1
  - T5.3 (CSS migration) - after T5.1
  - T5.4 (Design system) - after T5.1
  - T5.5 (Logging) - after T5.4
  - T5.6 (Reusable components) - after T5.1
  - T5.7 (Backend quality tools) - INDEPENDENT, start immediately

### Week 7-8: Compliance (Partial Parallel)
- **PARALLEL GROUP 4:**
  - T6.2 (Accessibility)
  - T6.3 (API docs)
  - T6.4 (README docs)
  - T6.6 (Performance optimization)
- **SEQUENTIAL:**
  - T6.1 (Security audit) → T6.5 (Pen test) → T7.1 (Fixes)

---

## Detailed Task Breakdown

### PHASE 1: CRITICAL SECURITY (Week 1-2)

#### T1.1: Implement Spring Security + JWT Authentication
**Agent:** auth-gatekeeper
**Priority:** P0 - CRITICAL
**Duration:** 8 days
**Dependencies:** None
**Blocks:** T2.1, T2.2, T2.3, T3.1

**Acceptance Criteria:**
- [ ] SecurityConfig.java created with @EnableWebSecurity
- [ ] JwtAuthenticationFilter implemented
- [ ] JwtService with token generation/validation
- [ ] UserDetailsService implementation
- [ ] BCrypt password encoder (cost factor 12)
- [ ] All passwords hashed in database
- [ ] JWT expiration: 24 hours (access), 7 days (refresh)
- [ ] No X-User-Id header authentication remains
- [ ] Tests: 90%+ coverage for auth flows

**Deliverables:**
- `/pdm-backend/src/main/java/com/loanweb/config/SecurityConfig.java`
- `/pdm-backend/src/main/java/com/loanweb/config/JwtAuthenticationFilter.java`
- `/pdm-backend/src/main/java/com/loanweb/config/JwtService.java`
- `/pdm-backend/src/main/java/com/loanweb/service/CustomUserDetailsService.java`
- `/pdm-backend/src/test/java/com/loanweb/security/` (test suite)
- Migration script: `V3__Hash_Passwords.sql`

**Verification:**
```bash
# Test 1: Cannot access protected endpoint without token
curl http://localhost:4001/api/loans
# Expected: 401 Unauthorized

# Test 2: Valid JWT allows access
curl -H "Authorization: Bearer <valid_jwt>" http://localhost:4001/api/loans
# Expected: 200 OK
```

---

#### T1.2: Rotate All Secrets + Secret Management
**Agent:** devops-pipeline-architect
**Priority:** P0 - CRITICAL
**Duration:** 3 days
**Dependencies:** None
**Blocks:** T3.2, T4.4

**Acceptance Criteria:**
- [ ] All secrets moved to AWS Secrets Manager (or equivalent)
- [ ] JWT_SECRET rotated (new 256-bit key)
- [ ] DB_PASSWORD rotated
- [ ] Encryption keys rotated
- [ ] Git history cleaned of secrets (BFG Repo-Cleaner)
- [ ] .env.example created with dummy values
- [ ] Automatic rotation enabled (30 days)
- [ ] IAM roles configured for secret access
- [ ] No secrets in code or environment variables on server

**Deliverables:**
- AWS Secrets Manager setup (or Vault)
- `/pdm-backend/src/main/java/com/loanweb/config/SecretsConfig.java`
- `/.env.example` (template for developers)
- `/docs/SECRET_ROTATION_PROCEDURE.md`
- Git history cleanup script

**Verification:**
```bash
# Test: No secrets in code
git log --all --full-history --source -- '*' | grep -i "password\|secret\|api_key"
# Expected: No results (or only .env.example references)

# Test: Application retrieves secrets from manager
aws secretsmanager get-secret-value --secret-id pdm/jwt/secret
# Expected: Current JWT secret value
```

---

#### T1.3: Database Security (SSL/TLS + Encryption)
**Agent:** security-threat-modeler
**Priority:** P0 - CRITICAL
**Duration:** 5 days
**Dependencies:** T1.2
**Blocks:** T3.3

**Acceptance Criteria:**
- [ ] Database connection uses SSL/TLS (useSSL=true, requireSSL=true)
- [ ] VPN or Cloud SQL Proxy configured
- [ ] Firewall rules restrict access to application IPs only
- [ ] Field-level encryption for PII (national ID, address, phone)
- [ ] EncryptionService implementation (AES-256-GCM)
- [ ] Encryption keys stored in secrets manager
- [ ] Database credentials rotated
- [ ] Connection pooling configured (HikariCP)

**Deliverables:**
- `/pdm-backend/src/main/java/com/loanweb/config/EncryptionService.java`
- `/pdm-backend/src/main/java/com/loanweb/config/EncryptedStringConverter.java`
- Updated entity classes with @Convert annotation
- `application.yml` with SSL configuration
- Firewall rules documentation
- Cloud SQL Proxy setup (if GCP)

**Verification:**
```bash
# Test: Database connection uses SSL
mysql -h <db_host> --ssl-mode=REQUIRED -u pdm_user -p
# Expected: Successful connection with SSL

# Test: Field-level encryption
mysql> SELECT national_id FROM applicants LIMIT 1;
# Expected: Encrypted base64 string, not plaintext
```

---

#### T1.4: Remove X-User-Id Header Authentication
**Agent:** api-service-builder
**Priority:** P0 - CRITICAL
**Duration:** 2 days
**Dependencies:** T1.1
**Blocks:** T2.1

**Acceptance Criteria:**
- [ ] All @RequestHeader("X-User-Id") removed from controllers
- [ ] Controllers use @AuthenticationPrincipal User instead
- [ ] SecurityContext accessed for current user
- [ ] Tests verify unauthorized access is blocked
- [ ] No user-supplied headers trusted for authentication

**Deliverables:**
- Updated controller files (all in `/pdm-backend/src/main/java/com/loanweb/web/`)
- Unit tests for each controller
- Integration tests for authentication

**Verification:**
```bash
# Test: X-User-Id header no longer works
curl -H "X-User-Id: 1" http://localhost:4001/api/messages/inbox
# Expected: 401 Unauthorized (not 200 OK)
```

---

### PHASE 2: AUTHORIZATION & ACCESS CONTROL (Week 2-3)

#### T2.1: Role-Based Access Control (RBAC)
**Agent:** auth-gatekeeper
**Priority:** P0 - HIGH
**Duration:** 4 days
**Dependencies:** T1.1, T1.4
**Blocks:** T3.1, T6.1

**Acceptance Criteria:**
- [ ] @EnableMethodSecurity annotation configured
- [ ] @PreAuthorize annotations on all protected endpoints
- [ ] Permission matrix implemented
- [ ] Roles: APPLICANT, BANKER, VERIFIER, UNDERWRITER, ADMIN
- [ ] Admin endpoints require ADMIN role
- [ ] Staff endpoints require appropriate staff roles
- [ ] IDOR vulnerabilities patched
- [ ] Tests verify role enforcement

**Deliverables:**
- Updated SecurityConfig with method security
- `/pdm-backend/src/main/java/com/loanweb/config/PermissionConfig.java`
- All controllers updated with @PreAuthorize
- Authorization tests (90%+ coverage)
- Permission matrix documentation

**Verification:**
```bash
# Test: APPLICANT cannot access admin endpoints
curl -H "Authorization: Bearer <applicant_token>" http://localhost:4001/api/admin/users
# Expected: 403 Forbidden

# Test: ADMIN can access all endpoints
curl -H "Authorization: Bearer <admin_token>" http://localhost:4001/api/admin/users
# Expected: 200 OK
```

---

#### T2.2: CSRF Protection
**Agent:** api-service-builder
**Priority:** P1 - HIGH
**Duration:** 2 days
**Dependencies:** T1.1
**Blocks:** T3.1

**Acceptance Criteria:**
- [ ] CSRF protection enabled in SecurityConfig
- [ ] CookieCsrfTokenRepository configured
- [ ] Frontend sends CSRF token in X-XSRF-TOKEN header
- [ ] CORS properly configured (no wildcard with credentials)
- [ ] Login/register endpoints exempt from CSRF
- [ ] Tests verify CSRF enforcement

**Deliverables:**
- Updated SecurityConfig with CSRF configuration
- `/pdm-backend/src/main/java/com/loanweb/config/CorsConfig.java`
- Frontend lib/csrf.ts with token extraction
- CSRF tests

**Verification:**
```bash
# Test: POST without CSRF token fails
curl -X POST http://localhost:4001/api/messages -H "Authorization: Bearer <token>" -d '{...}'
# Expected: 403 Forbidden

# Test: POST with CSRF token succeeds
curl -X POST http://localhost:4001/api/messages -H "Authorization: Bearer <token>" -H "X-XSRF-TOKEN: <csrf>" -d '{...}'
# Expected: 201 Created
```

---

#### T2.3: Rate Limiting
**Agent:** api-service-builder
**Priority:** P1 - HIGH
**Duration:** 2 days
**Dependencies:** T1.1
**Blocks:** None

**Acceptance Criteria:**
- [ ] Rate limiting filter implemented (Bucket4j)
- [ ] General endpoints: 100 requests/minute per IP
- [ ] Login/register: 10 requests/minute per IP
- [ ] 429 status returned when rate limited
- [ ] IP address correctly extracted (handles X-Forwarded-For)
- [ ] Cache cleanup for old entries

**Deliverables:**
- `/pdm-backend/src/main/java/com/loanweb/config/RateLimitFilter.java`
- Bucket4j dependency in pom.xml
- Rate limit tests

**Verification:**
```bash
# Test: Rate limit enforced
for i in {1..150}; do curl http://localhost:4001/api/auth/login -d '{...}' & done
# Expected: Some requests return 429 Too Many Requests
```

---

#### T2.4: Audit Logging System
**Agent:** api-service-builder
**Priority:** P1 - HIGH
**Duration:** 3 days
**Dependencies:** T1.1
**Blocks:** T6.1

**Acceptance Criteria:**
- [ ] audit_logs table created
- [ ] AuditLog entity implemented
- [ ] AuditLogService with aspect-oriented logging
- [ ] Logs: loan approvals, disbursements, payments, role changes, data access
- [ ] IP address and request ID captured
- [ ] Audit logs immutable (no UPDATE/DELETE)
- [ ] 7-year retention policy configured

**Deliverables:**
- `/pdm-backend/src/main/java/com/loanweb/domain/audit/AuditLog.java`
- `/pdm-backend/src/main/java/com/loanweb/service/AuditLogService.java`
- `/pdm-backend/src/main/java/com/loanweb/aspect/AuditAspect.java`
- Migration: `V4__Add_Audit_Logs.sql`
- Audit log tests

**Verification:**
```bash
# Test: Loan approval creates audit log
mysql> SELECT * FROM audit_logs WHERE action = 'LOAN_APPROVED' ORDER BY timestamp DESC LIMIT 1;
# Expected: Record with user ID, before/after state, timestamp
```

---

### PHASE 3: INFRASTRUCTURE & DEPLOYMENT (Week 3-4)

#### T3.1: CI/CD Pipeline Setup
**Agent:** devops-pipeline-architect
**Priority:** P0 - CRITICAL
**Duration:** 5 days
**Dependencies:** T1.1, T2.1, T2.2
**Blocks:** T4.1, T4.2, T4.3

**Acceptance Criteria:**
- [ ] GitHub Actions workflows created
- [ ] Frontend CI: lint, test, build
- [ ] Backend CI: test, build, security scan
- [ ] Automated dependency updates (Dependabot)
- [ ] Code coverage reporting (80%+ required)
- [ ] Security scanning (OWASP Dependency Check, Snyk)
- [ ] Pull request checks mandatory
- [ ] Deployment to staging on main branch merge
- [ ] Production deployment manual approval

**Deliverables:**
- `/.github/workflows/frontend-ci.yml`
- `/.github/workflows/backend-ci.yml`
- `/.github/workflows/deploy-staging.yml`
- `/.github/workflows/deploy-production.yml`
- `/.github/dependabot.yml`
- CI/CD documentation

**Verification:**
```bash
# Test: Push to branch triggers CI
git push origin feature/test-ci
# Expected: GitHub Actions run shows all checks passing

# Test: PR without tests is blocked
# Expected: CI fails if test coverage < 80%
```

---

#### T3.2: Environment Configuration
**Agent:** devops-pipeline-architect
**Priority:** P1 - HIGH
**Duration:** 3 days
**Dependencies:** T1.2
**Blocks:** T3.1

**Acceptance Criteria:**
- [ ] Environment variables for dev, staging, prod
- [ ] Environment-specific configuration files
- [ ] Validation that required variables are set
- [ ] Fail-fast on missing configuration
- [ ] No defaults for production secrets

**Deliverables:**
- `/pdm-backend/src/main/resources/application-dev.yml`
- `/pdm-backend/src/main/resources/application-staging.yml`
- `/pdm-backend/src/main/resources/application-prod.yml`
- `/pdm-frontend/.env.example`
- Environment configuration documentation

**Verification:**
```bash
# Test: Application fails if JWT_SECRET not set
unset JWT_SECRET && ./mvnw spring-boot:run
# Expected: Application startup fails with clear error message
```

---

#### T3.3: Database Migration Framework
**Agent:** api-service-builder
**Priority:** P2 - MEDIUM
**Duration:** 2 days
**Dependencies:** T1.3
**Blocks:** T5.4

**Acceptance Criteria:**
- [ ] Flyway or Liquibase configured
- [ ] Existing migrations organized
- [ ] Baseline migration created
- [ ] Migration versioning strategy
- [ ] Rollback scripts for critical migrations

**Deliverables:**
- Flyway dependency in pom.xml
- `/pdm-backend/src/main/resources/db/migration/` (all migrations)
- `application.yml` with Flyway configuration
- Migration documentation

**Verification:**
```bash
# Test: Flyway migrations run on startup
./mvnw spring-boot:run
# Expected: Console shows "Migrating schema to version X"
```

---

#### T3.4: Monitoring & Alerting
**Agent:** devops-pipeline-architect
**Priority:** P1 - HIGH
**Duration:** 3 days
**Dependencies:** T3.1
**Blocks:** T6.1

**Acceptance Criteria:**
- [ ] Application metrics (Prometheus/Micrometer)
- [ ] Dashboard (Grafana)
- [ ] Error tracking (Sentry for frontend)
- [ ] Log aggregation (ELK stack or CloudWatch)
- [ ] Alerts for: failed logins, 5xx errors, high latency
- [ ] Uptime monitoring

**Deliverables:**
- Prometheus configuration
- Grafana dashboards (JSON exports)
- Sentry integration
- `/pdm-backend/src/main/java/com/loanweb/config/MetricsConfig.java`
- Monitoring documentation

**Verification:**
```bash
# Test: Metrics endpoint accessible
curl http://localhost:4001/actuator/metrics
# Expected: JSON with application metrics

# Test: Failed login triggers alert
# Expected: Alert sent to monitoring channel
```

---

### PHASE 4: TESTING INFRASTRUCTURE (Week 4-5)

#### T4.1: Backend Testing Setup
**Agent:** test-assurance
**Priority:** P0 - CRITICAL
**Duration:** 3 days
**Dependencies:** T3.1
**Blocks:** T4.3

**Acceptance Criteria:**
- [ ] JUnit 5 configured
- [ ] Mockito for mocking
- [ ] Spring Boot Test for integration tests
- [ ] Test database (H2 or Testcontainers)
- [ ] JaCoCo for code coverage
- [ ] Tests run in CI pipeline
- [ ] 80%+ coverage requirement enforced

**Deliverables:**
- `/pdm-backend/src/test/java/` (test structure)
- `pom.xml` with test dependencies
- `/pdm-backend/src/test/resources/application-test.yml`
- Test configuration documentation

**Verification:**
```bash
# Test: Run tests
./mvnw test
# Expected: All tests pass, coverage report generated

# Test: Coverage requirement
./mvnw verify
# Expected: Build fails if coverage < 80%
```

---

#### T4.2: Frontend Testing Setup
**Agent:** test-assurance
**Priority:** P0 - CRITICAL
**Duration:** 3 days
**Dependencies:** T3.1
**Blocks:** T4.3

**Acceptance Criteria:**
- [ ] Jest configured
- [ ] React Testing Library
- [ ] Coverage reporting
- [ ] Test utilities and helpers
- [ ] Mock API client
- [ ] Tests run in CI pipeline

**Deliverables:**
- `jest.config.js`
- `/__tests__/` (test structure)
- `/__mocks__/` (API mocks)
- Test utilities in `/lib/test-utils.ts`

**Verification:**
```bash
# Test: Run tests
npm test
# Expected: All tests pass

# Test: Coverage requirement
npm run test:coverage
# Expected: Coverage report shows 80%+ coverage
```

---

#### T4.3: Critical Path Tests
**Agent:** test-assurance
**Priority:** P1 - HIGH
**Duration:** 8 days
**Dependencies:** T4.1, T4.2
**Blocks:** None

**Acceptance Criteria:**
- [ ] Authentication flow tests (login, register, logout)
- [ ] Application submission tests
- [ ] Loan approval workflow tests
- [ ] Payment processing tests
- [ ] Authorization tests (role-based access)
- [ ] CSRF protection tests
- [ ] Rate limiting tests
- [ ] 90%+ coverage for critical paths

**Deliverables:**
- Backend tests: `/pdm-backend/src/test/java/com/loanweb/`
- Frontend tests: `/__tests__/` (all critical components)
- Integration tests: `/pdm-backend/src/test/java/integration/`

**Verification:**
```bash
# Test: Run all tests
./mvnw verify && npm test
# Expected: All tests pass, coverage > 80%
```

---

#### T4.4: E2E Test Suite
**Agent:** test-assurance
**Priority:** P1 - HIGH
**Duration:** 5 days
**Dependencies:** T4.2, T1.2
**Blocks:** None

**Acceptance Criteria:**
- [ ] Playwright configured
- [ ] E2E tests for applicant flow (register → apply → accept offer)
- [ ] E2E tests for staff flow (review → verify → approve → disburse)
- [ ] Tests run in CI on staging environment
- [ ] Screenshot/video on failure

**Deliverables:**
- `/e2e/` (Playwright test suite)
- `playwright.config.ts`
- E2E test documentation

**Verification:**
```bash
# Test: Run E2E tests
npx playwright test
# Expected: All critical flows pass
```

---

### PHASE 5: CODE QUALITY & REFACTORING (Week 5-7)

#### T5.1: Refactor Massive Components
**Agent:** frontend-integrator
**Priority:** P1 - HIGH
**Duration:** 8 days
**Dependencies:** T4.2
**Blocks:** T5.6

**Acceptance Criteria:**
- [ ] Landing page (1,026 lines) → 6 components (<200 lines each)
- [ ] Application form (890 lines) → 4 step components
- [ ] All components < 400 lines
- [ ] Extract custom hooks (useApplicationForm, etc.)
- [ ] Reusable components identified and created
- [ ] Tests for all new components

**Deliverables:**
- `/pdm-frontend/components/landing/` (Hero, Features, etc.)
- `/pdm-frontend/components/applications/` (form step components)
- `/pdm-frontend/hooks/` (custom hooks)
- Updated page files (now just orchestration)

**Verification:**
```bash
# Test: No file > 400 lines
find pdm-frontend/app -name "*.tsx" | xargs wc -l | sort -n | tail -1
# Expected: Max 400 lines
```

---

#### T5.2: Fix TypeScript Issues (Remove 'any')
**Agent:** frontend-integrator
**Priority:** P1 - HIGH
**Duration:** 4 days
**Dependencies:** T5.1
**Blocks:** None

**Acceptance Criteria:**
- [ ] All `any` types removed (currently 28 instances)
- [ ] Proper interfaces for all API responses
- [ ] Shared types between frontend/backend
- [ ] Strict null checks enabled
- [ ] No type assertions without justification

**Deliverables:**
- `/pdm-frontend/lib/types.ts` (complete type definitions)
- Updated components with proper typing
- tsconfig.json with strict mode

**Verification:**
```bash
# Test: No 'any' types in code
grep -r "any" pdm-frontend/app --include="*.tsx" --include="*.ts" | grep -v "node_modules"
# Expected: 0 results (or only justified uses with // @ts-expect-error comment)
```

---

#### T5.3: CSS Migration (Inline → Modules/Tailwind)
**Agent:** frontend-integrator
**Priority:** P1 - HIGH
**Duration:** 6 days
**Dependencies:** T5.1
**Blocks:** None

**Acceptance Criteria:**
- [ ] All inline styles removed
- [ ] CSS Modules or Tailwind classes used
- [ ] Design system tokens applied consistently
- [ ] No style objects in component code
- [ ] Performance improvement measurable

**Deliverables:**
- CSS Module files (`.module.css`) OR Tailwind configuration
- Updated components with proper styling
- Style guide documentation

**Verification:**
```bash
# Test: No inline style objects
grep -r "style={{" pdm-frontend/app --include="*.tsx"
# Expected: 0 results
```

---

#### T5.4: Design System Consolidation
**Agent:** ux-flow-mapper
**Priority:** P1 - HIGH
**Duration:** 5 days
**Dependencies:** T5.1
**Blocks:** T5.5

**Acceptance Criteria:**
- [ ] Single design system (merge OlavsDesign + PremiumTheme)
- [ ] Delete duplicate components (Button.tsx, Card.tsx)
- [ ] All imports updated to use Olavs components
- [ ] Storybook for component library (optional but recommended)
- [ ] Design tokens documented

**Deliverables:**
- Updated `/pdm-frontend/lib/olavs-design-system.ts`
- Deleted `/pdm-frontend/lib/premium-theme.ts`
- Deleted `/pdm-frontend/components/Button.tsx`, `Card.tsx`, etc.
- Component library documentation

**Verification:**
```bash
# Test: No duplicate components
ls pdm-frontend/components/ | grep -E "^(Button|Card|StatusBadge)\.tsx$"
# Expected: No results (only Olavs versions exist)
```

---

#### T5.5: Remove Console.log + Proper Logging
**Agent:** frontend-integrator
**Priority:** P2 - MEDIUM
**Duration:** 2 days
**Dependencies:** T5.4
**Blocks:** None

**Acceptance Criteria:**
- [ ] All console.log statements removed (currently 51)
- [ ] Logger utility created (dev/prod separation)
- [ ] Sentry integration for error tracking
- [ ] ESLint rule enforces no-console

**Deliverables:**
- `/pdm-frontend/lib/logger.ts`
- Sentry configuration
- Updated `.eslintrc.js` with no-console rule
- All components updated

**Verification:**
```bash
# Test: No console.log in production code
grep -r "console\." pdm-frontend/app --include="*.tsx" --include="*.ts"
# Expected: 0 results
```

---

#### T5.6: Add Missing Reusable Components
**Agent:** frontend-integrator
**Priority:** P2 - MEDIUM
**Duration:** 6 days
**Dependencies:** T5.1
**Blocks:** None

**Acceptance Criteria:**
- [ ] OlavsModal component
- [ ] OlavsFormField component (with validation)
- [ ] OlavsDataTable component
- [ ] OlavsStatusTimeline component
- [ ] OlavsToast notifications
- [ ] All with comprehensive tests

**Deliverables:**
- `/pdm-frontend/components/OlavsModal.tsx`
- `/pdm-frontend/components/OlavsFormField.tsx`
- `/pdm-frontend/components/OlavsDataTable.tsx`
- `/pdm-frontend/components/OlavsStatusTimeline.tsx`
- `/pdm-frontend/components/OlavsToast.tsx`
- Tests for each component

**Verification:**
```bash
# Test: Components exist and are tested
ls pdm-frontend/components/Olavs*.tsx && npm test
# Expected: All components present, tests pass
```

---

#### T5.7: Backend Code Quality Tools
**Agent:** api-service-builder
**Priority:** P2 - MEDIUM
**Duration:** 3 days
**Dependencies:** T3.1
**Blocks:** None

**Acceptance Criteria:**
- [ ] Checkstyle configured
- [ ] SpotBugs with security plugin
- [ ] PMD configured
- [ ] SonarQube analysis
- [ ] Code quality gates in CI

**Deliverables:**
- `checkstyle.xml`
- SpotBugs configuration in pom.xml
- SonarQube properties
- CI integration

**Verification:**
```bash
# Test: Run code quality checks
./mvnw checkstyle:check spotbugs:check pmd:check
# Expected: All checks pass
```

---

### PHASE 6: COMPLIANCE & DOCUMENTATION (Week 7-8)

#### T6.1: Security Compliance Audit
**Agent:** security-threat-modeler
**Priority:** P1 - HIGH
**Duration:** 3 days
**Dependencies:** T2.1, T2.4, T3.4
**Blocks:** T6.5

**Acceptance Criteria:**
- [ ] All critical vulnerabilities fixed
- [ ] OWASP Top 10 compliance verified
- [ ] Security headers configured
- [ ] GDPR requirements addressed
- [ ] Audit log review
- [ ] Compliance checklist completed

**Deliverables:**
- Security compliance report
- OWASP Top 10 checklist (all items passed)
- GDPR compliance documentation
- Security headers configuration

**Verification:**
```bash
# Test: Security headers present
curl -I https://pdm-app.com
# Expected: X-Content-Type-Options, X-Frame-Options, CSP, etc.
```

---

#### T6.2: Accessibility (a11y) Remediation
**Agent:** ux-flow-mapper
**Priority:** P1 - HIGH
**Duration:** 5 days
**Dependencies:** T5.1
**Blocks:** None

**Acceptance Criteria:**
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation working
- [ ] Screen reader support
- [ ] Focus visible styles
- [ ] ARIA labels on interactive elements
- [ ] Color contrast meets AA standards
- [ ] Automated a11y tests (axe-core)

**Deliverables:**
- Updated components with ARIA attributes
- Focus management implementation
- Accessibility testing suite
- a11y documentation

**Verification:**
```bash
# Test: Automated a11y checks
npm run test:a11y
# Expected: 0 violations

# Manual test: Keyboard navigation works throughout app
```

---

#### T6.3: API Documentation (Swagger/OpenAPI)
**Agent:** docs-engine
**Priority:** P1 - HIGH
**Duration:** 3 days
**Dependencies:** T2.1
**Blocks:** None

**Acceptance Criteria:**
- [ ] Swagger/OpenAPI spec generated
- [ ] All endpoints documented
- [ ] Request/response examples
- [ ] Authentication documented
- [ ] Error codes documented
- [ ] Swagger UI accessible at /api/docs

**Deliverables:**
- Springdoc OpenAPI dependency
- `/pdm-backend/src/main/java/com/loanweb/config/OpenApiConfig.java`
- OpenAPI annotations on controllers
- API documentation at `/api/docs`

**Verification:**
```bash
# Test: Swagger UI accessible
curl http://localhost:4001/api/docs
# Expected: Swagger UI HTML page
```

---

#### T6.4: README + Developer Documentation
**Agent:** docs-engine
**Priority:** P2 - MEDIUM
**Duration:** 4 days
**Dependencies:** T3.1
**Blocks:** None

**Acceptance Criteria:**
- [ ] README.md in root
- [ ] README.md in pdm-frontend/
- [ ] README.md in pdm-backend/
- [ ] Architecture documentation
- [ ] Setup instructions
- [ ] Development guide
- [ ] Deployment guide
- [ ] Contribution guidelines

**Deliverables:**
- `/README.md`
- `/pdm-frontend/README.md`
- `/pdm-backend/README.md`
- `/docs/ARCHITECTURE.md`
- `/docs/DEVELOPMENT.md`
- `/docs/DEPLOYMENT.md`
- `/docs/CONTRIBUTING.md`

**Verification:**
```bash
# Test: New developer can set up project using README
# Expected: Following README instructions results in working dev environment
```

---

#### T6.5: Penetration Testing
**Agent:** security-threat-modeler
**Priority:** P0 - CRITICAL
**Duration:** 5 days
**Dependencies:** T6.1
**Blocks:** T7.1

**Acceptance Criteria:**
- [ ] Automated security scanning (OWASP ZAP, Burp Suite)
- [ ] Manual penetration testing
- [ ] Authentication bypass attempts
- [ ] Authorization escalation tests
- [ ] SQL injection tests
- [ ] XSS tests
- [ ] CSRF tests
- [ ] Findings documented with severity ratings

**Deliverables:**
- Penetration test report
- Vulnerability findings (categorized by severity)
- Remediation recommendations

**Verification:**
```bash
# Test: Run OWASP ZAP automated scan
zap-cli quick-scan --self-contained http://localhost:4001/api
# Expected: Report generated with findings
```

---

#### T6.6: Performance Optimization
**Agent:** frontend-integrator
**Priority:** P2 - MEDIUM
**Duration:** 5 days
**Dependencies:** T5.3
**Blocks:** None

**Acceptance Criteria:**
- [ ] Code splitting implemented
- [ ] Lazy loading for routes
- [ ] Image optimization (next/image)
- [ ] Bundle size < 250KB (gzipped)
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] API response caching

**Deliverables:**
- Dynamic imports for heavy components
- Optimized images
- Bundle analyzer report
- Lighthouse performance report

**Verification:**
```bash
# Test: Run Lighthouse
lighthouse http://localhost:4000 --only-categories=performance
# Expected: Score > 90

# Test: Bundle size
npm run build && du -sh .next/static/**/*.js | sort -h | tail -1
# Expected: < 250KB gzipped
```

---

### PHASE 7: FINAL VALIDATION & DEPLOYMENT (Week 8-10)

#### T7.1: Security Fixes from Penetration Test
**Agent:** ALL AGENTS (as needed)
**Priority:** P0 - CRITICAL
**Duration:** 5 days
**Dependencies:** T6.5
**Blocks:** T7.3

**Acceptance Criteria:**
- [ ] All critical findings fixed
- [ ] All high findings fixed
- [ ] Medium findings addressed or documented as acceptable risk
- [ ] Re-test confirms fixes
- [ ] Security sign-off obtained

**Deliverables:**
- Code fixes for all vulnerabilities
- Re-test report showing fixes verified
- Risk acceptance documentation (for medium/low items)

**Verification:**
```bash
# Test: Re-run penetration tests
# Expected: No critical or high vulnerabilities remain
```

---

#### T7.2: Production Environment Setup
**Agent:** devops-pipeline-architect
**Priority:** P1 - HIGH
**Duration:** 3 days
**Dependencies:** T3.1, T3.2
**Blocks:** T7.3

**Acceptance Criteria:**
- [ ] Production infrastructure provisioned
- [ ] Load balancer configured
- [ ] SSL certificates installed
- [ ] Database replication setup
- [ ] Backup strategy implemented
- [ ] Disaster recovery plan documented
- [ ] Monitoring configured for production

**Deliverables:**
- Production infrastructure (Terraform/CloudFormation)
- SSL certificate configuration
- Database backup scripts
- Disaster recovery documentation

**Verification:**
```bash
# Test: Production environment health checks
curl https://pdm-app.com/api/health
# Expected: 200 OK with health status
```

---

#### T7.3: Pre-Production Testing
**Agent:** test-assurance
**Priority:** P1 - HIGH
**Duration:** 5 days
**Dependencies:** T7.1, T7.2
**Blocks:** T7.4

**Acceptance Criteria:**
- [ ] Full regression test suite passes
- [ ] E2E tests pass in staging environment
- [ ] Load testing completed (100 concurrent users)
- [ ] Security scan passed
- [ ] User acceptance testing completed
- [ ] Performance metrics meet SLA
- [ ] No critical bugs in backlog

**Deliverables:**
- Regression test report
- Load test report
- UAT sign-off
- Production readiness checklist (all items checked)

**Verification:**
```bash
# Test: Run all tests against staging
npm run test:e2e:staging && ./mvnw verify -Pstaging
# Expected: All tests pass

# Test: Load testing
k6 run load-test.js
# Expected: 95th percentile response time < 500ms
```

---

#### T7.4: Production Deployment
**Agent:** devops-pipeline-architect
**Priority:** P0 - CRITICAL
**Duration:** 2 days
**Dependencies:** T7.3
**Blocks:** None (FINAL TASK)

**Acceptance Criteria:**
- [ ] Blue-green deployment strategy
- [ ] Database migration successful
- [ ] Application deployed without errors
- [ ] Health checks pass
- [ ] Smoke tests pass
- [ ] Rollback plan tested
- [ ] Monitoring confirms system stability
- [ ] User notification sent

**Deliverables:**
- Production deployment runbook
- Post-deployment verification report
- Rollback plan
- Incident response plan

**Verification:**
```bash
# Test: Production health checks
curl https://pdm-app.com/api/health
# Expected: 200 OK

# Test: Critical user flows work
# Run E2E tests against production (non-destructive)
```

---

## Quality Gates & Checkpoints

### Gate 1: Security Foundation (End of Week 2)
**Criteria:**
- [ ] All P0 security tasks complete (T1.1, T1.2, T1.3, T1.4)
- [ ] Penetration test shows no critical auth vulnerabilities
- [ ] All secrets rotated and secured
- [ ] Database encrypted and access restricted

**Gate Owner:** security-threat-modeler
**Action if Failed:** STOP all development, fix security issues

---

### Gate 2: Infrastructure Ready (End of Week 4)
**Criteria:**
- [ ] CI/CD pipeline operational
- [ ] All tests run automatically
- [ ] Test coverage > 60% (trending to 80%)
- [ ] Deployment to staging automated

**Gate Owner:** devops-pipeline-architect
**Action if Failed:** Hold code quality phase until CI/CD stable

---

### Gate 3: Code Quality Baseline (End of Week 7)
**Criteria:**
- [ ] No components > 400 lines
- [ ] 0 TypeScript `any` types
- [ ] Test coverage > 80%
- [ ] All console.log removed
- [ ] ESLint/Checkstyle violations < 10

**Gate Owner:** frontend-integrator + api-service-builder
**Action if Failed:** Extend code quality phase, delay documentation

---

### Gate 4: Production Ready (End of Week 9)
**Criteria:**
- [ ] Security audit passed
- [ ] Penetration test findings resolved
- [ ] Performance benchmarks met
- [ ] Documentation complete
- [ ] UAT sign-off obtained

**Gate Owner:** test-assurance
**Action if Failed:** NO PRODUCTION DEPLOYMENT until all criteria met

---

## Success Criteria

### Security (Target: 95/100)
- [ ] 0 critical vulnerabilities
- [ ] 0 high vulnerabilities
- [ ] All OWASP Top 10 addressed
- [ ] GDPR compliant
- [ ] Audit logging operational
- [ ] Secrets management implemented

### Testing (Target: 95/100)
- [ ] Backend test coverage: 85%+
- [ ] Frontend test coverage: 80%+
- [ ] E2E tests cover critical paths
- [ ] All tests pass in CI
- [ ] No flaky tests

### Code Quality (Target: 90/100)
- [ ] All components < 400 lines
- [ ] 0 TypeScript `any` types
- [ ] 0 console.log statements
- [ ] ESLint/Checkstyle clean
- [ ] SonarQube quality gate: A

### Documentation (Target: 90/100)
- [ ] API documentation complete
- [ ] README files in all directories
- [ ] Architecture documented
- [ ] Runbooks created
- [ ] Onboarding guide available

### Performance (Target: 85/100)
- [ ] Lighthouse score > 90
- [ ] Bundle size < 250KB
- [ ] API response time p95 < 500ms
- [ ] Load test: 100 concurrent users
- [ ] Core Web Vitals pass

### Professional Practices (Target: 95/100)
- [ ] CI/CD pipeline operational
- [ ] Automated deployments
- [ ] Code review process
- [ ] Git workflow documented
- [ ] Monitoring and alerting

**Overall Target Grade: A+++ (95+/100)**

---

## Resource Allocation

### Agent Assignments

| Agent | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 | Phase 6 | Phase 7 |
|-------|---------|---------|---------|---------|---------|---------|---------|
| auth-gatekeeper | T1.1 | T2.1 | - | - | - | - | T7.1 |
| api-service-builder | T1.4 | T2.2, T2.3, T2.4 | T3.3 | - | T5.7 | - | T7.1 |
| frontend-integrator | - | - | - | T4.2 | T5.1-T5.6 | T6.6 | T7.1 |
| test-assurance | - | - | - | T4.1-T4.4 | - | - | T7.3 |
| devops-pipeline-architect | T1.2 | - | T3.1, T3.2, T3.4 | - | - | - | T7.2, T7.4 |
| docs-engine | - | - | - | - | - | T6.3, T6.4 | - |
| security-threat-modeler | T1.3 | - | - | - | - | T6.1, T6.5 | T7.1 |
| ux-flow-mapper | - | - | - | - | T5.4 | T6.2 | - |

---

## Timeline Summary

```
Week 1-2:  CRITICAL SECURITY (Sequential)
Week 2-3:  AUTHORIZATION & ACCESS CONTROL (Partial Parallel)
Week 3-4:  INFRASTRUCTURE & DEPLOYMENT (Sequential)
Week 4-5:  TESTING INFRASTRUCTURE (Highly Parallel)
Week 5-7:  CODE QUALITY & REFACTORING (Highly Parallel)
Week 7-8:  COMPLIANCE & DOCUMENTATION (Partial Parallel)
Week 8-10: FINAL VALIDATION & DEPLOYMENT (Sequential)
```

**Critical Path:** T1.1 → T1.4 → T2.1 → T3.1 → T4.1 → T4.3 → T5.1 → T6.5 → T7.1 → T7.3 → T7.4

**Total Duration:** 10 weeks (70 working days)

---

## Risk Mitigation

### High-Risk Dependencies

1. **T1.1 (Spring Security)** - Blocks 10+ tasks
   - **Mitigation:** Allocate best backend developer, daily standups
   - **Contingency:** If delayed > 2 days, escalate to team lead

2. **T6.5 (Penetration Testing)** - May discover new critical issues
   - **Mitigation:** Budget 5 extra days for unforeseen fixes (T7.1)
   - **Contingency:** Hire external security consultant if needed

3. **T5.1 (Component Refactoring)** - Blocks frontend improvements
   - **Mitigation:** Break into smaller PRs, continuous testing
   - **Contingency:** Partial refactoring acceptable if < 600 lines/component

4. **T7.3 (Pre-Production Testing)** - Final gate before production
   - **Mitigation:** Start UAT early in Week 7, daily smoke tests
   - **Contingency:** Extend timeline if critical bugs found

---

## Communication Plan

### Daily Standups (15 minutes)
- What did you complete yesterday?
- What are you working on today?
- Any blockers?

### Weekly Status Reports (Friday)
- Tasks completed
- Tasks in progress
- Next week's priorities
- Risks and blockers
- Gate status

### Quality Gate Reviews (End of each phase)
- Formal review with all stakeholders
- Go/no-go decision
- Adjustment to plan if needed

---

## Deliverables Summary

By the end of this plan, the following will be delivered:

1. **Security:**
   - Complete Spring Security implementation
   - All secrets in secret manager
   - Encrypted database connections
   - Audit logging system

2. **Testing:**
   - 80%+ test coverage
   - E2E test suite
   - CI/CD pipeline with automated testing

3. **Code Quality:**
   - All components < 400 lines
   - 0 TypeScript `any` types
   - Professional CSS architecture
   - Single design system

4. **Documentation:**
   - API documentation (Swagger)
   - README files
   - Architecture documentation
   - Deployment runbooks

5. **Infrastructure:**
   - CI/CD pipeline
   - Monitoring and alerting
   - Production environment
   - Disaster recovery plan

6. **Compliance:**
   - OWASP Top 10 compliance
   - GDPR compliance
   - WCAG 2.1 AA accessibility
   - Security audit passed

---

## Post-Deployment

### Monitoring (First 30 days)
- Daily error rate monitoring
- Weekly performance reviews
- User feedback collection
- Bug triage and prioritization

### Maintenance Schedule
- Weekly security updates
- Monthly dependency updates
- Quarterly penetration tests
- Bi-annual disaster recovery drills

### Continuous Improvement
- Retrospectives after each phase
- Process improvements documented
- Lessons learned shared with team
- Technical debt tracking

---

## Appendix: Task Dependencies Matrix

| Task | Depends On | Blocks |
|------|------------|--------|
| T1.1 | - | T1.4, T2.1, T2.2, T2.3, T3.1 |
| T1.2 | - | T3.2, T4.4 |
| T1.3 | T1.2 | T3.3 |
| T1.4 | T1.1 | T2.1 |
| T2.1 | T1.1, T1.4 | T3.1, T6.1 |
| T2.2 | T1.1 | T3.1 |
| T2.3 | T1.1 | - |
| T2.4 | T1.1 | T6.1 |
| T3.1 | T1.1, T2.1, T2.2 | T4.1, T4.2, T4.3 |
| T3.2 | T1.2 | T3.1 |
| T3.3 | T1.3 | T5.4 |
| T3.4 | T3.1 | T6.1 |
| T4.1 | T3.1 | T4.3 |
| T4.2 | T3.1 | T4.3 |
| T4.3 | T4.1, T4.2 | - |
| T4.4 | T4.2, T1.2 | - |
| T5.1 | T4.2 | T5.6 |
| T5.2 | T5.1 | - |
| T5.3 | T5.1 | - |
| T5.4 | T5.1 | T5.5 |
| T5.5 | T5.4 | - |
| T5.6 | T5.1 | - |
| T5.7 | T3.1 | - |
| T6.1 | T2.1, T2.4, T3.4 | T6.5 |
| T6.2 | T5.1 | - |
| T6.3 | T2.1 | - |
| T6.4 | T3.1 | - |
| T6.5 | T6.1 | T7.1 |
| T6.6 | T5.3 | - |
| T7.1 | T6.5 | T7.3 |
| T7.2 | T3.1, T3.2 | T7.3 |
| T7.3 | T7.1, T7.2 | T7.4 |
| T7.4 | T7.3 | - |

---

**Plan Author:** Claude Code (Project Orchestrator)
**Date:** 2025-11-27
**Version:** 1.0
**Status:** Ready for Execution

**This plan follows the KISS (Keep It Simple, Stupid) and DRY (Don't Repeat Yourself) principles, providing the smallest viable plan to achieve A+++ grade (95+/100).**
