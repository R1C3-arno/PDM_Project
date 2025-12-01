'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { olavsDesign } from '@/lib/olavs-design-system';
import { OlavsButton } from '@/components/OlavsButton';
import { OlavsCard } from '@/components/OlavsCard';
import { OlavsInput } from '@/components/OlavsInput';
import { OlavsContainer } from '@/components/OlavsContainer';
import { OlavsLogo } from '@/components/OlavsLogo';
import { AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.fullName, formData.phone);
      // Redirect will be handled by AuthContext
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const passwordStrength = formData.password.length >= 8 ? 'strong' : formData.password.length >= 6 ? 'medium' : 'weak';

  return (
    <div className="min-h-screen bg-surface-alt flex items-center justify-center py-2xl px-md font-sans">
      <OlavsContainer maxWidth="sm">
        <div className="max-w-[480px] mx-auto">
          {/* Logo and Header */}
          <div className="text-center mb-2xl">
            <div className="flex justify-center mb-lg">
              <OlavsLogo size="lg" showText={true} />
            </div>
            <h1 className="text-display-l font-extrabold text-neutral-900 mb-sm">
              Create Your Account
            </h1>
            <p className="text-body-m text-neutral-600 mt-sm">
              Start your loan application journey with OLAVS
            </p>
          </div>

          {/* Registration Card */}
          <OlavsCard elevation="level2">
            <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
              {error && (
                <div className="p-md bg-status-error/10 border border-status-error/30 rounded-md flex items-start gap-3">
                  <AlertCircle size={20} color={olavsDesign.colors.status.error} className="flex-shrink-0 mt-0.5" />
                  <p className="m-0 text-body-s text-status-error leading-normal">
                    {error}
                  </p>
                </div>
              )}

              <OlavsInput
                label="Full Name"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="John Doe"
                required
                fullWidth
              />

              <OlavsInput
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="john.doe@example.com"
                required
                fullWidth
                helperText="We'll use this for account verification"
              />

              <OlavsInput
                label="Phone Number (Optional)"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                fullWidth
              />

              <OlavsInput
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Create a strong password"
                required
                fullWidth
                helperText="Minimum 8 characters"
              />

              {formData.password && (
                <div className="-mt-3">
                  <div className="flex gap-1 mb-sm">
                    <div className={`flex-1 h-1 rounded-full ${
                      passwordStrength === 'weak' ? 'bg-status-error' :
                      passwordStrength === 'medium' ? 'bg-status-warning' :
                      'bg-status-success'
                    }`}></div>
                    <div className={`flex-1 h-1 rounded-full ${
                      passwordStrength === 'medium' || passwordStrength === 'strong' ?
                      (passwordStrength === 'medium' ? 'bg-status-warning' : 'bg-status-success') :
                      'bg-neutral-200'
                    }`}></div>
                    <div className={`flex-1 h-1 rounded-full ${
                      passwordStrength === 'strong' ? 'bg-status-success' : 'bg-neutral-200'
                    }`}></div>
                  </div>
                  <p className={`m-0 text-caption ${
                    passwordStrength === 'weak' ? 'text-status-error' :
                    passwordStrength === 'medium' ? 'text-status-warning' :
                    'text-status-success'
                  }`}>
                    Password strength: {passwordStrength === 'weak' ? 'Weak' : passwordStrength === 'medium' ? 'Medium' : 'Strong'}
                  </p>
                </div>
              )}

              <OlavsInput
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="Re-enter your password"
                required
                fullWidth
                error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
              />

              <div className="p-md bg-neutral-100 rounded-md text-body-s text-neutral-600 leading-relaxed">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-primary-500 no-underline font-medium hover:text-primary-600 transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-500 no-underline font-medium hover:text-primary-600 transition-colors">
                  Privacy Policy
                </a>
              </div>

              <OlavsButton
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </OlavsButton>
            </form>
          </OlavsCard>

          {/* Sign In Link */}
          <div className="mt-lg text-center p-[20px] bg-surface-default rounded-md border border-neutral-200">
            <p className="m-0 text-body-m text-neutral-600">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="bg-transparent border-0 text-primary-500 font-semibold cursor-pointer text-body-m p-0 no-underline hover:text-primary-600 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </OlavsContainer>
    </div>
  );
}
