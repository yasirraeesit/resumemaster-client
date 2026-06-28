import React, { useState, useEffect } from 'react';
import {
  FileText, Award, Briefcase, MapPin, Mail, Globe,
  Link2, GitBranch, Sparkles, TrendingUp, Clock, Star,
  ChevronRight, Edit3, Trash2, Copy, Check, ShieldAlert, CheckCircle, X
} from 'lucide-react';

function useCountUp(target, duration = 900) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) {
      setCount(0);
      return;
    }
    let val = 0;
    const step = Math.ceil(target / (duration / 16));
    const t = setInterval(() => {
      val += step;
      if (val >= target) { setCount(target); clearInterval(t); }
      else setCount(val);
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return count;
}

export default function ProfilePage({ user, token, resumeData, onNavigate, onGoSettings, onUpdateUser }) {
  const [stats, setStats]           = useState({ resumes: 0, documents: 0, jobs: 0 });
  const [resumes, setResumes]       = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading]       = useState(true);
  
  // Interactive UI states
  const [activeGalleryTab, setActiveGalleryTab] = useState('resumes'); // 'resumes' | 'documents'
  
  // Document Preview Modal State
  const [previewDoc, setPreviewDoc] = useState(null);
  const [copied, setCopied] = useState(false);

  // Edit Profile Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  });
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // Upgrade Modal State (Subscription simulation)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isUpgraded, setIsUpgraded] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  const resumeCount = useCountUp(stats.resumes,   900);
  const docCount    = useCountUp(stats.documents, 900);
  const jobCount    = useCountUp(stats.jobs,       900);

  useEffect(() => {
    loadProfileData();
  }, [token]);

  const loadProfileData = async () => {
    setLoading(true);
    if (!token) {
      const jobs = JSON.parse(localStorage.getItem('resumemaster_job_tracker_guest') || '[]');
      setStats({
        resumes: 0,
        documents: 0,
        jobs: Array.isArray(jobs) ? jobs.length : 0,
      });
      setLoading(false);
      return;
    }

    try {
      const [rRes, dRes, jRes] = await Promise.all([
        fetch(`${API_URL}/resumes`,   { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/documents`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/job-applications`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const resumesData   = rRes.ok ? await rRes.json() : [];
      const documentsData = dRes.ok ? await dRes.json() : [];
      const jobsData      = jRes.ok ? await jRes.json() : [];

      setResumes(resumesData);
      setCoverLetters(documentsData);

      setStats({
        resumes:   Array.isArray(resumesData)   ? resumesData.length   : 0,
        documents: Array.isArray(documentsData) ? documentsData.length : 0,
        jobs:      Array.isArray(jobsData)      ? jobsData.length      : 0,
      });

      // Recent activity
      const recent = [
        ...(Array.isArray(documentsData) ? documentsData.map(d => ({
          id: d._id || d.id,
          icon: d.type === 'linkedin_post' ? Sparkles : Award,
          color: d.type === 'cover_letter' ? '#a78bfa' : d.type === 'linkedin_post' ? '#10b981' : '#3b82f6',
          label: d.type === 'cover_letter' ? 'Cover Letter' : d.type === 'linkedin_post' ? 'LinkedIn Post' : 'LinkedIn Profile',
          title: d.title,
          time:  d.createdAt,
          fullDoc: d
        })) : []),
        ...(Array.isArray(resumesData) ? resumesData.map(r => ({
          id: r.id || r._id,
          icon: FileText, color: '#10b981',
          label: 'Resume',
          title: r.title,
          time:  r.updatedAt || r.createdAt,
          fullDoc: r
        })) : []),
      ]
        .filter(a => a.time)
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 5);

      setRecentDocs(recent);
    } catch (e) {
      console.warn('ProfilePage load error', e);
    } finally {
      setLoading(false);
    }
  };

  // Delete Resume handler
  const handleDeleteResume = async (e, resumeId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this resume?')) return;

    try {
      const res = await fetch(`${API_URL}/resumes/${resumeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setResumes(prev => prev.filter(r => r.id !== resumeId && r._id !== resumeId));
        setStats(prev => ({ ...prev, resumes: Math.max(0, prev.resumes - 1) }));
      } else {
        alert('Failed to delete resume.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Document/Cover Letter handler
  const handleDeleteDocument = async (e, docId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      const res = await fetch(`${API_URL}/documents/${docId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCoverLetters(prev => prev.filter(d => d.id !== docId && d._id !== docId));
        setStats(prev => ({ ...prev, documents: Math.max(0, prev.documents - 1) }));
      } else {
        alert('Failed to delete document.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Load Resume into ResumeBuilder
  const handleLoadResume = (resume) => {
    setResumeData(resume.data);
    onNavigate('builder');
  };

  // Copy to clipboard helper
  const handleCopyContent = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Open Edit Profile Modal
  const handleOpenEditModal = () => {
    setEditForm({
      fullName: user?.fullName || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: ''
    });
    setEditError(null);
    setEditSuccess(null);
    setShowEditModal(true);
  };

  // Submit profile edits
  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    setEditError(null);
    setEditSuccess(null);
    setEditLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      
      if (!res.ok) {
        setEditError(data.error || 'Failed to update profile.');
      } else {
        setEditSuccess('Profile updated successfully!');
        if (onUpdateUser) {
          onUpdateUser(data.user);
        }
        setTimeout(() => {
          setShowEditModal(false);
        }, 1500);
      }
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const initials = (user?.fullName || '?')
    .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const timeAgo = (d) => {
    const s = (Date.now() - new Date(d)) / 1000;
    if (s < 60)    return 'just now';
    if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  // Locked Guest View
  if (!token) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', padding: '3rem 1rem', textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(139,92,246,0.1)', border: '1px dashed var(--color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-hover)',
          marginBottom: '1rem'
        }}>
          <ShieldAlert size={36} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Cloud Synchronization Locked</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '450px', margin: '0 auto', lineHeight: '1.5' }}>
            Register or sign in to save your custom resumes, track ATS keyword optimizations, generate speech simulations, and sync your pipelines.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button className="btn-primary" onClick={() => onNavigate('dashboard')} style={{ padding: '0.65rem 1.5rem' }}>
            Return to Dashboard
          </button>
          <button className="btn-secondary" onClick={onGoSettings} style={{ padding: '0.65rem 1.5rem' }}>
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Hero Header Card */}
      <div style={{
        borderRadius: '1.5rem',
        overflow: 'hidden',
        border: '1px solid rgba(139,92,246,0.2)',
        boxShadow: '0 0 60px rgba(139,92,246,0.08)',
      }}>
        {/* Cover gradient banner */}
        <div style={{
          height: 130,
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 70%, #6d28d9 100%)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(139,92,246,0.3) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(236,72,153,0.2) 0%, transparent 50%)',
          }} />
          {/* Edit Profile trigger */}
          <button
            onClick={handleOpenEditModal}
            style={{
              position: 'absolute', top: '1rem', right: '1rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '0.5rem',
              color: 'var(--text-main)', cursor: 'pointer',
              padding: '0.4rem 0.8rem',
              fontSize: '0.8rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              backdropFilter: 'blur(8px)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <Edit3 size={13} /> Edit Profile
          </button>
        </div>

        {/* User stats + details summary */}
        <div style={{
          background: 'rgba(14,12,28,0.95)',
          padding: '0 2.5rem 2rem',
          display: 'flex', alignItems: 'flex-end', gap: '2rem',
          flexWrap: 'wrap',
        }}>
          {/* Glowing Avatar */}
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5, #8b5cf6, #ec4899)',
            border: '4px solid rgba(14,12,28,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)',
            marginTop: -48, flexShrink: 0,
            boxShadow: '0 0 0 2px rgba(139,92,246,0.4), 0 8px 24px rgba(0,0,0,0.4)',
          }}>
            {initials}
          </div>

          {/* Name & status tier */}
          <div style={{ flex: 1, paddingTop: '1.25rem', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                {user?.fullName}
              </h1>
              <span style={{
                background: isUpgraded
                  ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(52,211,153,0.15))'
                  : 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.15))',
                border: isUpgraded ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(139,92,246,0.3)',
                color: isUpgraded ? '#34d399' : '#a78bfa',
                borderRadius: '9999px',
                padding: '0.2rem 0.75rem', fontSize: '0.72rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '0.35rem',
              }}>
                <Sparkles size={11} /> {isUpgraded ? 'Premium Pro Tier' : 'Free Membership'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                <Mail size={13} /> {user?.email}
              </span>
              {resumeData?.personalInfo?.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                  <MapPin size={13} /> {resumeData.personalInfo.location}
                </span>
              )}
              {resumeData?.personalInfo?.title && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                  <TrendingUp size={13} /> {resumeData.personalInfo.title}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
        {[
          { Icon: FileText,  val: resumeCount, label: 'Resumes Saved',        grad: 'linear-gradient(135deg,#10b981,#34d399)', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.15)' },
          { Icon: Award,     val: docCount,    label: 'AI Docs Generated',    grad: 'linear-gradient(135deg,#8b5cf6,#a78bfa)', bg: 'rgba(139,92,246,0.07)', border: 'rgba(139,92,246,0.15)' },
          { Icon: Briefcase, val: jobCount,    label: 'Applications Tracked', grad: 'linear-gradient(135deg,#3b82f6,#60a5fa)', bg: 'rgba(59,130,246,0.07)',  border: 'rgba(59,130,246,0.15)'  },
        ].map(({ Icon, val, label, grad, bg, border }) => (
          <div key={label} style={{
            background: bg, border: `1px solid ${border}`,
            borderRadius: '1.1rem', padding: '1.4rem 1.6rem',
            display: 'flex', flexDirection: 'column', gap: '0.5rem',
            transition: 'transform 0.2s ease, border-color 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = border.replace('0.15', '0.35'); }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = border; }}
          >
            <Icon size={20} style={{ color: 'rgba(255,255,255,0.5)' }} />
            <div style={{ fontSize: '2.25rem', fontWeight: 900, lineHeight: 1, background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {loading ? '—' : val}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Subscription & Credit Balances Panel */}
      <div className="glass-card" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(139,92,246,0.03) 0%, rgba(236,72,153,0.02) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: '1 1 300px' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
            <Sparkles size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.25rem 0' }}>AI Tokens & Assistant usage</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '150px', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  width: isUpgraded ? '100%' : '85%',
                  background: 'linear-gradient(90deg, #8b5cf6, #ec4899)'
                }} />
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {isUpgraded ? 'Unlimited' : '85 / 100 queries left'}
              </span>
            </div>
          </div>
        </div>
        
        {!isUpgraded && (
          <button className="btn-primary" onClick={() => setShowUpgradeModal(true)} style={{ gap: '0.4rem', fontSize: '0.82rem', padding: '0.5rem 1.2rem' }}>
            Upgrade Membership
          </button>
        )}
      </div>

      {/* Main Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Saved Items Interactive Gallery */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: '380px' }}>
          {/* Tab Switcher Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setActiveGalleryTab('resumes')}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: activeGalleryTab === 'resumes' ? 'var(--text-main)' : 'var(--text-dim)',
                  fontWeight: activeGalleryTab === 'resumes' ? 'bold' : 'normal',
                  fontSize: '0.9rem', padding: '0.25rem 0',
                  position: 'relative'
                }}
              >
                Saved Resumes ({resumes.length})
                {activeGalleryTab === 'resumes' && (
                  <div style={{ position: 'absolute', bottom: -10, left: 0, width: '100%', height: '2px', background: 'var(--color-primary-hover)' }} />
                )}
              </button>

              <button
                onClick={() => setActiveGalleryTab('documents')}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: activeGalleryTab === 'documents' ? 'var(--text-main)' : 'var(--text-dim)',
                  fontWeight: activeGalleryTab === 'documents' ? 'bold' : 'normal',
                  fontSize: '0.9rem', padding: '0.25rem 0',
                  position: 'relative'
                }}
              >
                AI Documents ({coverLetters.length})
                {activeGalleryTab === 'documents' && (
                  <div style={{ position: 'absolute', bottom: -10, left: 0, width: '100%', height: '2px', background: 'var(--color-primary-hover)' }} />
                )}
              </button>
            </div>
            
            {activeGalleryTab === 'resumes' ? (
              <button
                onClick={() => onNavigate('builder')}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-primary-hover)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.1rem', fontWeight: 600 }}
              >
                Build New <ChevronRight size={13} />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('copilot')}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-primary-hover)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.1rem', fontWeight: 600 }}
              >
                Generate Copilot <ChevronRight size={13} />
              </button>
            )}
          </div>

          {/* Gallery Body */}
          {loading ? (
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', textAlign: 'center', padding: '3rem' }}>Loading Gallery Items...</div>
          ) : activeGalleryTab === 'resumes' ? (
            resumes.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '3rem 1rem', fontSize: '0.82rem' }}>
                <FileText size={32} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
                <p>No resumes saved yet. Make edits in the builder and save!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {resumes.map(r => (
                  <div
                    key={r.id || r._id}
                    className="gallery-card"
                    style={{
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleLoadResume(r)}
                  >
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 30px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.title}
                    </h4>
                    
                    <button
                      onClick={(e) => handleDeleteResume(e, r.id || r._id)}
                      style={{
                        position: 'absolute', top: '0.8rem', right: '0.8rem',
                        background: 'transparent', border: 'none', color: 'var(--text-dim)',
                        cursor: 'pointer', padding: '0.2rem'
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                    >
                      <Trash2 size={13} />
                    </button>

                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', gap: '0.5rem' }}>
                      <span>{(r.data?.skills?.length || 0)} skills</span>
                      <span>•</span>
                      <span>{(r.data?.experience?.length || 0)} experiences</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        Updated {timeAgo(r.updatedAt || r.createdAt)}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-primary-hover)', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                        Load <ChevronRight size={10} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // AI Documents Tab
            coverLetters.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '3rem 1rem', fontSize: '0.82rem' }}>
                <Award size={32} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
                <p>No AI cover letters or documents saved yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {coverLetters.map(d => (
                  <div
                    key={d.id || d._id}
                    className="gallery-card"
                    onClick={() => setPreviewDoc(d)}
                    style={{
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                  >
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 30px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {d.title}
                    </h4>

                    <button
                      onClick={(e) => handleDeleteDocument(e, d.id || d._id)}
                      style={{
                        position: 'absolute', top: '0.8rem', right: '0.8rem',
                        background: 'transparent', border: 'none', color: 'var(--text-dim)',
                        cursor: 'pointer', padding: '0.2rem'
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                    >
                      <Trash2 size={13} />
                    </button>

                    <span style={{
                      fontSize: '0.68rem',
                      alignSelf: 'flex-start',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      background: d.type === 'cover_letter' ? 'rgba(167,139,250,0.1)' : d.type === 'linkedin_post' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)',
                      color: d.type === 'cover_letter' ? '#a78bfa' : d.type === 'linkedin_post' ? '#10b981' : '#60a5fa',
                      fontWeight: 'bold'
                    }}>
                      {d.type === 'cover_letter' ? 'Cover Letter' : d.type === 'linkedin_post' ? 'LinkedIn Post' : 'LinkedIn Profile'}
                    </span>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        Saved {timeAgo(d.createdAt)}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-primary-hover)', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                        View <ChevronRight size={10} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Recent Activity Feed */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', height: '100%' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
            <Clock size={16} style={{ color: 'var(--color-primary)' }} /> Recent Activity
          </h3>

          {loading ? (
            <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem', padding: '1.5rem', textAlign: 'center' }}>Loading...</div>
          ) : recentDocs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={24} style={{ opacity: 0.3 }} />
              <div>No activity yet.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {recentDocs.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (item.label === 'Resume') {
                        handleLoadResume(item.fullDoc);
                      } else {
                        setPreviewDoc(item.fullDoc);
                      }
                    }}
                    style={{
                      display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                      padding: '0.65rem', background: 'rgba(255,255,255,0.01)',
                      borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.03)',
                      cursor: 'pointer', transition: 'border-color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)'}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={13} style={{ color: item.color }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.7rem', color: item.color, fontWeight: 700, marginBottom: '0.05rem' }}>{item.label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>{timeAgo(item.time)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile details modal */}
      {showEditModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="glass-card" style={{
            width: '100%', maxWidth: '420px', background: 'rgba(15, 12, 30, 0.95)',
            border: '1.5px solid rgba(139,92,246,0.3)', borderRadius: '1.25rem', padding: '1.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>Update Profile Details</h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {editError && (
              <div style={{ fontSize: '0.8rem', color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.2)' }}>
                {editError}
              </div>
            )}
            
            {editSuccess && (
              <div style={{ fontSize: '0.8rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(16,185,129,0.2)' }}>
                {editSuccess}
              </div>
            )}

            <form onSubmit={handleEditProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  required
                  value={editForm.fullName}
                  onChange={e => setEditForm(p => ({ ...p, fullName: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  value={editForm.email}
                  onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                />
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  Leave password fields blank if you do not wish to change your password.
                </span>
                
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={editForm.currentPassword}
                    onChange={e => setEditForm(p => ({ ...p, currentPassword: e.target.value }))}
                    placeholder="••••••••"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={editForm.newPassword}
                    onChange={e => setEditForm(p => ({ ...p, newPassword: e.target.value }))}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document View & Copy Modal */}
      {previewDoc && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="glass-card" style={{
            width: '100%', maxWidth: '550px', background: 'rgba(15, 12, 30, 0.95)',
            border: '1.5px solid rgba(139,92,246,0.3)', borderRadius: '1.25rem', padding: '1.75rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>
                {previewDoc.title}
              </h3>
              <button onClick={() => setPreviewDoc(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <span style={{
              fontSize: '0.7rem',
              color: previewDoc.type === 'cover_letter' ? '#a78bfa' : previewDoc.type === 'linkedin_post' ? '#10b981' : '#60a5fa',
              background: previewDoc.type === 'cover_letter' ? 'rgba(167,139,250,0.1)' : previewDoc.type === 'linkedin_post' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)',
              padding: '0.15rem 0.4rem', borderRadius: '4px', alignSelf: 'flex-start', fontWeight: 'bold'
            }}>
              {previewDoc.type === 'cover_letter' ? 'Cover Letter' : previewDoc.type === 'linkedin_post' ? 'LinkedIn Post' : 'LinkedIn Profile'}
            </span>

            {/* Document Content Display */}
            <div style={{
              background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '0.75rem', padding: '1rem', maxHeight: '300px', overflowY: 'auto'
            }}>
              <p style={{
                fontSize: '0.82rem', color: 'var(--text-muted)',
                lineHeight: '1.5', margin: 0, whiteSpace: 'pre-wrap'
              }}>
                {previewDoc.content}
              </p>
            </div>

            {/* Modal Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <button
                className="btn-secondary"
                onClick={() => handleCopyContent(previewDoc.content)}
                style={{ gap: '0.35rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center' }}
              >
                {copied ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
                {copied ? 'Copied to Clipboard' : 'Copy Full Content'}
              </button>
              <button className="btn-primary" onClick={() => setPreviewDoc(null)} style={{ fontSize: '0.78rem' }}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription upgrade checkout simulation modal */}
      {showUpgradeModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="glass-card" style={{
            width: '100%', maxWidth: '450px', background: 'rgba(15, 12, 30, 0.95)',
            border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '1.25rem', padding: '1.75rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '1.25rem',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowUpgradeModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            
            <div style={{
              width: 60, height: 60, borderRadius: '50%', background: 'rgba(16,185,129,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', margin: '0 auto'
            }}>
              <Sparkles size={28} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 0.25rem 0' }}>
                Upgrade to Premium Pro
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Unlock unrestricted access to our ultimate career suite
              </p>
            </div>

            {/* Features checkmarks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', textAlign: 'left', background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.03)' }}>
              {[
                'Unlimited PDF exports & font pairings',
                'Unlimited AI Cover Letters (no daily token bounds)',
                'Full ATS keyword optimization checkmarks',
                'Advanced speech prep simulator coaching grades'
              ].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <CheckCircle size={13} style={{ color: '#10b981', flexShrink: 0 }} /> {f}
                </div>
              ))}
            </div>

            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)' }}>
              $9.99 <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-dim)' }}>/ month</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                className="btn-primary"
                onClick={() => {
                  setIsUpgraded(true);
                  setShowUpgradeModal(false);
                }}
                style={{ padding: '0.65rem 0', background: 'linear-gradient(135deg, #10b981, #34d399)', borderColor: 'transparent' }}
              >
                Checkout Upgrade
              </button>
              <button className="btn-secondary" onClick={() => setShowUpgradeModal(false)} style={{ padding: '0.65rem 0' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
