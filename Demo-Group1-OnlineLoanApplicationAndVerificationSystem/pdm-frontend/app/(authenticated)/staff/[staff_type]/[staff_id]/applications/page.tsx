'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { premiumTheme } from '@/lib/premium-theme';
import { apiClient } from '@/lib/api';
import { StaffDashboardLayout } from '@/layouts/StaffDashboardLayout';

export default function StaffDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // Role check is now handled by StaffDashboardLayout

  useEffect(() => {
    if (isAuthenticated && user) {
      loadApplications();
    }
  }, [isAuthenticated, user]);

  const loadApplications = async () => {
    try {
      const data = await apiClient.get('/applications');
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  const kanbanColumns = [
    { title: 'New', status: 'SUBMITTED', color: premiumTheme.colors.info },
    { title: 'Under Review', status: 'UNDER_REVIEW', color: premiumTheme.colors.accent },
    { title: 'Verification', status: 'UNDER_VERIFICATION', color: premiumTheme.colors.warning },
    { title: 'Risk Assessed', status: 'RISK_ASSESSED', color: premiumTheme.colors.success },
    { title: 'Offer Sent', status: 'OFFER_GENERATED', color: premiumTheme.colors.navy },
    { title: 'In Repayment', status: 'IN_REPAYMENT', color: premiumTheme.colors.success },
  ];

  const getApplicationsByStatus = (status: string) => {
    return applications.filter(app => app.status === status);
  };

  return (
    <StaffDashboardLayout>
      <div style={{
      minHeight: '100vh',
      backgroundColor: premiumTheme.colors.surfaceAlt,
      fontFamily: premiumTheme.typography.fontFamily,
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: premiumTheme.colors.surface.primary,
        borderBottom: `1px solid ${premiumTheme.colors.border}`,
        padding: premiumTheme.spacing.xl,
      }}>
        <div style={{ maxWidth: premiumTheme.layout.maxWidth, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{
                fontSize: premiumTheme.typography.scale.h1.size,
                fontWeight: premiumTheme.typography.weight.bold,
                color: premiumTheme.colors.navy,
                marginBottom: premiumTheme.spacing.xs,
              }}>
                {user?.role} Dashboard
              </h1>
              <p style={{
                fontSize: premiumTheme.typography.scale.body.size,
                color: premiumTheme.colors.textSecondary,
              }}>
                Loan Pipeline Overview
              </p>
            </div>

            <div style={{ display: 'flex', gap: premiumTheme.spacing.sm }}>
              <button
                onClick={() => setViewMode('kanban')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: viewMode === 'kanban' ? premiumTheme.colors.navy : premiumTheme.colors.surface.primary,
                  color: viewMode === 'kanban' ? 'white' : premiumTheme.colors.textSecondary,
                  border: `1px solid ${premiumTheme.colors.border}`,
                  borderRadius: premiumTheme.radius.lg,
                  cursor: 'pointer',
                  fontSize: premiumTheme.typography.scale.small.size,
                  fontWeight: premiumTheme.typography.weight.medium,
                }}
              >
                📊 Kanban
              </button>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: viewMode === 'table' ? premiumTheme.colors.navy : premiumTheme.colors.surface.primary,
                  color: viewMode === 'table' ? 'white' : premiumTheme.colors.textSecondary,
                  border: `1px solid ${premiumTheme.colors.border}`,
                  borderRadius: premiumTheme.radius.lg,
                  cursor: 'pointer',
                  fontSize: premiumTheme.typography.scale.small.size,
                  fontWeight: premiumTheme.typography.weight.medium,
                }}
              >
                📋 Table
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: premiumTheme.spacing.lg,
            marginTop: premiumTheme.spacing.xl,
          }}>
            {[
              { label: 'Active Applications', value: applications.length, color: premiumTheme.colors.info },
              { label: 'Approved Today', value: '12', color: premiumTheme.colors.success },
              { label: 'Avg. Approval Time', value: '4.2 days', color: premiumTheme.colors.accent },
              { label: 'Portfolio at Risk', value: '2.3%', color: premiumTheme.colors.error },
            ].map((stat, idx) => (
              <div key={idx} style={{
                padding: premiumTheme.spacing.lg,
                backgroundColor: premiumTheme.colors.surface.primary,
                borderRadius: premiumTheme.radius.lg,
                boxShadow: premiumTheme.shadows.sm,
              }}>
                <div style={{
                  fontSize: premiumTheme.typography.scale.tiny.size,
                  color: premiumTheme.colors.textSecondary,
                  marginBottom: premiumTheme.spacing.xs,
                }}>
                  {stat.label}
                </div>
                <div style={{
                  fontSize: premiumTheme.typography.scale.h2.size,
                  fontWeight: premiumTheme.typography.weight.bold,
                  color: stat.color,
                }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: premiumTheme.layout.maxWidth, 
        margin: '0 auto', 
        padding: premiumTheme.spacing['2xl'] 
      }}>
        {viewMode === 'kanban' ? (
          // Kanban View
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: premiumTheme.spacing.lg,
            overflowX: 'auto',
          }}>
            {kanbanColumns.map((column) => {
              const columnApps = getApplicationsByStatus(column.status);
              
              return (
                <div key={column.status} style={{
                  backgroundColor: premiumTheme.colors.surface.primary,
                  borderRadius: premiumTheme.radius.lg,
                  padding: premiumTheme.spacing.lg,
                  minHeight: '600px',
                  boxShadow: premiumTheme.shadows.card,
                }}>
                  {/* Column Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: premiumTheme.spacing.lg,
                    paddingBottom: premiumTheme.spacing.md,
                    borderBottom: `2px solid ${column.color}`,
                  }}>
                    <h3 style={{
                      fontSize: premiumTheme.typography.scale.h4.size,
                      fontWeight: premiumTheme.typography.weight.semibold,
                      color: premiumTheme.colors.textPrimary,
                    }}>
                      {column.title}
                    </h3>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: column.color + '20',
                      color: column.color,
                      borderRadius: premiumTheme.radius.pill,
                      fontSize: premiumTheme.typography.scale.tiny.size,
                      fontWeight: premiumTheme.typography.weight.bold,
                    }}>
                      {columnApps.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: premiumTheme.spacing.md }}>
                    {columnApps.length === 0 ? (
                      <div style={{
                        padding: premiumTheme.spacing.xl,
                        textAlign: 'center',
                        color: premiumTheme.colors.textTertiary,
                        fontSize: premiumTheme.typography.scale.small.size,
                      }}>
                        No applications
                      </div>
                    ) : (
                      columnApps.map((app) => (
                        <div
                          key={app.id}
                          onClick={() => router.push(`/staff/applications/${app.id}`)}
                          style={{
                            padding: premiumTheme.spacing.md,
                            backgroundColor: premiumTheme.colors.surfaceAlt,
                            borderRadius: premiumTheme.radius.md,
                            cursor: 'pointer',
                            transition: `all ${premiumTheme.animation.fast}`,
                            border: `1px solid ${premiumTheme.colors.border}`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = premiumTheme.shadows.md;
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <div style={{
                            fontSize: premiumTheme.typography.scale.small.size,
                            fontWeight: premiumTheme.typography.weight.semibold,
                            color: premiumTheme.colors.textPrimary,
                            marginBottom: premiumTheme.spacing.xs,
                          }}>
                            APP-{String(app.id).padStart(6, '0')}
                          </div>
                          <div style={{
                            fontSize: premiumTheme.typography.scale.h4.size,
                            fontWeight: premiumTheme.typography.weight.bold,
                            color: premiumTheme.colors.navy,
                            marginBottom: premiumTheme.spacing.sm,
                          }}>
                            ${app.requestedAmount?.toLocaleString()}
                          </div>
                          <div style={{
                            fontSize: premiumTheme.typography.scale.tiny.size,
                            color: premiumTheme.colors.textSecondary,
                            marginBottom: premiumTheme.spacing.xs,
                          }}>
                            {app.requestedTerm} months • {app.productName || 'Personal Loan'}
                          </div>
                          <div style={{
                            fontSize: premiumTheme.typography.scale.tiny.size,
                            color: premiumTheme.colors.textTertiary,
                          }}>
                            {new Date(app.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Table View
          <div style={{
            backgroundColor: premiumTheme.colors.surface.primary,
            borderRadius: premiumTheme.radius.xl,
            boxShadow: premiumTheme.shadows.card,
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{
                  backgroundColor: premiumTheme.colors.surfaceAlt,
                  borderBottom: `2px solid ${premiumTheme.colors.border}`,
                }}>
                  {['Application', 'Amount', 'Term', 'Status', 'Date', 'Action'].map((header) => (
                    <th key={header} style={{
                      padding: premiumTheme.spacing.lg,
                      textAlign: 'left',
                      fontSize: premiumTheme.typography.scale.small.size,
                      fontWeight: premiumTheme.typography.weight.semibold,
                      color: premiumTheme.colors.textSecondary,
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    style={{
                      borderBottom: `1px solid ${premiumTheme.colors.border}`,
                      cursor: 'pointer',
                    }}
                    onClick={() => router.push(`/staff/applications/${app.id}`)}
                  >
                    <td style={{ padding: premiumTheme.spacing.lg }}>
                      <div style={{ fontWeight: premiumTheme.typography.weight.medium }}>
                        APP-{String(app.id).padStart(6, '0')}
                      </div>
                    </td>
                    <td style={{ padding: premiumTheme.spacing.lg, fontWeight: premiumTheme.typography.weight.semibold }}>
                      ${app.requestedAmount?.toLocaleString()}
                    </td>
                    <td style={{ padding: premiumTheme.spacing.lg }}>{app.requestedTerm} months</td>
                    <td style={{ padding: premiumTheme.spacing.lg }}>
                      <span style={{
                        padding: '4px 12px',
                        backgroundColor: premiumTheme.colors.navySoft,
                        color: premiumTheme.colors.navy,
                        borderRadius: premiumTheme.radius.pill,
                        fontSize: premiumTheme.typography.scale.tiny.size,
                        fontWeight: premiumTheme.typography.weight.medium,
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: premiumTheme.spacing.lg, color: premiumTheme.colors.textSecondary }}>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: premiumTheme.spacing.lg }}>
                      <span style={{ color: premiumTheme.colors.navy, fontWeight: premiumTheme.typography.weight.medium }}>
                        View →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </StaffDashboardLayout>
  );
}

