# 💼 Loan Management System — PDM Project

A modern, full-stack **loan management web application** built with **Spring Boot 3.3**, **JTE**, and **Tailwind CSS** for the *PDM* course at HCMIU.

This application provides a complete banking and loan management system with user authentication, loan processing, transaction tracking, digital wallet, and support ticketing features.

---

## 🌐 Overview

The Loan Management System provides:

* **User Authentication** - Secure login/register with Spring Security & BCrypt
* **Dashboard** - Financial overview with balance and transaction views
* **Loan Management** - Apply for loans, track status, and manage payments
* **Transaction History** - View and track all financial transactions
* **Digital Wallet** - Manage account balance and transfers
* **Support Tickets** - Customer support system with ticket tracking
* **Admin Panel** - User management and system administration
* **Notifications** - Real-time notification system
* Fully responsive design with **Tailwind CSS**

---

## 🧱 Tech Stack

| Technology                | Description                             |
| ------------------------- | --------------------------------------- |
| **Spring Boot 3.3.4**     | Backend framework with Java 21          |
| **JTE**                   | Java Template Engine for server-side rendering |
| **Tailwind CSS 3.4**      | Utility-first CSS framework             |
| **Spring Security**       | Authentication and authorization        |
| **Spring JDBC**           | Database access with JdbcTemplate       |
| **H2 Database**           | In-memory database (development)        |
| **PostgreSQL**            | Production database                     |
| **Maven**                 | Build and dependency management         |
| **npm**                   | Frontend asset management               |

---

## 📁 Project Structure

```
PDM_Project/
├── pom.xml                                 # Maven configuration
├── package.json                            # npm configuration for Tailwind
├── tailwind.config.js                      # Tailwind configuration
├── postcss.config.js                       # PostCSS configuration
├── src/
│   ├── main/
│   │   ├── java/com/loanweb/app/
│   │   │   ├── LoanManagementApplication.java   # Main application class
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java          # Spring Security config
│   │   │   │   └── CustomUserDetailsService.java
│   │   │   ├── domain/                          # Domain models & repositories
│   │   │   │   ├── user/
│   │   │   │   ├── loan/
│   │   │   │   ├── transaction/
│   │   │   │   ├── wallet/
│   │   │   │   ├── ticket/
│   │   │   │   └── notification/
│   │   │   └── web/                             # Controllers
│   │   │       ├── HomeController.java
│   │   │       ├── AuthController.java
│   │   │       ├── DashboardController.java
│   │   │       ├── LoanController.java
│   │   │       ├── TransactionController.java
│   │   │       ├── WalletController.java
│   │   │       ├── SupportTicketController.java
│   │   │       └── UserController.java
│   │   ├── jte/                                 # JTE templates
│   │   │   ├── index.jte                        # Landing page
│   │   │   ├── auth/                            # Login/Register
│   │   │   ├── dashboard/                       # Dashboard
│   │   │   ├── loans/                           # Loan pages
│   │   │   ├── transactions/                    # Transaction history
│   │   │   ├── wallet/                          # Wallet pages
│   │   │   ├── tickets/                         # Support tickets
│   │   │   ├── users/                           # User management
│   │   │   └── components/                      # Reusable components
│   │   │       ├── layout.jte
│   │   │       └── dashboard-layout.jte
│   │   └── resources/
│   │       ├── application.yml                  # Spring configuration
│   │       ├── schema.sql                       # Database schema
│   │       ├── data.sql                         # Sample data
│   │       ├── input.css                        # Tailwind input
│   │       └── static/
│   │           ├── css/tailwind.css            # Generated Tailwind CSS
│   │           ├── js/script.js                # JavaScript
│   │           └── images/                      # Static images
│   └── test/                                    # Test classes
└── target/                                      # Build output
```

---

## ⚙️ Quick Start

### Prerequisites

- **Java 21** or higher
- **Maven 3.6+**
- **Node.js 16+** and npm (for Tailwind CSS)

