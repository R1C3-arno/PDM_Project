# PDM System - Security Hardening Checklist

**Last Updated:** 2025-11-27
**Version:** 1.0
**System:** Personal Data Management (PDM) Loan Management System

---

## Quick Reference: Critical Actions

### IMMEDIATE ACTIONS (Do NOT deploy without these)

- [ ] **Implement Spring Security with JWT authentication**
- [ ] **Hash all passwords with BCrypt (cost factor ≥ 12)**
- [ ] **Remove all `@RequestHeader("X-User-Id")` authentication**
- [ ] **Rotate JWT_SECRET and store in secrets manager**
- [ ] **Rotate database credentials and remove from scripts**
- [ ] **Enable database SSL/TLS encryption**
- [ ] **Implement CSRF protection**
- [ ] **Add role-based authorization (@PreAuthorize)**

---

## 1. Authentication & Authorization

### 1.1 Spring Security Configuration

**File:** `/pdm-backend/src/main/java/com/loanweb/config/SecurityConfig.java`

```java
package com.loanweb.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringRequestMatchers("/api/auth/login", "/api/auth/register")
            )
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/health")
                    .permitAll()
                // Admin endpoints
                .requestMatchers("/api/admin/**")
                    .hasRole("ADMIN")
                // Staff endpoints
                .requestMatchers("/api/staff/**")
                    .hasAnyRole("BANKER", "VERIFIER", "UNDERWRITER", "ADMIN")
                // Loan endpoints
                .requestMatchers("/api/loans/*/approve", "/api/loans/*/reject")
                    .hasAnyRole("BANKER", "UNDERWRITER", "ADMIN")
                // All other endpoints require authentication
                .anyRequest()
                    .authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt with cost factor 12 (2^12 = 4096 rounds)
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Load from environment variable
        String allowedOrigins = System.getenv("CORS_ALLOWED_ORIGINS");
        if (allowedOrigins != null) {
            configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        } else {
            // Default for development
            configuration.setAllowedOrigins(List.of("http://localhost:4000"));
        }

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-CSRF-TOKEN"));
        configuration.setExposedHeaders(Arrays.asList("X-CSRF-TOKEN"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
```

**Checklist:**
- [ ] SecurityConfig.java created
- [ ] @EnableWebSecurity annotation present
- [ ] @EnableMethodSecurity enabled
- [ ] BCryptPasswordEncoder configured (cost factor ≥ 12)
- [ ] JWT filter registered
- [ ] CSRF protection enabled (except login/register)
- [ ] CORS properly configured
- [ ] Session management set to STATELESS
- [ ] All admin endpoints require ADMIN role
- [ ] All staff endpoints require appropriate roles

---

### 1.2 JWT Authentication Filter

**File:** `/pdm-backend/src/main/java/com/loanweb/config/JwtAuthenticationFilter.java`

```java
package com.loanweb.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Check if Authorization header exists and starts with Bearer
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract JWT token
        jwt = authHeader.substring(7);

        try {
            // Extract username from JWT
            userEmail = jwtService.extractUsername(jwt);

            // If user is not already authenticated
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                // Validate token
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                        );

                    authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            log.error("JWT authentication failed: {}", e.getMessage());
            // Don't expose internal errors to client
        }

        filterChain.doFilter(request, response);
    }
}
```

**Checklist:**
- [ ] JwtAuthenticationFilter.java created
- [ ] Extends OncePerRequestFilter
- [ ] Checks for "Bearer " prefix
- [ ] Validates JWT signature
- [ ] Sets authentication in SecurityContext
- [ ] Handles exceptions gracefully
- [ ] Logs authentication failures (without sensitive data)

---

### 1.3 JWT Service

**File:** `/pdm-backend/src/main/java/com/loanweb/config/JwtService.java`

```java
package com.loanweb.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration:86400000}") // Default 24 hours
    private Long jwtExpiration;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = secretKey.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
```

**Checklist:**
- [ ] JwtService.java created
- [ ] Secret loaded from environment variable
- [ ] Token expiration configurable
- [ ] HS256 algorithm used (or better)
- [ ] Token validation includes expiration check
- [ ] Claims properly extracted

---

### 1.4 Update Controllers to Use SecurityContext

**Example:** Update MessageController

```java
package com.loanweb.web;

import com.loanweb.domain.user.User;
import com.loanweb.dto.message.MessageDTO;
import com.loanweb.dto.message.SendMessageRequest;
import com.loanweb.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Slf4j
public class MessageController {

    private final MessageService messageService;

    /**
     * Send a new message
     * POST /api/messages
     */
    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(
            @AuthenticationPrincipal User currentUser,  // ← SECURE: From JWT
            @Valid @RequestBody SendMessageRequest request) {

        log.info("User {} sending message", currentUser.getId());
        MessageDTO message = messageService.sendMessage(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    @GetMapping("/inbox")
    public ResponseEntity<List<MessageDTO>> getInbox(
            @AuthenticationPrincipal User currentUser) {  // ← SECURE

        log.info("Fetching inbox for user: {}", currentUser.getId());
        List<MessageDTO> messages = messageService.getInbox(currentUser.getId());
        return ResponseEntity.ok(messages);
    }

    // Update all other endpoints similarly...
}
```

