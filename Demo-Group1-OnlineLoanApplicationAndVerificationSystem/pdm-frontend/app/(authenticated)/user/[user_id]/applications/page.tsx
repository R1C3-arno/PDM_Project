'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { UserDashboardLayout } from '@/layouts/UserDashboardLayout';
import { Plus, FileText, Search, Filter } from 'lucide-react';

interface Application {
  id: number;
  amount?: number;
  requestedAmount?: number;
  purpose: string;
  status: string;
  createdAt: string;
  requestedTerm?: number;
  requestedTermMonths?: number; // Backend uses this field name
}

export default function ApplicationsListPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await apiClient.get<Application[]>('/applications');
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'UNDER_REVIEW', label: 'Under Review' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'DISBURSED', label: 'Disbursed' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  return (
    <UserDashboardLayout>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#111827',
                margin: 0,
                marginBottom: '4px',
              }}
            >
              My Applications
            </h1>
            <p
              style={{
                fontSize: '15px',
                color: '#6b7280',
                margin: 0,
              }}
            >
              View and manage your loan applications
            </p>
          </div>
          <button
            onClick={() => router.push(`/user/${user?.id}/applications/new`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }}
          >
            <Plus size={18} />
            New Application
          </button>
        </div>

        {/* Filters */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '400px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
              }}
            />
            <input
              type="text"
              placeholder="Search by ID or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer',
              minWidth: '150px',
            }}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Applications Table */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
              Loading applications...
            </div>
          ) : filteredApplications.length === 0 ? (
            <div
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: '#6b7280',
              }}
            >
              <FileText size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
              <p style={{ margin: 0, marginBottom: '8px', fontWeight: '500' }}>
                {searchTerm || statusFilter !== 'all' ? 'No matching applications' : 'No applications yet'}
              </p>
              <p style={{ margin: 0, fontSize: '14px' }}>
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start by creating your first loan application'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th style={tableHeaderStyle}>ID</th>
                    <th style={tableHeaderStyle}>Purpose</th>
                    <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Amount</th>
                    <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Term</th>
                    <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Status</th>
                    <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      style={{
                        borderTop: '1px solid #e5e7eb',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                      onClick={() => router.push(`/user/${user?.id}/applications/${app.id}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td style={tableCellStyle}>
                        <span style={{ fontWeight: '500', color: '#3b82f6' }}>#{app.id}</span>
                      </td>
                      <td style={tableCellStyle}>
                        <span style={{ fontWeight: '500', color: '#111827' }}>{app.purpose}</span>
                      </td>
                      <td style={{ ...tableCellStyle, textAlign: 'right', fontWeight: '600' }}>
                        ${(app.requestedAmount || app.amount || 0).toLocaleString()}
                      </td>
                      <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                        {(app.requestedTermMonths || app.requestedTerm) ? `${app.requestedTermMonths || app.requestedTerm} mo` : '-'}
                      </td>
                      <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                        <StatusBadge status={app.status} />
                      </td>
                      <td style={{ ...tableCellStyle, textAlign: 'right', color: '#6b7280' }}>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {!loading && filteredApplications.length > 0 && (
          <div style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
            Showing {filteredApplications.length} of {applications.length} applications
          </div>
        )}
      </div>
    </UserDashboardLayout>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  padding: '12px 20px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: '600',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tableCellStyle: React.CSSProperties = {
  padding: '16px 20px',
  fontSize: '14px',
};

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    SUBMITTED: { bg: '#fef3c7', text: '#92400e', label: 'Submitted' },
    UNDER_REVIEW: { bg: '#dbeafe', text: '#1e40af', label: 'Under Review' },
    VERIFICATION_IN_PROGRESS: { bg: '#e0e7ff', text: '#3730a3', label: 'Verifying' },
    APPROVED: { bg: '#dcfce7', text: '#166534', label: 'Approved' },
    REJECTED: { bg: '#fee2e2', text: '#991b1b', label: 'Rejected' },
    DISBURSED: { bg: '#d1fae5', text: '#065f46', label: 'Disbursed' },
    ACTIVE: { bg: '#dcfce7', text: '#166534', label: 'Active' },
    COMPLETED: { bg: '#f3f4f6', text: '#374151', label: 'Completed' },
  };

  const config = statusConfig[status] || { bg: '#f3f4f6', text: '#374151', label: status };

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '9999px',
        backgroundColor: config.bg,
        color: config.text,
        fontSize: '12px',
        fontWeight: '600',
      }}
    >
      {config.label}
    </span>
  );
}
