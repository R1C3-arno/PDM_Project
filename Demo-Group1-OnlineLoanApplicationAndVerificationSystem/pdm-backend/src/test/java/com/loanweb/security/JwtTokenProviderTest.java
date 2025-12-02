package com.loanweb.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.TestPropertySource;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
@TestPropertySource(properties = {
    "jwt.secret=dGVzdC1zZWNyZXQta2V5LXRoYXQtaXMtc3VmZmljaWVudGx5LWxvbmctZm9yLUhTMjU2LWFsZ29yaXRobS0zMi1ieXRlcw==",
    "jwt.expiration=900000",
    "jwt.refresh-expiration=604800000"
})
@DisplayName("JwtTokenProvider Tests")
class JwtTokenProviderTest {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private UserDetails testUserDetails;
    private Authentication testAuthentication;

    @BeforeEach
    void setUp() {
        testUserDetails = User.builder()
                .username("test@example.com")
                .password("encoded_password")
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_APPLICANT")))
                .build();

        testAuthentication = mock(Authentication.class);
        when(testAuthentication.getPrincipal()).thenReturn(testUserDetails);
    }

    @Test
    @DisplayName("Should generate valid JWT token from UserDetails")
    void testGenerateTokenFromUserDetails() {
        String token = jwtTokenProvider.generateToken(testUserDetails);
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        assertThat(token.split("\\.")).hasSize(3);
    }

    @Test
    @DisplayName("Should generate valid JWT token from Authentication")
    void testGenerateTokenFromAuthentication() {
        String token = jwtTokenProvider.generateToken(testAuthentication);
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
    }

    @Test
    @DisplayName("Should extract username from valid token")
    void testGetUsernameFromToken() {
        String token = jwtTokenProvider.generateToken(testUserDetails);
        String username = jwtTokenProvider.getUsernameFromToken(token);
        assertThat(username).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("Should extract email from valid token")
    void testGetEmailFromToken() {
        String token = jwtTokenProvider.generateToken(testUserDetails);
        String email = jwtTokenProvider.getEmailFromToken(token);
        assertThat(email).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("Should extract role from valid token")
    void testGetRoleFromToken() {
        String token = jwtTokenProvider.generateToken(testUserDetails);
        String role = jwtTokenProvider.getRoleFromToken(token);
        assertThat(role).isEqualTo("ROLE_APPLICANT");
    }

    @Test
    @DisplayName("Should validate correct token successfully")
    void testValidateTokenSuccess() {
        String token = jwtTokenProvider.generateToken(testUserDetails);
        boolean isValid = jwtTokenProvider.validateToken(token);
        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("Should reject token with invalid signature")
    void testValidateTokenInvalidSignature() {
        String invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIn0.invalid_signature";
        boolean isValid = jwtTokenProvider.validateToken(invalidToken);
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("Should reject malformed token")
    void testValidateTokenMalformed() {
        String malformedToken = "not.a.valid.jwt.token";
        boolean isValid = jwtTokenProvider.validateToken(malformedToken);
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("Should reject empty token")
    void testValidateTokenEmpty() {
        boolean isValid = jwtTokenProvider.validateToken("");
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("Should reject null token")
    void testValidateTokenNull() {
        boolean isValid = jwtTokenProvider.validateToken(null);
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("Should detect non-expired token")
    void testTokenNotExpired() {
        String token = jwtTokenProvider.generateToken(testUserDetails);
        boolean isExpired = jwtTokenProvider.isTokenExpired(token);
        assertThat(isExpired).isFalse();
    }

    @Test
    @DisplayName("Should generate different tokens for different users")
    void testGenerateDifferentTokensForDifferentUsers() {
        UserDetails user1 = User.builder()
                .username("user1@example.com")
                .password("password1")
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_APPLICANT")))
                .build();

        UserDetails user2 = User.builder()
                .username("user2@example.com")
                .password("password2")
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_APPLICANT")))
                .build();

        String token1 = jwtTokenProvider.generateToken(user1);
        String token2 = jwtTokenProvider.generateToken(user2);

        assertThat(token1).isNotEqualTo(token2);
        assertThat(jwtTokenProvider.getUsernameFromToken(token1)).isEqualTo("user1@example.com");
        assertThat(jwtTokenProvider.getUsernameFromToken(token2)).isEqualTo("user2@example.com");
    }
}
