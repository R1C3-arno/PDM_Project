'use client';

import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Admin layout - simple pass-through
 * Authentication and layout is handled by StaffDashboardLayout in individual pages
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return <>{children}</>;
}
