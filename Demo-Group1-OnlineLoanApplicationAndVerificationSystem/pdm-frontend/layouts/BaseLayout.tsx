'use client';

import { ReactNode } from 'react';

interface BaseLayoutProps {
  children: ReactNode;
}

/**
 * BaseLayout - For public pages (landing, login, register, about, contact)
 * No sidebar, no header navigation - just the content
 */
export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>
      {children}
    </div>
  );
}

