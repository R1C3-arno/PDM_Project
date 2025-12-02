"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { olavsDesign } from "@/lib/olavs-design-system";
import { OlavsContainer } from "@/components/OlavsContainer";
import { OlavsCard } from "@/components/OlavsCard";
import { OlavsButton } from "@/components/OlavsButton";
import { OlavsStatusBadge } from "@/components/OlavsStatusBadge";
import { OlavsGrid } from "@/components/OlavsGrid";
import { UserDashboardLayout } from "@/layouts/UserDashboardLayout";
import {
  FileText, Plus, Search, Filter, Calendar, DollarSign,
  Clock, TrendingUp, Eye, ChevronRight
} from "lucide-react";

interface Application {
  id: number;
  applicantId: number;
  productId: number;
  requestedAmount: number;
  requestedTermMonths: number;
  purpose: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ApplicationsPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      loadApplications();
    }
  }, [isAuthenticated, isLoading, router]);

  const loadApplications = async () => {
    try {
      const data = await apiClient.get('/applications');
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'DRAFT': 'draft',
      'SUBMITTED': 'submitted',
      'UNDER_REVIEW': 'under_review',
      'VERIFICATION_IN_PROGRESS': 'verification',
      'VERIFIED': 'verified',
      'REJECTED': 'rejected',
      'RISK_ASSESSED': 'risk_assessed',
      'OFFER_GENERATED': 'offer_generated',
      'OFFER_SENT': 'offer_sent',
      'OFFER_ACCEPTED': 'approved',
      'OFFER_REJECTED': 'rejected',
      'CONTRACT_CREATED': 'contracted',
      'CONTRACT_SIGNED': 'contracted',
      'DISBURSED': 'disbursed',
      'ACTIVE': 'active',
    };
    return statusMap[status] || 'draft';
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === "" || 
      app.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    active: applications.filter(a => ['SUBMITTED', 'UNDER_REVIEW', 'VERIFICATION_IN_PROGRESS'].includes(a.status)).length,
    approved: applications.filter(a => a.status === 'OFFER_ACCEPTED').length,
    disbursed: applications.filter(a => a.status === 'DISBURSED').length,
  };

  return (
    <UserDashboardLayout>
    <div style={{
      minHeight: '100vh',
      backgroundColor: olavsDesign.colors.surface.alt,
      paddingTop: olavsDesign.spacing[32],
      paddingBottom: olavsDesign.spacing[48],
    }}>
      <OlavsContainer>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: olavsDesign.spacing[32],
          flexWrap: 'wrap',
          gap: olavsDesign.spacing[16],
        }}>
          <div>
            <h1 style={{
              fontSize: olavsDesign.typography.scale.displayL.size,
              fontWeight: 700,
              color: olavsDesign.colors.neutral[900],
              marginBottom: olavsDesign.spacing[8],
            }}>
              My Loan Applications
            </h1>
            <p style={{
              fontSize: olavsDesign.typography.scale.bodyL.size,
              color: olavsDesign.colors.neutral[600],
            }}>
              Track and manage your loan application pipeline
            </p>
          </div>
          <OlavsButton
            variant="primary"
            size="lg"
            onClick={() => router.push(`/user/${user?.id}/applications/new`)}
          >
            <Plus size={20} style={{ marginRight: olavsDesign.spacing[8] }} />
            New Application
          </OlavsButton>
        </div>

        {/* Stats Overview */}
        <div style={{ marginBottom: olavsDesign.spacing[32] }}>
        <OlavsGrid cols={{ xs: 1, sm: 2, lg: 4 }}>
          <OlavsCard elevation="level1">
            <div style={{ display: 'flex', alignItems: 'center', gap: olavsDesign.spacing[16] }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: olavsDesign.radius.md,
                backgroundColor: olavsDesign.colors.primary[100],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FileText size={24} color={olavsDesign.colors.primary[600]} />
              </div>
              <div>
                <p style={{
                  fontSize: olavsDesign.typography.scale.caption.size,
                  color: olavsDesign.colors.neutral[600],
                  marginBottom: olavsDesign.spacing[4],
                }}>Total Applications</p>
                <p style={{
                  fontSize: olavsDesign.typography.scale.headingM.size,
                  fontWeight: 700,
                  color: olavsDesign.colors.neutral[900],
                }}>{stats.total}</p>
              </div>
            </div>
          </OlavsCard>

          <OlavsCard elevation="level1">
            <div style={{ display: 'flex', alignItems: 'center', gap: olavsDesign.spacing[16] }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: olavsDesign.radius.md,
                backgroundColor: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Clock size={24} color={olavsDesign.colors.status.warning} />
              </div>
              <div>
                <p style={{
                  fontSize: olavsDesign.typography.scale.caption.size,
                  color: olavsDesign.colors.neutral[600],
                  marginBottom: olavsDesign.spacing[4],
                }}>In Progress</p>
                <p style={{
                  fontSize: olavsDesign.typography.scale.headingM.size,
                  fontWeight: 700,
                  color: olavsDesign.colors.neutral[900],
                }}>{stats.active}</p>
              </div>
            </div>
          </OlavsCard>

          <OlavsCard elevation="level1">
            <div style={{ display: 'flex', alignItems: 'center', gap: olavsDesign.spacing[16] }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: olavsDesign.radius.md,
                backgroundColor: '#D1FAE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <TrendingUp size={24} color={olavsDesign.colors.status.success} />
              </div>
              <div>
                <p style={{
                  fontSize: olavsDesign.typography.scale.caption.size,
                  color: olavsDesign.colors.neutral[600],
                  marginBottom: olavsDesign.spacing[4],
                }}>Approved</p>
                <p style={{
                  fontSize: olavsDesign.typography.scale.headingM.size,
                  fontWeight: 700,
                  color: olavsDesign.colors.neutral[900],
                }}>{stats.approved}</p>
              </div>
            </div>
          </OlavsCard>

          <OlavsCard elevation="level1">
            <div style={{ display: 'flex', alignItems: 'center', gap: olavsDesign.spacing[16] }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: olavsDesign.radius.md,
                backgroundColor: '#DBEAFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <DollarSign size={24} color={olavsDesign.colors.status.info} />
              </div>
              <div>
                <p style={{
                  fontSize: olavsDesign.typography.scale.caption.size,
                  color: olavsDesign.colors.neutral[600],
                  marginBottom: olavsDesign.spacing[4],
                }}>Disbursed</p>
                <p style={{
                  fontSize: olavsDesign.typography.scale.headingM.size,
                  fontWeight: 700,
                  color: olavsDesign.colors.neutral[900],
                }}>{stats.disbursed}</p>
              </div>
            </div>
          </OlavsCard>
        </OlavsGrid>
        </div>

        {/* Filters */}
        <OlavsCard elevation="level1" style={{ marginBottom: olavsDesign.spacing[24] }}>
          <div style={{
            display: 'flex',
            gap: olavsDesign.spacing[16],
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <Search size={20} color={olavsDesign.colors.neutral[600]} style={{
                position: 'absolute',
                left: olavsDesign.spacing[12],
                top: '50%',
                transform: 'translateY(-50%)',
              }} />
              <input
                type="text"
                placeholder="Search by ID or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  paddingLeft: '44px',
                  paddingRight: olavsDesign.spacing[16],
                  border: `1px solid ${olavsDesign.colors.neutral[300]}`,
                  borderRadius: olavsDesign.radius.md,
                  fontSize: olavsDesign.typography.scale.bodyM.size,
                  fontFamily: olavsDesign.typography.font.primary,
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: olavsDesign.spacing[8], alignItems: 'center' }}>
              <Filter size={20} color={olavsDesign.colors.neutral[600]} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  height: '40px',
                  padding: `0 ${olavsDesign.spacing[16]}`,
                  border: `1px solid ${olavsDesign.colors.neutral[300]}`,
                  borderRadius: olavsDesign.radius.md,
                  fontSize: olavsDesign.typography.scale.bodyM.size,
                  fontFamily: olavsDesign.typography.font.primary,
                  backgroundColor: olavsDesign.colors.surface.default,
                  cursor: 'pointer',
                }}
              >
                <option value="all">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="VERIFIED">Verified</option>
                <option value="OFFER_ACCEPTED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="DISBURSED">Disbursed</option>
                <option value="ACTIVE">Active</option>
              </select>
            </div>
          </div>
        </OlavsCard>

        {/* Applications List */}
        {loading ? (
          <OlavsCard elevation="level1" style={{ padding: olavsDesign.spacing[48], textAlign: 'center' }}>
            <p style={{
              fontSize: olavsDesign.typography.scale.bodyL.size,
              color: olavsDesign.colors.neutral[600],
            }}>Loading applications...</p>
          </OlavsCard>
        ) : filteredApplications.length === 0 ? (
          <OlavsCard elevation="level1" style={{ padding: olavsDesign.spacing[48], textAlign: 'center' }}>
            <FileText size={48} color={olavsDesign.colors.neutral[600]} style={{ marginBottom: olavsDesign.spacing[16] }} />
            <h3 style={{
              fontSize: olavsDesign.typography.scale.headingS.size,
              fontWeight: 600,
              color: olavsDesign.colors.neutral[900],
              marginBottom: olavsDesign.spacing[8],
            }}>No applications found</h3>
            <p style={{
              fontSize: olavsDesign.typography.scale.bodyM.size,
              color: olavsDesign.colors.neutral[600],
              marginBottom: olavsDesign.spacing[24],
            }}>
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your filters" 
                : "Get started by creating your first loan application"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <OlavsButton variant="primary" onClick={() => router.push(`/user/${user?.id}/applications/new`)}>
                <Plus size={20} style={{ marginRight: olavsDesign.spacing[8] }} />
                Create Application
              </OlavsButton>
            )}
          </OlavsCard>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: olavsDesign.spacing[16] }}>
            {filteredApplications.map((app) => (
              <OlavsCard key={app.id} elevation="level1" style={{ cursor: 'pointer' }}
                onClick={() => router.push(`/user/${user?.id}/applications/${app.id}`)}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: olavsDesign.spacing[16],
                  flexWrap: 'wrap',
                }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: olavsDesign.spacing[12], marginBottom: olavsDesign.spacing[8] }}>
                      <h3 style={{
                        fontSize: olavsDesign.typography.scale.headingS.size,
                        fontWeight: 600,
                        color: olavsDesign.colors.neutral[900],
                      }}>Application #{app.id}</h3>
                      <OlavsStatusBadge status={getStatusVariant(app.status)}>
                        {app.status.replace(/_/g, ' ')}
                      </OlavsStatusBadge>
                    </div>
                    <p style={{
                      fontSize: olavsDesign.typography.scale.bodyM.size,
                      color: olavsDesign.colors.neutral[700],
                      marginBottom: olavsDesign.spacing[12],
                    }}>{app.purpose}</p>
                    <div style={{
                      display: 'flex',
                      gap: olavsDesign.spacing[24],
                      flexWrap: 'wrap',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: olavsDesign.spacing[8] }}>
                        <DollarSign size={16} color={olavsDesign.colors.neutral[700]} />
                        <span style={{
                          fontSize: olavsDesign.typography.scale.bodyS.size,
                          color: olavsDesign.colors.neutral[600],
                        }}>${app.requestedAmount.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: olavsDesign.spacing[8] }}>
                        <Calendar size={16} color={olavsDesign.colors.neutral[700]} />
                        <span style={{
                          fontSize: olavsDesign.typography.scale.bodyS.size,
                          color: olavsDesign.colors.neutral[600],
                        }}>{app.requestedTermMonths} months</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: olavsDesign.spacing[8] }}>
                        <Clock size={16} color={olavsDesign.colors.neutral[700]} />
                        <span style={{
                          fontSize: olavsDesign.typography.scale.bodyS.size,
                          color: olavsDesign.colors.neutral[600],
                        }}>{new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: olavsDesign.spacing[8],
                  }}>
                    <OlavsButton variant="tertiary" size="sm">
                      <Eye size={16} style={{ marginRight: olavsDesign.spacing[8] }} />
                      View Details
                    </OlavsButton>
                    <ChevronRight size={20} color={olavsDesign.colors.neutral[600]} />
                  </div>
                </div>
              </OlavsCard>
            ))}
          </div>
        )}
      </OlavsContainer>
    </div>
    </UserDashboardLayout>
  );
}
