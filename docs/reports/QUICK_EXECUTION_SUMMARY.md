# PDM Security Remediation - Quick Reference

**Total Duration:** 8 weeks | **Total Tasks:** 20 | **Agents:** 7 specialized teams

---

## Critical Path (Must Complete in Order)

```
T1.3 (RBAC Framework)
  ├─> T1.4 (Authorization Endpoints)
  │     └─> Phase 2 (High Security)
  └─> T1.5 (Mass Assignment Fix)

T1.7 (JWT Cookies)
  └─> T2.1 (CSRF Protection)
        └─> T2.2 (Token Revocation)
```

---

## 4-Phase Execution

### Phase 1: Critical Security (Week 1-2) - MUST FIX
**Goal:** Eliminate all production blockers

| ID | Task | Agent | Days | Blocks |
|----|------|-------|------|--------|
| T1.1 | Remove Sensitive Logging | security-threat-modeler | 0.5 | - |
| T1.2 | Rotate Secrets | devops-pipeline-architect | 0.5 | - |
| T1.3 | RBAC Framework | auth-gatekeeper | 2 | T1.4, T1.5 |
| T1.4 | Authorization Endpoints | auth-gatekeeper | 3 | Phase 2 |
| T1.5 | Fix Mass Assignment | api-service-builder | 2 | - |
| T1.6 | Audit Logging | api-service-builder | 3 | T2.2 |
| T1.7 | JWT to Cookies | frontend-integrator | 3 | T2.1 |

**Gate:** Authorization bypass returns 403, no secrets in git, no sensitive logs

---

### Phase 2: High Security (Week 3-4)
**Goal:** Harden against common attacks

| ID | Task | Agent | Days | Dependencies |
|----|------|-------|------|--------------|
| T2.1 | CSRF Protection | auth-gatekeeper | 2 | T1.7 |
| T2.2 | Token Revocation | api-service-builder | 3 | T1.6, T1.7 |
| T2.3 | Password Policy | api-service-builder | 1 | - |
| T2.4 | Rate Limiting | api-service-builder | 2 | - |
| T2.5 | CSP Headers | frontend-integrator | 1 | - |

**Gate:** CSRF attacks fail, tokens revocable, weak passwords rejected

---

### Phase 3: UI/UX (Week 5-6)
**Goal:** Professional quality and accessibility

| ID | Task | Agent | Days | Dependencies |
|----|------|-------|------|--------------|
| T3.1 | Accessibility | frontend-integrator | 5 | - |
| T3.2 | Remove Console Logs | frontend-integrator | 1 | - |
| T3.3 | Error Handling | frontend-integrator | 2 | - |
| T3.4 | Loading States | frontend-integrator | 2 | - |

**Gate:** Lighthouse accessibility > 90, no console.log in production

---

### Phase 4: Testing (Week 7-8)
**Goal:** Comprehensive coverage and documentation

| ID | Task | Agent | Days | Dependencies |
|----|------|-------|------|--------------|
| T4.1 | Backend Tests | test-assurance | 5 | Phase 1+2 |
| T4.2 | Frontend Tests | test-assurance | 3 | Phase 3 |
| T4.3 | Penetration Testing | security-threat-modeler | 3 | T4.1, T4.2 |
| T4.4 | Documentation | docs-engine | 2 | All |

**Gate:** >80% backend coverage, >70% frontend coverage, pen test passed

---

## Agent Workload

| Agent | Total Days | Key Responsibilities |
|-------|------------|---------------------|
| frontend-integrator | 14 | JWT migration, CSP, accessibility, UX fixes |
| api-service-builder | 11 | DTOs, audit log, token revocation, rate limiting |
| test-assurance | 8 | Security tests, integration tests |
| auth-gatekeeper | 7 | RBAC, authorization, CSRF |
| security-threat-modeler | 3.5 | Log cleanup, penetration testing |
| docs-engine | 2 | Documentation updates |
| devops-pipeline-architect | 0.5 | Secrets management |

---

## Top 5 Critical Fixes (Week 1)

1. **Remove password hashes from logs** (4 hours)
   - Delete System.out.println in 3 files
   - IMMEDIATE - Data breach risk

2. **Rotate all secrets** (4 hours)
   - New JWT_SECRET, new DB_PASSWORD
   - Remove .env from git
   - IMMEDIATE - Exposure risk

3. **Implement RBAC** (2 days)
   - Create security services
   - Enable @PreAuthorize
   - CRITICAL - Authorization bypass

4. **Add endpoint authorization** (3 days)
   - Protect all controllers
   - Test 403 responses
   - CRITICAL - Data access control

5. **Move JWT to HttpOnly cookies** (3 days)
   - Backend: set cookies
   - Frontend: remove localStorage
   - CRITICAL - XSS protection

---

## Success Criteria

### Security
- [ ] 0 critical vulnerabilities
- [ ] Authorization checks on 100% of endpoints
- [ ] No sensitive data in logs
- [ ] Tokens in HttpOnly cookies
- [ ] CSRF protection enabled
- [ ] Rate limiting prevents brute force

### Quality
- [ ] Backend coverage > 80%
- [ ] Frontend coverage > 70%
- [ ] Lighthouse accessibility > 90
- [ ] 0 console.log in production

### Compliance
- [ ] WCAG 2.1 Level A
- [ ] Audit logging operational
- [ ] Security headers configured
- [ ] Documentation complete

---

## Quick Test Commands

```bash
# Authorization test (should return 403)
curl -H "Authorization: Bearer <applicant-token>" \
  http://localhost:8080/api/users

# CSRF test (should fail)
curl -X POST -H "Cookie: token=<token>" \
  http://localhost:8080/api/wallets/1/withdraw

# Rate limit test (should return 429 after limit)
for i in {1..101}; do
  curl http://localhost:8080/api/auth/login \
    -d '{"email":"test","password":"wrong"}'
done

# Sensitive data in logs (should return nothing)
grep -r "password\|hash" pdm-backend/logs/

# Coverage reports
mvn jacoco:report  # Backend
npm test -- --coverage  # Frontend
```

---

## Emergency Contacts

- **Security Lead:** Escalate critical vulnerabilities
- **Tech Lead:** Escalate blocking dependencies
- **Product Owner:** Escalate timeline/scope changes

---

## Go/No-Go Decision Points

### After Phase 1 (Week 2)
**GO if:** All critical tasks complete, authorization working, secrets rotated
**NO-GO if:** Authorization bypass still possible, secrets still in git

### After Phase 2 (Week 4)
**GO if:** CSRF enabled, token revocation working, pen test initial pass
**NO-GO if:** High-severity vulnerabilities remain

### After Phase 4 (Week 8)
**GO to Production if:** All quality gates passed, documentation complete
**NO-GO if:** Coverage below targets, pen test failures

---

**Full Plan:** See `/REMEDIATION_EXECUTION_PLAN.md` for detailed task descriptions, acceptance criteria, and file lists.
