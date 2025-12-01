package com.loanweb.service;

import com.loanweb.domain.message.Message;
import com.loanweb.domain.message.MessageRepository;
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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthorizationService Tests")
class AuthorizationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthorizationService authorizationService;

    private User testUser;
    private User otherUser;
    private User adminUser;
    private UserDetails testUserDetails;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .fullName("Test User")
                .role(UserRole.APPLICANT)
                .status(UserStatus.ACTIVE)
                .build();

        otherUser = User.builder()
                .id(2L)
                .email("other@example.com")
                .fullName("Other User")
                .role(UserRole.APPLICANT)
                .status(UserStatus.ACTIVE)
                .build();

        adminUser = User.builder()
                .id(3L)
                .email("admin@example.com")
                .fullName("Admin User")
                .role(UserRole.ADMIN)
                .status(UserStatus.ACTIVE)
                .build();

        testUserDetails = org.springframework.security.core.userdetails.User.builder()
                .username("test@example.com")
                .password("encoded")
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_APPLICANT")))
                .build();

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(testUserDetails);
    }

    @Test
    @DisplayName("Should return true when user is sender of message")
    void testCanAccessMessageAsSender() {
        Message message = new Message();
        message.setId(1L);
        message.setSender(testUser);
        message.setRecipient(otherUser);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));

        boolean canAccess = authorizationService.canAccessMessage(1L, authentication);

        assertThat(canAccess).isTrue();
    }

    @Test
    @DisplayName("Should return true when user is recipient of message")
    void testCanAccessMessageAsRecipient() {
        Message message = new Message();
        message.setId(1L);
        message.setSender(otherUser);
        message.setRecipient(testUser);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));

        boolean canAccess = authorizationService.canAccessMessage(1L, authentication);

        assertThat(canAccess).isTrue();
    }

    @Test
    @DisplayName("Should return false when user is neither sender nor recipient")
    void testCanAccessMessageAsNonParticipant() {
        Message message = new Message();
        message.setId(1L);
        message.setSender(otherUser);
        message.setRecipient(adminUser);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));

        boolean canAccess = authorizationService.canAccessMessage(1L, authentication);

        assertThat(canAccess).isFalse();
    }

    @Test
    @DisplayName("Should return true when admin accesses any message")
    void testCanAccessMessageAsAdmin() {
        Message message = new Message();
        message.setId(1L);
        message.setSender(testUser);
        message.setRecipient(otherUser);

        UserDetails adminUserDetails = org.springframework.security.core.userdetails.User.builder()
                .username("admin@example.com")
                .password("encoded")
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")))
                .build();

        Authentication adminAuth = mock(Authentication.class);
        when(adminAuth.isAuthenticated()).thenReturn(true);
        when(adminAuth.getPrincipal()).thenReturn(adminUserDetails);

        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(adminUser));

        boolean canAccess = authorizationService.canAccessMessage(1L, adminAuth);

        assertThat(canAccess).isTrue();
    }

    @Test
    @DisplayName("Should return true when user is staff")
    void testIsStaffForBanker() {
        User banker = User.builder()
                .id(4L)
                .email("banker@example.com")
                .role(UserRole.BANKER)
                .build();

        UserDetails bankerDetails = org.springframework.security.core.userdetails.User.builder()
                .username("banker@example.com")
                .password("encoded")
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_BANKER")))
                .build();

        Authentication bankerAuth = mock(Authentication.class);
        when(bankerAuth.isAuthenticated()).thenReturn(true);
        when(bankerAuth.getPrincipal()).thenReturn(bankerDetails);
        when(userRepository.findByEmail("banker@example.com")).thenReturn(Optional.of(banker));

        boolean isStaff = authorizationService.isStaff(bankerAuth);

        assertThat(isStaff).isTrue();
    }

    @Test
    @DisplayName("Should return false when user is not staff")
    void testIsStaffForApplicant() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        boolean isStaff = authorizationService.isStaff(authentication);

        assertThat(isStaff).isFalse();
    }

    @Test
    @DisplayName("Should return true when user is admin")
    void testIsAdminForAdmin() {
        UserDetails adminUserDetails = org.springframework.security.core.userdetails.User.builder()
                .username("admin@example.com")
                .password("encoded")
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")))
                .build();

        Authentication adminAuth = mock(Authentication.class);
        when(adminAuth.isAuthenticated()).thenReturn(true);
        when(adminAuth.getPrincipal()).thenReturn(adminUserDetails);
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(adminUser));

        boolean isAdmin = authorizationService.isAdmin(adminAuth);

        assertThat(isAdmin).isTrue();
    }

    @Test
    @DisplayName("Should return false when user is not admin")
    void testIsAdminForNonAdmin() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        boolean isAdmin = authorizationService.isAdmin(authentication);

        assertThat(isAdmin).isFalse();
    }

    @Test
    @DisplayName("Should return false when authentication is null")
    void testCanAccessMessageWithNullAuth() {
        boolean canAccess = authorizationService.canAccessMessage(1L, null);

        assertThat(canAccess).isFalse();
    }

    @Test
    @DisplayName("Should return false when user is not authenticated")
    void testCanAccessMessageNotAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(false);

        boolean canAccess = authorizationService.canAccessMessage(1L, authentication);

        assertThat(canAccess).isFalse();
    }
}
