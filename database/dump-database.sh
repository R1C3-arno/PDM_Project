#!/bin/bash

# ============================================================================
# OLAVS Database Dump Script
# This script creates a backup of the database
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
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}OLAVS Database Backup${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

# Check if MySQL is installed
if ! command -v mysqldump &> /dev/null; then
    echo -e "${RED}Error: mysqldump not found!${NC}"
    echo "Please install MySQL client tools first."
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

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
    exit 1
fi
echo -e "${GREEN}✓ Connection successful${NC}"
echo ""

# Choose backup type
echo -e "${YELLOW}Choose backup type:${NC}"
echo "  1) Full backup (schema + data)"
echo "  2) Schema only (no data)"
echo "  3) Data only (no schema)"
read -p "Enter choice [1]: " backup_type
backup_type=${backup_type:-1}

# Set filename based on backup type
case $backup_type in
    1)
        FILENAME="olavs_full_backup_${TIMESTAMP}.sql"
        DUMP_OPTIONS=""
        ;;
    2)
        FILENAME="olavs_schema_only_${TIMESTAMP}.sql"
        DUMP_OPTIONS="--no-data"
        ;;
    3)
        FILENAME="olavs_data_only_${TIMESTAMP}.sql"
        DUMP_OPTIONS="--no-create-info"
        ;;
    *)
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

BACKUP_FILE="$BACKUP_DIR/$FILENAME"

# Create backup
echo -e "${YELLOW}Creating backup...${NC}"
mysqldump -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    --extended-insert \
    $DUMP_OPTIONS \
    "$DB_NAME" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backup created successfully${NC}"
else
    echo -e "${RED}Error: Backup failed${NC}"
    exit 1
fi

# Get file size
FILE_SIZE=$(ls -lh "$BACKUP_FILE" | awk '{print $5}')

# Compress backup
echo -e "${YELLOW}Compressing backup...${NC}"
gzip "$BACKUP_FILE"
COMPRESSED_FILE="${BACKUP_FILE}.gz"
COMPRESSED_SIZE=$(ls -lh "$COMPRESSED_FILE" | awk '{print $5}')
echo -e "${GREEN}✓ Backup compressed${NC}"
echo ""

# Display summary
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}Backup completed successfully!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${YELLOW}Backup Details:${NC}"
echo "  File: $COMPRESSED_FILE"
echo "  Original Size: $FILE_SIZE"
echo "  Compressed Size: $COMPRESSED_SIZE"
echo "  Database: $DB_NAME"
echo "  Timestamp: $TIMESTAMP"
echo ""

# Display restore instructions
echo -e "${YELLOW}To restore this backup:${NC}"
echo "  gunzip $COMPRESSED_FILE"
echo "  mysql -u$DB_USER -p $DB_NAME < $BACKUP_FILE"
echo ""

# Ask if user wants to create a quick restore script
read -p "Create a quick restore script? [y/N]: " create_restore
if [[ $create_restore =~ ^[Yy]$ ]]; then
    RESTORE_SCRIPT="$BACKUP_DIR/restore_${TIMESTAMP}.sh"
    cat > "$RESTORE_SCRIPT" << EOF
#!/bin/bash
# Restore script for OLAVS database backup: $TIMESTAMP

gunzip -c "$COMPRESSED_FILE" | mysql -u$DB_USER -p$DB_NAME
echo "Database restored from backup: $TIMESTAMP"
EOF
    chmod +x "$RESTORE_SCRIPT"
    echo -e "${GREEN}✓ Restore script created: $RESTORE_SCRIPT${NC}"
fi

echo ""
echo -e "${GREEN}Done!${NC}"
