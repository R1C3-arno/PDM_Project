# PDM Project Security & Quality Remediation - Execution Plan

**Project:** PDM Loan Management System Security Remediation
**Created:** 2025-11-26
**Version:** 1.0
**Total Estimated Duration:** 8 weeks (4 phases)

---

## Executive Summary

This execution plan addresses all critical, high, and medium severity findings from the comprehensive security and UI/UX audit. The plan prioritizes production-blocking security issues and follows a phased approach to minimize disruption while ensuring systematic remediation.

**Key Metrics:**
- 5 Critical Security Issues (MUST FIX before production)
- 8 High Severity Issues
- 4 UI/UX Issues
- 3 Backend Architecture Issues
- Total: 20 discrete remediation tasks organized into 4 phases

---

## Task Dependency DAG

```
Phase 1: Critical Security (Week 1-2)
=========================================
START
  |
  ├─> T1.1: Remove Sensitive Logging (No dependencies)
  |     |
  |     ├─> T1.6: Implement Audit Logging (Depends on T1.1)
  |
  ├─> T1.2: Rotate Secrets & Remove from Git (No dependencies)
  |
  ├─> T1.3: Implement RBAC Framework
  |     |
  |     ├─> T1.4: Add Authorization to Endpoints (Depends on T1.3)
  |     |
  |     └─> T1.5: Fix Mass Assignment (Depends on T1.3)
  |
  └─> T1.7: Migrate JWT to HttpOnly Cookies
        |
        └─> T2.1: Enable CSRF Protection (Depends on T1.7)

Phase 2: High-Priority Security (Week 3-4)
=========================================
T1.4 & T1.7 COMPLETE
  |
  ├─> T2.1: Enable CSRF Protection (Depends on T1.7)
  |
  ├─> T2.2: Add Token Revocation (Depends on T1.6, T1.7)
  |
  ├─> T2.3: Implement Password Policy (No dependencies)
  |
  ├─> T2.4: Enhance Rate Limiting (No dependencies)
  |
  └─> T2.5: Add CSP Headers (No dependencies)

Phase 3: UI/UX & Code Quality (Week 5-6)
=========================================
T2.x COMPLETE
  |
  ├─> T3.1: Add Accessibility Features (No dependencies)
  |
  ├─> T3.2: Remove Console Logs (No dependencies)
  |
  ├─> T3.3: Implement Consistent Error Handling (No dependencies)
  |
  └─> T3.4: Add Loading States (No dependencies)

Phase 4: Testing & Documentation (Week 7-8)
=========================================
ALL PREVIOUS PHASES COMPLETE
  |
  ├─> T4.1: Backend Security Tests (Depends on T1.x, T2.x)
  |
  ├─> T4.2: Frontend Integration Tests (Depends on T3.x)
  |
  ├─> T4.3: Penetration Testing (Depends on T4.1, T4.2)
  |
  └─> T4.4: Documentation Updates (Depends on all tasks)
```

---

## Phase 1: Critical Security Fixes (Week 1-2)

**Gate:** All P0 issues resolved, no production blockers remaining

### T1.1: Remove Sensitive Logging
**Priority:** P0 (CRITICAL)
**Agent:** `security-threat-modeler`
**Effort:** 4 hours
**Dependencies:** None

**Description:**
Remove all sensitive data from debug logs including password hashes, credentials, and PII.

**Acceptance Criteria:**
- [ ] Remove `System.out.println` from `CustomUserDetailsService.java:37`
- [ ] Remove `System.out.println` from `AuthController.java:106`
- [ ] Remove `System.out.println` from `SecurityConfig.java:91`
- [ ] Replace with SLF4J logger with INFO level
- [ ] Verify no password hashes in logs via grep
- [ ] Add email masking function for legitimate logging

**Files to Modify:**
- `/pdm-backend/src/main/java/com/loanweb/config/CustomUserDetailsService.java`
- `/pdm-backend/src/main/java/com/loanweb/controller/AuthController.java`
- `/pdm-backend/src/main/java/com/loanweb/config/SecurityConfig.java`

**Verification:**
```bash
# No sensitive patterns found
grep -r "System.out.print\|System.err.print" pdm-backend/src/main/java
grep -r "password\|hash" pdm-backend/logs/
```

---

### T1.2: Rotate Secrets & Remove from Git
**Priority:** P0 (CRITICAL)
**Agent:** `devops-pipeline-architect`
**Effort:** 4 hours
**Dependencies:** None

**Description:**
Remove `.env` from version control, rotate all secrets (JWT_SECRET, DB_PASSWORD), and implement secure secrets management.

