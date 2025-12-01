'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Search, CheckCircle, BarChart3, DollarSign, Lock } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export default function StaffLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect function based on role
  const getStaffRedirectUrl = (userObj: { id: number; role: string }) => {
    if (userObj.role === 'ADMIN') {
      return `/admin/system/${userObj.id}`;
    }
    const staffType = userObj.role.toLowerCase();
    return `/staff/${staffType}/${userObj.id}`;
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'APPLICANT') {
        router.push(`/user/${user.id}/dashboard`);
      } else {
        router.push(getStaffRedirectUrl(user));
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      toast.success('Login successful! Redirecting...');

      setTimeout(() => {
        if (loggedInUser.role === 'APPLICANT') {
          router.push(`/user/${loggedInUser.id}/dashboard`);
        } else {
          router.push(getStaffRedirectUrl(loggedInUser));
        }
      }, 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
      toast.error('Login failed');
      setLoading(false);
    }
  };

  const features = [
    { icon: Search, text: 'Application Review & Processing' },
    { icon: CheckCircle, text: 'KYC/AML Verification' },
    { icon: BarChart3, text: 'Risk Assessment Dashboard' },
    { icon: DollarSign, text: 'Offer Generation & Management' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left: Brand Panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px',
          color: 'white',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <Image src="/logo.png" alt="OLAVS Logo" width={48} height={48} style={{ borderRadius: '8px' }} />
          <span style={{ fontSize: '28px', fontWeight: '700' }}>OLAVS</span>
        </div>

        <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px', lineHeight: 1.2 }}>
          Staff Portal
        </h1>

        <p style={{ fontSize: '18px', opacity: 0.9, lineHeight: 1.6, marginBottom: '32px', maxWidth: '480px' }}>
          Access your loan management dashboard to review applications, verify documents, and manage the entire loan lifecycle.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <IconComponent size={24} strokeWidth={2} />
                <span style={{ fontSize: '15px', opacity: 0.9 }}>{feature.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Login Form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          padding: '48px',
        }}
      >
        <div style={{ maxWidth: '450px', width: '100%' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1e3a5f', marginBottom: '8px' }}>
            Welcome Back
          </h2>

          <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '32px' }}>
            Sign in to access your staff dashboard
          </p>

          {error && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#dc2626',
                marginBottom: '24px',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px',
                }}
              >
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@olavs.com"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#1e3a5f')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px',
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#1e3a5f')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: loading ? '#94a3b8' : '#1e3a5f',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#0f172a')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1e3a5f')}
            >
              {loading ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            <span style={{ fontSize: '13px', color: '#9ca3af' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
          </div>

          {/* Applicant Portal Link */}
          <button
            onClick={() => router.push('/login')}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#f9fafb',
              color: '#374151',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1e3a5f';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
          >
            Go to Applicant Portal
          </button>

          {/* Demo Credentials */}
          <div
            style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              border: '1px solid #bae6fd',
            }}
          >
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#0369a1', margin: 0, marginBottom: '8px' }}>
              Demo Staff Credentials
            </p>
            <div style={{ fontSize: '13px', color: '#0c4a6e', lineHeight: 1.6 }}>
              <p style={{ margin: '4px 0' }}><strong>Banker:</strong> banker@olavs.com</p>
              <p style={{ margin: '4px 0' }}><strong>Admin:</strong> admin@olavs.com</p>
              <p style={{ margin: '4px 0' }}><strong>Password:</strong> TestPassword@123</p>
            </div>
          </div>

          {/* Footer Note */}
          <div
            style={{
              marginTop: '24px',
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Lock size={16} color="#6b7280" />
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              This portal is for authorized staff only.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
