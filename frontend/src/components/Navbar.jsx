import React from 'react';
import { Coffee, Sparkles, Wallet as WalletIcon, ShieldAlert, Users, QrCode, RotateCcw, User, ShieldCheck } from 'lucide-react';

export default function Navbar({
  cafeInfo,
  userPersona,
  setUserPersona,
  wallet,
  onOpenWallet,
  onOpenGeminiChat,
  onOpenQRHub,
  onResetDemo,
  alertsCount,
  activeSession,
  onLeaveTable
}) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-glass)',
      background: 'rgba(14, 13, 12, 0.9)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
          }}>
            ☕
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {cafeInfo?.name || 'Aura Artisan Coffee & Kitchen'}
              </h1>
              <span style={{
                background: userPersona === 'customer' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: userPersona === 'customer' ? '#38bdf8' : '#fbbf24',
                border: userPersona === 'customer' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span className="live-dot" /> {userPersona === 'customer' ? 'Customer Mode' : 'Admin & Barista Mode'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Live Table Sentiment & Rewards Platform • Google Gemini AI
            </p>
          </div>
        </div>

        {/* Persona Switcher Center */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          <button
            onClick={() => setUserPersona('customer')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              background: userPersona === 'customer' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
              color: userPersona === 'customer' ? '#100e0a' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              transition: 'all 0.2s ease'
            }}
          >
            <User size={16} /> Customer (Diner)
          </button>
          <button
            onClick={() => setUserPersona('admin')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              background: userPersona === 'admin' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'transparent',
              color: userPersona === 'admin' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <ShieldCheck size={16} /> Cafe Admin
            {alertsCount > 0 && (
              <span style={{
                background: 'var(--rose)',
                color: '#fff',
                fontSize: '0.7rem',
                padding: '1px 6px',
                borderRadius: '9999px',
                fontWeight: 700
              }}>
                {alertsCount}
              </span>
            )}
          </button>
        </div>

        {/* Right Persona Action Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {userPersona === 'admin' ? (
            /* Admin Specific Actions */
            <>
              {/* Table QR Hub Button */}
              <button
                onClick={onOpenQRHub}
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#fbbf24',
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
                title="Generate & print table QR stands"
              >
                <QrCode size={16} /> Table QR Hub
              </button>

              {/* Ask Gemini Button */}
              <button
                onClick={onOpenGeminiChat}
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  color: '#d8b4fe',
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                <Sparkles size={15} color="#c084fc" /> Ask Gemini
              </button>

              {/* Reset Demo Button */}
              <button
                onClick={onResetDemo}
                className="btn-secondary"
                style={{ padding: '7px 10px', fontSize: '0.8rem' }}
                title="Reload demo shift tables"
              >
                <RotateCcw size={14} />
              </button>
            </>
          ) : (
            /* Customer Specific Actions */
            <>
              {activeSession && (
                <button
                  onClick={onLeaveTable}
                  className="btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                >
                  Switch / Change Table
                </button>
              )}

              {/* Customer Wallet Chip */}
              <button
                onClick={onOpenWallet}
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.25) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#fef3c7',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 800
                }}>
                  🪙
                </div>
                <span>{wallet?.balance ?? 100} pts</span>
                <span style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: '#fbbf24',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.72rem'
                }}>
                  {wallet?.tier || 'Silver'}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
