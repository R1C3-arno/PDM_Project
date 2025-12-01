'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { auditLogger } from '@/lib/audit';

/**
 * Component that automatically tracks page views for audit logging.
 *
 * Usage: Add to your root layout or any layout component
 * ```tsx
 * <AuditPageTracker />
 * ```
 */
export function AuditPageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      auditLogger.logPageView(pathname);
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
