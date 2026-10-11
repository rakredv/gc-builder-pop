import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  Receipt, 
  PlusCircle, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  LogOut, 
  ShoppingBag, 
  AlertCircle,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TableExperience({
  sessions,
  activeSession,
  setActiveSessionId,
  menuItems,
  onOpenFeedback,
  onCheckout,
  onAddItem,
  onStartNewTable
}) {
  const [selectedMenuItem, setSelectedMenuItem] = useState('');
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(38);

  // Live elapsed timer calculation
  useEffect(() => {
    if (!activeSession?.time_in) return;
    const updateElapsed = () => {
      const parts = activeSession.time_in.split(':');
      if (parts.length === 2) {
        const inDate = new Date();
        inDate.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);
        const diffMs = Math.max(0, new Date() - inDate);
        setElapsedMinutes(Math.floor(diffMs / (1000 * 60)));
      }
    };
    updateElapsed();
    const interval = setInterval(updateElapsed, 30000);
    return () => clearInterval(interval);
  }, [activeSession]);

  if (!activeSession) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>No active table selected</h2>
        <button onClick={onStartNewTable} className="btn-primary">
          <UserPlus size={18} /> Start Table Check-In
        </button>
      </div>
    );
  }

  const items = activeSession.items_ordered || [];
  const reviewedCount = items.filter(i => i.feedback_submitted).length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Table Switcher Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Switch Active Table:</span>
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSessionId(s.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: activeSession.id === s.id ? '1px solid #f59e0b' : '1px solid var(--border-glass)',
                background: activeSession.id === s.id ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: activeSession.id === s.id ? '#fbbf24' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Table {s.table_number}</span>
              {s.is_active ? (
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              ) : (
                <span style={{ fontSize: '0.7rem', color: '#78716c' }}>(Closed)</span>
              )}
            </button>
          ))}
          <button
            onClick={onStartNewTable}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px dashed rgba(245, 158, 11, 0.5)',
              background: 'transparent',
              color: '#f59e0b',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PlusCircle size={14} /> New Table Check-In
          </button>
        </div>
      </div>

      {/* Main Table Banner Card */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '100%',
          background: 'radial-gradient(circle at right center, rgba(245, 158, 11, 0.12), transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#100e0a',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 800,
                letterSpacing: '0.04em'
              }}>
                TABLE {activeSession.table_number}
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                {activeSession.table_label || `Table ${activeSession.table_number}`}
              </h2>
              {activeSession.is_active ? (
                <span className="badge-delight">
                  <span className="live-dot" /> Seated & Active
                </span>
              ) : (
                <span className="badge-neutral">
                  Checked Out at {activeSession.time_out}
                </span>
              )}
            </div>

            {/* Table Members */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <Users size={16} color="#fbbf24" />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Party ({activeSession.members?.length || 1} members):
              </span>
              {activeSession.members?.map((m, idx) => (
                <span key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  color: 'var(--text-main)',
                  fontWeight: 500
                }}>
                  {m}
                </span>
              ))}
            </div>

            {/* Time Metrics Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Clock size={15} color="#38bdf8" />
                <span>Time In: <strong style={{ color: 'var(--text-main)' }}>{activeSession.time_in}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span className="live-dot" style={{ width: '6px', height: '6px' }} />
                <span>Duration Seated: <strong style={{ color: '#fbbf24' }}>{elapsedMinutes} mins</strong></span>
              </div>
              {activeSession.time_out && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <LogOut size={15} color="#f43f5e" />
                  <span>Time Out: <strong style={{ color: 'var(--text-main)' }}>{activeSession.time_out}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Right Action: Bill Total & Checkout */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            minWidth: '240px',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Current Table Total
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-display)' }}>
              ${activeSession.total_bill?.toFixed(2) || '0.00'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#10b981', marginBottom: '14px' }}>
              ✨ Earn +50 bonus points on checkout
            </div>

            {activeSession.is_active ? (
              <button
                onClick={() => onCheckout(activeSession.id)}
                className="btn-emerald"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <LogOut size={16} /> Checkout & Close Table
              </button>
            ) : (
              <div style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: 500, textAlign: 'center' }}>
                ✓ Table Session Complete
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ordered Items & Live Feedback Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#f59e0b" />
            Items Ordered ({items.length})
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Submit live feedback on each item to guide the barista & unlock instant wallet reward points!
          </p>
        </div>

        {activeSession.is_active && (
          <button
            onClick={() => setShowAddMenuModal(true)}
            className="btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <PlusCircle size={16} /> Add Another Item
          </button>
        )}
      </div>

      {/* Items Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {items.map((item, index) => {
          const isReviewed = item.feedback_submitted;
          const sent = item.sentiment;

          return (
            <div key={`${item.item_id}-${index}`} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      ☕
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{item.name}</h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{item.category}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1rem' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Qty: {item.quantity}
                    </div>
                  </div>
                </div>

                {/* Feedback State */}
                {isReviewed ? (
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    marginTop: '12px',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            fill={star <= (item.rating || 5) ? '#fbbf24' : 'transparent'}
                            color={star <= (item.rating || 5) ? '#fbbf24' : '#57534e'}
                          />
                        ))}
                        <span style={{ fontWeight: 700, marginLeft: '4px', fontSize: '0.85rem' }}>
                          {item.rating}/5
                        </span>
                      </div>

                      {/* Gemini Sentiment Pill */}
                      {sent?.sentiment_label && (
                        <span className={
                          sent.sentiment_label === 'Delightful' ? 'badge-delight' :
                          sent.sentiment_label === 'Positive' ? 'badge-positive' :
                          sent.sentiment_label === 'Needs Attention' ? 'badge-critical' : 'badge-neutral'
                        }>
                          <Sparkles size={11} /> {sent.sentiment_label}
                        </span>
                      )}
                    </div>

                    {item.feedback_text && (
                      <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '8px' }}>
                        "{item.feedback_text}"
                      </p>
                    )}

                    {/* Emotion tags from Gemini */}
                    {sent?.emotion_tags && sent.emotion_tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                        {sent.emotion_tags.map((tag, tIdx) => (
                          <span key={tIdx} style={{
                            background: 'rgba(245, 158, 11, 0.12)',
                            color: '#fbbf24',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 500
                          }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: '#10b981',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      <CheckCircle2 size={13} /> Feedback Analyzed by Gemini • Points Credited to Wallet
                    </div>
                  </div>
                ) : (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: 'rgba(245, 158, 11, 0.05)',
                    border: '1px dashed rgba(245, 158, 11, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fbbf24' }}>
                        ✨ Awaiting Your Live Rating
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Earn up to +75 wallet reward points
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenFeedback(activeSession, item)}
                      className="btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      <Star size={14} /> Rate & Earn
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to add item to table */}
      {showAddMenuModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Add Item to Table {activeSession.table_number}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Select a specialty beverage, bakery, or brunch dish from the cafe menu:
            </p>

            <div style={{ display: 'grid', gap: '10px', maxHeight: '350px', overflowY: 'auto', marginBottom: '20px' }}>
              {menuItems.map(m => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMenuItem(m.id)}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: selectedMenuItem === m.id ? '1px solid #f59e0b' : '1px solid var(--border-glass)',
                    background: selectedMenuItem === m.id ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{m.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.description}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#fbbf24', marginLeft: '12px' }}>
                    ${m.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowAddMenuModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedMenuItem) {
                    onAddItem(activeSession.id, selectedMenuItem);
                    setShowAddMenuModal(false);
                    setSelectedMenuItem('');
                  }
                }}
                disabled={!selectedMenuItem}
                className="btn-primary"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
