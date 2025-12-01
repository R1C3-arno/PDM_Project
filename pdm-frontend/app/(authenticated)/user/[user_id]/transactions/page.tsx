'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { olavsDesign } from '@/lib/olavs-design-system';
import { OlavsButton } from '@/components/OlavsButton';
import { OlavsCard } from '@/components/OlavsCard';
import { OlavsStatusBadge } from '@/components/OlavsStatusBadge';
import { OlavsContainer } from '@/components/OlavsContainer';
import { UserDashboardLayout } from '@/layouts/UserDashboardLayout';
import { ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
  description?: string;
}

export default function TransactionsPage() {
  const { } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'payment'>('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await apiClient.get<Transaction[]>('/transactions');
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === 'DEPOSIT' || type === 'CREDIT' ? 
      <ArrowDownRight size={20} color={olavsDesign.colors.status.success} /> : 
      <ArrowUpRight size={20} color={olavsDesign.colors.status.error} />;
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'deposit') return t.type === 'DEPOSIT' || t.type === 'CREDIT';
    if (filter === 'withdrawal') return t.type === 'WITHDRAWAL' || t.type === 'DEBIT';
    if (filter === 'payment') return t.type === 'PAYMENT';
    return true;
  });

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
              alignItems: 'flex-start',
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
                  Transaction History
                </h1>
                <p style={{
                  fontSize: olavsDesign.typography.scale.bodyM.size,
                  color: olavsDesign.colors.neutral[600],
                  margin: 0,
                }}>
                  View all your financial transactions
                </p>
              </div>
              <OlavsButton
                variant="secondary"
                icon={<Download size={18} />}
              >
                Export
              </OlavsButton>
            </div>

            {/* Filter Tabs */}
            <div style={{
              display: 'flex',
              gap: olavsDesign.spacing[12],
              marginBottom: olavsDesign.spacing[24],
              borderBottom: `2px solid ${olavsDesign.colors.neutral[200]}`,
              overflowX: 'auto',
            }}>
              {(['all', 'deposit', 'withdrawal', 'payment'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  style={{
                    padding: `${olavsDesign.spacing[12]} ${olavsDesign.spacing[20]}`,
                    fontSize: olavsDesign.typography.scale.bodyM.size,
                    fontWeight: '600',
                    color: filter === tab ? olavsDesign.colors.primary[500] : olavsDesign.colors.neutral[600],
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: filter === tab ? `2px solid ${olavsDesign.colors.primary[500]}` : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: '-2px',
                    whiteSpace: 'nowrap',
                    textTransform: 'capitalize',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Transactions List */}
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
              </div>
            ) : filteredTransactions.length === 0 ? (
              <OlavsCard elevation="level1">
                <div style={{ textAlign: 'center', padding: olavsDesign.spacing[48] }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    margin: '0 auto',
                    marginBottom: olavsDesign.spacing[24],
                    borderRadius: '50%',
                    backgroundColor: olavsDesign.colors.neutral[100],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <ArrowUpRight size={32} color={olavsDesign.colors.neutral[600]} />
                  </div>
                  <h3 style={{
                    fontSize: olavsDesign.typography.scale.headingM.size,
                    fontWeight: olavsDesign.typography.scale.headingM.weight,
                    color: olavsDesign.colors.neutral[900],
                    marginBottom: olavsDesign.spacing[8],
                  }}>
                    No transactions yet
                  </h3>
                  <p style={{
                    fontSize: olavsDesign.typography.scale.bodyM.size,
                    color: olavsDesign.colors.neutral[600],
                    margin: 0,
                  }}>
                    Your transaction history will appear here
                  </p>
                </div>
              </OlavsCard>
            ) : (
              <OlavsCard elevation="level1">
                <div className="olavs-table-responsive">
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                  }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${olavsDesign.colors.neutral[200]}` }}>
                        <th style={{
                          textAlign: 'left',
                          padding: olavsDesign.spacing[16],
                          fontSize: olavsDesign.typography.scale.bodyS.size,
                          fontWeight: '600',
                          color: olavsDesign.colors.neutral[700],
                        }}>Type</th>
                        <th style={{
                          textAlign: 'left',
                          padding: olavsDesign.spacing[16],
                          fontSize: olavsDesign.typography.scale.bodyS.size,
                          fontWeight: '600',
                          color: olavsDesign.colors.neutral[700],
                        }}>Description</th>
                        <th style={{
                          textAlign: 'right',
                          padding: olavsDesign.spacing[16],
                          fontSize: olavsDesign.typography.scale.bodyS.size,
                          fontWeight: '600',
                          color: olavsDesign.colors.neutral[700],
                        }}>Amount</th>
                        <th style={{
                          textAlign: 'center',
                          padding: olavsDesign.spacing[16],
                          fontSize: olavsDesign.typography.scale.bodyS.size,
                          fontWeight: '600',
                          color: olavsDesign.colors.neutral[700],
                        }}>Status</th>
                        <th style={{
                          textAlign: 'right',
                          padding: olavsDesign.spacing[16],
                          fontSize: olavsDesign.typography.scale.bodyS.size,
                          fontWeight: '600',
                          color: olavsDesign.colors.neutral[700],
                        }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr 
                          key={transaction.id}
                          style={{
                            borderBottom: `1px solid ${olavsDesign.colors.neutral[200]}`,
                            transition: 'background-color 0.2s ease',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = olavsDesign.colors.surface.alt}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={{ padding: olavsDesign.spacing[16] }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: olavsDesign.spacing[12] }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: transaction.type === 'DEPOSIT' || transaction.type === 'CREDIT' ? 
                                  olavsDesign.colors.status.success + '20' : 
                                  olavsDesign.colors.status.error + '20',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                                {getTransactionIcon(transaction.type)}
                              </div>
                              <span style={{
                                fontSize: olavsDesign.typography.scale.bodyM.size,
                                fontWeight: '600',
                                color: olavsDesign.colors.neutral[900],
                              }}>
                                {transaction.type}
                              </span>
                            </div>
                          </td>
                          <td style={{
                            padding: olavsDesign.spacing[16],
                            fontSize: olavsDesign.typography.scale.bodyM.size,
                            color: olavsDesign.colors.neutral[700],
                          }}>
                            {transaction.description || 'Transaction'}
                          </td>
                          <td style={{
                            padding: olavsDesign.spacing[16],
                            fontSize: olavsDesign.typography.scale.bodyM.size,
                            fontWeight: '600',
                            color: transaction.type === 'DEPOSIT' || transaction.type === 'CREDIT' ? 
                              olavsDesign.colors.status.success : 
                              olavsDesign.colors.status.error,
                            textAlign: 'right',
                          }}>
                            {transaction.type === 'DEPOSIT' || transaction.type === 'CREDIT' ? '+' : '-'}
                            ${(transaction.amount || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: olavsDesign.spacing[16], textAlign: 'center' }}>
                            <OlavsStatusBadge status={transaction.status.toLowerCase()} size="sm">
                              {transaction.status}
                            </OlavsStatusBadge>
                          </td>
                          <td style={{
                            padding: olavsDesign.spacing[16],
                            fontSize: olavsDesign.typography.scale.bodyS.size,
                            color: olavsDesign.colors.neutral[600],
                            textAlign: 'right',
                          }}>
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </OlavsCard>
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
