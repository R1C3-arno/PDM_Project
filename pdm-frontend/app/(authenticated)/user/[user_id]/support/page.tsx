'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { olavsDesign } from '@/lib/olavs-design-system';
import { OlavsButton } from '@/components/OlavsButton';
import { OlavsCard } from '@/components/OlavsCard';
import { OlavsContainer } from '@/components/OlavsContainer';
import { OlavsInput } from '@/components/OlavsInput';
import { UserDashboardLayout } from '@/layouts/UserDashboardLayout';
import { HelpCircle, MessageSquare, Clock, CheckCircle, AlertCircle, Plus, Send, ChevronDown, ChevronUp } from 'lucide-react';

interface SupportTicket {
  id: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function SupportPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState<number | null>(null);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'GENERAL',
    priority: 'MEDIUM',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await apiClient.get<SupportTicket[]>('/support-tickets');
      setTickets(data);
    } catch (error) {
      console.error('Failed to fetch support tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.description.trim()) return;

    setSubmitting(true);
    try {
      const created = await apiClient.post<SupportTicket>('/support-tickets', newTicket);
      setTickets([created, ...tickets]);
      setNewTicket({ subject: '', description: '', category: 'GENERAL', priority: 'MEDIUM' });
      setShowNewTicket(false);
    } catch (error) {
      console.error('Failed to create support ticket:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'OPEN': return olavsDesign.colors.status.warning;
      case 'IN_PROGRESS': return olavsDesign.colors.primary[500];
      case 'RESOLVED': return olavsDesign.colors.status.success;
      case 'CLOSED': return olavsDesign.colors.neutral[700];
      default: return olavsDesign.colors.neutral[700];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'OPEN': return <AlertCircle size={16} />;
      case 'IN_PROGRESS': return <Clock size={16} />;
      case 'RESOLVED': return <CheckCircle size={16} />;
      case 'CLOSED': return <CheckCircle size={16} />;
      default: return <HelpCircle size={16} />;
    }
  };

  const openCount = tickets.filter(t => ['OPEN', 'IN_PROGRESS'].includes(t.status.toUpperCase())).length;

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
              alignItems: 'center',
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
                  Support Center
                </h1>
                <p style={{
                  fontSize: olavsDesign.typography.scale.bodyM.size,
                  color: olavsDesign.colors.neutral[600],
                  margin: 0,
                }}>
                  {openCount > 0 ? `You have ${openCount} open ticket${openCount !== 1 ? 's' : ''}` : "Need help? Create a support ticket below."}
                </p>
              </div>
              <OlavsButton
                variant="primary"
                onClick={() => setShowNewTicket(!showNewTicket)}
                icon={<Plus size={18} />}
              >
                New Ticket
              </OlavsButton>
            </div>

            {/* New Ticket Form */}
            {showNewTicket && (
              <OlavsCard elevation="level2" style={{ marginBottom: olavsDesign.spacing[24] }}>
                <h3 style={{
                  fontSize: olavsDesign.typography.scale.headingM.size,
                  fontWeight: olavsDesign.typography.scale.headingM.weight,
                  color: olavsDesign.colors.neutral[900],
                  marginBottom: olavsDesign.spacing[20],
                }}>
                  Create New Support Ticket
                </h3>
                <form onSubmit={handleSubmitTicket}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: olavsDesign.spacing[16] }}>
                    <OlavsInput
                      label="Subject"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      placeholder="Brief description of your issue"
                      required
                      fullWidth
                    />

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: olavsDesign.typography.scale.bodyS.size,
                        fontWeight: '500',
                        color: olavsDesign.colors.neutral[700],
                        marginBottom: olavsDesign.spacing[8],
                      }}>
                        Description
                      </label>
                      <textarea
                        value={newTicket.description}
                        onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                        placeholder="Please describe your issue in detail..."
                        required
                        rows={4}
                        style={{
                          width: '100%',
                          padding: olavsDesign.spacing[12],
                          borderRadius: olavsDesign.radius.md,
                          border: `1px solid ${olavsDesign.colors.neutral[300]}`,
                          fontSize: olavsDesign.typography.scale.bodyM.size,
                          fontFamily: olavsDesign.typography.font.primary,
                          resize: 'vertical',
                          outline: 'none',
                        }}
                        onFocus={(e) => e.target.style.borderColor = olavsDesign.colors.primary[500]}
                        onBlur={(e) => e.target.style.borderColor = olavsDesign.colors.neutral[300]}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: olavsDesign.spacing[16], flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '150px' }}>
                        <label style={{
                          display: 'block',
                          fontSize: olavsDesign.typography.scale.bodyS.size,
                          fontWeight: '500',
                          color: olavsDesign.colors.neutral[700],
                          marginBottom: olavsDesign.spacing[8],
                        }}>
                          Category
                        </label>
                        <select
                          value={newTicket.category}
                          onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                          style={{
                            width: '100%',
                            padding: olavsDesign.spacing[12],
                            borderRadius: olavsDesign.radius.md,
                            border: `1px solid ${olavsDesign.colors.neutral[300]}`,
                            fontSize: olavsDesign.typography.scale.bodyM.size,
                            fontFamily: olavsDesign.typography.font.primary,
                            backgroundColor: 'white',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="GENERAL">General Inquiry</option>
                          <option value="LOAN_INQUIRY">Loan Inquiry</option>
                          <option value="TECHNICAL">Technical Issue</option>
                          <option value="ACCOUNT">Account Issue</option>
                          <option value="DOCUMENT_REQUEST">Document Request</option>
                        </select>
                      </div>

                      <div style={{ flex: 1, minWidth: '150px' }}>
                        <label style={{
                          display: 'block',
                          fontSize: olavsDesign.typography.scale.bodyS.size,
                          fontWeight: '500',
                          color: olavsDesign.colors.neutral[700],
                          marginBottom: olavsDesign.spacing[8],
                        }}>
                          Priority
                        </label>
                        <select
                          value={newTicket.priority}
                          onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                          style={{
                            width: '100%',
                            padding: olavsDesign.spacing[12],
                            borderRadius: olavsDesign.radius.md,
                            border: `1px solid ${olavsDesign.colors.neutral[300]}`,
                            fontSize: olavsDesign.typography.scale.bodyM.size,
                            fontFamily: olavsDesign.typography.font.primary,
                            backgroundColor: 'white',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: olavsDesign.spacing[12], justifyContent: 'flex-end' }}>
                      <OlavsButton
                        type="button"
                        variant="secondary"
                        onClick={() => setShowNewTicket(false)}
                      >
                        Cancel
                      </OlavsButton>
                      <OlavsButton
                        type="submit"
                        variant="primary"
                        loading={submitting}
                        icon={<Send size={18} />}
                      >
                        Submit Ticket
                      </OlavsButton>
                    </div>
                  </div>
                </form>
              </OlavsCard>
            )}

            {/* Tickets List */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: olavsDesign.spacing[48] }}>
                <div style={{
                  display: 'inline-block',
                  width: '40px',
                  height: '40px',
                  border: `4px solid ${olavsDesign.colors.neutral[200]}`,
                  borderTopColor: olavsDesign.colors.primary[500],
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}></div>
                <p style={{
                  marginTop: olavsDesign.spacing[16],
                  color: olavsDesign.colors.neutral[600],
                  fontSize: olavsDesign.typography.scale.bodyM.size,
                }}>
                  Loading tickets...
                </p>
              </div>
            ) : tickets.length === 0 ? (
              <OlavsCard elevation="level1">
                <div style={{
                  textAlign: 'center',
                  padding: olavsDesign.spacing[48],
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto',
                    marginBottom: olavsDesign.spacing[24],
                    borderRadius: '50%',
                    backgroundColor: olavsDesign.colors.neutral[100],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <MessageSquare size={36} color={olavsDesign.colors.neutral[600]} />
                  </div>
                  <h3 style={{
                    fontSize: olavsDesign.typography.scale.headingM.size,
                    fontWeight: olavsDesign.typography.scale.headingM.weight,
                    color: olavsDesign.colors.neutral[900],
                    marginBottom: olavsDesign.spacing[8],
                  }}>
                    No support tickets yet
                  </h3>
                  <p style={{
                    fontSize: olavsDesign.typography.scale.bodyM.size,
                    color: olavsDesign.colors.neutral[600],
                    margin: 0,
                    marginBottom: olavsDesign.spacing[24],
                  }}>
                    Need help? Create a new support ticket and our team will assist you.
                  </p>
                  <OlavsButton
                    variant="primary"
                    onClick={() => setShowNewTicket(true)}
                    icon={<Plus size={18} />}
                  >
                    Create Your First Ticket
                  </OlavsButton>
                </div>
              </OlavsCard>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: olavsDesign.spacing[12],
              }}>
                {tickets.map((ticket) => (
                  <OlavsCard
                    key={ticket.id}
                    elevation="level1"
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: olavsDesign.spacing[16],
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: olavsDesign.spacing[12],
                          marginBottom: olavsDesign.spacing[8],
                        }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: olavsDesign.spacing[4],
                            padding: `${olavsDesign.spacing[4]} ${olavsDesign.spacing[12]}`,
                            backgroundColor: getStatusColor(ticket.status) + '20',
                            color: getStatusColor(ticket.status),
                            borderRadius: olavsDesign.radius.full,
                            fontSize: olavsDesign.typography.scale.caption.size,
                            fontWeight: '600',
                          }}>
                            {getStatusIcon(ticket.status)}
                            {ticket.status.replace('_', ' ')}
                          </span>
                          <span style={{
                            fontSize: olavsDesign.typography.scale.caption.size,
                            color: olavsDesign.colors.neutral[700],
                          }}>
                            #{ticket.id}
                          </span>
                        </div>
                        <h4 style={{
                          fontSize: olavsDesign.typography.scale.bodyM.size,
                          fontWeight: '600',
                          color: olavsDesign.colors.neutral[900],
                          margin: 0,
                          marginBottom: olavsDesign.spacing[4],
                        }}>
                          {ticket.subject}
                        </h4>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: olavsDesign.spacing[12],
                          fontSize: olavsDesign.typography.scale.caption.size,
                          color: olavsDesign.colors.neutral[700],
                        }}>
                          <span>{ticket.category.replace('_', ' ')}</span>
                          <span>•</span>
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {expandedTicket === ticket.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>

                    {expandedTicket === ticket.id && (
                      <div style={{
                        marginTop: olavsDesign.spacing[16],
                        paddingTop: olavsDesign.spacing[16],
                        borderTop: `1px solid ${olavsDesign.colors.neutral[200]}`,
                      }}>
                        <p style={{
                          fontSize: olavsDesign.typography.scale.bodyS.size,
                          color: olavsDesign.colors.neutral[600],
                          margin: 0,
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap',
                        }}>
                          {ticket.description}
                        </p>
                      </div>
                    )}
                  </OlavsCard>
                ))}
              </div>
            )}
          </div>
        </OlavsContainer>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </UserDashboardLayout>
  );
}
