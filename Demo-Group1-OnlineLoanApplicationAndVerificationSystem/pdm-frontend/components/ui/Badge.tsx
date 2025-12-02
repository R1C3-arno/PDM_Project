/**
 * Badge Component
 * Status badge with color variants
 */

import React, { ReactNode } from 'react';

export interface BadgeProps {
  /**
   * Badge content
   */
  children: ReactNode;

  /**
   * Color variant
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Icon to display before the text
   */
  icon?: ReactNode;
}

const variantClasses = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-primary-100 text-primary-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon,
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        font-medium rounded-full
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {icon}
      {children}
    </span>
  );
};
