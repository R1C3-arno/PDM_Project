/**
 * DashboardHeader Component
 * Welcome header with user info and primary action
 */

import React from 'react';
import { Plus } from 'lucide-react';
import { olavsDesign } from '@/lib/olavs-design-system';
import { OlavsButton } from '@/components/OlavsButton';

interface DashboardHeaderProps {
  userName?: string;
  onNewApplication: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'User',
  onNewApplication,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: olavsDesign.spacing[32],
        flexWrap: 'wrap',
        gap: olavsDesign.spacing[16],
      }}
    >
      <div>
        <h1
          style={{
            fontSize: olavsDesign.typography.scale.displayL.size,
            fontWeight: olavsDesign.typography.scale.displayL.weight,
            color: olavsDesign.colors.neutral[900],
            margin: 0,
            marginBottom: olavsDesign.spacing[8],
          }}
        >
          Welcome back, {userName}
        </h1>
        <p
          style={{
            fontSize: olavsDesign.typography.scale.bodyM.size,
            color: olavsDesign.colors.neutral[600],
            margin: 0,
          }}
        >
          Here&apos;s an overview of your loan applications
        </p>
      </div>
      <OlavsButton
        variant="primary"
        size="lg"
        icon={<Plus size={20} />}
        onClick={onNewApplication}
      >
        New Application
      </OlavsButton>
    </div>
  );
};
