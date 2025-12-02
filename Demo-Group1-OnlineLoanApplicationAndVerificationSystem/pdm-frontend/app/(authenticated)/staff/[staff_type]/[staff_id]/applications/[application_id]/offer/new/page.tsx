'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { premiumTheme } from '@/lib/premium-theme';
import { apiClient } from '@/lib/api';

export default function OfferCreationPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [application, setApplication] = useState<any>(null);
  const [loading, setAppLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [approvedAmount, setApprovedAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [term, setTerm] = useState('');
  const [processingFee, setProcessingFee] = useState('');
  const [conditions, setConditions] = useState('');
  const [validityDays, setValidityDays] = useState('30');
  
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role === 'APPLICANT')) {
      router.push('/staff/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (params?.application_id) {
      loadApplication();
    }
  }, [params?.application_id]);

  useEffect(() => {
    // Calculate EMI whenever inputs change
    if (approvedAmount && interestRate && term) {
      const P = parseFloat(approvedAmount);
      const r = parseFloat(interestRate) / 100 / 12;
      const n = parseInt(term);
      
      if (P > 0 && r > 0 && n > 0) {
        const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        setMonthlyPayment(Math.round(emi));
        setTotalPayment(Math.round(emi * n));
      }
    }
  }, [approvedAmount, interestRate, term]);

  const loadApplication = async () => {
    try {
      const data = await apiClient.get(`/applications/${params.application_id}`) as any;
      setApplication(data);
      // Pre-fill with requested values
      setApprovedAmount(data.requestedAmount?.toString() || '');
      setTerm((data.requestedTermMonths || data.requestedTerm)?.toString() || '');
      setInterestRate('12.0'); // Default rate
      setProcessingFee('500'); // Default fee
    } catch (error) {
      console.error('Failed to load application:', error);
    } finally {
      setAppLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        applicationId: params.application_id,
        approvedAmount: parseFloat(approvedAmount),
        interestRate: parseFloat(interestRate),
        term: parseInt(term),
        processingFee: parseFloat(processingFee),
        monthlyPayment,
        totalPayment,
        conditions,
        validUntil: new Date(Date.now() + parseInt(validityDays) * 24 * 60 * 60 * 1000).toISOString(),
      };

      await apiClient.post('/offers', payload);
      alert('Offer created successfully!');
      router.push(`/staff/${params.staff_type}/${params.staff_id}/applications/${params.application_id}`);
    } catch (error) {
      console.error('Failed to create offer:', error);
      alert('Failed to create offer');
    } finally {
      setSubmitting(false);
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
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <button
          onClick={() => router.push(`/staff/${params.staff_type}/${params.staff_id}/applications/${params.application_id}`)}
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
          ← Back
        </button>

        <h1 style={{
          fontSize: premiumTheme.typography.scale.h1.size,
          fontWeight: premiumTheme.typography.weight.bold,
          color: premiumTheme.colors.navy,
          marginBottom: premiumTheme.spacing.md,
        }}>
          Create Loan Offer
        </h1>
        <p style={{
          fontSize: premiumTheme.typography.scale.body.size,
          color: premiumTheme.colors.textSecondary,
          marginBottom: premiumTheme.spacing['2xl'],
        }}>
          Application #{application?.id} - Requested: ${application?.requestedAmount?.toLocaleString()}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: premiumTheme.spacing.xl }}>
          {/* Left: Form */}
          <div style={{
            backgroundColor: premiumTheme.colors.surface.primary,
            borderRadius: premiumTheme.radius.xl,
            padding: premiumTheme.spacing['2xl'],
            boxShadow: premiumTheme.shadows.card,
          }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: premiumTheme.spacing.xl }}>
                <label style={{
                  display: 'block',
                  fontSize: premiumTheme.typography.scale.small.size,
                  fontWeight: premiumTheme.typography.weight.semibold,
                  color: premiumTheme.colors.textPrimary,
                  marginBottom: premiumTheme.spacing.sm,
                }}>
                  Approved Loan Amount ($)
                </label>
                <input
                  type="number"
                  value={approvedAmount}
                  onChange={(e) => setApprovedAmount(e.target.value)}
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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: premiumTheme.spacing.lg, marginBottom: premiumTheme.spacing.xl }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: premiumTheme.typography.scale.small.size,
                    fontWeight: premiumTheme.typography.weight.semibold,
                    color: premiumTheme.colors.textPrimary,
                    marginBottom: premiumTheme.spacing.sm,
                  }}>
                    Interest Rate (% APR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
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
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: premiumTheme.typography.scale.small.size,
                    fontWeight: premiumTheme.typography.weight.semibold,
                    color: premiumTheme.colors.textPrimary,
                    marginBottom: premiumTheme.spacing.sm,
                  }}>
                    Loan Term (months)
                  </label>
                  <input
                    type="number"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
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
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: premiumTheme.spacing.lg, marginBottom: premiumTheme.spacing.xl }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: premiumTheme.typography.scale.small.size,
                    fontWeight: premiumTheme.typography.weight.semibold,
                    color: premiumTheme.colors.textPrimary,
                    marginBottom: premiumTheme.spacing.sm,
                  }}>
                    Processing Fee ($)
                  </label>
                  <input
                    type="number"
                    value={processingFee}
                    onChange={(e) => setProcessingFee(e.target.value)}
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
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: premiumTheme.typography.scale.small.size,
                    fontWeight: premiumTheme.typography.weight.semibold,
                    color: premiumTheme.colors.textPrimary,
                    marginBottom: premiumTheme.spacing.sm,
                  }}>
                    Validity (days)
                  </label>
                  <input
                    type="number"
                    value={validityDays}
                    onChange={(e) => setValidityDays(e.target.value)}
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
                </div>
              </div>

              <div style={{ marginBottom: premiumTheme.spacing.xl }}>
                <label style={{
                  display: 'block',
                  fontSize: premiumTheme.typography.scale.small.size,
                  fontWeight: premiumTheme.typography.weight.semibold,
                  color: premiumTheme.colors.textPrimary,
                  marginBottom: premiumTheme.spacing.sm,
                }}>
                  Terms & Conditions
                </label>
                <textarea
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
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
                {submitting ? 'Creating Offer...' : 'Generate Offer'}
              </button>
            </form>
          </div>

          {/* Right: Calculations */}
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
                Calculated EMI
              </h3>

              <div style={{
                padding: premiumTheme.spacing.xl,
                backgroundColor: premiumTheme.colors.navySoft,
                borderRadius: premiumTheme.radius.lg,
                textAlign: 'center',
                marginBottom: premiumTheme.spacing.lg,
              }}>
                <div style={{
                  fontSize: premiumTheme.typography.scale.tiny.size,
                  color: premiumTheme.colors.textSecondary,
                  marginBottom: premiumTheme.spacing.xs,
                }}>
                  Monthly Payment
                </div>
                <div style={{
                  fontSize: premiumTheme.typography.scale.display.size,
                  fontWeight: premiumTheme.typography.weight.bold,
                  color: premiumTheme.colors.navy,
                }}>
                  ${monthlyPayment.toLocaleString()}
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: premiumTheme.spacing.md,
              }}>
                <div style={{
                  padding: premiumTheme.spacing.md,
                  backgroundColor: premiumTheme.colors.surfaceAlt,
                  borderRadius: premiumTheme.radius.md,
                }}>
                  <div style={{
                    fontSize: premiumTheme.typography.scale.tiny.size,
                    color: premiumTheme.colors.textSecondary,
                  }}>
                    Total Payment
                  </div>
                  <div style={{
                    fontSize: premiumTheme.typography.scale.h3.size,
                    fontWeight: premiumTheme.typography.weight.bold,
                    color: premiumTheme.colors.textPrimary,
                  }}>
                    ${totalPayment.toLocaleString()}
                  </div>
                </div>

                <div style={{
                  padding: premiumTheme.spacing.md,
                  backgroundColor: premiumTheme.colors.surfaceAlt,
                  borderRadius: premiumTheme.radius.md,
                }}>
                  <div style={{
                    fontSize: premiumTheme.typography.scale.tiny.size,
                    color: premiumTheme.colors.textSecondary,
                  }}>
                    Total Interest
                  </div>
                  <div style={{
                    fontSize: premiumTheme.typography.scale.h3.size,
                    fontWeight: premiumTheme.typography.weight.bold,
                    color: premiumTheme.colors.textPrimary,
                  }}>
                    ${(totalPayment - parseFloat(approvedAmount || '0')).toLocaleString()}
                  </div>
                </div>
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
                ℹ️ EMI is calculated using the compound interest formula. Applicant will have {term} months to repay.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

