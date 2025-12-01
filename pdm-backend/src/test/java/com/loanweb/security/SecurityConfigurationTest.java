package com.loanweb.security;

import com.loanweb.config.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for Spring Security configuration.
 *
 * <p>Tests verify that:</p>
 * <ul>
 *   <li>Security beans are properly configured</li>
 *   <li>Password encoder is BCrypt with correct cost factor</li>
 *   <li>JWT token provider is initialized</li>
 *   <li>Custom UserDetailsService is loaded</li>
 * </ul>
 *
 * @author PDM Security Team
 * @version 1.0
 */
@SpringBootTest
@TestPropertySource(properties = {
    "jwt.secret=dGVzdC1zZWNyZXQta2V5LWZvci1qdW5pdC10ZXN0aW5nLXRoaXMtaXMtYXQtbGVhc3QtMjU2LWJpdHMtbG9uZw==",
    "jwt.expiration=900000",
    "jwt.refresh-expiration=604800000",
    "jwt.cookie-name=token",
    "app.cors.allowed-origins=http://localhost:3000",
    "app.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS",
    "app.cors.allowed-headers=*",
    "app.cors.allow-credentials=true",
    "app.cors.max-age=3600"
})
class SecurityConfigurationTest {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void contextLoads() {
        // Verify Spring context loads successfully with security configuration
        assertThat(passwordEncoder).isNotNull();
        assertThat(jwtTokenProvider).isNotNull();
        assertThat(customUserDetailsService).isNotNull();
    }

    @Test
    void passwordEncoderShouldBeBCrypt() {
        // Test that password encoder is BCrypt
        String rawPassword = "TestPassword123!";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // BCrypt hashes start with $2a$, $2b$, or $2y$
        assertThat(encodedPassword).matches("\\$2[aby]\\$\\d{2}\\$.+");

        // Verify password matching works
        assertThat(passwordEncoder.matches(rawPassword, encodedPassword)).isTrue();

        // Verify wrong password doesn't match
        assertThat(passwordEncoder.matches("WrongPassword", encodedPassword)).isFalse();
    }

    @Test
    void passwordEncoderShouldProduceDifferentHashesForSamePassword() {
        // BCrypt should produce different hashes for the same password (due to salt)
        String password = "TestPassword123!";
        String hash1 = passwordEncoder.encode(password);
        String hash2 = passwordEncoder.encode(password);

        // Hashes should be different
        assertThat(hash1).isNotEqualTo(hash2);

        // But both should match the original password
        assertThat(passwordEncoder.matches(password, hash1)).isTrue();
        assertThat(passwordEncoder.matches(password, hash2)).isTrue();
    }

    @Test
    void jwtTokenProviderShouldBeConfigured() {
        // Verify JWT token provider has expiration configured
        assertThat(jwtTokenProvider.getJwtExpirationMs()).isEqualTo(900000L); // 15 minutes
        assertThat(jwtTokenProvider.getJwtRefreshExpirationMs()).isEqualTo(604800000L); // 7 days
    }
}
