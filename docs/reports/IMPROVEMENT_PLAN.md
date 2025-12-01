# PDM System Improvement Plan
**AI Agent Task List**

**Priority:** High-Impact First

---

## 🎯 QUICK WINS - Immediate Value

### 1. Add Missing Messaging System
**Impact:** High | **Complexity:** Medium

**Backend Tasks:**
```bash
# Create Message entity
pdm-backend/src/main/java/com/pdm/domain/message/Message.java
- Fields: id, sender_id, recipient_id, subject, body, read_status, created_at
- Relationships: @ManyToOne to User (sender and recipient)

# Create Message repository
pdm-backend/src/main/java/com/pdm/domain/message/MessageRepository.java
- findBySenderId(Long senderId)
- findByRecipientId(Long recipientId)
- findByRecipientIdAndReadStatus(Long recipientId, boolean readStatus)

# Create Message service
pdm-backend/src/main/java/com/pdm/service/MessageService.java
- sendMessage(SendMessageRequest request)
- getInbox(Long userId)
- getSent(Long userId)
- markAsRead(Long messageId)
- getUnreadCount(Long userId)

# Create Message controller
pdm-backend/src/main/java/com/pdm/web/MessageController.java
- POST /api/messages
- GET /api/messages/inbox
- GET /api/messages/sent
- PUT /api/messages/{id}/read
- GET /api/messages/unread-count
```

**Frontend Tasks:**
```bash
# Create message pages
pdm-frontend/app/(applicant)/messages/page.tsx
pdm-frontend/app/(banker)/messages/page.tsx
pdm-frontend/app/(admin)/messages/page.tsx

# Create message components
pdm-frontend/components/messaging/MessageList.tsx
pdm-frontend/components/messaging/MessageCard.tsx
pdm-frontend/components/messaging/ComposeMessage.tsx
pdm-frontend/components/messaging/MessageThread.tsx

# Add unread badge to navbar
pdm-frontend/components/layout/Navbar.tsx
- Add useUnreadCount hook
- Display badge with count
```

---

### 2. Implement Real-Time Notifications
**Impact:** High | **Complexity:** Medium

**Backend Tasks:**
```java
// Add SSE endpoint
pdm-backend/src/main/java/com/pdm/web/NotificationController.java

@GetMapping(value = "/api/notifications/stream", produces = "text/event-stream")
public SseEmitter streamNotifications(@AuthenticationPrincipal User user) {
    SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
    notificationService.subscribe(user.getId(), emitter);
    return emitter;
}

// Create notification broadcaster
pdm-backend/src/main/java/com/pdm/service/NotificationBroadcaster.java
- Map<Long, List<SseEmitter>> userEmitters
- subscribe(Long userId, SseEmitter emitter)
- broadcast(Long userId, Notification notification)
- cleanup expired emitters
```

**Frontend Tasks:**
```typescript
// Replace polling with SSE
pdm-frontend/hooks/useNotifications.ts

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/notifications/stream');

    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications(prev => [notification, ...prev]);
    };

    eventSource.onerror = () => {
      eventSource.close();
      // Retry connection after 5s
    };

    return () => eventSource.close();
  }, []);

  return notifications;
}
```

---

### 3. Add Loan Calculator to All Portals
**Impact:** Medium | **Complexity:** Low

**Tasks:**
```bash
# Extract shared calculator component
pdm-frontend/components/shared/LoanCalculator.tsx
- EMI calculation with formula display
- Comparison table (different terms/rates)
- Amortization schedule
- Export to PDF button

# Add to portals
pdm-frontend/app/(applicant)/calculator/page.tsx (enhance existing)
pdm-frontend/app/(banker)/calculator/page.tsx (new)
pdm-frontend/app/(underwriter)/calculator/page.tsx (new - with risk overlay)

# Create calculation utilities
pdm-frontend/lib/calculations.ts
- calculateEMI(principal, rate, months)
- generateAmortizationSchedule(principal, rate, months)
- calculateTotalInterest(principal, rate, months)
```

---

### 4. Dark Mode
**Impact:** Medium | **Complexity:** Low

