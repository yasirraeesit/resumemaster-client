import React, { useState, useRef, useEffect, useCallback } from 'react';
import LandingPage    from './components/LandingPage';
import ResumeBuilder  from './components/ResumeBuilder';
import JobTracker     from './components/JobTracker';
import CareerSuite    from './components/CareerSuite';
import LoginPage      from './components/LoginPage';
import RegisterPage   from './components/RegisterPage';
import ProfilePage    from './components/ProfilePage';
import SettingsPage   from './components/SettingsPage';
import Dashboard      from './components/Dashboard';
import TemplatesLibraryPage from './components/TemplatesLibraryPage';
import { ToastProvider } from './components/Toast';
import {
  FileText, Briefcase, Award,
  LogIn, LayoutDashboard, Settings, LogOut, User, Sun, Moon, LayoutGrid,
} from 'lucide-react';

/* ── Demo resume data ───────────────────────────────────────────── */
const INITIAL_RESUME = {
  personalInfo: {
    fullName: 'Jane Doe', title: 'Senior Frontend Engineer',
    email: 'jane.doe@example.com', phone: '(555) 019-2834',
    location: 'San Francisco, CA', linkedin: 'linkedin.com/in/janedoe',
    github: 'github.com/janedoe', website: 'janedoe.dev',
  },
  summary: 'Innovative Senior Frontend Engineer with 6+ years of experience building high-performance web apps.',
  skills: ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS Variables', 'Next.js', 'REST APIs', 'Git'],
  experience: [{
    company: 'TechCorp Solutions', role: 'Senior Software Engineer',
    startDate: 'Jan 2021', endDate: 'Present',
    description: '• Developed optimized state management, cutting API load latency by 35%.\n• Built modular CSS variable design systems across 4 teams.',
  }],
  education: [{
    school: 'University of California, Berkeley',
    degree: 'B.S. in Computer Science', startDate: '2014', endDate: '2018',
  }],
  projects: [{
    name: 'Dynamic CSS Sandbox',
    description: '• Interactive CSS variable playground, 5,000+ monthly developers.',
    url: 'github.com/janedoe/sandbox',
  }],
  sections: ['summary', 'skills', 'experience', 'education', 'projects'],
};

/* ── Default Kanban board state (shared between Matcher + Tracker) ── */
const INITIAL_TRACKER_COLUMNS = {
  wishlist: {
    title: 'Wishlist',
    color: '#8b5cf6',
    items: [
      { id: '1', company: 'Stripe', role: 'Staff Frontend Engineer', salary: '$180k - $220k', date: '2026-06-22', notes: 'Tailor resume for API patterns.' }
    ]
  },
  applied: {
    title: 'Applied',
    color: '#3b82f6',
    items: [
      { id: '2', company: 'Airbnb', role: 'Senior React Developer', salary: '$165k - $190k', date: '2026-06-20', notes: 'Submitted tailored resume.' }
    ]
  },
  interviewing: {
    title: 'Interviewing',
    color: '#f59e0b',
    items: [
      { id: '3', company: 'Google', role: 'UX Engineer', salary: '$200k', date: '2026-06-24', notes: 'Technical round scheduled.' }
    ]
  },
  offered:  { title: 'Offered',  color: '#10b981', items: [] },
  rejected: { title: 'Rejected', color: '#ef4444', items: [] }
};

/* ── Workspace pages (not shown in top nav — accessed via dropdown) ─ */
const HIDDEN_PAGES = new Set(['profile', 'settings']);

const NAV_TABS = [
  { key: 'dashboard', label: 'Dashboard',       Icon: LayoutDashboard },
  { key: 'templates', label: 'Resumes Library', Icon: LayoutGrid      },
  { key: 'builder',   label: 'Resume Builder',  Icon: FileText        },
  { key: 'tracker',   label: 'Job Tracker',     Icon: Briefcase       },
  { key: 'copilot',   label: 'Career Copilot',  Icon: Award           },
];

/* ═══════════════════════════════════════════════════════════════════
   ProfileDropdown
   ═══════════════════════════════════════════════════════════════════ */
