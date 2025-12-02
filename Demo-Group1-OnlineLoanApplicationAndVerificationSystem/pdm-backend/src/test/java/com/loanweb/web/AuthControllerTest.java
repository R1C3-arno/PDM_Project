package com.loanweb.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loanweb.domain.user.User;
import com.loanweb.domain.user.UserRole;
import com.loanweb.domain.user.UserStatus;
import com.loanweb.dto.auth.LoginRequest;
import com.loanweb.dto.auth.RegisterRequest;
import com.loanweb.security.JwtTokenProvider;
import com.loanweb.service.UserService;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for AuthController.
 * Tests authentication endpoints including registration, login, logout, and token management.
 */
@WebMvcTest(AuthController.class)
@DisplayName("AuthController Tests")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private UserDetailsService userDetailsService;

    private User testUser;
    private UserDetails testUserDetails;
    private String testToken;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("$2a$12$hashedPassword")
                .fullName("Test User")
                .phone("1234567890")
                .role(UserRole.APPLICANT)
                .status(UserStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();

        testUserDetails = org.springframework.security.core.userdetails.User.builder()
                .username(testUser.getEmail())
                .password(testUser.getPassword())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_APPLICANT")))
                .build();

        testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token";
    }

    @Test
    @DisplayName("Should register user successfully with valid data")
    void testRegisterSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("newuser@example.com");
        request.setPassword("SecurePass123!");
        request.setFullName("New User");
        request.setPhone("9876543210");

        when(userService.createUser(anyString(), anyString(), anyString(), anyString()))
                .thenReturn(testUser);
        when(userDetailsService.loadUserByUsername(anyString()))
                .thenReturn(testUserDetails);
        when(jwtTokenProvider.generateToken(any(UserDetails.class)))
                .thenReturn(testToken);

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.user.email").value(testUser.getEmail()))
                .andExpect(jsonPath("$.user.fullName").value(testUser.getFullName()))
                .andExpect(jsonPath("$.user.password").doesNotExist())
                .andReturn();

        // Verify JWT cookie is set
        Cookie[] cookies = result.getResponse().getCookies();
        assertThat(cookies).isNotEmpty();
        Cookie tokenCookie = findCookieByName(cookies, "token");
        assertThat(tokenCookie).isNotNull();
        assertThat(tokenCookie.getValue()).isEqualTo(testToken);
        assertThat(tokenCookie.isHttpOnly()).isTrue();
        assertThat(tokenCookie.getPath()).isEqualTo("/api");

        verify(userService).createUser(
                request.getEmail(),
                request.getPassword(),
                request.getFullName(),
                request.getPhone()
        );
        verify(jwtTokenProvider).generateToken(any(UserDetails.class));
    }

    @Test
    @DisplayName("Should return 409 Conflict when registering with duplicate email")
    void testRegisterDuplicateEmail() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");
        request.setPassword("SecurePass123!");
        request.setFullName("Test User");
        request.setPhone("1234567890");

        when(userService.createUser(anyString(), anyString(), anyString(), anyString()))
                .thenThrow(new IllegalArgumentException("Email already registered"));

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email already registered"));

        verify(userService).createUser(anyString(), anyString(), anyString(), anyString());
        verify(jwtTokenProvider, never()).generateToken(any(UserDetails.class));
        verify(jwtTokenProvider, never()).generateToken(any(Authentication.class));
    }

    @Test
    @DisplayName("Should return 400 Bad Request when registering with weak password")
    void testRegisterWeakPassword() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("newuser@example.com");
        request.setPassword("weak");
        request.setFullName("New User");
        request.setPhone("1234567890");

        when(userService.createUser(anyString(), anyString(), anyString(), anyString()))
                .thenThrow(new IllegalArgumentException("Password must be at least 12 characters long"));

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Password must be at least 12 characters long"));

        verify(jwtTokenProvider, never()).generateToken(any(UserDetails.class));
        verify(jwtTokenProvider, never()).generateToken(any(Authentication.class));
    }

    @Test
    @DisplayName("Should login successfully with valid credentials")
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("SecurePass123!");

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                testUserDetails,
                "SecurePass123!",
                testUserDetails.getAuthorities()
        );

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userService.findByEmail(anyString()))
                .thenReturn(testUser);
        when(userService.updateLastLogin(any(User.class)))
                .thenReturn(testUser);
        when(jwtTokenProvider.generateToken(any(Authentication.class)))
                .thenReturn(testToken);

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.user.email").value(testUser.getEmail()))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andReturn();

        // Verify JWT cookie is set
        Cookie[] cookies = result.getResponse().getCookies();
        Cookie tokenCookie = findCookieByName(cookies, "token");
        assertThat(tokenCookie).isNotNull();
        assertThat(tokenCookie.getValue()).isEqualTo(testToken);

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userService).updateLastLogin(any(User.class));
    }

    @Test
    @DisplayName("Should return 401 Unauthorized with invalid credentials")
    void testLoginInvalidCredentials() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("WrongPassword123!");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid email or password"));

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userService, never()).updateLastLogin(any());
        verify(jwtTokenProvider, never()).generateToken(any(Authentication.class));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    @DisplayName("Should return current user information when authenticated")
    void testGetCurrentUser() throws Exception {
        when(userService.findByEmail(anyString()))
                .thenReturn(testUser);

        mockMvc.perform(get("/api/auth/me")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(testUser.getEmail()))
                .andExpect(jsonPath("$.fullName").value(testUser.getFullName()))
                .andExpect(jsonPath("$.role").value(testUser.getRole().toString()))
                .andExpect(jsonPath("$.password").doesNotExist());

        verify(userService).findByEmail("test@example.com");
    }

    @Test
    @DisplayName("Should logout successfully and clear cookie")
    void testLogoutSuccess() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/logout")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logout successful"))
                .andExpect(jsonPath("$.success").value("true"))
                .andReturn();

        // Verify cookie is cleared
        Cookie[] cookies = result.getResponse().getCookies();
        Cookie tokenCookie = findCookieByName(cookies, "token");
        assertThat(tokenCookie).isNotNull();
        assertThat(tokenCookie.getMaxAge()).isEqualTo(0); // Cookie deleted
    }

    @Test
    @WithMockUser(username = "test@example.com")
    @DisplayName("Should refresh token successfully when authenticated")
    void testRefreshToken() throws Exception {
        when(userDetailsService.loadUserByUsername(anyString()))
                .thenReturn(testUserDetails);
        when(jwtTokenProvider.generateToken(any(UserDetails.class)))
                .thenReturn(testToken);

        MvcResult result = mockMvc.perform(post("/api/auth/refresh")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Token refreshed successfully"))
                .andExpect(jsonPath("$.success").value("true"))
                .andReturn();

        // Verify new cookie is set
        Cookie[] cookies = result.getResponse().getCookies();
        Cookie tokenCookie = findCookieByName(cookies, "token");
        assertThat(tokenCookie).isNotNull();
        assertThat(tokenCookie.getValue()).isEqualTo(testToken);

        verify(jwtTokenProvider).generateToken(any(UserDetails.class));
    }

    @Test
    @DisplayName("Should return 401 when refreshing token without authentication")
    void testRefreshTokenUnauthenticated() throws Exception {
        mockMvc.perform(post("/api/auth/refresh")
                        .with(csrf()))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Not authenticated"));

        verify(jwtTokenProvider, never()).generateToken(any(UserDetails.class));
        verify(jwtTokenProvider, never()).generateToken(any(Authentication.class));
    }

    private Cookie findCookieByName(Cookie[] cookies, String name) {
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(name)) {
                return cookie;
            }
        }
        return null;
    }
}