**Acceptance Criteria:**
- [ ] Add `.env` to `.gitignore`
- [ ] Remove `.env` from git tracking: `git rm --cached pdm-backend/.env`
- [ ] Create `.env.example` template with placeholder values
- [ ] Generate new JWT_SECRET (256-bit minimum)
- [ ] Change DB_PASSWORD for `pdm_user`
- [ ] Update production deployment configurations
- [ ] Add JWT secret validation on startup
- [ ] Document secrets rotation procedure

**Files to Create/Modify:**
- `/pdm-backend/.gitignore`
- `/pdm-backend/.env.example`
- `/pdm-backend/src/main/java/com/loanweb/config/JwtTokenProvider.java` (add validation)

**Verification:**
```bash
# .env not in git
git ls-files | grep .env
# Should return nothing

# JWT secret validation code exists
grep -A 5 "@PostConstruct" pdm-backend/src/main/java/com/loanweb/config/JwtTokenProvider.java
```

---

### T1.3: Implement RBAC Framework
**Priority:** P0 (CRITICAL)
**Agent:** `auth-gatekeeper`
**Effort:** 2 days
**Dependencies:** None

**Description:**
Enable Spring Security method-level security and create custom authorization utilities for owner-based access control.

**Acceptance Criteria:**
- [ ] Add `@EnableMethodSecurity(prePostEnabled = true)` to SecurityConfig
- [ ] Create `UserSecurityService` with `isOwner()` method
- [ ] Create `WalletSecurityService` with `canModify()` method
- [ ] Create `LoanSecurityService` with authorization checks
- [ ] Write unit tests for security services
- [ ] Document role hierarchy and permissions matrix

**Files to Create/Modify:**
- `/pdm-backend/src/main/java/com/loanweb/config/SecurityConfig.java`
- `/pdm-backend/src/main/java/com/loanweb/security/UserSecurityService.java` (NEW)
- `/pdm-backend/src/main/java/com/loanweb/security/WalletSecurityService.java` (NEW)
- `/pdm-backend/src/main/java/com/loanweb/security/LoanSecurityService.java` (NEW)
- `/pdm-backend/src/test/java/com/loanweb/security/UserSecurityServiceTest.java` (NEW)

**Verification:**
```bash
# Security services exist
ls pdm-backend/src/main/java/com/loanweb/security/
# Method security enabled
grep "@EnableMethodSecurity" pdm-backend/src/main/java/com/loanweb/config/SecurityConfig.java
```

---

### T1.4: Add Authorization to All Endpoints
**Priority:** P0 (CRITICAL)
**Agent:** `auth-gatekeeper`
**Effort:** 3 days
**Dependencies:** T1.3 (RBAC Framework)

**Description:**
Add `@PreAuthorize` annotations to all controller endpoints with appropriate role and owner checks.

**Acceptance Criteria:**
- [ ] UserController: Add role checks (ADMIN/STAFF for list, owner for view/update)
- [ ] LoanController: Add role checks (UNDERWRITER for approve, owner for view)
- [ ] WalletController: Add owner checks for deposit/withdraw
- [ ] TransactionController: Add owner/admin checks
- [ ] SupportTicketController: Add owner/staff checks
- [ ] NotificationController: Add owner checks
- [ ] Create authorization test suite
- [ ] Verify unauthorized access returns 403 Forbidden

**Files to Modify:**
- `/pdm-backend/src/main/java/com/loanweb/controller/UserController.java`
- `/pdm-backend/src/main/java/com/loanweb/controller/LoanController.java`
- `/pdm-backend/src/main/java/com/loanweb/controller/WalletController.java`
- `/pdm-backend/src/main/java/com/loanweb/controller/TransactionController.java`
- `/pdm-backend/src/main/java/com/loanweb/controller/SupportTicketController.java`
- `/pdm-backend/src/main/java/com/loanweb/controller/NotificationController.java`

**Verification:**
```bash
# All controllers have PreAuthorize
grep -L "@PreAuthorize" pdm-backend/src/main/java/com/loanweb/controller/*Controller.java
# Should return nothing

# Test unauthorized access
curl -H "Authorization: Bearer <applicant-token>" http://localhost:8080/api/users
# Should return 403
```

---

### T1.5: Fix Mass Assignment Vulnerability
**Priority:** P0 (CRITICAL)
**Agent:** `api-service-builder`
**Effort:** 2 days
**Dependencies:** T1.3 (RBAC Framework)

**Description:**
Replace `Map<String, Object>` parameters with proper DTOs to prevent mass assignment and privilege escalation.

**Acceptance Criteria:**
- [ ] Create `UpdateUserRequest` DTO (without role field)
- [ ] Create `RoleUpdateRequest` DTO for admin-only role changes
- [ ] Create `PaymentRequest` DTO with validation
- [ ] Create `WalletTransactionRequest` DTO with validation
- [ ] Add `@Valid` annotations to all request bodies
- [ ] Add separate admin endpoint for role updates with audit logging
- [ ] Remove all `Map<String, Object>` request parameters

