/**
 * ApplicationStepper Component
 * Visual progress indicator for multi-step application form
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { olavsDesign } from '@/lib/olavs-design-system';
import { OlavsCard } from '@/components/OlavsCard';

interface Step {
  number: number;
  title: string;
  icon: LucideIcon;
}

interface ApplicationStepperProps {
  steps: Step[];
  currentStep: number;
}

export const ApplicationStepper: React.FC<ApplicationStepperProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <OlavsCard elevation="level1" style={{ marginBottom: olavsDesign.spacing[32] }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Progress Bar Background */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: '60px',
            right: '60px',
            height: '4px',
            backgroundColor: olavsDesign.colors.neutral[200],
            zIndex: 0,
          }}
        />

        {/* Progress Bar Fill */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: '60px',
            width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 60px)`,
            height: '4px',
            backgroundColor: olavsDesign.colors.primary[500],
            zIndex: 0,
            transition: 'width 0.3s ease',
          }}
        />

        {/* Steps */}
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isComplete = currentStep > step.number;

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: isComplete
                    ? olavsDesign.colors.primary[500]
                    : isActive
                    ? olavsDesign.colors.primary[100]
                    : olavsDesign.colors.surface.default,
                  border: `3px solid ${
                    isComplete || isActive
                      ? olavsDesign.colors.primary[500]
                      : olavsDesign.colors.neutral[300]
                  }`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: olavsDesign.spacing[12],
                  transition: 'all 0.3s ease',
                }}
              >
                <Icon
                  size={24}
                  color={
                    isComplete
                      ? 'white'
                      : isActive
                      ? olavsDesign.colors.primary[700]
                      : olavsDesign.colors.neutral[700]
                  }
                />
              </div>
              <span
                style={{
                  fontSize: olavsDesign.typography.scale.bodyS.size,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive
                    ? olavsDesign.colors.neutral[900]
                    : olavsDesign.colors.neutral[600],
                  textAlign: 'center',
                }}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </OlavsCard>
  );
};
