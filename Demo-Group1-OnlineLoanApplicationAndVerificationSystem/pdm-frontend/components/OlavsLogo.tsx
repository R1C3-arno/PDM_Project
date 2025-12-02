import React from 'react';
import { olavsDesign } from '@/lib/olavs-design-system';

interface OlavsLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function OlavsLogo({ size = 'md', showText = true, className = '' }: OlavsLogoProps) {
  const sizes = {
    sm: '32px',
    md: '48px',
    lg: '64px',
  };

  const textSizes = {
    sm: olavsDesign.typography.scale.bodyM.size,
    md: olavsDesign.typography.scale.headingS.size,
    lg: olavsDesign.typography.scale.headingM.size,
  };

  return (
    <div 
      className={className}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: olavsDesign.spacing[12] 
      }}
    >
      <img 
        src="/logo.png" 
        alt="HCMC-IU Logo" 
        style={{
          width: sizes[size],
          height: sizes[size],
          objectFit: 'contain',
        }}
      />
      {showText && (
        <span style={{
          fontSize: textSizes[size],
          fontWeight: olavsDesign.typography.scale.headingS.weight,
          color: olavsDesign.colors.neutral[900],
          fontFamily: olavsDesign.typography.font.primary,
        }}>
          OLAVS
        </span>
      )}
    </div>
  );
}

