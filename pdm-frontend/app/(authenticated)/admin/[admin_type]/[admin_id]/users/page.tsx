"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { StaffDashboardLayout } from "@/layouts/StaffDashboardLayout";
import { apiClient } from "@/lib/api";
import { Users, UserCheck, Clock, Ban, Search, Filter, Download, Edit2, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";

interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  status: string;
  createdAt: string;
}

// Teal color scheme matching reference
const colors = {
  primary: '#00BFA5',
  primaryHover: '#00A896',
  primaryLight: 'rgba(0, 191, 165, 0.1)',
  blue: '#3b82f6',
  blueLight: 'rgba(59, 130, 246, 0.1)',
  green: '#22c55e',
  greenLight: 'rgba(34, 197, 94, 0.1)',
  orange: '#f59e0b',
  orangeLight: 'rgba(245, 158, 11, 0.1)',
  red: '#ef4444',
  redLight: 'rgba(239, 68, 68, 0.1)',
  gray: '#6b7280',
  grayLight: '#f3f4f6',
  border: '#e5e7eb',
  surface: '#ffffff',
  background: '#f5f5f5',
  text: '#111827',
  textSecondary: '#6b7280',
};

// Generate consistent avatar color from name
const getAvatarColor = (name: string) => {
  const colors = ['#00BFA5', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default function UsersPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/staff/login");
      return;
    }

    if (user && user.role !== "ADMIN") {
      router.push("/staff/login");
      return;
    }

    if (isAuthenticated && user) {
      fetchUsers();
    }
  }, [user, isAuthenticated, isLoading, router]);

  const fetchUsers = async () => {
    try {
      const usersData = await apiClient.get('/users');
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([
        { id: 1, email: 'test@test.com', fullName: 'Test User', phone: '0123456789', role: 'APPLICANT', status: 'ACTIVE', createdAt: '2025-01-15' },
        { id: 2, email: 'admin@olavs.com', fullName: 'System Administrator', phone: '0901234567', role: 'ADMIN', status: 'ACTIVE', createdAt: '2025-01-01' },
        { id: 3, email: 'banker@olavs.com', fullName: 'Nguyen Van Banker', phone: '0912345678', role: 'BANKER', status: 'ACTIVE', createdAt: '2025-02-20' },
        { id: 4, email: 'verifier@olavs.com', fullName: 'Le Van Verifier', phone: '0934567890', role: 'VERIFIER', status: 'PENDING', createdAt: '2025-03-10' },
        { id: 5, email: 'underwriter@olavs.com', fullName: 'Hoang Van Risk', phone: '0956789012', role: 'UNDERWRITER', status: 'BLOCKED', createdAt: '2025-04-05' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (userId: number, newStatus: string) => {
    try {
      await apiClient.put(`/users/${userId}`, { status: newStatus });
      setUsers(users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    } catch (error) {
      console.error("Error updating user:", error);
      setUsers(users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    }
  };

  const handleUpdateRole = async (userId: number, newRole: string) => {
    try {
      await apiClient.put(`/users/${userId}`, { role: newRole });
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (error) {
      console.error("Error updating user:", error);
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    }
  };

  const toggleSelectUser = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: colors.blue, bgColor: colors.blueLight },
    { label: 'Active Users', value: users.filter(u => u.status === 'ACTIVE').length, icon: UserCheck, color: colors.green, bgColor: colors.greenLight },
    { label: 'Pending', value: users.filter(u => u.status === 'PENDING').length, icon: Clock, color: colors.orange, bgColor: colors.orangeLight },
    { label: 'Blocked', value: users.filter(u => u.status === 'BLOCKED').length, icon: Ban, color: colors.red, bgColor: colors.redLight },
  ];

  const getRoleBadge = (role: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      ADMIN: { bg: colors.blueLight, text: colors.blue, label: 'Admin' },
      BANKER: { bg: colors.primaryLight, text: colors.primary, label: 'Manager' },
      VERIFIER: { bg: colors.orangeLight, text: colors.orange, label: 'Verifier' },
      UNDERWRITER: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6', label: 'Underwriter' },
      APPLICANT: { bg: colors.grayLight, text: colors.gray, label: 'User' },
    };
    return styles[role] || { bg: colors.grayLight, text: colors.gray, label: role };
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      ACTIVE: { bg: colors.greenLight, text: colors.green, label: 'Active' },
      PENDING: { bg: colors.orangeLight, text: colors.orange, label: 'Pending' },
      BLOCKED: { bg: colors.redLight, text: colors.red, label: 'Blocked' },
      INACTIVE: { bg: colors.grayLight, text: colors.gray, label: 'Inactive' },
    };
    return styles[status] || { bg: colors.grayLight, text: colors.gray, label: status };
  };

  return (
    <StaffDashboardLayout>
      <div style={{
        backgroundColor: colors.background,
        minHeight: '100vh',
        padding: '32px',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: colors.text,
                margin: 0,
                marginBottom: '8px'
              }}>
                User Management
              </h1>
              <p style={{ fontSize: '15px', color: colors.textSecondary, margin: 0 }}>
                Manage your team members and their roles
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '240px',
                    padding: '10px 12px 10px 40px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: colors.surface,
                  }}
                />
              </div>
              <button
                onClick={() => alert('Add User modal would open here')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  backgroundColor: colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
              >
                <Plus size={18} />
                Add User
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            {stats.map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: '16px',
                    border: `1px solid ${colors.border}`,
                    padding: '24px',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: stat.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <IconComponent size={24} color={stat.color} />
                  </div>
                  <p style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: colors.text,
                    margin: 0,
                    marginBottom: '4px',
                  }}>
                    {loading ? '-' : stat.value.toLocaleString()}
                  </p>
                  <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Users Table Card */}
          <div
            style={{
              backgroundColor: colors.surface,
              borderRadius: '16px',
              border: `1px solid ${colors.border}`,
              overflow: 'hidden',
            }}
          >
            {/* Table Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: `1px solid ${colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: colors.text,
                margin: 0
              }}>
                All Users
              </h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: colors.surface,
                    color: colors.textSecondary,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  <Filter size={16} />
                  Filter
                </button>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: colors.surface,
                    color: colors.textSecondary,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div style={{ padding: '48px', textAlign: 'center', color: colors.textSecondary }}>
                <div style={{
                  display: 'inline-block',
                  width: '40px',
                  height: '40px',
                  border: `4px solid ${colors.border}`,
                  borderTopColor: colors.primary,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }} />
                <p style={{ marginTop: '16px' }}>Loading users...</p>
              </div>
            ) : paginatedUsers.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: colors.textSecondary }}>
                No users found
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: colors.grayLight, borderBottom: `2px solid ${colors.border}` }}>
                      <th style={{ ...tableHeaderStyle, width: '48px' }}>
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                          onChange={toggleSelectAll}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                      </th>
                      <th style={tableHeaderStyle}>USER</th>
                      <th style={tableHeaderStyle}>EMAIL</th>
                      <th style={tableHeaderStyle}>ROLE</th>
                      <th style={tableHeaderStyle}>STATUS</th>
                      <th style={tableHeaderStyle}>JOINED</th>
                      <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((u) => {
                      const roleBadge = getRoleBadge(u.role);
                      const statusBadge = getStatusBadge(u.status);
                      const avatarColor = getAvatarColor(u.fullName);
                      return (
                        <tr
                          key={u.id}
                          style={{
                            borderBottom: `1px solid ${colors.border}`,
                            transition: 'background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.grayLight)}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <td style={tableCellStyle}>
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(u.id)}
                              onChange={() => toggleSelectUser(u.id)}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                          </td>
                          <td style={tableCellStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  backgroundColor: avatarColor,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: '600',
                                  fontSize: '14px',
                                }}
                              >
                                {u.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: '600', color: colors.text }}>{u.fullName}</div>
                                <div style={{ fontSize: '12px', color: colors.textSecondary }}>ID: #{u.id.toString().padStart(5, '0')}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ ...tableCellStyle, color: colors.textSecondary }}>{u.email}</td>
                          <td style={tableCellStyle}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                backgroundColor: roleBadge.bg,
                                color: roleBadge.text,
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontWeight: '600',
                              }}
                            >
                              {roleBadge.label}
                            </span>
                          </td>
                          <td style={tableCellStyle}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                backgroundColor: statusBadge.bg,
                                color: statusBadge.text,
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontWeight: '600',
                              }}
                            >
                              {statusBadge.label}
                            </span>
                          </td>
                          <td style={{ ...tableCellStyle, color: colors.textSecondary }}>
                            {new Date(u.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: '2-digit',
                              year: 'numeric'
                            })}
                          </td>
                          <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                              <button
                                onClick={() => alert(`Edit user ${u.id}`)}
                                style={{
                                  padding: '8px',
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: colors.textSecondary,
                                  borderRadius: '6px',
                                  transition: 'background-color 0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.grayLight}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => alert(`Delete user ${u.id}`)}
                                style={{
                                  padding: '8px',
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: colors.red,
                                  borderRadius: '6px',
                                  transition: 'background-color 0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.redLight}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredUsers.length > 0 && (
              <div style={{
                padding: '16px 24px',
                borderTop: `1px solid ${colors.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: colors.textSecondary }}>Show result:</span>
                  <select
                    style={{
                      padding: '6px 12px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: colors.surface,
                      cursor: 'pointer',
                    }}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.5 : 1,
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        minWidth: '36px',
                        padding: '8px 12px',
                        backgroundColor: currentPage === page ? colors.primary : colors.surface,
                        color: currentPage === page ? 'white' : colors.text,
                        border: `1px solid ${currentPage === page ? colors.primary : colors.border}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages ? 0.5 : 1,
                    }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </StaffDashboardLayout>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  padding: '14px 16px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: '600',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tableCellStyle: React.CSSProperties = {
  padding: '16px',
  fontSize: '14px',
};
