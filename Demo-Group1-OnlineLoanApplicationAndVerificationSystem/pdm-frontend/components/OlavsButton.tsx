import React from 'react';
import { olavsDesign } from '@/lib/olavs-design-system';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';

interface OlavsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function OlavsButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  style,
  ...props
}: OlavsButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const getVariantStyles = () => {
    const isDisabled = disabled || loading;

    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: olavsDesign.spacing[8],
      fontFamily: olavsDesign.typography.font.primary,
      fontSize: olavsDesign.typography.scale.bodyM.size,
      fontWeight: '500',
      borderRadius: olavsDesign.radius.md,
      border: 'none',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      outline: 'none',
      opacity: isDisabled ? 0.5 : 1,
      userSelect: 'none',
    };

    const sizeStyles = {
      sm: {
        height: olavsDesign.components.button.height.sm,
        padding: olavsDesign.components.button.padding.sm,
      },
      md: {
        height: olavsDesign.components.button.height.md,
        padding: olavsDesign.components.button.padding.md,
      },
      lg: {
        height: olavsDesign.components.button.height.lg,
        padding: olavsDesign.components.button.padding.lg,
      },
    };

    // Get base variant styles
    const getVariantBaseStyles = (): React.CSSProperties => {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: isActive && !isDisabled
              ? olavsDesign.colors.primary[700]
              : isHovered && !isDisabled
              ? olavsDesign.colors.primary[600]
              : olavsDesign.colors.primary[500],
            color: '#FFFFFF',
          };
        case 'secondary':
          return {
            backgroundColor: isHovered && !isDisabled
              ? olavsDesign.colors.neutral[200]
              : olavsDesign.colors.neutral[100],
            color: olavsDesign.colors.primary[600],
            border: `1px solid ${olavsDesign.colors.neutral[300]}`,
          };
        case 'tertiary':
          return {
            backgroundColor: isHovered && !isDisabled
              ? olavsDesign.colors.neutral[100]
              : 'transparent',
            color: olavsDesign.colors.primary[600],
          };
        case 'destructive':
          return {
            backgroundColor: isHovered && !isDisabled
              ? '#DC2626'
              : olavsDesign.colors.status.error,
            color: '#FFFFFF',
          };
        case 'icon':
          return {
            backgroundColor: isHovered && !isDisabled
              ? olavsDesign.colors.neutral[100]
              : 'transparent',
            color: olavsDesign.colors.neutral[600],
            padding: olavsDesign.spacing[8],
            width: olavsDesign.components.button.height[size],
          };
        default:
          return {};
      }
    };

    return { ...base, ...sizeStyles[size], ...getVariantBaseStyles() };
  };

  const styles = getVariantStyles();

  return (
    <button
      style={{ ...styles, ...style } as React.CSSProperties}
      disabled={disabled || loading}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      {...props}
    >
      {loading && (
        <svg
          style={{
            animation: 'spin 1s linear infinite',
            width: '16px',
            height: '16px'
          }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            style={{ opacity: 0.25 }}
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            style={{ opacity: 0.75 }}
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {icon && !loading && icon}
      {children}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </button>
  );
}
