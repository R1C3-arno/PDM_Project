package com.loanweb.service;

import com.loanweb.domain.message.Message;
import com.loanweb.domain.message.MessageRepository;
import com.loanweb.domain.user.User;
import com.loanweb.domain.user.UserRepository;
import com.loanweb.domain.user.UserRole;
import com.loanweb.domain.user.UserStatus;
import com.loanweb.dto.message.MessageDTO;
import com.loanweb.dto.message.SendMessageRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for MessageService
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Message Service Tests")
class MessageServiceTest {

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private MessageService messageService;

    private User sender;
    private User recipient;
    private Message message;
    private SendMessageRequest sendRequest;

    @BeforeEach
    void setUp() {
        sender = User.builder()
            .id(1L)
            .email("sender@example.com")
            .fullName("Sender User")
            .password("encoded")
            .role(UserRole.APPLICANT)
            .status(UserStatus.ACTIVE)
            .createdAt(LocalDateTime.now())
            .build();

        recipient = User.builder()
            .id(2L)
            .email("recipient@example.com")
            .fullName("Recipient User")
            .password("encoded")
            .role(UserRole.BANKER)
            .status(UserStatus.ACTIVE)
            .createdAt(LocalDateTime.now())
            .build();

        message = Message.builder()
            .id(1L)
            .sender(sender)
            .recipient(recipient)
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
    @DisplayName("Should send message successfully")
    void shouldSendMessage() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(sender));
        when(userRepository.findById(2L)).thenReturn(Optional.of(recipient));
        when(messageRepository.save(any(Message.class))).thenReturn(message);

        // When
        MessageDTO result = messageService.sendMessage(1L, sendRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getSubject()).isEqualTo("Test Subject");
        assertThat(result.getBody()).isEqualTo("Test Body");
        verify(messageRepository, times(1)).save(any(Message.class));
    }

    @Test
    @DisplayName("Should throw exception when sender not found")
    void shouldThrowExceptionWhenSenderNotFound() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> messageService.sendMessage(1L, sendRequest))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Sender not found");
    }

    @Test
    @DisplayName("Should throw exception when recipient not found")
    void shouldThrowExceptionWhenRecipientNotFound() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(sender));
        when(userRepository.findById(2L)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> messageService.sendMessage(1L, sendRequest))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Recipient not found");
    }

    @Test
    @DisplayName("Should get inbox messages")
    void shouldGetInboxMessages() {
        // Given
        List<Message> messages = Arrays.asList(message);
        when(messageRepository.findByRecipientId(2L)).thenReturn(messages);

        // When
        List<MessageDTO> result = messageService.getInbox(2L);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getSubject()).isEqualTo("Test Subject");
        verify(messageRepository, times(1)).findByRecipientId(2L);
    }

    @Test
    @DisplayName("Should get sent messages")
    void shouldGetSentMessages() {
        // Given
        List<Message> messages = Arrays.asList(message);
        when(messageRepository.findBySenderId(1L)).thenReturn(messages);

        // When
        List<MessageDTO> result = messageService.getSent(1L);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getSubject()).isEqualTo("Test Subject");
        verify(messageRepository, times(1)).findBySenderId(1L);
    }

    @Test
    @DisplayName("Should get unread messages")
    void shouldGetUnreadMessages() {
        // Given
        List<Message> messages = Arrays.asList(message);
        when(messageRepository.findUnreadByRecipientId(2L)).thenReturn(messages);

        // When
        List<MessageDTO> result = messageService.getUnread(2L);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getReadStatus()).isFalse();
        verify(messageRepository, times(1)).findUnreadByRecipientId(2L);
    }

    @Test
    @DisplayName("Should get unread message count")
    void shouldGetUnreadCount() {
        // Given
        when(messageRepository.countUnreadByRecipientId(2L)).thenReturn(5L);

        // When
        Long count = messageService.getUnreadCount(2L);

        // Then
        assertThat(count).isEqualTo(5L);
        verify(messageRepository, times(1)).countUnreadByRecipientId(2L);
    }

    @Test
    @DisplayName("Should mark message as read")
    void shouldMarkMessageAsRead() {
        // Given
        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));
        when(messageRepository.save(any(Message.class))).thenReturn(message);

        // When
        MessageDTO result = messageService.markAsRead(1L, 2L);

        // Then
        assertThat(result).isNotNull();
        verify(messageRepository, times(1)).save(any(Message.class));
    }

    @Test
    @DisplayName("Should throw exception when marking non-existent message as read")
    void shouldThrowExceptionWhenMessageNotFoundForRead() {
        // Given
        when(messageRepository.findById(999L)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> messageService.markAsRead(999L, 2L))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Message not found");
    }

    @Test
    @DisplayName("Should throw exception when non-recipient tries to mark as read")
    void shouldThrowExceptionWhenNonRecipientMarksAsRead() {
        // Given
        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));

        // When/Then
        assertThatThrownBy(() -> messageService.markAsRead(1L, 999L))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Unauthorized");
    }

    @Test
    @DisplayName("Should not update already read message")
    void shouldNotUpdateAlreadyReadMessage() {
        // Given
        message.setReadStatus(true);
        message.setReadAt(LocalDateTime.now());
        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));

        // When
        MessageDTO result = messageService.markAsRead(1L, 2L);

        // Then
        assertThat(result).isNotNull();
        verify(messageRepository, never()).save(any(Message.class));
    }

    @Test
    @DisplayName("Should get conversation between two users")
    void shouldGetConversation() {
        // Given
        List<Message> messages = Arrays.asList(message);
        when(messageRepository.findConversationBetween(1L, 2L)).thenReturn(messages);

        // When
        List<MessageDTO> result = messageService.getConversation(1L, 2L);

        // Then
        assertThat(result).hasSize(1);
        verify(messageRepository, times(1)).findConversationBetween(1L, 2L);
    }

    @Test
    @DisplayName("Should get message by ID for authorized user (sender)")
    void shouldGetMessageByIdForSender() {
        // Given
        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));

        // When
        MessageDTO result = messageService.getMessageById(1L, 1L); // sender ID

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getSubject()).isEqualTo("Test Subject");
    }

    @Test
    @DisplayName("Should get message by ID for authorized user (recipient)")
    void shouldGetMessageByIdForRecipient() {
        // Given
        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));

        // When
        MessageDTO result = messageService.getMessageById(1L, 2L); // recipient ID

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getSubject()).isEqualTo("Test Subject");
    }

    @Test
    @DisplayName("Should throw exception when unauthorized user tries to get message")
    void shouldThrowExceptionForUnauthorizedAccess() {
        // Given
        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));

        // When/Then
        assertThatThrownBy(() -> messageService.getMessageById(1L, 999L))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Unauthorized");
    }

    @Test
    @DisplayName("Should delete message when sender requests")
    void shouldDeleteMessageBySender() {
        // Given
        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));

        // When
        messageService.deleteMessage(1L, 1L); // sender ID

        // Then
        verify(messageRepository, times(1)).delete(message);
    }

    @Test
    @DisplayName("Should throw exception when non-sender tries to delete")
    void shouldThrowExceptionWhenNonSenderDeletes() {
        // Given
        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));

        // When/Then
        assertThatThrownBy(() -> messageService.deleteMessage(1L, 2L))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Unauthorized");
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent message")
    void shouldThrowExceptionWhenDeletingNonExistentMessage() {
        // Given
        when(messageRepository.findById(999L)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> messageService.deleteMessage(999L, 1L))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Message not found");
    }
}
