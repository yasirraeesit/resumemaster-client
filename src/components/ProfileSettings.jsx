import React, { useState } from 'react';
import { User, Shield, Key, Save, LogOut, Mail, Sparkles, CheckCircle } from 'lucide-react';

export default function ProfileSettings({ user, token, onLogout, onUpdateUser }) {
  const [fullName,         setFullName]         = useState(user.fullName || '');
  const [email,            setEmail]            = useState(user.email || '');
  const [currentPassword,  setCurrentPassword]  = useState('');
  const [newPassword,      setNewPassword]      = useState('');
  const [status,           setStatus]           = useState('');
  const [statusType,       setStatusType]       = useState('success');
  const [loading,          setLoading]          = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  const initials = (fullName || user.fullName || '?')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);

    const payload = { fullName, email };
    if (newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('Profile updated successfully!');
        setStatusType('success');
        onUpdateUser(data.user);
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setStatus(data.error || 'Failed to update profile.');
        setStatusType('error');
      }
    } catch (err) {
      setStatus('Network error. Unable to reach server.');
      setStatusType('error');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 4000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Profile Hero Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(79,70,229,0.12) 0%, rgba(139,92,246,0.08) 100%)',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '1.25rem',
        padding: '2rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.75rem', fontWeight: 900, color: '#fff',
          flexShrink: 0,
          boxShadow: '0 0 0 4px rgba(139,92,246,0.2)',
        }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginBottom: '0.25rem' }}>
            {user.fullName}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <Mail size={14} />
            {user.email}
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.15))',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: '0.75rem',
          padding: '0.6rem 1.25rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          fontSize: '0.85rem', fontWeight: 700, color: '#a78bfa',
        }}>
          <Sparkles size={16} />
          Free Plan
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.5rem' }}>

        {/* LEFT: Edit Profile Form */}
        <form className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleUpdateProfile}>
          <h2 style={{ fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <User size={18} style={{ color: 'var(--color-primary)' }} />
            Edit Profile
          </h2>

          {status && (
            <div style={{
              fontSize: '0.85rem', fontWeight: 600,
              padding: '0.6rem 0.85rem', borderRadius: '0.5rem',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              color: statusType === 'success' ? '#10b981' : '#ef4444',
              background: statusType === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${statusType === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}>
              <CheckCircle size={14} />
              {status}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <Key size={15} style={{ color: 'var(--color-primary)' }} />
              Change Password
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0.6rem 1.5rem' }}>
              <Save size={15} /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* RIGHT: Account Info + Danger Zone */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Shield size={16} style={{ color: 'var(--color-primary)' }} />
              Account Details
            </h3>
            {[
              { label: 'Account Status',   value: 'Active',   color: '#10b981' },
              { label: 'Plan',             value: 'Free',     color: 'var(--color-primary-hover)' },
              { label: 'Registered Email', value: user.email, color: '#fff' },
              { label: 'Account ID',       value: `USR_${user.id || user._id || 'N/A'}`, color: 'var(--text-dim)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontSize: '0.82rem', color, fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ border: '1px solid rgba(239,68,68,0.15)', background: 'rgba(239,68,68,0.03)' }}>
            <h3 style={{ fontSize: '0.95rem', color: '#ef4444', fontWeight: 700, marginBottom: '0.75rem' }}>
              Danger Zone
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Signing out will clear your local session. Your data stays safely in the cloud.
            </p>
            <button
              className="btn-secondary"
              style={{ width: '100%', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444', background: 'rgba(239,68,68,0.05)' }}
              onClick={onLogout}
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
