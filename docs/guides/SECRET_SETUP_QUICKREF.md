# Secret Setup Quick Reference Card

**Quick guide for new developers** | Full docs: [SECRET_MANAGEMENT.md](./SECRET_MANAGEMENT.md)

---

## First Time Setup (5 minutes)

### Backend

```bash
cd pdm-backend
cp .env.example .env
```

Generate secrets:
```bash
openssl rand -base64 64  # Copy output for JWT_SECRET
openssl rand -base64 32  # Copy output for DB_PASSWORD
openssl rand -base64 32  # Copy output for MYSQL_ROOT_PASSWORD
```

Edit `.env` and paste the generated values:
```bash
nano .env  # or use your editor
```

### Frontend

```bash
cd pdm-frontend
cp .env.example .env.local
# Default values are fine for local dev
```

### Verify

```bash
# Should show both files are ignored
git check-ignore pdm-backend/.env pdm-frontend/.env.local

# Start and test
./start-backend.sh
curl http://localhost:8080/api/auth/health
```

---

## Current Secrets (Dev Only)

**Use these for local development:**

```env
DB_PASSWORD=YqoWvBsjSAO4SdFhkoBxU5RbnUcSudgsbSpnFyvfGz4=
MYSQL_ROOT_PASSWORD=Rg+ObovMrQWTertf9ze4vuO3j9pf4IAqaXRIXORSOYs=
JWT_SECRET=eYFf7710+jqbapnabBrnYG8CgHoscxTOV5R53qOGxHlcEpd0IrY1dJvegu00FW/wH9nVlMM5PpBvMrzmd/Gj8Q==
```

**Never use these in production!**

---

## Update Database Password

```sql
mysql -u root -p
# Enter MYSQL_ROOT_PASSWORD from .env

ALTER USER 'pdm_user'@'%' IDENTIFIED BY 'YqoWvBsjSAO4SdFhkoBxU5RbnUcSudgsbSpnFyvfGz4=';
FLUSH PRIVILEGES;
EXIT;
```

---

## Common Commands

```bash
# Generate new JWT secret
openssl rand -base64 64

# Generate new password
openssl rand -base64 32

# Check if .env is ignored
git check-ignore -v pdm-backend/.env

# Test API
curl http://localhost:8080/api/auth/health

# Test with full suite
./test-api-routes.sh
```

---

## File Locations

```
pdm-backend/
├── .env                 ← Your secrets (NOT in git)
└── .env.example         ← Template (in git)

pdm-frontend/
├── .env.local           ← Your config (NOT in git)
└── .env.example         ← Template (in git)
```

---

## Troubleshooting

### Backend won't start
- Check `.env` file exists
- Verify all secrets are filled in
- Check database is running: `mysql -h 127.0.0.1 -u pdm_user -p`

### Authentication fails
- JWT_SECRET must match in .env
- Restart backend after changing secrets

### Database connection fails
- Check DB_PASSWORD in .env
- Update MySQL password: see "Update Database Password" above

---

## Rules

- ❌ Never commit `.env` files
- ❌ Never share secrets in Slack/email
- ❌ Never use production secrets in dev
- ✅ Always use `.env.example` as template
- ✅ Always generate unique secrets per environment
- ✅ Always check `.gitignore` is working

---

## Help

1. Check [SECRET_MANAGEMENT.md](./SECRET_MANAGEMENT.md)
2. Ask in #dev-security Slack
3. Email: devops@pdm.com

---

**Updated:** 2025-11-26
