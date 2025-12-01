/**
 * Centralized Validation Library
 * Single source of truth for all validation logic across the PDM application
 * Follows DRY principle - define validation rules once, use everywhere
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const trimmed = email.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  return { isValid: true };
};

// Phone number validation
export const validatePhone = (phone: string): ValidationResult => {
  const trimmed = phone.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Accept formats: +1234567890, 123-456-7890, (123) 456-7890, etc.
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (!phoneRegex.test(trimmed.replace(/\s/g, ''))) {
    return { isValid: false, error: 'Invalid phone number format' };
  }

  return { isValid: true };
};

// Required field validation
export const validateRequired = (value: string | number | null | undefined, fieldName: string = 'This field'): ValidationResult => {
  if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
};

// Number validation
export const validateNumber = (value: number | string, options?: {
  min?: number;
  max?: number;
  fieldName?: string;
}): ValidationResult => {
  const fieldName = options?.fieldName || 'Value';
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }

  if (options?.min !== undefined && num < options.min) {
    return { isValid: false, error: `${fieldName} must be at least ${options.min}` };
  }

  if (options?.max !== undefined && num > options.max) {
    return { isValid: false, error: `${fieldName} must not exceed ${options.max}` };
  }

  return { isValid: true };
};

// Loan amount validation
export const validateLoanAmount = (amount: number): ValidationResult => {
  return validateNumber(amount, {
    min: 1000,
    max: 100000,
    fieldName: 'Loan amount',
  });
};

// Interest rate validation
export const validateInterestRate = (rate: number): ValidationResult => {
  return validateNumber(rate, {
    min: 0,
    max: 100,
    fieldName: 'Interest rate',
  });
};

// Term months validation
export const validateTermMonths = (months: number): ValidationResult => {
  const result = validateNumber(months, {
    min: 1,
    max: 360,
    fieldName: 'Loan term',
  });

  if (!result.isValid) return result;

  if (!Number.isInteger(months)) {
    return { isValid: false, error: 'Loan term must be a whole number' };
  }

  return { isValid: true };
};

// Full name validation
export const validateFullName = (name: string): ValidationResult => {
  const trimmed = name.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Full name is required' };
  }

  if (trimmed.length < 2) {
    return { isValid: false, error: 'Full name must be at least 2 characters' };
  }

  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Full name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { isValid: true };
};

// Date validation
export const validateDate = (date: string | Date, fieldName: string = 'Date'): ValidationResult => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: `${fieldName} is invalid` };
  }

  return { isValid: true };
};

// Date range validation
export const validateDateRange = (startDate: string | Date, endDate: string | Date): ValidationResult => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  const startValidation = validateDate(start, 'Start date');
  if (!startValidation.isValid) return startValidation;

  const endValidation = validateDate(end, 'End date');
  if (!endValidation.isValid) return endValidation;

  if (start >= end) {
    return { isValid: false, error: 'End date must be after start date' };
  }

  return { isValid: true };
};

// Multiple validation - combine multiple validators
export const validateMultiple = (...validations: ValidationResult[]): ValidationResult => {
  for (const validation of validations) {
    if (!validation.isValid) {
      return validation;
    }
  }

  return { isValid: true };
};

// Form validation helper
export const validateForm = (validations: Record<string, ValidationResult>): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, validation] of Object.entries(validations)) {
    if (!validation.isValid && validation.error) {
      errors[field] = validation.error;
      isValid = false;
    }
  }

  return { isValid, errors };
};