**Tasks:**
```bash
# Install next-themes
cd pdm-frontend && npm install next-themes

# Add theme provider
pdm-frontend/app/layout.tsx
- Wrap with <ThemeProvider attribute="class" defaultTheme="system">

# Create theme toggle
pdm-frontend/components/shared/ThemeToggle.tsx
- useTheme hook
- Toggle button with sun/moon icons
- Persist preference in localStorage

# Update Tailwind config
pdm-frontend/tailwind.config.ts
- Add dark mode variants
- Update color palette for dark theme

# Add dark mode styles
pdm-frontend/app/globals.css
- :root and .dark CSS variables
- Dark mode color scheme
```

---

### 5. Rate Limiting & DDoS Protection
**Impact:** High | **Complexity:** Low

**Backend Tasks:**
```java
// Add rate limiting dependency
pom.xml
<dependency>
    <groupId>com.github.vladimir-bukhtoyarov</groupId>
    <artifactId>bucket4j-core</artifactId>
    <version>8.0.1</version>
</dependency>

// Create rate limiter
pdm-backend/src/main/java/com/pdm/security/RateLimitFilter.java
- 100 requests per minute per user
- 10 login attempts per 15 minutes per IP
- 5 password reset requests per hour per email

// Add filter to security chain
pdm-backend/src/main/java/com/pdm/config/SecurityConfig.java
- addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)

// Create rate limit exception handler
pdm-backend/src/main/java/com/pdm/web/GlobalExceptionHandler.java
- @ExceptionHandler(RateLimitExceededException.class)
- Return 429 Too Many Requests
```

---

## 🚀 HIGH-IMPACT FEATURES

### 6. Document Upload with Preview & OCR
**Impact:** Very High | **Complexity:** High

**Backend Tasks:**
```java
// Add dependencies
pom.xml
<dependency>
    <groupId>net.sourceforge.tess4j</groupId>
    <artifactId>tess4j</artifactId>
    <version>5.7.0</version>
</dependency>
<dependency>
    <groupId>org.apache.pdfbox</groupId>
    <artifactId>pdfbox</artifactId>
    <version>3.0.0</version>
</dependency>

// Create OCR service
pdm-backend/src/main/java/com/pdm/service/OcrService.java
- extractTextFromImage(MultipartFile file)
- extractTextFromPdf(MultipartFile file)
- parseNationalId(String text) -> NationalIdData
- parseIncomeStatement(String text) -> IncomeData

// Enhance document service
pdm-backend/src/main/java/com/pdm/service/DocumentService.java
- uploadDocument(MultipartFile file, DocumentType type, Long applicationId)
- compressImage(MultipartFile file) -> byte[]
- generateThumbnail(MultipartFile file) -> byte[]
- validateDocument(MultipartFile file) -> ValidationResult

// Add endpoints
pdm-backend/src/main/java/com/pdm/web/DocumentController.java
- POST /api/v2/documents/upload
- GET /api/v2/documents/{id}/preview
- POST /api/v2/documents/{id}/extract-text
- GET /api/v2/documents/application/{applicationId}
```

**Frontend Tasks:**
```bash
# Install dependencies
cd pdm-frontend
npm install react-dropzone tesseract.js pdfjs-dist

# Create upload component
pdm-frontend/components/documents/DocumentUploader.tsx
- Drag and drop zone
- File type validation (PDF, JPG, PNG)
- Size validation (max 10MB)
- Progress bar
- Multiple file upload

# Create preview component
pdm-frontend/components/documents/DocumentPreview.tsx
- Image preview with zoom
- PDF preview with page navigation
- OCR text overlay
- Download original button

# Create OCR component
pdm-frontend/components/documents/OcrExtractor.tsx
- Client-side OCR with Tesseract.js
- Auto-fill form fields from extracted text
- Manual correction interface
- Confidence score display

# Add document management page
pdm-frontend/app/(applicant)/applications/[id]/documents/page.tsx
- Upload documents
- View uploaded documents
- Delete documents
- Mark as verified (for staff)
```

---

### 7. Advanced Analytics Dashboard
**Impact:** High | **Complexity:** High

