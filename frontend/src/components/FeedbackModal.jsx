import React, { useState } from 'react';
import { Star, Sparkles, X, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const SENSORY_TAG_OPTIONS = [
  'Silky & Rich',
  'Steaming Hot',
  'Ice Cold',
  'Flaky & Fresh',
  'Deep Cacao Notes',
  'Beautiful Latte Art',
  'Needs Whisking',
  'Lukewarm',
  'Too Bitter',
  'Perfect Sweetness',
  'Slightly Tough Crust'
];

export default function FeedbackModal({
  session,
  item,
  onClose,
  onSubmitFeedback
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await onSubmitFeedback({
        session_id: session.id,
        item_id: item.item_id,
        item_name: item.name,
        rating,
        tags: selectedTags,
        comment,
        customer_name: session.customer_name || 'Guest'
      });

      setResult(res);
      // Trigger festive celebration confetti
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#fbbf24', '#ffffff']
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasCommentBonus = comment.trim().length >= 15;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '28px', maxWidth: '540px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Item Feedback • Table {session.table_number}
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '2px' }}>
              {item.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* If already submitted, display Gemini live analysis verdict */}
        {result ? (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎉</div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399', marginBottom: '4px' }}>
                Feedback Analyzed & Rewards Deposited!
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Thank you! Your feedback guides our barista in real-time.
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '8px 16px',
                borderRadius: '9999px',
                marginTop: '12px',
                color: '#fbbf24',
                fontWeight: 700,
                fontSize: '1.05rem'
              }}>
                <span>🪙 +{result.points_earned} Points Added to Wallet</span>
              </div>
            </div>

            {/* Gemini Sentiment Card */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Sparkles size={16} color="#c084fc" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d8b4fe' }}>
                  Gemini Live Sentiment Analysis:
                </span>
                <span className={
                  result.sentiment?.sentiment_label === 'Delightful' ? 'badge-delight' :
                  result.sentiment?.sentiment_label === 'Positive' ? 'badge-positive' :
                  result.sentiment?.sentiment_label === 'Needs Attention' ? 'badge-critical' : 'badge-neutral'
                }>
                  {result.sentiment?.sentiment_label}
                </span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '10px', fontStyle: 'italic' }}>
                "{result.sentiment?.highlight}"
              </p>

              {result.sentiment?.barista_kitchen_alert && (
                <div style={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  padding: '10px',
                  borderRadius: '8px',
                  color: '#fb7185',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertTriangle size={16} />
                  <span><strong>Barista Alert:</strong> {result.sentiment?.barista_kitchen_alert}</span>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Done & Return to Table
            </button>
          </div>
        ) : (
          /* Feedback Form */
          <div>
            {/* Interactive Stars */}
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Overall item rating
              </div>
              <div style={{ display: 'inline-flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <Star
                      size={32}
                      fill={(hoverRating || rating) >= star ? '#fbbf24' : 'transparent'}
                      color={(hoverRating || rating) >= star ? '#fbbf24' : '#57534e'}
                    />
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 600, marginTop: '6px' }}>
                {rating === 5 ? '5/5 — Absolute Perfection' :
                 rating === 4 ? '4/5 — Really Enjoyed It' :
                 rating === 3 ? '3/5 — Decent / Average' :
                 rating === 2 ? '2/5 — Needs Improvement' :
                 '1/5 — Very Unsatisfied'}
              </div>
            </div>

            {/* Sensory Aspect Tags */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Select taste, aroma, & texture tags:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {SENSORY_TAG_OPTIONS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: isSelected ? '1px solid #f59e0b' : '1px solid var(--border-glass)',
                        background: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        color: isSelected ? '#fbbf24' : 'var(--text-muted)',
                        fontSize: '0.78rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {tag} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Feedback Textarea */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Detailed Comments for Barista:
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: hasCommentBonus ? '#10b981' : 'var(--text-dim)'
                }}>
                  {hasCommentBonus ? '✨ +50 Bonus Points Unlocked!' : `${Math.max(0, 15 - comment.length)} chars to unlock +50 bonus`}
                </span>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="How was the flavor, warmth, or presentation? Let the team know..."
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </div>

            {/* Points Summary & Submit Button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              marginBottom: '18px'
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fbbf24' }}>
                  Reward To Be Credited:
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  +25 base {hasCommentBonus && '+ 50 comment bonus'} {selectedTags.length > 0 && '+ 15 tags'}
                </div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                +{25 + (hasCommentBonus ? 50 : 0) + (selectedTags.length > 0 ? 15 : 0)} pts
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            >
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} className="live-dot" /> Gemini Analyzing Live Sentiment...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} /> Submit to Barista & Earn Reward
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
