'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { premiumTheme } from '@/lib/premium-theme';
import { apiClient } from '@/lib/api';

export default function VerificationConsolePage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [verification, setVerification] = useState<any>(null);
  const [loading, setAppLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState('PENDING');
  const [amlStatus, setAmlStatus] = useState('PENDING');
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
      const docsData = await apiClient.get(`/documents/application/${params.id}`);
      setDocuments(Array.isArray(docsData) ? docsData : []);

      try {
        const verData = await apiClient.get(`/verification/application/${params.id}`) as any;
        setVerification(verData);
        setKycStatus(verData.kycStatus || 'PENDING');
        setAmlStatus(verData.amlStatus || 'PENDING');
        setNotes(verData.notes || '');
      } catch (error) {
        // No verification yet
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setAppLoading(false);
    }
  };

  const handleDocumentStatus = async (docId: number, status: string) => {
    try {
      await apiClient.put(`/documents/${docId}/status`, { status });
      alert('Document status updated');
      loadData();
    } catch (error) {
      console.error('Failed to update document:', error);
      alert('Failed to update');
    }
  };

  const handleSubmitVerification = async () => {
    try {
      const payload = {
        applicationId: params.id,
        kycStatus,
        amlStatus,
        notes,
      };

      if (verification) {
        await apiClient.put(`/verification/${verification.id}`, payload);
      } else {
        await apiClient.post('/verification', payload);
      }

      alert('Verification saved!');
      router.push(`/staff/applications/${params.id}`);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save');
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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
          ← Back
        </button>

        <h1 style={{
          fontSize: premiumTheme.typography.scale.h1.size,
          fontWeight: premiumTheme.typography.weight.bold,
          color: premiumTheme.colors.navy,
          marginBottom: premiumTheme.spacing.md,
        }}>
          KYC/AML Verification
        </h1>
        <p style={{
          fontSize: premiumTheme.typography.scale.body.size,
          color: premiumTheme.colors.textSecondary,
          marginBottom: premiumTheme.spacing['2xl'],
        }}>
          Review documents and perform compliance checks
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: premiumTheme.spacing.xl }}>
          {/* Left: Documents */}
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
                marginBottom: premiumTheme.spacing.lg,
              }}>
                Submitted Documents
              </h3>

              {documents.length === 0 ? (
                <div style={{ padding: premiumTheme.spacing.xl, textAlign: 'center', color: premiumTheme.colors.textTertiary }}>
                  No documents uploaded yet
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: premiumTheme.spacing.md }}>
                  {documents.map((doc) => (
                    <div key={doc.id} style={{
                      padding: premiumTheme.spacing.lg,
                      backgroundColor: premiumTheme.colors.surfaceAlt,
                      borderRadius: premiumTheme.radius.lg,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <div>
                        <div style={{
                          fontSize: premiumTheme.typography.scale.body.size,
                          fontWeight: premiumTheme.typography.weight.semibold,
                          color: premiumTheme.colors.textPrimary,
                          marginBottom: premiumTheme.spacing.xs,
                        }}>
                          {doc.documentType?.replace(/_/g, ' ')}
                        </div>
                        <div style={{
                          fontSize: premiumTheme.typography.scale.small.size,
                          color: premiumTheme.colors.textSecondary,
                        }}>
                          {doc.fileName}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: premiumTheme.spacing.sm }}>
                        <button
                          onClick={() => handleDocumentStatus(doc.id, 'VERIFIED')}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: premiumTheme.colors.success,
                            color: 'white',
                            border: 'none',
                            borderRadius: premiumTheme.radius.md,
                            cursor: 'pointer',
                            fontSize: premiumTheme.typography.scale.small.size,
                            fontWeight: premiumTheme.typography.weight.medium,
                          }}
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleDocumentStatus(doc.id, 'REJECTED')}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: premiumTheme.colors.error,
                            color: 'white',
                            border: 'none',
                            borderRadius: premiumTheme.radius.md,
                            cursor: 'pointer',
                            fontSize: premiumTheme.typography.scale.small.size,
                            fontWeight: premiumTheme.typography.weight.medium,
                          }}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Verification Form */}
          <div>
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
                Verification Status
              </h3>

              <div style={{ marginBottom: premiumTheme.spacing.lg }}>
                <label style={{
                  display: 'block',
                  fontSize: premiumTheme.typography.scale.small.size,
                  fontWeight: premiumTheme.typography.weight.semibold,
                  color: premiumTheme.colors.textPrimary,
                  marginBottom: premiumTheme.spacing.sm,
                }}>
                  KYC Status
                </label>
                <select
                  value={kycStatus}
                  onChange={(e) => setKycStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: premiumTheme.typography.scale.body.size,
                    border: `2px solid ${premiumTheme.colors.border}`,
                    borderRadius: premiumTheme.radius.lg,
                    outline: 'none',
                    fontFamily: premiumTheme.typography.fontFamily,
                    backgroundColor: premiumTheme.colors.surface.primary,
                  }}
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div style={{ marginBottom: premiumTheme.spacing.lg }}>
                <label style={{
                  display: 'block',
                  fontSize: premiumTheme.typography.scale.small.size,
                  fontWeight: premiumTheme.typography.weight.semibold,
                  color: premiumTheme.colors.textPrimary,
                  marginBottom: premiumTheme.spacing.sm,
                }}>
                  AML Status
                </label>
                <select
                  value={amlStatus}
                  onChange={(e) => setAmlStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: premiumTheme.typography.scale.body.size,
                    border: `2px solid ${premiumTheme.colors.border}`,
                    borderRadius: premiumTheme.radius.lg,
                    outline: 'none',
                    fontFamily: premiumTheme.typography.fontFamily,
                    backgroundColor: premiumTheme.colors.surface.primary,
                  }}
                >
                  <option value="PENDING">Pending</option>
                  <option value="CLEAR">Clear</option>
                  <option value="FLAGGED">Flagged</option>
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
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
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
                onClick={handleSubmitVerification}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: premiumTheme.colors.navy,
                  color: 'white',
                  border: 'none',
                  borderRadius: premiumTheme.radius.lg,
                  fontSize: premiumTheme.typography.scale.body.size,
                  fontWeight: premiumTheme.typography.weight.semibold,
                  cursor: 'pointer',
                  boxShadow: premiumTheme.shadows.md,
                }}
              >
                Submit Verification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

