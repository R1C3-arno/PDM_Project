'use client';

import { useState, useEffect, ReactNode } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar, SIDEBAR_WIDTH } from '@/components/Sidebar';
import { Menu } from 'lucide-react';

interface UserDashboardLayoutProps {
  children: ReactNode;
}

/**
 * UserDashboardLayout - For APPLICANT role
 * Features:
 * - Permanent left sidebar on desktop (pushes content)
 * - Drawer sidebar on mobile (overlays with scrim)
 * - Mobile-only header with menu toggle
 * - Main content area with proper offset
 */
export function UserDashboardLayout({ children }: UserDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push('/login');
      return;
    }

    // Redirect non-APPLICANT users to appropriate dashboard
    if (user && user.role !== 'APPLICANT') {
      if (['BANKER', 'VERIFIER', 'UNDERWRITER', 'ADMIN'].includes(user.role)) {
        router.push('/staff/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              width: '48px',
              height: '48px',
              border: '4px solid #e5e7eb',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ marginTop: '16px', color: '#6b7280', fontSize: '14px' }}>
            Loading...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // Don't render if not authenticated or wrong role
  if (!isAuthenticated || !user || user.role !== 'APPLICANT') {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area - offset by sidebar on desktop */}
      <div
        className="main-content"
        style={{
          minHeight: '100vh',
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* Mobile-only header with menu toggle */}
        <header
          className="mobile-header"
          style={{
            position: 'sticky',
            top: 0,
            display: 'none', // Hidden by default, shown on mobile via CSS
            alignItems: 'center',
            height: '60px',
            padding: '0 16px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            zIndex: 30,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
            aria-label="Open navigation menu"
          >
            <Menu size={20} color="#374151" />
          </button>
          <div style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Image
              src="/logo.png"
              alt="OLAVS Logo"
              width={28}
              height={28}
              style={{ borderRadius: '4px' }}
            />
            <span
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827',
              }}
            >
              OLAVS
            </span>
          </div>
        </header>

        {/* Page content */}
        <main>{children}</main>
      </div>

      <style jsx>{`
        /* Mobile: No sidebar offset, show mobile header */
        @media (max-width: 767px) {
          .main-content {
            margin-left: 0;
          }
          .mobile-header {
            display: flex !important;
          }
        }

        /* Desktop: Offset by sidebar width, hide mobile header */
        @media (min-width: 768px) {
          .main-content {
            margin-left: ${SIDEBAR_WIDTH}px;
          }
          .mobile-header {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
