import React, { useState, useEffect } from 'react';
import {
  FileText, Award, Briefcase, MapPin, Mail, Globe,
  Link2, GitBranch, Sparkles, TrendingUp, Clock, Star,
  ChevronRight, Edit3
} from 'lucide-react';

function useCountUp(target, duration = 900) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
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

export default function ProfilePage({ user, token, resumeData, onNavigate, onGoSettings }) {
  const [stats, setStats]           = useState({ resumes: 0, documents: 0, jobs: 0 });
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading]       = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  const resumeCount = useCountUp(stats.resumes,   900);
  const docCount    = useCountUp(stats.documents, 900);
  const jobCount    = useCountUp(stats.jobs,       900);

  useEffect(() => {
    const load = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const [rRes, dRes] = await Promise.all([
          fetch(`${API_URL}/resumes`,   { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/documents`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const resumes   = rRes.ok ? await rRes.json() : [];
        const documents = dRes.ok ? await dRes.json() : [];
        const jobs = JSON.parse(localStorage.getItem('jobTrackerItems') || '[]');

        setStats({
          resumes:   Array.isArray(resumes)   ? resumes.length   : 0,
          documents: Array.isArray(documents) ? documents.length : 0,
          jobs:      Array.isArray(jobs)      ? jobs.length      : 0,
        });

        const recent = [
          ...(Array.isArray(documents) ? documents.slice(0, 3).map(d => ({
            icon: Award, color: '#a78bfa',
            label: d.type === 'cover_letter' ? 'Cover Letter' : 'LinkedIn Opt.',
            title: d.title,
            time:  d.createdAt,
          })) : []),
          ...(Array.isArray(resumes) ? resumes.slice(0, 2).map(r => ({
            icon: FileText, color: '#10b981',
            label: 'Resume',
            title: r.title,
            time:  r.createdAt,
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
    load();
  }, [token]);

  const initials = (user?.fullName || '?')
    .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const timeAgo = (d) => {
    const s = (Date.now() - new Date(d)) / 1000;
    if (s < 60)    return 'just now';
    if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* ── Hero Card ─────────────────────────────────────────── */}
      <div style={{
        borderRadius: '1.5rem',
        overflow: 'hidden',
        border: '1px solid rgba(139,92,246,0.2)',
        boxShadow: '0 0 60px rgba(139,92,246,0.08)',
      }}>
        {/* Cover gradient */}
        <div style={{
          height: 130,
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 70%, #6d28d9 100%)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(139,92,246,0.3) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(236,72,153,0.2) 0%, transparent 50%)',
          }} />
          {/* Edit button */}
          <button
            onClick={onGoSettings}
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

        {/* Avatar + info */}
        <div style={{
          background: 'rgba(14,12,28,0.95)',
          padding: '0 2.5rem 2rem',
          display: 'flex', alignItems: 'flex-end', gap: '2rem',
          flexWrap: 'wrap',
        }}>
          {/* Avatar */}
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

          {/* Name & meta */}
          <div style={{ flex: 1, paddingTop: '1.25rem', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                {user?.fullName}
              </h1>
              <span style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.15))',
                border: '1px solid rgba(139,92,246,0.3)',
                color: '#a78bfa', borderRadius: '9999px',
                padding: '0.2rem 0.75rem', fontSize: '0.72rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '0.35rem',
              }}>
                <Sparkles size={11} /> Free Plan
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

      {/* ── Stats Row ─────────────────────────────────────────── */}
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

      {/* ── Bottom Grid ───────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Resume Summary */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} style={{ color: '#10b981' }} /> Current Resume
            </h3>
            <button
              onClick={() => onNavigate('builder')}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-primary-hover)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              Edit <ChevronRight size={13} />
            </button>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{resumeData?.personalInfo?.fullName || 'Untitled'}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{resumeData?.personalInfo?.title || 'No title set'}</div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Skills',      val: resumeData?.skills?.length || 0 },
                { label: 'Experiences', val: resumeData?.experience?.length || 0 },
                { label: 'Projects',    val: resumeData?.projects?.length || 0 },
              ].map(({ label, val }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>{val}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {resumeData?.personalInfo?.linkedin && (
            <a href={`https://${resumeData.personalInfo.linkedin}`} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'none' }}>
              <Link2 size={13} /> {resumeData.personalInfo.linkedin}
            </a>
          )}
          {resumeData?.personalInfo?.github && (
            <a href={`https://${resumeData.personalInfo.github}`} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
              <GitBranch size={13} /> {resumeData.personalInfo.github}
            </a>
          )}
        </div>

        {/* Recent Activity */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} style={{ color: 'var(--color-primary)' }} /> Recent Activity
          </h3>

          {loading ? (
            <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem', padding: '1.5rem', textAlign: 'center' }}>Loading...</div>
          ) : recentDocs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={24} style={{ opacity: 0.3 }} />
              No activity yet. Start by generating a cover letter!
            </div>
          ) : recentDocs.map((item, i) => {
            const { Icon } = item;
            return (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.65rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={13} style={{ color: item.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.72rem', color: item.color, fontWeight: 600, marginBottom: '0.1rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>{timeAgo(item.time)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