**Backend Tasks:**
```java
// Create analytics service
pdm-backend/src/main/java/com/pdm/service/AnalyticsService.java
- getApplicationFunnelData(LocalDate startDate, LocalDate endDate)
- getAverageProcessingTime() -> Map<ApplicationStatus, Duration>
- getRiskDistribution() -> Map<RiskCategory, Long>
- getDefaultRateTrend() -> List<TrendData>
- getRevenueProjection() -> List<ProjectionData>
- getUserGrowthMetrics() -> GrowthData

// Create analytics controller
pdm-backend/src/main/java/com/pdm/web/AnalyticsController.java
- GET /api/analytics/funnel
- GET /api/analytics/processing-time
- GET /api/analytics/risk-distribution
- GET /api/analytics/default-rate
- GET /api/analytics/revenue
- GET /api/analytics/user-growth

// Create database views for performance
pdm-backend/src/main/resources/db/migration/V10__Analytics_Views.sql
- CREATE VIEW vw_application_funnel
- CREATE VIEW vw_monthly_revenue
- CREATE VIEW vw_user_growth
```

**Frontend Tasks:**
```bash
# Install chart library
cd pdm-frontend
npm install recharts

# Create analytics page
pdm-frontend/app/(admin)/analytics/page.tsx
- Grid layout with multiple charts
- Date range selector
- Export to PDF/CSV

# Create chart components
pdm-frontend/components/analytics/FunnelChart.tsx
pdm-frontend/components/analytics/LineChart.tsx (trends)
pdm-frontend/components/analytics/PieChart.tsx (risk distribution)
pdm-frontend/components/analytics/BarChart.tsx (comparisons)
pdm-frontend/components/analytics/KpiCard.tsx (big numbers)

# Create banker analytics
pdm-frontend/app/(banker)/analytics/page.tsx
- Personal performance metrics
- Team comparison
- Monthly goals tracker

# Create utilities
pdm-frontend/lib/analytics.ts
- formatCurrency(amount)
- calculatePercentageChange(current, previous)
- generateExportData(chartData)
```

---

### 8. Email & SMS Notifications
**Impact:** High | **Complexity:** Medium

**Backend Tasks:**
```java
// Add dependencies
pom.xml
<dependency>
    <groupId>com.sendgrid</groupId>
    <artifactId>sendgrid-java</artifactId>
    <version>4.9.3</version>
</dependency>
<dependency>
    <groupId>com.twilio.sdk</groupId>
    <artifactId>twilio</artifactId>
    <version>9.14.1</version>
</dependency>

// Create email service
pdm-backend/src/main/java/com/pdm/service/EmailService.java
- sendWelcomeEmail(User user)
- sendApplicationSubmittedEmail(Application app)
- sendDocumentsRequestedEmail(Application app)
- sendOfferReadyEmail(Offer offer)
- sendPaymentReminderEmail(Installment installment)
- sendPaymentOverdueEmail(Installment installment)

// Create SMS service
pdm-backend/src/main/java/com/pdm/service/SmsService.java
- sendVerificationCode(String phone, String code)
- sendPaymentReminder(String phone, Installment installment)
- sendOfferNotification(String phone, Offer offer)

// Create template engine
pdm-backend/src/main/resources/templates/email/
- welcome.html
- application-submitted.html
- documents-requested.html
- offer-ready.html
- payment-reminder.html
- payment-overdue.html

// Create notification config
pdm-backend/src/main/java/com/pdm/config/NotificationConfig.java
- SendGrid API key
- Twilio credentials
- Email sender address
- SMS sender number

// Add notification preferences
pdm-backend/src/main/java/com/pdm/domain/user/NotificationPreferences.java
- emailEnabled
- smsEnabled
- preferredChannels (EMAIL, SMS, IN_APP)
```

---

### 9. Two-Factor Authentication (2FA)
**Impact:** High | **Complexity:** Medium

**Backend Tasks:**
```java
// Add dependency
pom.xml
<dependency>
    <groupId>dev.samstevens.totp</groupId>
    <artifactId>totp</artifactId>
    <version>1.7.1</version>
</dependency>

// Create 2FA service
pdm-backend/src/main/java/com/pdm/service/TwoFactorService.java
- generateSecret(User user) -> String
- generateQrCodeUrl(User user, String secret) -> String
- verifyCode(User user, String code) -> boolean
- generateRecoveryCodes(User user) -> List<String>

// Add User fields
pdm-backend/src/main/java/com/pdm/domain/user/User.java
- twoFactorEnabled (boolean)
- twoFactorSecret (String, encrypted)
- recoveryCodes (List<String>, encrypted)
- trustedDevices (List<String>)

// Update login flow
pdm-backend/src/main/java/com/pdm/web/AuthController.java
- POST /api/auth/login (returns requiresTwoFactor flag)
- POST /api/auth/verify-2fa (verify code and complete login)
- POST /api/auth/2fa/enable (enable 2FA for user)
- POST /api/auth/2fa/disable (disable 2FA)
- GET /api/auth/2fa/qr-code (get QR code for setup)

// Create trusted device tracking
pdm-backend/src/main/java/com/pdm/security/TrustedDeviceService.java
- isTrustedDevice(String deviceId) -> boolean
- addTrustedDevice(String deviceId)
- removeTrustedDevice(String deviceId)
```

