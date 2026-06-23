import React, { useState } from 'react';
import {
  User, Key, Shield, Bell, Palette, LogOut,
  Save, CheckCircle, ChevronRight, Moon, Sun, Trash2, AlertTriangle
} from 'lucide-react';

const SECTIONS = [
  { id: 'account',   label: 'Account',       Icon: User    },
  { id: 'security',  label: 'Security',      Icon: Key     },
  { id: 'appearance',label: 'Appearance',    Icon: Palette },
  { id: 'privacy',   label: 'Privacy',       Icon: Shield  },
  { id: 'danger',    label: 'Danger Zone',   Icon: Trash2, danger: true },
];

export default function SettingsPage({ user, token, onLogout, onUpdateUser, darkMode, toggleTheme }) {
  const [activeSection, setActiveSection] = useState('account');

  // Account fields
  const [fullName, setFullName] = useState(user.fullName || '');
  const [email,    setEmail]    = useState(user.email    || '');
  const [accStatus,  setAccStatus]  = useState('');
  const [accType,    setAccType]    = useState('success');
  const [accLoading, setAccLoading] = useState(false);

  // Security fields
  const [currentPw, setCurrentPw] = useState('');
  const [newPw,     setNewPw]     = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [secStatus,  setSecStatus]  = useState('');
  const [secType,    setSecType]    = useState('success');
  const [secLoading, setSecLoading] = useState(false);

  // Notifications mock
  const [notifEmail, setNotifEmail]   = useState(true);
  const [notifBrowser, setNotifBrowser] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  /* -- Save account info ------------------------------------------ */
  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setAccLoading(true); setAccStatus('');
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ fullName, email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAccStatus('Account info updated.'); setAccType('success');
        onUpdateUser(data.user);
      } else {
        setAccStatus(data.error || 'Update failed.'); setAccType('error');
      }
    } catch {
      setAccStatus('Network error.'); setAccType('error');
    } finally {
      setAccLoading(false);
      setTimeout(() => setAccStatus(''), 4000);
    }
  };

  /* -- Save password ---------------------------------------------- */
  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) { setSecStatus('Passwords do not match.'); setSecType('error'); return; }
    setSecLoading(true); setSecStatus('');
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ fullName: user.fullName, email: user.email, currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSecStatus('Password changed successfully.'); setSecType('success');
        setCurrentPw(''); setNewPw(''); setConfirmPw('');
      } else {
        setSecStatus(data.error || 'Password update failed.'); setSecType('error');
      }
    } catch {
      setSecStatus('Network error.'); setSecType('error');
    } finally {
      setSecLoading(false);
      setTimeout(() => setSecStatus(''), 4000);
    }
  };

  const StatusMsg = ({ msg, type }) => msg ? (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.6rem 0.9rem', borderRadius: '0.6rem', fontSize: '0.83rem', fontWeight: 600,
      color: type === 'success' ? '#10b981' : '#ef4444',
      background: type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
      border: `1px solid ${type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
    }}>
      <CheckCircle size={14} /> {msg}
    </div>
  ) : null;

  const Toggle = ({ on, onChange, label }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{label}</span>
      <button
        onClick={() => onChange(!on)}
        style={{
          width: 44, height: 24, borderRadius: 9999,
          background: on ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
          border: 'none', cursor: 'pointer', position: 'relative',
          transition: 'background 0.2s ease', flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: on ? 23 : 3,
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  );

  /* ── Section panels ─────────────────────────────────────────────── */
  const panels = {

    account: (
      <form onSubmit={handleSaveAccount} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>Account Information</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Update your name and email address.</p>
        </div>
        <StatusMsg msg={accStatus} type={accType} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Account ID</label>
          <input className="form-input" value={`USR_${user.id || user._id || 'N/A'}`} readOnly style={{ opacity: 0.5, cursor: 'not-allowed' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary" disabled={accLoading} style={{ padding: '0.6rem 1.5rem' }}>
            <Save size={14} /> {accLoading ? 'Saving...' : 'Save Account'}
          </button>
        </div>
      </form>
    ),

    security: (
      <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>Security Settings</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Change your password to keep your account secure.</p>
        </div>
        <StatusMsg msg={secStatus} type={secType} />
        <div className="form-group">
          <label className="form-label">Current Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={currentPw} onChange={e => setCurrentPw(e.target.value)} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input className="form-input" type="password" placeholder="Min 8 characters" value={newPw} onChange={e => setNewPw(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Repeat new password"
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              style={{ borderColor: confirmPw && confirmPw !== newPw ? 'rgba(239,68,68,0.5)' : '' }}
              required
            />
          </div>
        </div>
        {/* Password strength hint */}
        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.04)' }}>
          <Shield size={12} style={{ display: 'inline', marginRight: '0.4rem', color: 'var(--color-primary)' }} />
          Use at least 8 characters, including uppercase and numbers for a strong password.
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary" disabled={secLoading} style={{ padding: '0.6rem 1.5rem' }}>
            <Key size={14} /> {secLoading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    ),

    appearance: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>Appearance</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Personalise the look and feel of your workspace.</p>
        </div>

        {/* Theme toggle */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '0.75rem', background: darkMode ? 'rgba(139,92,246,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${darkMode ? 'rgba(139,92,246,0.2)' : 'rgba(245,158,11,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {darkMode ? <Moon size={20} style={{ color: '#a78bfa' }} /> : <Sun size={20} style={{ color: '#f59e0b' }} />}
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{darkMode ? 'Dark Mode' : 'Light Mode'}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {darkMode ? 'Deep dark theme — easy on the eyes' : 'Clean light theme — great for bright environments'}
              </div>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="btn-secondary"
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', gap: '0.4rem', flexShrink: 0 }}
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            Switch to {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* Notification toggles */}
        <div>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bell size={15} style={{ color: 'var(--color-primary)' }} /> Notifications
          </h3>
          <div className="glass-card" style={{ marginTop: '0.75rem', padding: '0.25rem 1rem' }}>
            <Toggle on={notifEmail}   onChange={setNotifEmail}   label="Email notifications for new features" />
            <Toggle on={notifBrowser} onChange={setNotifBrowser} label="Browser push notifications" />
          </div>
        </div>
      </div>
    ),

    privacy: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>Privacy</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Control what data is used and how.</p>
        </div>
        <div className="glass-card" style={{ padding: '0.25rem 1rem' }}>
          <Toggle on={true}  onChange={() => {}} label="Store resume data on server" />
          <Toggle on={true}  onChange={() => {}} label="Save AI-generated cover letters" />
          <Toggle on={false} onChange={() => {}} label="Share anonymous usage analytics" />
        </div>
        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          <Shield size={13} style={{ display: 'inline', marginRight: '0.4rem', color: 'var(--color-primary)' }} />
          Your data is stored securely in MongoDB and never shared with third parties. AI features use Google Gemini and do not retain your data.
        </div>
      </div>
    ),

    danger: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ef4444', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} /> Danger Zone
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>These actions are irreversible. Please proceed with caution.</p>
        </div>

        <div style={{ border: '1px solid rgba(239,68,68,0.2)', borderRadius: '1rem', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(239,68,68,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>Sign Out</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Clear your session. Your data stays safe in the cloud.</div>
            </div>
            <button
              className="btn-secondary"
              style={{ borderColor: 'rgba(239,68,68,0.35)', color: '#ef4444', background: 'rgba(239,68,68,0.06)', padding: '0.5rem 1.1rem', fontSize: '0.85rem', flexShrink: 0 }}
              onClick={onLogout}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>

          <div style={{ height: 1, background: 'rgba(239,68,68,0.12)' }} />

          <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>Delete Account</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Permanently delete your account and all associated data.</div>
            </div>
            <button
              className="btn-secondary"
              style={{ borderColor: 'rgba(239,68,68,0.35)', color: '#ef4444', background: 'rgba(239,68,68,0.06)', padding: '0.5rem 1.1rem', fontSize: '0.85rem', flexShrink: 0 }}
              onClick={() => alert('Account deletion is not yet enabled in this version.')}
            >
              <Trash2 size={14} /> Delete Account
            </button>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.75rem', alignItems: 'start' }}>

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', position: 'sticky', top: '5rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 0.75rem', marginBottom: '0.5rem' }}>
          Settings
        </div>
        {SECTIONS.map(({ id, label, Icon, danger }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.7rem 0.9rem', borderRadius: '0.65rem',
              background: activeSection === id
                ? danger ? 'rgba(239,68,68,0.1)' : 'rgba(139,92,246,0.12)'
                : 'transparent',
              border: activeSection === id
                ? danger ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(139,92,246,0.2)'
                : '1px solid transparent',
              cursor: 'pointer', width: '100%',
              color: activeSection === id
                ? danger ? '#ef4444' : '#fff'
                : danger ? '#ef4444' : 'var(--text-muted)',
              transition: 'all 0.15s ease',
              fontWeight: activeSection === id ? 700 : 500,
              fontSize: '0.85rem',
            }}
            onMouseEnter={e => { if (activeSection !== id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { if (activeSection !== id) e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Icon size={15} /> {label}
            </span>
            {activeSection === id && <ChevronRight size={13} />}
          </button>
        ))}
      </div>

      {/* ── Main Panel ─────────────────────────────────────────── */}
      <div className="glass-card" key={activeSection} style={{ animation: 'tabFadeIn 0.2s ease' }}>
        {panels[activeSection]}
      </div>

    </div>
  );
}