**Files to Create/Modify:**
- `/pdm-backend/src/main/java/com/loanweb/dto/UpdateUserRequest.java` (NEW)
- `/pdm-backend/src/main/java/com/loanweb/dto/RoleUpdateRequest.java` (NEW)
- `/pdm-backend/src/main/java/com/loanweb/dto/PaymentRequest.java` (NEW)
- `/pdm-backend/src/main/java/com/loanweb/dto/WalletTransactionRequest.java` (NEW)
- `/pdm-backend/src/main/java/com/loanweb/controller/UserController.java`
- `/pdm-backend/src/main/java/com/loanweb/controller/LoanController.java`
- `/pdm-backend/src/main/java/com/loanweb/controller/WalletController.java`

**Verification:**
```bash
# No Map request parameters
grep -n "Map<String, Object>" pdm-backend/src/main/java/com/loanweb/controller/

# DTOs exist
ls pdm-backend/src/main/java/com/loanweb/dto/*.java

# Privilege escalation test fails
curl -X PUT -H "Authorization: Bearer <user-token>" \
  -d '{"role":"ADMIN"}' http://localhost:8080/api/users/100
# Should return 400 or ignore role field
```

---

### T1.6: Implement Audit Logging
**Priority:** P0 (CRITICAL)
**Agent:** `api-service-builder`
**Effort:** 3 days
**Dependencies:** T1.1 (Sensitive logging removed)

**Description:**
Implement comprehensive audit logging for all financial operations and security events.

**Acceptance Criteria:**
- [ ] Create `AuditLog` entity with fields (timestamp, action, actorId, entityType, entityId, outcome, ipAddress, userAgent)
- [ ] Create `AuditLogRepository`
- [ ] Create `AuditLogService` with logging methods
- [ ] Create `@Audited` annotation
- [ ] Create AOP aspect for automatic audit logging
- [ ] Log loan approvals/rejections
- [ ] Log wallet deposits/withdrawals
- [ ] Log user role changes
- [ ] Log authentication failures
- [ ] Create audit log query endpoint for admins

**Files to Create:**
- `/pdm-backend/src/main/java/com/loanweb/domain/audit/AuditLog.java` (NEW)
- `/pdm-backend/src/main/java/com/loanweb/domain/audit/AuditLogRepository.java` (NEW)
- `/pdm-backend/src/main/java/com/loanweb/service/AuditLogService.java` (NEW)
- `/pdm-backend/src/main/java/com/loanweb/annotation/Audited.java` (NEW)
- `/pdm-backend/src/main/java/com/loanweb/aspect/AuditAspect.java` (NEW)
- `/pdm-backend/src/main/java/com/loanweb/controller/AuditLogController.java` (NEW)
- `/pdm-backend/src/main/resources/db/migration/V2__create_audit_log_table.sql` (NEW)

**Verification:**
```bash
# Audit log table exists
mysql -u pdm_user -p -e "DESCRIBE audit_logs;" pdm-project

# Audit logs created on actions
curl -X POST -H "Authorization: Bearer <admin-token>" \
  -d '{"userId":1,"amount":1000}' http://localhost:8080/api/loans
# Check audit_logs table has entry
```

---

### T1.7: Migrate JWT to HttpOnly Cookies
**Priority:** P0 (CRITICAL)
**Agent:** `frontend-integrator` + `api-service-builder`
**Effort:** 3 days
**Dependencies:** None

**Description:**
Move JWT token storage from localStorage to secure HttpOnly cookies to prevent XSS token theft.

**Backend Changes:**
- [ ] Modify `AuthController.login()` to set HttpOnly cookie instead of returning token in body
- [ ] Add cookie configuration (HttpOnly, Secure, SameSite=Strict)
- [ ] Modify `JwtAuthenticationFilter` to read token from cookie
- [ ] Add logout endpoint to clear cookie
- [ ] Update CORS to allow credentials

**Frontend Changes:**
- [ ] Remove `localStorage.setItem('token')` from AuthContext
- [ ] Remove `localStorage.getItem('token')` from api.ts
- [ ] Add `credentials: 'include'` to all fetch requests
- [ ] Update logout to call backend logout endpoint
- [ ] Remove manual cookie setting in AuthContext

**Files to Modify (Backend):**
- `/pdm-backend/src/main/java/com/loanweb/controller/AuthController.java`
- `/pdm-backend/src/main/java/com/loanweb/config/JwtAuthenticationFilter.java`
- `/pdm-backend/src/main/java/com/loanweb/config/SecurityConfig.java` (CORS)

**Files to Modify (Frontend):**
- `/pdm-frontend/contexts/AuthContext.tsx`
- `/pdm-frontend/lib/api.ts`

