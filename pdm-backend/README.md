# PDM Backend - Spring Boot API

The backend REST API for the PDM Loan Management System, built with Spring Boot 3.x, Java 17, and MySQL.

## Overview

A robust, secure REST API providing comprehensive loan management functionality with JWT authentication, role-based access control, and complete loan lifecycle management.

## Tech Stack

- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Build Tool**: Maven 3.8+
- **Security**: Spring Security with JWT
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA (Hibernate)
- **API Port**: 8080
- **API Base Path**: `/api`

## Features

### Core Functionality
- **RESTful API**: 75+ endpoints for complete loan management
- **Authentication**: JWT-based stateless authentication
- **Authorization**: Role-based access control (RBAC)
- **Data Persistence**: JPA/Hibernate with MySQL
- **Transaction Management**: Spring transaction support
- **Exception Handling**: Global exception handling with custom responses
- **Input Validation**: Bean validation with custom validators
- **Password Security**: BCrypt password hashing
- **SQL Injection Prevention**: Parameterized queries via JPA

### Business Domains
- User Management (Applicants, Bankers, Verifiers, Underwriters, Admins)
- Loan Application Workflow
- Document Management
- KYC/AML Verification
- Risk Assessment
- Offer Generation
- Contract Management
- Loan Disbursement
- Repayment Scheduling
- Wallet Operations
- Transaction Processing
- Support Tickets
- Notifications
- Internal Messaging

## Prerequisites

- **Java**: JDK 17 or higher
- **Maven**: 3.8 or higher
- **MySQL**: 8.0 or higher
- **Database**: Create a database named `olavs_db`

## Installation

### 1. Install Java and Maven
```bash
# Verify installations
java -version    # Should be 17+
mvn -version     # Should be 3.8+
```

### 2. Set Up Database
```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE olavs_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Grant permissions
GRANT ALL PRIVILEGES ON olavs_db.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configure Environment Variables
```bash
cd pdm-backend
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DB_URL=jdbc:mysql://localhost:3306/olavs_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=root
DB_PASSWORD=your_secure_password
JWT_SECRET=your-256-bit-secret-key-change-this-in-production
```

**Important**: Never commit `.env` file to version control.

### 4. Install Dependencies
```bash
mvn clean install
```

## Running the Application

### Development Mode
```bash
mvn spring-boot:run
```

The API will be available at http://localhost:8080/api

### Using the Start Script
```bash
# From project root
./start-backend.sh
```

### Production Mode
```bash
# Build JAR
mvn clean package -DskipTests

