/**
 * Card Component
 * Reusable card container with consistent styling
 */

import React, { ReactNode } from 'react';

export interface CardProps {
  /**
   * Optional title displayed at the top of the card
   */
  title?: string;

  /**
   * Optional subtitle or description below the title
   */
  subtitle?: string;

  /**
   * Content to render inside the card
   */
  children: ReactNode;

  /**
   * Additional CSS classes to apply
   */
  className?: string;

  /**
   * Actions or buttons to display in the header
   */
  actions?: ReactNode;

  /**
   * Padding variant
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';

  /**
   * Click handler for the entire card
   */
  onClick?: () => void;

  /**
   * Whether the card is hoverable (adds hover effects)
   */
  hoverable?: boolean;
}

const paddingClasses = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  actions,
  padding = 'md',
  onClick,
  hoverable = false,
}) => {
  const hoverClasses = hoverable
    ? 'transition-all duration-200 hover:shadow-lg hover:border-primary-300 cursor-pointer'
    : '';

  return (
    <div
      className={`bg-white shadow-sm rounded-lg border border-gray-200 ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {(title || subtitle || actions) && (
        <div className={`border-b border-gray-200 flex justify-between items-start ${paddingClasses[padding]}`}>
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && <div className="ml-4">{actions}</div>}
        </div>
      )}
      <div className={paddingClasses[padding]}>{children}</div>
    </div>
  );
};