**Verification:**
```bash
# No localStorage usage
grep -n "localStorage" pdm-frontend/contexts/AuthContext.tsx
# Should return nothing

# Cookie set on login
curl -v -X POST -d '{"email":"test@example.com","password":"password"}' \
  http://localhost:8080/api/auth/login | grep "Set-Cookie"
# Should contain HttpOnly, Secure, SameSite

# Frontend sends credentials
grep "credentials: 'include'" pdm-frontend/lib/api.ts
```

---

## Phase 1 Quality Gate

**MUST PASS BEFORE PHASE 2:**
- [ ] All P0 tasks (T1.1 - T1.7) marked as completed
- [ ] No sensitive data in logs (verified via grep)
- [ ] All secrets rotated and removed from git
- [ ] RBAC enabled and all endpoints protected with authorization
- [ ] Mass assignment vulnerabilities eliminated
- [ ] Audit logging operational for all critical actions
- [ ] JWT tokens no longer in localStorage
- [ ] Authorization bypass tests fail (return 403)
- [ ] Code review completed by security-threat-modeler
- [ ] Manual security testing passed

---

## Phase 2: High-Priority Security (Week 3-4)

**Gate:** All high-severity vulnerabilities resolved, system hardened against common attacks

### T2.1: Enable CSRF Protection
**Priority:** P1 (HIGH)
**Agent:** `auth-gatekeeper`
**Effort:** 2 days
**Dependencies:** T1.7 (JWT in cookies)

**Description:**
Enable Spring Security CSRF protection with cookie-based tokens and SameSite attributes.

**Acceptance Criteria:**
- [ ] Remove `.csrf(csrf -> csrf.disable())` from SecurityConfig
- [ ] Configure `CookieCsrfTokenRepository` with HttpOnly=false
- [ ] Implement `SpaCsrfTokenRequestHandler` for SPA support
- [ ] Add CSRF token endpoint for frontend
- [ ] Update frontend to include CSRF token in requests
- [ ] Add `X-Requested-With: XMLHttpRequest` header to all API calls
- [ ] Test CSRF attack fails without token

**Files to Modify (Backend):**
- `/pdm-backend/src/main/java/com/loanweb/config/SecurityConfig.java`
- `/pdm-backend/src/main/java/com/loanweb/controller/CsrfController.java` (NEW)

**Files to Modify (Frontend):**
- `/pdm-frontend/lib/api.ts` (add CSRF token handling)

**Verification:**
```bash
# CSRF enabled
grep "csrf.disable()" pdm-backend/src/main/java/com/loanweb/config/SecurityConfig.java
# Should return nothing

# CSRF attack fails
curl -X POST -H "Cookie: token=<stolen-token>" \
  -d '{"amount":1000}' http://localhost:8080/api/wallets/1/withdraw
# Should return 403
```

---

### T2.2: Add Token Revocation Mechanism
**Priority:** P1 (HIGH)
**Agent:** `api-service-builder`
**Effort:** 3 days
**Dependencies:** T1.6 (Audit logging), T1.7 (JWT cookies)

**Description:**
Implement JWT token blacklist with Redis for token revocation on logout, password change, or compromise.

**Acceptance Criteria:**
- [ ] Add Redis dependency to pom.xml
- [ ] Create `TokenBlacklistService` with Redis
- [ ] Add `blacklistToken()` and `isBlacklisted()` methods
- [ ] Modify `JwtAuthenticationFilter` to check blacklist
- [ ] Implement logout endpoint that blacklists token
- [ ] Auto-blacklist tokens on password change
- [ ] Add token version to User entity
- [ ] Add admin endpoint to revoke user's all tokens
- [ ] Configure Redis TTL to match JWT expiration

**Files to Create/Modify:**
- `/pdm-backend/pom.xml` (add Redis dependency)
- `/pdm-backend/src/main/java/com/loanweb/service/TokenBlacklistService.java` (NEW)
- `/pdm-backend/src/main/java/com/loanweb/config/JwtAuthenticationFilter.java`
- `/pdm-backend/src/main/java/com/loanweb/controller/AuthController.java` (add logout)
- `/pdm-backend/src/main/java/com/loanweb/domain/user/User.java` (add tokenVersion)
- `/pdm-backend/src/main/resources/application.yml` (Redis config)

**Verification:**
```bash
# Redis configured
grep "redis" pdm-backend/src/main/resources/application.yml

# Token blacklisted on logout
curl -X POST -H "Authorization: Bearer <token>" http://localhost:8080/api/auth/logout
# Subsequent requests with same token should fail
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/users/me
# Should return 401
```

---

### T2.3: Implement Strong Password Policy
**Priority:** P1 (HIGH)
**Agent:** `api-service-builder`
**Effort:** 1 day
**Dependencies:** None

**Description:**
Enforce strong password requirements: 12+ characters, uppercase, lowercase, digit, special character.

