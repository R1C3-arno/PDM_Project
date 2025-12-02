/**
 * RecentApplications Component
 * Display list of recent loan applications
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  XCircle,
  DollarSign,
  Calendar,
  ArrowRight,
  Plus,
  LucideIcon,
} from 'lucide-react';
import { olavsDesign } from '@/lib/olavs-design-system';
import { OlavsCard } from '@/components/OlavsCard';
import { OlavsStatusBadge } from '@/components/OlavsStatusBadge';
import { OlavsButton } from '@/components/OlavsButton';

export interface Application {
  id: number;
  amount: number;
  status: string;
  submittedAt: string;
  purpose?: string;
}

interface RecentApplicationsProps {
  applications: Application[];
  maxDisplayed?: number;
  userId?: number; // User ID for routing
}

interface StatusInfo {
  label: string;
  icon: LucideIcon;
  color: string;
}

export const RecentApplications: React.FC<RecentApplicationsProps> = ({
  applications,
  maxDisplayed = 5,
  userId,
}) => {
  const router = useRouter();

  // Helper to build user-scoped routes
  const getUserPath = (path: string) => userId ? `/user/${userId}${path}` : path;

  const getStatusInfo = (status: string): StatusInfo => {
    const statusMap: Record<string, StatusInfo> = {
      DRAFT: {
        label: 'Draft',
        icon: FileText,
        color: olavsDesign.colors.neutral[700],
      },
      SUBMITTED: {
        label: 'Submitted',
        icon: CheckCircle,
        color: olavsDesign.colors.status.info,
      },
      UNDER_REVIEW: {
        label: 'Under Review',
        icon: Clock,
        color: olavsDesign.colors.status.warning,
      },
      VERIFICATION_IN_PROGRESS: {
        label: 'Verification',
        icon: Clock,
        color: olavsDesign.colors.status.warning,
      },
      VERIFIED: {
        label: 'Verified',
        icon: CheckCircle,
        color: olavsDesign.colors.status.success,
      },
      RISK_ASSESSED: {
        label: 'Risk Assessed',
        icon: TrendingUp,
        color: olavsDesign.colors.status.info,
      },
      OFFER_GENERATED: {
        label: 'Offer Ready',
        icon: DollarSign,
        color: olavsDesign.colors.primary[500],
      },
      OFFER_ACCEPTED: {
        label: 'Offer Accepted',
        icon: CheckCircle,
        color: olavsDesign.colors.status.success,
      },
      CONTRACT_SIGNED: {
        label: 'Contract Signed',
        icon: FileText,
        color: olavsDesign.colors.status.success,
      },
      DISBURSED: {
        label: 'Disbursed',
        icon: DollarSign,
        color: olavsDesign.colors.status.success,
      },
      ACTIVE: {
        label: 'Active',
        icon: TrendingUp,
        color: olavsDesign.colors.status.success,
      },
      COMPLETED: {
        label: 'Completed',
        icon: CheckCircle,
        color: olavsDesign.colors.neutral[600],
      },
      REJECTED: {
        label: 'Rejected',
        icon: XCircle,
        color: olavsDesign.colors.status.error,
      },
      CANCELLED: {
        label: 'Cancelled',
        icon: XCircle,
        color: olavsDesign.colors.neutral[700],
      },
    };
    return (
      statusMap[status] || {
        label: status,
        icon: FileText,
        color: olavsDesign.colors.neutral[700],
      }
    );
  };

  if (applications.length === 0) {
    return (
      <OlavsCard
        title="Recent Applications"
        subtitle="View and manage your loan applications"
        elevation="level1"
      >
        <EmptyState onCreateNew={() => router.push(getUserPath('/applications/new'))} />
      </OlavsCard>
    );
  }

  return (
    <OlavsCard
      title="Recent Applications"
      subtitle="View and manage your loan applications"
      action={
        <OlavsButton
          variant="tertiary"
          size="sm"
          onClick={() => router.push(getUserPath('/applications'))}
        >
          View All{' '}
          <ArrowRight
            size={16}
            style={{ marginLeft: olavsDesign.spacing[4] }}
          />
        </OlavsButton>
      }
      elevation="level1"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: olavsDesign.spacing[12],
        }}
      >
        {applications.slice(0, maxDisplayed).map((app) => (
          <ApplicationRow
            key={app.id}
            application={app}
            statusInfo={getStatusInfo(app.status)}
            onClick={() => router.push(`/applications/${app.id}`)}
          />
        ))}
      </div>
    </OlavsCard>
  );
};

/**
 * Individual application row component
 */
