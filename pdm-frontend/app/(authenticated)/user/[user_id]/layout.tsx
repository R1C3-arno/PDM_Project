'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UserLayoutProps {
  children: ReactNode;
}

/**
 * User (APPLICANT) layout - auth guard only
 * Pages handle their own layout via UserDashboardLayout
 */
export default function UserLayout({ children }: UserLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params.user_id as string;

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push('/login');
      return;
    }

    // Verify user is APPLICANT
    if (user && user.role !== 'APPLICANT') {
      if (['BANKER', 'VERIFIER', 'UNDERWRITER'].includes(user.role)) {
        const staffType = user.role.toLowerCase();
        router.push(`/staff/${staffType}/${user.id}`);
      } else if (user.role === 'ADMIN') {
        router.push(`/admin/system/${user.id}`);
      } else {
        router.push('/login');
      }
      return;
    }

    // Verify user can only access their own resources
    if (user && userId && String(user.id) !== String(userId)) {
      router.push(`/user/${user.id}/dashboard`);
    }
  }, [isLoading, isAuthenticated, user, userId, router]);

  if (isLoading || !isAuthenticated || !user || user.role !== 'APPLICANT') {
    return null;
  }

  return <>{children}</>;
}
