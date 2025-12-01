# 🔐 Secret Management Guide

## Overview

This document outlines how to securely manage secrets, credentials, and environment variables for the PDM Project.

**CRITICAL SECURITY RULES:**
- ❌ NEVER commit `.env` files to git
- ❌ NEVER hardcode secrets in source code
- ❌ NEVER share secrets via email, Slack, or unencrypted channels
- ✅ ALWAYS use `.env.example` templates without real values
- ✅ ALWAYS generate unique secrets for each environment
- ✅ ALWAYS rotate secrets immediately if compromised

---

## 🚀 Quick Setup for New Developers

### 1. Backend Setup

```bash
cd pdm-backend

# Copy the example environment file
cp .env.example .env

# Generate new JWT secret (512 bits)
openssl rand -base64 64

# Generate new database password (256 bits)
openssl rand -base64 32

# Generate new MySQL root password (256 bits)
openssl rand -base64 32

# Edit .env and paste the generated secrets
nano .env  # or use your preferred editor
```

Your `pdm-backend/.env` should look like:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=pdm-project
DB_USERNAME=pdm_user
DB_PASSWORD=<paste-generated-db-password-here>

# MySQL Root Password (for Docker Compose)
MYSQL_ROOT_PASSWORD=<paste-generated-root-password-here>

# JWT Configuration (512-bit cryptographically secure secret)
JWT_SECRET=<paste-generated-jwt-secret-here>

# Application Configuration
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=dev

# CORS Configuration (comma-separated origins)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:4000
```

### 2. Frontend Setup

```bash
cd pdm-frontend

# Copy the example environment file
cp .env.example .env.local

# Edit if needed (default is usually fine)
nano .env.local
```

Your `pdm-frontend/.env.local` should look like:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 3. Verify Setup

```bash
# Check that .env files are ignored by git
git check-ignore pdm-backend/.env pdm-frontend/.env.local

# Should output:
# pdm-backend/.env
# pdm-frontend/.env.local
```

---

## 🔑 Secret Generation Guidelines

### JWT Secret

**Requirements:**
- Minimum 512 bits (64 bytes) of randomness
- Base64 encoded for easy storage
- MUST be different for each environment

**Generation:**
```bash
openssl rand -base64 64
```

**Example Output:**
```
eYFf7710+jqbapnabBrnYG8CgHoscxTOV5R53qOGxHlcEpd0IrY1dJvegu00FW/wH9nVlMM5PpBvMrzmd/Gj8Q==
```

### Database Passwords

**Requirements:**
- Minimum 256 bits (32 bytes) of randomness
- Use different passwords for different databases/users
- Never use default passwords in production

**Generation:**
```bash
openssl rand -base64 32
```

**Example Output:**
```
YqoWvBsjSAO4SdFhkoBxU5RbnUcSudgsbSpnFyvfGz4=
```

---

## 📦 Environment-Specific Configuration

### Local Development
- Use `.env` (backend) and `.env.local` (frontend)
- Can use weaker secrets for faster development
- Still recommended to use generated secrets

### Staging/Testing
- Use `.env.staging` or environment variables
- Should mirror production security
- Use separate database from production

### Production
- **NEVER** use `.env` files in production
- Use cloud provider secret management:
  - AWS: AWS Secrets Manager or Parameter Store
  - Azure: Azure Key Vault
  - GCP: Google Secret Manager
  - Docker: Docker Secrets
- Enable secret rotation policies
- Use monitoring and alerting for secret access

---

## 🐳 Docker Compose Usage

The `docker-compose.yml` file now loads secrets from environment variables:

```yaml
environment:
  MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-changeme_root_password}
  MYSQL_DATABASE: ${DB_NAME:-pdm-project}
  MYSQL_USER: ${DB_USERNAME:-pdm_user}
  MYSQL_PASSWORD: ${DB_PASSWORD:-changeme_db_password}
```

**Usage:**

```bash
# Ensure .env file exists in pdm-backend directory
cd pdm-backend

# Docker Compose will automatically load .env file
docker-compose up -d