**Acceptance Criteria:**
- [ ] Create `@ValidPassword` custom annotation
- [ ] Create `PasswordValidator` with regex validation
- [ ] Add validation to RegisterRequest
- [ ] Add validation to ChangePasswordRequest
- [ ] Return clear error messages on validation failure
- [ ] Add password strength meter to frontend registration
- [ ] Increase BCrypt work factor to 12

**Files to Create/Modify:**
- `/pdm-backend/src/main/java/com/loanweb/validation/ValidPassword.java` (NEW)
- `/pdm-backend/src/main/java/com/loanweb/validation/PasswordValidator.java` (NEW)
- `/pdm-backend/src/main/java/com/loanweb/dto/RegisterRequest.java`
- `/pdm-backend/src/main/java/com/loanweb/config/SecurityConfig.java` (BCrypt work factor)
- `/pdm-frontend/components/PasswordStrengthMeter.tsx` (NEW)

**Verification:**
```bash
# Weak password rejected
curl -X POST -d '{"email":"test@example.com","password":"weak"}' \
  http://localhost:8080/api/auth/register
# Should return 400 with validation error

# Strong password accepted
curl -X POST -d '{"email":"test@example.com","password":"SecureP@ssw0rd123"}' \
  http://localhost:8080/api/auth/register
# Should return 201
```

---

### T2.4: Enhance Rate Limiting
**Priority:** P1 (HIGH)
**Agent:** `api-service-builder`
**Effort:** 2 days
**Dependencies:** None

**Description:**
Implement adaptive rate limiting with different limits per endpoint type to prevent brute force attacks.

**Acceptance Criteria:**
- [ ] Reduce login endpoint to 5 requests/minute
- [ ] Reduce registration to 3 requests/5 minutes
- [ ] Add password reset limit: 3 requests/hour
- [ ] Keep general endpoints at 100 requests/minute
- [ ] Add rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After)
- [ ] Store rate limit data in Redis (not in-memory)
- [ ] Return 429 Too Many Requests with Retry-After header
- [ ] Add CAPTCHA after 3 failed login attempts (future enhancement marker)

**Files to Modify:**
- `/pdm-backend/src/main/java/com/loanweb/config/RateLimitFilter.java`
- `/pdm-backend/src/main/java/com/loanweb/config/AdaptiveRateLimitConfig.java` (NEW)

**Verification:**
```bash
# Rate limiting enforced
for i in {1..6}; do
  curl -X POST -d '{"email":"test@example.com","password":"wrong"}' \
    http://localhost:8080/api/auth/login
done
# 6th request should return 429

# Rate limit headers present
curl -v http://localhost:8080/api/users | grep "X-RateLimit"
```

---

### T2.5: Add Content Security Policy Headers
**Priority:** P1 (HIGH)
**Agent:** `frontend-integrator`
**Effort:** 1 day
**Dependencies:** None

**Description:**
Configure strict CSP headers in Next.js to prevent XSS attacks.

**Acceptance Criteria:**
- [ ] Add CSP headers to next.config.ts
- [ ] Configure strict script-src (self only, no unsafe-inline in production)
- [ ] Configure style-src (self, unsafe-inline for Tailwind)
- [ ] Add X-Frame-Options: DENY
- [ ] Add X-Content-Type-Options: nosniff
- [ ] Add Referrer-Policy: strict-origin-when-cross-origin
- [ ] Add Permissions-Policy
- [ ] Test CSP doesn't break application functionality

**Files to Modify:**
- `/pdm-frontend/next.config.ts`

**Verification:**
```bash
# CSP headers set
curl -v http://localhost:3000 | grep "Content-Security-Policy"

# No inline script errors in browser console
```

---

## Phase 2 Quality Gate

**MUST PASS BEFORE PHASE 3:**
- [ ] All P1 tasks (T2.1 - T2.5) marked as completed
- [ ] CSRF protection enabled and tested
- [ ] Token revocation working (logout invalidates tokens)
- [ ] Weak passwords rejected by validation
- [ ] Rate limiting prevents brute force (tested)
- [ ] CSP headers configured without breaking functionality
- [ ] All high-severity vulnerabilities resolved
- [ ] Penetration testing of auth flows completed

---

## Phase 3: UI/UX & Code Quality (Week 5-6)

**Gate:** Application meets accessibility standards and professional code quality

### T3.1: Add Accessibility Features
**Priority:** P1 (Compliance)
**Agent:** `frontend-integrator`
**Effort:** 5 days
**Dependencies:** None

**Description:**
Implement WCAG 2.1 Level A compliance with ARIA attributes, semantic HTML, and keyboard navigation.

**Acceptance Criteria:**
- [ ] Add aria-label to all icon-only buttons
- [ ] Add aria-required to required form inputs
- [ ] Use semantic HTML (<button> instead of <div onClick>)
- [ ] Add keyboard navigation (Tab, Enter, Escape)
- [ ] Add alt text to all images
- [ ] Add role attributes where needed
- [ ] Ensure color contrast meets WCAG AA (4.5:1)
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Add skip navigation links
- [ ] Ensure focus indicators visible