function ProfileDropdown({ user, onGoProfile, onGoSettings, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const initials = (user.fullName || '?')
    .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const Item = ({ onClick, icon: Icon, label, danger }) => (
    <button
      onClick={() => { setOpen(false); onClick(); }}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem',
        padding: '0.65rem 0.75rem', borderRadius: '0.6rem',
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: danger ? '#ef4444' : 'var(--text-muted)',
        fontSize: '0.85rem', fontWeight: 500,
        transition: 'all 0.15s ease', textAlign: 'left',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.08)' : 'rgba(139,92,246,0.1)';
        if (!danger) e.currentTarget.style.color = '#fff';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = danger ? '#ef4444' : 'var(--text-muted)';
      }}
    >
      <Icon size={15} style={{ color: danger ? '#ef4444' : 'var(--color-primary)', flexShrink: 0 }} />
      {label}
    </button>
  );

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* ── Avatar bubble ── */}
      <button
        onClick={() => setOpen(v => !v)}
        title={user.fullName}
        style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
          border: open ? '2px solid #a78bfa' : '2px solid rgba(139,92,246,0.4)',
          cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.78rem', fontWeight: 800, color: '#fff',
          boxShadow: open ? '0 0 0 4px rgba(139,92,246,0.18)' : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        {initials}
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          minWidth: 228,
          background: 'rgba(10,9,20,0.98)',
          border: '1px solid rgba(139,92,246,0.22)',
          borderRadius: '1rem',
          boxShadow: '0 24px 64px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          overflow: 'hidden',
          zIndex: 9999,
          animation: 'toastSlideIn 0.18s cubic-bezier(0.34,1.56,0.64,1)',
        }}>

          {/* User info */}
          <div style={{ padding: '1rem 1rem 0.8rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: 800, color: '#fff',
              marginBottom: '0.6rem',
            }}>
              {initials}
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginBottom: '0.1rem' }}>
              {user.fullName}
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)', wordBreak: 'break-all' }}>
              {user.email}
            </div>
          </div>

          {/* Nav items */}
          <div style={{ padding: '0.4rem' }}>
            <Item onClick={onGoProfile}  icon={User}     label="My Profile" />
            <Item onClick={onGoSettings} icon={Settings} label="Settings"   />
          </div>

          {/* Logout */}
          <div style={{ padding: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Item onClick={onLogout} icon={LogOut} label="Sign Out" danger />
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Shared App Header
   ═══════════════════════════════════════════════════════════════════ */
function AppHeader({ user, onLogoClick, onSignIn, onGetStarted, darkMode, toggleTheme, onGoProfile, onGoSettings, onLogout, children }) {
  return (
    <header className="app-header">
      <div className="header-content">

        {/* Logo */}
        <a href="#" className="logo" onClick={e => { e.preventDefault(); onLogoClick(); }}
          style={{ textDecoration: 'none', fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
          Resume<span className="logo-highlight">Master</span>
        </a>

        {/* Center nav slot */}
        {children}

        {/* Right controls */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle theme">
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          {user ? (
            <ProfileDropdown
              user={user}
              onGoProfile={onGoProfile}
              onGoSettings={onGoSettings}
              onLogout={onLogout}
            />
          ) : (
            <>
              <button className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', gap: '0.35rem' }} onClick={onSignIn}>
                <LogIn size={14} /> Sign In
              </button>
              <button className="btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }} onClick={onGetStarted}>
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ROOT APP
   ═══════════════════════════════════════════════════════════════════ */
export default function App() {
  /* ── Core state ─────────────────────────────────────────────────── */
  const [token,      setToken]      = useState(() => localStorage.getItem('token') || '');
  const [user,       setUser]       = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [view,       setView]       = useState(() => {
    const savedUser = localStorage.getItem('user');
    const savedView = localStorage.getItem('view');
    if (savedUser) {
      return savedView || 'workspace';
    }
    return 'landing';
  });
  const [activeTab,  setActiveTab]  = useState(() => {
    return localStorage.getItem('activeTab') || 'dashboard';
  });
  const [resumeData,       setResumeData]       = useState(INITIAL_RESUME);
  const [selectedTemplate, setSelectedTemplate] = useState('elegant');
  const [trackerColumns,   setTrackerColumns]   = useState(INITIAL_TRACKER_COLUMNS);
  const [darkMode,         setDarkMode]         = useState(true);

  // Sync view and active workspace tab to localStorage
  useEffect(() => {
    localStorage.setItem('view', view);
    if (view === 'workspace') {
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab, view]);

  // Sync right-swipe jobs from Matcher → Tracker Wishlist
  const addToTrackerWishlist = useCallback((job) => {
    const newCard = {
      id: `synced_${Date.now()}`,
      company: job.company,
      role: job.title,
      salary: '',
      date: new Date().toISOString().split('T')[0],
      notes: `Auto-synced from Job Matcher. ${job.location ? `Location: ${job.location}.` : ''}`.trim(),
      url: job.url || ''
    };
    setTrackerColumns(prev => ({
      ...prev,
      wishlist: {
        ...prev.wishlist,
        items: [...prev.wishlist.items, newCard]
      }
    }));
  }, []);

  /* ── Helpers ──────────────────────────────────────────────────────  */
  const toggleTheme = () => {
    setDarkMode(d => {
      document.documentElement.setAttribute('data-theme', !d ? 'dark' : 'light');
      return !d;
    });
  };

  const navigate = useCallback((tab) => {
    setView('workspace');
    setActiveTab(tab);
  }, []);

  const goToWorkspace = useCallback(() => navigate('dashboard'), [navigate]);
  const goToProfile   = useCallback(() => navigate('profile'),   [navigate]);
  const goToSettings  = useCallback(() => navigate('settings'),  [navigate]);
  const goToLanding   = useCallback(() => setView('landing'),    []);

  const handleAuthSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    navigate('dashboard');
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('view');
    localStorage.removeItem('activeTab');
    setActiveTab('dashboard');
    setView('landing');
  };

  const updateUser = (u) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const handleGuestLogin = () => {
    const guestUser = { id: 'guest', fullName: 'Guest User', email: 'guest@resumemaster.online' };
    setUser(guestUser);
    setToken('');
    localStorage.setItem('user', JSON.stringify(guestUser));
    localStorage.removeItem('token');
    setView('workspace');
    setActiveTab('builder');
  };

  const handleTemplatesClick = useCallback((e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (user) {
      navigate('templates');
    } else {
      const guestUser = { id: 'guest', fullName: 'Guest User', email: 'guest@resumemaster.online' };
      setUser(guestUser);
      setToken('');
      localStorage.setItem('user', JSON.stringify(guestUser));
      localStorage.removeItem('token');
      navigate('templates');
    }
  }, [user, navigate]);

  /* ── Auth pages ─────────────────────────────────────────────────── */
  if (view === 'login') {
    return (
      <ToastProvider>
        <main className="app-container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
          <LoginPage
            onBack={goToLanding}
            onAuthSuccess={handleAuthSuccess}
            onGuestLogin={handleGuestLogin}
            onNavigateToRegister={() => setView('register')}
          />
        </main>
      </ToastProvider>
    );
  }

  if (view === 'register') {
    return (
      <ToastProvider>
        <main className="app-container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
          <RegisterPage
            onBack={goToLanding}
            onAuthSuccess={handleAuthSuccess}
            onGuestLogin={handleGuestLogin}
            onNavigateToLogin={() => setView('login')}
          />
        </main>
      </ToastProvider>
    );
  }


  const headerProps = {
    user, darkMode, toggleTheme,
    onLogoClick:   goToLanding,
    onSignIn:      () => setView('login'),
    onGetStarted:  () => user ? goToWorkspace() : setView('register'),
    onGoProfile:   goToProfile,
    onGoSettings:  goToSettings,
    onLogout:      handleLogout,
  };

  /* ── Landing ────────────────────────────────────────────────────── */
  if (view === 'landing') {
    return (
      <ToastProvider>
        <div>
          <AppHeader {...headerProps}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <a href="#features" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Features</a>
              <a href="#templates" onClick={handleTemplatesClick} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Templates</a>
              <a href="#faq" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>FAQ</a>
              {user && (
                <button className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', marginLeft: '0.5rem' }} onClick={goToWorkspace}>
                  Go to Workspace
                </button>
              )}
            </div>
          </AppHeader>
          <LandingPage 
            onLaunchWorkspace={() => user ? goToWorkspace() : setView('register')} 
            onSelectTemplates={handleTemplatesClick}
          />
        </div>
      </ToastProvider>
    );
  }

  /* ── Workspace ──────────────────────────────────────────────────── */
  return (
    <ToastProvider>
      <div>
        <AppHeader {...headerProps}>
          <nav className="nav-tabs">
            {NAV_TABS.map(({ key, label, Icon }) => (
              <button
                key={key}
                className={`tab-btn ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </nav>
        </AppHeader>

        <main className="app-container" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
          <div key={activeTab} className="tab-content-animate">

            {activeTab === 'dashboard' && (
              <Dashboard user={user} token={token} resumeData={resumeData} onNavigate={setActiveTab} />
            )}
            {activeTab === 'templates' && (
              <TemplatesLibraryPage
                selectedTemplate={selectedTemplate}
                onSelectTemplate={(templateId) => {
                  setSelectedTemplate(templateId);
                  setActiveTab('builder');
                }}
              />
            )}
            {activeTab === 'builder' && (
              <ResumeBuilder 
                resumeData={resumeData} 
                setResumeData={setResumeData} 
                token={token} 
                onTriggerAuth={() => setView('login')}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                onSelectTemplatesLibrary={() => setActiveTab('templates')}
              />
            )}
            {activeTab === 'tracker' && (
              <JobTracker
                token={token}
                onNavigate={setActiveTab}
                setResumeData={setResumeData}
              />
            )}
            {activeTab === 'copilot' && (
              <CareerSuite resumeData={resumeData} token={token} />
            )}

            {/* ── Hidden pages — accessed via avatar dropdown only ── */}
            {activeTab === 'profile' && (
              <ProfilePage
                user={user || { fullName: 'Guest', email: '' }}
                token={token}
                resumeData={resumeData}
                onNavigate={setActiveTab}
                onGoSettings={goToSettings}
                onUpdateUser={updateUser}
              />
            )}
            {activeTab === 'settings' && (
              <SettingsPage
                user={user || { fullName: 'Guest', email: '' }}
                token={token}
                onLogout={handleLogout}
                onUpdateUser={updateUser}
                darkMode={darkMode}
                toggleTheme={toggleTheme}
              />
            )}

          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
