'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { premiumTheme } from '@/lib/premium-theme';
import { apiClient } from '@/lib/api';

export default function OfferReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading } = useAuth();
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (params?.id) {
      loadOffer();
    }
  }, [params?.id]);

  const loadOffer = async () => {
    try {
      const data = await apiClient.get(`/offers/application/${params.id}`);
      setOffer(data);
    } catch (error) {
      console.error('Failed to load offer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      await apiClient.post(`/offers/${offer.id}/accept`, {});
      alert('Offer accepted successfully!');
      router.push(`/app/applications/${params.id}`);
    } catch (error) {
      console.error('Failed to accept offer:', error);
      alert('Failed to accept offer');
    }
  };

  const handleReject = async () => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await apiClient.post(`/offers/${offer.id}/reject`, { reason });
      alert('Offer rejected');
      router.push('/app/dashboard');
    } catch (error) {
      console.error('Failed to reject offer:', error);
      alert('Failed to reject offer');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        fontFamily: premiumTheme.typography.fontFamily 
      }}>
        Loading offer...
      </div>
    );
  }

  if (!offer) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        fontFamily: premiumTheme.typography.fontFamily 
      }}>
        No offer found for this application.
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
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <button
          onClick={() => router.push(`/app/applications/${params.id}`)}
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

        <h1 style={{
          fontSize: premiumTheme.typography.scale.h1.size,
          fontWeight: premiumTheme.typography.weight.bold,
          color: premiumTheme.colors.navy,
          marginBottom: premiumTheme.spacing.md,
        }}>
          Loan Offer
        </h1>

        <p style={{
          fontSize: premiumTheme.typography.scale.body.size,
          color: premiumTheme.colors.textSecondary,
          marginBottom: premiumTheme.spacing['2xl'],
        }}>
          Review your personalized loan offer and terms
        </p>

        {/* Main Offer Card */}
        <div style={{
          backgroundColor: premiumTheme.colors.surface.primary,
          borderRadius: premiumTheme.radius.xl,
          padding: premiumTheme.spacing['2xl'],
          boxShadow: premiumTheme.shadows.lg,
          marginBottom: premiumTheme.spacing.xl,
        }}>
          {/* Offer Number & Status */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: premiumTheme.spacing.xl,
            paddingBottom: premiumTheme.spacing.lg,
            borderBottom: `1px solid ${premiumTheme.colors.border}`,
          }}>
            <div>
              <div style={{
                fontSize: premiumTheme.typography.scale.small.size,
                color: premiumTheme.colors.textSecondary,
                marginBottom: premiumTheme.spacing.xs,
              }}>
                Offer Number
              </div>
              <div style={{
                fontSize: premiumTheme.typography.scale.h4.size,
                fontWeight: premiumTheme.typography.weight.semibold,
                color: premiumTheme.colors.textPrimary,
              }}>
                {offer.offerNumber}
              </div>
            </div>
            <span style={{
              padding: '8px 16px',
              backgroundColor: premiumTheme.colors.navySoft,
              color: premiumTheme.colors.navy,
              borderRadius: premiumTheme.radius.pill,
              fontSize: premiumTheme.typography.scale.small.size,
              fontWeight: premiumTheme.typography.weight.semibold,
            }}>
              {offer.status}
            </span>
          </div>

          {/* Key Terms - Highlighted */}
          <div style={{
            backgroundColor: premiumTheme.colors.navySoft,
            borderRadius: premiumTheme.radius.lg,
            padding: premiumTheme.spacing.xl,
            marginBottom: premiumTheme.spacing.xl,
          }}>
            <div style={{
              fontSize: premiumTheme.typography.scale.small.size,
              color: premiumTheme.colors.textSecondary,
              marginBottom: premiumTheme.spacing.sm,
            }}>
              Approved Loan Amount
            </div>
            <div style={{
              fontSize: premiumTheme.typography.scale.hero.size,
              fontWeight: premiumTheme.typography.weight.bold,
              color: premiumTheme.colors.navy,
              marginBottom: premiumTheme.spacing.lg,
            }}>
              ${offer.approvedAmount?.toLocaleString()}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: premiumTheme.spacing.lg,
            }}>
              <div>
                <div style={{
                  fontSize: premiumTheme.typography.scale.tiny.size,
                  color: premiumTheme.colors.textSecondary,
                  marginBottom: premiumTheme.spacing.xs,
                }}>
                  Interest Rate
                </div>
                <div style={{
                  fontSize: premiumTheme.typography.scale.h3.size,
                  fontWeight: premiumTheme.typography.weight.bold,
                  color: premiumTheme.colors.navy,
                }}>
                  {offer.interestRate}%
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: premiumTheme.typography.scale.tiny.size,
                  color: premiumTheme.colors.textSecondary,
                  marginBottom: premiumTheme.spacing.xs,
                }}>
                  Loan Term
                </div>
                <div style={{
                  fontSize: premiumTheme.typography.scale.h3.size,
                  fontWeight: premiumTheme.typography.weight.bold,
                  color: premiumTheme.colors.navy,
                }}>
                  {offer.term} months
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: premiumTheme.typography.scale.tiny.size,
                  color: premiumTheme.colors.textSecondary,
                  marginBottom: premiumTheme.spacing.xs,
                }}>
                  Monthly EMI
                </div>
                <div style={{
                  fontSize: premiumTheme.typography.scale.h3.size,
                  fontWeight: premiumTheme.typography.weight.bold,
                  color: premiumTheme.colors.navy,
                }}>
                  ${offer.monthlyPayment?.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: premiumTheme.spacing.lg,
            marginBottom: premiumTheme.spacing.xl,
          }}>
            <div style={{
              padding: premiumTheme.spacing.lg,
              backgroundColor: premiumTheme.colors.surfaceAlt,
              borderRadius: premiumTheme.radius.md,
            }}>
              <div style={{
                fontSize: premiumTheme.typography.scale.small.size,
                color: premiumTheme.colors.textSecondary,
                marginBottom: premiumTheme.spacing.sm,
              }}>
                Total Payment
              </div>
              <div style={{
                fontSize: premiumTheme.typography.scale.h3.size,
                fontWeight: premiumTheme.typography.weight.bold,
                color: premiumTheme.colors.textPrimary,
              }}>
                ${offer.totalPayment?.toLocaleString()}
              </div>
            </div>

            <div style={{
              padding: premiumTheme.spacing.lg,
              backgroundColor: premiumTheme.colors.surfaceAlt,
              borderRadius: premiumTheme.radius.md,
            }}>
              <div style={{
                fontSize: premiumTheme.typography.scale.small.size,
                color: premiumTheme.colors.textSecondary,
                marginBottom: premiumTheme.spacing.sm,
              }}>
                Processing Fee
              </div>
              <div style={{
                fontSize: premiumTheme.typography.scale.h3.size,
                fontWeight: premiumTheme.typography.weight.bold,
                color: premiumTheme.colors.textPrimary,
              }}>
                ${offer.processingFee?.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Conditions */}
          {offer.conditions && (
            <div style={{
              padding: premiumTheme.spacing.lg,
              backgroundColor: premiumTheme.colors.surfaceAlt,
              borderRadius: premiumTheme.radius.md,
              marginBottom: premiumTheme.spacing.xl,
            }}>
              <div style={{
                fontSize: premiumTheme.typography.scale.small.size,
                fontWeight: premiumTheme.typography.weight.semibold,
                color: premiumTheme.colors.textPrimary,
                marginBottom: premiumTheme.spacing.sm,
              }}>
                Terms & Conditions
              </div>
              <div style={{
                fontSize: premiumTheme.typography.scale.small.size,
                color: premiumTheme.colors.textSecondary,
                lineHeight: premiumTheme.typography.lineHeight.relaxed,
              }}>
                {offer.conditions}
              </div>
            </div>
          )}

          {/* Validity */}
          <div style={{
            padding: premiumTheme.spacing.md,
            backgroundColor: premiumTheme.colors.warningSoft,
            borderRadius: premiumTheme.radius.md,
            display: 'flex',
            alignItems: 'center',
            gap: premiumTheme.spacing.sm,
            marginBottom: premiumTheme.spacing.xl,
          }}>
            <span>⏰</span>
            <span style={{
              fontSize: premiumTheme.typography.scale.small.size,
              color: premiumTheme.colors.warning,
            }}>
              This offer is valid until {new Date(offer.validUntil).toLocaleDateString()}
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: premiumTheme.spacing.md,
            paddingTop: premiumTheme.spacing.lg,
            borderTop: `1px solid ${premiumTheme.colors.border}`,
          }}>
            <button
              onClick={handleAccept}
              style={{
                flex: 1,
                padding: '16px 32px',
                backgroundColor: premiumTheme.colors.accent,
                color: premiumTheme.colors.textPrimary,
                border: 'none',
                borderRadius: premiumTheme.radius.lg,
                fontSize: premiumTheme.typography.scale.body.size,
                fontWeight: premiumTheme.typography.weight.semibold,
                cursor: 'pointer',
                boxShadow: premiumTheme.shadows.md,
              }}
            >
              Accept Offer
            </button>
            <button
              onClick={handleReject}
              style={{
                flex: 1,
                padding: '16px 32px',
                backgroundColor: premiumTheme.colors.surface.primary,
                color: premiumTheme.colors.error,
                border: `2px solid ${premiumTheme.colors.error}`,
                borderRadius: premiumTheme.radius.lg,
                fontSize: premiumTheme.typography.scale.body.size,
                fontWeight: premiumTheme.typography.weight.semibold,
                cursor: 'pointer',
              }}
            >
              Reject Offer
            </button>
          </div>
        </div>

        {/* EMI Schedule Preview */}
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
            Monthly Installment Preview
          </h3>
          <p style={{
            fontSize: premiumTheme.typography.scale.small.size,
            color: premiumTheme.colors.textSecondary,
            marginBottom: premiumTheme.spacing.xl,
          }}>
            Your repayment schedule will be generated upon acceptance
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: premiumTheme.spacing.lg,
          }}>
            {[1, 2, 3].map((month) => (
              <div key={month} style={{
                padding: premiumTheme.spacing.lg,
                backgroundColor: premiumTheme.colors.surfaceAlt,
                borderRadius: premiumTheme.radius.md,
              }}>
                <div style={{
                  fontSize: premiumTheme.typography.scale.tiny.size,
                  color: premiumTheme.colors.textSecondary,
                  marginBottom: premiumTheme.spacing.xs,
                }}>
                  Month {month}
                </div>
                <div style={{
                  fontSize: premiumTheme.typography.scale.h4.size,
                  fontWeight: premiumTheme.typography.weight.bold,
                  color: premiumTheme.colors.textPrimary,
                }}>
                  ${offer.monthlyPayment?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

