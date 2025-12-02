import React from 'react';
import { olavsDesign } from '@/lib/olavs-design-system';

interface OlavsCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  noBorder?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const paddingMap = {
  none: '0',
  sm: olavsDesign.spacing[16],
  md: olavsDesign.spacing[24],
  lg: olavsDesign.spacing[32],
  xl: olavsDesign.spacing[48],
};

export function OlavsCard({ 
  children, 
  title, 
  subtitle, 
  action, 
  elevation = 'level1',
  padding = 'lg',
  noBorder = false,
  className = '',
  style = {},
  onClick,
}: OlavsCardProps) {
  const elevationValue = olavsDesign.elevation[elevation];
  const paddingValue = paddingMap[padding];

  const hasHeader = title || subtitle || action;

  return (
    <div
      className={`olavs-card ${className}`}
      onClick={onClick}
      style={{
        backgroundColor: olavsDesign.colors.surface.default,
        borderRadius: olavsDesign.radius.lg,
        border: noBorder ? 'none' : `1px solid ${olavsDesign.colors.neutral[200]}`,
        boxShadow: elevationValue,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        ...style,
      }}
    >
      {hasHeader && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: paddingValue,
          borderBottom: `1px solid ${olavsDesign.colors.neutral[100]}`,
          gap: olavsDesign.spacing[16],
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {title && (
              <h3 style={{
                fontSize: olavsDesign.typography.scale.headingS.size,
                fontWeight: 600,
                color: olavsDesign.colors.neutral[900],
                marginBottom: subtitle ? olavsDesign.spacing[4] : 0,
                lineHeight: '1.3',
              }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{
                fontSize: olavsDesign.typography.scale.bodyS.size,
                color: olavsDesign.colors.neutral[600],
                lineHeight: '1.5',
                marginTop: olavsDesign.spacing[4],
              }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && (
            <div style={{ flexShrink: 0 }}>
              {action}
            </div>
          )}
        </div>
      )}
      <div style={{
        padding: hasHeader ? paddingValue : paddingValue,
      }}>
        {children}
      </div>
    </div>
  );
}
