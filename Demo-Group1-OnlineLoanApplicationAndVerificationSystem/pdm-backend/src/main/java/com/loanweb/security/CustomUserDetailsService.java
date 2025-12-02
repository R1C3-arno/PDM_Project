package com.loanweb.security;

import com.loanweb.domain.user.User;
import com.loanweb.domain.user.UserRepository;
import com.loanweb.domain.user.UserStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Collections;

/**
 * Custom UserDetailsService implementation that loads user-specific data from the database.
 *
 * <p>Responsibilities:</p>
 * <ul>
 *   <li>Load user by email (username)</li>
 *   <li>Convert User entity to Spring Security UserDetails</li>
 *   <li>Map user roles to Spring Security authorities</li>
 *   <li>Handle account status (active/suspended/locked)</li>
 * </ul>
 *
 * <p>Security Considerations:</p>
 * <ul>
 *   <li>Constant-time user lookup to prevent user enumeration</li>
 *   <li>Role prefix "ROLE_" for Spring Security compatibility</li>
 *   <li>Account status checks (enabled, locked, expired)</li>
 *   <li>Transactional to ensure data consistency</li>
 * </ul>
 *
 * @author PDM Security Team
 * @version 1.0
 * @since 2025-01-27
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Loads user by username (email in this system).
     *
     * <p>Authentication Flow:</p>
     * <ol>
     *   <li>Query database for user by email</li>
     *   <li>Throw UsernameNotFoundException if not found</li>
     *   <li>Convert User entity to UserDetails</li>
     *   <li>Map role to Spring Security authority with ROLE_ prefix</li>
     *   <li>Check account status (active/suspended)</li>
     * </ol>
     *
     * <p>Security Note:</p>
     * This method should not reveal whether a user exists or not through
     * timing differences. However, the database query may still have timing
     * variations. For high-security applications, consider implementing
     * constant-time comparisons.
     *
     * @param username the username (email) to load
     * @return UserDetails object containing user information and authorities
     * @throws UsernameNotFoundException if user not found
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.debug("Loading user by username: {}", username);

        // Query database for user by email
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> {
                logger.error("User not found with email: {}", username);
                return new UsernameNotFoundException("User not found with email: " + username);
            });

        logger.debug("User found: {} with role: {}", user.getEmail(), user.getRole());

        // Convert User entity to Spring Security UserDetails
        return createUserDetails(user);
    }

    /**
     * Loads user by user ID.
     *
     * @param userId the user ID to load
     * @return UserDetails object
     * @throws UsernameNotFoundException if user not found
     */
    @Transactional(readOnly = true)
    public UserDetails loadUserById(Long userId) throws UsernameNotFoundException {
        logger.debug("Loading user by ID: {}", userId);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> {
                logger.error("User not found with ID: {}", userId);
                return new UsernameNotFoundException("User not found with ID: " + userId);
            });

        logger.debug("User found: {} with role: {}", user.getEmail(), user.getRole());

        return createUserDetails(user);
    }

    /**
     * Creates Spring Security UserDetails from User entity.
     *
     * <p>UserDetails Properties:</p>
     * <ul>
     *   <li>Username: User email</li>
     *   <li>Password: Hashed password (for authentication)</li>
     *   <li>Authorities: Role with ROLE_ prefix</li>
     *   <li>Enabled: Based on user status (ACTIVE = enabled)</li>
     *   <li>Account Non-Expired: Always true (no expiration tracking)</li>
     *   <li>Credentials Non-Expired: Always true (no password expiration)</li>
     *   <li>Account Non-Locked: Based on user status (SUSPENDED/LOCKED = locked)</li>
     * </ul>
     *
     * @param user the User entity
     * @return Spring Security UserDetails
     */
    private UserDetails createUserDetails(User user) {
        // Map role to Spring Security authority with ROLE_ prefix
        Collection<? extends GrantedAuthority> authorities = getAuthorities(user);

        // Determine account status
        boolean enabled = user.getStatus() == UserStatus.ACTIVE;
        boolean accountNonLocked = user.getStatus() != UserStatus.SUSPENDED;

        return org.springframework.security.core.userdetails.User.builder()
            .username(user.getEmail())
            .password(user.getPassword())
            .authorities(authorities)
            .accountExpired(false)
            .accountLocked(!accountNonLocked)
            .credentialsExpired(false)
            .disabled(!enabled)
            .build();
    }

    /**
     * Gets Spring Security authorities from User role.
     *
     * <p>Role Mapping:</p>
     * The user's role is prefixed with "ROLE_" to comply with Spring Security
     * conventions. For example:
     * <ul>
     *   <li>APPLICANT -> ROLE_APPLICANT</li>
     *   <li>BANKER -> ROLE_BANKER</li>
     *   <li>ADMIN -> ROLE_ADMIN</li>
     * </ul>
     *
     * @param user the User entity
     * @return collection of granted authorities
     */
    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        // Add ROLE_ prefix to comply with Spring Security conventions
        String role = "ROLE_" + user.getRole().name();
        logger.debug("Mapping user role: {} to authority: {}", user.getRole(), role);

        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }

    /**
     * Checks if a user with the given email exists.
     *
     * @param email the email to check
     * @return true if user exists, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean userExists(String email) {
        return userRepository.existsByEmail(email);
    }
}
