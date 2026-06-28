import React, { useState, useEffect, useRef } from 'react';
import {
  FileText, Briefcase, Award, TrendingUp,
  PlusCircle, ChevronRight, BarChart2, Clock, Star
} from 'lucide-react';

// Animated counter hook
function useCountUp(target, duration = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    if (target === 0) return;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export default function Dashboard({ user, token, onNavigate, resumeData }) {
  const [stats, setStats] = useState({ resumes: 0, documents: 0, jobs: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  const resumeCount  = useCountUp(stats.resumes,   900);
  const docCount     = useCountUp(stats.documents, 900);
  const jobCount     = useCountUp(stats.jobs,       900);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        const jobsRaw = localStorage.getItem('resumemaster_job_tracker_guest');
        const jobs = jobsRaw ? JSON.parse(jobsRaw) : [];
        setStats({
          resumes: 0,
          documents: 0,
          jobs: Array.isArray(jobs) ? jobs.length : 0,
        });
        setLoading(false);
        return;
      }
      try {
        const [resumeRes, docRes, jobRes] = await Promise.all([
          fetch(`${API_URL}/resumes`,   { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/documents`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/job-applications`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const resumes   = resumeRes.ok   ? await resumeRes.json()   : [];
        const documents = docRes.ok      ? await docRes.json()      : [];
        const jobs      = jobRes.ok      ? await jobRes.json()      : [];

        setStats({
          resumes:   Array.isArray(resumes)   ? resumes.length   : 0,
          documents: Array.isArray(documents) ? documents.length : 0,
          jobs:      Array.isArray(jobs)      ? jobs.length      : 0,
        });

        // Build activity feed from documents + resumes
        const activity = [
          ...( Array.isArray(documents) ? documents.slice(0, 3).map(d => ({
            icon: Award,
            color: '#a78bfa',
            text: `Saved ${d.type === 'cover_letter' ? 'cover letter' : 'LinkedIn optimization'}: "${d.title}"`,
            time: d.createdAt,
          })) : []),
          ...( Array.isArray(resumes) ? resumes.slice(0, 2).map(r => ({
            icon: FileText,
            color: '#10b981',
            text: `Saved resume: "${r.title}"`,
            time: r.createdAt,
          })) : []),
        ]
          .filter(a => a.time)
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 5);

        setRecentActivity(activity);
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60)    return 'just now';
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const QUICK_ACTIONS = [
    { label: 'Resume Builder',    tab: 'builder',  Icon: FileText, color: '#10b981', desc: 'Edit & export your resume' },
    { label: 'Career Copilot',   tab: 'copilot',  Icon: Award,    color: '#a78bfa', desc: 'AI cover letters & mock interviews' },
    { label: 'Job Tracker',       tab: 'tracker',  Icon: Briefcase,color: '#3b82f6', desc: 'Track your applications' },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>

      {/* Welcome Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(79,70,229,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(236,72,153,0.08) 100%)',
        border: '1px solid rgba(139,92,246,0.25)',
        borderRadius: '1.25rem',
        padding: '2rem 2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 500 }}>
            {greeting()},
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            {user?.fullName || 'Welcome back'} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Here's your career progress at a glance.
          </p>
        </div>
        <button
          className="btn-primary"
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', gap: '0.5rem' }}
          onClick={() => onNavigate('builder')}
        >
          <PlusCircle size={18} /> Build New Resume
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
        <div className="stat-card">
          <FileText size={22} style={{ color: '#10b981' }} />
          <div className="stat-card-value" style={{ backgroundImage: 'linear-gradient(135deg, #10b981, #34d399)' }}>
            {loading ? '—' : resumeCount}
          </div>
          <div className="stat-card-label">Resumes Saved</div>
        </div>
        <div className="stat-card">
          <Award size={22} style={{ color: '#a78bfa' }} />
          <div className="stat-card-value">
            {loading ? '—' : docCount}
          </div>
          <div className="stat-card-label">AI Documents Generated</div>
        </div>
        <div className="stat-card">
          <Briefcase size={22} style={{ color: '#3b82f6' }} />
          <div className="stat-card-value" style={{ backgroundImage: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }}>
            {loading ? '—' : jobCount}
          </div>
          <div className="stat-card-label">Applications Tracked</div>
        </div>
      </div>

      {/* Quick Actions + Activity Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.5rem' }}>

        {/* Quick Actions */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} style={{ color: 'var(--color-primary)' }} /> Quick Actions
          </h2>
          {QUICK_ACTIONS.map(({ label, tab, Icon, color, desc }) => (
            <button
              key={tab}
              onClick={() => onNavigate(tab)}
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '0.75rem',
                padding: '0.9rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                width: '100%',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(139,92,246,0.07)';
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.025)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: '0.6rem',
                background: `${color}18`,
                border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{desc}</div>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
            </button>
          ))}
        </div>

        {/* Activity Feed */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <h2 style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} style={{ color: 'var(--color-primary)' }} /> Recent Activity
          </h2>

          {loading ? (
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>Loading...</div>
          ) : recentActivity.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '2.5rem 1rem',
              color: 'var(--text-dim)', fontSize: '0.85rem',
              background: 'rgba(255,255,255,0.01)',
              border: '1px dashed rgba(255,255,255,0.07)',
              borderRadius: '0.75rem',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
            }}>
              <Star size={28} style={{ color: 'var(--text-dim)' }} />
              <div>No activity yet.</div>
              <div style={{ fontSize: '0.75rem' }}>Generate a cover letter or save a resume to get started.</div>
            </div>
          ) : (
            recentActivity.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} style={{
                  display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '0.6rem',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: `${item.color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={14} style={{ color: item.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, wordBreak: 'break-word' }}>
                      {item.text}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                      {timeAgo(item.time)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Resume Preview Teaser */}
      <div className="glass-card" style={{
        padding: '1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem',
        background: 'rgba(16,185,129,0.04)',
        border: '1px solid rgba(16,185,129,0.15)',
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '0.75rem',
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BarChart2 size={22} style={{ color: '#10b981' }} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Current Resume: {resumeData?.personalInfo?.fullName || 'Untitled'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {resumeData?.personalInfo?.title || 'No title set'} · {resumeData?.skills?.length || 0} skills · {resumeData?.experience?.length || 0} experiences
            </div>
          </div>
        </div>
        <button
          className="btn-primary"
          style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', gap: '0.4rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}
          onClick={() => onNavigate('builder')}
        >
          <FileText size={15} /> Open Resume Builder <ChevronRight size={15} />
        </button>
      </div>

    </div>
  );
}
