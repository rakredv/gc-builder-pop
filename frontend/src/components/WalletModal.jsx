import React, { useState } from 'react';
import { X, Gift, Check, ArrowUpRight, ArrowDownLeft, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WalletModal({
  wallet,
  rewards,
  onClose,
  onRedeem
}) {
  const [activeTab, setActiveTab] = useState('rewards'); // 'rewards' or 'ledger'
  const [redeemingId, setRedeemingId] = useState(null);

  const handleRedeemReward = async (reward) => {
    if (wallet.balance < reward.cost) return;
    setRedeemingId(reward.id);
    try {
      await onRedeem({
        customer_id: wallet.customer_id,
        reward_id: reward.id,
        cost: reward.cost,
        reward_title: reward.title
      });

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#10b981', '#38bdf8']
      });
    } catch (e) {
      console.error(e);
    } finally {
      setRedeemingId(null);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '28px', maxWidth: '580px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              🪙
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Aura Cafe Rewards Wallet</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {wallet?.customer_name || 'Guest'} • Member Since Oct 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Digital Member Card */}
        <div style={{
          background: 'linear-gradient(135deg, #2b1f13 0%, #1c150e 100%)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '20px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '140px',
            height: '140px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Live Balance
              </span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fef3c7', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{wallet?.balance ?? 0}</span>
                <span style={{ fontSize: '1.1rem', color: '#fbbf24', fontWeight: 600 }}>POINTS</span>
              </div>
            </div>

            <div style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              padding: '6px 14px',
              borderRadius: '9999px',
              color: '#fbbf24',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <ShieldCheck size={14} /> {wallet?.tier || 'Silver'} Tier
            </div>
          </div>

          {/* Tier Progress */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Bronze: 0+</span>
            <span style={{ color: wallet?.tier === 'Silver' ? '#fbbf24' : 'inherit' }}>Silver: 150+</span>
            <span style={{ color: wallet?.tier === 'Gold' ? '#fbbf24' : 'inherit' }}>Gold: 300+</span>
            <span style={{ color: wallet?.tier === 'VIP Club' ? '#fbbf24' : 'inherit' }}>VIP Club: 500+</span>
          </div>
        </div>

        {/* Tab switch: Redeem Rewards vs Ledger */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          marginBottom: '16px'
        }}>
          <button
            onClick={() => setActiveTab('rewards')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'rewards' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              color: activeTab === 'rewards' ? '#fbbf24' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Redeem Cafe Perks ({rewards?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'ledger' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              color: activeTab === 'ledger' ? '#fbbf24' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Transaction History
          </button>
        </div>

        {/* Rewards Tab Content */}
        {activeTab === 'rewards' ? (
          <div style={{ display: 'grid', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
            {rewards?.map((r) => {
              const canAfford = (wallet?.balance || 0) >= r.cost;
              const isRedeeming = redeemingId === r.id;

              return (
                <div
                  key={r.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '24px' }}>{r.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{r.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.description}</div>
                      <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700, marginTop: '2px' }}>
                        🪙 {r.cost} pts
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRedeemReward(r)}
                    disabled={!canAfford || isRedeeming}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      background: canAfford ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.08)',
                      color: canAfford ? '#100e0a' : 'var(--text-dim)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: canAfford ? 'pointer' : 'not-allowed',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isRedeeming ? 'Redeeming...' : canAfford ? 'Redeem Perk' : `Need ${r.cost - (wallet?.balance || 0)} more`}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* Ledger Tab Content */
          <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'grid', gap: '8px' }}>
            {(!wallet?.transactions || wallet.transactions.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No transactions yet. Rate menu items to earn your first reward points!
              </div>
            ) : (
              wallet.transactions.map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: tx.amount > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                      color: tx.amount > 0 ? '#34d399' : '#fb7185',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}>
                      {tx.amount > 0 ? <ArrowUpRight size={15} /> : <ArrowDownLeft size={15} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{tx.description}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{tx.timestamp}</div>
                    </div>
                  </div>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: tx.amount > 0 ? '#10b981' : '#f43f5e'
                  }}>
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount} pts
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
