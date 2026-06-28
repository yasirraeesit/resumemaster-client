import React, { useState, useEffect } from 'react';
import {
  Plus, Trash2, ArrowRight, ArrowLeft, Briefcase, DollarSign,
  Calendar, Search, Filter, Link2, Edit2, FileText, Award, X, ExternalLink
} from 'lucide-react';

const COLUMNS = {
  wishlist: { title: 'Wishlist', color: '#8b5cf6' },
  applied: { title: 'Applied', color: '#3b82f6' },
  interviewing: { title: 'Interviewing', color: '#f59e0b' },
  offered: { title: 'Offered', color: '#10b981' },
  rejected: { title: 'Rejected', color: '#ef4444' }
};

const DEFAULT_GUEST_JOBS = [
  { id: '1', company: 'Stripe', role: 'Staff Frontend Engineer', salary: '$180k - $220k', date: '2026-06-22', notes: 'Tailor resume for API patterns.', status: 'wishlist' },
  { id: '2', company: 'Airbnb', role: 'Senior React Developer', salary: '$165k - $190k', date: '2026-06-20', notes: 'Submitted tailored resume.', status: 'applied' },
  { id: '3', company: 'Google', role: 'UX Engineer', salary: '$200k', date: '2026-06-24', notes: 'Technical round scheduled.', status: 'interviewing' }
];

