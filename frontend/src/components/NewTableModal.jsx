import React, { useState } from 'react';
import { X, Users, Clock, Coffee, Plus } from 'lucide-react';

export default function NewTableModal({
  menuItems,
  onClose,
  onSubmit
}) {
  const [tableNumber, setTableNumber] = useState(5);
  const [tableLabel, setTableLabel] = useState('Table 5 (Terrace Garden)');
  const [membersText, setMembersText] = useState('Maya Lin, Jordan Lee');
  const [customerName, setCustomerName] = useState('Maya Lin');
  const [selectedItems, setSelectedItems] = useState(['item-1', 'item-4']);

  const toggleItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(i => i !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleCreate = () => {
    const members = membersText
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    onSubmit({
      table_number: Number(tableNumber),
      table_label: tableLabel || `Table ${tableNumber}`,
      members: members.length > 0 ? members : [customerName],
      customer_name: customerName || 'Guest',
      initial_items: selectedItems
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '28px', maxWidth: '520px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>New Table Check-In</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Start an active diner session, record Time In, and begin live feedback
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gap: '14px', marginBottom: '20px' }}>
          {/* Table Number & Label */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Table #
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={tableNumber}
                onChange={(e) => {
                  setTableNumber(e.target.value);
                  setTableLabel(`Table ${e.target.value} (Indoor Lounge)`);
                }}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Table Section / Label
              </label>
              <input
                type="text"
                value={tableLabel}
                onChange={(e) => setTableLabel(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {/* Primary Guest / Customer Name */}
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Primary Guest / Rewards Wallet Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Maya Lin"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                color: 'var(--text-main)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Members (Comma Separated) */}
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Party Members / Diners (comma separated)
            </label>
            <input
              type="text"
              value={membersText}
              onChange={(e) => setMembersText(e.target.value)}
              placeholder="e.g. Maya Lin, Jordan Lee, Sophia"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                color: 'var(--text-main)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Initial Menu Selection */}
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Select Initial Order Items:
            </label>
            <div style={{ display: 'grid', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              {menuItems.map(m => {
                const isSelected = selectedItems.includes(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => toggleItem(m.id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: isSelected ? '1px solid #f59e0b' : '1px solid var(--border-glass)',
                      background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.85rem'
                    }}
                  >
                    <span>{isSelected ? '✓ ' : '+ '}{m.name}</span>
                    <span style={{ color: '#fbbf24', fontWeight: 600 }}>${m.price.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleCreate} className="btn-primary">
            Start Table Session
          </button>
        </div>
      </div>
    </div>
  );
}
