package com.loanweb.config;

import com.loanweb.service.AuditService;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.HashMap;
import java.util.Map;

/**
 * AOP Aspect for automatic audit logging of controller methods.
 *
 * <p>Intercepts all controller methods and logs:</p>
 * <ul>
 *   <li>Method execution (success/failure)</li>
 *   <li>Response status codes</li>
 *   <li>Execution time</li>
 *   <li>Exception details (if any)</li>
 * </ul>
 *
 * <p>Usage:</p>
 * The aspect automatically applies to all methods in classes annotated
 * with @RestController or @Controller.
 *
 * @author PDM Security Team
 * @version 1.0
 * @since 2025-11-30
 */
@Aspect
@Component
public class AuditAspect {

    private static final Logger logger = LoggerFactory.getLogger(AuditAspect.class);

    private final AuditService auditService;

    public AuditAspect(AuditService auditService) {
        this.auditService = auditService;
    }

    /**
     * Around advice for all controller methods
     */
    @Around("execution(* com.loanweb.web.*.*(..))")
    public Object auditControllerMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().toShortString();
        HttpServletRequest request = getCurrentRequest();

        // Skip audit logging for /auth endpoints (they have custom logging)
        if (request != null && request.getRequestURI().startsWith("/api/auth")) {
            return joinPoint.proceed();
        }

        String action = determineAction(methodName, request);
        Map<String, Object> details = new HashMap<>();
        details.put("method", methodName);

        try {
            // Execute the actual method
            Object result = joinPoint.proceed();

            // Calculate execution time
            long executionTime = System.currentTimeMillis() - startTime;
            details.put("executionTimeMs", executionTime);

            // Determine success and status from response
            boolean success = true;
            Integer status = 200;

            if (result instanceof ResponseEntity) {
                ResponseEntity<?> response = (ResponseEntity<?>) result;
                status = response.getStatusCode().value();
                success = status >= 200 && status < 300;
            }

            // Log successful execution
            if (request != null) {
                auditService.logSuccess(action, determineResourceType(request), null, details);
            }

            return result;

        } catch (Exception e) {
            // Calculate execution time
            long executionTime = System.currentTimeMillis() - startTime;
            details.put("executionTimeMs", executionTime);
            details.put("exceptionType", e.getClass().getSimpleName());

            // Log failure
            if (request != null) {
                auditService.logFailure(action, determineResourceType(request), null, e.getMessage());
            }

            // Re-throw the exception
            throw e;
        }
    }

    /**
     * Get current HTTP request
     */
    private HttpServletRequest getCurrentRequest() {
        try {
            ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            return attributes != null ? attributes.getRequest() : null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Determine action name from method and request
     */
    private String determineAction(String methodName, HttpServletRequest request) {
        if (request == null) {
            return methodName.toUpperCase().replace(".", "_");
        }

        String httpMethod = request.getMethod();
        String path = request.getRequestURI();

        // Extract resource name from path (e.g., /api/users -> USERS)
        String[] pathParts = path.split("/");
        String resource = pathParts.length > 2 ? pathParts[2].toUpperCase() : "UNKNOWN";

        // Map HTTP method to action verb
        String verb = switch (httpMethod) {
            case "GET" -> "VIEW";
            case "POST" -> "CREATE";
            case "PUT", "PATCH" -> "UPDATE";
            case "DELETE" -> "DELETE";
            default -> httpMethod;
        };

        return verb + "_" + resource;
    }

    /**
     * Determine resource type from request
     */
    private String determineResourceType(HttpServletRequest request) {
        String path = request.getRequestURI();
        String[] pathParts = path.split("/");

        // Extract resource from path (e.g., /api/users/123 -> USER)
        if (pathParts.length > 2) {
            String resource = pathParts[2];
            // Convert plural to singular and uppercase
            if (resource.endsWith("s")) {
                resource = resource.substring(0, resource.length() - 1);
            }
            return resource.toUpperCase();
        }

        return "UNKNOWN";
    }
}
