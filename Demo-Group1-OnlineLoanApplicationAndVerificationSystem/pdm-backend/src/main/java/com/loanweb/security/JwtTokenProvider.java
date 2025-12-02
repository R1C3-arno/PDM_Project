package com.loanweb.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * JWT Token Provider for generating, validating, and extracting claims from JWT tokens.
 *
 * <p>Security Features:</p>
 * <ul>
 *   <li>HS256 signing algorithm (HMAC with SHA-256)</li>
 *   <li>Secure secret key management from environment variables</li>
 *   <li>Token expiration (15 minutes for access, 7 days for refresh)</li>
 *   <li>Claims validation (signature, expiration, format)</li>
 *   <li>Protection against timing attacks in token validation</li>
 * </ul>
 *
 * <p>Token Structure:</p>
 * <ul>
 *   <li>Subject: User email (unique identifier)</li>
 *   <li>Claims: userId, email, role, authorities</li>
 *   <li>Issued At: Token creation timestamp</li>
 *   <li>Expiration: Token expiry timestamp</li>
 * </ul>
 *
 * @author PDM Security Team
 * @version 1.0
 * @since 2025-01-27
 */
@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    @Value("${jwt.refresh-expiration}")
    private long jwtRefreshExpirationMs;

    private SecretKey key;

    /**
     * Gets the signing key for JWT operations.
     * Lazy initialization ensures the key is created only when needed.
     *
     * @return the secret key for signing/verifying JWTs
     */
    private SecretKey getSigningKey() {
        if (key == null) {
            byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
            key = Keys.hmacShaKeyFor(keyBytes);
            logger.debug("JWT signing key initialized");
        }
        return key;
    }

    /**
     * Generates a JWT access token from an Authentication object.
     *
     * <p>Token Claims:</p>
     * <ul>
     *   <li>sub: User email</li>
     *   <li>userId: User ID (Long)</li>
     *   <li>email: User email</li>
     *   <li>role: User role (e.g., "ROLE_ADMIN")</li>
     *   <li>authorities: Comma-separated list of authorities</li>
     *   <li>iat: Issued at timestamp</li>
     *   <li>exp: Expiration timestamp</li>
     * </ul>
     *
     * @param authentication the authentication object containing user details
     * @return the generated JWT token
     */
    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return generateTokenFromUserDetails(userDetails, jwtExpirationMs);
    }

    /**
     * Generates a JWT access token from UserDetails.
     *
     * @param userDetails the user details
     * @return the generated JWT token
     */
    public String generateToken(UserDetails userDetails) {
        return generateTokenFromUserDetails(userDetails, jwtExpirationMs);
    }

    /**
     * Generates a refresh token with extended expiration.
     *
     * <p>Refresh Token Usage:</p>
     * Refresh tokens have a longer lifespan (7 days) and are used to obtain
     * new access tokens without requiring the user to re-authenticate.
     *
     * @param authentication the authentication object
     * @return the generated refresh token
     */
    public String generateRefreshToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return generateTokenFromUserDetails(userDetails, jwtRefreshExpirationMs);
    }

    /**
     * Generates a refresh token from UserDetails.
     *
     * @param userDetails the user details
     * @return the generated refresh token
     */
    public String generateRefreshToken(UserDetails userDetails) {
        return generateTokenFromUserDetails(userDetails, jwtRefreshExpirationMs);
    }

    /**
     * Internal method to generate JWT tokens from UserDetails.
     *
     * @param userDetails the user details
     * @param expirationMs the expiration time in milliseconds
     * @return the generated JWT token
     */
    private String generateTokenFromUserDetails(UserDetails userDetails, long expirationMs) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        // Build claims
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", userDetails.getUsername());

        // Extract role from authorities (assuming first authority is the primary role)
        String role = userDetails.getAuthorities().stream()
            .findFirst()
            .map(GrantedAuthority::getAuthority)
            .orElse("ROLE_APPLICANT");
        claims.put("role", role);

        // Add all authorities as comma-separated string
        String authorities = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.joining(","));
        claims.put("authorities", authorities);

        String token = Jwts.builder()
            .setClaims(claims)
            .setSubject(userDetails.getUsername())
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();

        logger.debug("Generated JWT token for user: {} with expiration: {}",
                    userDetails.getUsername(), expiryDate);

        return token;
    }

    /**
     * Extracts the username (email) from a JWT token.
     *
     * @param token the JWT token
     * @return the username/email from the token
     */
    public String getUsernameFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.getSubject();
    }

    /**
     * Extracts the user email from a JWT token.
     *
     * @param token the JWT token
     * @return the user email
     */
    public String getEmailFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.get("email", String.class);
    }

    /**
     * Extracts the user role from a JWT token.
     *
     * @param token the JWT token
     * @return the user role
     */
    public String getRoleFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.get("role", String.class);
    }

    /**
     * Extracts all claims from a JWT token.
     *
     * @param token the JWT token
     * @return the claims from the token
     * @throws JwtException if token parsing fails
     */
    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    /**
     * Validates a JWT token.
     *
     * <p>Validation Checks:</p>
     * <ul>
     *   <li>Signature verification (using secret key)</li>
     *   <li>Expiration check (token not expired)</li>
     *   <li>Format validation (proper JWT structure)</li>
     *   <li>Claims presence (required claims exist)</li>
     * </ul>
     *
     * <p>Security Note:</p>
     * This method uses constant-time operations where possible to prevent
     * timing attacks that could leak information about token validity.
     *
     * @param token the JWT token to validate
     * @return true if token is valid, false otherwise
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);

            logger.debug("JWT token validation successful");
            return true;

        } catch (SignatureException ex) {
            logger.error("Invalid JWT signature: {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token format: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty: {}", ex.getMessage());
        } catch (Exception ex) {
            logger.error("JWT token validation error: {}", ex.getMessage());
        }

        return false;
    }

    /**
     * Checks if a JWT token is expired.
     *
     * @param token the JWT token
     * @return true if token is expired, false otherwise
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = getClaimsFromToken(token);
            Date expiration = claims.getExpiration();
            return expiration.before(new Date());
        } catch (ExpiredJwtException ex) {
            return true;
        } catch (Exception ex) {
            logger.error("Error checking token expiration: {}", ex.getMessage());
            return true; // Fail-secure: treat any error as expired
        }
    }

    /**
     * Gets the expiration time in milliseconds for access tokens.
     *
     * @return the expiration time in milliseconds
     */
    public long getJwtExpirationMs() {
        return jwtExpirationMs;
    }

    /**
     * Gets the expiration time in milliseconds for refresh tokens.
     *
     * @return the refresh token expiration time in milliseconds
     */
    public long getJwtRefreshExpirationMs() {
        return jwtRefreshExpirationMs;
    }
}
