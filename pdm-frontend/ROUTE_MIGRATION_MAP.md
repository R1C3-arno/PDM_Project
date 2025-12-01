# Route Migration Map

This document maps the old route structure to the new RESTful hierarchy implemented on 2025-11-28.

## Overview

The frontend has been reorganized to follow a proper RESTful structure with clear role-based routing hierarchy and route groups.

### Route Groups

- `(public)` - Public pages accessible without authentication
- `(authenticated)` - All authenticated pages with shared auth layout

## Route Mapping

### Public Routes

| Old Route | New Route | Description |
|-----------|-----------|-------------|
| `/` | `/(public)/page.tsx` | Landing page |
| `/login` | `/(public)/login/page.tsx` | User login |
| `/register` | `/(public)/register/page.tsx` | User registration |
| `/about` | `/(public)/about/page.tsx` | About page |
| `/contact` | `/(public)/contact/page.tsx` | Contact page |

### User (APPLICANT) Routes

All user routes now follow the pattern: `/user/[user_id]/*`

| Old Route | New Route | Description |
|-----------|-----------|-------------|
| `/dashboard` | `/user/[user_id]/dashboard` | User dashboard |
| `/profile` | `/user/[user_id]` | User profile overview |
| `/wallet` | `/user/[user_id]/wallet` | User wallet |
| `/transactions` | `/user/[user_id]/transactions` | User transactions |
| `/messages` | `/user/[user_id]/messages` | User messages |
| `/notifications` | `/user/[user_id]/notifications` | User notifications |
| `/loans` | `/user/[user_id]/loans` | User loans list |
| `/loans/[id]` | `/user/[user_id]/loans/[loan_id]` | Loan details |
| `/applications` | `/user/[user_id]/applications` | Applications list |
| `/applications/new` | `/user/[user_id]/applications/new` | New application |
| `/applications/[id]` | `/user/[user_id]/applications/[application_id]` | Application details |
| `/applications/[id]/documents` | `/user/[user_id]/applications/[application_id]/documents` | Application documents |
| `/applications/[id]/offer` | `/user/[user_id]/applications/[application_id]/offer` | Loan offer |
| `/applications/[id]/contract` | `/user/[user_id]/applications/[application_id]/contract` | Loan contract |

### Staff Routes

All staff routes now follow the pattern: `/staff/[staff_type]/[staff_id]/*`

Where `[staff_type]` is one of: `banker`, `verifier`, `underwriter`

| Old Route | New Route | Description |
|-----------|-----------|-------------|
| `/staff/login` | `/staff/login` | Staff login (public) |
| `/staff/dashboard` | `/staff/[staff_type]/[staff_id]` | Staff dashboard |
| N/A | `/staff/[staff_type]/[staff_id]/applications` | Applications list |
| `/staff/applications/[id]` | `/staff/[staff_type]/[staff_id]/applications/[application_id]` | Application review |
| `/staff/applications/[id]/verification` | `/staff/[staff_type]/[staff_id]/applications/[application_id]/verification` | KYC/AML verification |
| `/staff/applications/[id]/risk` | `/staff/[staff_type]/[staff_id]/applications/[application_id]/risk` | Risk assessment |
| `/staff/applications/[id]/offer/new` | `/staff/[staff_type]/[staff_id]/applications/[application_id]/offer/new` | Create offer |
| `/staff/applications/[id]/disbursement` | `/staff/[staff_type]/[staff_id]/applications/[application_id]/disbursement` | Disburse funds |
| `/staff/repayments` | `/staff/[staff_type]/[staff_id]/repayments` | Manage repayments |

### Admin Routes

All admin routes now follow the pattern: `/admin/[admin_type]/[admin_id]/*`

Where `[admin_type]` is typically `system` (future: `super`)

| Old Route | New Route | Description |
|-----------|-----------|-------------|
| `/admin` | `/admin/system/[admin_id]` | Admin dashboard |
| `/users` | `/admin/system/[admin_id]/users` | User management |
| N/A | `/admin/system/[admin_id]/users/[user_id]` | User detail |
| N/A | `/admin/system/[admin_id]/applications` | All applications |
| N/A | `/admin/system/[admin_id]/applications/[application_id]` | Application detail |
| N/A | `/admin/system/[admin_id]/loans` | All loans |
| N/A | `/admin/system/[admin_id]/staff` | Staff management |
| N/A | `/admin/system/[admin_id]/reports` | Reports |
| N/A | `/admin/system/[admin_id]/settings` | System settings |

## Layout Hierarchy