### Installation & Setup

1. **Clone this repository:**

   ```bash
   git clone https://github.com/<your-username>/PDM_Project.git
   cd PDM_Project
   ```

2. **Install npm dependencies** (for Tailwind CSS)

   ```bash
   npm install
   ```

3. **Build Tailwind CSS**

   ```bash
   # For development (watch mode)
   npm run dev

   # For production (minified)
   npm run build
   ```

4. **Run the Spring Boot application**

   ```bash
   mvn spring-boot:run
   ```

5. **Access the application**
   - Open your browser and navigate to: **http://localhost:8080**
   - Landing page: http://localhost:8080/
   - Login page: http://localhost:8080/login
   - H2 Console (dev only): http://localhost:8080/h2-console

### Default Credentials

The application comes with pre-seeded test users:

- **Admin User**
  - Email: `admin@loanweb.com`
  - Password: `password123`

- **Regular Users**
  - Email: `john.doe@example.com` / Password: `password123`
  - Email: `jane.smith@example.com` / Password: `password123`
  - Email: `bob.johnson@example.com` / Password: `password123`

---

## 🖼️ Features & Screenshots

### User Features
- ✅ User registration and authentication
- ✅ Dashboard with financial overview
- ✅ Loan application and management
- ✅ Transaction history
- ✅ Digital wallet
- ✅ Support ticket system
- ✅ Notifications

### Admin Features
- ✅ User management
- ✅ Loan approval workflow
- ✅ Support ticket management
- ✅ System analytics

### Security
- ✅ BCrypt password encryption
- ✅ Spring Security integration
- ✅ Role-based access control (USER, ADMIN)
- ✅ CSRF protection
- ✅ Secure session management

<img width="2549" height="1368" alt="image" src="https://github.com/user-attachments/assets/43d9ccff-b3a0-4f8f-a857-4cb59522c145" />

<img width="2549" height="1368" alt="image" src="https://github.com/user-attachments/assets/c98d44fe-abec-44dc-91cc-c89081d5aff6" />

<img width="2549" height="1368" alt="image" src="https://github.com/user-attachments/assets/fad8372d-baed-44e6-a234-ad92464811ab" />

<img width="2549" height="1368" alt="image" src="https://github.com/user-attachments/assets/e5224c85-f4dd-42c3-89e4-5c717d767b96" />

<img width="2549" height="1368" alt="image" src="https://github.com/user-attachments/assets/0dbdaa15-f62f-471c-b95e-5ebde2780065" />

<img width="2549" height="1368" alt="image" src="https://github.com/user-attachments/assets/9f348e36-46e3-493e-83cb-221ec247ecaf" />

<img width="2549" height="1368" alt="image" src="https://github.com/user-attachments/assets/b74a311c-fa05-4154-8c71-41240c0e80e8" />

<img width="2549" height="1368" alt="image" src="https://github.com/user-attachments/assets/2e8270ab-c185-4773-9bc8-db6713c13795" />

---

## 🔧 Development

### Database

**H2 Database (Development)**
- In-memory database, auto-initialized on startup
- Access H2 Console at: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:loandb`
- Username: `sa`
- Password: (empty)

**PostgreSQL (Production)**
Update `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/loandb
    username: your_username
    password: your_password
