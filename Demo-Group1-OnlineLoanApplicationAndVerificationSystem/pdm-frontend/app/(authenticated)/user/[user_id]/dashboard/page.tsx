'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { UserDashboardLayout } from '@/layouts/UserDashboardLayout';
import { Plus, FileText, TrendingUp, Clock, DollarSign } from 'lucide-react';

interface Application {
  id: number;
  amount?: number;
  requestedAmount?: number;
  purpose: string;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  totalApplications: number;
  activeLoans: number;
  pendingApplications: number;
  totalDisbursed: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    activeLoans: 0,
    pendingApplications: 0,
    totalDisbursed: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const appsData = await apiClient.get<Application[]>('/applications');
      setApplications(appsData);

      // Calculate stats
      const calculatedStats: DashboardStats = {
        totalApplications: appsData.length,
        activeLoans: appsData.filter(a => a.status === 'ACTIVE' || a.status === 'DISBURSED').length,
        pendingApplications: appsData.filter(a =>
          ['SUBMITTED', 'UNDER_REVIEW', 'VERIFICATION_IN_PROGRESS'].includes(a.status)
        ).length,
        totalDisbursed: appsData
          .filter(a => ['DISBURSED', 'ACTIVE', 'COMPLETED'].includes(a.status))
          .reduce((sum, a) => sum + (a.requestedAmount || a.amount || 0), 0),
      };
      setStats(calculatedStats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const statsData = [
    {
      label: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      iconBg: '#eff6ff',
      iconColor: '#3b82f6',
    },
    {
      label: 'Active Loans',
      value: stats.activeLoans,
      icon: TrendingUp,
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
    },
    {
      label: 'Pending Review',
      value: stats.pendingApplications,
      icon: Clock,
      iconBg: '#fef3c7',
      iconColor: '#d97706',
    },
    {
      label: 'Total Disbursed',
      value: `$${stats.totalDisbursed.toLocaleString()}`,
      icon: DollarSign,
      iconBg: '#ede9fe',
      iconColor: '#7c3aed',
    },
  ];

  return (
    <UserDashboardLayout>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Page Header - Single source of user greeting */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#111827',
                margin: 0,
                marginBottom: '4px',
              }}
            >
              Welcome back, {user?.fullName || 'User'}
            </h1>
            <p
              style={{
                fontSize: '15px',
                color: '#6b7280',
                margin: 0,
              }}
            >
              Here&apos;s an overview of your loan applications
            </p>
          </div>
          <button
            onClick={() => router.push(`/user/${user?.id}/applications/new`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }}
          >
            <Plus size={18} />
            New Application
          </button>
        </div>

        {/* Stats Grid - Compact 2x2 on mobile, 4-column on desktop */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '32px',
          }}
          className="stats-grid"
        >
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: stat.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} color={stat.iconColor} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      margin: 0,
                      marginBottom: '4px',
                    }}
                  >
                    {stat.label}
                  </p>
                  <p
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#111827',
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Applications */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                margin: 0,
              }}
            >
              Recent Applications
            </h2>
            <button
              onClick={() => router.push(`/user/${user?.id}/applications`)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#3b82f6',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              View All
            </button>
          </div>

          {applications.length === 0 ? (
            <div
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: '#6b7280',
              }}
            >
              <FileText size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
              <p style={{ margin: 0, marginBottom: '8px', fontWeight: '500' }}>
                No applications yet
              </p>
              <p style={{ margin: 0, fontSize: '14px' }}>
                Start by creating your first loan application
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th
                      style={{
                        padding: '12px 20px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Purpose
                    </th>
                    <th
                      style={{
                        padding: '12px 20px',
                        textAlign: 'right',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Amount
                    </th>
                    <th
                      style={{
                        padding: '12px 20px',
                        textAlign: 'center',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: '12px 20px',
                        textAlign: 'right',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 5).map((app) => (
                    <tr
                      key={app.id}
                      style={{
                        borderTop: '1px solid #e5e7eb',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                      onClick={() => router.push(`/user/${user?.id}/applications/${app.id}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td
                        style={{
                          padding: '16px 20px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#111827',
                        }}
                      >
                        {app.purpose}
                      </td>
                      <td
                        style={{
                          padding: '16px 20px',
                          textAlign: 'right',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#111827',
                        }}
                      >
                        ${(app.requestedAmount || app.amount || 0).toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: '16px 20px',
                          textAlign: 'center',
                        }}
                      >
                        <StatusBadge status={app.status} />
                      </td>
                      <td
                        style={{
                          padding: '16px 20px',
                          textAlign: 'right',
                          fontSize: '14px',
                          color: '#6b7280',
                        }}
                      >
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </UserDashboardLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    SUBMITTED: { bg: '#fef3c7', text: '#92400e', label: 'Submitted' },
    UNDER_REVIEW: { bg: '#dbeafe', text: '#1e40af', label: 'Under Review' },
    VERIFICATION_IN_PROGRESS: { bg: '#e0e7ff', text: '#3730a3', label: 'Verifying' },
    APPROVED: { bg: '#dcfce7', text: '#166534', label: 'Approved' },
    REJECTED: { bg: '#fee2e2', text: '#991b1b', label: 'Rejected' },
    DISBURSED: { bg: '#d1fae5', text: '#065f46', label: 'Disbursed' },
    ACTIVE: { bg: '#dcfce7', text: '#166534', label: 'Active' },
    COMPLETED: { bg: '#f3f4f6', text: '#374151', label: 'Completed' },
  };

  const config = statusConfig[status] || { bg: '#f3f4f6', text: '#374151', label: status };

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '9999px',
        backgroundColor: config.bg,
        color: config.text,
        fontSize: '12px',
        fontWeight: '600',
      }}
    >
      {config.label}
    </span>
  );
}