```
app/
├── layout.tsx                                    # Root layout with AuthProvider
├── (public)/                                     # Public route group (no auth required)
│   ├── page.tsx                                  # Landing page
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── about/page.tsx
│   └── contact/page.tsx
│
└── (authenticated)/                              # Authenticated route group
    ├── layout.tsx                                # Base auth check
    │
    ├── user/
    │   └── [user_id]/
    │       ├── layout.tsx                        # User layout with sidebar
    │       ├── page.tsx                          # Profile overview
    │       ├── dashboard/page.tsx
    │       ├── applications/
    │       │   ├── page.tsx                      # List
    │       │   ├── new/page.tsx
    │       │   └── [application_id]/
    │       │       ├── page.tsx
    │       │       ├── documents/page.tsx
    │       │       ├── offer/page.tsx
    │       │       └── contract/page.tsx
    │       ├── loans/
    │       │   ├── page.tsx
    │       │   └── [loan_id]/page.tsx
    │       ├── wallet/page.tsx
    │       ├── transactions/page.tsx
    │       ├── messages/page.tsx
    │       └── notifications/page.tsx
    │
    ├── staff/
    │   ├── layout.tsx                            # Staff layout with sidebar
    │   ├── login/page.tsx                        # Staff login
    │   └── [staff_type]/                         # banker, verifier, underwriter
    │       └── [staff_id]/
    │           ├── page.tsx                      # Dashboard
    │           ├── applications/
    │           │   ├── page.tsx                  # List
    │           │   └── [application_id]/
    │           │       ├── page.tsx              # Review
    │           │       ├── verification/page.tsx
    │           │       ├── risk/page.tsx
    │           │       ├── offer/new/page.tsx
    │           │       └── disbursement/page.tsx
    │           └── repayments/page.tsx
    │
    └── admin/
        ├── layout.tsx                            # Admin layout with sidebar
        ├── login/page.tsx                        # Admin login (optional)
        └── [admin_type]/                         # system, super
            └── [admin_id]/
                ├── page.tsx                      # Dashboard
                ├── users/
                │   ├── page.tsx
                │   └── [user_id]/page.tsx
                ├── applications/
                │   ├── page.tsx
                │   └── [application_id]/page.tsx
                ├── loans/page.tsx
                ├── staff/page.tsx
                ├── reports/page.tsx
                └── settings/page.tsx
```

## Migration Checklist

- [x] Create new directory structure with route groups
- [x] Create shared layouts for authenticated, staff, and admin sections
- [x] Move public pages to (public) route group
- [x] Move user pages to (authenticated)/user/[user_id] structure
- [x] Move staff pages to (authenticated)/staff/[staff_type]/[staff_id] structure
- [x] Move admin pages to (authenticated)/admin/[admin_type]/[admin_id] structure
- [x] Update middleware.ts to handle new route structure
- [ ] Update all navigation links in components
- [ ] Update all router.push calls in page files
- [ ] Remove old route files
- [ ] Update redirect logic after login
- [ ] Test all routes
- [ ] Update API client calls if needed

## Key Changes

### 1. User Resource Isolation
Users can now only access their own resources through the `[user_id]` parameter. The layout enforces that `user.id === user_id` in the URL.

### 2. Staff Type Segregation
Staff members are segregated by their role type (`banker`, `verifier`, `underwriter`) which allows for:
- Role-specific dashboards
- Different permission sets per route
- Future expansion of role-specific features

### 3. Admin Type Flexibility
Admin routes support different admin types (`system`, `super`) for future role expansion.

### 4. Middleware Updates
- Public routes: `/`, `/login`, `/register`, `/about`, `/contact`, `/staff/login`
- User protected routes: `/user/*`
- Staff protected routes: `/staff/*` (except `/staff/login`)
- Admin protected routes: `/admin/*` (except `/admin/login`)

### 5. Redirect Logic
After successful login, redirect to:
- APPLICANT → `/user/[user_id]/dashboard`
- BANKER/VERIFIER/UNDERWRITER → `/staff/[staff_type]/[staff_id]`
- ADMIN → `/admin/system/[admin_id]`

## Benefits

1. **RESTful Structure**: Routes clearly indicate resource hierarchy
2. **Role-Based Access**: URL structure enforces role separation
3. **Resource Isolation**: Users can only access their own resources
4. **Scalability**: Easy to add new admin types or staff roles
5. **Maintainability**: Clear organization reduces confusion
6. **DRY Principle**: Shared layouts eliminate code duplication
7. **Type Safety**: Dynamic segments are strongly typed

## Next Steps

1. Update all router.push() calls in existing pages
2. Update navigation components (Sidebar, Header)
3. Update redirect logic in login pages
4. Test all routes with different user roles
5. Remove old route files once migration is complete
6. Update any hardcoded URLs in backend API calls
