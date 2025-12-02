'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ReactNode, useEffect, useRef } from 'react';
import { X, LayoutDashboard, FileText, Wallet, ArrowLeftRight, User, Mail, Bell, LogOut, CreditCard, HelpCircle } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: ReactNode;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIDEBAR_WIDTH = 260;

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Focus trap for accessibility
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      // Focus trap logic
      if (e.key === 'Tab' && sidebarRef.current) {
        const focusableElements = sidebarRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Only trap focus on mobile (when drawer mode is active)
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
      // Focus the close button when drawer opens
      firstFocusableRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!user) return null;

  // User (APPLICANT) navigation items
  const getUserNavItems = (userId: string): NavItem[] => [
    { name: 'Dashboard', href: `/user/${userId}/dashboard`, icon: <LayoutDashboard size={20} /> },
    { name: 'My Applications', href: `/user/${userId}/applications`, icon: <FileText size={20} /> },
    { name: 'My Loans', href: `/user/${userId}/loans`, icon: <CreditCard size={20} /> },
    { name: 'My Wallet', href: `/user/${userId}/wallet`, icon: <Wallet size={20} /> },
    { name: 'Transactions', href: `/user/${userId}/transactions`, icon: <ArrowLeftRight size={20} /> },
    { name: 'Messages', href: `/user/${userId}/messages`, icon: <Mail size={20} /> },
  ];

  const getUserSettingsItems = (userId: string): NavItem[] => [
    { name: 'Profile', href: `/user/${userId}`, icon: <User size={20} /> },
    { name: 'Notifications', href: `/user/${userId}/notifications`, icon: <Bell size={20} /> },
    { name: 'Support', href: `/user/${userId}/support`, icon: <HelpCircle size={20} /> },
  ];

  // Staff navigation items
  const getStaffNavItems = (role: string, staffId: string): NavItem[] => {
    const staffType = role.toLowerCase();
    const items: NavItem[] = [
      { name: 'Dashboard', href: `/staff/${staffType}/${staffId}`, icon: <LayoutDashboard size={20} /> },
    ];

    if (['BANKER', 'VERIFIER', 'UNDERWRITER', 'ADMIN'].includes(role)) {
      items.push({ name: 'Applications', href: `/staff/${staffType}/${staffId}/applications`, icon: <FileText size={20} /> });
    }

    if (['BANKER', 'ADMIN'].includes(role)) {
      items.push({ name: 'Repayments', href: `/staff/${staffType}/${staffId}/repayments`, icon: <Wallet size={20} /> });
    }

    return items;
  };

  // Admin navigation items
  const getAdminNavItems = (adminId: string): NavItem[] => [
    { name: 'Dashboard', href: `/admin/system/${adminId}`, icon: <LayoutDashboard size={20} /> },
    { name: 'Users', href: `/admin/system/${adminId}/users`, icon: <User size={20} /> },
    { name: 'Applications', href: `/admin/system/${adminId}/applications`, icon: <FileText size={20} /> },
  ];

  const isUser = user.role === 'APPLICANT';
  const isAdmin = user.role === 'ADMIN';
  const isStaff = ['BANKER', 'VERIFIER', 'UNDERWRITER'].includes(user.role);

  let navItems: NavItem[] = [];
  let settingsItems: NavItem[] = [];

  if (isUser) {
    navItems = getUserNavItems(String(user.id));
    settingsItems = getUserSettingsItems(String(user.id));
  } else if (isAdmin) {
    navItems = getAdminNavItems(String(user.id));
  } else if (isStaff) {
    navItems = getStaffNavItems(user.role, String(user.id));
  }

  const isActive = (path: string) => {
    // Exact match for Profile (ends with just /user/{id})
    if (path.match(/^\/user\/\d+$/) || path.match(/^\/staff\/[^/]+\/\d+$/) || path.match(/^\/admin\/[^/]+\/\d+$/)) {
      return pathname === path;
    }
    // Exact match for dashboard
    if (path.includes('/dashboard')) {
      return pathname === path;
    }
    // For other paths, check if current path starts with the nav path
    // but ensure we don't match partial paths (e.g., /applications shouldn't match /applications-new)
    if (pathname === path) return true;
    if (pathname.startsWith(path + '/')) return true;
    return false;
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const handleNavClick = () => {
    // Only close on mobile
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop/Scrim for mobile drawer - ONLY visible on mobile when open */}
      <div
        className="sidebar-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 40,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
        }}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        role="navigation"
        aria-label="Main navigation"
        className="sidebar"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          width: `${SIDEBAR_WIDTH}px`,
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          zIndex: 50,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header with Logo and Close button (close only on mobile) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image
              src="/logo.png"
              alt="OLAVS Logo"
              width={32}
              height={32}
              style={{ borderRadius: '6px' }}
            />
            <span style={{ fontWeight: '600', fontSize: '16px', color: '#111827' }}>OLAVS</span>
          </Link>

          {/* Close button - only visible on mobile */}
          <button
            ref={firstFocusableRef}
            onClick={onClose}
            className="sidebar-close-btn"
            style={{
              display: 'none', // Hidden by default, shown via CSS on mobile
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            aria-label="Close navigation menu"
          >
            <X size={20} color="#374151" />
          </button>
        </div>

        {/* Navigation Items */}
        <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px',
                padding: '0 8px',
              }}
            >
              {isUser ? 'MANAGE' : 'MENU'}
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: isActive(item.href) ? '#3b82f6' : '#374151',
                    backgroundColor: isActive(item.href) ? '#eff6ff' : 'transparent',
                    fontWeight: isActive(item.href) ? '600' : '500',
                    fontSize: '14px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span style={{ color: isActive(item.href) ? '#3b82f6' : '#6b7280' }}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Settings Items */}
          {settingsItems.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '8px',
                  padding: '0 8px',
                }}
              >
                SETTINGS
              </h3>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {settingsItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavClick}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: isActive(item.href) ? '#3b82f6' : '#374151',
                      backgroundColor: isActive(item.href) ? '#eff6ff' : 'transparent',
                      fontWeight: isActive(item.href) ? '600' : '500',
                      fontSize: '14px',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(item.href)) {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.href)) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span style={{ color: isActive(item.href) ? '#3b82f6' : '#6b7280' }}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Footer with User Info and Logout */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#fafafa',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '16px',
                flexShrink: 0,
              }}
            >
              {((user?.fullName || user?.email || 'U')[0] ?? 'U').toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.fullName || 'User'}
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #fecaca',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              fontWeight: '500',
              fontSize: '14px',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fef2f2';
            }}
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <style jsx>{`
        /* Mobile: Drawer behavior */
        @media (max-width: 767px) {
          .sidebar {
            transform: ${isOpen ? 'translateX(0)' : 'translateX(-100%)'};
            transition: transform 0.3s ease;
          }
          .sidebar-close-btn {
            display: flex !important;
          }
          .sidebar-close-btn:hover {
            background-color: #f3f4f6;
          }
        }

        /* Desktop: Permanent sidebar */
        @media (min-width: 768px) {
          .sidebar {
            transform: translateX(0);
          }
          .sidebar-backdrop {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

export { SIDEBAR_WIDTH };
