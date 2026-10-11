import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CustomerWelcome from './components/CustomerWelcome';
import TableExperience from './components/TableExperience';
import ManagerDashboard from './components/ManagerDashboard';
import FeedbackModal from './components/FeedbackModal';
import WalletModal from './components/WalletModal';
import GeminiChatDrawer from './components/GeminiChatDrawer';
import NewTableModal from './components/NewTableModal';
import QRScannerModal from './components/QRScannerModal';
import TableQRHubModal from './components/TableQRHubModal';
import confetti from 'canvas-confetti';

const API_BASE = '/api';

export default function App() {
  const [userPersona, setUserPersona] = useState('customer'); // 'customer' or 'admin'
  const [cafeInfo, setCafeInfo] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isCustomerAtTable, setIsCustomerAtTable] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [shiftSummary, setShiftSummary] = useState(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Modals state
  const [feedbackTarget, setFeedbackTarget] = useState(null); // { session, item }
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showGeminiChat, setShowGeminiChat] = useState(false);
  const [showNewTableModal, setShowNewTableModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showTableQRHub, setShowTableQRHub] = useState(false);

  // Read URL query params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTable = params.get('table');
      const urlPersona = params.get('persona');
      if (urlPersona === 'admin' || urlPersona === 'customer') {
        setUserPersona(urlPersona);
      }
      if (urlTable) {
        const tblNum = parseInt(urlTable, 10);
        handleJoinTableNumber(tblNum, 'Diner');
      }
    }
  }, []);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [cafeRes, menuRes, rewRes, sessRes, statsRes, alertsRes] = await Promise.all([
        fetch(`${API_BASE}/cafe`).then(r => r.json()),
        fetch(`${API_BASE}/menu`).then(r => r.json()),
        fetch(`${API_BASE}/rewards`).then(r => r.json()),
        fetch(`${API_BASE}/sessions`).then(r => r.json()),
        fetch(`${API_BASE}/dashboard/stats`).then(r => r.json()),
        fetch(`${API_BASE}/dashboard/alerts`).then(r => r.json())
      ]);

      setCafeInfo(cafeRes);
      setMenuItems(menuRes);
      setRewards(rewRes);
      setSessions(sessRes);
      setDashboardStats(statsRes);
      setAlerts(alertsRes);

      // Default active session to first active session if none selected
      if (!activeSessionId && sessRes.length > 0) {
        const firstActive = sessRes.find(s => s.is_active) || sessRes[0];
        setActiveSessionId(firstActive.id);
        fetchWallet(firstActive.wallet_id);
      }
    } catch (e) {
      console.error('Error fetching initial data:', e);
    }
  };

  const fetchWallet = async (walletId) => {
    if (!walletId) return;
    try {
      const res = await fetch(`${API_BASE}/wallet/${walletId}`).then(r => r.json());
      setWallet(res);
    } catch (e) {
      console.error('Error fetching wallet:', e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // 15s live sync
    return () => clearInterval(interval);
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    if (activeSession?.wallet_id) {
      fetchWallet(activeSession.wallet_id);
    }
  }, [activeSessionId]);

  // Handle Joining Table by Number (from QR Scan or Input Form)
  const handleJoinTableNumber = async (tableNum, guestName = 'Alex Rivers') => {
    // Check if there is already an active session for this table
    const existing = sessions.find(s => s.table_number === tableNum && s.is_active);
    if (existing) {
      setActiveSessionId(existing.id);
      setIsCustomerAtTable(true);
      fetchWallet(existing.wallet_id);
    } else {
      // Start a fresh session for this table
      const newSession = await fetch(`${API_BASE}/sessions/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_number: tableNum,
          table_label: `Table ${tableNum}`,
          members: [guestName],
          customer_name: guestName,
          initial_items: ['item-1', 'item-6']
        })
      }).then(r => r.json());

      fetchData();
      setActiveSessionId(newSession.id);
      setIsCustomerAtTable(true);
      fetchWallet(newSession.wallet_id);
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 }
    });
  };

  // Submit Feedback Handler
  const handleSubmitFeedback = async (payload) => {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json());

    fetchData();
    if (activeSession?.wallet_id) {
      fetchWallet(activeSession.wallet_id);
    }
    return res;
  };

  // Add Item to Table Handler
  const handleAddItem = async (sessionId, itemId) => {
    await fetch(`${API_BASE}/sessions/${sessionId}/add-item`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id: itemId, quantity: 1 })
    });
    fetchData();
  };

  // Checkout Table Handler
  const handleCheckout = async (sessionId) => {
    await fetch(`${API_BASE}/sessions/${sessionId}/checkout`, {
      method: 'POST'
    }).then(r => r.json());

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    fetchData();
    if (activeSession?.wallet_id) {
      fetchWallet(activeSession.wallet_id);
    }
  };

  // Start New Table Handler
  const handleStartNewTable = async (data) => {
    const newSession = await fetch(`${API_BASE}/sessions/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json());

    setShowNewTableModal(false);
    fetchData();
    setActiveSessionId(newSession.id);
    setIsCustomerAtTable(true);
  };

  // Redeem Reward Handler
  const handleRedeem = async (payload) => {
    const res = await fetch(`${API_BASE}/wallet/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json());

    if (activeSession?.wallet_id) {
      fetchWallet(activeSession.wallet_id);
    }
    return res;
  };

  // Resolve Alert Handler
  const handleResolveAlert = async (alertId) => {
    await fetch(`${API_BASE}/dashboard/alerts/${alertId}/resolve`, {
      method: 'POST'
    });
    fetchData();
  };

  // Generate Gemini Shift Summary
  const handleGenerateShiftSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const res = await fetch(`${API_BASE}/ai/shift-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cafe_id: cafeInfo?.id || 'cafe-aura' })
      }).then(r => r.json());
      setShiftSummary(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Ask Gemini Assistant
  const handleAskGemini = async (query) => {
    const res = await fetch(`${API_BASE}/ai/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cafe_id: cafeInfo?.id || 'cafe-aura', query })
    }).then(r => r.json());
    return res.reply;
  };

  // Reset Demo Shift
  const handleResetDemo = async () => {
    await fetch(`${API_BASE}/seed-demo`, { method: 'POST' });
    fetchData();
    setShiftSummary(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        cafeInfo={cafeInfo}
        userPersona={userPersona}
        setUserPersona={(persona) => {
          setUserPersona(persona);
          if (persona === 'customer') {
            setIsCustomerAtTable(true);
          }
        }}
        wallet={wallet}
        onOpenWallet={() => setShowWalletModal(true)}
        onOpenGeminiChat={() => setShowGeminiChat(true)}
        onOpenQRHub={() => setShowTableQRHub(true)}
        onResetDemo={handleResetDemo}
        alertsCount={alerts.filter(a => !a.resolved).length}
        activeSession={activeSession}
        onLeaveTable={() => setIsCustomerAtTable(false)}
      />

      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {userPersona === 'customer' ? (
          /* CUSTOMER PERSONA */
          isCustomerAtTable && activeSession ? (
            <TableExperience
              sessions={sessions}
              activeSession={activeSession}
              setActiveSessionId={setActiveSessionId}
              menuItems={menuItems}
              onOpenFeedback={(session, item) => setFeedbackTarget({ session, item })}
              onCheckout={handleCheckout}
              onAddItem={handleAddItem}
              onStartNewTable={() => setShowNewTableModal(true)}
            />
          ) : (
            <CustomerWelcome
              onOpenScanner={() => setShowQRScanner(true)}
              onJoinTableNumber={(tableNum, guestName) => handleJoinTableNumber(tableNum, guestName)}
              onStartNewTable={() => setShowNewTableModal(true)}
              activeSessions={sessions.filter(s => s.is_active)}
            />
          )
        ) : (
          /* CAFE ADMIN PERSONA */
          <ManagerDashboard
            stats={dashboardStats}
            alerts={alerts}
            sessions={sessions}
            onResolveAlert={handleResolveAlert}
            onGenerateShiftSummary={handleGenerateShiftSummary}
            shiftSummary={shiftSummary}
            isGeneratingSummary={isGeneratingSummary}
            onSelectTable={(tblId) => {
              setActiveSessionId(tblId);
              setUserPersona('customer');
              setIsCustomerAtTable(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-glass)',
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
        background: 'rgba(12, 11, 10, 0.95)'
      }}>
        <span>AuraCafe Live • Two Personas: Customer Table Feedback & Cafe Admin Intelligence • Cloud Run & Gemini 2.5 Flash</span>
      </footer>

      {/* Modals */}
      {feedbackTarget && (
        <FeedbackModal
          session={feedbackTarget.session}
          item={feedbackTarget.item}
          onClose={() => setFeedbackTarget(null)}
          onSubmitFeedback={handleSubmitFeedback}
        />
      )}

      {showWalletModal && (
        <WalletModal
          wallet={wallet}
          rewards={rewards}
          onClose={() => setShowWalletModal(false)}
          onRedeem={handleRedeem}
        />
      )}

      {showGeminiChat && (
        <GeminiChatDrawer
          onClose={() => setShowGeminiChat(false)}
          onAskGemini={handleAskGemini}
        />
      )}

      {showNewTableModal && (
        <NewTableModal
          menuItems={menuItems}
          onClose={() => setShowNewTableModal(false)}
          onSubmit={handleStartNewTable}
        />
      )}

      {showQRScanner && (
        <QRScannerModal
          onClose={() => setShowQRScanner(false)}
          onTableScanned={(tableNum) => {
            setShowQRScanner(false);
            handleJoinTableNumber(tableNum, 'Guest Diner');
          }}
          availableSessions={sessions}
        />
      )}

      {showTableQRHub && (
        <TableQRHubModal
          onClose={() => setShowTableQRHub(false)}
          onSimulateCustomerScan={(tableNum) => {
            setShowTableQRHub(false);
            setUserPersona('customer');
            handleJoinTableNumber(tableNum, 'Scan Guest');
          }}
        />
      )}
    </div>
  );
}
