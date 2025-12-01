#!/bin/bash

# ============================================================================
# OLAVS Database Initialization Script
# This script creates the database, applies schema, and loads sample data
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="olavs_db"
DB_USER="${DB_USERNAME:-root}"
DB_PASS="${DB_PASSWORD:-}"
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}OLAVS Database Initialization${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}Error: MySQL client not found!${NC}"
    echo "Please install MySQL client first."
    exit 1
fi

# Prompt for password if not set
if [ -z "$DB_PASS" ]; then
    echo -e "${YELLOW}Enter MySQL password for user '$DB_USER':${NC}"
    read -s DB_PASS
    echo ""
fi

# Test MySQL connection
echo -e "${YELLOW}Testing MySQL connection...${NC}"
if ! mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" -e "SELECT 1;" &> /dev/null; then
    echo -e "${RED}Error: Cannot connect to MySQL!${NC}"
    echo "Please check your credentials and ensure MySQL is running."
    exit 1
fi
echo -e "${GREEN}✓ Connection successful${NC}"
echo ""

# Create database
echo -e "${YELLOW}Creating database '$DB_NAME'...${NC}"
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo -e "${GREEN}✓ Database created${NC}"
echo ""

# Apply schema
echo -e "${YELLOW}Applying database schema...${NC}"
echo "Choose schema version:"
echo "  1) Basic schema (6 tables) - schema.sql"
echo "  2) Extended schema (27 tables) - schema-extended.sql [RECOMMENDED]"
echo "  3) Skip schema (database already exists)"
read -p "Enter choice [2]: " schema_choice
schema_choice=${schema_choice:-2}

case $schema_choice in
    1)
        echo -e "${YELLOW}Applying basic schema...${NC}"
        mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" < schema.sql
        echo -e "${GREEN}✓ Basic schema applied${NC}"
        ;;
    2)
        echo -e "${YELLOW}Applying extended schema...${NC}"
        mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" < schema-extended.sql
        echo -e "${GREEN}✓ Extended schema applied${NC}"
        ;;
    3)
        echo -e "${YELLOW}Skipping schema...${NC}"
        ;;
    *)
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac
echo ""

# Load sample data
echo -e "${YELLOW}Loading sample data...${NC}"
echo "Choose data to load:"
echo "  1) Basic sample data - data.sql"
echo "  2) Extended sample data - data-extended.sql"
echo "  3) Realistic seed data - seed-realistic-data.sql [RECOMMENDED]"
echo "  4) Skip data loading"
read -p "Enter choice [3]: " data_choice
data_choice=${data_choice:-3}

case $data_choice in
    1)
        echo -e "${YELLOW}Loading basic sample data...${NC}"
        mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" < data.sql
        echo -e "${GREEN}✓ Basic data loaded${NC}"
        ;;
    2)
        echo -e "${YELLOW}Loading extended sample data...${NC}"
        mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" < data-extended.sql
        echo -e "${GREEN}✓ Extended data loaded${NC}"
        ;;
    3)
        echo -e "${YELLOW}Loading realistic seed data...${NC}"
        mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" < seed-realistic-data.sql
        echo -e "${GREEN}✓ Realistic data loaded${NC}"
        ;;
    4)
        echo -e "${YELLOW}Skipping data loading...${NC}"
        ;;
    *)
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac
echo ""

# Verify installation
echo -e "${YELLOW}Verifying installation...${NC}"
table_count=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DB_NAME';")
user_count=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" -N -e "SELECT COUNT(*) FROM users;")

echo -e "${GREEN}✓ Tables created: $table_count${NC}"
echo -e "${GREEN}✓ Users in database: $user_count${NC}"
echo ""

# Display test credentials
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}Database initialized successfully!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${YELLOW}Database Details:${NC}"
echo "  Host: $DB_HOST:$DB_PORT"
echo "  Database: $DB_NAME"
echo "  Tables: $table_count"
echo "  Sample Users: $user_count"
echo ""
echo -e "${YELLOW}Test Login Credentials:${NC}"
echo "  Email: applicant@example.com"
echo "  Password: password123"
echo ""
echo "  Email: admin@olavs.com"
echo "  Password: password123"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Update your .env file with these database credentials"
echo "  2. Start the backend: cd pdm-backend && ./mvnw spring-boot:run"
echo "  3. Start the frontend: cd pdm-frontend && npm run dev"
echo ""
echo -e "${GREEN}Done!${NC}"
