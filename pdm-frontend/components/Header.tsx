'use client';

import { Menu, Mail } from 'lucide-react';
import Link from 'next/link';
import { useUnreadCount } from '@/hooks/useMessages';

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
  userId?: number;
}

export function Header({ onMenuClick, title, userId = 1 }: HeaderProps) {
  const unreadCount = useUnreadCount(userId);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        zIndex: 100,
      }}
    >
      <button
        onClick={onMenuClick}
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
          marginRight: '16px',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        className="header-toggle"
      >
        <Menu size={20} color="#374151" />
      </button>

      {title && (
        <h1
          style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            margin: 0,
          }}
        >
          {title}
        </h1>
      )}

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Messages Icon with Unread Badge */}
        <Link
          href="/messages"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="Messages"
        >
          <Mail size={20} color="#374151" />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: '600',
                minWidth: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                border: '2px solid #ffffff',
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .header-toggle {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}

