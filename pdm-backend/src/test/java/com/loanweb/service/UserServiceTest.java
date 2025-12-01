package com.loanweb.service;

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
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

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
                .build();
    }

    @Test
    @DisplayName("Should create user with valid data")
    void testCreateUserSuccess() {
        String rawPassword = "SecurePass123!";
        String hashedPassword = "$2a$12$hashedPassword";

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(rawPassword)).thenReturn(hashedPassword);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User created = userService.createUser("test@example.com", rawPassword, "Test User", "1234567890");

        assertThat(created).isNotNull();
        assertThat(created.getEmail()).isEqualTo("test@example.com");
        assertThat(created.getRole()).isEqualTo(UserRole.APPLICANT);
        assertThat(created.getStatus()).isEqualTo(UserStatus.ACTIVE);

        verify(userRepository).existsByEmail("test@example.com");
        verify(passwordEncoder).encode(rawPassword);
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when email already exists")
    void testCreateUserDuplicateEmail() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.createUser("test@example.com", "Password123!", "Test", "123"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email already registered");

        verify(userRepository).existsByEmail("test@example.com");
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw exception for weak password - too short")
    void testCreateUserWeakPasswordTooShort() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);

        assertThatThrownBy(() -> userService.createUser("test@example.com", "Short1!", "Test", "123"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("at least 12 characters");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw exception for weak password - no uppercase")
    void testCreateUserWeakPasswordNoUppercase() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);

        assertThatThrownBy(() -> userService.createUser("test@example.com", "lowercase123!", "Test", "123"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("uppercase letter");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw exception for weak password - no lowercase")
    void testCreateUserWeakPasswordNoLowercase() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);

        assertThatThrownBy(() -> userService.createUser("test@example.com", "UPPERCASE123!", "Test", "123"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("lowercase letter");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw exception for weak password - no digit")
    void testCreateUserWeakPasswordNoDigit() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);

        assertThatThrownBy(() -> userService.createUser("test@example.com", "NoDigitsHere!", "Test", "123"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("digit");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw exception for weak password - no special character")
    void testCreateUserWeakPasswordNoSpecialChar() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);

        assertThatThrownBy(() -> userService.createUser("test@example.com", "NoSpecial123", "Test", "123"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("special character");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should update last login timestamp")
    void testUpdateLastLogin() {
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User updated = userService.updateLastLogin(testUser);

        assertThat(updated).isNotNull();
        assertThat(updated.getLastLogin()).isNotNull();
        verify(userRepository).save(testUser);
    }

    @Test
    @DisplayName("Should find user by email")
    void testFindByEmail() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        User found = userService.findByEmail("test@example.com");

        assertThat(found).isNotNull();
        assertThat(found.getEmail()).isEqualTo("test@example.com");
        verify(userRepository).findByEmail("test@example.com");
    }

    @Test
    @DisplayName("Should throw exception when user not found by email")
    void testFindByEmailNotFound() {
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.findByEmail("nonexistent@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("Should find user by ID")
    void testFindById() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        User found = userService.findById(1L);

        assertThat(found).isNotNull();
        assertThat(found.getId()).isEqualTo(1L);
        verify(userRepository).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when user not found by ID")
    void testFindByIdNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.findById(999L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("Should check if email exists")
    void testEmailExists() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        boolean exists = userService.emailExists("test@example.com");

        assertThat(exists).isTrue();
        verify(userRepository).existsByEmail("test@example.com");
    }

    @Test
    @DisplayName("Should return false when email does not exist")
    void testEmailDoesNotExist() {
        when(userRepository.existsByEmail("nonexistent@example.com")).thenReturn(false);

        boolean exists = userService.emailExists("nonexistent@example.com");

        assertThat(exists).isFalse();
    }
}
