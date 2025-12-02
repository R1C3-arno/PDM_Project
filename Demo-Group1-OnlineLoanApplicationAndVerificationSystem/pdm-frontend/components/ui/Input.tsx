/**
 * Input Component
 * Form input with label, error state, and helper text
 */

import React, { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input label
   */
  label?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Helper text to display below the input
   */
  helperText?: string;

  /**
   * Whether the input should take full width
   */
  fullWidth?: boolean;

  /**
   * Icon to display before the input
   */
  icon?: ReactNode;

  /**
   * Icon to display after the input
   */
  iconRight?: ReactNode;

  /**
   * Whether the field is required (adds asterisk to label)
   */
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  icon,
  iconRight,
  required = false,
  className = '',
  ...props
}) => {
  const hasError = !!error;
  const widthClass = fullWidth ? 'w-full' : '';

  const inputClasses = `
    block px-4 py-2 rounded-lg border
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
    }
    ${icon ? 'pl-10' : ''}
    ${iconRight ? 'pr-10' : ''}
    ${widthClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={widthClass}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input {...props} className={inputClasses} />

        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {iconRight}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}

      {!error && helperText && (
        <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
