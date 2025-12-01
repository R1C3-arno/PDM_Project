package com.loanweb.service;

import com.loanweb.domain.user.User;
import com.loanweb.domain.user.UserRepository;
import com.loanweb.domain.user.UserRole;
import com.loanweb.domain.user.UserStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.regex.Pattern;

/**
 * Service layer for user management operations.
 *
 * <p>Security Features:</p>
 * <ul>
 *   <li>Password strength validation (12+ chars, mixed case, numbers, special chars)</li>
 *   <li>BCrypt password hashing before storage</li>
 *   <li>Email uniqueness validation</li>
 *   <li>Last login tracking for audit purposes</li>
 *   <li>Transactional integrity for user operations</li>
 * </ul>
 *
 * <p>Password Strength Requirements:</p>
 * <ul>
 *   <li>Minimum 12 characters</li>
 *   <li>At least one uppercase letter (A-Z)</li>
 *   <li>At least one lowercase letter (a-z)</li>
 *   <li>At least one number (0-9)</li>
 *   <li>At least one special character (!@#$%^&*(),.?":{}|<>)</li>
 * </ul>
 *
 * @author PDM Security Team
 * @version 1.0
 * @since 2025-01-27
 */
@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    // Password strength validation patterns
    private static final int MIN_PASSWORD_LENGTH = 12;
    private static final Pattern UPPERCASE_PATTERN = Pattern.compile(".*[A-Z].*");
    private static final Pattern LOWERCASE_PATTERN = Pattern.compile(".*[a-z].*");
    private static final Pattern DIGIT_PATTERN = Pattern.compile(".*\\d.*");
    private static final Pattern SPECIAL_CHAR_PATTERN = Pattern.compile(".*[!@#$%^&*(),.?\":{}|<>].*");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Creates a new user with validated password and default role.
     *
     * <p>Security Checks:</p>
     * <ol>
     *   <li>Email uniqueness validation</li>
     *   <li>Password strength validation</li>
     *   <li>BCrypt password hashing (cost factor 12)</li>
     *   <li>Default role assignment (APPLICANT)</li>
     *   <li>Default status assignment (ACTIVE)</li>
     * </ol>
     *
     * @param email the user's email address (must be unique)
     * @param rawPassword the plain text password (will be hashed)
     * @param fullName the user's full name
     * @param phone the user's phone number (optional)
     * @return the created user with hashed password
     * @throws IllegalArgumentException if email already exists or password is weak
     */
    @Transactional
    public User createUser(String email, String rawPassword, String fullName, String phone) {
        logger.info("Creating new user with email: {}", email);

        // Validate email uniqueness
        if (userRepository.existsByEmail(email)) {
            logger.warn("Attempted to create user with duplicate email: {}", email);
            throw new IllegalArgumentException("Email already registered");
        }

        // Validate password strength
        validatePasswordStrength(rawPassword);

        // Hash the password
        String hashedPassword = passwordEncoder.encode(rawPassword);
        logger.debug("Password hashed successfully for user: {}", email);

        // Build and save user
        User user = User.builder()
                .email(email)
                .password(hashedPassword)
                .fullName(fullName)
                .phone(phone)
                .role(UserRole.APPLICANT)
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);
        logger.info("User created successfully with ID: {} and role: {}", savedUser.getId(), savedUser.getRole());

        return savedUser;
    }

    /**
     * Updates the last login timestamp for a user.
     *
     * <p>Audit Trail:</p>
     * This method is called after successful authentication to track user activity.
     * The last_login timestamp is used for:
     * <ul>
     *   <li>Security monitoring (detecting unusual login patterns)</li>
     *   <li>Session management (identifying stale accounts)</li>
     *   <li>Compliance reporting (audit logs)</li>
     * </ul>
     *
     * @param user the user to update
     * @return the updated user with new last_login timestamp
     */
    @Transactional
    public User updateLastLogin(User user) {
        logger.debug("Updating last login for user: {}", user.getEmail());

        user.setLastLogin(LocalDateTime.now());
        User updatedUser = userRepository.save(user);

        logger.info("Last login updated for user: {} at {}", user.getEmail(), user.getLastLogin());
        return updatedUser;
    }

    /**
     * Validates password strength against security requirements.
     *
     * <p>Validation Rules:</p>
     * <ul>
     *   <li>Minimum 12 characters (protects against brute force)</li>
     *   <li>At least one uppercase letter (increases entropy)</li>
     *   <li>At least one lowercase letter (increases entropy)</li>
     *   <li>At least one digit (increases entropy)</li>
     *   <li>At least one special character (maximizes complexity)</li>
     * </ul>
     *
     * <p>Security Rationale:</p>
     * These requirements ensure passwords have sufficient entropy to resist:
     * <ul>
     *   <li>Dictionary attacks</li>
     *   <li>Brute force attacks</li>
     *   <li>Rainbow table attacks (combined with BCrypt salting)</li>
     * </ul>
     *
     * @param password the password to validate
     * @throws IllegalArgumentException if password does not meet strength requirements
     */
    public void validatePasswordStrength(String password) {
        logger.debug("Validating password strength");

        if (password == null || password.length() < MIN_PASSWORD_LENGTH) {
            logger.warn("Password validation failed: too short (minimum {} characters)", MIN_PASSWORD_LENGTH);
            throw new IllegalArgumentException(
                String.format("Password must be at least %d characters long", MIN_PASSWORD_LENGTH)
            );
        }

        if (!UPPERCASE_PATTERN.matcher(password).matches()) {
            logger.warn("Password validation failed: no uppercase letter");
            throw new IllegalArgumentException("Password must contain at least one uppercase letter");
        }

        if (!LOWERCASE_PATTERN.matcher(password).matches()) {
            logger.warn("Password validation failed: no lowercase letter");
            throw new IllegalArgumentException("Password must contain at least one lowercase letter");
        }

        if (!DIGIT_PATTERN.matcher(password).matches()) {
            logger.warn("Password validation failed: no digit");
            throw new IllegalArgumentException("Password must contain at least one digit");
        }

        if (!SPECIAL_CHAR_PATTERN.matcher(password).matches()) {
            logger.warn("Password validation failed: no special character");
            throw new IllegalArgumentException("Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)");
        }

        logger.debug("Password strength validation passed");
    }

    /**
     * Finds a user by email address.
     *
     * @param email the email to search for
     * @return the user if found
     * @throws IllegalArgumentException if user not found
     */
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
    }

    /**
     * Finds a user by ID.
     *
     * @param id the user ID
     * @return the user if found
     * @throws IllegalArgumentException if user not found
     */
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));
    }

    /**
     * Checks if an email is already registered.
     *
     * @param email the email to check
     * @return true if email exists, false otherwise
     */
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Returns all users in the system (Admin only).
     *
     * @return list of all users
     */
    public java.util.List<User> findAllUsers() {
        logger.debug("Fetching all users");
        return userRepository.findAll();
    }

    /**
     * Saves a user entity.
     *
     * @param user the user to save
     * @return the saved user
     */
    @Transactional
    public User save(User user) {
        logger.debug("Saving user: {}", user.getEmail());
        return userRepository.save(user);
    }
}