```

### Tailwind CSS Development

Run Tailwind in watch mode for automatic rebuilding:
```bash
npm run dev
```

This will watch for changes in JTE templates and rebuild CSS automatically.

### JTE Templates

- Templates are located in `src/main/jte/`
- Hot reload is enabled in development mode
- Return template paths from controllers like: `"dashboard/index.jte"`

### Adding New Pages

1. **Create Controller**
   ```java
   @Controller
   @RequestMapping("/mypage")
   public class MyPageController {
       @GetMapping
       public String myPage(Model model) {
           model.addAttribute("title", "My Page");
           return "mypage/index.jte";
       }
   }
   ```

2. **Create JTE Template**
   ```jte
   @param String title
   @param com.loanweb.app.domain.user.User user

   @template.components.dashboard-layout(
       title = title,
       user = user,
       activePage = "mypage",
       content = @`
           <h1>${title}</h1>
           <!-- Your content here -->
       `
   )
   ```

3. **Rebuild Tailwind** (if you added new classes)
   ```bash
   npm run build
   ```

---

## 🚀 Building for Production

1. **Build Tailwind CSS** (minified)
   ```bash
   npm run build
   ```

2. **Package the application**
   ```bash
   mvn clean package -DskipTests
   ```

3. **Run the JAR file**
   ```bash
   java -jar target/loan-management-system-1.0.0.jar
   ```

### Production Configuration

Set environment variables or update `application.yml`:

```yaml
spring:
  profiles:
    active: prod
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}
  jte:
    development-mode: false
    use-precompiled-templates: true
```

---

## 📡 API Endpoints

### Public
- `GET /` - Landing page
- `GET /login` - Login page
- `GET /register` - Registration page
- `POST /register` - Process registration

### Authenticated
- `GET /dashboard` - User dashboard
- `GET /loans` - Loan management
- `GET /transactions` - Transaction history
- `GET /wallet` - Digital wallet
- `GET /tickets` - Support tickets
- `GET /users` - User management (ADMIN only)

---

## 🧪 Testing

Run tests with:
```bash
mvn test
```

---

## 🔍 Troubleshooting

### Port Already in Use
Change the port in `application.yml`:
```yaml
server:
  port: 8081
```

### Tailwind CSS Not Updating
1. Rebuild Tailwind: `npm run build`
2. Clear browser cache
3. Restart Spring Boot

### Database Issues
- Check H2 Console: http://localhost:8080/h2-console
- Verify JDBC URL: `jdbc:h2:mem:loandb`
- Check `schema.sql` and `data.sql` are being executed

---

## 🔄 Migration from Old Frontend

The original static HTML frontend has been migrated to:
- **Templates**: `src/main/jte/` (converted from `frontend/` HTML files)
- **Assets**: `src/main/resources/static/` (moved from `frontend/assets/`)
- **Styling**: Now using build-time Tailwind instead of CDN

---

## 👥 Team Members

| ID | Student ID  | Student Name           | Phone      | Role          |
| -- | ----------- | ---------------------- | ---------- | ------------- |
| 1  | ITCSIU23054 | Đào Hữu Hoài           | 0344612654 | Full-stack    |
| 2  | ITITWE23014 | Lê Thành Danh (Leader) | 0767178267 | Full-stack    |
| 3  | ITDSIU24022 | Võ Quang Khải          | 0363681624 | Report Writer |
| 4  | ITITWE23030 | Phan Minh Khánh        | 0902628125 | ERD Designer  |
| 5  | ITDSIU23027 | Trần Châu Thanh Tuấn   | 0788286494 | Report Writer |
| 6  | ITCSIU24063 | Vũ Đức Nhân            | 0937840446 | Backend       |
| 7  | ITITDK23037 | Lê Hoàng Quốc Anh      | 0354503153 | Frontend      |
| 8  | ITCSIU24090 | Trương Minh Trí        | 0708941111 | Frontend      |
| 9  | ITCSIU24059 | Hoàng Triệu Nam        | 0769315790 | Report Writer |
| 10 | ITCSIU24045 | Võ Trí Khôi            | 0869250015 | Backend       |
| 11 | ITITWE23941 | Võ Nguyễn Đình Bảo     | 0858010878 | ERD Designer  |

Project for *Principle of Database Management — HCMIU VNU (International University - Vietnam National University)*

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is for **educational and demonstration purposes**.
You are free to use, modify, and extend it with proper credit.

---

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- JTE for the modern template engine
- Tailwind CSS for the utility-first CSS framework
- HCMIU for academic support
