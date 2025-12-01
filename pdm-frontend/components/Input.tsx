import React from 'react';
import { theme } from '@/lib/theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const inputStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: `1px solid ${error ? theme.colors.error : theme.colors.border}`,
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '15px',
    width: fullWidth ? '100%' : 'auto',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  return (
    <div style={{ marginBottom: theme.spacing.md, width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: theme.spacing.sm,
            color: theme.colors.textSecondary,
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        className={className}
        style={inputStyle}
        onFocus={(e) => {
          e.target.style.borderColor = theme.colors.primary[500];
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? theme.colors.error : theme.colors.border;
          props.onBlur?.(e);
        }}
      />
      {error && (
        <span
          style={{
            display: 'block',
            marginTop: theme.spacing.xs,
            color: theme.colors.error,
            fontSize: '13px',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