**Frontend Tasks:**
```bash
# Create 2FA setup page
pdm-frontend/app/(applicant)/profile/security/page.tsx
- Enable/disable 2FA toggle
- QR code display
- Manual secret key display
- Recovery codes download
- Trusted devices list

# Create 2FA verification page
pdm-frontend/app/auth/verify-2fa/page.tsx
- 6-digit code input
- "Trust this device" checkbox
- Use recovery code option

# Create components
pdm-frontend/components/auth/TwoFactorSetup.tsx
pdm-frontend/components/auth/TwoFactorVerify.tsx
pdm-frontend/components/auth/RecoveryCodes.tsx
```

---

### 10. Comprehensive Test Suite
**Impact:** Very High | **Complexity:** High

**Backend Tasks:**
```java
// Add test dependencies
pom.xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>

// Create unit tests for services
pdm-backend/src/test/java/com/pdm/service/ApplicationServiceTest.java
- testCreateApplication()
- testSubmitApplication()
- testTransitionStatus()
- testInvalidStateTransition()

pdm-backend/src/test/java/com/pdm/service/RiskAssessmentServiceTest.java
- testCalculateCreditScore()
- testCalculateDtiRatio()
- testGenerateRiskCategory()

// Create integration tests
pdm-backend/src/test/java/com/pdm/web/ApplicationControllerIT.java
- testCreateApplicationEndpoint()
- testGetApplicationEndpoint()
- testSubmitApplicationEndpoint()
- testAuthorization()

// Create repository tests
pdm-backend/src/test/java/com/pdm/domain/application/ApplicationRepositoryTest.java
- testFindByApplicantId()
- testFindByStatus()
- testCustomQueries()

// Test configuration
pdm-backend/src/test/resources/application-test.yml
- H2 in-memory database
- Test data fixtures
```

**Frontend Tasks:**
```bash
# Install test dependencies
cd pdm-frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom

# Configure Jest
pdm-frontend/jest.config.js
- Setup test environment
- Configure module aliases
- Add coverage thresholds (80%)

# Create component tests
pdm-frontend/__tests__/components/LoanApplicationForm.test.tsx
- Renders form correctly
- Validates input fields
- Submits form with valid data
- Shows error messages

pdm-frontend/__tests__/components/LoanCalculator.test.tsx
- Calculates EMI correctly
- Updates on input change
- Displays amortization schedule

# Create page tests
pdm-frontend/__tests__/pages/applicant/dashboard.test.tsx
- Renders dashboard
- Displays user data
- Shows application list

# Create E2E tests with Playwright
pdm-frontend/e2e/loan-application.spec.ts
- Complete loan application flow
- Login -> Create Application -> Upload Documents -> Submit
```

---

## 🏗️ INFRASTRUCTURE

### 11. Containerization with Docker
**Impact:** Medium-High | **Complexity:** Medium

**Tasks:**
```bash
# Create Dockerfile for backend
pdm-backend/Dockerfile

FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

# Create Dockerfile for frontend
pdm-frontend/Dockerfile

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/package*.json ./
COPY --from=build /app/public ./public
RUN npm ci --production
EXPOSE 4000
CMD ["npm", "start"]

# Create docker-compose.yml
docker-compose.yml

version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: pdm-project
      MYSQL_USER: pdm_user
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/schema.sql:/docker-entrypoint-initdb.d/1-schema.sql
      - ./database/seed.sql:/docker-entrypoint-initdb.d/2-seed.sql
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./pdm-backend
    depends_on:
      mysql:
        condition: service_healthy
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/pdm-project
      SPRING_DATASOURCE_USERNAME: pdm_user
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "8080:8080"
    volumes:
      - ./uploads:/app/uploads

  frontend:
    build: ./pdm-frontend
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8080/api
    ports:
      - "4000:4000"

volumes:
  mysql_data:

# Create .env.example
.env.example

DB_PASSWORD=your_secure_password_here
DB_ROOT_PASSWORD=your_root_password_here
JWT_SECRET=your_jwt_secret_here

# Create start script
start-docker.sh

#!/bin/bash
docker-compose up -d
docker-compose logs -f
```

