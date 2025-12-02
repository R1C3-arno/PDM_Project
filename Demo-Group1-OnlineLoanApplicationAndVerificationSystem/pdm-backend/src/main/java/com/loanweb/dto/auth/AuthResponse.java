package com.loanweb.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for authentication responses.
 *
 * <p>Contains:</p>
 * <ul>
 *   <li>User information (without sensitive data)</li>
 *   <li>Success/error message</li>
 *   <li>JWT token (set in HttpOnly cookie, not in response body)</li>
 * </ul>
 *
 * <p>Security Note:</p>
 * The JWT token is intentionally NOT included in this response body.
 * It is set as an HttpOnly cookie for CSRF protection and XSS mitigation.
 *
 * @author PDM Security Team
 * @version 1.0
 * @since 2025-01-27
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private UserDTO user;
    private String message;
    private boolean success;

    /**
     * Creates a successful authentication response.
     *
     * @param user the authenticated user DTO
     * @param message the success message
     * @return the authentication response
     */
    public static AuthResponse success(UserDTO user, String message) {
        return AuthResponse.builder()
                .user(user)
                .message(message)
                .success(true)
                .build();
    }

    /**
     * Creates a failed authentication response.
     *
     * @param message the error message
     * @return the authentication response
     */
    public static AuthResponse error(String message) {
        return AuthResponse.builder()
                .user(null)
                .message(message)
                .success(false)
                .build();
    }
}
