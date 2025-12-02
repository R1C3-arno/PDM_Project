package com.loanweb.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loanweb.domain.user.User;
import com.loanweb.domain.user.UserRole;
import com.loanweb.domain.user.UserStatus;
import com.loanweb.dto.message.MessageDTO;
import com.loanweb.dto.message.SendMessageRequest;
import com.loanweb.service.AuthorizationService;
import com.loanweb.service.MessageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for MessageController using MockMvc
 */
@WebMvcTest(MessageController.class)
@DisplayName("Message Controller Tests")
class MessageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MessageService messageService;

    @MockBean
    private AuthorizationService authorizationService;

    private User testUser;
    private MessageDTO testMessage;
    private SendMessageRequest sendRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
            .id(1L)
            .email("test@example.com")
            .fullName("Test User")
            .password("encoded")
            .role(UserRole.APPLICANT)
            .status(UserStatus.ACTIVE)
            .createdAt(LocalDateTime.now())
            .build();

        testMessage = MessageDTO.builder()
            .id(1L)
            .senderId(1L)
            .senderName("Test User")
            .senderEmail("test@example.com")
            .recipientId(2L)
            .recipientName("Recipient User")
            .recipientEmail("recipient@example.com")
            .subject("Test Subject")
            .body("Test Body")
            .readStatus(false)
            .createdAt(LocalDateTime.now())
            .build();

        sendRequest = new SendMessageRequest();
        sendRequest.setRecipientId(2L);
        sendRequest.setSubject("Test Subject");
        sendRequest.setBody("Test Body");
    }

    @Test
    @DisplayName("Should send message when authenticated")
    @WithMockUser(username = "test@example.com", roles = "APPLICANT")
    void shouldSendMessageWhenAuthenticated() throws Exception {
        // Given
        when(authorizationService.getCurrentUser()).thenReturn(testUser);
        when(messageService.sendMessage(eq(1L), any(SendMessageRequest.class))).thenReturn(testMessage);

        // When/Then
        mockMvc.perform(post("/api/messages")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sendRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.subject").value("Test Subject"))
            .andExpect(jsonPath("$.body").value("Test Body"))
            .andExpect(jsonPath("$.senderId").value(1))
            .andExpect(jsonPath("$.recipientId").value(2));
    }

    @Test
    @DisplayName("Should return 401 when sending message without authentication")
    void shouldReturn401WhenSendingMessageWithoutAuth() throws Exception {
        // When/Then
        mockMvc.perform(post("/api/messages")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sendRequest)))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should return 400 when sending message with invalid request")
    @WithMockUser(username = "test@example.com", roles = "APPLICANT")
    void shouldReturn400WhenSendingInvalidMessage() throws Exception {
        // Given
        SendMessageRequest invalidRequest = new SendMessageRequest();
        invalidRequest.setRecipientId(null); // Invalid: null recipient
        invalidRequest.setSubject("");
        invalidRequest.setBody("");

        // When/Then
        mockMvc.perform(post("/api/messages")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should get inbox when authenticated")
    @WithMockUser(username = "test@example.com", roles = "APPLICANT")
    void shouldGetInboxWhenAuthenticated() throws Exception {
        // Given
        List<MessageDTO> messages = Arrays.asList(testMessage);
        when(authorizationService.getCurrentUser()).thenReturn(testUser);
        when(messageService.getInbox(1L)).thenReturn(messages);

        // When/Then
        mockMvc.perform(get("/api/messages/inbox")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].subject").value("Test Subject"));
    }

    @Test
    @DisplayName("Should return 401 when getting inbox without authentication")
    void shouldReturn401WhenGettingInboxWithoutAuth() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/messages/inbox")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should get sent messages when authenticated")
    @WithMockUser(username = "test@example.com", roles = "APPLICANT")
    void shouldGetSentMessagesWhenAuthenticated() throws Exception {
        // Given
        List<MessageDTO> messages = Arrays.asList(testMessage);
        when(authorizationService.getCurrentUser()).thenReturn(testUser);
        when(messageService.getSent(1L)).thenReturn(messages);

        // When/Then
        mockMvc.perform(get("/api/messages/sent")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].senderId").value(1));
    }

    @Test
    @DisplayName("Should get unread messages when authenticated")
    @WithMockUser(username = "test@example.com", roles = "APPLICANT")
    void shouldGetUnreadMessagesWhenAuthenticated() throws Exception {
        // Given
        List<MessageDTO> messages = Arrays.asList(testMessage);
        when(authorizationService.getCurrentUser()).thenReturn(testUser);
        when(messageService.getUnread(1L)).thenReturn(messages);

        // When/Then
        mockMvc.perform(get("/api/messages/unread")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].readStatus").value(false));
    }

    @Test
    @DisplayName("Should get unread count when authenticated")
    @WithMockUser(username = "test@example.com", roles = "APPLICANT")
    void shouldGetUnreadCountWhenAuthenticated() throws Exception {
        // Given
        when(authorizationService.getCurrentUser()).thenReturn(testUser);
        when(messageService.getUnreadCount(1L)).thenReturn(5L);

        // When/Then
        mockMvc.perform(get("/api/messages/unread-count")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.count").value(5));
    }

    @Test
    @DisplayName("Should get specific message when authorized")
    @WithMockUser(username = "test@example.com", roles = "APPLICANT")
    void shouldGetMessageWhenAuthorized() throws Exception {
        // Given
        when(authorizationService.getCurrentUser()).thenReturn(testUser);
        when(authorizationService.canAccessMessage(eq(1L), any(Authentication.class))).thenReturn(true);
        when(messageService.getMessageById(1L, 1L)).thenReturn(testMessage);

        // When/Then
        mockMvc.perform(get("/api/messages/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.subject").value("Test Subject"));
    }

    @Test
    @DisplayName("Should return 403 when accessing unauthorized message")
    @WithMockUser(username = "test@example.com", roles = "APPLICANT")
    void shouldReturn403WhenAccessingUnauthorizedMessage() throws Exception {
        // Given
        when(authorizationService.getCurrentUser()).thenReturn(testUser);
        when(authorizationService.canAccessMessage(eq(1L), any(Authentication.class))).thenReturn(false);

        // When/Then
        mockMvc.perform(get("/api/messages/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Should mark message as read when authenticated")
    @WithMockUser(username = "test@example.com", roles = "APPLICANT")
    void shouldMarkMessageAsReadWhenAuthenticated() throws Exception {
        // Given
        MessageDTO readMessage = MessageDTO.builder()
            .id(1L)
            .senderId(2L)
            .recipientId(1L)
            .subject("Test Subject")
            .body("Test Body")
            .readStatus(true)
            .readAt(LocalDateTime.now())
            .build();

        when(authorizationService.getCurrentUser()).thenReturn(testUser);
        when(messageService.markAsRead(1L, 1L)).thenReturn(readMessage);

        // When/Then
        mockMvc.perform(put("/api/messages/1/read")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.readStatus").value(true));
    }

    @Test
    @DisplayName("Should get conversation when authenticated")
    @WithMockUser(username = "test@example.com", roles = "APPLICANT")
    void shouldGetConversationWhenAuthenticated() throws Exception {
        // Given
        List<MessageDTO> messages = Arrays.asList(testMessage);
        when(authorizationService.getCurrentUser()).thenReturn(testUser);
        when(messageService.getConversation(1L, 2L)).thenReturn(messages);

        // When/Then
        mockMvc.perform(get("/api/messages/conversation/2")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    @DisplayName("Should delete message when authenticated")
    @WithMockUser(username = "test@example.com", roles = "APPLICANT")
    void shouldDeleteMessageWhenAuthenticated() throws Exception {
        // Given
        when(authorizationService.getCurrentUser()).thenReturn(testUser);

        // When/Then
        mockMvc.perform(delete("/api/messages/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Message deleted successfully"));
    }

    @Test
    @DisplayName("Should return 401 when deleting message without authentication")
    void shouldReturn401WhenDeletingMessageWithoutAuth() throws Exception {
        // When/Then
        mockMvc.perform(delete("/api/messages/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should handle admin accessing any message")
    @WithMockUser(username = "admin@example.com", roles = "ADMIN")
    void shouldAllowAdminToAccessAnyMessage() throws Exception {
        // Given
        User adminUser = User.builder()
            .id(99L)
            .email("admin@example.com")
            .fullName("Admin User")
            .role(UserRole.ADMIN)
            .status(UserStatus.ACTIVE)
            .build();

        when(authorizationService.getCurrentUser()).thenReturn(adminUser);
        when(authorizationService.canAccessMessage(eq(1L), any(Authentication.class))).thenReturn(true);
        when(messageService.getMessageById(1L, 99L)).thenReturn(testMessage);

        // When/Then
        mockMvc.perform(get("/api/messages/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @DisplayName("Should return empty list when inbox is empty")
    @WithMockUser(username = "test@example.com", roles = "APPLICANT")
    void shouldReturnEmptyListWhenInboxIsEmpty() throws Exception {
        // Given
        when(authorizationService.getCurrentUser()).thenReturn(testUser);
        when(messageService.getInbox(1L)).thenReturn(Arrays.asList());

        // When/Then
        mockMvc.perform(get("/api/messages/inbox")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("Should return zero when no unread messages")
    @WithMockUser(username = "test@example.com", roles = "APPLICANT")
    void shouldReturnZeroWhenNoUnreadMessages() throws Exception {
        // Given
        when(authorizationService.getCurrentUser()).thenReturn(testUser);
        when(messageService.getUnreadCount(1L)).thenReturn(0L);

        // When/Then
        mockMvc.perform(get("/api/messages/unread-count")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.count").value(0));
    }
}