---

### 12. CI/CD Pipeline
**Impact:** Medium-High | **Complexity:** Medium

**Tasks:**
```yaml
# Create GitHub Actions workflow
.github/workflows/ci-cd.yml

name: CI/CD Pipeline

on:
  push:
    branches: [main, deployment]
  pull_request:
    branches: [main]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Cache Maven packages
        uses: actions/cache@v3
        with:
          path: ~/.m2
          key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}

      - name: Run tests
        run: cd pdm-backend && mvn test

      - name: Build JAR
        run: cd pdm-backend && mvn package -DskipTests

      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: backend-jar
          path: pdm-backend/target/*.jar

  frontend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: pdm-frontend/package-lock.json

      - name: Install dependencies
        run: cd pdm-frontend && npm ci

      - name: Run lint
        run: cd pdm-frontend && npm run lint

      - name: Run tests
        run: cd pdm-frontend && npm test

      - name: Build
        run: cd pdm-frontend && npm run build

      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: frontend-build
          path: pdm-frontend/.next

  deploy:
    needs: [backend-test, frontend-test]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v3

      - name: Deploy to production
        run: |
          # Deploy using your preferred method
          # SSH to server, Docker, Railway, etc.
```

---

### 13. Database Backup & Migration System
**Impact:** Critical | **Complexity:** Low

**Tasks:**
```bash
# Create backup script
scripts/backup-database.sh

#!/bin/bash
set -e

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/pdm"
DB_NAME="pdm-project"
DB_USER="pdm_user"
DB_PASSWORD="${DB_PASSWORD}"
RETENTION_DAYS=30

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Dump database
mysqldump -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > ${BACKUP_DIR}/pdm_${DATE}.sql

# Compress backup
gzip ${BACKUP_DIR}/pdm_${DATE}.sql

# Upload to S3 (optional)
# aws s3 cp ${BACKUP_DIR}/pdm_${DATE}.sql.gz s3://your-bucket/backups/

# Remove old backups
find ${BACKUP_DIR} -name "pdm_*.sql.gz" -mtime +${RETENTION_DAYS} -delete

echo "Backup completed: pdm_${DATE}.sql.gz"

# Create restore script
scripts/restore-database.sh

#!/bin/bash
set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <backup-file>"
    exit 1
fi

BACKUP_FILE=$1
DB_NAME="pdm-project"
DB_USER="pdm_user"
DB_PASSWORD="${DB_PASSWORD}"

# Restore database
gunzip < ${BACKUP_FILE} | mysql -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME}

echo "Database restored from: ${BACKUP_FILE}"

# Set up cron job
# Add to crontab: 0 2 * * * /path/to/backup-database.sh

# Create Flyway migrations
pdm-backend/src/main/resources/db/migration/V1__Initial_Schema.sql
pdm-backend/src/main/resources/db/migration/V2__Add_Messages_Table.sql
pdm-backend/src/main/resources/db/migration/V3__Add_2FA_Fields.sql
pdm-backend/src/main/resources/db/migration/V4__Add_Analytics_Views.sql

# Add Flyway to pom.xml
pom.xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId>
</dependency>
```

---

### 14. Application Performance Monitoring
**Impact:** High | **Complexity:** Medium

**Backend Tasks:**
```java
// Add dependencies
pom.xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>

// Configure actuator
pdm-backend/src/main/resources/application.yml

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true

// Create custom metrics
pdm-backend/src/main/java/com/pdm/monitoring/MetricsService.java
- recordApplicationCreated()
- recordApplicationApproved()
- recordApplicationRejected()
- recordLoanDisbursed(BigDecimal amount)
- recordPaymentReceived(BigDecimal amount)

// Add method timing
pdm-backend/src/main/java/com/pdm/service/ApplicationService.java
@Timed(value = "application.create", description = "Time to create application")
public ApplicationDTO createApplication(CreateApplicationRequest request) {
    // ...
}
```

**Monitoring Setup:**
```yaml
# Create Prometheus config
monitoring/prometheus.yml

global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'pdm-backend'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['backend:8080']

# Create Grafana dashboard
monitoring/grafana-dashboard.json
- Application metrics
- API response times (p50, p95, p99)
- Error rates
- Database query performance
- Business metrics (loans, revenue)

# Add to docker-compose
docker-compose.yml

services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  grafana_data:
```

