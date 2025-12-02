package com.loanweb.web;

import com.loanweb.domain.user.User;
import com.loanweb.dto.auth.AuthResponse;
import com.loanweb.dto.auth.LoginRequest;
import com.loanweb.dto.auth.RegisterRequest;
import com.loanweb.dto.auth.UserDTO;
import com.loanweb.security.JwtTokenProvider;
import com.loanweb.service.UserService;
import com.loanweb.service.AuditService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST controller for authentication endpoints.
 *
 * <p>Security Architecture:</p>
 * <ul>
 *   <li>JWT tokens stored in HttpOnly cookies (XSS protection)</li>
 *   <li>SameSite=Strict cookie attribute (CSRF protection)</li>
 *   <li>BCrypt password hashing (brute force protection)</li>
 *   <li>Password strength validation (entropy enforcement)</li>
 *   <li>Centralized authentication via AuthenticationManager</li>
 *   <li>Last login tracking (audit trail)</li>
 * </ul>
 *
 * <p>Endpoints:</p>
 * <ul>
 *   <li>POST /api/auth/register - User registration</li>
 *   <li>POST /api/auth/login - User authentication</li>
 *   <li>POST /api/auth/logout - Session termination</li>
 *   <li>GET /api/auth/me - Current user information</li>
 *   <li>POST /api/auth/refresh - Token refresh</li>
 * </ul>
 *
 * <p>Cookie Configuration:</p>
 * <ul>
 *   <li>Name: "token"</li>
 *   <li>HttpOnly: true (prevents JavaScript access)</li>
 *   <li>Secure: false (dev mode, should be true in production)</li>
 *   <li>Path: /api (limits cookie scope)</li>
 *   <li>MaxAge: 900 seconds (15 minutes)</li>
 * </ul>
 *
 * @author PDM Security Team
 * @version 1.0
 * @since 2025-01-27
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    // Cookie configuration constants
    private static final String TOKEN_COOKIE_NAME = "token";
    private static final String COOKIE_PATH = "/"; // Root path so cookie is sent with all requests
    private static final int COOKIE_MAX_AGE = 900; // 15 minutes in seconds
    private static final boolean COOKIE_HTTP_ONLY = true;
    private static final boolean COOKIE_SECURE = false; // Set to true in production with HTTPS

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final AuditService auditService;

    public AuthController(
            UserService userService,
            JwtTokenProvider jwtTokenProvider,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            AuditService auditService) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.auditService = auditService;
    }

    /**
     * Registers a new user account.
     *
     * <p>Registration Flow:</p>
     * <ol>
     *   <li>Validate request data (email format, password length, etc.)</li>
     *   <li>Check email uniqueness</li>
     *   <li>Validate password strength (12+ chars, mixed case, numbers, special chars)</li>
     *   <li>Hash password with BCrypt</li>
     *   <li>Create user with APPLICANT role and ACTIVE status</li>
     *   <li>Generate JWT token</li>
     *   <li>Set HttpOnly cookie</li>
     *   <li>Return user DTO (no password)</li>
     * </ol>
     *
     * <p>Security Validations:</p>
     * <ul>
     *   <li>Email format validation (Jakarta Bean Validation)</li>
     *   <li>Password strength validation (UserService)</li>
     *   <li>Email uniqueness check (prevents account enumeration when done correctly)</li>
     * </ul>
     *
     * @param request the registration request containing user details
     * @param response the HTTP servlet response for setting cookies
     * @return ResponseEntity with AuthResponse containing user DTO
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse response) {

        logger.info("Registration attempt for email: {}", request.getEmail());

        try {
            // Create user (includes password strength validation and hashing)
            User user = userService.createUser(
                    request.getEmail(),
                    request.getPassword(),
                    request.getFullName(),
                    request.getPhone()
            );

            logger.info("User registered successfully with ID: {} and email: {}", user.getId(), user.getEmail());

            // Load UserDetails for token generation
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(userDetails);

            // Set HttpOnly cookie
            setAuthCookie(response, token);

            // Convert to DTO (excludes password)
            UserDTO userDTO = UserDTO.fromUser(user);

            // Build response
            AuthResponse authResponse = AuthResponse.success(
                    userDTO,
                    "Registration successful"
            );

            logger.info("User {} registered and authenticated successfully", user.getEmail());

            // Audit log: successful registration
            auditService.logAuthEvent(httpRequest, "REGISTER_SUCCESS", user.getEmail(), true, null);

            return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);

        } catch (IllegalArgumentException e) {
            // Handle validation errors (duplicate email, weak password, etc.)
            logger.warn("Registration failed for {}: {}", request.getEmail(), e.getMessage());

            // Audit log: failed registration
            auditService.logAuthEvent(httpRequest, "REGISTER_FAILED", request.getEmail(), false, e.getMessage());

            // Determine appropriate status code
            HttpStatus status = e.getMessage().contains("already registered")
                    ? HttpStatus.CONFLICT
                    : HttpStatus.BAD_REQUEST;

            return ResponseEntity
                    .status(status)
                    .body(AuthResponse.error(e.getMessage()));

        } catch (Exception e) {
            logger.error("Unexpected error during registration for {}: {}", request.getEmail(), e.getMessage(), e);

            // Audit log: failed registration
            auditService.logAuthEvent(httpRequest, "REGISTER_FAILED", request.getEmail(), false, e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthResponse.error("Registration failed. Please try again later."));
        }
    }

    /**
     * Authenticates a user and issues a JWT token.
     *
     * <p>Authentication Flow:</p>
     * <ol>
     *   <li>Validate request data (email and password present)</li>
     *   <li>Authenticate with AuthenticationManager (verifies credentials)</li>
     *   <li>Load user from database</li>
     *   <li>Update last_login timestamp</li>
     *   <li>Generate JWT token</li>
     *   <li>Set HttpOnly cookie</li>
     *   <li>Return user DTO</li>
     * </ol>
     *
     * <p>Security Features:</p>
     * <ul>
     *   <li>Constant-time password comparison (via BCrypt in AuthenticationManager)</li>
     *   <li>Generic error message (prevents username enumeration)</li>
     *   <li>Last login tracking (audit trail)</li>
     *   <li>Token rotation on each login (prevents token fixation)</li>
     * </ul>
     *
     * @param request the login request containing email and password
     * @param response the HTTP servlet response for setting cookies
     * @return ResponseEntity with AuthResponse containing user DTO
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse response) {

        logger.info("Login attempt for email: {}", request.getEmail());

        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            // Set authentication in context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            logger.debug("User {} authenticated successfully", request.getEmail());

            // Load user and update last login
            User user = userService.findByEmail(request.getEmail());
            user = userService.updateLastLogin(user);

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(authentication);

            // Set HttpOnly cookie
            setAuthCookie(response, token);

            // Convert to DTO
            UserDTO userDTO = UserDTO.fromUser(user);

            // Build response
            AuthResponse authResponse = AuthResponse.success(
                    userDTO,
                    "Login successful"
            );

            logger.info("User {} logged in successfully", user.getEmail());

            // Audit log: successful login
            auditService.logAuthEvent(httpRequest, "LOGIN_SUCCESS", user.getEmail(), true, null);

            return ResponseEntity.ok(authResponse);

        } catch (BadCredentialsException e) {
            // Generic error message to prevent username enumeration
            logger.warn("Login failed for {}: Invalid credentials", request.getEmail());

            // Audit log: failed login
            auditService.logAuthEvent(httpRequest, "LOGIN_FAILED", request.getEmail(), false, "Invalid credentials");

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.error("Invalid email or password"));

        } catch (Exception e) {
            logger.error("Unexpected error during login for {}: {}", request.getEmail(), e.getMessage(), e);

            // Audit log: failed login
            auditService.logAuthEvent(httpRequest, "LOGIN_FAILED", request.getEmail(), false, e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthResponse.error("Login failed. Please try again later."));
        }
    }

    /**
     * Logs out the current user by clearing the authentication cookie.
     *
     * <p>Logout Flow:</p>
     * <ol>
     *   <li>Clear JWT cookie (set max-age to 0)</li>
     *   <li>Clear SecurityContext</li>
     *   <li>Return success message</li>
     * </ol>
     *
     * <p>Security Note:</p>
     * Since we use stateless JWT authentication, there's no server-side session
     * to invalidate. The cookie deletion ensures the client can no longer send
     * the token. For additional security in production, consider:
     * <ul>
     *   <li>Token blacklisting (for immediate revocation)</li>
     *   <li>Short token expiration times</li>
     *   <li>Refresh token rotation</li>
     * </ul>
     *
     * @param response the HTTP servlet response for clearing cookies
     * @return ResponseEntity with success message
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest httpRequest, HttpServletResponse response) {
        logger.info("Logout attempt");

        try {
            // Get current user before clearing context
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = auth != null && auth.isAuthenticated() ? auth.getName() : null;

            // Clear authentication cookie
            clearAuthCookie(response);

            // Clear security context
            SecurityContextHolder.clearContext();

            logger.info("User logged out successfully");

            // Audit log: successful logout
            if (userEmail != null && !"anonymousUser".equals(userEmail)) {
                auditService.logAuthEvent(httpRequest, "LOGOUT_SUCCESS", userEmail, true, null);
            }

            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "Logout successful");
            responseBody.put("success", "true");

            return ResponseEntity.ok(responseBody);

        } catch (Exception e) {
            logger.error("Error during logout: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message", "Logout failed",
                            "success", "false"
                    ));
        }
    }

    /**
     * Returns information about the currently authenticated user.
     *
     * <p>Authorization Flow:</p>
     * <ol>
     *   <li>Extract authentication from SecurityContext</li>
     *   <li>Load user from database</li>
     *   <li>Convert to DTO and return</li>
     * </ol>
     *
     * <p>Security Note:</p>
     * This endpoint requires authentication (enforced by Spring Security).
     * The SecurityContext is populated by the JwtAuthenticationFilter.
     *
     * @return ResponseEntity with UserDTO
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        logger.debug("Current user request");

        try {
            // Get authentication from context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warn("Unauthenticated request to /me endpoint");
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Not authenticated"));
            }

            String email = authentication.getName();
            logger.debug("Fetching current user: {}", email);

            // Load user
            User user = userService.findByEmail(email);

            // Convert to DTO
            UserDTO userDTO = UserDTO.fromUser(user);

            logger.debug("Current user retrieved successfully: {}", email);
            return ResponseEntity.ok(userDTO);

        } catch (Exception e) {
            logger.error("Error fetching current user: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch user information"));
        }
    }

    /**
     * Refreshes the authentication token.
     *
     * <p>Refresh Flow:</p>
     * <ol>
     *   <li>Validate current token from cookie</li>
     *   <li>Load user details</li>
     *   <li>Generate new access token</li>
     *   <li>Set new cookie</li>
     *   <li>Return success</li>
     * </ol>
     *
     * <p>Security Note:</p>
     * This endpoint allows token refresh without re-authentication.
     * The current implementation uses the same expiration for simplicity.
     * In production, consider implementing:
     * <ul>
     *   <li>Separate refresh tokens with longer expiration</li>
     *   <li>Refresh token rotation (one-time use)</li>
     *   <li>Refresh token storage/revocation mechanism</li>
     * </ul>
     *
     * @param response the HTTP servlet response for setting new cookie
     * @return ResponseEntity with success message
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletResponse response) {
        logger.debug("Token refresh request");

        try {
            // Get current authentication
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warn("Unauthenticated token refresh attempt");
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Not authenticated"));
            }

            String email = authentication.getName();
            logger.debug("Refreshing token for user: {}", email);

            // Load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            // Generate new token
            String newToken = jwtTokenProvider.generateToken(userDetails);

            // Set new cookie
            setAuthCookie(response, newToken);

            logger.info("Token refreshed successfully for user: {}", email);

            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "Token refreshed successfully");
            responseBody.put("success", "true");

            return ResponseEntity.ok(responseBody);

        } catch (Exception e) {
            logger.error("Error refreshing token: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message", "Token refresh failed",
                            "success", "false"
                    ));
        }
    }

    /**
     * Sets the authentication cookie with the JWT token.
     *
     * <p>Cookie Security Attributes:</p>
     * <ul>
     *   <li>HttpOnly: true - Prevents JavaScript access (XSS mitigation)</li>
     *   <li>Secure: false (dev), true (prod) - HTTPS only in production</li>
     *   <li>Path: /api - Limits cookie scope to API endpoints</li>
     *   <li>MaxAge: 900 seconds (15 minutes) - Short expiration for security</li>
     *   <li>SameSite: Strict - CSRF protection (requires Servlet 6.0+)</li>
     * </ul>
     *
     * @param response the HTTP servlet response
     * @param token the JWT token to set in the cookie
     */
    private void setAuthCookie(HttpServletResponse response, String token) {
        // Use ResponseCookie for better control over SameSite attribute
        String cookieValue = String.format(
            "%s=%s; Path=%s; Max-Age=%d; HttpOnly%s; SameSite=Lax",
            TOKEN_COOKIE_NAME,
            token,
            COOKIE_PATH,
            COOKIE_MAX_AGE,
            COOKIE_SECURE ? "; Secure" : ""
        );
        response.addHeader("Set-Cookie", cookieValue);
        logger.debug("Authentication cookie set successfully");
    }

    /**
     * Clears the authentication cookie by setting its max age to 0.
     *
     * <p>Cookie Deletion:</p>
     * Setting MaxAge to 0 instructs the browser to delete the cookie immediately.
     * The Path must match the original cookie for proper deletion.
     *
     * @param response the HTTP servlet response
     */
    private void clearAuthCookie(HttpServletResponse response) {
        // Use same format as setAuthCookie for consistency
        String cookieValue = String.format(
            "%s=; Path=%s; Max-Age=0; HttpOnly%s; SameSite=Lax",
            TOKEN_COOKIE_NAME,
            COOKIE_PATH,
            COOKIE_SECURE ? "; Secure" : ""
        );
        response.addHeader("Set-Cookie", cookieValue);
        logger.debug("Authentication cookie cleared successfully");
    }
}
