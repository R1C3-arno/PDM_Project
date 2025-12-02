package com.loanweb.config;

import com.loanweb.security.JwtAuthenticationFilter;
import com.loanweb.security.CustomUserDetailsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Security configuration class that defines the Spring Security filter chain,
 * authentication mechanisms, and authorization rules for the PDM Loan Management System.
 *
 * <p>Security Architecture:</p>
 * <ul>
 *   <li>JWT-based authentication with HttpOnly cookies</li>
 *   <li>BCrypt password hashing with cost factor 12</li>
 *   <li>Stateless session management</li>
 *   <li>CORS configuration for frontend integration</li>
 *   <li>Role-based access control (RBAC)</li>
 * </ul>
 *
 * <p>Security Principles Applied:</p>
 * <ul>
 *   <li>Defense in depth with multiple security layers</li>
 *   <li>Fail-secure defaults (deny all, explicitly permit)</li>
 *   <li>Separation of concerns (authentication vs authorization)</li>
 *   <li>Principle of least privilege</li>
 * </ul>
 *
 * @author PDM Security Team
 * @version 1.0
 * @since 2025-01-27
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;

    @Value("${app.cors.allowed-methods}")
    private String[] allowedMethods;

    @Value("${app.cors.allowed-headers}")
    private String allowedHeaders;

    @Value("${app.cors.allow-credentials}")
    private boolean allowCredentials;

    @Value("${app.cors.max-age}")
    private long maxAge;

    public SecurityConfig(CustomUserDetailsService userDetailsService,
                         JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * Defines the security filter chain with authorization rules.
     *
     * <p>Endpoint Security Matrix:</p>
     * <ul>
     *   <li>Public: /api/auth/**, /api/public/**, /actuator/health</li>
     *   <li>Authenticated: All other /api/** endpoints</li>
     *   <li>Admin-only: /api/admin/** endpoints</li>
     * </ul>
     *
     * <p>Security Features:</p>
     * <ul>
     *   <li>CSRF disabled (JWT in HttpOnly cookie provides CSRF protection)</li>
     *   <li>Stateless sessions (no JSESSIONID)</li>
     *   <li>CORS enabled with configured origins</li>
     *   <li>Custom JWT authentication filter</li>
     * </ul>
     *
     * @param http the HttpSecurity to configure
     * @return the configured SecurityFilterChain
     * @throws Exception if configuration fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        logger.info("Configuring security filter chain");

        http
            // Disable CSRF as we use JWT tokens in HttpOnly cookies
            // The SameSite=Strict cookie attribute provides CSRF protection
            .csrf(AbstractHttpConfigurer::disable)

            // Configure CORS with application-specific settings
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Configure authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - no authentication required
                .requestMatchers(
                    "/api/auth/**",
                    "/api/public/**",
                    "/actuator/health",
                    "/error"
                ).permitAll()

                // Admin-only endpoints - ADMIN role required
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // User management - ADMIN or specific roles
                .requestMatchers(HttpMethod.GET, "/api/users/**").hasAnyRole("ADMIN", "VERIFIER", "UNDERWRITER", "BANKER")
                .requestMatchers(HttpMethod.POST, "/api/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/users/**").hasAnyRole("ADMIN", "BANKER")
                .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN")

                // Loan management - role-based access
                .requestMatchers(HttpMethod.GET, "/api/loans/**").hasAnyRole("APPLICANT", "VERIFIER", "UNDERWRITER", "BANKER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/loans/**").hasAnyRole("APPLICANT", "BANKER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/loans/**").hasAnyRole("VERIFIER", "UNDERWRITER", "BANKER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/loans/**").hasRole("ADMIN")

                // Products - accessible to all authenticated users
                .requestMatchers(HttpMethod.GET, "/api/products/**").authenticated()

                // Applications - role-based access
                .requestMatchers(HttpMethod.GET, "/api/applications/**").hasAnyRole("APPLICANT", "VERIFIER", "UNDERWRITER", "BANKER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/applications/**").hasAnyRole("APPLICANT", "BANKER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/applications/**").hasAnyRole("VERIFIER", "UNDERWRITER", "BANKER", "ADMIN")

                // Wallet - authenticated users
                .requestMatchers("/api/wallets/**").authenticated()

                // Repayment - role-based access
                .requestMatchers(HttpMethod.GET, "/api/repayment/my-schedules").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/repayment/**").hasAnyRole("BANKER", "VERIFIER", "UNDERWRITER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/repayment/**").hasAnyRole("BANKER", "ADMIN")

                // All other requests require authentication
                .anyRequest().authenticated()
            )

            // Configure stateless session management
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Set authentication provider
            .authenticationProvider(authenticationProvider())

            // Add JWT authentication filter before UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        logger.info("Security filter chain configured successfully");
        return http.build();
    }

    /**
     * Configures CORS to allow cross-origin requests from the frontend.
     *
     * <p>CORS Configuration:</p>
     * <ul>
     *   <li>Allowed origins: Configured via application.yml</li>
     *   <li>Allowed methods: GET, POST, PUT, DELETE, OPTIONS</li>
     *   <li>Credentials: Enabled for HttpOnly cookies</li>
     *   <li>Max age: 1 hour (reduces preflight requests)</li>
     * </ul>
     *
     * @return the configured CorsConfigurationSource
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        logger.debug("Configuring CORS with origins: {}", Arrays.toString(allowedOrigins));

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
        configuration.setAllowedMethods(Arrays.asList(allowedMethods));
        configuration.setAllowedHeaders(Arrays.asList(allowedHeaders.split(",")));
        configuration.setAllowCredentials(allowCredentials);
        configuration.setMaxAge(maxAge);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    /**
     * Password encoder bean using BCrypt with cost factor 12.
     *
     * <p>Security Properties:</p>
     * <ul>
     *   <li>Algorithm: BCrypt (adaptive hash function)</li>
     *   <li>Cost factor: 12 (2^12 = 4096 rounds)</li>
     *   <li>Salt: Automatically generated per password</li>
     *   <li>Resistant to: Rainbow table, brute force, timing attacks</li>
     * </ul>
     *
     * <p>Cost Factor Rationale:</p>
     * Cost factor 12 provides strong security while maintaining acceptable
     * performance (~200-300ms per hash on modern hardware). This balances
     * security against user experience during authentication.
     *
     * @return BCryptPasswordEncoder with cost factor 12
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        logger.info("Initializing BCrypt password encoder with cost factor 12");
        return new BCryptPasswordEncoder(12);
    }

    /**
     * Authentication provider that uses the custom UserDetailsService and password encoder.
     *
     * <p>Authentication Flow:</p>
     * <ol>
     *   <li>User submits credentials (email/password)</li>
     *   <li>CustomUserDetailsService loads user by email</li>
     *   <li>BCrypt password encoder verifies password</li>
     *   <li>Authentication token created on success</li>
     * </ol>
     *
     * @return configured DaoAuthenticationProvider
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        logger.debug("Configuring authentication provider");

        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    /**
     * Authentication manager bean for programmatic authentication.
     * Used by the authentication controller for login operations.
     *
     * @param config the authentication configuration
     * @return the authentication manager
     * @throws Exception if configuration fails
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        logger.debug("Initializing authentication manager");
        return config.getAuthenticationManager();
    }
}
