/**
 * EMICalculator Component
 * Displays monthly payment estimates and loan breakdown
 */

import React from 'react';
import { Calculator, Info } from 'lucide-react';
import { olavsDesign } from '@/lib/olavs-design-system';
import { OlavsCard } from '@/components/OlavsCard';
import { EMICalculation } from '@/hooks/useApplicationForm';

interface EMICalculatorProps {
  calculation: EMICalculation;
}

export const EMICalculator: React.FC<EMICalculatorProps> = ({ calculation }) => {
  const { emi, totalPayment, totalInterest } = calculation;

  if (emi === 0) {
    return null;
  }

  return (
    <OlavsCard
      elevation="level2"
      style={{
        position: 'sticky',
        top: olavsDesign.spacing[24],
        height: 'fit-content',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: olavsDesign.spacing[12],
          marginBottom: olavsDesign.spacing[20],
        }}
      >
        <Calculator size={24} color={olavsDesign.colors.primary[600]} />
        <h3
          style={{
            fontSize: olavsDesign.typography.scale.headingS.size,
            fontWeight: 600,
            color: olavsDesign.colors.neutral[900],
          }}
        >
          Payment Estimate
        </h3>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: olavsDesign.spacing[16],
        }}
      >
        {/* Monthly Payment Highlight */}
        <div
          style={{
            padding: olavsDesign.spacing[16],
            backgroundColor: olavsDesign.colors.primary[100],
            borderRadius: olavsDesign.radius.md,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: olavsDesign.typography.scale.bodyS.size,
              color: olavsDesign.colors.primary[700],
              marginBottom: olavsDesign.spacing[4],
            }}
          >
            Monthly Payment
          </p>
          <p
            style={{
              fontSize: olavsDesign.typography.scale.displayL.size,
              fontWeight: 700,
              color: olavsDesign.colors.primary[700],
            }}
          >
            ${emi.toFixed(2)}
          </p>
        </div>

        {/* Total Payment */}
        <CalculationRow label="Total Payment" value={totalPayment} />

        {/* Total Interest */}
        <CalculationRow label="Total Interest" value={totalInterest} />

        {/* Info Note */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: olavsDesign.spacing[8],
            padding: olavsDesign.spacing[12],
            backgroundColor: olavsDesign.colors.surface.alt,
            borderRadius: olavsDesign.radius.md,
          }}
        >
          <Info
            size={16}
            color={olavsDesign.colors.neutral[700]}
            style={{ flexShrink: 0, marginTop: '2px' }}
          />
          <p
            style={{
              fontSize: olavsDesign.typography.scale.caption.size,
              color: olavsDesign.colors.neutral[600],
              lineHeight: '1.5',
            }}
          >
            This is an estimate based on the selected loan product. Final terms
            will be provided after application review.
          </p>
        </div>
      </div>
    </OlavsCard>
  );
};

/**
 * Helper component for calculation rows
 */
interface CalculationRowProps {
  label: string;
  value: number;
}

const CalculationRow: React.FC<CalculationRowProps> = ({ label, value }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: olavsDesign.spacing[12],
      borderBottom: `1px solid ${olavsDesign.colors.neutral[200]}`,
    }}
  >
    <span
      style={{
        fontSize: olavsDesign.typography.scale.bodyS.size,
        color: olavsDesign.colors.neutral[600],
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: olavsDesign.typography.scale.bodyM.size,
        fontWeight: 600,
        color: olavsDesign.colors.neutral[900],
      }}
    >
      ${value.toFixed(2)}
    </span>
  </div>
);
