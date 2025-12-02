/**
 * Custom hook for managing loan application form state
 * Handles form data, validation, and multi-step navigation
 */

import { useState, useEffect, useCallback } from 'react';

export interface Product {
  id: number;
  name: string;
  minAmount: number;
  maxAmount: number;
  minTermMonths: number;
  maxTermMonths: number;
  baseInterestRate: number;
  description: string;
}

export interface ApplicationFormData {
  productId: string;
  requestedAmount: string;
  requestedTermMonths: string;
  purpose: string;
  employmentType: string;
  monthlyIncome: string;
  existingDebt: string;
}

export interface EMICalculation {
  emi: number;
  totalPayment: number;
  totalInterest: number;
}

const initialFormData: ApplicationFormData = {
  productId: '',
  requestedAmount: '',
  requestedTermMonths: '',
  purpose: '',
  employmentType: '',
  monthlyIncome: '',
  existingDebt: '',
};

export function useApplicationForm(products: Product[]) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationFormData>(initialFormData);
  const [emiCalculation, setEmiCalculation] = useState<EMICalculation>({
    emi: 0,
    totalPayment: 0,
    totalInterest: 0,
  });

  // Calculate EMI whenever relevant fields change
  useEffect(() => {
    calculateEMI();
  }, [formData.requestedAmount, formData.requestedTermMonths, formData.productId]);

  /**
   * Calculate EMI (Equated Monthly Installment) based on form data
   */
  const calculateEMI = useCallback(() => {
    const amount = parseFloat(formData.requestedAmount) || 0;
    const months = parseInt(formData.requestedTermMonths) || 0;
    const selectedProduct = products.find(p => p.id === parseInt(formData.productId));
    const rate = selectedProduct ? selectedProduct.baseInterestRate / 100 / 12 : 0.12 / 12;

    if (amount > 0 && months > 0) {
      if (rate === 0) {
        const emiValue = amount / months;
        setEmiCalculation({
          emi: emiValue,
          totalPayment: amount,
          totalInterest: 0,
        });
      } else {
        const emiValue = amount * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
        const total = emiValue * months;
        setEmiCalculation({
          emi: emiValue,
          totalPayment: total,
          totalInterest: total - amount,
        });
      }
    } else {
      setEmiCalculation({ emi: 0, totalPayment: 0, totalInterest: 0 });
    }
  }, [formData.requestedAmount, formData.requestedTermMonths, formData.productId, products]);

  /**
   * Update a single form field
   */
  const updateField = useCallback((
    name: keyof ApplicationFormData,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Validate a specific step
   */
  const validateStep = useCallback((step: number): boolean => {
    if (step === 1) {
      return (
        formData.productId !== '' &&
        formData.requestedAmount !== '' &&
        formData.requestedTermMonths !== ''
      );
    }
    if (step === 2) {
      return (
        formData.purpose !== '' &&
        formData.employmentType !== '' &&
        formData.monthlyIncome !== ''
      );
    }
    return true;
  }, [formData]);

  /**
   * Navigate to next step if current step is valid
   */
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, validateStep]);

  /**
   * Navigate to previous step
   */
  const previousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  }, []);

  /**
   * Get the selected product
   */
  const selectedProduct = products.find(p => p.id === parseInt(formData.productId));

  return {
    currentStep,
    formData,
    emiCalculation,
    selectedProduct,
    updateField,
    validateStep,
    nextStep,
    previousStep,
    setCurrentStep,
  };
}
