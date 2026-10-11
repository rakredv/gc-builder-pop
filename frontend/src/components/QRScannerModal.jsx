import React, { useState, useEffect } from 'react';
import { X, QrCode, Camera, Sparkles, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function QRScannerModal({
  onClose,
  onTableScanned,
  availableSessions
}) {
  const [isScanning, setIsScanning] = useState(true);
  const [scannedTable, setScannedTable] = useState(null);

  const simulateScan = (tableNumber) => {
    setIsScanning(false);
    setScannedTable(tableNumber);
    setTimeout(() => {
      onTableScanned(tableNumber);
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '24px', maxWidth: '480px', textAlign: 'center' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Camera size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Scan Table QR Code</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Point your smartphone camera at the QR code stand located on your cafe table.
        </p>

        {/* Viewfinder Scanner Area */}
        <div style={{
          position: 'relative',
          width: '260px',
          height: '260px',
          margin: '0 auto 24px auto',
          borderRadius: '20px',
          border: '2px solid rgba(245, 158, 11, 0.5)',
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: '0 0 30px rgba(245, 158, 11, 0.15)'
        }}>
          {/* Laser scanning beam */}
          {isScanning && (
            <div style={{
              position: 'absolute',
              top: '10%',
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)',
              boxShadow: '0 0 12px #fbbf24',
              animation: 'scanLaser 2s infinite ease-in-out'
            }} />
          )}

          {/* Corner markers */}
          <div style={{ position: 'absolute', top: 12, left: 12, width: 24, height: 24, borderTop: '3px solid #fbbf24', borderLeft: '3px solid #fbbf24', borderRadius: '4px 0 0 0' }} />
          <div style={{ position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderTop: '3px solid #fbbf24', borderRight: '3px solid #fbbf24', borderRadius: '0 4px 0 0' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 12, width: 24, height: 24, borderBottom: '3px solid #fbbf24', borderLeft: '3px solid #fbbf24', borderRadius: '0 0 0 4px' }} />
          <div style={{ position: 'absolute', bottom: 12, right: 12, width: 24, height: 24, borderBottom: '3px solid #fbbf24', borderRight: '3px solid #fbbf24', borderRadius: '0 0 4px 0' }} />

          {scannedTable ? (
            <div style={{ animation: 'modalPop 0.3s ease-out' }}>
              <CheckCircle2 size={56} color="#10b981" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>
                Table {scannedTable} Detected!
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Connecting to live table session...
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', opacity: 0.7 }}>
              <QrCode size={70} color="#fbbf24" style={{ margin: '0 auto 8px auto' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
                ALIGN QR CODE HERE
              </span>
            </div>
          )}
        </div>

        {/* Quick Simulator Buttons for Testing */}
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
            ⚡ Tap a table stand to simulate instant scan:
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => simulateScan(4)}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              📍 Scan Table 4 (Window)
            </button>
            <button
              onClick={() => simulateScan(2)}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              📍 Scan Table 2 (Patio)
            </button>
            <button
              onClick={() => simulateScan(5)}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              📍 Scan Table 5 (Garden)
            </button>
          </div>
        </div>

        <style>{`
          @keyframes scanLaser {
            0% { top: 15%; opacity: 0.3; }
            50% { top: 85%; opacity: 1; }
            100% { top: 15%; opacity: 0.3; }
          }
        `}</style>
      </div>
    </div>
  );
}
