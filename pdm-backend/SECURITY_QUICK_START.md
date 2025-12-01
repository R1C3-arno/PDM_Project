# Spring Security Quick Start Guide

## Prerequisites
- Java 17 or higher
- Maven 3.6 or higher
- PostgreSQL 12 or higher
- Git

## Quick Setup (5 minutes)

### 1. Generate JWT Secret
```bash
# Generate a secure 512-bit secret key
openssl rand -base64 64
```

Copy the output for the next step.

### 2. Create Environment File
```bash
cd /Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-backend
cp .env.example .env
```

Edit `.env` and set these CRITICAL values:
```bash
# Database
DB_URL=jdbc:postgresql://localhost:5432/pdm_db
DB_USERNAME=postgres
DB_PASSWORD=your_actual_password

# JWT - PASTE YOUR GENERATED SECRET HERE
JWT_SECRET=<paste_your_generated_secret_here>
```

### 3. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE pdm_db;

# Exit psql
\q
```

### 4. Compile and Run
```bash
# Clean and compile
mvn clean compile

# Run application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

---

## Testing the Security

### 1. Health Check (Public Endpoint)
```bash
curl http://localhost:8080/actuator/health
```

Expected response:
```json
{"status":"UP"}
```

### 2. Protected Endpoint (Should Fail)
```bash
curl http://localhost:8080/api/users
```

Expected response: `401 Unauthorized` or `403 Forbidden`

---

## User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| APPLICANT | Loan applicant | View own loans, create loan applications |
| BANKER | Bank employee | Manage loans, view users |
| VERIFIER | Document verifier | Verify loan documents, view loans |
| UNDERWRITER | Risk assessor | Assess loan risk, approve/deny loans |
| ADMIN | System administrator | Full access to all resources |

---

## Security Features Enabled

✅ JWT authentication with HttpOnly cookies
✅ BCrypt password hashing (cost factor 12)
✅ Role-based access control (RBAC)
✅ CORS configuration for frontend
✅ Stateless session management
✅ CSRF protection via SameSite cookies
✅ Comprehensive security logging

---

## Common Issues

### Issue: Application won't start
**Cause**: Missing JWT_SECRET environment variable
**Solution**: Ensure `.env` file exists with valid JWT_SECRET

### Issue: Database connection failed
**Cause**: PostgreSQL not running or wrong credentials
**Solution**:
```bash
# Check PostgreSQL status
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# Test connection
psql -U postgres -d pdm_db -c "SELECT 1;"
```

### Issue: Unauthorized on protected endpoints
**Cause**: No valid JWT token in cookie
**Solution**: Authenticate via `/api/auth/login` first (to be implemented)

---

## Next Steps

1. Implement Authentication Controller (`/api/auth/login`, `/api/auth/register`)
2. Implement Authorization Service with `can(user, action, resource)` method
3. Add password hashing in User Service
4. Create integration tests
5. Add audit logging

---

## Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong, random value
- [ ] Use strong database password
- [ ] Enable HTTPS/TLS
- [ ] Set `CORS_ALLOWED_ORIGINS` to production frontend URL only
- [ ] Set `SHOW_SQL=false` and `LOG_LEVEL=INFO` in production
- [ ] Review all security logs
- [ ] Conduct security penetration testing
- [ ] Enable rate limiting
- [ ] Implement account lockout
- [ ] Add audit logging

---

## Support

For detailed documentation, see:
- `SPRING_SECURITY_IMPLEMENTATION.md` - Complete implementation details
- `SECRET_MANAGEMENT.md` - Security best practices
- Spring Security docs: https://docs.spring.io/spring-security/reference/

---

**Quick Start Version**: 1.0
**Last Updated**: 2025-11-27
