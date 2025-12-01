# PDM Frontend - Next.js Application

[![Build Status](https://github.com/R1C3-arno/Ollama-fastapi/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/R1C3-arno/Ollama-fastapi/actions/workflows/frontend-ci.yml)
[![Test Coverage](https://codecov.io/gh/R1C3-arno/Ollama-fastapi/branch/main/graph/badge.svg?flag=frontend)](https://codecov.io/gh/R1C3-arno/Ollama-fastapi)
[![Security Scan](https://github.com/R1C3-arno/Ollama-fastapi/actions/workflows/security-scan.yml/badge.svg)](https://github.com/R1C3-arno/Ollama-fastapi/actions/workflows/security-scan.yml)

The frontend application for the PDM Loan Management System, built with Next.js 16, TypeScript, and Tailwind CSS.

## Overview

A modern, responsive web application providing comprehensive loan management functionality with role-based interfaces for applicants, bankers, verifiers, and underwriters.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with PostCSS
- **UI Icons**: Lucide React
- **Runtime**: React 19.2.0
- **Port**: 4000 (both development and production)

## Features

### User Interfaces
- **Public Pages**: Landing page, about, contact
- **Authentication**: Login, registration with JWT integration
- **Dashboard**: Role-specific dashboards for all user types
- **Loan Management**: Application submission, tracking, and management
- **Document Upload**: Multi-file document upload with preview
- **Messaging**: Internal messaging system between users and staff
- **Notifications**: Real-time notification center
- **Wallet**: Deposit, withdrawal, and transaction history
- **Support Tickets**: Create and track support requests
- **Profile Management**: User profile editing and settings

### Admin/Staff Interfaces
- **Application Queue**: Role-based application queues
- **Document Verification**: Review and verify uploaded documents
- **Risk Assessment**: View and manage risk assessments
- **User Management**: Admin user CRUD operations
- **System Monitoring**: Application status tracking

## Prerequisites

- **Node.js**: 20.x or higher
- **npm**: 9.x or higher
- **Backend API**: Running on http://localhost:8080

## Installation

### 1. Install Dependencies
```bash
cd pdm-frontend
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

For production, update the API URL to your production backend.

## Development

### Start Development Server
```bash
npm run dev
```

The application will be available at http://localhost:4000

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 4000 |
| `npm run build` | Build production bundle |
| `npm start` | Start production server on port 4000 |
| `npm run lint` | Run ESLint for code quality checks |

## Project Structure

```
pdm-frontend/
├── app/                      # Next.js App Router pages
│   ├── about/                # About page
│   ├── admin/                # Admin dashboard
│   ├── applications/         # Loan applications
│   ├── contact/              # Contact page
│   ├── dashboard/            # User dashboard
│   ├── loans/                # Active loans management
│   ├── login/                # Login page
│   ├── messages/             # Messaging system
│   ├── notifications/        # Notification center
│   ├── payments/             # Payment processing
│   ├── profile/              # User profile
│   ├── register/             # Registration page
│   ├── staff/                # Staff-specific pages
│   │   ├── applications/     # Application review queue
│   │   ├── documents/        # Document verification
│   │   └── risk/             # Risk assessment
│   ├── tickets/              # Support tickets
│   ├── transactions/         # Transaction history
│   ├── users/                # User management
│   ├── wallet/               # Wallet operations
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
│
├── components/               # Reusable React components
│   ├── ui/                   # UI primitives (buttons, cards, etc.)
│   ├── forms/                # Form components
│   ├── layouts/              # Layout components
│   └── shared/               # Shared components
│
├── lib/                      # Utility functions and helpers
│   ├── api.ts                # API client utilities
│   ├── auth.ts               # Authentication helpers
│   ├── utils.ts              # General utilities
│   └── validators.ts         # Form validation
│
├── contexts/                 # React Context providers
│   ├── AuthContext.tsx       # Authentication context
│   └── NotificationContext.tsx # Notification context
│
├── hooks/                    # Custom React hooks
│   ├── useAuth.ts            # Authentication hook
│   └── useApi.ts             # API calling hook
│
├── layouts/                  # Page layouts
│   ├── DashboardLayout.tsx   # Dashboard layout wrapper
│   └── PublicLayout.tsx      # Public pages layout
│
├── middleware.ts             # Next.js middleware for auth
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## Environment Variables

### Required Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8080/api` | Yes |

### Example `.env.local`
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Note: All environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## API Integration

The frontend communicates with the Spring Boot backend via REST API calls.

### API Client Setup
Located in `lib/api.ts`, the API client provides:
- Automatic JWT token handling
- Request/response interceptors
- Error handling
- Base URL configuration

Example usage:
```typescript
import { apiClient } from '@/lib/api';

// GET request
const applications = await apiClient.get('/v2/applications');

// POST request
const newApp = await apiClient.post('/v2/applications', {
  loanAmount: 50000,
  purpose: 'Home purchase'
});
```

### Authentication Flow
1. User logs in via `/api/auth/login`
2. JWT token stored in localStorage
3. Token included in all subsequent API requests via Authorization header
4. Middleware protects authenticated routes
5. Token refresh on expiration

## Routing

### Public Routes (No Authentication Required)
- `/` - Landing page
- `/about` - About page
- `/contact` - Contact page
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Authentication Required)
- `/dashboard` - User dashboard (role-based)
- `/applications/*` - Loan applications
- `/loans/*` - Active loans
- `/wallet` - Wallet operations
- `/transactions` - Transaction history
- `/notifications` - Notifications
- `/messages` - Messaging
- `/tickets` - Support tickets
- `/profile` - User profile

### Admin/Staff Routes (Role-Based Access)
- `/admin/*` - Admin dashboard and management
- `/staff/applications` - Application review queue
- `/staff/documents` - Document verification
- `/staff/risk` - Risk assessment

Route protection is handled by `middleware.ts` using JWT token validation.

## Styling

### Tailwind CSS Configuration
The project uses Tailwind CSS 4 with custom configuration:

- **Design System**: Custom color palette, spacing, and typography
- **Components**: Pre-built component classes
- **Responsive**: Mobile-first responsive design
- **Dark Mode**: Support for dark mode (if enabled)

### Global Styles
Located in `app/globals.css`:
- CSS reset
- Custom font imports
- Global utility classes
- Component base styles

### Component Styling
Components use Tailwind utility classes:
```tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
  Submit
</button>
```

## State Management

### Context API
- **AuthContext**: Global authentication state
- **NotificationContext**: Notification management

### Local State
- React hooks (`useState`, `useEffect`, `useReducer`)
- Custom hooks for reusable stateful logic

## Forms and Validation

### Form Handling
- Controlled components with React state
- Form submission with API integration
- Loading states and error handling

### Validation
Located in `lib/validators.ts`:
- Client-side validation
- Email format validation
- Password strength requirements
- Loan amount range validation

## Building for Production

### Build Process
```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### Production Server
```bash
npm start
```

Runs the production server on port 4000.

### Environment-Specific Builds
- Development: `npm run dev` (unoptimized, with hot reload)
- Production: `npm run build && npm start` (optimized, minified)

### Build Optimization
- Automatic code splitting
- Image optimization
- CSS minification
- JavaScript minification
- Tree shaking

## Testing

### Running Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### Testing Strategy
- Unit tests for utilities and helpers
- Component tests with React Testing Library
- Integration tests for API calls
- E2E tests for critical user flows

## Code Quality

### ESLint Configuration
Located in `eslint.config.mjs`:
- Next.js recommended rules
- TypeScript strict mode
- Custom rules for code consistency

### Running Linter
```bash
npm run lint
```

### TypeScript
- Strict mode enabled
- Type checking on build
- Interface definitions for API responses

## Performance

### Optimization Strategies
- Server-side rendering (SSR) for initial page load
- Static site generation (SSG) for public pages
- Image optimization with Next.js Image component
- Code splitting with dynamic imports
- Lazy loading for heavy components

### Performance Monitoring
- Core Web Vitals tracking
- Bundle size analysis
- Lighthouse audits

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3000
```

**API Connection Errors**
- Verify backend is running on http://localhost:8080
- Check NEXT_PUBLIC_API_URL in `.env.local`
- Verify CORS configuration in backend

**Build Errors**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Authentication Issues**
- Check JWT token in localStorage
- Verify token expiration
- Check middleware.ts configuration

### Debug Mode
```bash
# Enable Node.js debugging
NODE_OPTIONS='--inspect' npm run dev
```

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
```

### Environment Variables in Production
Set the following in your deployment platform:
- `NEXT_PUBLIC_API_URL` - Production API URL

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

### Development Workflow
1. Create a feature branch
2. Make changes with proper TypeScript types
3. Run linter and fix issues
4. Test changes locally
5. Submit pull request

### Code Standards
- TypeScript strict mode
- ESLint compliant
- Functional components with hooks
- Consistent naming conventions
- Comprehensive component documentation

## Support

For issues or questions:
- Check the [main README](../README.md)
- Review [API documentation](../docs/api/)
- Create an issue on GitHub
- Contact the development team

## License

See [LICENSE](../LICENSE) file in the root directory.

---

**Quick Start**: Run `npm install && npm run dev` to start development immediately.
