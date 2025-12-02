'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { StaffDashboardLayout } from '@/layouts/StaffDashboardLayout';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, BarChart3, Eye } from 'lucide-react';

interface Application {
  id: number;
  requestedAmount: number;
  requestedTerm: number;
  purpose: string;
  status: string;
  productName?: string;
  createdAt: string;
}

export default function StaffDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  const staffType = params.staff_type as string;
  const staffId = params.staff_id as string;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/staff/login');
      return;
    }

    if (isAuthenticated && user) {
      loadApplications();
    }
  }, [isAuthenticated, isLoading, user, router]);

  const loadApplications = async () => {
    try {
      const data = await apiClient.get('/applications');
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load applications:', error);
      // Mock data for testing
      setApplications([
        { id: 1, requestedAmount: 5000, requestedTerm: 12, purpose: 'Home Improvement', status: 'SUBMITTED', productName: 'Personal Loan', createdAt: '2025-01-15' },
        { id: 2, requestedAmount: 25000, requestedTerm: 24, purpose: 'Business Expansion', status: 'UNDER_REVIEW', productName: 'Business Loan', createdAt: '2025-01-12' },
        { id: 3, requestedAmount: 10000, requestedTerm: 18, purpose: 'Education', status: 'UNDER_VERIFICATION', productName: 'Education Loan', createdAt: '2025-01-10' },
        { id: 4, requestedAmount: 15000, requestedTerm: 36, purpose: 'Debt Consolidation', status: 'RISK_ASSESSED', productName: 'Personal Loan', createdAt: '2025-01-08' },
        { id: 5, requestedAmount: 8000, requestedTerm: 12, purpose: 'Medical Expenses', status: 'APPROVED', productName: 'Personal Loan', createdAt: '2025-01-05' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const kanbanColumns = [
    { title: 'New', status: 'SUBMITTED', color: '#3b82f6', bgColor: '#eff6ff' },
    { title: 'Under Review', status: 'UNDER_REVIEW', color: '#8b5cf6', bgColor: '#f5f3ff' },
    { title: 'Verification', status: 'UNDER_VERIFICATION', color: '#f59e0b', bgColor: '#fffbeb' },
    { title: 'Risk Assessed', status: 'RISK_ASSESSED', color: '#10b981', bgColor: '#ecfdf5' },
    { title: 'Approved', status: 'APPROVED', color: '#22c55e', bgColor: '#f0fdf4' },
    { title: 'In Repayment', status: 'IN_REPAYMENT', color: '#06b6d4', bgColor: '#ecfeff' },
  ];

  const getApplicationsByStatus = (status: string) => {
    return applications.filter(app => app.status === status);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      SUBMITTED: { bg: '#eff6ff', text: '#3b82f6' },
      UNDER_REVIEW: { bg: '#f5f3ff', text: '#8b5cf6' },
      UNDER_VERIFICATION: { bg: '#fffbeb', text: '#f59e0b' },
      RISK_ASSESSED: { bg: '#ecfdf5', text: '#10b981' },
      APPROVED: { bg: '#f0fdf4', text: '#22c55e' },
      REJECTED: { bg: '#fef2f2', text: '#ef4444' },
      IN_REPAYMENT: { bg: '#ecfeff', text: '#06b6d4' },
    };
    return colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
  };

  const stats = [
    { label: 'Active Applications', value: applications.length, icon: FileText, color: '#3b82f6' },
    { label: 'Pending Review', value: applications.filter(a => ['SUBMITTED', 'UNDER_REVIEW'].includes(a.status)).length, icon: Clock, color: '#f59e0b' },
    { label: 'Approved', value: applications.filter(a => a.status === 'APPROVED').length, icon: CheckCircle, color: '#22c55e' },
    { label: 'Rejected', value: applications.filter(a => a.status === 'REJECTED').length, icon: XCircle, color: '#ef4444' },
  ];

  const getRoleTitle = () => {
    const titles: Record<string, string> = {
      banker: 'Banker',
      verifier: 'Verifier',
      underwriter: 'Underwriter',
    };
    return titles[staffType] || 'Staff';
  };

  return (
    <StaffDashboardLayout>
      <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
        {/* Header */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            padding: '24px',
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1e3a5f',
                    margin: 0,
                    marginBottom: '4px',
                  }}
                >
                  {getRoleTitle()} Dashboard
                </h1>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Loan Pipeline Overview
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setViewMode('kanban')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: viewMode === 'kanban' ? '#1e3a5f' : '#ffffff',
                    color: viewMode === 'kanban' ? '#ffffff' : '#6b7280',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <BarChart3 size={16} />
                  Kanban
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: viewMode === 'table' ? '#1e3a5f' : '#ffffff',
                    color: viewMode === 'table' ? '#ffffff' : '#6b7280',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <FileText size={16} />
                  Table
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                marginTop: '24px',
              }}
            >
              {stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      backgroundColor: '#ffffff',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: stat.color + '15',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconComponent size={20} color={stat.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{stat.label}</div>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: stat.color }}>
                          {loading ? '-' : stat.value}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
              Loading applications...
            </div>
          ) : viewMode === 'kanban' ? (
            // Kanban View
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
                overflowX: 'auto',
              }}
            >
              {kanbanColumns.map((column) => {
                const columnApps = getApplicationsByStatus(column.status);

                return (
                  <div
                    key={column.status}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '16px',
                      minHeight: '500px',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    {/* Column Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                        paddingBottom: '12px',
                        borderBottom: `2px solid ${column.color}`,
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          margin: 0,
                        }}
                      >
                        {column.title}
                      </h3>
                      <span
                        style={{
                          padding: '4px 10px',
                          backgroundColor: column.bgColor,
                          color: column.color,
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {columnApps.length}
                      </span>
                    </div>

                    {/* Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {columnApps.length === 0 ? (
                        <div
                          style={{
                            padding: '24px',
                            textAlign: 'center',
                            color: '#9ca3af',
                            fontSize: '13px',
                          }}
                        >
                          No applications
                        </div>
                      ) : (
                        columnApps.map((app) => (
                          <div
                            key={app.id}
                            onClick={() => router.push(`/staff/${staffType}/${staffId}/applications/${app.id}`)}
                            style={{
                              padding: '14px',
                              backgroundColor: '#f9fafb',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              border: '1px solid #e5e7eb',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <div
                              style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#6b7280',
                                marginBottom: '4px',
                              }}
                            >
                              APP-{String(app.id).padStart(6, '0')}
                            </div>
                            <div
                              style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                color: '#1e3a5f',
                                marginBottom: '8px',
                              }}
                            >
                              ${app.requestedAmount?.toLocaleString()}
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                color: '#6b7280',
                                marginBottom: '4px',
                              }}
                            >
                              {app.requestedTerm} months • {app.productName || 'Personal Loan'}
                            </div>
                            <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                              {new Date(app.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Table View
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    {['Application', 'Amount', 'Term', 'Status', 'Date', 'Action'].map((header) => (
                      <th
                        key={header}
                        style={{
                          padding: '14px 20px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => {
                    const statusColors = getStatusColor(app.status);
                    return (
                      <tr
                        key={app.id}
                        style={{
                          borderBottom: '1px solid #f3f4f6',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                        }}
                        onClick={() => router.push(`/staff/${staffType}/${staffId}/applications/${app.id}`)}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: '600', color: '#374151' }}>
                            APP-{String(app.id).padStart(6, '0')}
                          </div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>{app.purpose}</div>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111827' }}>
                          ${app.requestedAmount?.toLocaleString()}
                        </td>
                        <td style={{ padding: '16px 20px', color: '#6b7280' }}>{app.requestedTerm} months</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span
                            style={{
                              padding: '4px 12px',
                              backgroundColor: statusColors.bg,
                              color: statusColors.text,
                              borderRadius: '9999px',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            {app.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', color: '#6b7280', fontSize: '14px' }}>
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <button
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 12px',
                              backgroundColor: '#eff6ff',
                              color: '#3b82f6',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: '500',
                              cursor: 'pointer',
                            }}
                          >
                            <Eye size={14} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </StaffDashboardLayout>
  );
}
