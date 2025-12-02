'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { premiumTheme } from '@/lib/premium-theme';
import { apiClient } from '@/lib/api';
import { UserDashboardLayout } from '@/layouts/UserDashboardLayout';

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [application, setApplication] = useState<any>(null);
  const [loading, setAppLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'timeline'>('overview');

  // Get the application ID from route params
  const applicationId = params?.application_id as string;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (applicationId) {
      loadApplication();
    }
  }, [applicationId]);

  const loadApplication = async () => {
    try {
      const data = await apiClient.get(`/applications/${applicationId}`);
      setApplication(data);
    } catch (error) {
      console.error('Failed to load application:', error);
    } finally {
      setAppLoading(false);
    }
  };

  const timeline = [
    { date: '2025-01-15', event: 'Application Submitted', status: 'complete', icon: '📝' },
    { date: '2025-01-16', event: 'Under Review', status: 'complete', icon: '🔍' },
    { date: '2025-01-17', event: 'Documents Verified', status: 'complete', icon: '✅' },
    { date: '2025-01-18', event: 'Risk Assessment', status: 'active', icon: '📊' },
    { date: 'Pending', event: 'Offer Generation', status: 'pending', icon: '💰' },
    { date: 'Pending', event: 'Contract Signing', status: 'pending', icon: '📄' },
    { date: 'Pending', event: 'Disbursement', status: 'pending', icon: '💳' },
  ];

  // Get amount and term from various possible field names
  const getAmount = () => {
    if (!application) return 0;
    return application.requestedAmount || application.amount || 0;
  };

  const getTerm = () => {
    if (!application) return 0;
    return application.requestedTermMonths || application.requestedTerm || application.termMonths || application.term || 0;
  };

  const getMonthlyIncome = () => {
    if (!application) return 0;
    return application.monthlyIncome || application.applicant?.monthlyIncome || 0;
  };

  if (loading) {
    return (
      <UserDashboardLayout>
        <div style={{
          padding: '40px',
          textAlign: 'center',
          fontFamily: premiumTheme.typography.fontFamily
        }}>
          Loading application...
        </div>
      </UserDashboardLayout>
    );
  }

  if (!application) {
    return (
      <UserDashboardLayout>
        <div style={{
          padding: '40px',
          textAlign: 'center',
          fontFamily: premiumTheme.typography.fontFamily
        }}>
          Application not found.
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
    <div style={{
      minHeight: '100vh',
      backgroundColor: premiumTheme.colors.surfaceAlt,
      fontFamily: premiumTheme.typography.fontFamily,
      padding: premiumTheme.spacing['3xl'],
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <button
          onClick={() => router.push(`/user/${user?.id}/applications`)}
          style={{
            marginBottom: premiumTheme.spacing.xl,
            padding: '10px 20px',
            backgroundColor: premiumTheme.colors.surface.primary,
            border: `1px solid ${premiumTheme.colors.border}`,
            borderRadius: premiumTheme.radius.lg,
            cursor: 'pointer',
            fontSize: premiumTheme.typography.scale.small.size,
            color: premiumTheme.colors.textSecondary,
          }}
        >
          ← Back to Applications
        </button>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: premiumTheme.spacing.xl,
        }}>
          <div>
            <h1 style={{
              fontSize: premiumTheme.typography.scale.h1.size,
              fontWeight: premiumTheme.typography.weight.bold,
              color: premiumTheme.colors.navy,
              marginBottom: premiumTheme.spacing.sm,
            }}>
              Application #{application.id}
            </h1>
            <p style={{
              fontSize: premiumTheme.typography.scale.body.size,
              color: premiumTheme.colors.textSecondary,
            }}>
              Submitted on {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>

          <span style={{
            padding: '10px 20px',
            backgroundColor: premiumTheme.colors.navySoft,
            color: premiumTheme.colors.navy,
            borderRadius: premiumTheme.radius.pill,
            fontSize: premiumTheme.typography.scale.small.size,
            fontWeight: premiumTheme.typography.weight.semibold,
          }}>
            {application.status}
          </span>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: premiumTheme.spacing.sm,
          marginBottom: premiumTheme.spacing.xl,
          borderBottom: `2px solid ${premiumTheme.colors.border}`,
        }}>
          {[
            { key: 'overview', label: 'Overview', icon: '📋' },
            { key: 'timeline', label: 'Timeline', icon: '🕐' },
            { key: 'documents', label: 'Documents', icon: '📎' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: '12px 24px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: `3px solid ${activeTab === tab.key ? premiumTheme.colors.navy : 'transparent'}`,
                color: activeTab === tab.key ? premiumTheme.colors.navy : premiumTheme.colors.textSecondary,
                cursor: 'pointer',
                fontSize: premiumTheme.typography.scale.body.size,
                fontWeight: premiumTheme.typography.weight.medium,
                transition: `all ${premiumTheme.animation.fast}`,
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: premiumTheme.spacing.xl }}>
            {/* Left: Main Details */}
            <div>
              {/* Loan Details Card */}
              <div style={{
                backgroundColor: premiumTheme.colors.surface.primary,
                borderRadius: premiumTheme.radius.xl,
                padding: premiumTheme.spacing['2xl'],
                boxShadow: premiumTheme.shadows.card,
                marginBottom: premiumTheme.spacing.xl,
              }}>
                <h3 style={{
                  fontSize: premiumTheme.typography.scale.h3.size,
                  fontWeight: premiumTheme.typography.weight.semibold,
                  color: premiumTheme.colors.textPrimary,
                  marginBottom: premiumTheme.spacing.lg,
                }}>
                  Loan Details
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: premiumTheme.spacing.lg,
                }}>
                  {[
                    { label: 'Requested Amount', value: `$${getAmount().toLocaleString()}` },
                    { label: 'Loan Term', value: `${getTerm()} months` },
                    { label: 'Loan Purpose', value: application.purpose || 'Personal' },
                    { label: 'Monthly Income', value: getMonthlyIncome() > 0 ? `$${getMonthlyIncome().toLocaleString()}` : 'N/A' },
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      padding: premiumTheme.spacing.lg,
                      backgroundColor: premiumTheme.colors.surfaceAlt,
                      borderRadius: premiumTheme.radius.md,
                    }}>
                      <div style={{
                        fontSize: premiumTheme.typography.scale.small.size,
                        color: premiumTheme.colors.textSecondary,
                        marginBottom: premiumTheme.spacing.xs,
                      }}>
                        {item.label}
                      </div>
                      <div style={{
                        fontSize: premiumTheme.typography.scale.h4.size,
                        fontWeight: premiumTheme.typography.weight.bold,
                        color: premiumTheme.colors.textPrimary,
                      }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{
                backgroundColor: premiumTheme.colors.surface.primary,
                borderRadius: premiumTheme.radius.xl,
                padding: premiumTheme.spacing['2xl'],
                boxShadow: premiumTheme.shadows.card,
              }}>
                <h3 style={{
                  fontSize: premiumTheme.typography.scale.h3.size,
                  fontWeight: premiumTheme.typography.weight.semibold,
                  color: premiumTheme.colors.textPrimary,
                  marginBottom: premiumTheme.spacing.lg,
                }}>
                  Quick Actions
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: premiumTheme.spacing.md }}>
                  {[
                    { label: 'View Offer', path: `/user/${user?.id}/applications/${applicationId}/offer`, available: true },
                    { label: 'Upload Documents', path: `/user/${user?.id}/applications/${applicationId}/documents`, available: true },
                    { label: 'View Contract', path: `/user/${user?.id}/applications/${applicationId}/contract`, available: false },
                    { label: 'Repayment Schedule', path: `/user/${user?.id}/applications/${applicationId}/repayment`, available: false },
                  ].map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => action.available && router.push(action.path)}
                      disabled={!action.available}
                      style={{
                        padding: '14px 20px',
                        backgroundColor: action.available ? premiumTheme.colors.navySoft : premiumTheme.colors.surfaceAlt,
                        color: action.available ? premiumTheme.colors.navy : premiumTheme.colors.textTertiary,
                        border: 'none',
                        borderRadius: premiumTheme.radius.lg,
                        cursor: action.available ? 'pointer' : 'not-allowed',
                        fontSize: premiumTheme.typography.scale.body.size,
                        fontWeight: premiumTheme.typography.weight.medium,
                        textAlign: 'left',
                        transition: `all ${premiumTheme.animation.fast}`,
                        opacity: action.available ? 1 : 0.5,
                      }}
                    >
                      {action.label} {action.available && '→'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Status & Progress */}
            <div>
              {/* Progress Card */}
              <div style={{
                backgroundColor: premiumTheme.colors.surface.primary,
                borderRadius: premiumTheme.radius.xl,
                padding: premiumTheme.spacing.xl,
                boxShadow: premiumTheme.shadows.card,
                marginBottom: premiumTheme.spacing.xl,
              }}>
                <h3 style={{
                  fontSize: premiumTheme.typography.scale.h4.size,
                  fontWeight: premiumTheme.typography.weight.semibold,
                  color: premiumTheme.colors.textPrimary,
                  marginBottom: premiumTheme.spacing.lg,
                }}>
                  Application Progress
                </h3>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: premiumTheme.spacing.md,
                }}>
                  {[
                    { label: 'Submitted', done: true },
                    { label: 'Under Review', done: true },
                    { label: 'Verification', done: true },
                    { label: 'Risk Assessment', done: false },
                    { label: 'Offer Generated', done: false },
                  ].map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: premiumTheme.spacing.md }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: step.done ? premiumTheme.colors.success : premiumTheme.colors.border,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                      }}>
                        {step.done && '✓'}
                      </div>
                      <span style={{
                        fontSize: premiumTheme.typography.scale.small.size,
                        color: step.done ? premiumTheme.colors.textPrimary : premiumTheme.colors.textTertiary,
                      }}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Card */}
              <div style={{
                backgroundColor: premiumTheme.colors.surface.primary,
                borderRadius: premiumTheme.radius.xl,
                padding: premiumTheme.spacing.xl,
                boxShadow: premiumTheme.shadows.card,
              }}>
                <h3 style={{
                  fontSize: premiumTheme.typography.scale.h4.size,
                  fontWeight: premiumTheme.typography.weight.semibold,
                  color: premiumTheme.colors.textPrimary,
                  marginBottom: premiumTheme.spacing.lg,
                }}>
                  Important Information
                </h3>

                <div style={{
                  padding: premiumTheme.spacing.md,
                  backgroundColor: premiumTheme.colors.infoSoft,
                  borderRadius: premiumTheme.radius.md,
                  fontSize: premiumTheme.typography.scale.small.size,
                  color: premiumTheme.colors.info,
                  lineHeight: premiumTheme.typography.lineHeight.relaxed,
                }}>
                  ℹ️ Your application is currently being processed. You will be notified once there are updates.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div style={{
            backgroundColor: premiumTheme.colors.surface.primary,
            borderRadius: premiumTheme.radius.xl,
            padding: premiumTheme.spacing['2xl'],
            boxShadow: premiumTheme.shadows.card,
          }}>
            <h3 style={{
              fontSize: premiumTheme.typography.scale.h3.size,
              fontWeight: premiumTheme.typography.weight.semibold,
              color: premiumTheme.colors.textPrimary,
              marginBottom: premiumTheme.spacing['2xl'],
            }}>
              Application Timeline
            </h3>

            <div style={{ position: 'relative', paddingLeft: '40px' }}>
              {/* Vertical line */}
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '0',
                bottom: '0',
                width: '2px',
                backgroundColor: premiumTheme.colors.border,
              }} />

              {timeline.map((item, idx) => (
                <div key={idx} style={{
                  position: 'relative',
                  marginBottom: premiumTheme.spacing.xl,
                  paddingBottom: premiumTheme.spacing.xl,
                }}>
                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-32px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: item.status === 'complete' ? premiumTheme.colors.success : 
                                     item.status === 'active' ? premiumTheme.colors.accent : premiumTheme.colors.surface.primary,
                    border: `3px solid ${item.status === 'pending' ? premiumTheme.colors.border : 'transparent'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                  }}>
                    {item.icon}
                  </div>

                  {/* Content */}
                  <div style={{
                    backgroundColor: premiumTheme.colors.surfaceAlt,
                    padding: premiumTheme.spacing.lg,
                    borderRadius: premiumTheme.radius.lg,
                  }}>
                    <div style={{
                      fontSize: premiumTheme.typography.scale.body.size,
                      fontWeight: premiumTheme.typography.weight.semibold,
                      color: premiumTheme.colors.textPrimary,
                      marginBottom: premiumTheme.spacing.xs,
                    }}>
                      {item.event}
                    </div>
                    <div style={{
                      fontSize: premiumTheme.typography.scale.small.size,
                      color: premiumTheme.colors.textSecondary,
                    }}>
                      {item.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div style={{
            backgroundColor: premiumTheme.colors.surface.primary,
            borderRadius: premiumTheme.radius.xl,
            padding: premiumTheme.spacing['2xl'],
            boxShadow: premiumTheme.shadows.card,
          }}>
            <h3 style={{
              fontSize: premiumTheme.typography.scale.h3.size,
              fontWeight: premiumTheme.typography.weight.semibold,
              color: premiumTheme.colors.textPrimary,
              marginBottom: premiumTheme.spacing.lg,
            }}>
              Documents
            </h3>

            <button
              onClick={() => router.push(`/user/${user?.id}/applications/${applicationId}/documents`)}
              style={{
                padding: '14px 28px',
                backgroundColor: premiumTheme.colors.navy,
                color: 'white',
                border: 'none',
                borderRadius: premiumTheme.radius.lg,
                cursor: 'pointer',
                fontSize: premiumTheme.typography.scale.body.size,
                fontWeight: premiumTheme.typography.weight.semibold,
              }}
            >
              Manage Documents
            </button>
          </div>
        )}
      </div>
    </div>
    </UserDashboardLayout>
  );
}

