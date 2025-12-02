'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { premiumTheme } from '@/lib/premium-theme';
import { apiClient } from '@/lib/api';
import { UserDashboardLayout } from '@/layouts/UserDashboardLayout';

export default function ContractViewPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading } = useAuth();
  const [contract, setContract] = useState<any>(null);
  const [loading, setAppLoading] = useState(true);

  const applicationId = params?.application_id as string;
  const userId = params?.user_id as string;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (applicationId) {
      loadContract();
    }
  }, [applicationId]);

  const loadContract = async () => {
    try {
      const data = await apiClient.get(`/contracts/application/${applicationId}`);
      setContract(data);
    } catch (error) {
      console.error('Failed to load contract:', error);
    } finally {
      setAppLoading(false);
    }
  };

  const handleSign = async () => {
    if (!contract) return;
    try {
      await apiClient.post(`/contracts/${contract.id}/sign`, { signature: 'Digital Signature' });
      alert('Contract signed successfully!');
      loadContract();
    } catch (error) {
      console.error('Failed to sign:', error);
      alert('Failed to sign contract');
    }
  };

  if (loading) {
    return (
      <UserDashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: premiumTheme.typography.fontFamily }}>Loading...</div>
      </UserDashboardLayout>
    );
  }

  if (!contract) {
    return (
      <UserDashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: premiumTheme.typography.fontFamily }}>
          No contract available yet.
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
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button
          onClick={() => router.push(`/user/${userId}/applications/${applicationId}`)}
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

        <div style={{
          backgroundColor: premiumTheme.colors.surface.primary,
          borderRadius: premiumTheme.radius.xl,
          padding: premiumTheme.spacing['3xl'],
          boxShadow: premiumTheme.shadows.lg,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: premiumTheme.spacing['2xl'],
            paddingBottom: premiumTheme.spacing.lg,
            borderBottom: `2px solid ${premiumTheme.colors.border}`,
          }}>
            <div>
              <h1 style={{
                fontSize: premiumTheme.typography.scale.h1.size,
                fontWeight: premiumTheme.typography.weight.bold,
                color: premiumTheme.colors.navy,
                marginBottom: premiumTheme.spacing.sm,
              }}>
                Loan Agreement
              </h1>
              <p style={{
                fontSize: premiumTheme.typography.scale.body.size,
                color: premiumTheme.colors.textSecondary,
              }}>
                Contract #{contract.contractNumber}
              </p>
            </div>
            <span style={{
              padding: '10px 20px',
              backgroundColor: contract.status === 'SIGNED' ? premiumTheme.colors.successSoft : premiumTheme.colors.warningSoft,
              color: contract.status === 'SIGNED' ? premiumTheme.colors.success : premiumTheme.colors.warning,
              borderRadius: premiumTheme.radius.pill,
              fontSize: premiumTheme.typography.scale.small.size,
              fontWeight: premiumTheme.typography.weight.semibold,
            }}>
              {contract.status}
            </span>
          </div>

          {/* Contract Terms */}
          <div style={{
            padding: premiumTheme.spacing.xl,
            backgroundColor: premiumTheme.colors.surfaceAlt,
            borderRadius: premiumTheme.radius.lg,
            marginBottom: premiumTheme.spacing.xl,
            lineHeight: premiumTheme.typography.lineHeight.relaxed,
          }}>
            <h3 style={{
              fontSize: premiumTheme.typography.scale.h3.size,
              fontWeight: premiumTheme.typography.weight.semibold,
              marginBottom: premiumTheme.spacing.lg,
            }}>
              Terms & Conditions
            </h3>
            <div style={{
              fontSize: premiumTheme.typography.scale.body.size,
              color: premiumTheme.colors.textSecondary,
              whiteSpace: 'pre-wrap',
            }}>
              {contract.terms || 'This loan agreement is entered into between the Lender and the Borrower...'}
            </div>
          </div>

          {/* Key Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: premiumTheme.spacing.lg,
            marginBottom: premiumTheme.spacing.xl,
          }}>
            {[
              { label: 'Loan Amount', value: `$${contract.loanAmount?.toLocaleString()}` },
              { label: 'Interest Rate', value: `${contract.interestRate}%` },
              { label: 'Loan Term', value: `${contract.term} months` },
              { label: 'Generated On', value: new Date(contract.createdAt).toLocaleDateString() },
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

          {/* Sign Button */}
          {contract.status !== 'SIGNED' && (
            <button
              onClick={handleSign}
              style={{
                width: '100%',
                padding: '16px',
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
              Sign Contract
            </button>
          )}

          {contract.status === 'SIGNED' && (
            <div style={{
              padding: premiumTheme.spacing.lg,
              backgroundColor: premiumTheme.colors.successSoft,
              borderRadius: premiumTheme.radius.md,
              textAlign: 'center',
              color: premiumTheme.colors.success,
              fontWeight: premiumTheme.typography.weight.medium,
            }}>
              ✅ Contract signed on {new Date(contract.signedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
    </UserDashboardLayout>
  );
}

