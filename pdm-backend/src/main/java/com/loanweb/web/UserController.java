package com.loanweb.web;

import com.loanweb.domain.user.User;
import com.loanweb.domain.user.UserRole;
import com.loanweb.domain.user.UserStatus;
import com.loanweb.dto.auth.UserDTO;
import com.loanweb.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST controller for user management endpoints.
 * Restricted to ADMIN role only.
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Get all users (Admin only)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        logger.info("Fetching all users");
        try {
            List<User> users = userService.findAllUsers();
            List<UserDTO> userDTOs = users.stream()
                    .map(UserDTO::fromUser)
                    .collect(Collectors.toList());
            logger.info("Found {} users", userDTOs.size());
            return ResponseEntity.ok(userDTOs);
        } catch (Exception e) {
            logger.error("Error fetching users: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch users"));
        }
    }

    /**
     * Get user by ID (Admin only)
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        logger.info("Fetching user with ID: {}", id);
        try {
            User user = userService.findById(id);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(UserDTO.fromUser(user));
        } catch (Exception e) {
            logger.error("Error fetching user {}: {}", id, e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch user"));
        }
    }

    /**
     * Update user role or status (Admin only)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody Map<String, String> updates) {
        logger.info("Updating user with ID: {}", id);
        try {
            User user = userService.findById(id);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            // Update role if provided
            if (updates.containsKey("role")) {
                String newRole = updates.get("role");
                user.setRole(UserRole.valueOf(newRole));
                logger.info("Updated user {} role to {}", id, newRole);
            }

            // Update status if provided
            if (updates.containsKey("status")) {
                String newStatus = updates.get("status");
                user.setStatus(UserStatus.valueOf(newStatus));
                logger.info("Updated user {} status to {}", id, newStatus);
            }

            User updatedUser = userService.save(user);
            return ResponseEntity.ok(UserDTO.fromUser(updatedUser));
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid update for user {}: {}", id, e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error updating user {}: {}", id, e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to update user"));
        }
    }
}