**Checklist:**
- [ ] All @RequestHeader("X-User-Id") removed
- [ ] @AuthenticationPrincipal User used instead
- [ ] SecurityContext accessed when needed
- [ ] No user-supplied headers trusted for authentication

---

## 2. Password Security

### 2.1 Password Hashing Implementation

**File:** `/pdm-backend/src/main/java/com/loanweb/service/UserService.java`

```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createUser(UserRegistrationDTO dto) {
        // Validate password strength
        validatePasswordStrength(dto.getPassword());

        User user = User.builder()
            .email(dto.getEmail())
            .password(passwordEncoder.encode(dto.getPassword()))  // ← Hash password
            .fullName(dto.getFullName())
            .phone(dto.getPhone())
            .role(UserRole.APPLICANT)
            .status(UserStatus.ACTIVE)
            .build();

        return userRepository.save(user);
    }

    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Verify old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        // Validate new password
        validatePasswordStrength(newPassword);

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Log password change
        auditLogService.log(AuditAction.PASSWORD_CHANGED, user.getId());
    }

    private void validatePasswordStrength(String password) {
        if (password == null || password.length() < 12) {
            throw new ValidationException("Password must be at least 12 characters long");
        }

        if (!password.matches(".*[A-Z].*")) {
            throw new ValidationException("Password must contain at least one uppercase letter");
        }

        if (!password.matches(".*[a-z].*")) {
            throw new ValidationException("Password must contain at least one lowercase letter");
        }

        if (!password.matches(".*\\d.*")) {
            throw new ValidationException("Password must contain at least one digit");
        }

        if (!password.matches(".*[@#$%^&+=!].*")) {
            throw new ValidationException("Password must contain at least one special character");
        }

        // Check against common passwords
        if (isCommonPassword(password)) {
            throw new ValidationException("Password is too common. Please choose a stronger password");
        }
    }

    private boolean isCommonPassword(String password) {
        // Load from file or database
        Set<String> commonPasswords = Set.of(
            "password", "password123", "12345678", "qwerty", "abc123"
            // Add more common passwords
        );
        return commonPasswords.contains(password.toLowerCase());
    }
}
```

**Checklist:**
- [ ] PasswordEncoder bean configured (BCrypt, cost ≥ 12)
- [ ] All passwords hashed before storage
- [ ] Password strength validation implemented
- [ ] Minimum length: 12 characters
- [ ] Requires uppercase, lowercase, digit, special character
- [ ] Common password check implemented
- [ ] Password changes logged in audit trail
- [ ] Old password verified before change
- [ ] Plaintext passwords never logged

---

### 2.2 Database Migration for Password Hashing

**WARNING:** Existing plaintext passwords CANNOT be hashed. Users must reset passwords.

**File:** `/pdm-backend/src/main/resources/db/migration/V3__Force_Password_Reset.sql`

```sql
-- Invalidate all existing plaintext passwords
-- Users will be forced to reset passwords on next login
UPDATE users
SET password = '$2a$12$INVALID_HASH_FORCE_RESET_ON_NEXT_LOGIN_ATTEMPT_PLACEHOLDER',
    status = 'PENDING_PASSWORD_RESET'
WHERE LENGTH(password) < 60;  -- BCrypt hashes are 60 characters

-- Add password reset tokens table
CREATE TABLE password_reset_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiry_date TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expiry (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Checklist:**
- [ ] Migration script created
- [ ] All existing passwords invalidated
- [ ] Password reset mechanism implemented
- [ ] Email notifications sent to users
- [ ] Password reset tokens secure (UUID, expiring)

---

## 3. Secret Management

### 3.1 Environment Variables Configuration

**File:** `.env` (NEVER commit to Git)

```bash
# Application
APP_ENV=production
SERVER_PORT=4001

# Database
DB_HOST=34.143.226.168
DB_PORT=3306
DB_NAME=loan_management
DB_USERNAME=pdm_user
DB_PASSWORD=<STRONG_PASSWORD_FROM_SECRETS_MANAGER>

# JWT
JWT_SECRET=<BASE64_ENCODED_SECRET_64_BYTES>
JWT_EXPIRATION=86400000

# CORS
CORS_ALLOWED_ORIGINS=https://pdm-frontend.example.com,https://app.example.com

# Encryption
ENCRYPTION_KEY=<AES_256_KEY>

# External Services
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<FROM_IAM_ROLE>
AWS_SECRET_ACCESS_KEY=<FROM_IAM_ROLE>

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=<EMAIL_USERNAME>
SMTP_PASSWORD=<EMAIL_PASSWORD>
```

**Generate Secrets:**
```bash
# Generate JWT secret (256 bits = 64 hex characters)
openssl rand -base64 64

# Generate encryption key (256 bits)
openssl rand -hex 32

# Generate strong database password
openssl rand -base64 32
```

**Checklist:**
- [ ] .env file created
- [ ] .env added to .gitignore
- [ ] All secrets removed from code
- [ ] Strong secrets generated (≥ 256 bits)
- [ ] Secrets never committed to Git
- [ ] Git history cleaned of secrets

---

### 3.2 AWS Secrets Manager Integration

**File:** `/pdm-backend/src/main/java/com/loanweb/config/SecretsConfig.java`

```java
package com.loanweb.config;

