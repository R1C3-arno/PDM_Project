'use client';

import { OlavsContainer } from '@/components/OlavsContainer';
import { OlavsCard } from '@/components/OlavsCard';
import { OlavsButton } from '@/components/OlavsButton';
import { olavsDesign } from '@/lib/olavs-design-system';
import { useRouter } from 'next/navigation';
import { Building2, Users, Target, Award } from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: olavsDesign.colors.surface.alt,
      paddingTop: olavsDesign.spacing[48],
      paddingBottom: olavsDesign.spacing[48],
    }}>
      <OlavsContainer>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: olavsDesign.spacing[48] }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: olavsDesign.colors.neutral[900],
            marginBottom: olavsDesign.spacing[16],
          }}>
            About PDM Loan Management
          </h1>
          <p style={{
            fontSize: olavsDesign.typography.scale.bodyL.size,
            color: olavsDesign.colors.neutral[600],
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Empowering financial institutions with modern loan management solutions
          </p>
        </div>

        {/* Mission Section */}
        <OlavsCard elevation="level2" style={{ marginBottom: olavsDesign.spacing[32] }}>
          <div style={{ textAlign: 'center', padding: olavsDesign.spacing[32] }}>
            <Target size={48} color={olavsDesign.colors.primary[500]} style={{ marginBottom: olavsDesign.spacing[24] }} />
            <h2 style={{
              fontSize: olavsDesign.typography.scale.headingM.size,
              fontWeight: '600',
              color: olavsDesign.colors.neutral[900],
              marginBottom: olavsDesign.spacing[16],
            }}>
              Our Mission
            </h2>
            <p style={{
              fontSize: olavsDesign.typography.scale.bodyM.size,
              color: olavsDesign.colors.neutral[700],
              lineHeight: '1.6',
              maxWidth: '700px',
              margin: '0 auto',
            }}>
              To provide a comprehensive, secure, and user-friendly platform that streamlines
              the entire loan lifecycle - from application to disbursement and repayment -
              while ensuring compliance and exceptional customer experience.
            </p>
          </div>
        </OlavsCard>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: olavsDesign.spacing[24],
          marginBottom: olavsDesign.spacing[48],
        }}>
          <OlavsCard elevation="level1">
            <div style={{ padding: olavsDesign.spacing[24] }}>
              <Building2 size={32} color={olavsDesign.colors.primary[500]} style={{ marginBottom: olavsDesign.spacing[16] }} />
              <h3 style={{
                fontSize: olavsDesign.typography.scale.bodyL.size,
                fontWeight: '600',
                color: olavsDesign.colors.neutral[900],
                marginBottom: olavsDesign.spacing[12],
              }}>
                Enterprise Ready
              </h3>
              <p style={{
                fontSize: olavsDesign.typography.scale.bodyS.size,
                color: olavsDesign.colors.neutral[600],
                lineHeight: '1.5',
              }}>
                Built for scale with robust security, compliance features, and multi-tenant architecture.
              </p>
            </div>
          </OlavsCard>

          <OlavsCard elevation="level1">
            <div style={{ padding: olavsDesign.spacing[24] }}>
              <Users size={32} color={olavsDesign.colors.primary[500]} style={{ marginBottom: olavsDesign.spacing[16] }} />
              <h3 style={{
                fontSize: olavsDesign.typography.scale.bodyL.size,
                fontWeight: '600',
                color: olavsDesign.colors.neutral[900],
                marginBottom: olavsDesign.spacing[12],
              }}>
                User-Centric
              </h3>
              <p style={{
                fontSize: olavsDesign.typography.scale.bodyS.size,
                color: olavsDesign.colors.neutral[600],
                lineHeight: '1.5',
              }}>
                Intuitive interfaces for applicants, bankers, verifiers, and underwriters.
              </p>
            </div>
          </OlavsCard>

          <OlavsCard elevation="level1">
            <div style={{ padding: olavsDesign.spacing[24] }}>
              <Award size={32} color={olavsDesign.colors.primary[500]} style={{ marginBottom: olavsDesign.spacing[16] }} />
              <h3 style={{
                fontSize: olavsDesign.typography.scale.bodyL.size,
                fontWeight: '600',
                color: olavsDesign.colors.neutral[900],
                marginBottom: olavsDesign.spacing[12],
              }}>
                Best Practices
              </h3>
              <p style={{
                fontSize: olavsDesign.typography.scale.bodyS.size,
                color: olavsDesign.colors.neutral[600],
                lineHeight: '1.5',
              }}>
                Industry-standard KYC/AML verification, risk assessment, and compliance workflows.
              </p>
            </div>
          </OlavsCard>
        </div>

        {/* CTA Section */}
        <div style={{ textAlign: 'center' }}>
          <OlavsButton
            variant="primary"
            size="lg"
            onClick={() => router.push('/register')}
          >
            Get Started Today
          </OlavsButton>
          <div style={{ marginTop: olavsDesign.spacing[16] }}>
            <OlavsButton
              variant="tertiary"
              onClick={() => router.push('/')}
            >
              Back to Home
            </OlavsButton>
          </div>
        </div>
      </OlavsContainer>
    </div>
  );
}
