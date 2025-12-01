package com.loanweb.service;

import com.loanweb.domain.message.Message;
import com.loanweb.domain.message.MessageRepository;
import com.loanweb.domain.user.User;
import com.loanweb.domain.user.UserRepository;
import com.loanweb.dto.message.MessageDTO;
import com.loanweb.dto.message.SendMessageRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for message operations with proper authorization checks.
 *
 * <p>Business Logic:</p>
 * <ul>
 *   <li>Send messages between users</li>
 *   <li>Retrieve inbox/sent/unread messages</li>
 *   <li>Mark messages as read (recipient only)</li>
 *   <li>Delete messages (sender only)</li>
 *   <li>View conversations between users</li>
 * </ul>
 *
 * <p>Security:</p>
 * <ul>
 *   <li>Validates sender/recipient ownership</li>
 *   <li>Throws AccessDeniedException for unauthorized operations</li>
 *   <li>Uses proper exceptions for error handling</li>
 * </ul>
 *
 * @author PDM Team
 * @version 2.0
 * @since 2025-01-28
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    /**
     * Send a message from sender to recipient.
     *
     * @param senderId the ID of the message sender
     * @param request the message request containing recipient and content
     * @return the created message DTO
     * @throws UsernameNotFoundException if sender or recipient not found
     */
    public MessageDTO sendMessage(Long senderId, SendMessageRequest request) {
        log.info("Sending message from user {} to user {}", senderId, request.getRecipientId());

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> {
                    log.error("Sender not found with id: {}", senderId);
                    return new UsernameNotFoundException("Sender not found with id: " + senderId);
                });

        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> {
                    log.error("Recipient not found with id: {}", request.getRecipientId());
                    return new UsernameNotFoundException("Recipient not found with id: " + request.getRecipientId());
                });

        Message message = Message.builder()
                .sender(sender)
                .recipient(recipient)
                .subject(request.getSubject())
                .body(request.getBody())
                .readStatus(false)
                .build();

        Message savedMessage = messageRepository.save(message);
        log.info("Message sent successfully with id: {}", savedMessage.getId());

        return MessageDTO.fromEntity(savedMessage);
    }

    /**
     * Get inbox messages for a user
     */
    @Transactional(readOnly = true)
    public List<MessageDTO> getInbox(Long userId) {
        log.info("Fetching inbox for user: {}", userId);
        List<Message> messages = messageRepository.findByRecipientId(userId);
        return messages.stream()
                .map(MessageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get sent messages for a user
     */
    @Transactional(readOnly = true)
    public List<MessageDTO> getSent(Long userId) {
        log.info("Fetching sent messages for user: {}", userId);
        List<Message> messages = messageRepository.findBySenderId(userId);
        return messages.stream()
                .map(MessageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get unread messages for a user
     */
    @Transactional(readOnly = true)
    public List<MessageDTO> getUnread(Long userId) {
        log.info("Fetching unread messages for user: {}", userId);
        List<Message> messages = messageRepository.findUnreadByRecipientId(userId);
        return messages.stream()
                .map(MessageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get unread message count for a user
     */
    @Transactional(readOnly = true)
    public Long getUnreadCount(Long userId) {
        log.info("Fetching unread count for user: {}", userId);
        return messageRepository.countUnreadByRecipientId(userId);
    }

    /**
     * Mark a message as read.
     *
     * @param messageId the ID of the message to mark as read
     * @param userId the ID of the user marking the message
     * @return the updated message DTO
     * @throws RuntimeException if message not found
     * @throws AccessDeniedException if user is not the recipient
     */
    public MessageDTO markAsRead(Long messageId, Long userId) {
        log.info("Marking message {} as read by user {}", messageId, userId);

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> {
                    log.error("Message not found with id: {}", messageId);
                    return new RuntimeException("Message not found with id: " + messageId);
                });

        // Verify the user is the recipient
        if (!message.getRecipient().getId().equals(userId)) {
            log.warn("User {} attempted to mark message {} as read, but is not the recipient",
                userId, messageId);
            throw new AccessDeniedException("Only the recipient can mark this message as read");
        }

        if (!message.getReadStatus()) {
            message.setReadStatus(true);
            message.setReadAt(LocalDateTime.now());
            message = messageRepository.save(message);
            log.info("Message {} marked as read", messageId);
        } else {
            log.debug("Message {} already marked as read", messageId);
        }

        return MessageDTO.fromEntity(message);
    }

    /**
     * Get conversation between two users
     */
    @Transactional(readOnly = true)
    public List<MessageDTO> getConversation(Long userId1, Long userId2) {
        log.info("Fetching conversation between users {} and {}", userId1, userId2);
        List<Message> messages = messageRepository.findConversationBetween(userId1, userId2);
        return messages.stream()
                .map(MessageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific message by ID.
     *
     * @param messageId the ID of the message to retrieve
     * @param userId the ID of the user requesting the message
     * @return the message DTO
     * @throws RuntimeException if message not found
     * @throws AccessDeniedException if user is neither sender nor recipient
     */
    @Transactional(readOnly = true)
    public MessageDTO getMessageById(Long messageId, Long userId) {
        log.info("Fetching message {} for user {}", messageId, userId);

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> {
                    log.error("Message not found with id: {}", messageId);
                    return new RuntimeException("Message not found with id: " + messageId);
                });

        // Verify the user is either sender or recipient
        boolean isSender = message.getSender().getId().equals(userId);
        boolean isRecipient = message.getRecipient().getId().equals(userId);
        boolean isAuthorized = isSender || isRecipient;

        if (!isAuthorized) {
            log.warn("User {} attempted to access message {} without authorization", userId, messageId);
            throw new AccessDeniedException("You do not have permission to access this message");
        }

        log.debug("User {} accessing message {} (sender: {}, recipient: {})",
            userId, messageId, isSender, isRecipient);

        return MessageDTO.fromEntity(message);
    }

    /**
     * Delete a message (only sender can delete).
     *
     * @param messageId the ID of the message to delete
     * @param userId the ID of the user attempting to delete
     * @throws RuntimeException if message not found
     * @throws AccessDeniedException if user is not the sender
     */
    public void deleteMessage(Long messageId, Long userId) {
        log.info("Deleting message {} by user {}", messageId, userId);

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> {
                    log.error("Message not found with id: {}", messageId);
                    return new RuntimeException("Message not found with id: " + messageId);
                });

        // Only sender can delete
        if (!message.getSender().getId().equals(userId)) {
            log.warn("User {} attempted to delete message {} without authorization (not sender)",
                userId, messageId);
            throw new AccessDeniedException("Only the sender can delete this message");
        }

        messageRepository.delete(message);
        log.info("Message {} deleted successfully by user {}", messageId, userId);
    }
}
