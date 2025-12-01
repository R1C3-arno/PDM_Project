package com.loanweb.service;

import com.loanweb.domain.message.Message;
import com.loanweb.domain.message.MessageRepository;
import com.loanweb.domain.user.User;
import com.loanweb.domain.user.UserRepository;
import com.loanweb.domain.user.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Centralized authorization service for role-based access control (RBAC).
 *
 * <p>Responsibilities:</p>
 * <ul>
 *   <li>Get authenticated user from Spring Security context</li>
 *   <li>Check resource ownership (messages, applications, loans)</li>
 *   <li>Verify role-based permissions</li>
 *   <li>Enforce access control policies</li>
 * </ul>
 *
 * <p>Access Control Rules:</p>
 * <ul>
 *   <li>Messages: Sender OR recipient can access</li>
 *   <li>Applications: Owner OR staff (BANKER, VERIFIER, UNDERWRITER, ADMIN) can access</li>
 *   <li>Loans: Owner OR staff can access</li>
 *   <li>Users: Self OR admin can access/modify</li>
 * </ul>
 *
 * @author PDM Security Team
 * @version 1.0
 * @since 2025-01-28
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AuthorizationService {

    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    /**
     * Gets the currently authenticated user from Spring Security context.
     *
     * <p>This method extracts the user from the SecurityContext that was populated
     * by the JwtAuthenticationFilter. It ensures that all authorization decisions
     * are based on the actual authenticated user, not on user-provided headers.</p>
     *
     * @return the authenticated User entity
     * @throws UsernameNotFoundException if user not found in database
     * @throws AccessDeniedException if no authenticated user exists
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            log.error("No authenticated user found in SecurityContext");
            throw new AccessDeniedException("Authentication required");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UserDetails)) {
            log.error("Principal is not UserDetails: {}", principal.getClass());
            throw new AccessDeniedException("Invalid authentication principal");
        }

        UserDetails userDetails = (UserDetails) principal;
        String email = userDetails.getUsername();

        log.debug("Getting current user: {}", email);

        return userRepository.findByEmail(email)
            .orElseThrow(() -> {
                log.error("User not found with email: {}", email);
                return new UsernameNotFoundException("User not found with email: " + email);
            });
    }

    /**
     * Checks if the authenticated user can access a specific message.
     *
     * <p>Access is granted if:</p>
     * <ul>
     *   <li>User is the sender of the message</li>
     *   <li>User is the recipient of the message</li>
     *   <li>User has ADMIN role (can access all messages)</li>
     * </ul>
     *
     * @param messageId the message ID to check access for
     * @param auth the current authentication
     * @return true if user can access the message, false otherwise
     */
    public boolean canAccessMessage(Long messageId, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            log.debug("User not authenticated, cannot access message {}", messageId);
            return false;
        }

        User currentUser = getCurrentUser();
        log.debug("Checking message access for user {} on message {}", currentUser.getId(), messageId);

        // Admin can access all messages
        if (isAdmin(auth)) {
            log.debug("User is admin, granting access to message {}", messageId);
            return true;
        }

        // Check if user is sender or recipient
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found with id: " + messageId));

        boolean isSender = message.getSender().getId().equals(currentUser.getId());
        boolean isRecipient = message.getRecipient().getId().equals(currentUser.getId());

        boolean hasAccess = isSender || isRecipient;

        if (hasAccess) {
            log.debug("User {} has access to message {} (sender: {}, recipient: {})",
                currentUser.getId(), messageId, isSender, isRecipient);
        } else {
            log.warn("User {} denied access to message {}", currentUser.getId(), messageId);
        }

        return hasAccess;
    }

    /**
     * Checks if the authenticated user can access a specific loan application.
     *
     * <p>Access is granted if:</p>
     * <ul>
     *   <li>User is the application owner</li>
     *   <li>User has staff role (BANKER, VERIFIER, UNDERWRITER, ADMIN)</li>
     * </ul>
     *
     * @param applicationId the application ID to check access for
     * @param auth the current authentication
     * @return true if user can access the application, false otherwise
     */
    public boolean canAccessApplication(Long applicationId, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            log.debug("User not authenticated, cannot access application {}", applicationId);
            return false;
        }

        User currentUser = getCurrentUser();
        log.debug("Checking application access for user {} on application {}",
            currentUser.getId(), applicationId);

        // Staff members can access all applications
        if (isStaff(auth)) {
            log.debug("User is staff, granting access to application {}", applicationId);
            return true;
        }

        // TODO: Implement application ownership check when Application entity is available
        // For now, applicants can only access their own applications
        log.debug("Application ownership check not yet implemented");
        return false;
    }

    /**
     * Checks if the authenticated user can access a specific loan.
     *
     * <p>Access is granted if:</p>
     * <ul>
     *   <li>User is the loan owner</li>
     *   <li>User has staff role (BANKER, VERIFIER, UNDERWRITER, ADMIN)</li>
     * </ul>
     *
     * @param loanId the loan ID to check access for
     * @param auth the current authentication
     * @return true if user can access the loan, false otherwise
     */
    public boolean canAccessLoan(Long loanId, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            log.debug("User not authenticated, cannot access loan {}", loanId);
            return false;
        }

        User currentUser = getCurrentUser();
        log.debug("Checking loan access for user {} on loan {}", currentUser.getId(), loanId);

        // Staff members can access all loans
        if (isStaff(auth)) {
            log.debug("User is staff, granting access to loan {}", loanId);
            return true;
        }

        // TODO: Implement loan ownership check when Loan entity is available
        // For now, applicants can only access their own loans
        log.debug("Loan ownership check not yet implemented");
        return false;
    }

    /**
     * Checks if the authenticated user can modify a specific user.
     *
     * <p>Access is granted if:</p>
     * <ul>
     *   <li>User is modifying their own account</li>
     *   <li>User has ADMIN role (can modify any user)</li>
     * </ul>
     *
     * @param userId the user ID to check modification rights for
     * @param auth the current authentication
     * @return true if user can modify the user, false otherwise
     */
    public boolean canModifyUser(Long userId, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            log.debug("User not authenticated, cannot modify user {}", userId);
            return false;
        }

        User currentUser = getCurrentUser();
        log.debug("Checking user modification rights for user {} on user {}",
            currentUser.getId(), userId);

        // Admin can modify any user
        if (isAdmin(auth)) {
            log.debug("User is admin, granting modification rights for user {}", userId);
            return true;
        }

        // Users can modify their own account
        boolean canModify = currentUser.getId().equals(userId);

        if (canModify) {
            log.debug("User {} can modify their own account", currentUser.getId());
        } else {
            log.warn("User {} denied modification rights for user {}", currentUser.getId(), userId);
        }

        return canModify;
    }

    /**
     * Checks if the authenticated user has a staff role.
     *
     * <p>Staff roles include:</p>
     * <ul>
     *   <li>BANKER</li>
     *   <li>VERIFIER</li>
     *   <li>UNDERWRITER</li>
     *   <li>ADMIN</li>
     * </ul>
     *
     * @param auth the current authentication
     * @return true if user has a staff role, false otherwise
     */
    public boolean isStaff(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        User currentUser = getCurrentUser();
        UserRole role = currentUser.getRole();

        boolean isStaff = role == UserRole.BANKER ||
                         role == UserRole.VERIFIER ||
                         role == UserRole.UNDERWRITER ||
                         role == UserRole.ADMIN;

        log.debug("User {} staff check: {} (role: {})", currentUser.getId(), isStaff, role);
        return isStaff;
    }

    /**
     * Checks if the authenticated user has the ADMIN role.
     *
     * @param auth the current authentication
     * @return true if user is an admin, false otherwise
     */
    public boolean isAdmin(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        User currentUser = getCurrentUser();
        boolean isAdmin = currentUser.getRole() == UserRole.ADMIN;

        log.debug("User {} admin check: {}", currentUser.getId(), isAdmin);
        return isAdmin;
    }

    /**
     * Validates resource ownership and throws AccessDeniedException if check fails.
     *
     * <p>This is a convenience method for enforcing ownership checks with
     * clear error messages.</p>
     *
     * @param resourceOwnerId the ID of the resource owner
     * @param currentUserId the ID of the current user
     * @param resourceType the type of resource (for error message)
     * @throws AccessDeniedException if ownership check fails
     */
    public void checkOwnership(Long resourceOwnerId, Long currentUserId, String resourceType) {
        if (!resourceOwnerId.equals(currentUserId)) {
            log.warn("Ownership check failed: user {} attempted to access {} owned by {}",
                currentUserId, resourceType, resourceOwnerId);
            throw new AccessDeniedException(
                "You do not have permission to access this " + resourceType
            );
        }

        log.debug("Ownership check passed: user {} owns {}", currentUserId, resourceType);
    }

    /**
     * Validates that the current user is the owner or has staff privileges.
     *
     * @param resourceOwnerId the ID of the resource owner
     * @param resourceType the type of resource (for error message)
     * @throws AccessDeniedException if access check fails
     */
    public void checkOwnershipOrStaff(Long resourceOwnerId, String resourceType) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = getCurrentUser();

        boolean isOwner = resourceOwnerId.equals(currentUser.getId());
        boolean hasStaffAccess = isStaff(auth);

        if (!isOwner && !hasStaffAccess) {
            log.warn("Access denied: user {} attempted to access {} owned by {} without staff privileges",
                currentUser.getId(), resourceType, resourceOwnerId);
            throw new AccessDeniedException(
                "You do not have permission to access this " + resourceType
            );
        }

        log.debug("Access granted: user {} can access {} (owner: {}, staff: {})",
            currentUser.getId(), resourceType, isOwner, hasStaffAccess);
    }
}