# Run JAR
java -jar target/loan-management-system-1.0.0.jar
```

## Project Structure

```
pdm-backend/
├── src/
│   ├── main/
│   │   ├── java/com/loanweb/
│   │   │   ├── LoanManagementApplication.java    # Main application class
│   │   │   │
│   │   │   ├── config/                           # Configuration
│   │   │   │   ├── CorsConfig.java               # CORS configuration
│   │   │   │   ├── DataSourceConfig.java         # Database configuration
│   │   │   │   └── WebConfig.java                # Web MVC configuration
│   │   │   │
│   │   │   ├── security/                         # Security components
│   │   │   │   ├── SecurityConfig.java           # Spring Security configuration
│   │   │   │   ├── JwtAuthenticationFilter.java  # JWT request filter
│   │   │   │   ├── JwtTokenProvider.java         # JWT token generation/validation
│   │   │   │   ├── CustomUserDetailsService.java # User details loading
│   │   │   │   └── UserPrincipal.java            # Authenticated user principal
│   │   │   │
│   │   │   ├── web/                              # REST Controllers
│   │   │   │   ├── AuthController.java           # Authentication endpoints
│   │   │   │   ├── ApplicationController.java    # Application management
│   │   │   │   ├── DocumentController.java       # Document operations
│   │   │   │   ├── VerificationController.java   # KYC/AML verification
│   │   │   │   ├── RiskAssessmentController.java # Risk assessment
│   │   │   │   ├── OfferController.java          # Offer generation
│   │   │   │   ├── ContractController.java       # Contract management
│   │   │   │   ├── DisbursementController.java   # Disbursement processing
│   │   │   │   ├── RepaymentController.java      # Repayment management
│   │   │   │   ├── UserController.java           # User management
│   │   │   │   ├── WalletController.java         # Wallet operations
│   │   │   │   ├── TransactionController.java    # Transaction history
│   │   │   │   ├── SupportTicketController.java  # Support tickets
│   │   │   │   ├── NotificationController.java   # Notifications
│   │   │   │   └── MessageController.java        # Internal messaging
│   │   │   │
│   │   │   ├── service/                          # Business Logic
│   │   │   │   ├── AuthService.java              # Authentication logic
│   │   │   │   ├── ApplicationService.java       # Application workflow
│   │   │   │   ├── DocumentService.java          # Document processing
│   │   │   │   ├── VerificationService.java      # Verification logic
│   │   │   │   ├── RiskAssessmentService.java    # Risk calculation
│   │   │   │   ├── OfferService.java             # Offer generation logic
│   │   │   │   ├── ContractService.java          # Contract creation
│   │   │   │   ├── DisbursementService.java      # Disbursement processing
│   │   │   │   ├── RepaymentService.java         # Repayment calculation
│   │   │   │   ├── UserService.java              # User operations
│   │   │   │   ├── WalletService.java            # Wallet operations
│   │   │   │   ├── TransactionService.java       # Transaction processing
│   │   │   │   ├── NotificationService.java      # Notification dispatch
│   │   │   │   └── MessageService.java           # Message handling
│   │   │   │
│   │   │   ├── domain/                           # JPA Entities
│   │   │   │   ├── user/
│   │   │   │   │   ├── User.java                 # User entity
│   │   │   │   │   ├── UserRepository.java       # User data access
│   │   │   │   │   └── Role.java                 # User roles enum
│   │   │   │   ├── application/
│   │   │   │   │   ├── Application.java          # Loan application entity
│   │   │   │   │   └── ApplicationRepository.java
│   │   │   │   ├── document/
│   │   │   │   │   ├── Document.java             # Document entity
│   │   │   │   │   └── DocumentRepository.java
│   │   │   │   ├── verification/
│   │   │   │   │   ├── Verification.java         # Verification entity
│   │   │   │   │   └── VerificationRepository.java
│   │   │   │   ├── offer/
│   │   │   │   │   ├── Offer.java                # Offer entity
│   │   │   │   │   └── OfferRepository.java
│   │   │   │   ├── contract/
│   │   │   │   │   ├── Contract.java             # Contract entity
│   │   │   │   │   └── ContractRepository.java
│   │   │   │   ├── loan/
│   │   │   │   │   ├── Loan.java                 # Loan entity
│   │   │   │   │   └── LoanRepository.java
│   │   │   │   ├── repayment/
│   │   │   │   │   ├── RepaymentSchedule.java    # Schedule entity
│   │   │   │   │   └── RepaymentRepository.java
│   │   │   │   ├── wallet/
│   │   │   │   │   ├── Wallet.java               # Wallet entity
│   │   │   │   │   └── WalletRepository.java
│   │   │   │   ├── transaction/
│   │   │   │   │   ├── Transaction.java          # Transaction entity
│   │   │   │   │   └── TransactionRepository.java
│   │   │   │   ├── notification/
│   │   │   │   │   ├── Notification.java         # Notification entity
│   │   │   │   │   └── NotificationRepository.java
│   │   │   │   └── message/
│   │   │   │       ├── Message.java              # Message entity
│   │   │   │       └── MessageRepository.java
│   │   │   │
│   │   │   ├── dto/                              # Data Transfer Objects
│   │   │   │   ├── AuthRequest.java              # Login request DTO
│   │   │   │   ├── AuthResponse.java             # Login response DTO
│   │   │   │   ├── RegisterRequest.java          # Registration DTO
│   │   │   │   ├── ApplicationDTO.java           # Application DTO
│   │   │   │   ├── DocumentDTO.java              # Document DTO
│   │   │   │   ├── OfferDTO.java                 # Offer DTO
│   │   │   │   ├── message/
│   │   │   │   │   ├── MessageDTO.java           # Message DTO
│   │   │   │   │   └── SendMessageRequest.java   # Send message request
│   │   │   │   └── ...                           # Other DTOs
│   │   │   │
│   │   │   ├── exception/                        # Exception Handling
│   │   │   │   ├── GlobalExceptionHandler.java   # Global exception handler
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   ├── BadRequestException.java
│   │   │   │   └── UnauthorizedException.java
│   │   │   │
│   │   │   └── util/                             # Utility Classes
│   │   │       ├── DateUtils.java                # Date utilities
│   │   │       ├── ValidationUtils.java          # Validation helpers
│   │   │       └── ResponseUtils.java            # Response builders
│   │   │
│   │   └── resources/
│   │       ├── application.yml                   # Application configuration
│   │       ├── application-dev.yml               # Development profile
│   │       ├── application-prod.yml              # Production profile
│   │       ├── data.sql                          # Sample data (dev only)
│   │       └── schema.sql                        # Database schema
│   │
│   └── test/
│       └── java/com/loanweb/                     # Test classes
│           ├── web/                              # Controller tests
│           ├── service/                          # Service tests
│           └── domain/                           # Repository tests
│
├── pom.xml                                       # Maven dependencies
└── .env.example                                  # Environment variables template
```

## Environment Variables

### Required Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DB_URL` | MySQL JDBC connection string | `jdbc:mysql://localhost:3306/olavs_db` | Yes |
| `DB_USERNAME` | Database username | `root` | Yes |
| `DB_PASSWORD` | Database password | `SecureP@ssw0rd` | Yes |
| `JWT_SECRET` | Secret key for JWT signing (min 256 bits) | `your-256-bit-secret` | Yes |