import com.amazonaws.services.secretsmanager.AWSSecretsManager;
import com.amazonaws.services.secretsmanager.AWSSecretsManagerClientBuilder;
import com.amazonaws.services.secretsmanager.model.GetSecretValueRequest;
import com.amazonaws.services.secretsmanager.model.GetSecretValueResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("production")
public class SecretsConfig {

    @Value("${aws.region:us-east-1}")
    private String awsRegion;

    @Bean
    public AWSSecretsManager secretsManager() {
        return AWSSecretsManagerClientBuilder.standard()
                .withRegion(awsRegion)
                .build();
    }

    @Bean
    public String jwtSecret(AWSSecretsManager secretsManager) {
        return getSecret(secretsManager, "pdm/jwt/secret");
    }

    @Bean
    public DatabaseCredentials databaseCredentials(AWSSecretsManager secretsManager) {
        String secretJson = getSecret(secretsManager, "pdm/database/credentials");
        return parseCredentials(secretJson);
    }

    private String getSecret(AWSSecretsManager client, String secretName) {
        GetSecretValueRequest request = new GetSecretValueRequest()
                .withSecretId(secretName);

        GetSecretValueResult result = client.getSecretValue(request);
        return result.getSecretString();
    }

    private DatabaseCredentials parseCredentials(String json) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(json);
            return DatabaseCredentials.builder()
                    .host(node.get("host").asText())
                    .port(node.get("port").asInt())
                    .database(node.get("database").asText())
                    .username(node.get("username").asText())
                    .password(node.get("password").asText())
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse database credentials", e);
        }
    }
}
```

**Checklist:**
- [ ] AWS SDK dependency added to pom.xml
- [ ] Secrets stored in AWS Secrets Manager
- [ ] IAM role configured for application
- [ ] Secrets retrieved at application startup
- [ ] Secrets cached appropriately
- [ ] Rotation lambda configured
- [ ] Automatic rotation enabled (30 days)

---

### 3.3 Update .gitignore

**File:** `.gitignore`

```gitignore
# Environment variables
.env
.env.*
!.env.example

# IDE
.idea/
*.iml
.vscode/

# Build
target/
dist/
build/
*.log

# OS
.DS_Store
Thumbs.db

# Secrets and keys
*.pem
*.key
*.crt
secrets.yml
credentials.json

# Database
*.sql.gz
backups/
```

**Checklist:**
- [ ] .gitignore updated with all secret patterns
- [ ] Existing secrets removed from Git history
- [ ] .env.example created (without real secrets)

---

## 4. Database Security

### 4.1 SSL/TLS Configuration

**File:** `application.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}?useSSL=true&requireSSL=true&verifyServerCertificate=true
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver

    # Connection pooling
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
      leak-detection-threshold: 60000
      connection-test-query: SELECT 1
```

**For GCP Cloud SQL:**
```bash
# Download Cloud SQL Proxy
wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
chmod +x cloud_sql_proxy

# Run proxy
./cloud_sql_proxy -instances=project:region:instance=tcp:3306 &

# Application connects to localhost
jdbc:mysql://localhost:3306/loan_management
```

**Checklist:**
- [ ] SSL/TLS enabled (useSSL=true)
- [ ] SSL required (requireSSL=true)
- [ ] Server certificate verification enabled
- [ ] Cloud SQL Proxy used for GCP
- [ ] SSH tunnel configured for AWS RDS
- [ ] Database firewall restricted to application IPs

---

### 4.2 Field-Level Encryption

**File:** `/pdm-backend/src/main/java/com/loanweb/config/EncryptionService.java`

```java
package com.loanweb.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class EncryptionService {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_TAG_LENGTH = 128;
    private static final int GCM_IV_LENGTH = 12;

    @Value("${encryption.key}")
    private String encryptionKey;

    public String encrypt(String plaintext) {
        if (plaintext == null) {
            return null;
        }

        try {
            // Generate random IV
            byte[] iv = new byte[GCM_IV_LENGTH];
            SecureRandom random = new SecureRandom();
            random.nextBytes(iv);

            // Create cipher
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            SecretKeySpec keySpec = new SecretKeySpec(
                hexToBytes(encryptionKey), "AES");
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, gcmSpec);

            // Encrypt
            byte[] ciphertext = cipher.doFinal(
                plaintext.getBytes(StandardCharsets.UTF_8));

            // Combine IV + ciphertext
            ByteBuffer buffer = ByteBuffer.allocate(iv.length + ciphertext.length);
            buffer.put(iv);
            buffer.put(ciphertext);

            return Base64.getEncoder().encodeToString(buffer.array());
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }

    public String decrypt(String ciphertext) {
        if (ciphertext == null) {
            return null;
        }

        try {
            byte[] decoded = Base64.getDecoder().decode(ciphertext);

            // Extract IV
            ByteBuffer buffer = ByteBuffer.wrap(decoded);
            byte[] iv = new byte[GCM_IV_LENGTH];
            buffer.get(iv);

            // Extract ciphertext
            byte[] encrypted = new byte[buffer.remaining()];
            buffer.get(encrypted);

            // Create cipher
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            SecretKeySpec keySpec = new SecretKeySpec(
                hexToBytes(encryptionKey), "AES");
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, keySpec, gcmSpec);

            // Decrypt
            byte[] plaintext = cipher.doFinal(encrypted);
            return new String(plaintext, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed", e);
        }
    }

    private byte[] hexToBytes(String hex) {
        int len = hex.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                + Character.digit(hex.charAt(i + 1), 16));
        }
        return data;
    }
}
```

**JPA Converter:**
```java
@Converter
public class EncryptedStringConverter implements AttributeConverter<String, String> {

