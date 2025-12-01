import React from 'react';
import { olavsDesign } from '@/lib/olavs-design-system';

interface OlavsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export function OlavsInput({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  ...props
}: OlavsInputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: olavsDesign.spacing[8], width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label
          style={{
            fontSize: olavsDesign.typography.scale.bodyS.size,
            fontWeight: '500',
            color: olavsDesign.colors.neutral[700],
            fontFamily: olavsDesign.typography.font.primary,
          }}
        >
          {label}
        </label>
      )}
      <input
        style={{
          height: olavsDesign.components.input.height.md,
          padding: olavsDesign.components.input.padding.md,
          borderRadius: olavsDesign.components.input.borderRadius,
          border: `${olavsDesign.components.input.borderWidth} solid ${
            error ? olavsDesign.colors.status.error : olavsDesign.colors.neutral[300]
          }`,
          fontFamily: olavsDesign.typography.font.primary,
          fontSize: olavsDesign.typography.scale.bodyM.size,
          color: olavsDesign.colors.neutral[900],
          outline: 'none',
          transition: 'all 0.2s ease',
          width: '100%',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error
            ? olavsDesign.colors.status.error
            : olavsDesign.colors.primary[500];
          e.target.style.boxShadow = `0 0 0 3px ${
            error
              ? olavsDesign.colors.status.error + '20'
              : olavsDesign.colors.primary[100]
          }`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error
            ? olavsDesign.colors.status.error
            : olavsDesign.colors.neutral[300];
          e.target.style.boxShadow = 'none';
        }}
        className={className}
        {...props}
      />
      {(error || helperText) && (
        <span
          style={{
            fontSize: olavsDesign.typography.scale.caption.size,
            color: error ? olavsDesign.colors.status.error : olavsDesign.colors.neutral[500],
            fontFamily: olavsDesign.typography.font.primary,
          }}
        >
          {error || helperText}
        </span>
      )}
    </div>
  );
}