**Files to Modify:**
- `/pdm-frontend/components/Layout.tsx`
- `/pdm-frontend/components/ui/*.tsx` (all UI components)
- `/pdm-frontend/app/**/*.tsx` (all pages)
- Create `/pdm-frontend/lib/accessibility-utils.ts` (NEW)

**Verification:**
```bash
# ARIA attributes present
grep -r "aria-" pdm-frontend/components/ | wc -l
# Should be > 100

# Screen reader testing passed (manual)
# Lighthouse accessibility score > 90
```

---

### T3.2: Remove Console Logs
**Priority:** P2
**Agent:** `frontend-integrator`
**Effort:** 1 day
**Dependencies:** None

**Description:**
Remove all 113 console.log statements and replace with proper logging utility.

**Acceptance Criteria:**
- [ ] Create logger utility with environment-based logging
- [ ] Replace all console.log with logger.debug
- [ ] Keep console.error for production errors
- [ ] Remove debug logs from production build
- [ ] Verify no console.log in production bundle

**Files to Create/Modify:**
- `/pdm-frontend/lib/logger.ts` (NEW)
- All 69 files with console.log (batch find/replace)

**Verification:**
```bash
# No console.log in source
grep -r "console.log" pdm-frontend/ --exclude-dir=node_modules
# Should return only logger.ts

# Production build has no console logs
npm run build && grep -r "console.log" pdm-frontend/.next/
```

---

### T3.3: Implement Consistent Error Handling
**Priority:** P2
**Agent:** `frontend-integrator`
**Effort:** 2 days
**Dependencies:** None

**Description:**
Create consistent error UI components and standardize error handling across all pages.

**Acceptance Criteria:**
- [ ] Create ErrorBoundary component
- [ ] Create Toast notification system
- [ ] Create ErrorAlert component
- [ ] Standardize API error response handling
- [ ] Add error states to all API calls
- [ ] Show user-friendly error messages (not stack traces)
- [ ] Add retry mechanism for failed requests

**Files to Create/Modify:**
- `/pdm-frontend/components/ErrorBoundary.tsx` (NEW)
- `/pdm-frontend/components/Toast.tsx` (NEW)
- `/pdm-frontend/components/ErrorAlert.tsx` (NEW)
- `/pdm-frontend/lib/error-handler.ts` (NEW)
- Update all pages to use error components

**Verification:**
```bash
# ErrorBoundary wraps app
grep "ErrorBoundary" pdm-frontend/app/layout.tsx

# No silent error catches
grep "catch.*console.error" pdm-frontend/ -r
# Should return nothing
```

---

### T3.4: Add Loading States
**Priority:** P2
**Agent:** `frontend-integrator`
**Effort:** 2 days
**Dependencies:** None

**Description:**
Add loading indicators to all async operations for better UX.

**Acceptance Criteria:**
- [ ] Create LoadingSpinner component
- [ ] Create Skeleton component for content loading
- [ ] Add loading states to all API calls
- [ ] Disable submit buttons during submission
- [ ] Add progress indicators for multi-step forms
- [ ] Add optimistic UI updates where appropriate

**Files to Create/Modify:**
- `/pdm-frontend/components/LoadingSpinner.tsx` (enhance existing)
- `/pdm-frontend/components/Skeleton.tsx` (NEW)
- Update all pages with async operations

**Verification:**
```bash
# All async calls have loading state
grep -L "loading" pdm-frontend/app/**/page.tsx
# Should be minimal or none

# Manual UX testing - no blank screens during loading
```

---

## Phase 3 Quality Gate

**MUST PASS BEFORE PHASE 4:**
- [ ] All P2 tasks (T3.1 - T3.4) marked as completed
- [ ] Lighthouse accessibility score > 90
- [ ] No console.log in production build
- [ ] All pages show loading states
- [ ] Consistent error handling across app
- [ ] Screen reader testing passed
- [ ] Keyboard navigation works for all features

---

## Phase 4: Testing & Documentation (Week 7-8)

**Gate:** Comprehensive test coverage and documentation complete

### T4.1: Backend Security Tests
**Priority:** P1
**Agent:** `test-assurance`
**Effort:** 5 days
**Dependencies:** All Phase 1 & 2 tasks

**Description:**
Create comprehensive security test suite for all critical vulnerabilities.

**Acceptance Criteria:**
- [ ] Authorization bypass tests (should fail with 403)
- [ ] CSRF attack tests (should fail)
- [ ] Mass assignment tests (should reject role changes)
- [ ] Rate limiting tests (should return 429)
- [ ] SQL injection tests (should sanitize)
- [ ] XSS injection tests (should escape)
- [ ] Token revocation tests (should invalidate)
- [ ] Password policy tests (should reject weak passwords)
- [ ] Achieve >80% code coverage on security components

