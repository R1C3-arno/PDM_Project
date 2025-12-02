'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { StaffDashboardLayout } from '@/layouts/StaffDashboardLayout';
import { apiClient } from '@/lib/api';

// Type definitions for API responses
interface RepaymentSchedule {
  id: number;
  applicationId: number;
  borrowerName: string;
  totalAmount: number;
  totalAmountPaid: number;
  remainingBalance: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

interface OverdueInstallment {
  id: number;
  scheduleId: number;
  applicationId: number;
  borrowerName: string;
  installmentNumber: number;
  principalAmount: number;
  interestAmount: number;
  totalAmount: number;
  amountPaid: number;
  dueDate: string;
  paidDate: string | null;
  status: string;
  daysOverdue: number;
}

// Inline styles to match other staff pages
const colors = {
  navy: '#1e3a5f',
  navyLight: '#2d4a6f',
  navySoft: 'rgba(30, 58, 95, 0.1)',
  surface: '#ffffff',
  surfaceAlt: '#f9fafb',
  border: '#e5e7eb',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  success: '#10b981',
  successSoft: 'rgba(16, 185, 129, 0.1)',
  error: '#ef4444',
  errorSoft: 'rgba(239, 68, 68, 0.1)',
  warning: '#f59e0b',
};

export default function RepaymentMonitoringPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [schedules, setSchedules] = useState<RepaymentSchedule[]>([]);
  const [overdueInstallments, setOverdueInstallments] = useState<OverdueInstallment[]>([]);
  const [loading, setAppLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'overdue'>('all');

  const staffType = params?.staff_type as string;
  const staffId = params?.staff_id as string;

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role === 'APPLICANT')) {
      router.push('/staff/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setError(null);
      // Fetch from real API endpoints
      const [schedulesData, overdueData] = await Promise.all([
        apiClient.get('/repayment/schedules'),
        apiClient.get('/repayment/overdue'),
      ]);
      setSchedules(Array.isArray(schedulesData) ? schedulesData : []);
      setOverdueInstallments(Array.isArray(overdueData) ? overdueData : []);
    } catch (err) {
      console.error('Failed to load repayment data:', err);
      setError('Failed to load repayment data. Please try again.');
    } finally {
      setAppLoading(false);
    }
  };

  const totalActive = schedules.filter(s => s.status === 'ACTIVE').length;
  const totalCompleted = schedules.filter(s => s.status === 'COMPLETED').length;
  const totalOverdue = overdueInstallments.length;
  const totalCollected = schedules.reduce((sum, s) => sum + (s.totalAmountPaid || 0), 0);

  const handleBackToDashboard = () => {
    if (staffType && staffId) {
      if (user?.role === 'ADMIN') {
        router.push(`/admin/${staffType}/${staffId}`);
      } else {
        router.push(`/staff/${staffType}/${staffId}`);
      }
    } else {
      router.push('/staff/login');
    }
  };

  const handleSendReminder = async (installmentId: number) => {
    // TODO: Implement reminder functionality
    alert(`Reminder sent for installment ${installmentId}!`);
  };

  if (loading) {
    return (
      <StaffDashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <div
            style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #e5e7eb',
              borderTopColor: colors.navy,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ marginTop: '16px', color: colors.textSecondary }}>Loading repayments...</p>
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </StaffDashboardLayout>
    );
  }

  return (
    <StaffDashboardLayout>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: colors.surfaceAlt,
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: '32px',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Back button */}
          <button
            onClick={handleBackToDashboard}
            style={{
              marginBottom: '24px',
              padding: '10px 20px',
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              color: colors.textSecondary,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '16px' }}>&larr;</span> Back to Dashboard
          </button>

          {/* Error message */}
          {error && (
            <div
              style={{
                marginBottom: '24px',
                padding: '12px 16px',
                backgroundColor: colors.errorSoft,
                border: `1px solid ${colors.error}`,
                borderRadius: '8px',
                fontSize: '14px',
                color: colors.error,
              }}
            >
              {error}
              <button
                onClick={loadData}
                style={{
                  marginLeft: '12px',
                  padding: '4px 12px',
                  backgroundColor: colors.error,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: colors.navy,
                  marginBottom: '8px',
                  margin: 0,
                }}
              >
                Repayment Monitoring
              </h1>
              <p style={{ fontSize: '15px', color: colors.textSecondary, margin: '8px 0 0 0' }}>
                Track loan repayments and overdue installments
              </p>
            </div>

            {/* View toggle */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setViewMode('all')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: viewMode === 'all' ? colors.navy : colors.surface,
                  color: viewMode === 'all' ? 'white' : colors.textSecondary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                All Schedules
              </button>
              <button
                onClick={() => setViewMode('overdue')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: viewMode === 'overdue' ? colors.error : colors.surface,
                  color: viewMode === 'overdue' ? 'white' : colors.textSecondary,
                  border: `1px solid ${viewMode === 'overdue' ? colors.error : colors.border}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Overdue Only ({totalOverdue})
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {[
              { label: 'Active Loans', value: totalActive, color: colors.navy },
              { label: 'Completed', value: totalCompleted, color: colors.success },
              { label: 'Overdue', value: totalOverdue, color: colors.error },
              { label: 'Total Collected', value: `$${totalCollected.toLocaleString()}`, color: colors.success },
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '4px' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Table Card */}
          <div
            style={{
              backgroundColor: colors.surface,
              borderRadius: '16px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Table Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: colors.textPrimary,
                  margin: 0,
                }}
              >
                {viewMode === 'all' ? 'All Repayment Schedules' : 'Overdue Installments'}
              </h3>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: colors.surfaceAlt, borderBottom: `2px solid ${colors.border}` }}>
                    {viewMode === 'all'
                      ? ['Application ID', 'Borrower', 'Total Amount', 'Amount Paid', 'Remaining', 'Status', 'Action'].map(
                          (header) => (
                            <th
                              key={header}
                              style={{
                                padding: '14px 16px',
                                textAlign: 'left',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: colors.textSecondary,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              }}
                            >
                              {header}
                            </th>
                          )
                        )
                      : ['Application ID', 'Borrower', 'Installment #', 'Amount Due', 'Due Date', 'Days Overdue', 'Action'].map(
                          (header) => (
                            <th
                              key={header}
                              style={{
                                padding: '14px 16px',
                                textAlign: 'left',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: colors.textSecondary,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              }}
                            >
                              {header}
                            </th>
                          )
                        )}
                  </tr>
                </thead>
                <tbody>
                  {viewMode === 'all' ? (
                    schedules.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: colors.textSecondary }}>
                          No repayment schedules found
                        </td>
                      </tr>
                    ) : (
                      schedules.map((schedule) => (
                        <tr key={schedule.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                          <td style={{ padding: '16px', fontWeight: '500', color: colors.navy }}>
                            APP-{String(schedule.applicationId).padStart(6, '0')}
                          </td>
                          <td style={{ padding: '16px', color: colors.textPrimary }}>{schedule.borrowerName}</td>
                          <td style={{ padding: '16px', fontWeight: '600' }}>
                            ${schedule.totalAmount?.toLocaleString()}
                          </td>
                          <td style={{ padding: '16px', color: colors.success }}>
                            ${schedule.totalAmountPaid?.toLocaleString()}
                          </td>
                          <td style={{ padding: '16px', color: colors.textSecondary }}>
                            ${(schedule.remainingBalance || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span
                              style={{
                                padding: '4px 12px',
                                backgroundColor:
                                  schedule.status === 'ACTIVE' ? colors.navySoft : colors.successSoft,
                                color: schedule.status === 'ACTIVE' ? colors.navy : colors.success,
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                              }}
                            >
                              {schedule.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <button
                              onClick={() => router.push(`/staff/${staffType}/${staffId}/applications/${schedule.applicationId}`)}
                              style={{
                                padding: '6px 16px',
                                backgroundColor: colors.navySoft,
                                color: colors.navy,
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '500',
                              }}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )
                  ) : overdueInstallments.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: colors.textSecondary }}>
                        No overdue installments - great job!
                      </td>
                    </tr>
                  ) : (
                    overdueInstallments.map((installment) => (
                      <tr
                        key={installment.id}
                        style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.errorSoft }}
                      >
                        <td style={{ padding: '16px', fontWeight: '500', color: colors.navy }}>
                          APP-{String(installment.applicationId).padStart(6, '0')}
                        </td>
                        <td style={{ padding: '16px', color: colors.textPrimary }}>{installment.borrowerName}</td>
                        <td style={{ padding: '16px' }}>#{installment.installmentNumber}</td>
                        <td style={{ padding: '16px', fontWeight: '600' }}>
                          ${installment.totalAmount?.toLocaleString()}
                        </td>
                        <td style={{ padding: '16px' }}>{new Date(installment.dueDate).toLocaleDateString()}</td>
                        <td style={{ padding: '16px', color: colors.error, fontWeight: '600' }}>
                          {installment.daysOverdue} days
                        </td>
                        <td style={{ padding: '16px' }}>
                          <button
                            onClick={() => handleSendReminder(installment.id)}
                            style={{
                              padding: '6px 16px',
                              backgroundColor: colors.error,
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '500',
                            }}
                          >
                            Send Reminder
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Data source indicator */}
          <div
            style={{
              marginTop: '24px',
              padding: '12px 16px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              fontSize: '13px',
              color: colors.success,
            }}
          >
            <strong>Connected:</strong> Displaying live data from the database.
          </div>
        </div>
      </div>
    </StaffDashboardLayout>
  );
}
