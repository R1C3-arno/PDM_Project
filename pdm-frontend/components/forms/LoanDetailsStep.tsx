/**
 * LoanDetailsStep Component
 * First step of the loan application - collect loan product, amount, and term
 */

import React from 'react';
import { DollarSign, Calendar } from 'lucide-react';
import { olavsDesign } from '@/lib/olavs-design-system';
import { OlavsCard } from '@/components/OlavsCard';
import { Product, ApplicationFormData } from '@/hooks/useApplicationForm';

interface LoanDetailsStepProps {
  formData: ApplicationFormData;
  products: Product[];
  selectedProduct: Product | undefined;
  onFieldChange: (name: keyof ApplicationFormData, value: string) => void;
}

export const LoanDetailsStep: React.FC<LoanDetailsStepProps> = ({
  formData,
  products,
  selectedProduct,
  onFieldChange,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onFieldChange(e.target.name as keyof ApplicationFormData, e.target.value);
  };

  return (
    <OlavsCard elevation="level1">
      <h2
        style={{
          fontSize: olavsDesign.typography.scale.headingM.size,
          fontWeight: 600,
          color: olavsDesign.colors.neutral[900],
          marginBottom: olavsDesign.spacing[24],
        }}
      >
        Step 1: Loan Details
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: olavsDesign.spacing[20],
        }}
      >
        {/* Product Selection */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: olavsDesign.typography.scale.bodyM.size,
              fontWeight: 500,
              color: olavsDesign.colors.neutral[700],
              marginBottom: olavsDesign.spacing[8],
            }}
          >
            Loan Product *
          </label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              height: '48px',
              padding: `0 ${olavsDesign.spacing[16]}`,
              border: `1px solid ${olavsDesign.colors.neutral[300]}`,
              borderRadius: olavsDesign.radius.md,
              fontSize: olavsDesign.typography.scale.bodyM.size,
              fontFamily: olavsDesign.typography.font.primary,
              backgroundColor: olavsDesign.colors.surface.default,
            }}
          >
            <option value="">Select a loan product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.baseInterestRate}% APR
              </option>
            ))}
          </select>
          {selectedProduct && (
            <p
              style={{
                marginTop: olavsDesign.spacing[8],
                fontSize: olavsDesign.typography.scale.bodyS.size,
                color: olavsDesign.colors.neutral[600],
              }}
            >
              Amount: ${selectedProduct.minAmount.toLocaleString()} - $
              {selectedProduct.maxAmount.toLocaleString()} | Term:{' '}
              {selectedProduct.minTermMonths}-{selectedProduct.maxTermMonths}{' '}
              months
            </p>
          )}
        </div>

        {/* Requested Amount */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: olavsDesign.typography.scale.bodyM.size,
              fontWeight: 500,
              color: olavsDesign.colors.neutral[700],
              marginBottom: olavsDesign.spacing[8],
            }}
          >
            Loan Amount ($) *
          </label>
          <div style={{ position: 'relative' }}>
            <DollarSign
              size={20}
              color={olavsDesign.colors.neutral[600]}
              style={{
                position: 'absolute',
                left: olavsDesign.spacing[16],
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <input
              type="number"
              name="requestedAmount"
              value={formData.requestedAmount}
              onChange={handleInputChange}
              placeholder="50000"
              min={selectedProduct?.minAmount || 0}
              max={selectedProduct?.maxAmount || 1000000}
              required
              style={{
                width: '100%',
                height: '48px',
                paddingLeft: '48px',
                paddingRight: olavsDesign.spacing[16],
                border: `1px solid ${olavsDesign.colors.neutral[300]}`,
                borderRadius: olavsDesign.radius.md,
                fontSize: olavsDesign.typography.scale.bodyM.size,
                fontFamily: olavsDesign.typography.font.primary,
              }}
            />
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: olavsDesign.typography.scale.bodyM.size,
              fontWeight: 500,
              color: olavsDesign.colors.neutral[700],
              marginBottom: olavsDesign.spacing[8],
            }}
          >
            Loan Term (Months) *
          </label>
          <div style={{ position: 'relative' }}>
            <Calendar
              size={20}
              color={olavsDesign.colors.neutral[600]}
              style={{
                position: 'absolute',
                left: olavsDesign.spacing[16],
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <input
              type="number"
              name="requestedTermMonths"
              value={formData.requestedTermMonths}
              onChange={handleInputChange}
              placeholder="36"
              min={selectedProduct?.minTermMonths || 12}
              max={selectedProduct?.maxTermMonths || 84}
              required
              style={{
                width: '100%',
                height: '48px',
                paddingLeft: '48px',
                paddingRight: olavsDesign.spacing[16],
                border: `1px solid ${olavsDesign.colors.neutral[300]}`,
                borderRadius: olavsDesign.radius.md,
                fontSize: olavsDesign.typography.scale.bodyM.size,
                fontFamily: olavsDesign.typography.font.primary,
              }}
            />
          </div>
        </div>
      </div>
    </OlavsCard>
  );
};
