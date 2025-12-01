import React from 'react';
import { olavsDesign, getStatusBadgeStyle } from '@/lib/olavs-design-system';

interface OlavsStatusBadgeProps {
  status: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md';
}

export function OlavsStatusBadge({ status, children, size = 'md' }: OlavsStatusBadgeProps) {
  const badgeStyle = getStatusBadgeStyle(status ?? '');
  
  const sizeStyles = {
    sm: {
      fontSize: olavsDesign.typography.scale.caption.size,
      padding: '4px 8px',
    },
    md: {
      fontSize: olavsDesign.typography.scale.bodyS.size,
      padding: '6px 12px',
    },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: olavsDesign.spacing[4],
        backgroundColor: badgeStyle.bg,
        color: badgeStyle.color,
        border: `1px solid ${badgeStyle.border}`,
        borderRadius: olavsDesign.radius.full,
        fontFamily: olavsDesign.typography.font.primary,
        fontWeight: '500',
        lineHeight: '1',
        whiteSpace: 'nowrap',
        ...sizeStyles[size],
      }}
    >
      {children || status.replace(/_/g, ' ').toUpperCase()}
    </span>
  );
}

