package com.loanweb.web;

import com.loanweb.domain.user.User;
import com.loanweb.dto.message.MessageDTO;
import com.loanweb.dto.message.SendMessageRequest;
import com.loanweb.service.AuthorizationService;
import com.loanweb.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for message operations with RBAC security.
 *
 * <p>All endpoints require authentication via JWT token in HttpOnly cookie.
 * Header-based authentication (X-User-Id) has been removed for security.</p>
 *
 * <p>Security Features:</p>
 * <ul>
 *   <li>JWT-based authentication (no user-provided IDs)</li>
 *   <li>Role-based access control (RBAC)</li>
 *   <li>Ownership verification for message access</li>
 *   <li>Unified error handling</li>
 * </ul>
 *
 * @author PDM Security Team
 * @version 2.0
 * @since 2025-01-28
 */
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:4000", allowCredentials = "true")
public class MessageController {

    private final MessageService messageService;
    private final AuthorizationService authorizationService;

    /**
     * Helper method to get authenticated user from security context.
     *
     * @return the authenticated User entity
     */
    private User getAuthenticatedUser() {
        return authorizationService.getCurrentUser();
    }

    /**
     * Send a new message
     * POST /api/messages
     *
     * <p>Security:</p>
     * <ul>
     *   <li>Requires authentication</li>
     *   <li>Sender ID is extracted from JWT token</li>
     *   <li>Cannot spoof sender identity</li>
     * </ul>
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageDTO> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        User currentUser = getAuthenticatedUser();
        log.info("User {} sending message to user {}", currentUser.getId(), request.getRecipientId());

        MessageDTO message = messageService.sendMessage(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    /**
     * Get inbox messages
     * GET /api/messages/inbox
     *
     * <p>Security:</p>
     * <ul>
     *   <li>Requires authentication</li>
     *   <li>Users can only view their own inbox</li>
     * </ul>
     */
    @GetMapping("/inbox")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageDTO>> getInbox() {
        User currentUser = getAuthenticatedUser();
        log.info("Fetching inbox for user: {}", currentUser.getId());

        List<MessageDTO> messages = messageService.getInbox(currentUser.getId());
        return ResponseEntity.ok(messages);
    }

    /**
     * Get sent messages
     * GET /api/messages/sent
     *
     * <p>Security:</p>
     * <ul>
     *   <li>Requires authentication</li>
     *   <li>Users can only view their own sent messages</li>
     * </ul>
     */
    @GetMapping("/sent")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageDTO>> getSent() {
        User currentUser = getAuthenticatedUser();
        log.info("Fetching sent messages for user: {}", currentUser.getId());

        List<MessageDTO> messages = messageService.getSent(currentUser.getId());
        return ResponseEntity.ok(messages);
    }

    /**
     * Get unread messages
     * GET /api/messages/unread
     *
     * <p>Security:</p>
     * <ul>
     *   <li>Requires authentication</li>
     *   <li>Users can only view their own unread messages</li>
     * </ul>
     */
    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageDTO>> getUnread() {
        User currentUser = getAuthenticatedUser();
        log.info("Fetching unread messages for user: {}", currentUser.getId());

        List<MessageDTO> messages = messageService.getUnread(currentUser.getId());
        return ResponseEntity.ok(messages);
    }

    /**
     * Get unread message count
     * GET /api/messages/unread-count
     *
     * <p>Security:</p>
     * <ul>
     *   <li>Requires authentication</li>
     *   <li>Users can only view their own unread count</li>
     * </ul>
     */
    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        User currentUser = getAuthenticatedUser();
        log.info("Fetching unread count for user: {}", currentUser.getId());

        Long count = messageService.getUnreadCount(currentUser.getId());

        Map<String, Long> response = new HashMap<>();
        response.put("count", count);

        return ResponseEntity.ok(response);
    }

    /**
     * Get a specific message
     * GET /api/messages/{id}
     *
     * <p>Security:</p>
     * <ul>
     *   <li>Requires authentication</li>
     *   <li>Verifies user is sender or recipient</li>
     *   <li>Admins can access all messages</li>
     * </ul>
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageDTO> getMessage(@PathVariable Long id) {
        User currentUser = getAuthenticatedUser();
        log.info("User {} fetching message {}", currentUser.getId(), id);

        // Verify access rights
        if (!authorizationService.canAccessMessage(id, SecurityContextHolder.getContext().getAuthentication())) {
            log.warn("User {} denied access to message {}", currentUser.getId(), id);
            throw new AccessDeniedException("You do not have permission to access this message");
        }

        MessageDTO message = messageService.getMessageById(id, currentUser.getId());
        return ResponseEntity.ok(message);
    }

    /**
     * Mark message as read
     * PUT /api/messages/{id}/read
     *
     * <p>Security:</p>
     * <ul>
     *   <li>Requires authentication</li>
     *   <li>Only recipient can mark message as read</li>
     * </ul>
     */
    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageDTO> markAsRead(@PathVariable Long id) {
        User currentUser = getAuthenticatedUser();
        log.info("User {} marking message {} as read", currentUser.getId(), id);

        MessageDTO message = messageService.markAsRead(id, currentUser.getId());
        return ResponseEntity.ok(message);
    }

    /**
     * Get conversation between current user and another user
     * GET /api/messages/conversation/{otherUserId}
     *
     * <p>Security:</p>
     * <ul>
     *   <li>Requires authentication</li>
     *   <li>Users can only view conversations they are part of</li>
     * </ul>
     */
    @GetMapping("/conversation/{otherUserId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageDTO>> getConversation(@PathVariable Long otherUserId) {
        User currentUser = getAuthenticatedUser();
        log.info("Fetching conversation between user {} and {}", currentUser.getId(), otherUserId);

        List<MessageDTO> messages = messageService.getConversation(currentUser.getId(), otherUserId);
        return ResponseEntity.ok(messages);
    }

    /**
     * Delete a message
     * DELETE /api/messages/{id}
     *
     * <p>Security:</p>
     * <ul>
     *   <li>Requires authentication</li>
     *   <li>Only sender can delete messages</li>
     * </ul>
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> deleteMessage(@PathVariable Long id) {
        User currentUser = getAuthenticatedUser();
        log.info("User {} deleting message {}", currentUser.getId(), id);

        messageService.deleteMessage(id, currentUser.getId());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Message deleted successfully");

        return ResponseEntity.ok(response);
    }
}