export default function JobTracker({ token, onNavigate, setResumeData }) {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [resumeFilter, setResumeFilter] = useState('all'); // 'all', 'linked', 'unlinked'
  const [coverLetterFilter, setCoverLetterFilter] = useState('all'); // 'all', 'linked', 'unlinked'

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    salary: '',
    status: 'wishlist',
    date: '',
    notes: '',
    url: '',
    resumeId: '',
    coverLetterId: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    fetchJobs();
    if (token) {
      fetchResumesAndDocuments();
    }
  }, [token]);

  // Fetch all jobs
  const fetchJobs = async () => {
    setLoading(true);
    if (!token) {
      // Local storage fallback for guest users
      const saved = localStorage.getItem('resumemaster_job_tracker_guest');
      if (saved) {
        setJobs(JSON.parse(saved));
      } else {
        setJobs(DEFAULT_GUEST_JOBS);
        localStorage.setItem('resumemaster_job_tracker_guest', JSON.stringify(DEFAULT_GUEST_JOBS));
      }
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/job-applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error('Failed to fetch job applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user resumes and documents to enable mapping dropdowns
  const fetchResumesAndDocuments = async () => {
    try {
      const [resumesRes, docsRes] = await Promise.all([
        fetch(`${API_URL}/resumes`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/documents`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (resumesRes.ok) {
        const rData = await resumesRes.json();
        setResumes(rData);
      }
      if (docsRes.ok) {
        const dData = await docsRes.json();
        // Filter only cover letters
        setCoverLetters(dData.filter(d => d.type === 'cover_letter'));
      }
    } catch (err) {
      console.error('Failed to load mapping entities:', err);
    }
  };

  // Sync state helpers
  const saveJobsList = async (updatedJobs) => {
    setJobs(updatedJobs);
    if (!token) {
      localStorage.setItem('resumemaster_job_tracker_guest', JSON.stringify(updatedJobs));
    }
  };

  // Drag-and-drop or Arrow button movement handlers
  const moveCard = async (cardId, fromCol, toCol) => {
    const updatedJobs = jobs.map(job => {
      if (job.id === cardId) {
        return { ...job, status: toCol };
      }
      return job;
    });

    await saveJobsList(updatedJobs);

    // Backend sync
    if (token) {
      try {
        await fetch(`${API_URL}/job-applications/${cardId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: toCol })
        });
      } catch (err) {
        console.error('Failed to update stage on backend:', err);
      }
    }
  };

  // Delete Card
  const deleteCard = async (e, cardId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this job application?')) return;

    const updatedJobs = jobs.filter(job => job.id !== cardId);
    await saveJobsList(updatedJobs);

    if (token) {
      try {
        await fetch(`${API_URL}/job-applications/${cardId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Failed to delete on backend:', err);
      }
    }
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentJobId(null);
    setFormData({
      company: '',
      role: '',
      salary: '',
      status: 'wishlist',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      url: '',
      resumeId: '',
      coverLetterId: ''
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (job) => {
    setIsEditing(true);
    setCurrentJobId(job.id);
    setFormData({
      company: job.company,
      role: job.role,
      salary: job.salary || '',
      status: job.status,
      date: job.date || new Date().toISOString().split('T')[0],
      notes: job.notes || '',
      url: job.url || '',
      resumeId: job.resumeId || '',
      coverLetterId: job.coverLetterId || ''
    });
    setShowModal(true);
  };

  // Submit Add / Edit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role) return;

    if (isEditing) {
      // Editing
      const updatedJobs = jobs.map(job => {
        if (job.id === currentJobId) {
          return {
            ...job,
            ...formData,
            resumeId: formData.resumeId || null,
            coverLetterId: formData.coverLetterId || null
          };
        }
        return job;
      });
      await saveJobsList(updatedJobs);

      if (token) {
        try {
          await fetch(`${API_URL}/job-applications/${currentJobId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
          });
        } catch (err) {
          console.error('Failed to update job details on backend:', err);
        }
      }
    } else {
      // Adding
      const tempId = Date.now().toString();
      const newJob = {
        id: tempId,
        ...formData,
        resumeId: formData.resumeId || null,
        coverLetterId: formData.coverLetterId || null
      };

      if (!token) {
        await saveJobsList([...jobs, newJob]);
      } else {
        try {
          const res = await fetch(`${API_URL}/job-applications`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
          });
          if (res.ok) {
            const data = await res.json();
            setJobs(prev => [...prev, data.job]);
          }
        } catch (err) {
          console.error('Failed to create job application on backend:', err);
        }
      }
    }

    setShowModal(false);
  };

  // Handle document shortcut clicks
  const handleResumeBadgeClick = (e, resumeId) => {
    e.stopPropagation();
    const matched = resumes.find(r => r.id === resumeId || r._id === resumeId);
    if (matched) {
      setResumeData(matched.data);
      onNavigate('builder');
    }
  };

  const handleCoverLetterBadgeClick = (e) => {
    e.stopPropagation();
    onNavigate('copilot');
  };

  // Search & Filter computation
  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.notes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesResume =
      resumeFilter === 'all' ? true :
      resumeFilter === 'linked' ? !!job.resumeId : !job.resumeId;

    const matchesCoverLetter =
      coverLetterFilter === 'all' ? true :
      coverLetterFilter === 'linked' ? !!job.coverLetterId : !job.coverLetterId;

    return matchesSearch && matchesResume && matchesCoverLetter;
  });

  // Group filtered jobs by columns
  const groupedJobs = {
    wishlist: [],
    applied: [],
    interviewing: [],
    offered: [],
    rejected: []
  };

  filteredJobs.forEach(job => {
    if (groupedJobs[job.status]) {
      groupedJobs[job.status].push(job);
    } else {
      groupedJobs.wishlist.push(job);
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
      
      {/* Upper Pipeline Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800 }}>
          <Briefcase size={24} className="logo-highlight" />
          Job Search CRM Board
        </h2>
        <button className="btn-primary" onClick={handleOpenAdd} style={{ gap: '0.4rem', padding: '0.6rem 1.25rem' }}>
          <Plus size={16} /> Add Application
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="glass-card" style={{
        padding: '1rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '0.75rem'
      }}>
        {/* Search */}
        <div style={{ flex: '1 1 250px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            className="form-input"
            placeholder="Search company, role, or notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.25rem', height: '2.4rem', fontSize: '0.85rem' }}
          />
        </div>

        {/* Resume Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={13} style={{ color: 'var(--text-dim)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Resume:</span>
          <select
            value={resumeFilter}
            onChange={e => setResumeFilter(e.target.value)}
            style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '0.5rem',
              color: 'var(--text-main)',
              fontSize: '0.75rem',
              padding: '0.3rem 0.5rem',
              cursor: 'pointer'
            }}
          >
            <option value="all">All</option>
            <option value="linked">Linked</option>
            <option value="unlinked">Unlinked</option>
          </select>
        </div>

        {/* Cover Letter Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={13} style={{ color: 'var(--text-dim)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cover Letter:</span>
          <select
            value={coverLetterFilter}
            onChange={e => setCoverLetterFilter(e.target.value)}
            style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '0.5rem',
              color: 'var(--text-main)',
              fontSize: '0.75rem',
              padding: '0.3rem 0.5rem',
              cursor: 'pointer'
            }}
          >
            <option value="all">All</option>
            <option value="linked">Linked</option>
            <option value="unlinked">Unlinked</option>
          </select>
        </div>
      </div>

      {/* Kanban Pipeline Board Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>Loading Kanban Pipeline...</div>
      ) : (
        <div className="kanban-board" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          alignItems: 'start'
        }}>
          {Object.entries(COLUMNS).map(([colKey, col], colIndex) => {
            const colKeys = Object.keys(COLUMNS);
            const prevCol = colKeys[colIndex - 1];
            const nextCol = colKeys[colIndex + 1];
            const columnJobs = groupedJobs[colKey] || [];

            return (
              <div key={colKey} className="kanban-column" style={{
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid rgba(255, 255, 255, 0.03)',
                borderRadius: '0.85rem',
                padding: '0.85rem',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}>
                {/* Column Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '0.5rem',
                  borderBottom: '1.5px solid rgba(255,255,255,0.04)'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                    {col.title}
                  </span>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.4rem', borderRadius: '4px', color: 'var(--text-muted)' }}>
                    {columnJobs.length}
                  </span>
                </div>

                {/* Job Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                  {columnJobs.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '2rem 1rem',
                      color: 'var(--text-dim)',
                      fontSize: '0.75rem',
                      border: '1px dashed rgba(255,255,255,0.03)',
                      borderRadius: '0.5rem',
                      margin: '0.5rem 0'
                    }}>
                      Drop cards here
                    </div>
                  ) : (
                    columnJobs.map((job) => {
                      const associatedResume = resumes.find(r => r.id === job.resumeId || r._id === job.resumeId);
                      const associatedLetter = coverLetters.find(d => d.id === job.coverLetterId || d._id === job.coverLetterId);

                      return (
                        <div
                          key={job.id}
                          onClick={() => handleOpenEdit(job)}
                          className="kanban-card"
                          style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: '0.75rem',
                            padding: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.4rem',
                            transition: 'transform 0.15s ease, border-color 0.15s ease'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                            e.currentTarget.style.transform = 'none';
                          }}
                        >
                          {/* Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                              {job.role}
                            </h4>
                            <button
                              style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0 }}
                              onClick={(e) => deleteCard(e, job.id)}
                            >
                              <Trash2 size={13} style={{ transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#ef4444'} onMouseLeave={e => e.target.style.color = 'var(--text-dim)'} />
                            </button>
                          </div>

                          {/* Company */}
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-primary-hover)', fontWeight: 'bold' }}>
                            {job.company}
                          </div>

                          {/* Metadata Row */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.2rem' }}>
                            {job.salary && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <DollarSign size={11} style={{ flexShrink: 0 }} /> {job.salary}
                              </div>
                            )}
                            {job.date && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Calendar size={11} style={{ flexShrink: 0 }} /> {job.date}
                              </div>
                            )}
                          </div>

                          {/* Linked Document Badges */}
                          {(job.resumeId || job.coverLetterId) && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', margin: '0.3rem 0', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.4rem' }}>
                              {job.resumeId && (
                                <button
                                  onClick={(e) => handleResumeBadgeClick(e, job.resumeId)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    fontSize: '0.7rem',
                                    color: '#10b981',
                                    background: 'rgba(16,185,129,0.08)',
                                    border: '1px solid rgba(16,185,129,0.15)',
                                    borderRadius: '0.25rem',
                                    padding: '0.15rem 0.35rem',
                                    width: '100%',
                                    textAlign: 'left',
                                    cursor: 'pointer'
                                  }}
                                  title="Click to load in Resume Builder"
                                >
                                  <FileText size={10} style={{ flexShrink: 0 }} />
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    Resume: {associatedResume?.title || 'Loaded'}
                                  </span>
                                </button>
                              )}

                              {job.coverLetterId && (
                                <button
                                  onClick={handleCoverLetterBadgeClick}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    fontSize: '0.7rem',
                                    color: '#a78bfa',
                                    background: 'rgba(167,139,250,0.08)',
                                    border: '1px solid rgba(167,139,250,0.15)',
                                    borderRadius: '0.25rem',
                                    padding: '0.15rem 0.35rem',
                                    width: '100%',
                                    textAlign: 'left',
                                    cursor: 'pointer'
                                  }}
                                  title="Click to view in Career Copilot"
                                >
                                  <Award size={10} style={{ flexShrink: 0 }} />
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    Cover Letter: {associatedLetter?.title || 'Loaded'}
                                  </span>
                                </button>
                              )}
                            </div>
                          )}

                          {/* Notes Preview */}
                          {job.notes && (
                            <p style={{
                              fontSize: '0.72rem',
                              color: 'var(--text-dim)',
                              background: 'rgba(0,0,0,0.15)',
                              padding: '0.4rem',
                              borderRadius: '0.25rem',
                              margin: '0.2rem 0 0.4rem 0',
                              border: '1px solid rgba(255,255,255,0.02)',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              lineHeight: '1.3'
                            }}>
                              {job.notes}
                            </p>
                          )}

                          {/* Card Navigation Footer */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.4rem', marginTop: '0.2rem' }} onClick={e => e.stopPropagation()}>
                            {prevCol ? (
                              <button
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', padding: 0 }}
                                onClick={() => moveCard(job.id, colKey, prevCol)}
                              >
                                <ArrowLeft size={11} /> Back
                              </button>
                            ) : <span />}
                            {nextCol ? (
                              <button
                                style={{ background: 'transparent', border: 'none', color: 'var(--color-primary-hover)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', fontWeight: 'bold', padding: 0 }}
                                onClick={() => moveCard(job.id, colKey, nextCol)}
                              >
                                Next <ArrowRight size={11} />
                              </button>
                            ) : <span />}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CRM Add / Edit Dialog Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '550px',
            background: 'rgba(15, 12, 30, 0.95)',
            border: '1.5px solid rgba(139,92,246,0.3)',
            borderRadius: '1.25rem',
            padding: '1.75rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>
                {isEditing ? 'Modify Job Application' : 'Add New Application'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                
                {/* Company Name */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 'bold' }}>Company *</label>
                  <input
                    className="form-input"
                    required
                    value={formData.company}
                    onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                    placeholder="e.g. Stripe, Google"
                  />
                </div>

                {/* Job Position/Role */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 'bold' }}>Position / Role *</label>
                  <input
                    className="form-input"
                    required
                    value={formData.role}
                    onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                    placeholder="e.g. Frontend Developer"
                  />
                </div>

                {/* Salary */}
                <div className="form-group">
                  <label className="form-label">Salary Range</label>
                  <input
                    className="form-input"
                    value={formData.salary}
                    onChange={e => setFormData(p => ({ ...p, salary: e.target.value }))}
                    placeholder="e.g. $120k - $150k"
                  />
                </div>

                {/* Date */}
                <div className="form-group">
                  <label className="form-label">Target / Applied Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.date}
                    onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                  />
                </div>

                {/* Status Column */}
                <div className="form-group">
                  <label className="form-label">Pipeline Stage</label>
                  <select
                    className="form-input"
                    value={formData.status}
                    onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
                    style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {Object.entries(COLUMNS).map(([key, col]) => (
                      <option key={key} value={key} style={{ background: '#0e0b1c' }}>{col.title}</option>
                    ))}
                  </select>
                </div>

                {/* URL */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Application Link 
                    {formData.url && (
                      <a href={formData.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-hover)', display: 'inline-flex', alignItems: 'center' }}>
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://..."
                    value={formData.url}
                    onChange={e => setFormData(p => ({ ...p, url: e.target.value }))}
                  />
                </div>
              </div>

              {/* Document/Resume Link fields (Only available if logged in) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                {token ? (
                  <>
                    {/* Associated Resume */}
                    <div className="form-group">
                      <label className="form-label" style={{ color: '#10b981' }}>Link Resume Version</label>
                      <select
                        className="form-input"
                        value={formData.resumeId || ''}
                        onChange={e => setFormData(p => ({ ...p, resumeId: e.target.value }))}
                        style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <option value="" style={{ background: '#0e0b1c' }}>-- None Linked --</option>
                        {resumes.map(r => (
                          <option key={r.id || r._id} value={r.id || r._id} style={{ background: '#0e0b1c' }}>{r.title}</option>
                        ))}
                      </select>
                    </div>

                    {/* Associated Cover Letter */}
                    <div className="form-group">
                      <label className="form-label" style={{ color: '#a78bfa' }}>Link Cover Letter</label>
                      <select
                        className="form-input"
                        value={formData.coverLetterId || ''}
                        onChange={e => setFormData(p => ({ ...p, coverLetterId: e.target.value }))}
                        style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <option value="" style={{ background: '#0e0b1c' }}>-- None Linked --</option>
                        {coverLetters.map(c => (
                          <option key={c.id || c._id} value={c.id || c._id} style={{ background: '#0e0b1c' }}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.01)', borderRadius: '0.5rem', border: '1px dashed rgba(255,255,255,0.04)' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                      🔒 <a onClick={() => { setShowModal(false); onNavigate('profile'); }} style={{ color: 'var(--color-primary-hover)', cursor: 'pointer', textDecoration: 'underline' }}>Login</a> to associate specific resumes & cover letters with job cards.
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="form-group" style={{ marginTop: '0.25rem' }}>
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Paste referral contact, interview details, core stack, or follow-up tasks..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {isEditing ? 'Save Changes' : 'Create Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
