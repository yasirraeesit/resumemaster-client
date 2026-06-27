import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, UserPlus, ChevronLeft, ShieldCheck, Mail, Lock, User } from 'lucide-react';

export default function RegisterPage({ onBack, onAuthSuccess, onNavigateToLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    /* global google */
    if (window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1023884759929-mockclientid.apps.googleusercontent.com',
          callback: handleGoogleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signup-btn'),
          { theme: 'outline', size: 'large', width: '380' }
        );
      } catch (e) {
        console.error('Google accounts SDK initialize error:', e);
      }
    }
  }, []);

  const handleGoogleCredentialResponse = async (response) => {
    setError('');
    setLoading(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      const res = await fetch(`${API_URL}/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        onAuthSuccess(data.token, data.user);
      } else {
        setError(data.error || 'Google sign up failed.');
      }
    } catch (err) {
      setError('Connection failure to API server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        onAuthSuccess(data.token, data.user);
      } else {
        setError(data.error || 'Failed to create account.');
      }
    } catch (err) {
      setError('Connection failure. Verify server is online.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1.1fr',
      minHeight: '88vh',
      background: 'var(--bg-app)',
      color: 'var(--text-main)',
      borderRadius: '1.25rem',
      overflow: 'hidden',
      border: '1px solid var(--border-glow)',
      boxShadow: 'var(--shadow-premium)'
    }}>
      
      {/* LEFT PANEL: Inspired by easy-cv.ai Marketing Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #0c0714 100%)',
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Spheres */}
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: '250px', height: '250px', background: 'rgba(139,92,246,0.15)', filter: 'blur(80px)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: '200px', height: '200px', background: 'rgba(236,72,153,0.1)', filter: 'blur(70px)', borderRadius: '50%' }} />

        <div>
          <button style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            marginBottom: '3rem'
          }} onClick={onBack}>
            <ChevronLeft size={14} /> Back to Home
          </button>

          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.15', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Build a winning CV in seconds on <span style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ResumeMaster</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ display: 'inline-flex', padding: '0.4rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}>⚡</span>
              <span style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' }}>Standardized, single-page print engine</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ display: 'inline-flex', padding: '0.4rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}>🔥</span>
              <span style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' }}>Automated parser scans PDF CV inputs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ display: 'inline-flex', padding: '0.4rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}>🚀</span>
              <span style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' }}>Predict and practice mock interviews</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
          &copy; {new Date().getFullYear()} resumemaster.online. Secure local MongoDB storage.
        </div>
      </div>

      {/* RIGHT PANEL: Sleek Registration Form */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '4rem 3.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Get Started</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Create your free developer profile to save unlimited resumes.</p>
          </div>

          {error && (
            <div style={{
              fontSize: '0.85rem',
              color: 'var(--color-danger)',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  type="email"
                  required
                  placeholder="jane.doe@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.9rem' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Free Account'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-dim)' }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-glow)' }} />
            <span style={{ padding: '0 0.75rem', fontSize: '0.8rem' }}>or sign up with</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-glow)' }} />
          </div>

          <div id="google-signup-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} />

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already registered?{' '}
            <button style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-primary-hover)',
              fontWeight: 'bold',
              cursor: 'pointer',
              textDecoration: 'underline'
            }} onClick={onNavigateToLogin}>
              Sign In
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
