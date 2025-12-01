/**
 * PersonalInfoStep Component
 * Second step of the loan application - collect personal and employment information
 */

import React from 'react';
import { olavsDesign } from '@/lib/olavs-design-system';
import { OlavsCard } from '@/components/OlavsCard';
import { ApplicationFormData } from '@/hooks/useApplicationForm';

interface PersonalInfoStepProps {
  formData: ApplicationFormData;
  onFieldChange: (name: keyof ApplicationFormData, value: string) => void;
}

const EMPLOYMENT_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'SELF_EMPLOYED', label: 'Self Employed' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'UNEMPLOYED', label: 'Unemployed' },
];

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  onFieldChange,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
        Step 2: Personal Information
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: olavsDesign.spacing[20],
        }}
      >
        {/* Purpose */}
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
            Loan Purpose *
          </label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleInputChange}
            placeholder="e.g., Home renovation, business expansion, education..."
            required
            rows={4}
            style={{
              width: '100%',
              padding: olavsDesign.spacing[16],
              border: `1px solid ${olavsDesign.colors.neutral[300]}`,
              borderRadius: olavsDesign.radius.md,
              fontSize: olavsDesign.typography.scale.bodyM.size,
              fontFamily: olavsDesign.typography.font.primary,
              resize: 'vertical',
            }}
          />
        </div>

        {/* Employment Type */}
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
            Employment Type *
          </label>
          <select
            name="employmentType"
            value={formData.employmentType}
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
            <option value="">Select employment type</option>
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Monthly Income */}
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
            Monthly Income ($) *
          </label>
          <input
            type="number"
            name="monthlyIncome"
            value={formData.monthlyIncome}
            onChange={handleInputChange}
            placeholder="5000"
            required
            style={{
              width: '100%',
              height: '48px',
              padding: `0 ${olavsDesign.spacing[16]}`,
              border: `1px solid ${olavsDesign.colors.neutral[300]}`,
              borderRadius: olavsDesign.radius.md,
              fontSize: olavsDesign.typography.scale.bodyM.size,
              fontFamily: olavsDesign.typography.font.primary,
            }}
          />
        </div>

        {/* Existing Debt */}
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
            Existing Monthly Debt Payments ($)
          </label>
          <input
            type="number"
            name="existingDebt"
            value={formData.existingDebt}
            onChange={handleInputChange}
            placeholder="0"
            style={{
              width: '100%',
              height: '48px',
              padding: `0 ${olavsDesign.spacing[16]}`,
              border: `1px solid ${olavsDesign.colors.neutral[300]}`,
              borderRadius: olavsDesign.radius.md,
              fontSize: olavsDesign.typography.scale.bodyM.size,
              fontFamily: olavsDesign.typography.font.primary,
            }}
          />
        </div>
      </div>
    </OlavsCard>
  );
};
