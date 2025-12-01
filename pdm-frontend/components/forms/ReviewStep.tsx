/**
 * ReviewStep Component
 * Final step of the loan application - review and submit
 */

import React from 'react';
import { olavsDesign } from '@/lib/olavs-design-system';
import { OlavsCard } from '@/components/OlavsCard';
import { ApplicationFormData, Product } from '@/hooks/useApplicationForm';

interface ReviewStepProps {
  formData: ApplicationFormData;
  selectedProduct: Product | undefined;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  selectedProduct,
}) => {
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
        Step 3: Review & Submit
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: olavsDesign.spacing[24],
        }}
      >
        {/* Loan Details Summary */}
        <div>
          <h3
            style={{
              fontSize: olavsDesign.typography.scale.headingS.size,
              fontWeight: 600,
              color: olavsDesign.colors.neutral[900],
              marginBottom: olavsDesign.spacing[16],
            }}
          >
            Loan Details
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: olavsDesign.spacing[16],
              padding: olavsDesign.spacing[16],
              backgroundColor: olavsDesign.colors.surface.alt,
              borderRadius: olavsDesign.radius.md,
            }}
          >
            <SummaryField
              label="Product"
              value={selectedProduct?.name || 'N/A'}
            />
            <SummaryField
              label="Amount"
              value={`$${parseFloat(formData.requestedAmount).toLocaleString()}`}
            />
            <SummaryField
              label="Term"
              value={`${formData.requestedTermMonths} months`}
            />
            <SummaryField
              label="Interest Rate"
              value={`${selectedProduct?.baseInterestRate || 0}% APR`}
            />
          </div>
        </div>

        {/* Personal Info Summary */}
        <div>
          <h3
            style={{
              fontSize: olavsDesign.typography.scale.headingS.size,
              fontWeight: 600,
              color: olavsDesign.colors.neutral[900],
              marginBottom: olavsDesign.spacing[16],
            }}
          >
            Personal Information
          </h3>
          <div
            style={{
              padding: olavsDesign.spacing[16],
              backgroundColor: olavsDesign.colors.surface.alt,
              borderRadius: olavsDesign.radius.md,
            }}
          >
            <div style={{ marginBottom: olavsDesign.spacing[12] }}>
              <p
                style={{
                  fontSize: olavsDesign.typography.scale.bodyS.size,
                  color: olavsDesign.colors.neutral[600],
                  marginBottom: olavsDesign.spacing[4],
                }}
              >
                Purpose
              </p>
              <p
                style={{
                  fontSize: olavsDesign.typography.scale.bodyM.size,
                  color: olavsDesign.colors.neutral[900],
                }}
              >
                {formData.purpose}
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: olavsDesign.spacing[16],
              }}
            >
              <SummaryField
                label="Employment"
                value={formData.employmentType.replace(/_/g, ' ')}
              />
              <SummaryField
                label="Monthly Income"
                value={`$${parseFloat(formData.monthlyIncome).toLocaleString()}`}
              />
            </div>
          </div>
        </div>
      </div>
    </OlavsCard>
  );
};

/**
 * Helper component for displaying summary fields
 */
interface SummaryFieldProps {
  label: string;
  value: string;
}

const SummaryField: React.FC<SummaryFieldProps> = ({ label, value }) => (
  <div>
    <p
      style={{
        fontSize: olavsDesign.typography.scale.bodyS.size,
        color: olavsDesign.colors.neutral[600],
        marginBottom: olavsDesign.spacing[4],
      }}
    >
      {label}
    </p>
    <p
      style={{
        fontSize: olavsDesign.typography.scale.bodyM.size,
        fontWeight: 600,
        color: olavsDesign.colors.neutral[900],
      }}
    >
      {value}
    </p>
  </div>
);