interface ApplicationRowProps {
  application: Application;
  statusInfo: StatusInfo;
  onClick: () => void;
}

const ApplicationRow: React.FC<ApplicationRowProps> = ({
  application,
  statusInfo,
  onClick,
}) => {
  const StatusIcon = statusInfo.icon;

  return (
    <div
      onClick={onClick}
      style={{
        padding: olavsDesign.spacing[20],
        border: `1px solid ${olavsDesign.colors.neutral[200]}`,
        borderRadius: olavsDesign.radius.md,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        backgroundColor: olavsDesign.colors.surface.default,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = olavsDesign.colors.primary[300];
        e.currentTarget.style.boxShadow = olavsDesign.elevation.level2;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = olavsDesign.colors.neutral[200];
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: olavsDesign.spacing[16],
        }}
      >
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: olavsDesign.spacing[12],
              marginBottom: olavsDesign.spacing[8],
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: statusInfo.color + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: statusInfo.color,
              }}
            >
              <StatusIcon size={20} />
            </div>
            <div>
              <p
                style={{
                  fontSize: olavsDesign.typography.scale.headingS.size,
                  fontWeight: '600',
                  color: olavsDesign.colors.neutral[900],
                  margin: 0,
                }}
              >
                ${application.amount.toLocaleString()}
              </p>
              <p
                style={{
                  fontSize: olavsDesign.typography.scale.bodyS.size,
                  color: olavsDesign.colors.neutral[600],
                  margin: 0,
                }}
              >
                {application.purpose || 'Personal Loan'}
              </p>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: olavsDesign.spacing[4],
              fontSize: olavsDesign.typography.scale.caption.size,
              color: olavsDesign.colors.neutral[700],
            }}
          >
            <Calendar size={14} />
            Submitted {new Date(application.submittedAt).toLocaleDateString()}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: olavsDesign.spacing[16],
          }}
        >
          <OlavsStatusBadge status={application.status.toLowerCase()}>
            {statusInfo.label}
          </OlavsStatusBadge>
          <ArrowRight size={20} color={olavsDesign.colors.neutral[600]} />
        </div>
      </div>
    </div>
  );
};

/**
 * Empty state when no applications exist
 */
interface EmptyStateProps {
  onCreateNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNew }) => (
  <div
    style={{
      textAlign: 'center',
      padding: olavsDesign.spacing[48],
    }}
  >
    <div
      style={{
        width: '64px',
        height: '64px',
        margin: '0 auto',
        marginBottom: olavsDesign.spacing[24],
        borderRadius: '50%',
        backgroundColor: olavsDesign.colors.neutral[100],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FileText size={32} color={olavsDesign.colors.neutral[600]} />
    </div>
    <h3
      style={{
        fontSize: olavsDesign.typography.scale.headingM.size,
        fontWeight: olavsDesign.typography.scale.headingM.weight,
        color: olavsDesign.colors.neutral[900],
        marginBottom: olavsDesign.spacing[8],
      }}
    >
      No applications yet
    </h3>
    <p
      style={{
        fontSize: olavsDesign.typography.scale.bodyM.size,
        color: olavsDesign.colors.neutral[600],
        marginBottom: olavsDesign.spacing[24],
      }}
    >
      Start your loan journey by creating your first application
    </p>
    <OlavsButton
      variant="primary"
      icon={<Plus size={20} />}
      onClick={onCreateNew}
    >
      Create Application
    </OlavsButton>
  </div>
);
