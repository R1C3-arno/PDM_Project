import React from 'react';
import { olavsDesign } from '@/lib/olavs-design-system';

interface OlavsContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  className?: string;
}

export function OlavsContainer({ 
  children, 
  maxWidth = 'xl', 
  padding = true,
  className = '' 
}: OlavsContainerProps) {
  const maxWidths = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: olavsDesign.layout.contentWidth,
    full: '100%',
  };

  return (
    <div
      className={className}
      style={{
        width: '100%',
        maxWidth: maxWidths[maxWidth],
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: padding ? `0 ${olavsDesign.spacing[16]}` : '0',
      }}
    >
      <style jsx>{`
        @media (min-width: ${olavsDesign.breakpoints.md}) {
          div {
            padding: ${padding ? `0 ${olavsDesign.spacing[24]}` : '0'};
          }
        }
        @media (min-width: ${olavsDesign.breakpoints.lg}) {
          div {
            padding: ${padding ? `0 ${olavsDesign.spacing[32]}` : '0'};
          }
        }
      `}</style>
      {children}
    </div>
  );
}

