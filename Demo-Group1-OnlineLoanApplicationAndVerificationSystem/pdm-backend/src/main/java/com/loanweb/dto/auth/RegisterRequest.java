package com.loanweb.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for user registration requests.
 *
 * <p>Validation Rules:</p>
 * <ul>
 *   <li>Email: Required, must be valid email format</li>
 *   <li>Password: Required, minimum 12 characters (additional validation in UserService)</li>
 *   <li>Full Name: Required, 2-100 characters</li>
 *   <li>Phone: Optional, must match phone pattern if provided</li>
 * </ul>
 *
 * @author PDM Security Team
 * @version 1.0
 * @since 2025-01-27
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 12, message = "Password must be at least 12 characters long")
    private String password;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @Pattern(regexp = "^[0-9+\\-\\s()]*$", message = "Phone number must contain only digits, spaces, and +-()")
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phone;
}
