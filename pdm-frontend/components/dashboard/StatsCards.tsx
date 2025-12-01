/**
 * StatsCards Component
 * Display key statistics in card format
 */

import React from 'react';
import { FileText, DollarSign, Clock, TrendingUp, LucideIcon } from 'lucide-react';
import { olavsDesign } from '@/lib/olavs-design-system';
import { OlavsCard } from '@/components/OlavsCard';
import { OlavsGrid } from '@/components/OlavsGrid';

export interface DashboardStats {
  totalApplications: number;
  activeLoans: number;
  pendingApplications: number;
  totalDisbursed: number;
}

interface StatsCardsProps {
  stats: DashboardStats;
}

interface StatCardData {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const statsData: StatCardData[] = [
    {
      label: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      iconBgColor: olavsDesign.colors.primary[100],
      iconColor: olavsDesign.colors.primary[500],
    },
    {
      label: 'Active Loans',
      value: stats.activeLoans,
      icon: TrendingUp,
      iconBgColor: olavsDesign.colors.status.success + '20',
      iconColor: olavsDesign.colors.status.success,
    },
    {
      label: 'Pending Review',
      value: stats.pendingApplications,
      icon: Clock,
      iconBgColor: olavsDesign.colors.status.warning + '20',
      iconColor: olavsDesign.colors.status.warning,
    },
    {
      label: 'Total Disbursed',
      value: `$${stats.totalDisbursed.toLocaleString()}`,
      icon: DollarSign,
      iconBgColor: olavsDesign.colors.primary[100],
      iconColor: olavsDesign.colors.primary[500],
    },
  ];

  return (
    <OlavsGrid cols={{ xs: 1, sm: 2, lg: 4 }} gap={20}>
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </OlavsGrid>
  );
};

/**
 * Individual stat card component
 */
interface StatCardProps extends StatCardData {}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
}) => {
  return (
    <OlavsCard elevation="level1">
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p
            style={{
              fontSize: olavsDesign.typography.scale.bodyS.size,
              color: olavsDesign.colors.neutral[600],
              margin: 0,
              marginBottom: olavsDesign.spacing[8],
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontSize: olavsDesign.typography.scale.displayL.size,
              fontWeight: olavsDesign.typography.scale.displayL.weight,
              color: olavsDesign.colors.neutral[900],
              margin: 0,
            }}
          >
            {value}
          </p>
        </div>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: iconBgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={24} color={iconColor} />
        </div>
      </div>
    </OlavsCard>
  );
};
