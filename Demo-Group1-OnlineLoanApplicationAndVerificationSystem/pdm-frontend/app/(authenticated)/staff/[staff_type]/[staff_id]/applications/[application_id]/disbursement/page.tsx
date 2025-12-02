'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { premiumTheme } from '@/lib/premium-theme';
import { apiClient } from '@/lib/api';

export default function DisbursementControlPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [application, setApplication] = useState<any>(null);
  const [disbursement, setDisbursement] = useState<any>(null);
  const [loading, setAppLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [disbursementMethod, setDisbursementMethod] = useState('BANK_TRANSFER');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role === 'APPLICANT')) {
      router.push('/staff/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (params?.application_id) {
      loadData();
    }
  }, [params?.application_id]);

  const loadData = async () => {
    try {
      const appData = await apiClient.get(`/applications/${params.application_id}`);
      setApplication(appData);

      try {
        const disbData = await apiClient.get(`/disbursement/application/${params.application_id}`);
        setDisbursement(disbData);
      } catch (error) {
        // No disbursement yet
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setAppLoading(false);
    }
  };

  const handleInitiateDisbursement = async () => {
    setProcessing(true);
    try {
      await apiClient.post('/disbursement', {
        applicationId: params.application_id,
        disbursementMethod,
        accountNumber,
      });
      alert('Disbursement initiated successfully!');
      loadData();
    } catch (error) {
      console.error('Failed to initiate disbursement:', error);
      alert('Failed to initiate disbursement');
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessDisbursement = async () => {
    if (!disbursement) return;
    setProcessing(true);
    try {
      await apiClient.post(`/disbursement/${disbursement.id}/process`, {});
      alert('Disbursement processed successfully!');
      loadData();
    } catch (error) {
      console.error('Failed to process disbursement:', error);
      alert('Failed to process');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: premiumTheme.typography.fontFamily }}>Loading...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: premiumTheme.colors.surfaceAlt,
      fontFamily: premiumTheme.typography.fontFamily,
      padding: premiumTheme.spacing['3xl'],
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
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
          Loan Disbursement
        </h1>
        <p style={{
          fontSize: premiumTheme.typography.scale.body.size,
          color: premiumTheme.colors.textSecondary,
          marginBottom: premiumTheme.spacing['2xl'],
        }}>
          Process loan disbursement for Application #{application?.id}
        </p>

        {!disbursement ? (
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
              marginBottom: premiumTheme.spacing.xl,
            }}>
              Initiate Disbursement
            </h3>

            <div style={{
              padding: premiumTheme.spacing.xl,
              backgroundColor: premiumTheme.colors.navySoft,
              borderRadius: premiumTheme.radius.lg,
              marginBottom: premiumTheme.spacing.xl,
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: premiumTheme.typography.scale.small.size,
                color: premiumTheme.colors.textSecondary,
                marginBottom: premiumTheme.spacing.xs,
              }}>
                Disbursement Amount
              </div>
              <div style={{
                fontSize: premiumTheme.typography.scale.display.size,
                fontWeight: premiumTheme.typography.weight.bold,
                color: premiumTheme.colors.navy,
              }}>
                ${application?.requestedAmount?.toLocaleString()}
              </div>
            </div>

            <div style={{ marginBottom: premiumTheme.spacing.lg }}>
              <label style={{
                display: 'block',
                fontSize: premiumTheme.typography.scale.small.size,
                fontWeight: premiumTheme.typography.weight.semibold,
                color: premiumTheme.colors.textPrimary,
                marginBottom: premiumTheme.spacing.sm,
              }}>
                Disbursement Method
              </label>
              <select
                value={disbursementMethod}
                onChange={(e) => setDisbursementMethod(e.target.value)}
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
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CHECK">Check</option>
                <option value="WIRE">Wire Transfer</option>
              </select>
            </div>

            <div style={{ marginBottom: premiumTheme.spacing.xl }}>
              <label style={{
                display: 'block',
                fontSize: premiumTheme.typography.scale.small.size,
                fontWeight: premiumTheme.typography.weight.semibold,
                color: premiumTheme.colors.textPrimary,
                marginBottom: premiumTheme.spacing.sm,
              }}>
                Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter bank account number"
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

            <button
              onClick={handleInitiateDisbursement}
              disabled={processing || !accountNumber}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: premiumTheme.colors.accent,
                color: premiumTheme.colors.textPrimary,
                border: 'none',
                borderRadius: premiumTheme.radius.lg,
                fontSize: premiumTheme.typography.scale.body.size,
                fontWeight: premiumTheme.typography.weight.semibold,
                cursor: processing || !accountNumber ? 'not-allowed' : 'pointer',
                opacity: processing || !accountNumber ? 0.7 : 1,
                boxShadow: premiumTheme.shadows.md,
              }}
            >
              {processing ? 'Processing...' : 'Initiate Disbursement'}
            </button>
          </div>
        ) : (
          <div style={{
            backgroundColor: premiumTheme.colors.surface.primary,
            borderRadius: premiumTheme.radius.xl,
            padding: premiumTheme.spacing['2xl'],
            boxShadow: premiumTheme.shadows.card,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: premiumTheme.spacing.xl,
              paddingBottom: premiumTheme.spacing.lg,
              borderBottom: `1px solid ${premiumTheme.colors.border}`,
            }}>
              <div>
                <h3 style={{
                  fontSize: premiumTheme.typography.scale.h3.size,
                  fontWeight: premiumTheme.typography.weight.semibold,
                  color: premiumTheme.colors.textPrimary,
                  marginBottom: premiumTheme.spacing.xs,
                }}>
                  Disbursement #{disbursement.id}
                </h3>
                <div style={{
                  fontSize: premiumTheme.typography.scale.small.size,
                  color: premiumTheme.colors.textSecondary,
                }}>
                  Initiated on {new Date(disbursement.createdAt).toLocaleDateString()}
                </div>
              </div>
              <span style={{
                padding: '8px 16px',
                backgroundColor: disbursement.status === 'COMPLETED' ? premiumTheme.colors.successSoft : premiumTheme.colors.warningSoft,
                color: disbursement.status === 'COMPLETED' ? premiumTheme.colors.success : premiumTheme.colors.warning,
                borderRadius: premiumTheme.radius.pill,
                fontSize: premiumTheme.typography.scale.small.size,
                fontWeight: premiumTheme.typography.weight.semibold,
              }}>
                {disbursement.status}
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: premiumTheme.spacing.lg,
              marginBottom: premiumTheme.spacing.xl,
            }}>
              {[
                { label: 'Amount', value: `$${disbursement.amount?.toLocaleString()}` },
                { label: 'Method', value: disbursement.disbursementMethod },
                { label: 'Account', value: disbursement.accountNumber || 'N/A' },
                { label: 'Status', value: disbursement.status },
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

            {disbursement.status === 'PENDING' && (
              <button
                onClick={handleProcessDisbursement}
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: premiumTheme.colors.navy,
                  color: 'white',
                  border: 'none',
                  borderRadius: premiumTheme.radius.lg,
                  fontSize: premiumTheme.typography.scale.body.size,
                  fontWeight: premiumTheme.typography.weight.semibold,
                  cursor: processing ? 'not-allowed' : 'pointer',
                  opacity: processing ? 0.7 : 1,
                  boxShadow: premiumTheme.shadows.md,
                }}
              >
                {processing ? 'Processing...' : 'Complete Disbursement'}
              </button>
            )}

            {disbursement.status === 'COMPLETED' && (
              <div style={{
                padding: premiumTheme.spacing.lg,
                backgroundColor: premiumTheme.colors.successSoft,
                borderRadius: premiumTheme.radius.md,
                textAlign: 'center',
                color: premiumTheme.colors.success,
                fontWeight: premiumTheme.typography.weight.medium,
              }}>
                ✅ Disbursement completed on {new Date(disbursement.disbursedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

