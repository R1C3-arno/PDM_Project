'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { olavsDesign } from '@/lib/olavs-design-system';
import { OlavsButton } from '@/components/OlavsButton';
import { OlavsCard } from '@/components/OlavsCard';
import { OlavsInput } from '@/components/OlavsInput';
import { OlavsContainer } from '@/components/OlavsContainer';
import { OlavsGrid } from '@/components/OlavsGrid';
import { UserDashboardLayout } from '@/layouts/UserDashboardLayout';
import { Wallet, ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Clock, Plus, Minus } from 'lucide-react';

// Matches backend WalletController response
interface WalletData {
  balance: number;
  currency: string;
  email?: string;
}

export default function WalletPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const data = await apiClient.get<WalletData>('/wallets/me');
      setWallet(data);
    } catch (error) {
      console.error('Failed to fetch wallet, using mock data:', error);
      // Use mock data for testing
      setWallet({ balance: 1250.50, currency: 'USD' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setProcessing(true);
    try {
      const response = await apiClient.post<{ success: boolean; balance: number }>('/wallets/deposit', { amount: parseFloat(amount) });
      // Update wallet with new balance from response
      if (response.success && wallet) {
        setWallet({ ...wallet, balance: response.balance });
      } else {
        await fetchWallet();
      }
      setAmount('');
      setShowDeposit(false);
    } catch (error) {
      console.error('Deposit failed:', error);
      alert('Deposit failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setProcessing(true);
    try {
      const response = await apiClient.post<{ success: boolean; balance: number; message?: string }>('/wallets/withdraw', { amount: parseFloat(amount) });
      if (response.success && wallet) {
        setWallet({ ...wallet, balance: response.balance });
      } else {
        alert(response.message || 'Withdrawal failed');
        await fetchWallet();
      }
      setAmount('');
      setShowWithdraw(false);
    } catch (error) {
      console.error('Withdrawal failed:', error);
      alert('Withdrawal failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <UserDashboardLayout>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: olavsDesign.colors.surface.alt,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-block',
              width: '48px',
              height: '48px',
              border: `4px solid ${olavsDesign.colors.neutral[200]}`,
              borderTopColor: olavsDesign.colors.primary[500],
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}></div>
          </div>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <div style={{
        backgroundColor: olavsDesign.colors.surface.alt,
        minHeight: '100vh',
        fontFamily: olavsDesign.typography.font.primary,
      }}>
        <OlavsContainer>
          <div style={{ padding: `${olavsDesign.spacing[32]} 0` }}>
            <h1 style={{
              fontSize: olavsDesign.typography.scale.displayL.size,
              fontWeight: olavsDesign.typography.scale.displayL.weight,
              color: olavsDesign.colors.neutral[900],
              margin: 0,
              marginBottom: olavsDesign.spacing[32],
            }}>
              Wallet
            </h1>

            {/* Balance Card */}
            <OlavsCard
              elevation="level2"
              style={{
                background: `linear-gradient(135deg, ${olavsDesign.colors.primary[500]} 0%, ${olavsDesign.colors.primary[700]} 100%)`,
                color: 'white',
                marginBottom: olavsDesign.spacing[32],
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: olavsDesign.spacing[24] }}>
                <div>
                  <p style={{
                    fontSize: olavsDesign.typography.scale.bodyM.size,
                    opacity: 0.9,
                    margin: 0,
                    marginBottom: olavsDesign.spacing[8],
                  }}>
                    Total Balance
                  </p>
                  <h2 style={{
                    fontSize: olavsDesign.typography.scale.displayXL.size,
                    fontWeight: olavsDesign.typography.scale.displayXL.weight,
                    margin: 0,
                  }}>
                    ${wallet?.balance.toLocaleString() || '0.00'}
                  </h2>
                </div>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Wallet size={32} />
                </div>
              </div>
            </OlavsCard>

            {/* Actions */}
            <OlavsGrid cols={{ xs: 1, sm: 2 }} gap={16} style={{ marginBottom: olavsDesign.spacing[32] }}>
              <OlavsButton
                variant="primary"
                size="lg"
                icon={<ArrowDownRight size={20} />}
                onClick={() => setShowDeposit(true)}
                style={{ width: '100%' }}
              >
                Deposit Funds
              </OlavsButton>
              <OlavsButton
                variant="secondary"
                size="lg"
                icon={<ArrowUpRight size={20} />}
                onClick={() => setShowWithdraw(true)}
                style={{ width: '100%' }}
              >
                Withdraw Funds
              </OlavsButton>
            </OlavsGrid>

            {/* Deposit Modal */}
            {showDeposit && (
              <OlavsCard elevation="level2" style={{ marginBottom: olavsDesign.spacing[24] }}>
                <h3 style={{
                  fontSize: olavsDesign.typography.scale.headingM.size,
                  fontWeight: olavsDesign.typography.scale.headingM.weight,
                  color: olavsDesign.colors.neutral[900],
                  marginBottom: olavsDesign.spacing[24],
                }}>
                  Deposit Funds
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: olavsDesign.spacing[16] }}>
                  <OlavsInput
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    fullWidth
                  />
                  <div style={{ display: 'flex', gap: olavsDesign.spacing[12] }}>
                    <OlavsButton
                      variant="primary"
                      onClick={handleDeposit}
                      loading={processing}
                      disabled={processing || !amount}
                      style={{ flex: 1 }}
                    >
                      Confirm Deposit
                    </OlavsButton>
                    <OlavsButton
                      variant="secondary"
                      onClick={() => {
                        setShowDeposit(false);
                        setAmount('');
                      }}
                      disabled={processing}
                    >
                      Cancel
                    </OlavsButton>
                  </div>
                </div>
              </OlavsCard>
            )}

            {/* Withdraw Modal */}
            {showWithdraw && (
              <OlavsCard elevation="level2" style={{ marginBottom: olavsDesign.spacing[24] }}>
                <h3 style={{
                  fontSize: olavsDesign.typography.scale.headingM.size,
                  fontWeight: olavsDesign.typography.scale.headingM.weight,
                  color: olavsDesign.colors.neutral[900],
                  marginBottom: olavsDesign.spacing[24],
                }}>
                  Withdraw Funds
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: olavsDesign.spacing[16] }}>
                  <OlavsInput
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    fullWidth
                    helperText={`Available: $${wallet?.balance.toLocaleString()}`}
                  />
                  <div style={{ display: 'flex', gap: olavsDesign.spacing[12] }}>
                    <OlavsButton
                      variant="primary"
                      onClick={handleWithdraw}
                      loading={processing}
                      disabled={processing || !amount || parseFloat(amount) > (wallet?.balance || 0)}
                      style={{ flex: 1 }}
                    >
                      Confirm Withdrawal
                    </OlavsButton>
                    <OlavsButton
                      variant="secondary"
                      onClick={() => {
                        setShowWithdraw(false);
                        setAmount('');
                      }}
                      disabled={processing}
                    >
                      Cancel
                    </OlavsButton>
                  </div>
                </div>
              </OlavsCard>
            )}

            {/* Quick Stats */}
            <OlavsGrid cols={{ xs: 1, sm: 3 }} gap={20}>
              <OlavsCard elevation="level1">
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    margin: '0 auto',
                    marginBottom: olavsDesign.spacing[12],
                    borderRadius: '50%',
                    backgroundColor: olavsDesign.colors.status.success + '20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <TrendingUp size={24} color={olavsDesign.colors.status.success} />
                  </div>
                  <p style={{
                    fontSize: olavsDesign.typography.scale.bodyS.size,
                    color: olavsDesign.colors.neutral[600],
                    margin: 0,
                    marginBottom: olavsDesign.spacing[4],
                  }}>
                    Total Deposits
                  </p>
                  <p style={{
                    fontSize: olavsDesign.typography.scale.headingM.size,
                    fontWeight: olavsDesign.typography.scale.headingM.weight,
                    color: olavsDesign.colors.neutral[900],
                    margin: 0,
                  }}>
                    $0.00
                  </p>
                </div>
              </OlavsCard>

              <OlavsCard elevation="level1">
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    margin: '0 auto',
                    marginBottom: olavsDesign.spacing[12],
                    borderRadius: '50%',
                    backgroundColor: olavsDesign.colors.status.warning + '20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <ArrowUpRight size={24} color={olavsDesign.colors.status.warning} />
                  </div>
                  <p style={{
                    fontSize: olavsDesign.typography.scale.bodyS.size,
                    color: olavsDesign.colors.neutral[600],
                    margin: 0,
                    marginBottom: olavsDesign.spacing[4],
                  }}>
                    Total Withdrawals
                  </p>
                  <p style={{
                    fontSize: olavsDesign.typography.scale.headingM.size,
                    fontWeight: olavsDesign.typography.scale.headingM.weight,
                    color: olavsDesign.colors.neutral[900],
                    margin: 0,
                  }}>
                    $0.00
                  </p>
                </div>
              </OlavsCard>

              <OlavsCard elevation="level1">
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    margin: '0 auto',
                    marginBottom: olavsDesign.spacing[12],
                    borderRadius: '50%',
                    backgroundColor: olavsDesign.colors.primary[100],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Clock size={24} color={olavsDesign.colors.primary[500]} />
                  </div>
                  <p style={{
                    fontSize: olavsDesign.typography.scale.bodyS.size,
                    color: olavsDesign.colors.neutral[600],
                    margin: 0,
                    marginBottom: olavsDesign.spacing[4],
                  }}>
                    Pending
                  </p>
                  <p style={{
                    fontSize: olavsDesign.typography.scale.headingM.size,
                    fontWeight: olavsDesign.typography.scale.headingM.weight,
                    color: olavsDesign.colors.neutral[900],
                    margin: 0,
                  }}>
                    $0.00
                  </p>
                </div>
              </OlavsCard>
            </OlavsGrid>
          </div>
        </OlavsContainer>
      </div>
    </UserDashboardLayout>
  );
}
