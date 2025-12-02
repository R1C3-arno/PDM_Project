package com.loanweb.dto.auth;

import com.loanweb.domain.user.User;
import com.loanweb.domain.user.UserRole;
import com.loanweb.domain.user.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for user information responses.
 *
 * <p>Security Note:</p>
 * This DTO explicitly excludes sensitive information:
 * <ul>
 *   <li>Password hash (never exposed)</li>
 *   <li>Internal database timestamps (unless needed)</li>
 * </ul>
 *
 * <p>Contains only user information safe to send to the client.</p>
 *
 * @author PDM Security Team
 * @version 1.0
 * @since 2025-01-27
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private UserRole role;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;

    /**
     * Converts a User entity to a UserDTO.
     * This factory method ensures passwords are never accidentally exposed.
     *
     * @param user the user entity
     * @return the user DTO without sensitive information
     */
    public static UserDTO fromUser(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }
}
