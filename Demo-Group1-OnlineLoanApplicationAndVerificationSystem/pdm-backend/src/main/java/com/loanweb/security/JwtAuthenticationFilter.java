package com.loanweb.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * JWT Authentication Filter that extracts and validates JWT tokens from HttpOnly cookies.
 *
 * <p>Filter Responsibilities:</p>
 * <ul>
 *   <li>Extract JWT token from HttpOnly cookie</li>
 *   <li>Validate token signature and expiration</li>
 *   <li>Load user details from database</li>
 *   <li>Set Spring Security authentication context</li>
 *   <li>Skip filtering for public endpoints</li>
 * </ul>
 *
 * <p>Security Features:</p>
 * <ul>
 *   <li>HttpOnly cookie prevents XSS token theft</li>
 *   <li>SameSite=Strict prevents CSRF attacks</li>
 *   <li>Secure flag ensures HTTPS transmission</li>
 *   <li>Token validation on every request</li>
 *   <li>Graceful handling of invalid/expired tokens</li>
 * </ul>
 *
 * <p>Authentication Flow:</p>
 * <ol>
 *   <li>Check if endpoint is public (skip filter)</li>
 *   <li>Extract JWT from "token" cookie</li>
 *   <li>Validate JWT signature and expiration</li>
 *   <li>Extract username from token claims</li>
 *   <li>Load UserDetails from database</li>
 *   <li>Create authentication token</li>
 *   <li>Set authentication in SecurityContext</li>
 * </ol>
 *
 * @author PDM Security Team
 * @version 1.0
 * @since 2025-01-27
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @Value("${jwt.cookie-name}")
    private String cookieName;

    /**
     * List of public endpoints that should bypass JWT authentication.
     * These endpoints are accessible without authentication.
     */
    private static final List<String> PUBLIC_ENDPOINTS = Arrays.asList(
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/refresh",
        "/api/public",
        "/actuator/health",
        "/error"
    );

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider,
                                   CustomUserDetailsService customUserDetailsService) {
        this.tokenProvider = tokenProvider;
        this.customUserDetailsService = customUserDetailsService;
    }

    /**
     * Filters incoming requests to authenticate users via JWT tokens.
     *
     * <p>Filter Logic:</p>
     * <ol>
     *   <li>Check if request path is public (skip if true)</li>
     *   <li>Extract JWT from cookie</li>
     *   <li>Validate token and set authentication</li>
     *   <li>Continue filter chain</li>
     * </ol>
     *
     * <p>Error Handling:</p>
     * If token validation fails, the request continues without authentication.
     * Spring Security will handle authorization failure at the controller level.
     * This prevents filter-level exceptions from breaking the request flow.
     *
     * @param request the HTTP request
     * @param response the HTTP response
     * @param filterChain the filter chain
     * @throws ServletException if servlet processing fails
     * @throws IOException if I/O error occurs
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                   @NonNull HttpServletResponse response,
                                   @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String requestPath = request.getRequestURI();
        logger.debug("Processing request: {} {}", request.getMethod(), requestPath);

        try {
            // Skip JWT authentication for public endpoints
            if (isPublicEndpoint(requestPath)) {
                logger.debug("Skipping JWT authentication for public endpoint: {}", requestPath);
                filterChain.doFilter(request, response);
                return;
            }

            // Extract JWT token from HttpOnly cookie
            String jwt = getJwtFromCookie(request);

            // Validate token and set authentication context
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String username = tokenProvider.getUsernameFromToken(jwt);
                logger.debug("Valid JWT found for user: {}", username);

                // Load user details from database
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

                // Create authentication token
                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );

                // Set additional details (IP address, session ID, etc.)
                authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // Set authentication in SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.debug("Authentication set for user: {}", username);
            } else {
                logger.debug("No valid JWT token found in request");
            }

        } catch (Exception ex) {
            logger.error("Cannot set user authentication: {}", ex.getMessage(), ex);
            // Don't throw exception - let Spring Security handle unauthorized access
        }

        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }

    /**
     * Extracts JWT token from HttpOnly cookie.
     *
     * <p>Cookie Security Properties:</p>
     * <ul>
     *   <li>Name: "token" (configurable)</li>
     *   <li>HttpOnly: true (prevents JavaScript access)</li>
     *   <li>Secure: true (HTTPS only in production)</li>
     *   <li>SameSite: Strict (CSRF protection)</li>
     * </ul>
     *
     * @param request the HTTP request
     * @return the JWT token, or null if not found
     */
    private String getJwtFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieName.equals(cookie.getName())) {
                    String token = cookie.getValue();
                    logger.debug("JWT token extracted from cookie: {}", cookieName);
                    return token;
                }
            }
        }

        logger.debug("No JWT cookie found with name: {}", cookieName);
        return null;
    }

    /**
     * Checks if the request path is a public endpoint that doesn't require authentication.
     *
     * @param requestPath the request URI path
     * @return true if endpoint is public, false otherwise
     */
    private boolean isPublicEndpoint(String requestPath) {
        return PUBLIC_ENDPOINTS.stream()
            .anyMatch(requestPath::startsWith);
    }

    /**
     * Alternative method to extract JWT from Authorization header (Bearer token).
     * This is kept as a fallback mechanism but the primary method uses HttpOnly cookies.
     *
     * @param request the HTTP request
     * @return the JWT token, or null if not found
     */
    @SuppressWarnings("unused")
    private String getJwtFromAuthorizationHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        return null;
    }
}
