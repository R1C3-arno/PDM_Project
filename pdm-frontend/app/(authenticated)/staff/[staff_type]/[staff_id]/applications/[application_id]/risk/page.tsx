'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { premiumTheme } from '@/lib/premium-theme';
import { apiClient } from '@/lib/api';

export default function RiskAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [application, setApplication] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setAppLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form fields
  const [dti, setDti] = useState('');
  const [ltv, setLtv] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [riskCategory, setRiskCategory] = useState('LOW');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role === 'APPLICANT')) {
      router.push('/staff/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (params?.id) {
      loadData();
    }
  }, [params?.id]);

  const loadData = async () => {
    try {
      const appData = await apiClient.get(`/applications/${params.id}`) as any;
      setApplication(appData);

      try {
        const assessmentData = await apiClient.get(`/risk/application/${params.id}`) as any;
        setAssessment(assessmentData);
        // Pre-fill form if assessment exists
        setDti(assessmentData.dti?.toString() || '');
        setLtv(assessmentData.ltv?.toString() || '');
        setCreditScore(assessmentData.creditScore?.toString() || '');
        setRiskCategory(assessmentData.riskCategory || 'LOW');
        setNotes(assessmentData.notes || '');
      } catch (error) {
        // No existing assessment
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setAppLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        applicationId: params.id,
        dti: parseFloat(dti),
        ltv: parseFloat(ltv),
        creditScore: parseInt(creditScore),
        riskCategory,
        notes,
      };

      if (assessment) {
        await apiClient.put(`/risk/${assessment.id}`, payload);
      } else {
        await apiClient.post('/risk', payload);
      }

      alert('Risk assessment saved successfully!');
      router.push(`/staff/applications/${params.id}`);
    } catch (error) {
      console.error('Failed to save assessment:', error);
      alert('Failed to save assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'LOW': return premiumTheme.colors.success;
      case 'MEDIUM': return premiumTheme.colors.warning;
      case 'HIGH': return premiumTheme.colors.error;
      case 'VERY_HIGH': return premiumTheme.colors.errorSoft;
      default: return premiumTheme.colors.textSecondary;
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        fontFamily: premiumTheme.typography.fontFamily 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: premiumTheme.colors.surfaceAlt,
      fontFamily: premiumTheme.typography.fontFamily,
      padding: premiumTheme.spacing['3xl'],
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <button
          onClick={() => router.push(`/staff/applications/${params.id}`)}
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
          ← Back to Application
        </button>

        <div style={{ marginBottom: premiumTheme.spacing['2xl'] }}>
          <h1 style={{
            fontSize: premiumTheme.typography.scale.h1.size,
            fontWeight: premiumTheme.typography.weight.bold,
            color: premiumTheme.colors.navy,
            marginBottom: premiumTheme.spacing.sm,
          }}>
            Risk Assessment
          </h1>
          <p style={{
            fontSize: premiumTheme.typography.scale.body.size,
            color: premiumTheme.colors.textSecondary,
          }}>
            Application #{application?.id} - {application?.requestedAmount ? `$${application.requestedAmount.toLocaleString()}` : ''}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: premiumTheme.spacing.xl }}>
          {/* Left: Assessment Form */}
          <div style={{
            backgroundColor: premiumTheme.colors.surface.primary,
            borderRadius: premiumTheme.radius.xl,
            padding: premiumTheme.spacing['2xl'],
            boxShadow: premiumTheme.shadows.card,
          }}>
            <h2 style={{
              fontSize: premiumTheme.typography.scale.h3.size,
              fontWeight: premiumTheme.typography.weight.semibold,
              color: premiumTheme.colors.textPrimary,
              marginBottom: premiumTheme.spacing.xl,
            }}>
              Risk Metrics
            </h2>

            <form onSubmit={handleSubmit}>
              {/* DTI Ratio */}
              <div style={{ marginBottom: premiumTheme.spacing.xl }}>
                <label style={{
                  display: 'block',
                  fontSize: premiumTheme.typography.scale.small.size,
                  fontWeight: premiumTheme.typography.weight.semibold,
                  color: premiumTheme.colors.textPrimary,
                  marginBottom: premiumTheme.spacing.sm,
                }}>
                  Debt-to-Income (DTI) Ratio (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={dti}
                  onChange={(e) => setDti(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: premiumTheme.typography.scale.body.size,
                    border: `2px solid ${premiumTheme.colors.border}`,
                    borderRadius: premiumTheme.radius.lg,
                    outline: 'none',
                    fontFamily: premiumTheme.typography.fontFamily,
                  }}
                />
                <div style={{
                  fontSize: premiumTheme.typography.scale.tiny.size,
                  color: premiumTheme.colors.textSecondary,
                  marginTop: premiumTheme.spacing.xs,
                }}>
                  Acceptable range: {'<'} 43%
                </div>
              </div>

              {/* LTV Ratio */}
              <div style={{ marginBottom: premiumTheme.spacing.xl }}>
                <label style={{
                  display: 'block',
                  fontSize: premiumTheme.typography.scale.small.size,
                  fontWeight: premiumTheme.typography.weight.semibold,
                  color: premiumTheme.colors.textPrimary,
                  marginBottom: premiumTheme.spacing.sm,
                }}>
                  Loan-to-Value (LTV) Ratio (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={ltv}
                  onChange={(e) => setLtv(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: premiumTheme.typography.scale.body.size,
                    border: `2px solid ${premiumTheme.colors.border}`,
                    borderRadius: premiumTheme.radius.lg,
                    outline: 'none',
                    fontFamily: premiumTheme.typography.fontFamily,
                  }}
                />
                <div style={{
                  fontSize: premiumTheme.typography.scale.tiny.size,
                  color: premiumTheme.colors.textSecondary,
                  marginTop: premiumTheme.spacing.xs,
                }}>
                  Acceptable range: {'<'} 80%
                </div>
              </div>

              {/* Credit Score */}
              <div style={{ marginBottom: premiumTheme.spacing.xl }}>
                <label style={{
                  display: 'block',
                  fontSize: premiumTheme.typography.scale.small.size,
                  fontWeight: premiumTheme.typography.weight.semibold,
                  color: premiumTheme.colors.textPrimary,
                  marginBottom: premiumTheme.spacing.sm,
                }}>
                  Credit Score
                </label>
                <input
                  type="number"
                  value={creditScore}
                  onChange={(e) => setCreditScore(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: premiumTheme.typography.scale.body.size,
                    border: `2px solid ${premiumTheme.colors.border}`,
                    borderRadius: premiumTheme.radius.lg,
                    outline: 'none',
                    fontFamily: premiumTheme.typography.fontFamily,
                  }}
                />
                <div style={{
                  fontSize: premiumTheme.typography.scale.tiny.size,
                  color: premiumTheme.colors.textSecondary,
                  marginTop: premiumTheme.spacing.xs,
                }}>
                  Range: 300-850 (Excellent: 740+)
                </div>
              </div>

              {/* Risk Category */}
              <div style={{ marginBottom: premiumTheme.spacing.xl }}>
                <label style={{
                  display: 'block',
                  fontSize: premiumTheme.typography.scale.small.size,
                  fontWeight: premiumTheme.typography.weight.semibold,
                  color: premiumTheme.colors.textPrimary,
                  marginBottom: premiumTheme.spacing.sm,
                }}>
                  Overall Risk Category
                </label>
                <select
                  value={riskCategory}
                  onChange={(e) => setRiskCategory(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: premiumTheme.typography.scale.body.size,
                    border: `2px solid ${premiumTheme.colors.border}`,
                    borderRadius: premiumTheme.radius.lg,
                    outline: 'none',
                    fontFamily: premiumTheme.typography.fontFamily,
                    backgroundColor: premiumTheme.colors.surface.primary,
                  }}
                >
                  <option value="LOW">Low Risk</option>
                  <option value="MEDIUM">Medium Risk</option>
                  <option value="HIGH">High Risk</option>
                  <option value="VERY_HIGH">Very High Risk</option>
                </select>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: premiumTheme.spacing.xl }}>
                <label style={{
                  display: 'block',
                  fontSize: premiumTheme.typography.scale.small.size,
                  fontWeight: premiumTheme.typography.weight.semibold,
                  color: premiumTheme.colors.textPrimary,
                  marginBottom: premiumTheme.spacing.sm,
                }}>
                  Assessment Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: premiumTheme.typography.scale.body.size,
                    border: `2px solid ${premiumTheme.colors.border}`,
                    borderRadius: premiumTheme.radius.lg,
                    outline: 'none',
                    fontFamily: premiumTheme.typography.fontFamily,
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: premiumTheme.colors.navy,
                  color: 'white',
                  border: 'none',
                  borderRadius: premiumTheme.radius.lg,
                  fontSize: premiumTheme.typography.scale.body.size,
                  fontWeight: premiumTheme.typography.weight.semibold,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                  boxShadow: premiumTheme.shadows.md,
                }}
              >
                {submitting ? 'Saving...' : assessment ? 'Update Assessment' : 'Submit Assessment'}
              </button>
            </form>
          </div>

          {/* Right: Risk Indicators */}
          <div>
            {/* Risk Category Card */}
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
                Current Risk Level
              </h3>

              <div style={{
                padding: premiumTheme.spacing.xl,
                backgroundColor: getRiskColor(riskCategory) + '20',
                borderRadius: premiumTheme.radius.lg,
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: premiumTheme.typography.scale.display.size,
                  fontWeight: premiumTheme.typography.weight.bold,
                  color: getRiskColor(riskCategory),
                }}>
                  {riskCategory.replace('_', ' ')}
                </div>
              </div>
            </div>

            {/* Guidelines */}
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
                Risk Guidelines
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: premiumTheme.spacing.md,
              }}>
                {[
                  { label: 'DTI < 36%', status: 'Excellent' },
                  { label: 'Credit Score > 740', status: 'Excellent' },
                  { label: 'LTV < 80%', status: 'Acceptable' },
                  { label: 'Employment Stable', status: 'Required' },
                ].map((item, idx) => (
                  <div key={idx} style={{
                    padding: premiumTheme.spacing.md,
                    backgroundColor: premiumTheme.colors.surfaceAlt,
                    borderRadius: premiumTheme.radius.md,
                    fontSize: premiumTheme.typography.scale.small.size,
                  }}>
                    <div style={{ fontWeight: premiumTheme.typography.weight.semibold, marginBottom: premiumTheme.spacing.xs }}>
                      {item.label}
                    </div>
                    <div style={{ color: premiumTheme.colors.textSecondary }}>
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

