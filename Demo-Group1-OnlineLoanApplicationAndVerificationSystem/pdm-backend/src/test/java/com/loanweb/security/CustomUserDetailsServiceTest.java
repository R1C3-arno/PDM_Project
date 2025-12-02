package com.loanweb.security;

import com.loanweb.domain.user.User;
import com.loanweb.domain.user.UserRepository;
import com.loanweb.domain.user.UserRole;
import com.loanweb.domain.user.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CustomUserDetailsService Tests")
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("$2a$12$hashedPassword")
                .fullName("Test User")
                .role(UserRole.APPLICANT)
                .status(UserStatus.ACTIVE)
                .build();
    }

    @Test
    @DisplayName("Should load user by username successfully")
    void testLoadUserByUsernameSuccess() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("test@example.com");

        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo("test@example.com");
        assertThat(userDetails.getPassword()).isEqualTo("$2a$12$hashedPassword");
        assertThat(userDetails.isEnabled()).isTrue();
        assertThat(userDetails.isAccountNonLocked()).isTrue();

        verify(userRepository).findByEmail("test@example.com");
    }

    @Test
    @DisplayName("Should throw exception when user not found by username")
    void testLoadUserByUsernameNotFound() {
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> customUserDetailsService.loadUserByUsername("nonexistent@example.com"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("User not found");

        verify(userRepository).findByEmail("nonexistent@example.com");
    }

    @Test
    @DisplayName("Should load user by ID successfully")
    void testLoadUserByIdSuccess() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        UserDetails userDetails = customUserDetailsService.loadUserById(1L);

        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo("test@example.com");

        verify(userRepository).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when user not found by ID")
    void testLoadUserByIdNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> customUserDetailsService.loadUserById(999L))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("Should map user role to authority with ROLE_ prefix")
    void testAuthorityMapping() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("test@example.com");

        assertThat(userDetails.getAuthorities())
                .hasSize(1)
                .extracting(GrantedAuthority::getAuthority)
                .containsExactly("ROLE_APPLICANT");
    }

    @Test
    @DisplayName("Should disable user when status is not ACTIVE")
    void testDisabledUserWhenNotActive() {
        User suspendedUser = User.builder()
                .id(2L)
                .email("suspended@example.com")
                .password("$2a$12$hashedPassword")
                .fullName("Suspended User")
                .role(UserRole.APPLICANT)
                .status(UserStatus.SUSPENDED)
                .build();

        when(userRepository.findByEmail("suspended@example.com")).thenReturn(Optional.of(suspendedUser));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("suspended@example.com");

        assertThat(userDetails.isAccountNonLocked()).isFalse();
    }

    @Test
    @DisplayName("Should check if user exists by email")
    void testUserExists() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        boolean exists = customUserDetailsService.userExists("test@example.com");

        assertThat(exists).isTrue();
        verify(userRepository).existsByEmail("test@example.com");
    }

    @Test
    @DisplayName("Should return false when user does not exist")
    void testUserDoesNotExist() {
        when(userRepository.existsByEmail("nonexistent@example.com")).thenReturn(false);

        boolean exists = customUserDetailsService.userExists("nonexistent@example.com");

        assertThat(exists).isFalse();
    }

    @Test
    @DisplayName("Should load admin user with ROLE_ADMIN authority")
    void testLoadAdminUser() {
        User adminUser = User.builder()
                .id(3L)
                .email("admin@example.com")
                .password("$2a$12$hashedPassword")
                .fullName("Admin User")
                .role(UserRole.ADMIN)
                .status(UserStatus.ACTIVE)
                .build();

        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(adminUser));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("admin@example.com");

        assertThat(userDetails.getAuthorities())
                .extracting(GrantedAuthority::getAuthority)
                .containsExactly("ROLE_ADMIN");
    }
}
