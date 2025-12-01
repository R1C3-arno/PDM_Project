/**
 * Validation rules and utilities for loan application forms
 */

import { ApplicationFormData, Product } from '@/hooks/useApplicationForm';

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ApplicationFormData, string>>;
}

/**
 * Validate loan amount against product limits
 */
export function validateLoanAmount(
  amount: string,
  product: Product | undefined
): string | null {
  const numAmount = parseFloat(amount);

  if (!amount || isNaN(numAmount)) {
    return 'Loan amount is required';
  }

  if (product) {
    if (numAmount < product.minAmount) {
      return `Minimum amount for this product is $${product.minAmount.toLocaleString()}`;
    }
    if (numAmount > product.maxAmount) {
      return `Maximum amount for this product is $${product.maxAmount.toLocaleString()}`;
    }
  }

  return null;
}

/**
 * Validate loan term against product limits
 */
export function validateLoanTerm(
  term: string,
  product: Product | undefined
): string | null {
  const numTerm = parseInt(term);

  if (!term || isNaN(numTerm)) {
    return 'Loan term is required';
  }

  if (product) {
    if (numTerm < product.minTermMonths) {
      return `Minimum term for this product is ${product.minTermMonths} months`;
    }
    if (numTerm > product.maxTermMonths) {
      return `Maximum term for this product is ${product.maxTermMonths} months`;
    }
  }

  return null;
}

/**
 * Validate monthly income
 */
export function validateMonthlyIncome(income: string): string | null {
  const numIncome = parseFloat(income);

  if (!income || isNaN(numIncome)) {
    return 'Monthly income is required';
  }

  if (numIncome <= 0) {
    return 'Monthly income must be greater than zero';
  }

  return null;
}

/**
 * Validate loan purpose
 */
export function validatePurpose(purpose: string): string | null {
  if (!purpose || purpose.trim().length === 0) {
    return 'Loan purpose is required';
  }

  if (purpose.trim().length < 10) {
    return 'Please provide a more detailed loan purpose (at least 10 characters)';
  }

  return null;
}

/**
 * Validate entire form for a specific step
 */
export function validateFormStep(
  step: number,
  formData: ApplicationFormData,
  product: Product | undefined
): ValidationResult {
  const errors: Partial<Record<keyof ApplicationFormData, string>> = {};

  if (step === 1) {
    if (!formData.productId) {
      errors.productId = 'Please select a loan product';
    }

    const amountError = validateLoanAmount(formData.requestedAmount, product);
    if (amountError) {
      errors.requestedAmount = amountError;
    }

    const termError = validateLoanTerm(formData.requestedTermMonths, product);
    if (termError) {
      errors.requestedTermMonths = termError;
    }
  }

  if (step === 2) {
    const purposeError = validatePurpose(formData.purpose);
    if (purposeError) {
      errors.purpose = purposeError;
    }

    if (!formData.employmentType) {
      errors.employmentType = 'Please select your employment type';
    }

    const incomeError = validateMonthlyIncome(formData.monthlyIncome);
    if (incomeError) {
      errors.monthlyIncome = incomeError;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