**Files to Create:**
- `/pdm-backend/src/test/java/com/loanweb/security/AuthorizationTests.java` (NEW)
- `/pdm-backend/src/test/java/com/loanweb/security/CsrfProtectionTests.java` (NEW)
- `/pdm-backend/src/test/java/com/loanweb/security/MassAssignmentTests.java` (NEW)
- `/pdm-backend/src/test/java/com/loanweb/security/RateLimitTests.java` (NEW)
- `/pdm-backend/src/test/java/com/loanweb/security/InputValidationTests.java` (NEW)

**Verification:**
```bash
# All tests pass
mvn test

# Coverage report
mvn jacoco:report
# Check target/site/jacoco/index.html > 80%
```

---

### T4.2: Frontend Integration Tests
**Priority:** P1
**Agent:** `test-assurance`
**Effort:** 3 days
**Dependencies:** All Phase 3 tasks

**Description:**
Create integration tests for frontend functionality and accessibility.

**Acceptance Criteria:**
- [ ] Install @testing-library/react and jest
- [ ] Test authentication flow
- [ ] Test authorization (role-based navigation)
- [ ] Test form validations
- [ ] Test error handling
- [ ] Test loading states
- [ ] Test accessibility with jest-axe
- [ ] Achieve >70% code coverage

**Files to Create:**
- `/pdm-frontend/jest.config.js` (NEW)
- `/pdm-frontend/tests/auth.test.tsx` (NEW)
- `/pdm-frontend/tests/authorization.test.tsx` (NEW)
- `/pdm-frontend/tests/forms.test.tsx` (NEW)
- `/pdm-frontend/tests/accessibility.test.tsx` (NEW)

**Verification:**
```bash
# All tests pass
npm test

# Coverage report
npm test -- --coverage
# Should be > 70%
```

---

### T4.3: Penetration Testing
**Priority:** P1
**Agent:** `security-threat-modeler`
**Effort:** 3 days
**Dependencies:** T4.1, T4.2

**Description:**
Manual penetration testing of all critical attack vectors documented in threat model.

**Acceptance Criteria:**
- [ ] Test all STRIDE threats from threat model
- [ ] Verify authorization bypass attempts fail
- [ ] Verify CSRF attacks fail
- [ ] Verify XSS attempts are blocked/escaped
- [ ] Verify SQL injection attempts fail
- [ ] Verify rate limiting prevents brute force
- [ ] Verify sensitive data not in logs/responses
- [ ] Document all findings
- [ ] Verify all critical/high findings resolved

**Files to Create:**
- `/pdm-backend/PENETRATION_TEST_REPORT.md` (NEW)

**Verification:**
```bash
# Execute all attack scenarios from threat model
# Document results
# All critical vulnerabilities must show as mitigated
```

---

### T4.4: Documentation Updates
**Priority:** P2
**Agent:** `docs-engine`
**Effort:** 2 days
**Dependencies:** All previous tasks

**Description:**
Update all documentation to reflect security changes and deployment procedures.

**Acceptance Criteria:**
- [ ] Update README with security features
- [ ] Create SECURITY.md with vulnerability reporting process
- [ ] Update API documentation with authorization requirements
- [ ] Create deployment security checklist
- [ ] Document role permissions matrix
- [ ] Create runbook for incident response
- [ ] Update developer onboarding docs with security practices
- [ ] Create changelog of all security fixes

**Files to Create/Modify:**
- `/README.md` (update)
- `/SECURITY.md` (NEW)
- `/API_DOCUMENTATION.md` (update)
- `/DEPLOYMENT_CHECKLIST.md` (NEW)
- `/ROLE_PERMISSIONS_MATRIX.md` (NEW)
- `/INCIDENT_RESPONSE_RUNBOOK.md` (NEW)
- `/CHANGELOG.md` (NEW)

**Verification:**
```bash
# All documentation files exist
ls *.md | wc -l
# Should include all new docs

# Documentation is complete (manual review)
```

---

## Phase 4 Quality Gate (FINAL)

**MUST PASS FOR PRODUCTION DEPLOYMENT:**
- [ ] All tasks (T1.1 - T4.4) marked as completed
- [ ] Backend test coverage > 80%
- [ ] Frontend test coverage > 70%
- [ ] Penetration testing passed with no critical findings
- [ ] All documentation updated
- [ ] Security checklist complete
- [ ] Deployment runbook created
- [ ] Stakeholder sign-off obtained

---

## Agent Assignments Summary