    @Autowired
    private EncryptionService encryptionService;

    @Override
    public String convertToDatabaseColumn(String attribute) {
        return encryptionService.encrypt(attribute);
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        return encryptionService.decrypt(dbData);
    }
}
```

**Apply to Entities:**
```java
@Entity
@Table(name = "applicants")
public class Applicant {

    @Convert(converter = EncryptedStringConverter.class)
    @Column(name = "national_id")
    private String nationalId;  // Encrypted in DB

    @Convert(converter = EncryptedStringConverter.class)
    private String address;

    // Other fields...
}
```

**Checklist:**
- [ ] EncryptionService implemented
- [ ] AES-256-GCM encryption used
- [ ] Random IV generated per encryption
- [ ] Encryption key stored securely
- [ ] Applied to sensitive fields (national ID, address, phone)
- [ ] Key rotation procedure documented

---

## 5. API Security

### 5.1 CSRF Protection Implementation

**Backend Configuration:**
```java
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler())
            );
        return http.build();
    }
}

// Custom CSRF handler for SPAs
class SpaCsrfTokenRequestHandler extends CsrfTokenRequestAttributeHandler {
    private final CsrfTokenRequestHandler delegate = new XorCsrfTokenRequestAttributeHandler();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                      Supplier<CsrfToken> csrfToken) {
        this.delegate.handle(request, response, csrfToken);
    }

    @Override
    public String resolveCsrfTokenValue(HttpServletRequest request, CsrfToken csrfToken) {
        if (StringUtils.hasText(request.getHeader(csrfToken.getHeaderName()))) {
            return super.resolveCsrfTokenValue(request, csrfToken);
        }
        return this.delegate.resolveCsrfTokenValue(request, csrfToken);
    }
}
```

**Frontend Integration:**
```typescript
// lib/csrf.ts
export const getCSRFToken = (): string | null => {
  const cookies = document.cookie.split('; ');
  const csrfCookie = cookies.find(row => row.startsWith('XSRF-TOKEN='));
  return csrfCookie ? csrfCookie.split('=')[1] : null;
};

