'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { premiumTheme } from '@/lib/premium-theme';
import { apiClient } from '@/lib/api';

export default function DocumentUploadPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setAppLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (params?.id) {
      loadDocuments();
    }
  }, [params?.id]);

  const loadDocuments = async () => {
    try {
      const data = await apiClient.get(`/documents/application/${params.id}`);
      setDocuments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setAppLoading(false);
    }
  };

  const handleUpload = async (docType: string) => {
    setUploading(true);
    try {
      // Mock upload - in real app, use file input
      const payload = {
        applicationId: params.id,
        documentType: docType,
        fileName: `${docType}_${Date.now()}.pdf`,
        fileUrl: `/uploads/sample_${docType}.pdf`,
        fileSize: 150000,
      };
      
      await apiClient.post('/documents', payload);
      alert('Document uploaded successfully!');
      loadDocuments();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const requiredDocs = [
    { type: 'ID_PROOF', label: 'Government ID', icon: '🪪' },
    { type: 'INCOME_PROOF', label: 'Income Proof', icon: '💵' },
    { type: 'ADDRESS_PROOF', label: 'Address Proof', icon: '🏠' },
    { type: 'BANK_STATEMENT', label: 'Bank Statement', icon: '🏦' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return premiumTheme.statusBadges.kyc_approved;
      case 'PENDING': return premiumTheme.statusBadges.kyc_pending;
      case 'REJECTED': return premiumTheme.statusBadges.risk_high;
      default: return premiumTheme.statusBadges.kyc_pending;
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
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
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
          ← Back
        </button>

        <h1 style={{
          fontSize: premiumTheme.typography.scale.h1.size,
          fontWeight: premiumTheme.typography.weight.bold,
          color: premiumTheme.colors.navy,
          marginBottom: premiumTheme.spacing.md,
        }}>
          Document Upload
        </h1>
        <p style={{
          fontSize: premiumTheme.typography.scale.body.size,
          color: premiumTheme.colors.textSecondary,
          marginBottom: premiumTheme.spacing['2xl'],
        }}>
          Upload required documents for verification
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: premiumTheme.spacing.lg,
        }}>
          {requiredDocs.map((doc) => {
            const uploaded = documents.find(d => d.documentType === doc.type);
            
            return (
              <div key={doc.type} style={{
                backgroundColor: premiumTheme.colors.surface.primary,
                borderRadius: premiumTheme.radius.xl,
                padding: premiumTheme.spacing.xl,
                boxShadow: premiumTheme.shadows.card,
              }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: premiumTheme.spacing.md, marginBottom: premiumTheme.spacing.lg }}>
                  <span style={{ fontSize: '40px' }}>{doc.icon}</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: premiumTheme.typography.scale.h4.size,
                      fontWeight: premiumTheme.typography.weight.semibold,
                      color: premiumTheme.colors.textPrimary,
                      marginBottom: premiumTheme.spacing.xs,
                    }}>
                      {doc.label}
                    </h3>
                    {uploaded ? (
                      <span style={{
                        padding: '4px 12px',
                        backgroundColor: getStatusColor(uploaded.status).bg,
                        color: getStatusColor(uploaded.status).color,
                        borderRadius: premiumTheme.radius.pill,
                        fontSize: premiumTheme.typography.scale.tiny.size,
                        fontWeight: premiumTheme.typography.weight.semibold,
                      }}>
                        {uploaded.status}
                      </span>
                    ) : (
                      <span style={{
                        fontSize: premiumTheme.typography.scale.small.size,
                        color: premiumTheme.colors.textTertiary,
                      }}>
                        Not uploaded
                      </span>
                    )}
                  </div>
                </div>

                {uploaded ? (
                  <div style={{
                    padding: premiumTheme.spacing.md,
                    backgroundColor: premiumTheme.colors.surfaceAlt,
                    borderRadius: premiumTheme.radius.md,
                    fontSize: premiumTheme.typography.scale.small.size,
                    marginBottom: premiumTheme.spacing.md,
                  }}>
                    <div style={{ fontWeight: premiumTheme.typography.weight.medium, marginBottom: premiumTheme.spacing.xs }}>
                      {uploaded.fileName}
                    </div>
                    <div style={{ color: premiumTheme.colors.textSecondary }}>
                      Uploaded: {new Date(uploaded.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                ) : null}

                <button
                  onClick={() => handleUpload(doc.type)}
                  disabled={uploading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: uploaded ? premiumTheme.colors.surfaceAlt : premiumTheme.colors.navy,
                    color: uploaded ? premiumTheme.colors.textPrimary : 'white',
                    border: `2px solid ${uploaded ? premiumTheme.colors.border : 'transparent'}`,
                    borderRadius: premiumTheme.radius.lg,
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    fontSize: premiumTheme.typography.scale.body.size,
                    fontWeight: premiumTheme.typography.weight.medium,
                  }}
                >
                  {uploaded ? 'Replace Document' : 'Upload Document'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

