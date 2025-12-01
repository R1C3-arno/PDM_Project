'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { premiumTheme } from '@/lib/premium-theme';
import { apiClient } from '@/lib/api';

export default function StaffApplicationReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [application, setApplication] = useState<any>(null);
  const [loading, setAppLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role === 'APPLICANT')) {
      router.push('/staff/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (params?.id) {
      loadApplication();
    }
  }, [params?.id]);

  const loadApplication = async () => {
    try {
      const data = await apiClient.get(`/applications/${params.id}`);
      setApplication(data);
    } catch (error) {
      console.error('Failed to load application:', error);
    } finally {
      setAppLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await apiClient.put(`/applications/${params.id}/status`, { status: newStatus });
      alert(`Status updated to ${newStatus}`);
      loadApplication();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: premiumTheme.typography.fontFamily }}>Loading...</div>;
  }

  if (!application) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: premiumTheme.typography.fontFamily }}>Application not found.</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: premiumTheme.colors.surfaceAlt,
      fontFamily: premiumTheme.typography.fontFamily,
      padding: premiumTheme.spacing['3xl'],
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={() => router.push('/staff/dashboard')}
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
          ← Back to Dashboard
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: premiumTheme.spacing['2xl'] }}>
          <div>
            <h1 style={{
              fontSize: premiumTheme.typography.scale.h1.size,
              fontWeight: premiumTheme.typography.weight.bold,
              color: premiumTheme.colors.navy,
              marginBottom: premiumTheme.spacing.sm,
            }}>
              Application Review
            </h1>
            <p style={{
              fontSize: premiumTheme.typography.scale.body.size,
              color: premiumTheme.colors.textSecondary,
            }}>
              APP-{String(application.id).padStart(6, '0')} • {new Date(application.createdAt).toLocaleDateString()}
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

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: premiumTheme.spacing.xl }}>
          {/* Left: Application Details */}
          <div>
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
                marginBottom: premiumTheme.spacing.xl,
              }}>
                Loan Details
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: premiumTheme.spacing.lg,
              }}>
                {[
                  { label: 'Requested Amount', value: `$${application.requestedAmount?.toLocaleString()}` },
                  { label: 'Loan Term', value: `${application.requestedTerm} months` },
                  { label: 'Purpose', value: application.purpose || 'Personal' },
                  { label: 'Monthly Income', value: `$${application.monthlyIncome?.toLocaleString()}` },
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
                Actions
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: premiumTheme.spacing.md }}>
                {[
                  { label: 'Verify Documents', path: `/staff/applications/${params.id}/verification` },
                  { label: 'Risk Assessment', path: `/staff/applications/${params.id}/risk` },
                  { label: 'Generate Offer', path: `/staff/applications/${params.id}/offer/new` },
                  { label: 'View Contract', path: `/staff/applications/${params.id}/contract` },
                ].map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => router.push(action.path)}
                    style={{
                      padding: '14px 20px',
                      backgroundColor: premiumTheme.colors.navySoft,
                      color: premiumTheme.colors.navy,
                      border: 'none',
                      borderRadius: premiumTheme.radius.lg,
                      cursor: 'pointer',
                      fontSize: premiumTheme.typography.scale.body.size,
                      fontWeight: premiumTheme.typography.weight.medium,
                      textAlign: 'left',
                    }}
                  >
                    {action.label} →
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Status Control */}
          <div>
            <div style={{
              backgroundColor: premiumTheme.colors.surface.primary,
              borderRadius: premiumTheme.radius.xl,
              padding: premiumTheme.spacing.xl,
              boxShadow: premiumTheme.shadows.card,
              marginBottom: premiumTheme.spacing.lg,
            }}>
              <h3 style={{
                fontSize: premiumTheme.typography.scale.h4.size,
                fontWeight: premiumTheme.typography.weight.semibold,
                color: premiumTheme.colors.textPrimary,
                marginBottom: premiumTheme.spacing.lg,
              }}>
                Update Status
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: premiumTheme.spacing.sm }}>
                {['UNDER_REVIEW', 'UNDER_VERIFICATION', 'RISK_ASSESSED', 'APPROVED', 'REJECTED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    style={{
                      padding: '12px',
                      backgroundColor: application.status === status ? premiumTheme.colors.navy : premiumTheme.colors.surfaceAlt,
                      color: application.status === status ? 'white' : premiumTheme.colors.textPrimary,
                      border: `1px solid ${premiumTheme.colors.border}`,
                      borderRadius: premiumTheme.radius.md,
                      cursor: 'pointer',
                      fontSize: premiumTheme.typography.scale.small.size,
                      fontWeight: premiumTheme.typography.weight.medium,
                      textAlign: 'left',
                    }}
                  >
                    {status.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              backgroundColor: premiumTheme.colors.surface.primary,
              borderRadius: premiumTheme.radius.xl,
              padding: premiumTheme.spacing.xl,
              boxShadow: premiumTheme.shadows.card,
            }}>
              <div style={{
                padding: premiumTheme.spacing.md,
                backgroundColor: premiumTheme.colors.infoSoft,
                borderRadius: premiumTheme.radius.md,
                fontSize: premiumTheme.typography.scale.small.size,
                color: premiumTheme.colors.info,
                lineHeight: premiumTheme.typography.lineHeight.relaxed,
              }}>
                ℹ️ Review all documents and assessments before changing status
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

