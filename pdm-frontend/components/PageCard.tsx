import React from 'react';
import { theme } from '@/lib/theme';

interface PageCardProps {
  children: React.ReactNode;
  maxWidth?: number;
  centered?: boolean;
  padding?: number;
}

export const PageCard: React.FC<PageCardProps> = ({ 
  children, 
  maxWidth, 
  centered = false,
  padding = 24,
}) => {
  return (
    <div
      style={{
        backgroundColor: theme.colors.surface.primary,
        borderRadius: '10px',
        padding: `${padding}px`,
        boxShadow: theme.shadows.card,
        border: `1px solid #F0F2F4`,
        maxWidth: maxWidth ? `${maxWidth}px` : undefined,
        margin: centered ? '0 auto' : undefined,
      }}
    >
      {children}
    </div>
  );
};

