import React, { useState } from 'react';
import { X, QrCode, Printer, Download, Check, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const ALL_TABLES = [
  { number: 1, label: 'Table 1 • Cozy Alcove', seats: 2 },
  { number: 2, label: 'Table 2 • Patio Sun Deck', seats: 2 },
  { number: 3, label: 'Table 3 • Espresso Bar Front', seats: 3 },
  { number: 4, label: 'Table 4 • Window Banquette', seats: 4 },
  { number: 5, label: 'Table 5 • Terrace Garden', seats: 4 },
  { number: 6, label: 'Table 6 • Communal Roast Table', seats: 6 },
  { number: 7, label: 'Table 7 • Book Nook', seats: 2 },
  { number: 8, label: 'Table 8 • Mezzanine Loft', seats: 4 },
];

export default function TableQRHubModal({
  onClose,
  onSimulateCustomerScan
}) {
  const [selectedTable, setSelectedTable] = useState(ALL_TABLES[3]); // Table 4 default
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://aura-cafe-sentiment-667279155325.asia-south1.run.app';
  const qrUrl = `${origin}/?table=${selectedTable.number}&persona=customer`;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '28px', maxWidth: '720px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              <QrCode size={20} color="#100e0a" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Table QR Code Management Hub</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Cafe Admin • Generate & print live QR stands for tables
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

        {/* Content Split: Table Selector (Left) & QR Placard Preview (Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Table List */}
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
              Select Cafe Table:
            </div>
            <div style={{ display: 'grid', gap: '8px', maxHeight: '340px', overflowY: 'auto' }}>
              {ALL_TABLES.map((t) => {
                const isSelected = selectedTable.number === t.number;
                return (
                  <div
                    key={t.number}
                    onClick={() => setSelectedTable(t)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: isSelected ? '1px solid #f59e0b' : '1px solid var(--border-glass)',
                      background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: isSelected ? '#fbbf24' : 'var(--text-main)' }}>
                        {t.label}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        Max Capacity: {t.seats} Guests
                      </div>
                    </div>
                    {isSelected && <span style={{ color: '#fbbf24', fontSize: '0.8rem' }}>● Active</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table QR Stand Preview */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px 20px',
            color: '#18181b',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '20px', marginBottom: '2px' }}>☕</div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em', color: '#18181b' }}>
                Aura Artisan Coffee & Kitchen
              </div>
              <div style={{
                background: '#fef3c7',
                color: '#92400e',
                fontWeight: 700,
                fontSize: '0.8rem',
                padding: '3px 12px',
                borderRadius: '9999px',
                display: 'inline-block',
                marginTop: '6px',
                marginBottom: '14px'
              }}>
                TABLE {selectedTable.number}
              </div>
            </div>

            {/* Generated QR Code SVG */}
            <div style={{
              padding: '12px',
              background: '#ffffff',
              border: '2px solid #e4e4e7',
              borderRadius: '12px',
              display: 'inline-block'
            }}>
              <QRCodeSVG
                value={qrUrl}
                size={160}
                level="M"
                includeMargin={false}
              />
            </div>

            <div style={{ marginTop: '12px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#18181b' }}>
                Scan to Share Live Feedback
              </div>
              <div style={{ fontSize: '0.72rem', color: '#71717a' }}>
                Instant Rewards Deposited to Your Wallet!
              </div>
            </div>

            <button
              onClick={() => onSimulateCustomerScan(selectedTable.number)}
              style={{
                marginTop: '12px',
                background: '#18181b',
                color: '#ffffff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ExternalLink size={12} /> Test Customer Scan Here
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <Printer size={16} /> Print Table Stand
          </button>
        </div>
      </div>
    </div>
  );
}
