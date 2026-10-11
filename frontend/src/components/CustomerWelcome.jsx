import React, { useState } from 'react';
import { QrCode, Hash, Users, Sparkles, Coffee, ArrowRight, ShieldCheck, Gift } from 'lucide-react';

export default function CustomerWelcome({
  onOpenScanner,
  onJoinTableNumber,
  onStartNewTable,
  activeSessions
}) {
  const [tableInput, setTableInput] = useState('');
  const [guestName, setGuestName] = useState('Alex Rivers');

  const handleTableSubmit = (e) => {
    e.preventDefault();
    if (!tableInput) return;
    onJoinTableNumber(parseInt(tableInput, 10), guestName);
  };

  return (
    <div style={{ maxWidth: '840px', margin: '30px auto', padding: '0 16px' }}>
      {/* Hero Welcome Card */}
      <div className="glass-panel" style={{
        padding: '36px 30px',
        textAlign: 'center',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          margin: '0 auto 16px auto',
          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)'
        }}>
          ☕
        </div>

        <span style={{
          background: 'rgba(245, 158, 11, 0.15)',
          color: '#fbbf24',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '4px 14px',
          borderRadius: '9999px',
          fontSize: '0.78rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          display: 'inline-block',
          marginBottom: '10px'
        }}>
          Customer Live Dining Portal
        </span>

        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '10px', letterSpacing: '-0.02em' }}>
          Welcome to Aura Artisan Coffee & Kitchen
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
          Experience live dining intelligence. Share instant feedback on every coffee and dish to guide the barista in real-time, and earn instant reward points in your personal wallet!
        </p>

        {/* Perks bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '20px',
          fontSize: '0.82rem',
          color: 'var(--text-dim)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24' }}>
            <Sparkles size={15} /> Real-Time Gemini AI Feedback
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
            <Gift size={15} /> +75 Pts per Item Review
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
            <ShieldCheck size={15} /> Instant Loyalty Rewards
          </span>
        </div>
      </div>

      {/* Two Persona Action Paths: Scan QR vs Enter Table No */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Path 1: Scan Table QR */}
        <div className="glass-panel-interactive" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <QrCode size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              Option 1: Scan Table QR Code
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              Every cafe table is equipped with an NFC / QR code placard. Tap below to launch your camera and link directly to your table session.
            </p>
          </div>

          <button
            onClick={onOpenScanner}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
          >
            <QrCode size={18} /> Launch Table QR Scanner
          </button>
        </div>

        {/* Path 2: Enter Table Number */}
        <div className="glass-panel-interactive" style={{ padding: '28px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Hash size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
            Option 2: Enter Table Number
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
            Already seated? Type your table number and your name to open or begin your table session:
          </p>

          <form onSubmit={handleTableSubmit} style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Table Number (e.g., 4 or 2)
              </label>
              <input
                type="number"
                min="1"
                max="24"
                placeholder="Table #"
                value={tableInput}
                onChange={(e) => setTableInput(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '9px 12px',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Your Name / Primary Diner
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Alex Rivers"
                required
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '9px 12px',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-emerald"
              style={{ width: '100%', justifyContent: 'center', padding: '11px', marginTop: '4px' }}
            >
              <span>Connect to Table {tableInput ? `#${tableInput}` : ''}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Or Pick Active Table Directly */}
      {activeSessions && activeSessions.length > 0 && (
        <div className="glass-panel" style={{ padding: '20px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Or join one of the currently seated cafe tables directly:
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {activeSessions.map((s) => (
              <button
                key={s.id}
                onClick={() => onJoinTableNumber(s.table_number, s.customer_name)}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '7px 14px' }}
              >
                ☕ Table {s.table_number} ({s.customer_name}) • {s.items_ordered?.length || 0} items
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
