package com.loanweb.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for unified error responses across all controllers.
 *
 * <p>Handles the following exception types:</p>
 * <ul>
 *   <li>Security exceptions (authentication, authorization)</li>
 *   <li>Validation errors (bean validation)</li>
 *   <li>Business logic exceptions</li>
 *   <li>Unexpected server errors</li>
 * </ul>
 *
 * <p>Error Response Format:</p>
 * <pre>
 * {
 *   "error": {
 *     "code": "ERROR_CODE",
 *     "message": "Human-readable error message",
 *     "details": { ... },
 *     "timestamp": "2025-01-28T10:30:00",
 *     "path": "/api/resource"
 *   }
 * }
 * </pre>
 *
 * <p>Security Considerations:</p>
 * <ul>
 *   <li>Never expose sensitive information in error messages</li>
 *   <li>Log full exception details for debugging</li>
 *   <li>Return generic messages for security exceptions</li>
 *   <li>Use appropriate HTTP status codes</li>
 * </ul>
 *
 * @author PDM Security Team
 * @version 1.0
 * @since 2025-01-28
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Handles AccessDeniedException (403 Forbidden).
     *
     * <p>Thrown when:</p>
     * <ul>
     *   <li>User attempts to access resources they don't own</li>
     *   <li>User lacks required role for an operation</li>
     *   <li>Authorization checks fail</li>
     * </ul>
     *
     * @param ex the AccessDeniedException
     * @param request the web request
     * @return error response with 403 status
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(
            AccessDeniedException ex,
            WebRequest request) {

        log.warn("Access denied: {} - Path: {}", ex.getMessage(), request.getDescription(false));

        Map<String, Object> error = buildErrorResponse(
            "ACCESS_DENIED",
            ex.getMessage() != null ? ex.getMessage() : "You do not have permission to access this resource",
            request
        );

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    /**
     * Handles UsernameNotFoundException (404 Not Found).
     *
     * <p>Thrown when:</p>
     * <ul>
     *   <li>User tries to authenticate with non-existent email</li>
     *   <li>User reference is not found in database</li>
     * </ul>
     *
     * <p>Security Note:</p>
     * For authentication flows, this should return a generic message to prevent
     * user enumeration attacks. The specific message is logged but not exposed.
     *
     * @param ex the UsernameNotFoundException
     * @param request the web request
     * @return error response with 404 status
     */
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUsernameNotFoundException(
            UsernameNotFoundException ex,
            WebRequest request) {

        // Log the specific error for debugging
        log.warn("User not found: {} - Path: {}", ex.getMessage(), request.getDescription(false));

        // Return generic message to prevent user enumeration
        Map<String, Object> error = buildErrorResponse(
            "USER_NOT_FOUND",
            "The requested user was not found",
            request
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * Handles BadCredentialsException (401 Unauthorized).
     *
     * <p>Thrown when:</p>
     * <ul>
     *   <li>User provides incorrect password</li>
     *   <li>JWT token is invalid or expired</li>
     * </ul>
     *
     * <p>Security Note:</p>
     * Returns a generic message to prevent information leakage about
     * whether the username or password was incorrect.
     *
     * @param ex the BadCredentialsException
     * @param request the web request
     * @return error response with 401 status
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentialsException(
            BadCredentialsException ex,
            WebRequest request) {

        log.warn("Bad credentials: {} - Path: {}", ex.getMessage(), request.getDescription(false));

        Map<String, Object> error = buildErrorResponse(
            "INVALID_CREDENTIALS",
            "Invalid email or password",
            request
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    /**
     * Handles generic AuthenticationException (401 Unauthorized).
     *
     * <p>Covers all authentication failures not handled by more specific handlers.</p>
     *
     * @param ex the AuthenticationException
     * @param request the web request
     * @return error response with 401 status
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthenticationException(
            AuthenticationException ex,
            WebRequest request) {

        log.warn("Authentication failed: {} - Path: {}", ex.getMessage(), request.getDescription(false));

        Map<String, Object> error = buildErrorResponse(
            "AUTHENTICATION_FAILED",
            "Authentication failed. Please check your credentials and try again.",
            request
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    /**
     * Handles MethodArgumentNotValidException (400 Bad Request).
     *
     * <p>Thrown when:</p>
     * <ul>
     *   <li>Bean validation (@Valid) fails on request body</li>
     *   <li>Request parameters fail validation constraints</li>
     * </ul>
     *
     * <p>Returns detailed field-level validation errors to help clients
     * understand what needs to be corrected.</p>
     *
     * @param ex the MethodArgumentNotValidException
     * @param request the web request
     * @return error response with 400 status and validation details
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException ex,
            WebRequest request) {

        log.warn("Validation failed: {} errors - Path: {}",
            ex.getBindingResult().getErrorCount(),
            request.getDescription(false));

        Map<String, String> fieldErrors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = error instanceof FieldError
                ? ((FieldError) error).getField()
                : error.getObjectName();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.put(fieldName, errorMessage);

            log.debug("Validation error - Field: {}, Message: {}", fieldName, errorMessage);
        });

        Map<String, Object> error = buildErrorResponse(
            "VALIDATION_ERROR",
            "Request validation failed. Please check the provided data.",
            request
        );

        error.put("details", fieldErrors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handles IllegalArgumentException (400 Bad Request).
     *
     * <p>Thrown when:</p>
     * <ul>
     *   <li>Invalid business logic parameters are provided</li>
     *   <li>Precondition checks fail</li>
     * </ul>
     *
     * @param ex the IllegalArgumentException
     * @param request the web request
     * @return error response with 400 status
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(
            IllegalArgumentException ex,
            WebRequest request) {

        log.warn("Illegal argument: {} - Path: {}", ex.getMessage(), request.getDescription(false));

        Map<String, Object> error = buildErrorResponse(
            "INVALID_REQUEST",
            ex.getMessage() != null ? ex.getMessage() : "Invalid request parameters",
            request
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handles generic RuntimeException (500 Internal Server Error).
     *
     * <p>This is a catch-all handler for unexpected runtime exceptions
     * that aren't handled by more specific handlers.</p>
     *
     * <p>Security Note:</p>
     * Returns a generic error message to avoid exposing internal
     * implementation details. Full exception is logged for debugging.
     *
     * @param ex the RuntimeException
     * @param request the web request
     * @return error response with 500 status
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex,
            WebRequest request) {

        log.error("Runtime exception: {} - Path: {}",
            ex.getMessage(),
            request.getDescription(false),
            ex);

        Map<String, Object> error = buildErrorResponse(
            "INTERNAL_SERVER_ERROR",
            "An unexpected error occurred. Please try again later.",
            request
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    /**
     * Handles all other uncaught exceptions (500 Internal Server Error).
     *
     * <p>This is the final catch-all handler for any exceptions not
     * handled by more specific handlers.</p>
     *
     * @param ex the Exception
     * @param request the web request
     * @return error response with 500 status
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(
            Exception ex,
            WebRequest request) {

        log.error("Unhandled exception: {} - Path: {}",
            ex.getMessage(),
            request.getDescription(false),
            ex);

        Map<String, Object> error = buildErrorResponse(
            "INTERNAL_SERVER_ERROR",
            "An unexpected error occurred. Please contact support if the problem persists.",
            request
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    /**
     * Builds a standardized error response object.
     *
     * @param code the error code
     * @param message the error message
     * @param request the web request
     * @return the error response map
     */
    private Map<String, Object> buildErrorResponse(String code, String message, WebRequest request) {
        Map<String, Object> error = new HashMap<>();
        error.put("code", code);
        error.put("message", message);
        error.put("timestamp", LocalDateTime.now().toString());
        error.put("path", extractPath(request));

        return Map.of("error", error);
    }

    /**
     * Extracts the request path from WebRequest description.
     *
     * @param request the web request
     * @return the request path
     */
    private String extractPath(WebRequest request) {
        String description = request.getDescription(false);
        return description.replace("uri=", "");
    }
}