### Optional Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_PORT` | Application port | `8080` |
| `JWT_EXPIRATION` | JWT token expiration (ms) | `86400000` (24h) |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `http://localhost:4000` |

### Generating Secure Secrets
```bash
# Generate JWT secret (256-bit)
openssl rand -base64 64

# Generate database password (256-bit)
openssl rand -base64 32
```

See [SECRET_MANAGEMENT.md](../docs/SECRET_MANAGEMENT.md) for detailed security practices.

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/me` | Get current user | Yes |
| GET | `/health` | Health check | No |

### Applications (`/api/v2/applications`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all applications | Yes |
| GET | `/{id}` | Get application by ID | Yes |
| POST | `/` | Create application | Yes |
| PUT | `/{id}` | Update application | Yes |
| DELETE | `/{id}` | Delete application | Yes (Admin) |
| POST | `/{id}/submit` | Submit application | Yes |
| PUT | `/{id}/status` | Update status | Yes (Staff) |
| POST | `/{id}/assign` | Assign reviewer | Yes (Staff) |
| GET | `/banker/queue` | Banker's queue | Yes (Banker) |
| GET | `/verifier/queue` | Verifier's queue | Yes (Verifier) |
| GET | `/underwriter/queue` | Underwriter's queue | Yes (Underwriter) |

### Documents (`/api/v2/documents`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/application/{applicationId}` | Get documents for application | Yes |
| GET | `/{id}` | Get document by ID | Yes |
| POST | `/upload` | Upload document | Yes |
| PUT | `/{id}/verify` | Verify document | Yes (Staff) |
| DELETE | `/{id}` | Delete document | Yes |

### Verifications (`/api/v2/verifications`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/kyc/start` | Start KYC verification | Yes |
| POST | `/aml/start` | Start AML verification | Yes |
| GET | `/application/{applicationId}` | Get verifications | Yes |
| POST | `/{id}/perform` | Perform verification | Yes (Verifier) |

### Full API Documentation
For complete API documentation with request/response examples, see:
- [QUICK_START.md](../docs/QUICK_START.md) - All 75+ endpoints listed
- API documentation (when available): http://localhost:8080/swagger-ui.html

## Database Schema

The application uses JPA to automatically create/update the database schema. Key tables:

- `users` - User accounts
- `applications` - Loan applications
- `documents` - Uploaded documents
- `verifications` - KYC/AML verification records
- `risk_assessments` - Risk assessment results
- `offers` - Loan offers
- `contracts` - Loan contracts
- `loans` - Active loans
- `repayment_schedules` - Repayment schedules
- `repayment_installments` - Individual installments
- `wallets` - User wallets
- `transactions` - Financial transactions
- `support_tickets` - Support tickets
- `notifications` - User notifications
- `messages` - Internal messages

### Database Initialization
- **Development**: `schema.sql` and `data.sql` run automatically
- **Production**: Manual schema management recommended

## Security