# Or explicitly specify env file
docker-compose --env-file .env up -d
```

---

## 🔄 Secret Rotation Process

### When to Rotate Secrets

- ✅ Immediately if compromised or suspected compromise
- ✅ After team member departure (if they had access)
- ✅ Quarterly for production environments (best practice)
- ✅ After security audit findings
- ✅ Before major production deployments

### How to Rotate Secrets

1. **Generate new secrets:**
   ```bash
   # New JWT secret
   openssl rand -base64 64

   # New DB password
   openssl rand -base64 32
   ```

2. **Update local .env file:**
   ```bash
   nano pdm-backend/.env
   # Replace old values with new generated secrets
   ```

3. **Update database password (if rotating DB credentials):**
   ```sql
   ALTER USER 'pdm_user'@'%' IDENTIFIED BY 'new_password_here';
   FLUSH PRIVILEGES;
   ```

4. **Restart services:**
   ```bash
   # Restart backend
   cd pdm-backend
   mvn spring-boot:run

   # Restart Docker services
   docker-compose down
   docker-compose up -d
   ```

5. **Verify functionality:**
   ```bash
   # Test API health
   curl http://localhost:8080/api/auth/health

   # Test authentication
   ./test-api-routes.sh
   ```

6. **Notify team:**
   - Send secure communication to team members
   - Update deployment documentation
   - Schedule production rotation window

---

## 🚨 Emergency Response: Compromised Secrets

### Immediate Actions (Within 1 Hour)

1. **Confirm the compromise:**
   - Check git history: `git log --all --full-history -- "*env*"`
   - Check if secrets are in any public repositories
   - Review access logs for unauthorized use

2. **Revoke compromised secrets:**
   - Generate new secrets immediately
   - Update all environments
   - Invalidate existing JWT tokens (restart backend)

3. **Update git history if secrets were committed:**
   ```bash
   # WARNING: This rewrites git history
   # Coordinate with team before running

   # Using git filter-repo (recommended)
   git filter-repo --path pdm-backend/.env --invert-paths
   git filter-repo --path pdm-frontend/.env.local --invert-paths

   # Force push (requires team coordination)
   git push origin --force --all
   ```

4. **Notify stakeholders:**
   - Development team
   - Security team
   - DevOps/Platform team
   - Management (if production affected)

### Follow-up Actions (Within 24 Hours)

- [ ] Document incident timeline
- [ ] Review and update access controls
- [ ] Audit all related systems for unauthorized access
- [ ] Update security training materials
- [ ] Schedule post-incident review

---

## 🧪 Testing Secret Configuration

### Verify .gitignore is Working

```bash
# Should show .env files are ignored
git check-ignore -v pdm-backend/.env pdm-frontend/.env.local

# Should return empty (no .env files tracked)
git ls-files | grep "\.env$"
```

### Verify Application Uses Secrets

```bash
# Backend should start without errors
cd pdm-backend
mvn spring-boot:run

# Check logs for successful JWT configuration
# Should see: "JWT Secret loaded: <first-10-chars>..."

# Test JWT generation
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pdm.com","password":"admin123"}'
```

### Verify Database Connection

```bash
# Connect to MySQL
mysql -h 127.0.0.1 -P 3306 -u pdm_user -p
# Enter password from .env file

# Should successfully connect and show databases
SHOW DATABASES;
USE pdm-project;
SHOW TABLES;
```

---

## 📋 Checklist for Production Deployment

- [ ] All secrets rotated and unique to production
- [ ] Secrets stored in cloud secret manager (not .env files)
- [ ] No hardcoded secrets in source code
- [ ] `.env` files not in Docker images
- [ ] Secret access logging enabled
- [ ] Backup of production secrets in secure vault
- [ ] Secret rotation schedule established
- [ ] Incident response plan documented
- [ ] Team trained on secret management
- [ ] Regular security audits scheduled

---

## 🔗 Additional Resources

- [OWASP Secret Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Spring Boot Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Docker Secrets Management](https://docs.docker.com/engine/swarm/secrets/)

---

## 📞 Support

If you have questions about secret management:

1. Check this document first
2. Ask in #dev-security Slack channel
3. Contact DevOps team: devops@pdm.com
4. For incidents: security@pdm.com (24/7)

---

**Last Updated:** 2025-11-26
**Version:** 1.0
**Owner:** DevOps/Security Team
