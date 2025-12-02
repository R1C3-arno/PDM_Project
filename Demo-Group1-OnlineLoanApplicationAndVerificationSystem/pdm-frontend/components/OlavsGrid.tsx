import React from 'react';
import { olavsDesign } from '@/lib/olavs-design-system';

interface OlavsGridProps {
  children: React.ReactNode;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: keyof typeof olavsDesign.spacing;
  className?: string;
  style?: React.CSSProperties;
}

export function OlavsGrid({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 24,
  className = '',
  style = {}
}: OlavsGridProps) {
  const gapValue = olavsDesign.spacing[gap] || olavsDesign.spacing[24];

  return (
    <>
      <div
        className={`olavs-grid ${className}`}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols.xs || 1}, 1fr)`,
          gap: gapValue,
          ...style,
        }}
      >
        {children}
      </div>
      <style jsx>{`
        .olavs-grid {
          ${cols.sm ? `@media (min-width: ${olavsDesign.breakpoints.sm}) {
            grid-template-columns: repeat(${cols.sm}, 1fr);
          }` : ''}
          ${cols.md ? `@media (min-width: ${olavsDesign.breakpoints.md}) {
            grid-template-columns: repeat(${cols.md}, 1fr);
          }` : ''}
          ${cols.lg ? `@media (min-width: ${olavsDesign.breakpoints.lg}) {
            grid-template-columns: repeat(${cols.lg}, 1fr);
          }` : ''}
          ${cols.xl ? `@media (min-width: ${olavsDesign.breakpoints.xl}) {
            grid-template-columns: repeat(${cols.xl}, 1fr);
          }` : ''}
        }
      `}</style>
    </>
  );
}

