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
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      toast.success('Login successful! Redirecting...');
      // Small delay to ensure state is updated before redirect
      setTimeout(() => {
        router.push(`/user/${user.id}/dashboard`);
      }, 100);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid email or password';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-alt flex items-center justify-center p-md font-sans">
      <OlavsContainer maxWidth="sm">
        <div className="max-w-[480px] mx-auto">
          {/* Logo and Header */}
          <div className="text-center mb-2xl">
            <div className="flex justify-center mb-lg">
              <OlavsLogo size="lg" showText={true} />
            </div>
            <h1 className="text-h5 font-extrabold text-neutral-900 mb-sm">
              Welcome Back
            </h1>
            <p className="text-body-m text-neutral-600 mt-sm">
              Sign in to your OLAVS account
            </p>
          </div>

          {/* Login Card */}
          <OlavsCard elevation="level2">
            <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
              {error && (
                <div className="p-md bg-status-error/10 border border-status-error/30 rounded-md flex items-start gap-3">
                  <AlertCircle size={20} color={olavsDesign.colors.status.error} className="flex-shrink-0 mt-0.5" />
                  <p className="m-0 text-body-s text-status-error leading-normal">
                    {error}
                  </p>
                </div>
              )}

              <OlavsInput
                label="Email Address"
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="applicant@example.com"
                required
                fullWidth
              />

              <OlavsInput
                label="Password"
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                fullWidth
              />

              <div className="flex justify-end">
                <a href="#" className="text-body-s text-primary-500 no-underline font-medium hover:text-primary-600 transition-colors">
                  Forgot password?
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
                {loading ? 'Signing in...' : 'Sign In'}
              </OlavsButton>
            </form>
          </OlavsCard>

          {/* Sign Up Link */}
          <div className="mt-lg text-center p-[20px] bg-surface-default rounded-md border border-neutral-200">
            <p className="m-0 text-body-m text-neutral-600">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => router.push('/register')}
                className="bg-transparent border-0 text-primary-500 font-semibold cursor-pointer text-body-m p-0 no-underline hover:text-primary-600 transition-colors"
              >
                Sign up for free
              </button>
            </p>
          </div>

          {/* Staff Login Link */}
          <div className="mt-md text-center">
            <button
              onClick={() => router.push('/staff/login')}
              className="bg-transparent border-0 text-neutral-700 text-body-s cursor-pointer p-sm underline hover:text-neutral-900 transition-colors"
            >
              Staff Login
            </button>
          </div>

          {/* Demo Credentials */}
          <OlavsCard elevation="level1" className="mt-2xl bg-primary-100">
            <div className="text-center">
              <p className="m-0 mb-3 text-body-s font-semibold text-primary-700">
                Demo Credentials
              </p>
              <p className="m-0 text-body-s text-primary-600 leading-relaxed">
                Email: <strong>test@test.com</strong>
                <br />
                Password: <strong>TestPassword@123</strong>
              </p>
            </div>
          </OlavsCard>
        </div>
      </OlavsContainer>
    </div>
  );
}
