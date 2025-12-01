#!/bin/bash

echo "🔄 Seeding local PDM database..."

# The database name from application.yml
DB_NAME="pdm-project"

# Check if database exists, if not create it
mysql -u root -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;"

echo "📝 Applying schema..."
mysql -u root ${DB_NAME} < pdm-backend/src/main/resources/schema-extended.sql

echo "📥 Loading seed data..."
mysql -u root ${DB_NAME} < seed-more-data.sql

echo "✅ Database seeded successfully!"
echo ""
echo "👥 Test Credentials (all use password: password123):"
echo "   Admin:       admin@loanweb.com"
echo "   Banker:      banker1@loanweb.com"
echo "   Verifier:    verifier1@loanweb.com"
echo "   Underwriter: underwriter1@loanweb.com"  
echo "   Applicant:   applicant1@example.com"