---

### 15. Error Tracking & Logging
**Impact:** High | **Complexity:** Low

**Backend Tasks:**
```java
// Add Sentry dependency
pom.xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-spring-boot-starter-jakarta</artifactId>
    <version>7.0.0</version>
</dependency>

// Configure Sentry
pdm-backend/src/main/resources/application.yml

sentry:
  dsn: ${SENTRY_DSN}
  environment: ${SPRING_PROFILES_ACTIVE}
  traces-sample-rate: 1.0

// Enhance exception handler
pdm-backend/src/main/java/com/pdm/web/GlobalExceptionHandler.java

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e, HttpServletRequest request) {
        log.error("Unhandled exception", e);

        // Capture to Sentry
        Sentry.captureException(e);

        // Add context
        Sentry.setUser(getCurrentUser());
        Sentry.setTag("endpoint", request.getRequestURI());

        return ResponseEntity.internalServerError()
            .body(new ErrorResponse("Internal server error"));
    }
}
```

**Frontend Tasks:**
```typescript
// Install Sentry
cd pdm-frontend
npm install @sentry/nextjs

// Configure Sentry
pdm-frontend/sentry.client.config.ts

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  beforeSend(event, hint) {
    // Add user context
    if (user) {
      event.user = {
        id: user.id,
        email: user.email,
        role: user.role
      };
    }
    return event;
  }
});

// Add error boundary
pdm-frontend/app/error.tsx

'use client';
import * as Sentry from "@sentry/nextjs";
import { useEffect } from 'react';

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => window.location.reload()}>Try again</button>
    </div>
  );
}
```

---

## 🎨 UX IMPROVEMENTS

### 16. Progressive Web App (PWA)
**Impact:** High | **Complexity:** Low

**Tasks:**
```bash
# Install next-pwa
cd pdm-frontend
npm install next-pwa

# Configure PWA
pdm-frontend/next.config.ts

import withPWA from 'next-pwa';

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

# Create manifest
pdm-frontend/public/manifest.json

{
  "name": "PDM Loan Management",
  "short_name": "PDM Loans",
  "description": "Professional loan management system",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0066cc",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}

# Add to layout
pdm-frontend/app/layout.tsx

export const metadata = {
  manifest: '/manifest.json',
  themeColor: '#0066cc'
};

# Create service worker
pdm-frontend/public/sw.js
- Cache static assets
- Cache API responses
- Offline fallback page
- Background sync for forms
```

---

### 17. Multi-Language Support (i18n)
**Impact:** Medium | **Complexity:** Medium

**Tasks:**
```bash
# Install next-intl
cd pdm-frontend
npm install next-intl

# Configure i18n
pdm-frontend/i18n.ts

import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}));

# Create translation files
pdm-frontend/messages/en.json
pdm-frontend/messages/vi.json
pdm-frontend/messages/fr.json

{
  "common": {
    "welcome": "Welcome",
    "login": "Login",
    "logout": "Logout"
  },
  "dashboard": {
    "title": "Dashboard",
    "applications": "Applications",
    "loans": "Loans"
  },
  "applications": {
    "create": "Create Application",
    "submit": "Submit",
    "amount": "Loan Amount"
  }
}

# Update components
pdm-frontend/components/dashboard/Stats.tsx

import { useTranslations } from 'next-intl';

export function Stats() {
  const t = useTranslations('dashboard');
  return <h1>{t('title')}</h1>;
}

# Add language selector
pdm-frontend/components/layout/LanguageSelector.tsx
- Dropdown with flags
- Store preference in cookie
- Reload page on change
```

---

### 18. Enhanced Audit Logging
**Impact:** Medium-High | **Complexity:** Medium

