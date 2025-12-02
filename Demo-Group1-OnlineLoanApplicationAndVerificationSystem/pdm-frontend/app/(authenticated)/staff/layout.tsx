'use client';

import { ReactNode } from 'react';

interface StaffLayoutProps {
  children: ReactNode;
}

/**
 * Staff layout - simple pass-through
 * Authentication and layout is handled by StaffDashboardLayout in individual pages
 */
export default function StaffLayout({ children }: StaffLayoutProps) {
  return <>{children}</>;
}