// lib/api.ts
class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const csrfToken = getCSRFToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken && { 'X-XSRF-TOKEN': csrfToken }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }
}
```

**Checklist:**
- [ ] CSRF protection enabled in SecurityConfig
- [ ] CookieCsrfTokenRepository configured
- [ ] CSRF token included in SPA requests
- [ ] CSRF token validated on state-changing operations
- [ ] Login/register endpoints exempt from CSRF

---

### 5.2 Rate Limiting

**File:** `/pdm-backend/src/main/java/com/loanweb/config/RateLimitFilter.java`

```java
package com.loanweb.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    // 100 requests per minute per IP
    private Bucket createBucket() {
        Bandwidth limit = Bandwidth.classic(100,
            Refill.intervally(100, Duration.ofMinutes(1)));
        return Bucket.builder()
            .addLimit(limit)
            .build();
    }

    // Stricter limit for login endpoint (10 per minute)
    private Bucket createLoginBucket() {
        Bandwidth limit = Bandwidth.classic(10,
            Refill.intervally(10, Duration.ofMinutes(1)));
        return Bucket.builder()
            .addLimit(limit)
            .build();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                   HttpServletResponse response,
                                   FilterChain chain) throws IOException, ServletException {
        String key = getClientIP(request);
        String path = request.getRequestURI();

        Bucket bucket;
        if (path.contains("/auth/login") || path.contains("/auth/register")) {
            bucket = cache.computeIfAbsent(key + ":auth", k -> createLoginBucket());
        } else {
            bucket = cache.computeIfAbsent(key, k -> createBucket());
        }

        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            response.setStatus(429); // Too Many Requests
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Too many requests. Please try again later.\"}");
        }
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
```

**Checklist:**
- [ ] Rate limiting filter implemented
- [ ] Different limits for different endpoints
- [ ] Login endpoints have strict limits (10/min)
- [ ] General endpoints limited (100/min)
- [ ] IP address correctly extracted
- [ ] 429 status returned when limited
- [ ] Cache cleanup implemented (evict old entries)

---

### 5.3 Security Headers

**File:** `/pdm-backend/src/main/java/com/loanweb/config/SecurityHeadersFilter.java`

```java
package com.loanweb.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityHeadersFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                   HttpServletResponse response,
                                   FilterChain chain) throws IOException, ServletException {

        // Prevent MIME type sniffing
        response.setHeader("X-Content-Type-Options", "nosniff");

        // Prevent clickjacking
        response.setHeader("X-Frame-Options", "DENY");

        // Enable XSS filter
        response.setHeader("X-XSS-Protection", "1; mode=block");

        // Force HTTPS
        response.setHeader("Strict-Transport-Security",
            "max-age=31536000; includeSubDomains; preload");

        // Content Security Policy
        response.setHeader("Content-Security-Policy",
            "default-src 'self'; " +
            "script-src 'self'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: https:; " +
            "font-src 'self'; " +
            "connect-src 'self'; " +
            "frame-ancestors 'none'; " +
            "base-uri 'self'; " +
            "form-action 'self'");

        // Referrer policy
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

        // Permissions policy
        response.setHeader("Permissions-Policy",
            "geolocation=(), microphone=(), camera=(), payment=()");

        chain.doFilter(request, response);
    }
}
```

**Checklist:**
- [ ] SecurityHeadersFilter implemented
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Strict-Transport-Security configured
- [ ] Content-Security-Policy defined
- [ ] Referrer-Policy set
- [ ] Permissions-Policy configured

---

## 6. Input Validation

### 6.1 Bean Validation

**File:** Domain entities with validation

```java
@Entity
@Table(name = "loans")
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Loan amount is required")
    @Min(value = 1000, message = "Minimum loan amount is $1,000")
    @Max(value = 1000000, message = "Maximum loan amount is $1,000,000")
    @Digits(integer = 10, fraction = 2, message = "Invalid amount format")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @NotNull(message = "Interest rate is required")
    @DecimalMin(value = "0.01", message = "Interest rate must be positive")
    @DecimalMax(value = "99.99", message = "Interest rate cannot exceed 99.99%")
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;

    @NotNull(message = "Term is required")
    @Min(value = 6, message = "Minimum term is 6 months")
    @Max(value = 360, message = "Maximum term is 360 months")
    @Column(name = "term_months", nullable = false)
    private Integer termMonths;

    @NotBlank(message = "Purpose is required")
    @Size(min = 10, max = 500, message = "Purpose must be between 10 and 500 characters")
    private String purpose;

    // Other fields...
}
```

**DTOs with validation:**
```java
public class LoanApplicationDTO {

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    @Max(value = 1000000, message = "Maximum amount is $1,000,000")
    private BigDecimal amount;

    @NotNull(message = "Term is required")
    @Min(value = 6, message = "Minimum term is 6 months")
    @Max(value = 360, message = "Maximum term is 360 months")
    private Integer termMonths;

    @NotBlank(message = "Purpose is required")
    @Size(min = 10, max = 500)
    private String purpose;

    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number")
    private String phone;
}
```

**Controller validation:**
```java
@RestController
@RequestMapping("/api/loans")
@Validated
public class LoanController {

    @PostMapping
    public ResponseEntity<LoanDTO> createLoan(
            @Valid @RequestBody LoanApplicationDTO dto,
            @AuthenticationPrincipal User user) {

        // Additional business validation
        validateLoanEligibility(user, dto);

        LoanDTO loan = loanService.createLoan(user.getId(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(loan);
    }
}
```

**Checklist:**
- [ ] Bean Validation dependency added (javax.validation)
- [ ] @Valid annotation on all @RequestBody parameters
- [ ] Constraints on all entity fields
- [ ] Custom validators for business rules
- [ ] Validation error handling configured
- [ ] Meaningful error messages
- [ ] Max length constraints on all strings
- [ ] Numeric ranges validated
- [ ] Email and phone format validated

---

### 6.2 SQL Injection Prevention

**Checklist:**
- [ ] ONLY use JPA/Hibernate for database access
- [ ] NEVER concatenate strings in queries
- [ ] Always use @Param annotations
- [ ] Use @Query with named parameters
- [ ] Enable SQL logging in development
- [ ] Code review for native queries
- [ ] Static analysis tools configured

**Safe Query Patterns:**
```java
// SAFE: Parameterized query
@Query("SELECT u FROM User u WHERE u.email = :email")
User findByEmail(@Param("email") String email);

// SAFE: Named parameters
@Query(value = "SELECT * FROM users WHERE role = :role", nativeQuery = true)
List<User> findByRole(@Param("role") String role);

// DANGEROUS: Never do this
@Query(value = "SELECT * FROM users WHERE email = '" + email + "'", nativeQuery = true)
User findByEmailUnsafe(String email);  // ← SQL INJECTION VULNERABLE
```

---

## 7. Audit Logging

### 7.1 Audit Log Implementation

**File:** `/pdm-backend/src/main/java/com/loanweb/domain/audit/AuditLog.java`

```java
@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditAction action;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private String entityType;

    @Column(nullable = false)
    private Long entityId;

    @Column(columnDefinition = "TEXT")
    private String beforeState;

    @Column(columnDefinition = "TEXT")
    private String afterState;

    @Column(nullable = false)
    private String ipAddress;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "request_id")
    private String requestId;
}
```

**Audit Service:**
```java
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    public void log(AuditAction action, Long entityId, String entityType,
                   Object beforeState, Object afterState) {
        User currentUser = getCurrentUser();

        AuditLog auditLog = AuditLog.builder()
            .action(action)
            .userId(currentUser.getId())
            .userEmail(currentUser.getEmail())
            .entityType(entityType)
            .entityId(entityId)
            .beforeState(toJson(beforeState))
            .afterState(toJson(afterState))
            .ipAddress(getClientIP())
            .timestamp(LocalDateTime.now())
            .requestId(MDC.get("requestId"))
            .build();

        auditLogRepository.save(auditLog);
    }

    private String toJson(Object object) {
        if (object == null) return null;
        try {
            return objectMapper.writeValueAsString(object);
        } catch (Exception e) {
            return "Error serializing object";
        }
    }
}
```

**Usage:**
```java
@Service
public class LoanService {