**Backend Tasks:**
```java
// Create audit log entity
pdm-backend/src/main/java/com/pdm/domain/audit/AuditLog.java

@Entity
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;          // e.g., "CREATE_APPLICATION"
    private String entityType;      // e.g., "Application"
    private Long entityId;
    private Long userId;
    private String username;
    private String ipAddress;
    private String userAgent;
    private LocalDateTime timestamp;
    private String status;          // SUCCESS, FAILED
    private String errorMessage;
    private String requestData;     // JSON
    private String responseData;    // JSON
}

// Create audit aspect
pdm-backend/src/main/java/com/pdm/audit/AuditAspect.java

@Aspect
@Component
public class AuditAspect {

    @Around("@annotation(Audited)")
    public Object audit(ProceedingJoinPoint pjp) throws Throwable {
        AuditLog log = new AuditLog();
        log.setAction(pjp.getSignature().getName());
        log.setUser(getCurrentUser());
        log.setIpAddress(getClientIp());
        log.setTimestamp(LocalDateTime.now());

        try {
            Object result = pjp.proceed();
            log.setStatus("SUCCESS");
            log.setResponseData(toJson(result));
            return result;
        } catch (Exception e) {
            log.setStatus("FAILED");
            log.setErrorMessage(e.getMessage());
            throw e;
        } finally {
            auditLogRepository.save(log);
        }
    }
}

// Add @Audited annotation to sensitive operations
pdm-backend/src/main/java/com/pdm/service/ApplicationService.java

@Audited
public ApplicationDTO createApplication(CreateApplicationRequest request) {
    // ...
}

@Audited
public void approveApplication(Long id) {
    // ...
}

// Create audit log viewer
pdm-backend/src/main/java/com/pdm/web/AuditLogController.java
- GET /api/audit-logs (admin only)
- Filter by user, action, date range
- Export to CSV
```

---

## 📱 MOBILE OPTIMIZATION

### 19. React Native Mobile App
**Impact:** High | **Complexity:** Very High

**Tasks:**
```bash
# Initialize React Native project
npx react-native init PDMLoanApp --template react-native-template-typescript

# Install dependencies
cd PDMLoanApp
npm install @react-navigation/native @react-navigation/stack
npm install react-native-keychain  # Secure storage
npm install react-native-biometrics # Face ID / Fingerprint
npm install react-native-camera    # Document scanning
npm install @react-native-async-storage/async-storage
npm install axios

# Create navigation structure
src/navigation/AppNavigator.tsx
- Auth stack (Login, Register)
- Main stack (Dashboard, Applications, Loans, Profile)
- Tab navigator

# Create screens
src/screens/auth/LoginScreen.tsx
src/screens/auth/RegisterScreen.tsx
src/screens/dashboard/DashboardScreen.tsx
src/screens/applications/ApplicationListScreen.tsx
src/screens/applications/CreateApplicationScreen.tsx
src/screens/documents/DocumentScannerScreen.tsx
src/screens/profile/ProfileScreen.tsx

# Create shared API client
src/api/client.ts
- Reuse same endpoints as web
- Handle authentication
- Store JWT in secure storage

# Implement biometric login
src/services/BiometricService.ts
- Check biometric availability
- Store credentials securely
- Authenticate with biometrics

# Implement push notifications
src/services/PushNotificationService.ts
- Register device token
- Handle incoming notifications
- Navigate to relevant screen

# Create offline mode
src/services/OfflineService.ts
- Cache API responses
- Queue mutations for sync
- Sync when online

# Build for iOS and Android
npx react-native run-ios
npx react-native run-android
```

---

## 🎯 PRIORITY ORDER

**Do These First (Highest ROI):**
1. ✅ Messaging System
2. ✅ Real-time Notifications
3. ✅ Dark Mode
4. ✅ Rate Limiting
5. ✅ Document Upload + OCR

**Do These Next (High Impact):**
6. ✅ Advanced Analytics
7. ✅ Email/SMS Notifications
8. ✅ Two-Factor Auth
9. ✅ Error Tracking
10. ✅ Comprehensive Tests

**Infrastructure (Enable Everything Else):**
11. ✅ Docker
12. ✅ CI/CD Pipeline
13. ✅ Database Backups
14. ✅ Monitoring

**Polish (Nice to Have):**
15. ✅ PWA
16. ✅ Loan Calculator Enhancement
17. ✅ Enhanced Audit Logging
18. ✅ Multi-language

**Future (Long-term):**
19. ✅ React Native Mobile App

---

## 📊 SUCCESS METRICS

**Measure after implementation:**
- Code coverage > 80%
- API response time < 200ms (p95)
- Error rate < 0.1%
- Zero security vulnerabilities
- 100% uptime
- User satisfaction > 4.5/5

---

**Ready to implement! Pick any task and I'll execute it immediately. 🚀**
