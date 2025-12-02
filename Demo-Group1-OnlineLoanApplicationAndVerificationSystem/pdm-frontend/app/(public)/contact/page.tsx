'use client';

import { useState } from 'react';
import { OlavsContainer } from '@/components/OlavsContainer';
import { OlavsCard } from '@/components/OlavsCard';
import { OlavsButton } from '@/components/OlavsButton';
import { OlavsInput } from '@/components/OlavsInput';
import { olavsDesign } from '@/lib/olavs-design-system';
import { useRouter } from 'next/navigation';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

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
            Get in Touch
          </h1>
          <p style={{
            fontSize: olavsDesign.typography.scale.bodyL.size,
            color: olavsDesign.colors.neutral[600],
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: olavsDesign.spacing[32],
          marginBottom: olavsDesign.spacing[48],
        }}>
          {/* Contact Form */}
          <div>
            <OlavsCard elevation="level2">
              <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: olavsDesign.spacing[24],
              }}>
                <h2 style={{
                  fontSize: olavsDesign.typography.scale.headingM.size,
                  fontWeight: '600',
                  color: olavsDesign.colors.neutral[900],
                  marginBottom: olavsDesign.spacing[8],
                }}>
                  Send us a Message
                </h2>

                {submitted && (
                  <div style={{
                    padding: olavsDesign.spacing[16],
                    backgroundColor: olavsDesign.colors.status.success + '20',
                    border: `1px solid ${olavsDesign.colors.status.success}`,
                    borderRadius: olavsDesign.radius.md,
                    color: olavsDesign.colors.status.success,
                  }}>
                    ✓ Message sent successfully! We&apos;ll get back to you soon.
                  </div>
                )}

                <OlavsInput
                  label="Your Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  fullWidth
                />

                <OlavsInput
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                  fullWidth
                />

                <OlavsInput
                  label="Subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="How can we help?"
                  required
                  fullWidth
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: olavsDesign.spacing[8], width: '100%' }}>
                  <label style={{
                    fontSize: olavsDesign.typography.scale.bodyS.size,
                    fontWeight: '500',
                    color: olavsDesign.colors.neutral[700],
                  }}>
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more about your inquiry..."
                    required
                    rows={6}
                    style={{
                      padding: `${olavsDesign.spacing[12]} ${olavsDesign.spacing[16]}`,
                      borderRadius: olavsDesign.radius.md,
                      border: `1px solid ${olavsDesign.colors.neutral[300]}`,
                      fontFamily: olavsDesign.typography.font.primary,
                      fontSize: olavsDesign.typography.scale.bodyM.size,
                      color: olavsDesign.colors.neutral[900],
                      outline: 'none',
                      resize: 'vertical',
                      width: '100%',
                    }}
                  />
                </div>

                <OlavsButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={<Send size={20} />}
                  style={{ width: '100%' }}
                >
                  Send Message
                </OlavsButton>
              </form>
            </OlavsCard>
          </div>

          {/* Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: olavsDesign.spacing[24] }}>
            <OlavsCard elevation="level1">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: olavsDesign.spacing[16] }}>
                <div style={{
                  padding: olavsDesign.spacing[12],
                  backgroundColor: olavsDesign.colors.primary[100],
                  borderRadius: olavsDesign.radius.md,
                }}>
                  <Mail size={24} color={olavsDesign.colors.primary[600]} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: olavsDesign.typography.scale.bodyL.size,
                    fontWeight: '600',
                    color: olavsDesign.colors.neutral[900],
                    marginBottom: olavsDesign.spacing[8],
                  }}>
                    Email Us
                  </h3>
                  <p style={{
                    fontSize: olavsDesign.typography.scale.bodyM.size,
                    color: olavsDesign.colors.neutral[700],
                    margin: 0,
                  }}>
                    support@pdm-loans.com
                  </p>
                </div>
              </div>
            </OlavsCard>

            <OlavsCard elevation="level1">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: olavsDesign.spacing[16] }}>
                <div style={{
                  padding: olavsDesign.spacing[12],
                  backgroundColor: olavsDesign.colors.primary[100],
                  borderRadius: olavsDesign.radius.md,
                }}>
                  <Phone size={24} color={olavsDesign.colors.primary[600]} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: olavsDesign.typography.scale.bodyL.size,
                    fontWeight: '600',
                    color: olavsDesign.colors.neutral[900],
                    marginBottom: olavsDesign.spacing[8],
                  }}>
                    Call Us
                  </h3>
                  <p style={{
                    fontSize: olavsDesign.typography.scale.bodyM.size,
                    color: olavsDesign.colors.neutral[700],
                    margin: 0,
                  }}>
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </OlavsCard>

            <OlavsCard elevation="level1">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: olavsDesign.spacing[16] }}>
                <div style={{
                  padding: olavsDesign.spacing[12],
                  backgroundColor: olavsDesign.colors.primary[100],
                  borderRadius: olavsDesign.radius.md,
                }}>
                  <MapPin size={24} color={olavsDesign.colors.primary[600]} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: olavsDesign.typography.scale.bodyL.size,
                    fontWeight: '600',
                    color: olavsDesign.colors.neutral[900],
                    marginBottom: olavsDesign.spacing[8],
                  }}>
                    Visit Us
                  </h3>
                  <p style={{
                    fontSize: olavsDesign.typography.scale.bodyM.size,
                    color: olavsDesign.colors.neutral[700],
                    margin: 0,
                    lineHeight: '1.5',
                  }}>
                    123 Finance Street<br />
                    Ho Chi Minh City, Vietnam
                  </p>
                </div>
              </div>
            </OlavsCard>
          </div>
        </div>

        {/* Back to Home */}
        <div style={{ textAlign: 'center' }}>
          <OlavsButton
            variant="tertiary"
            onClick={() => router.push('/')}
          >
            Back to Home
          </OlavsButton>
        </div>
      </OlavsContainer>
    </div>
  );
}