    @Transactional
    public Loan approveLoan(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
            .orElseThrow(() -> new ResourceNotFoundException("Loan not found"));

        // Capture before state
        Loan beforeState = loan.clone();

        // Make changes
        loan.setStatus(LoanStatus.APPROVED);
        loan.setApprovedAt(LocalDateTime.now());
        loan = loanRepository.save(loan);

        // Audit log
        auditLogService.log(
            AuditAction.LOAN_APPROVED,
            loanId,
            "Loan",
            beforeState,
            loan
        );

        return loan;
    }
}
```

**Checklist:**
- [ ] audit_logs table created
- [ ] AuditLog entity implemented
- [ ] AuditLogService created
- [ ] Logging for: loan approvals/rejections
- [ ] Logging for: disbursements
- [ ] Logging for: payments
- [ ] Logging for: role changes
- [ ] Logging for: data access/modifications
- [ ] IP address captured
- [ ] Request ID captured for tracing
- [ ] Audit logs immutable (no UPDATE/DELETE)
- [ ] Audit log retention policy (7 years)

---

## 8. Monitoring & Alerting

### 8.1 Security Event Monitoring

**File:** `/pdm-backend/src/main/java/com/loanweb/service/SecurityMonitoringService.java`

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class SecurityMonitoringService {

    private final AlertService alertService;

    public void logFailedLogin(String email, String ipAddress) {
        log.warn("Failed login attempt for email: {} from IP: {}", email, ipAddress);

        // Check for brute force
        if (countRecentFailedLogins(email, ipAddress) > 5) {
            alertService.sendSecurityAlert(
                "Brute force attack detected",
                String.format("Multiple failed login attempts for %s from %s", email, ipAddress)
            );
        }
    }

    public void logUnauthorizedAccess(Long userId, String resource) {
        log.error("Unauthorized access attempt by user {} to resource: {}", userId, resource);

        alertService.sendSecurityAlert(
            "Unauthorized access attempt",
            String.format("User %d attempted to access %s", userId, resource)
        );
    }

    public void logSuspiciousActivity(String description, Map<String, Object> context) {
        log.warn("Suspicious activity detected: {} Context: {}", description, context);

        if (isCriticalEvent(description)) {
            alertService.sendCriticalAlert(description, context);
        }
    }
}
```

**Metrics:**
```java
@Configuration
public class MetricsConfig {

    @Bean
    public MeterRegistryCustomizer<MeterRegistry> metricsCommonTags() {
        return registry -> registry.config()
            .commonTags("application", "pdm-backend")
            .commonTags("environment", getEnvironment());
    }

    @Bean
    public SecurityMetrics securityMetrics(MeterRegistry registry) {
        return new SecurityMetrics(registry);
    }
}

@Component
public class SecurityMetrics {

    private final Counter failedLogins;
    private final Counter unauthorizedAccess;
    private final Timer authenticationTime;

    public SecurityMetrics(MeterRegistry registry) {
        this.failedLogins = registry.counter("security.failed.logins");
        this.unauthorizedAccess = registry.counter("security.unauthorized.access");
        this.authenticationTime = registry.timer("security.authentication.time");
    }

    public void recordFailedLogin() {
        failedLogins.increment();
    }

    public void recordUnauthorizedAccess() {
        unauthorizedAccess.increment();
    }

    public void recordAuthenticationTime(Duration duration) {
        authenticationTime.record(duration);
    }
}
```

**Checklist:**
- [ ] Security event logging implemented
- [ ] Failed login monitoring
- [ ] Brute force detection
- [ ] Unauthorized access logging
- [ ] Metrics collection configured
- [ ] Alerting system integrated (PagerDuty, Slack)
- [ ] Log aggregation (ELK, Splunk)
- [ ] Dashboard created (Grafana)

---

## 9. Production Deployment Checklist

### Pre-Deployment Security Review

**Code Security:**
- [ ] All secrets removed from code
- [ ] No hardcoded credentials
- [ ] Git history cleaned of secrets
- [ ] .gitignore properly configured
- [ ] Dependencies updated
- [ ] Security patches applied

**Authentication & Authorization:**
- [ ] Spring Security configured
- [ ] JWT validation working
- [ ] Password hashing implemented (BCrypt)
- [ ] RBAC enforced on all endpoints
- [ ] No X-User-Id header authentication
- [ ] Session management secure