### Implemented Security Measures
- **JWT Authentication**: Stateless token-based authentication
- **Password Hashing**: BCrypt with salt
- **Role-Based Access**: Method-level security with `@PreAuthorize`
- **CORS Configuration**: Controlled cross-origin requests
- **SQL Injection Prevention**: Parameterized queries via JPA
- **Input Validation**: Bean validation on all DTOs
- **Exception Handling**: No sensitive data in error responses
- **Secure Headers**: Security headers configured

### Authentication Flow
1. User sends credentials to `/api/auth/login`
2. Server validates credentials
3. Server generates JWT token with user ID and roles
4. Client stores token (localStorage)
5. Client includes token in Authorization header: `Bearer <token>`
6. Server validates token on each request via `JwtAuthenticationFilter`

### Role-Based Access Control
- **APPLICANT**: Apply for loans, view own data
- **BANKER**: Review applications, generate offers
- **VERIFIER**: Verify documents, perform KYC/AML
- **UNDERWRITER**: Risk assessment, final approval
- **ADMIN**: Full system access, user management

## Testing

### Run All Tests
```bash
mvn test
```

### Run Specific Test Class
```bash
mvn test -Dtest=ApplicationControllerTest
```

### Run with Coverage
```bash
mvn test jacoco:report
```

Coverage report: `target/site/jacoco/index.html`

### Test Categories
- **Unit Tests**: Service and utility classes
- **Integration Tests**: Controller and repository tests
- **API Tests**: End-to-end API testing

## Building

### Development Build
```bash
mvn clean package
```

### Production Build (Skip Tests)
```bash
mvn clean package -DskipTests
```

### Build Output
JAR file: `target/loan-management-system-1.0.0.jar`

## Deployment

### Running the JAR
```bash
java -jar target/loan-management-system-1.0.0.jar
```

### With Environment Variables
```bash
DB_URL=jdbc:mysql://prod-db:3306/olavs_db \
DB_USERNAME=prod_user \
DB_PASSWORD=prod_password \
JWT_SECRET=prod-secret \
java -jar target/loan-management-system-1.0.0.jar
```

### Docker Deployment
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/loan-management-system-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```bash
# Build and run
docker build -t pdm-backend .
docker run -p 8080:8080 \
  -e DB_URL=jdbc:mysql://host.docker.internal:3306/olavs_db \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=password \
  -e JWT_SECRET=secret \
  pdm-backend
```

### Production Considerations
- Use production profile: `--spring.profiles.active=prod`
- Configure proper database connection pool
- Enable HTTPS
- Set appropriate CORS origins
- Use secrets management (e.g., AWS Secrets Manager)
- Configure logging levels
- Set up monitoring and health checks

## Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check MySQL is running
mysql -u root -p

# Verify database exists
SHOW DATABASES;

# Check application.yml connection settings
```

**Port Already in Use**
```bash
# Find process on port 8080
lsof -i :8080

# Kill process
kill -9 <PID>

# Or use different port
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

**JWT Token Invalid**
- Check JWT_SECRET is set correctly
- Verify token hasn't expired
- Check token format: `Bearer <token>`

**Build Failures**
```bash
# Clean and rebuild
mvn clean install -U

# Skip tests if needed
mvn clean install -DskipTests
```

### Logging
Logs are written to:
- **Console**: Stdout (default)
- **File**: `logs/application.log` (if configured)

Adjust log levels in `application.yml`:
```yaml
logging:
  level:
    com.loanweb: DEBUG
    org.springframework: INFO
```

## Performance

### Optimization Strategies
- Database connection pooling (HikariCP)
- JPA query optimization
- Caching with Spring Cache (if enabled)
- Async processing for long-running tasks
- Pagination for large result sets

### Monitoring
- Spring Boot Actuator endpoints
- JVM metrics
- Database query performance
- API response times

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

### Development Standards
- Java 17 features encouraged
- Follow Spring Boot best practices
- Write unit tests for all services
- Document public APIs with JavaDoc
- Use DTOs for all API requests/responses
- Handle exceptions gracefully

## Support

For issues or questions:
- Check the [main README](../README.md)
- Review [API documentation](../docs/api/)
- Check [database documentation](../database/README.md)
- Create an issue on GitHub

## License

See [LICENSE](../LICENSE) file in the root directory.

---

**Quick Start**: Run `mvn spring-boot:run` to start the API server immediately.
