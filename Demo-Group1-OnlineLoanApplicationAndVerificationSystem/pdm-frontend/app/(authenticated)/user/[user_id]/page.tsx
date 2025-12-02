'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { olavsDesign } from '@/lib/olavs-design-system';
import { OlavsButton } from '@/components/OlavsButton';
import { OlavsCard } from '@/components/OlavsCard';
import { OlavsInput } from '@/components/OlavsInput';
import { OlavsContainer } from '@/components/OlavsContainer';
import { OlavsGrid } from '@/components/OlavsGrid';
import { UserDashboardLayout } from '@/layouts/UserDashboardLayout';
import { Calendar, Shield, CheckCircle, Edit2, Save, X } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // API call to update profile would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  return (
    <UserDashboardLayout>
      <div style={{
        backgroundColor: olavsDesign.colors.surface.alt,
        minHeight: '100vh',
        fontFamily: olavsDesign.typography.font.primary,
      }}>
        <OlavsContainer>
          <div style={{ padding: `${olavsDesign.spacing[32]} 0` }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: olavsDesign.spacing[32],
              flexWrap: 'wrap',
              gap: olavsDesign.spacing[16],
            }}>
              <div>
                <h1 style={{
                  fontSize: olavsDesign.typography.scale.displayL.size,
                  fontWeight: olavsDesign.typography.scale.displayL.weight,
                  color: olavsDesign.colors.neutral[900],
                  margin: 0,
                  marginBottom: olavsDesign.spacing[8],
                }}>
                  Profile Settings
                </h1>
                <p style={{
                  fontSize: olavsDesign.typography.scale.bodyM.size,
                  color: olavsDesign.colors.neutral[600],
                  margin: 0,
                }}>
                  Manage your account information and preferences
                </p>
              </div>
            </div>

            <OlavsGrid cols={{ xs: 1, lg: 3 }} gap={24}>
              {/* Profile Card */}
              <div style={{ gridColumn: 'span 2' }}>
                <OlavsCard
                  title="Personal Information"
                  subtitle="Update your personal details"
                  action={
                    !isEditing ? (
                      <OlavsButton
                        variant="secondary"
                        size="sm"
                        icon={<Edit2 size={16} />}
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </OlavsButton>
                    ) : null
                  }
                  elevation="level1"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: olavsDesign.spacing[24] }}>
                    <OlavsInput
                      label="Full Name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      disabled={!isEditing}
                      fullWidth
                    />

                    <OlavsInput
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      fullWidth
                      helperText={!isEditing ? "Email cannot be changed" : ""}
                    />

                    <OlavsInput
                      label="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      fullWidth
                    />

                    {isEditing && (
                      <div style={{
                        display: 'flex',
                        gap: olavsDesign.spacing[12],
                        paddingTop: olavsDesign.spacing[16],
                        borderTop: `1px solid ${olavsDesign.colors.neutral[200]}`,
                      }}>
                        <OlavsButton
                          variant="primary"
                          onClick={handleSave}
                          loading={saving}
                          disabled={saving}
                          icon={<Save size={18} />}
                          style={{ flex: 1 }}
                        >
                          Save Changes
                        </OlavsButton>
                        <OlavsButton
                          variant="secondary"
                          onClick={handleCancel}
                          disabled={saving}
                          icon={<X size={18} />}
                        >
                          Cancel
                        </OlavsButton>
                      </div>
                    )}
                  </div>
                </OlavsCard>

                {/* Security Settings */}
                <OlavsCard
                  title="Security"
                  subtitle="Manage your password and authentication"
                  elevation="level1"
                  style={{ marginTop: olavsDesign.spacing[24] }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: olavsDesign.spacing[16] }}>
                    <div style={{
                      padding: olavsDesign.spacing[20],
                      backgroundColor: olavsDesign.colors.surface.alt,
                      borderRadius: olavsDesign.radius.md,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <div>
                        <p style={{
                          fontSize: olavsDesign.typography.scale.bodyM.size,
                          fontWeight: '600',
                          color: olavsDesign.colors.neutral[900],
                          margin: 0,
                          marginBottom: olavsDesign.spacing[4],
                        }}>
                          Password
                        </p>
                        <p style={{
                          fontSize: olavsDesign.typography.scale.bodyS.size,
                          color: olavsDesign.colors.neutral[600],
                          margin: 0,
                        }}>
                          Last changed 30 days ago
                        </p>
                      </div>
                      <OlavsButton variant="secondary" size="sm">
                        Change Password
                      </OlavsButton>
                    </div>

                    <div style={{
                      padding: olavsDesign.spacing[20],
                      backgroundColor: olavsDesign.colors.surface.alt,
                      borderRadius: olavsDesign.radius.md,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <div>
                        <p style={{
                          fontSize: olavsDesign.typography.scale.bodyM.size,
                          fontWeight: '600',
                          color: olavsDesign.colors.neutral[900],
                          margin: 0,
                          marginBottom: olavsDesign.spacing[4],
                        }}>
                          Two-Factor Authentication
                        </p>
                        <p style={{
                          fontSize: olavsDesign.typography.scale.bodyS.size,
                          color: olavsDesign.colors.neutral[600],
                          margin: 0,
                        }}>
                          Add an extra layer of security
                        </p>
                      </div>
                      <OlavsButton variant="secondary" size="sm">
                        Enable
                      </OlavsButton>
                    </div>
                  </div>
                </OlavsCard>
              </div>

              {/* Account Info Sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: olavsDesign.spacing[24] }}>
                <OlavsCard elevation="level1">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '96px',
                      height: '96px',
                      margin: '0 auto',
                      marginBottom: olavsDesign.spacing[16],
                      borderRadius: '50%',
                      backgroundColor: olavsDesign.colors.primary[100],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: olavsDesign.typography.scale.displayL.size,
                      fontWeight: olavsDesign.typography.scale.displayL.weight,
                      color: olavsDesign.colors.primary[500],
                    }}>
                      {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <h3 style={{
                      fontSize: olavsDesign.typography.scale.headingM.size,
                      fontWeight: olavsDesign.typography.scale.headingM.weight,
                      color: olavsDesign.colors.neutral[900],
                      margin: 0,
                      marginBottom: olavsDesign.spacing[4],
                    }}>
                      {user?.fullName || 'User'}
                    </h3>
                    <p style={{
                      fontSize: olavsDesign.typography.scale.bodyS.size,
                      color: olavsDesign.colors.neutral[600],
                      margin: 0,
                      marginBottom: olavsDesign.spacing[16],
                    }}>
                      {user?.email}
                    </p>
                    <div style={{
                      padding: `${olavsDesign.spacing[8]} ${olavsDesign.spacing[16]}`,
                      backgroundColor: olavsDesign.colors.primary[100],
                      color: olavsDesign.colors.primary[600],
                      borderRadius: olavsDesign.radius.full,
                      fontSize: olavsDesign.typography.scale.bodyS.size,
                      fontWeight: '600',
                      display: 'inline-block',
                    }}>
                      {user?.role || 'APPLICANT'}
                    </div>
                  </div>
                </OlavsCard>

                <OlavsCard elevation="level1" title="Account Status">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: olavsDesign.spacing[16] }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: olavsDesign.spacing[12] }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: olavsDesign.colors.status.success + '20',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <CheckCircle size={20} color={olavsDesign.colors.status.success} />
                      </div>
                      <div>
                        <p style={{
                          fontSize: olavsDesign.typography.scale.bodyS.size,
                          fontWeight: '600',
                          color: olavsDesign.colors.neutral[900],
                          margin: 0,
                        }}>
                          Email Verified
                        </p>
                        <p style={{
                          fontSize: olavsDesign.typography.scale.caption.size,
                          color: olavsDesign.colors.neutral[600],
                          margin: 0,
                        }}>
                          Your email is confirmed
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: olavsDesign.spacing[12] }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: olavsDesign.colors.status.success + '20',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Shield size={20} color={olavsDesign.colors.status.success} />
                      </div>
                      <div>
                        <p style={{
                          fontSize: olavsDesign.typography.scale.bodyS.size,
                          fontWeight: '600',
                          color: olavsDesign.colors.neutral[900],
                          margin: 0,
                        }}>
                          Account Active
                        </p>
                        <p style={{
                          fontSize: olavsDesign.typography.scale.caption.size,
                          color: olavsDesign.colors.neutral[600],
                          margin: 0,
                        }}>
                          All systems operational
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: olavsDesign.spacing[12] }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: olavsDesign.colors.primary[100],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Calendar size={20} color={olavsDesign.colors.primary[500]} />
                      </div>
                      <div>
                        <p style={{
                          fontSize: olavsDesign.typography.scale.bodyS.size,
                          fontWeight: '600',
                          color: olavsDesign.colors.neutral[900],
                          margin: 0,
                        }}>
                          Member Since
                        </p>
                        <p style={{
                          fontSize: olavsDesign.typography.scale.caption.size,
                          color: olavsDesign.colors.neutral[600],
                          margin: 0,
                        }}>
                          January 2025
                        </p>
                      </div>
                    </div>
                  </div>
                </OlavsCard>
              </div>
            </OlavsGrid>
          </div>
        </OlavsContainer>
      </div>
    </UserDashboardLayout>
  );
}