| Agent | Tasks | Total Effort |
|-------|-------|--------------|
| `security-threat-modeler` | T1.1, T4.3 | 3.5 days |
| `devops-pipeline-architect` | T1.2 | 0.5 days |
| `auth-gatekeeper` | T1.3, T1.4, T2.1 | 7 days |
| `api-service-builder` | T1.5, T1.6, T2.2, T2.3, T2.4 | 11 days |
| `frontend-integrator` | T1.7 (partial), T2.5, T3.1, T3.2, T3.3, T3.4 | 14 days |
| `test-assurance` | T4.1, T4.2 | 8 days |
| `docs-engine` | T4.4 | 2 days |

---

## Risk Management

### High-Risk Dependencies
1. **T1.7 → T2.1**: JWT cookie migration must complete before CSRF can be properly enabled
2. **T1.3 → T1.4**: RBAC framework must be solid before rolling out to all endpoints
3. **All Phase 1/2 → Phase 4**: Testing cannot proceed until remediation complete

### Mitigation Strategies
- **Daily standups** to identify blockers early
- **Parallel workstreams** where dependencies allow (T1.1, T1.2, T1.3 can run simultaneously)
- **Feature flags** for gradual rollout of security features
- **Rollback plan** for each critical change

### Estimated Delays
- JWT migration (T1.7): May take +1 day if frontend/backend coordination issues
- Authorization rollout (T1.4): May take +1 day if complex ownership logic needed
- Testing (T4.1, T4.2): May take +2 days if coverage targets not initially met

---

## Success Metrics

**Security Metrics:**
- 0 critical vulnerabilities remaining
- 0 high-severity vulnerabilities remaining
- Authorization bypass attempts return 403
- CSRF attacks fail
- Token theft via XSS prevented (HttpOnly cookies)
- Brute force attacks blocked by rate limiting

**Quality Metrics:**
- Backend test coverage > 80%
- Frontend test coverage > 70%
- Lighthouse accessibility score > 90
- 0 console.log statements in production
- All endpoints have authorization checks

**Compliance Metrics:**
- WCAG 2.1 Level A compliance achieved
- Audit logging operational for all financial operations
- All secrets removed from version control
- Security headers properly configured

---

## Timeline Visualization

```
Week 1-2: Phase 1 (Critical Security)
├─ Mon-Tue: T1.1 (logs), T1.2 (secrets), T1.3 (RBAC framework)
├─ Wed-Fri: T1.4 (authorization endpoints)
└─ Week 2: T1.5 (mass assignment), T1.6 (audit log), T1.7 (JWT cookies)

Week 3-4: Phase 2 (High-Priority Security)
├─ Mon-Tue: T2.1 (CSRF), T2.3 (password policy)
├─ Wed-Fri: T2.2 (token revocation), T2.4 (rate limiting)
└─ Week 4: T2.5 (CSP headers) + buffer

Week 5-6: Phase 3 (UI/UX & Code Quality)
├─ Week 5: T3.1 (accessibility)
└─ Week 6: T3.2 (console logs), T3.3 (error handling), T3.4 (loading states)

Week 7-8: Phase 4 (Testing & Documentation)
├─ Week 7: T4.1 (backend tests), T4.2 (frontend tests)
└─ Week 8: T4.3 (penetration testing), T4.4 (documentation)
```

---

## Rollback Procedures

### If Critical Issue Discovered Mid-Phase:
1. **STOP** all development on affected component
2. Assess blast radius (which tasks affected)
3. Roll back to last known good state
4. Create hotfix branch
5. Fix issue in isolation
6. Re-test before proceeding

### Emergency Rollback Commands:
```bash
# Revert last commit
git revert HEAD

# Rollback database migration
mvn flyway:undo

# Restore from backup
./scripts/restore-backup.sh <timestamp>

# Disable feature flag
curl -X POST http://localhost:8080/api/admin/feature-flags \
  -d '{"feature":"NEW_AUTH","enabled":false}'
```

---

## Communication Plan

### Daily Updates:
- Brief status update in team chat
- Blockers identified and escalated
- Task completion status

### Weekly Reports:
- Phase progress (% complete)
- Quality gate status
- Risk updates
- Timeline adjustments

### Stakeholder Reviews:
- End of Phase 1: Security review
- End of Phase 2: Security audit
- End of Phase 3: UX review
- End of Phase 4: Final sign-off

---

## Conclusion

This execution plan provides a comprehensive, phased approach to remediating all audit findings. By following the task dependencies and quality gates, we ensure:

1. **No production blockers remain** after Phase 1
2. **System hardened against common attacks** after Phase 2
3. **Professional UX and code quality** after Phase 3
4. **Full test coverage and documentation** after Phase 4

**Estimated Total Effort:** 46 person-days across 7 specialized agents over 8 weeks.

**Go/No-Go Decision:** Production deployment approved ONLY if Phase 4 final quality gate passes with 100% checklist completion.

---

**Plan Owner:** Security & Architecture Team
**Approval Required From:** CTO, Security Lead, Product Owner
**Next Review Date:** After Phase 1 completion (Week 2)