**Database:**
- [ ] SSL/TLS encryption enabled
- [ ] Connection through VPN/proxy
- [ ] Firewall rules restrictive
- [ ] Credentials in secrets manager
- [ ] Connection pooling configured
- [ ] Field-level encryption for PII

**API Security:**
- [ ] CSRF protection enabled
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Security headers configured
- [ ] HTTPS enforced

**Secrets Management:**
- [ ] AWS Secrets Manager/Vault configured
- [ ] No secrets in environment variables on server
- [ ] Secret rotation configured
- [ ] IAM roles for service authentication

**Monitoring:**
- [ ] Audit logging enabled
- [ ] Security event monitoring
- [ ] Alerting configured
- [ ] Log aggregation setup
- [ ] Metrics dashboard created

**Infrastructure:**
- [ ] Firewall rules configured
- [ ] Network segmentation
- [ ] Load balancer SSL termination
- [ ] DDoS protection enabled
- [ ] Backup and disaster recovery plan

**Compliance:**
- [ ] GDPR requirements met
- [ ] Data retention policy implemented
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Security incident response plan

---

## 10. Security Testing Procedures

### 10.1 Pre-Deployment Security Tests

**Authentication Tests:**
```bash
# Test 1: Cannot access protected endpoint without token
curl http://localhost:4001/api/loans
# Expected: 401 Unauthorized

# Test 2: Cannot use X-User-Id header for auth
curl -H "X-User-Id: 1" http://localhost:4001/api/loans
# Expected: 401 Unauthorized

# Test 3: Valid JWT token allows access
curl -H "Authorization: Bearer <valid_jwt>" http://localhost:4001/api/loans
# Expected: 200 OK

# Test 4: Expired JWT token rejected
curl -H "Authorization: Bearer <expired_jwt>" http://localhost:4001/api/loans
# Expected: 401 Unauthorized
```

**Authorization Tests:**
```bash
# Test 5: APPLICANT cannot access admin endpoints
curl -H "Authorization: Bearer <applicant_token>" http://localhost:4001/api/admin/users
# Expected: 403 Forbidden

# Test 6: APPLICANT cannot approve loans
curl -X POST -H "Authorization: Bearer <applicant_token>" \
  http://localhost:4001/api/loans/1/approve
# Expected: 403 Forbidden

# Test 7: ADMIN can access all endpoints
curl -H "Authorization: Bearer <admin_token>" http://localhost:4001/api/admin/users
# Expected: 200 OK
```

**CSRF Tests:**
```bash
# Test 8: POST without CSRF token fails
curl -X POST http://localhost:4001/api/messages \
  -H "Authorization: Bearer <token>" \
  -d '{"recipientId":2,"subject":"Test","body":"Test"}'
# Expected: 403 Forbidden

# Test 9: POST with CSRF token succeeds
curl -X POST http://localhost:4001/api/messages \
  -H "Authorization: Bearer <token>" \
  -H "X-XSRF-TOKEN: <csrf_token>" \
  -d '{"recipientId":2,"subject":"Test","body":"Test"}'
# Expected: 201 Created
```

**Rate Limiting Tests:**
```bash
# Test 10: Rate limit enforced
for i in {1..150}; do
  curl http://localhost:4001/api/auth/login \
    -d '{"email":"test@test.com","password":"wrong"}' &
done
# Expected: Some requests return 429 Too Many Requests
```

**Input Validation Tests:**
```bash
# Test 11: Negative loan amount rejected
curl -X POST -H "Authorization: Bearer <token>" \
  http://localhost:4001/api/loans \
  -d '{"amount":-5000,"termMonths":12,"purpose":"Test"}'
# Expected: 400 Bad Request

# Test 12: SQL injection attempt blocked
curl -X POST http://localhost:4001/api/auth/login \
  -d '{"email":"admin'\'' OR 1=1--","password":"test"}'
# Expected: 400 Bad Request or 401 Unauthorized (not SQL error)

# Test 13: XSS attempt sanitized
curl -X POST -H "Authorization: Bearer <token>" \
  http://localhost:4001/api/messages \
  -d '{"recipientId":2,"subject":"<script>alert(1)</script>","body":"Test"}'
# Expected: 400 Bad Request or content sanitized
```

**Checklist:**
- [ ] All authentication tests pass
- [ ] All authorization tests pass
- [ ] CSRF protection tests pass
- [ ] Rate limiting tests pass
- [ ] Input validation tests pass
- [ ] Security headers present in responses
- [ ] No sensitive data in error messages
- [ ] No stack traces exposed to users

---

## 11. Security Configuration Files Reference

### application.yml (Complete Secure Configuration)

