import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Star, 
  Coffee, 
  Clock, 
  Flame, 
  RefreshCw,
  Award,
  ChevronRight
} from 'lucide-react';

export default function ManagerDashboard({
  stats,
  alerts,
  sessions,
  onResolveAlert,
  onGenerateShiftSummary,
  shiftSummary,
  isGeneratingSummary,
  onSelectTable
}) {
  const [selectedAlertFilter, setSelectedAlertFilter] = useState('all');

  const activeSessions = sessions.filter(s => s.is_active);
  const unresolvedAlerts = alerts?.filter(a => !a.resolved) || [];

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px 16px' }}>
      {/* KPI Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Stat 1: Delight Rate */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Customer Delight Rate</span>
            <span style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              Live
            </span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-display)' }}>
            {stats?.customer_delight_pct ?? 92}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Based on {stats?.total_feedbacks ?? 0} live item reviews today
          </div>
        </div>

        {/* Stat 2: Average Rating */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Average Cafe Rating</span>
            <Star size={16} color="#fbbf24" fill="#fbbf24" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-display)' }}>
            {stats?.average_rating ?? 4.8} <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/ 5.0</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '4px' }}>
            +0.4 vs previous week benchmark
          </div>
        </div>

        {/* Stat 3: Seated Diners */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Currently Seated</span>
            <Users size={16} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-display)' }}>
            {stats?.total_diners_active ?? activeSessions.reduce((acc, s) => acc + (s.members?.length || 1), 0)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across {activeSessions.length} active cafe tables
          </div>
        </div>

        {/* Stat 4: Barista Kitchen Alerts */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Kitchen & Barista Alerts</span>
            <AlertTriangle size={16} color="#f43f5e" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: unresolvedAlerts.length > 0 ? '#f43f5e' : '#10b981', fontFamily: 'var(--font-display)' }}>
            {unresolvedAlerts.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {unresolvedAlerts.length > 0 ? 'Requires immediate table intervention' : 'All service alerts resolved'}
          </div>
        </div>
      </div>

      {/* Urgent Barista / Kitchen Alerts Banner */}
      {unresolvedAlerts.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(225, 29, 72, 0.25) 100%)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="alert-dot" />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fda4af' }}>
              Real-Time Kitchen & Barista Alerts ({unresolvedAlerts.length})
            </h4>
          </div>

          <div style={{ display: 'grid', gap: '10px' }}>
            {unresolvedAlerts.map(alert => (
              <div
                key={alert.id}
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      background: 'rgba(244, 63, 94, 0.2)',
                      color: '#fb7185',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      TABLE {alert.table_number}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f5f5f4' }}>
                      {alert.item_name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      • {alert.timestamp}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#fda4af' }}>
                    {alert.message}
                  </p>
                </div>

                <button
                  onClick={() => onResolveAlert(alert.id)}
                  className="btn-emerald"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  <CheckCircle size={14} /> Resolve & Acknowledge
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Gemini Shift Intelligence (Left) & Active Tables Grid (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Gemini Shift Intelligence Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={18} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Gemini Shift Intelligence</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Powered by Gemini 2.5 Flash</span>
              </div>
            </div>

            <button
              onClick={onGenerateShiftSummary}
              disabled={isGeneratingSummary}
              className="btn-primary"
              style={{ padding: '7px 14px', fontSize: '0.82rem' }}
            >
              <RefreshCw size={14} className={isGeneratingSummary ? 'live-dot' : ''} />
              {isGeneratingSummary ? 'Analyzing Shift...' : 'Refresh Shift Brief'}
            </button>
          </div>

          {shiftSummary ? (
            <div>
              {/* Vibe Summary */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                marginBottom: '14px'
              }}>
                <div style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Current Cafe Atmosphere & Health
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {shiftSummary.vibe_summary}
                </p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.8rem' }}>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>
                    Satisfaction: {shiftSummary.guest_satisfaction_percentage}%
                  </span>
                  <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                    Predicted NPS: {shiftSummary.net_promoter_prediction}
                  </span>
                </div>
              </div>

              {/* Praised vs Watch Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px'
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399', marginBottom: '6px' }}>
                    🔥 Top Praised Dishes
                  </div>
                  <ul style={{ listStyle: 'none', fontSize: '0.82rem', color: 'var(--text-main)', display: 'grid', gap: '4px' }}>
                    {shiftSummary.top_praised_items?.map((it, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>•</span> {it}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{
                  background: 'rgba(244, 63, 94, 0.08)',
                  border: '1px solid rgba(244, 63, 94, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px'
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fb7185', marginBottom: '6px' }}>
                    ⚠️ Dishes to Monitor
                  </div>
                  <ul style={{ listStyle: 'none', fontSize: '0.82rem', color: 'var(--text-main)', display: 'grid', gap: '4px' }}>
                    {shiftSummary.items_to_watch?.map((it, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>•</span> {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Barista Tips */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.06)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px'
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fbbf24', marginBottom: '6px' }}>
                  💡 Barista & Floor Action Plan:
                </div>
                <div style={{ display: 'grid', gap: '4px', fontSize: '0.82rem', color: 'var(--text-main)' }}>
                  {shiftSummary.barista_recommendations?.map((tip, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <span style={{ color: '#fbbf24', fontWeight: 700 }}>{idx + 1}.</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              <p style={{ marginBottom: '12px' }}>Click below to generate a real-time Gemini shift brief from all live table feedback.</p>
              <button onClick={onGenerateShiftSummary} className="btn-primary" style={{ margin: '0 auto' }}>
                <Sparkles size={16} /> Generate Shift Intelligence
              </button>
            </div>
          )}
        </div>

        {/* Active Tables List Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              Live Active Tables ({activeSessions.length})
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Click table to inspect</span>
          </div>

          <div style={{ display: 'grid', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
            {activeSessions.map(s => {
              const reviewed = s.items_ordered?.filter(i => i.feedback_submitted).length || 0;
              const totalItems = s.items_ordered?.length || 0;

              return (
                <div
                  key={s.id}
                  onClick={() => onSelectTable(s.id)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-glass)'}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{
                        background: '#f59e0b',
                        color: '#120e09',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 800
                      }}>
                        T{s.table_number}
                      </span>
                      <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                        {s.table_label || `Table ${s.table_number}`}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
                      <span>👥 {s.members?.join(', ')}</span>
                      <span>⏱️ Seated at {s.time_in}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24' }}>
                      ${s.total_bill?.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: reviewed === totalItems ? '#10b981' : 'var(--text-muted)' }}>
                      {reviewed}/{totalItems} items rated
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Recent Feedbacks Stream & Item Leaderboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Live Feedback Feed */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="live-dot" /> Live Guest Feedback Stream
          </h3>

          <div style={{ display: 'grid', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
            {stats?.recent_feedbacks?.map((f, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      background: 'rgba(245, 158, 11, 0.2)',
                      color: '#fbbf24',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      Table {f.table_number}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{f.item_name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          fill={s <= f.rating ? '#fbbf24' : 'transparent'}
                          color={s <= f.rating ? '#fbbf24' : '#57534e'}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{f.timestamp}</span>
                  </div>
                </div>

                {f.comment && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '8px' }}>
                    "{f.comment}"
                  </p>
                )}

                {f.tags && f.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {f.tags.map((tag, tIdx) => (
                      <span key={tIdx} style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-muted)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.7rem'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Item Rankings Leaderboard */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="#fbbf24" /> Menu Item Sentiment Leaderboard
          </h3>

          <div style={{ display: 'grid', gap: '10px' }}>
            {stats?.item_rankings?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.item_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {item.reviews_count} review{item.reviews_count > 1 ? 's' : ''} today
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={13} fill="#fbbf24" color="#fbbf24" /> {item.average_rating}
                    </div>
                  </div>
                  <span className={
                    item.status === 'Loved' ? 'badge-delight' :
                    item.status === 'Watch' ? 'badge-neutral' : 'badge-critical'
                  }>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