```yaml
spring:
  application:
    name: pdm-backend

  datasource:
    url: jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}?useSSL=true&requireSSL=true&verifyServerCertificate=true
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver

    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
      leak-detection-threshold: 60000
      connection-test-query: SELECT 1

  jpa:
    hibernate:
      ddl-auto: validate  # NEVER use 'update' in production
    show-sql: false  # Disable SQL logging in production
    properties:
      hibernate:
        format_sql: false
        use_sql_comments: false
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true
        query:
          fail_on_pagination_over_collection_fetch: true

  # Flyway migrations
  flyway:
    enabled: true
    baseline-on-migrate: true
    locations: classpath:db/migration

server:
  port: ${SERVER_PORT:4001}

  # SSL/TLS configuration
  ssl:
    enabled: ${SSL_ENABLED:false}
    key-store: ${SSL_KEY_STORE:classpath:keystore.p12}
    key-store-password: ${SSL_KEY_STORE_PASSWORD}
    key-store-type: PKCS12
    key-alias: pdm

  # Connection timeouts
  tomcat:
    connection-timeout: 20000
    max-connections: 10000
    threads:
      max: 200
      min-spare: 10

  # Compression
  compression:
    enabled: true
    mime-types: application/json,application/xml,text/html,text/xml,text/plain

  # Error handling
  error:
    include-message: never
    include-binding-errors: never
    include-stacktrace: never
    include-exception: false

# JWT Configuration
jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION:86400000}  # 24 hours
  refresh-expiration: ${JWT_REFRESH_EXPIRATION:604800000}  # 7 days

# CORS Configuration
cors:
  allowed-origins: ${CORS_ALLOWED_ORIGINS}
  allowed-methods: GET,POST,PUT,DELETE,OPTIONS
  allowed-headers: Authorization,Content-Type,X-CSRF-TOKEN
  exposed-headers: X-CSRF-TOKEN
  allow-credentials: true
  max-age: 3600

# Encryption
encryption:
  key: ${ENCRYPTION_KEY}

# Logging
logging:
  level:
    root: INFO
    com.loanweb: INFO
    org.springframework.security: INFO
    org.hibernate: WARN
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  file:
    name: /var/log/pdm-backend/application.log
    max-size: 10MB
    max-history: 30

# Actuator
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
      base-path: /actuator
  endpoint:
    health:
      show-details: when-authorized
  metrics:
    export:
      prometheus:
        enabled: true

# Rate Limiting
rate-limit:
  general:
    capacity: 100
    refill-tokens: 100
    refill-duration: 1m
  authentication:
    capacity: 10
    refill-tokens: 10
    refill-duration: 1m
```

---

## 12. Emergency Security Procedures

### In Case of Security Breach

**Immediate Actions (within 1 hour):**
1. **Isolate affected systems**
   ```bash
   # Disable application
   kubectl scale deployment pdm-backend --replicas=0

   # Block all incoming traffic
   aws ec2 modify-security-group-rules --group-id sg-xxx --revoke-all
   ```

2. **Rotate all credentials**
   ```bash
   # Rotate database password
   aws secretsmanager rotate-secret --secret-id pdm/database/credentials

   # Rotate JWT secret
   aws secretsmanager rotate-secret --secret-id pdm/jwt/secret

   # Invalidate all existing sessions/tokens
   redis-cli FLUSHALL
   ```

3. **Take database snapshot**
   ```bash
   aws rds create-db-snapshot \
     --db-instance-identifier pdm-db \
     --db-snapshot-identifier pdm-breach-$(date +%Y%m%d-%H%M%S)
   ```

4. **Enable detailed logging**
   ```yaml
   logging:
     level:
       com.loanweb: DEBUG
       org.springframework.security: DEBUG
   ```

5. **Notify stakeholders**
   - Security team
   - Management
   - Legal department
   - Prepare GDPR breach notification (72 hours)

---

## 13. Security Maintenance Schedule

### Daily
- [ ] Review security logs
- [ ] Check failed login attempts
- [ ] Monitor rate limiting triggers

### Weekly
- [ ] Review audit logs
- [ ] Check for new CVEs in dependencies
- [ ] Verify backup integrity
- [ ] Review access control changes

### Monthly
- [ ] Rotate secrets (if not automated)
- [ ] Security patch updates
- [ ] Review firewall rules
- [ ] Update security documentation

### Quarterly
- [ ] Full security audit
- [ ] Penetration testing
- [ ] Disaster recovery drill
- [ ] Review and update security policies
- [ ] Security training for team

### Annually
- [ ] Comprehensive security assessment
- [ ] Third-party security audit
- [ ] Compliance audit (GDPR, SOC 2)
- [ ] Update incident response plan

---

## Appendix A: Security Tools & Resources

### Required Tools
- **SAST**: SonarQube, Checkmarx
- **DAST**: OWASP ZAP, Burp Suite
- **Dependency Scanning**: OWASP Dependency Check, Snyk
- **Secret Scanning**: GitGuardian, TruffleHog
- **Monitoring**: Prometheus, Grafana, ELK Stack
- **Alerting**: PagerDuty, Opsgenie
- **WAF**: AWS WAF, Cloudflare

### Useful Commands
```bash
# Generate strong password
openssl rand -base64 32

# Generate JWT secret
openssl rand -base64 64

# Generate encryption key
openssl rand -hex 32

# Check SSL certificate
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Scan for secrets in Git history
trufflehog git file://. --since_commit main

# Security scan
zap-cli quick-scan http://localhost:4001/api
```

---

**Document Version:** 1.0
**Last Updated:** 2025-11-27
**Status:** DRAFT - Requires Implementation
**Classification:** CONFIDENTIAL

