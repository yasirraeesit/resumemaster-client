import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, FileText, Download, Save, Plus, Trash2, ArrowRight, Target, X, CheckCircle, XCircle } from 'lucide-react';

export default function ResumeBuilder({ resumeData, setResumeData, token, onTriggerAuth }) {
  const [activeSubTab, setActiveSubTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [availableResumes, setAvailableResumes] = useState([]);
  const [parsingStatus, setParsingStatus] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('elegant');
  const [pdfExporting, setPdfExporting] = useState(false);
  const resumePreviewRef = useRef(null);

  // ATS Score Engine state
  const [showAtsPanel, setShowAtsPanel] = useState(false);
  const [atsJd, setAtsJd]               = useState('');
  const [atsLoading, setAtsLoading]     = useState(false);
  const [atsResult, setAtsResult]       = useState(null);

  useEffect(() => {
    fetchResumes();
  }, [token]);

  const fetchResumes = async () => {
    if (!token) {
      setAvailableResumes([]);
      return;
    }
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    try {
      const res = await fetch(`${API_URL}/resumes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableResumes(data);
      }
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
    }
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
  };

  const handleArrayFieldChange = (section, index, field, value) => {
    setResumeData(prev => {
      const updatedSection = [...prev[section]];
      updatedSection[index] = {
        ...updatedSection[index],
        [field]: value
      };
      return {
        ...prev,
        [section]: updatedSection
      };
    });
  };

  const addArrayItem = (section, template) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], template]
    }));
  };

  const removeArrayItem = (section, index) => {
    setResumeData(prev => {
      const updatedSection = [...prev[section]];
      updatedSection.splice(index, 1);
      return {
        ...prev,
        [section]: updatedSection
      };
    });
  };

  const handleSkillsChange = (e) => {
    const list = e.target.value.split(',').map(s => s.trim());
    setResumeData(prev => ({
      ...prev,
      skills: list
    }));
  };

  const handleEnhance = async (section, index, currentText) => {
    if (!currentText || currentText.trim() === '') return;
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    try {
      const response = await fetch(`${API_URL}/ai/enhance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentText })
      });
      const result = await response.json();
      if (result.enhancedText) {
        handleArrayFieldChange(section, index, 'description', result.enhancedText);
      } else if (result.error) {
        alert(result.error);
      }
    } catch (err) {
      alert('AI enhancement failed. Make sure the server & Gemini key are active.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!token) {
      onTriggerAuth();
      return;
    }
    setLoading(true);
    setSaveStatus('Saving...');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    try {
      const response = await fetch(`${API_URL}/resumes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: resumeData.personalInfo.fullName || 'Untitled Resume',
          data: resumeData
        })
      });
      if (response.ok) {
        setSaveStatus('Saved successfully!');
        fetchResumes();
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Failed to save.');
      }
    } catch (err) {
      setSaveStatus('Save request failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportPDF = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setParsingStatus('Uploading & parsing PDF...');
    const formData = new FormData();
    formData.append('resume', file);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    try {
      const response = await fetch(`${API_URL}/parse`, {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (result.success && result.extractedData) {
        setResumeData(result.extractedData);
        setParsingStatus('PDF parsed and imported successfully!');
      } else {
        setParsingStatus(result.error || 'Failed to parse PDF.');
      }
    } catch (err) {
      setParsingStatus('Upload error. Backend offline or PDF parser broken.');
    } finally {
      setTimeout(() => setParsingStatus(''), 5000);
    }
  };

  const handleDownloadPDF = async () => {
    const element = resumePreviewRef.current;
    if (!element) return;

    setPdfExporting(true);
    try {
      // Dynamically load html2pdf.js from CDN (loaded once, cached by browser)
      if (!window.html2pdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const name = resumeData.personalInfo?.fullName?.trim().replace(/\s+/g, '-') || 'Resume';
      const filename = `${name}-ResumeMaster.pdf`;

      const options = {
        margin:       [10, 10, 10, 10],
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await window.html2pdf().set(options).from(element).save();
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF export failed. Please try again.');
    } finally {
      setPdfExporting(false);
    }
  };

  const getFullResumeText = () => [
    resumeData.personalInfo?.fullName,
    resumeData.personalInfo?.title,
    resumeData.summary,
    ...(resumeData.skills || []),
    ...(resumeData.experience || []).map(e => `${e.role} ${e.company} ${e.description}`),
    ...(resumeData.projects  || []).map(p => `${p.name} ${p.description}`),
  ].filter(Boolean).join(' ');

  const handleScoreATS = async () => {
    if (!atsJd.trim()) { alert('Please paste the Job Description first.'); return; }
    setAtsLoading(true);
    setAtsResult(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    try {
      const res = await fetch(`${API_URL}/score-ats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: getFullResumeText(), jobDescription: atsJd }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAtsResult(data);
    } catch (err) {
      alert('ATS scoring failed: ' + err.message);
    } finally {
      setAtsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', minHeight: '80vh' }}>
      
      {/* LEFT: Builder Form Panel */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '82vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={22} className="logo-highlight" />
            Resume Profile Editor
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={handleSave}>
              <Save size={16} /> Save
            </button>
            <button
              className="btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: '#10b981', borderColor: 'rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.05)' }}
              onClick={() => setShowAtsPanel(v => !v)}
            >
              <Target size={16} /> ATS Score
            </button>
            <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', opacity: pdfExporting ? 0.7 : 1 }} onClick={handleDownloadPDF} disabled={pdfExporting}>
              <Download size={16} /> {pdfExporting ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>
        </div>

        {saveStatus && <div style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>{saveStatus}</div>}

        {/* Quick Import Widget */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '0.75rem' }}>
          <label style={{ cursor: 'pointer', display: 'block', textAlign: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              ⚡ <strong>Import Existing PDF:</strong> Click to upload resume for automated parsing
            </span>
            <input type="file" accept=".pdf" onChange={handleImportPDF} style={{ display: 'none' }} />
          </label>
          {parsingStatus && <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', marginTop: '0.5rem', textAlign: 'center' }}>{parsingStatus}</div>}
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', background: 'rgba(255,255,255,0.02)', padding: '0.25rem', borderRadius: '0.5rem' }}>
          {['personal', 'experience', 'education', 'projects', 'skills'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeSubTab === tab ? 'active' : ''}`}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '0.25rem' }}
              onClick={() => setActiveSubTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Profile Info Subtab */}
        {activeSubTab === 'personal' && (
          <div>
            <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>Personal Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" name="fullName" value={resumeData.personalInfo.fullName || ''} onChange={handlePersonalInfoChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Professional Title</label>
                <input className="form-input" name="title" value={resumeData.personalInfo.title || ''} onChange={handlePersonalInfoChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" name="email" value={resumeData.personalInfo.email || ''} onChange={handlePersonalInfoChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" name="phone" value={resumeData.personalInfo.phone || ''} onChange={handlePersonalInfoChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Location (City, State)</label>
                <input className="form-input" name="location" value={resumeData.personalInfo.location || ''} onChange={handlePersonalInfoChange} />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input className="form-input" name="linkedin" value={resumeData.personalInfo.linkedin || ''} onChange={handlePersonalInfoChange} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Professional Summary</label>
                <textarea className="form-textarea" rows={3} value={resumeData.summary || ''} onChange={(e) => setResumeData(p => ({ ...p, summary: e.target.value }))} />
              </div>
            </div>
          </div>
        )}

        {/* Experience Subtab */}
        {activeSubTab === 'experience' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#fff' }}>Work History</h3>
              <button className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => addArrayItem('experience', { company: '', role: '', startDate: '', endDate: '', location: '', description: '' })}>
                <Plus size={14} /> Add Role
              </button>
            </div>

            {resumeData.experience.map((exp, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input className="form-input" style={{ flex: 1 }} placeholder="Company" value={exp.company || ''} onChange={(e) => handleArrayFieldChange('experience', idx, 'company', e.target.value)} />
                  <input className="form-input" style={{ flex: 1 }} placeholder="Role" value={exp.role || ''} onChange={(e) => handleArrayFieldChange('experience', idx, 'role', e.target.value)} />
                  <button className="btn-secondary" style={{ padding: '0.5rem', color: 'var(--color-danger)' }} onClick={() => removeArrayItem('experience', idx)}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input className="form-input" style={{ flex: 1 }} placeholder="Start Date" value={exp.startDate || ''} onChange={(e) => handleArrayFieldChange('experience', idx, 'startDate', e.target.value)} />
                  <input className="form-input" style={{ flex: 1 }} placeholder="End Date" value={exp.endDate || ''} onChange={(e) => handleArrayFieldChange('experience', idx, 'endDate', e.target.value)} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <label className="form-label">Bullets / Description</label>
                    <button className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', gap: '0.25rem', color: 'var(--color-primary-hover)' }} onClick={() => handleEnhance('experience', idx, exp.description)} disabled={loading}>
                      <Sparkles size={12} /> Rewrite with Google X-Y-Z
                    </button>
                  </div>
                  <textarea className="form-textarea" placeholder="• Developed scalable cloud backend using Node.js..." value={exp.description || ''} onChange={(e) => handleArrayFieldChange('experience', idx, 'description', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education Subtab */}
        {activeSubTab === 'education' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#fff' }}>Academic History</h3>
              <button className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => addArrayItem('education', { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' })}>
                <Plus size={14} /> Add Education
              </button>
            </div>

            {resumeData.education.map((edu, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input className="form-input" style={{ flex: 1 }} placeholder="School" value={edu.school || ''} onChange={(e) => handleArrayFieldChange('education', idx, 'school', e.target.value)} />
                  <input className="form-input" style={{ flex: 1 }} placeholder="Degree & Major" value={edu.degree || ''} onChange={(e) => handleArrayFieldChange('education', idx, 'degree', e.target.value)} />
                  <button className="btn-secondary" style={{ padding: '0.5rem', color: 'var(--color-danger)' }} onClick={() => removeArrayItem('education', idx)}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input className="form-input" style={{ flex: 1 }} placeholder="Start Date" value={edu.startDate || ''} onChange={(e) => handleArrayFieldChange('education', idx, 'startDate', e.target.value)} />
                  <input className="form-input" style={{ flex: 1 }} placeholder="End Date / Grad Date" value={edu.endDate || ''} onChange={(e) => handleArrayFieldChange('education', idx, 'endDate', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects Subtab */}
        {activeSubTab === 'projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#fff' }}>Projects</h3>
              <button className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => addArrayItem('projects', { name: '', description: '', url: '' })}>
                <Plus size={14} /> Add Project
              </button>
            </div>

            {resumeData.projects.map((proj, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input className="form-input" style={{ flex: 1 }} placeholder="Project Name" value={proj.name || ''} onChange={(e) => handleArrayFieldChange('projects', idx, 'name', e.target.value)} />
                  <input className="form-input" style={{ flex: 1 }} placeholder="Project URL" value={proj.url || ''} onChange={(e) => handleArrayFieldChange('projects', idx, 'url', e.target.value)} />
                  <button className="btn-secondary" style={{ padding: '0.5rem', color: 'var(--color-danger)' }} onClick={() => removeArrayItem('projects', idx)}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <label className="form-label">Bullets / Description</label>
                    <button className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', gap: '0.25rem', color: 'var(--color-primary-hover)' }} onClick={() => handleEnhance('projects', idx, proj.description)} disabled={loading}>
                      <Sparkles size={12} /> Rewrite with Google X-Y-Z
                    </button>
                  </div>
                  <textarea className="form-textarea" placeholder="• Developed scalable open-source framework..." value={proj.description || ''} onChange={(e) => handleArrayFieldChange('projects', idx, 'description', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills Subtab */}
        {activeSubTab === 'skills' && (
          <div>
            <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>Technical Keywords</h3>
            <div className="form-group">
              <label className="form-label">Keywords (Comma-separated)</label>
              <textarea className="form-textarea" rows={5} placeholder="React, Node.js, AWS, Postgres, TailwindCSS..." value={resumeData.skills ? resumeData.skills.join(', ') : ''} onChange={handleSkillsChange} />
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Live Printable Preview Pane */}
      <div style={{ overflowY: 'auto', maxHeight: '82vh' }}>
        <div className="glass-card" style={{ padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderRadius: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Template Layout:</span>
          <select className="form-select" style={{ padding: '0.3rem 1.5rem 0.3rem 0.75rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }} value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
            <option value="elegant"   style={{ background: '#121020', color: '#fff' }}>Elegant Serif</option>
            <option value="modern"    style={{ background: '#121020', color: '#fff' }}>Modern Minimalist</option>
            <option value="technical" style={{ background: '#121020', color: '#fff' }}>Technical Indigo</option>
            <option value="executive" style={{ background: '#121020', color: '#fff' }}>Executive Two-Column</option>
            <option value="creative"  style={{ background: '#121020', color: '#fff' }}>Creative Gradient</option>
          </select>
        </div>

        {/* ATS Score Panel — overlays the preview when active */}
        {showAtsPanel && (
          <div className="glass-card" style={{ marginBottom: '1rem', border: '1px solid rgba(16,185,129,0.2)', background: 'rgba(10,25,20,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={18} /> ATS Resume Score Engine
              </h3>
              <button onClick={() => { setShowAtsPanel(false); setAtsResult(null); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Paste Job Description to score against</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Paste the full job description here..."
                value={atsJd}
                onChange={e => setAtsJd(e.target.value)}
                style={{ fontSize: '0.82rem' }}
              />
            </div>
            <button className="btn-primary" onClick={handleScoreATS} disabled={atsLoading} style={{ width: '100%' }}>
              {atsLoading ? 'Running ATS Analysis...' : '⚡ Score My Resume'}
            </button>

            {atsResult && (
              <div className="ats-score-panel">
                {/* Overall Score Dial */}
                <div className="ats-dial-container">
                  <div className="ats-dial" style={{
                    background: `conic-gradient(${getScoreColor(atsResult.overallScore)} ${atsResult.overallScore * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
                    boxShadow: `0 0 24px ${getScoreColor(atsResult.overallScore)}33`,
                  }}>
                    <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', background: 'rgba(10,8,22,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="ats-score-number" style={{ color: getScoreColor(atsResult.overallScore) }}>{atsResult.overallScore}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 600 }}>/ 100</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: getScoreColor(atsResult.overallScore) }}>{atsResult.verdict}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Keyword Match: {atsResult.keywordMatchPercent}%</div>
                  </div>
                </div>

                {/* Section Scores */}
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Section Scores</div>
                  {Object.entries(atsResult.sectionScores || {}).map(([section, score]) => (
                    <div key={section} className="ats-section-bar" style={{ marginBottom: '0.5rem' }}>
                      <span style={{ width: 80, color: 'var(--text-muted)', textTransform: 'capitalize', flexShrink: 0 }}>{section}</span>
                      <div className="ats-section-bar-track">
                        <div className="ats-section-bar-fill" style={{ width: `${score}%`, background: getScoreColor(score) }} />
                      </div>
                      <span style={{ width: 30, textAlign: 'right', color: getScoreColor(score), fontWeight: 700, fontSize: '0.75rem' }}>{score}</span>
                    </div>
                  ))}
                </div>

                {/* Keywords */}
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Keywords Found ✓</div>
                  <div>{(atsResult.foundKeywords || []).map(k => <span key={k} className="ats-keyword-chip ats-keyword-found"><CheckCircle size={10} />{k}</span>)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Missing Keywords ✗</div>
                  <div>{(atsResult.missingKeywords || []).map(k => <span key={k} className="ats-keyword-chip ats-keyword-missing"><XCircle size={10} />{k}</span>)}</div>
                </div>

                {/* Fix Suggestions */}
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Fix Suggestions</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {(atsResult.fixes || []).map((fix, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.04)', lineHeight: 1.4 }}>
                        <span style={{ color: '#f59e0b', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                        <span>{fix}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className={`resume-preview-container template-${selectedTemplate}`} id="printable-cv" ref={resumePreviewRef}>
          <h1>{resumeData.personalInfo.fullName || 'Your Name'}</h1>
          <div className="contact-info">
            {resumeData.personalInfo.title && <span>{resumeData.personalInfo.title}</span>}
            {resumeData.personalInfo.email && <span> | {resumeData.personalInfo.email}</span>}
            {resumeData.personalInfo.phone && <span> | {resumeData.personalInfo.phone}</span>}
            {resumeData.personalInfo.location && <span> | {resumeData.personalInfo.location}</span>}
            {resumeData.personalInfo.linkedin && <span> | {resumeData.personalInfo.linkedin}</span>}
          </div>

          {resumeData.summary && (
            <>
              <div className="section-title">Summary</div>
              <p style={{ fontSize: '13px', color: '#334155' }}>{resumeData.summary}</p>
            </>
          )}

          {resumeData.skills && resumeData.skills.length > 0 && (
            <>
              <div className="section-title">Skills & Technologies</div>
              <p style={{ fontSize: '13px', color: '#334155', fontWeight: 'bold' }}>
                {resumeData.skills.join(', ')}
              </p>
            </>
          )}

          {resumeData.experience && resumeData.experience.length > 0 && (
            <>
              <div className="section-title">Work Experience</div>
              {resumeData.experience.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '13.5px' }}>
                    <span>{exp.role} — {exp.company}</span>
                    <span>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  {exp.description && (
                    <ul style={{ paddingLeft: '1.2rem', marginTop: '0.25rem', fontSize: '12.5px', color: '#334155' }}>
                      {exp.description.split('\n').filter(Boolean).map((bullet, bidx) => (
                        <li key={bidx} style={{ listStyleType: 'disc', marginBottom: '0.15rem' }}>
                          {bullet.replace(/^[•\-\s]*/, '')}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </>
          )}

          {resumeData.education && resumeData.education.length > 0 && (
            <>
              <div className="section-title">Education</div>
              {resumeData.education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '13.5px' }}>
                    <span>{edu.school}</span>
                    <span>{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#334155', italic: 'true' }}>{edu.degree}</div>
                </div>
              ))}
            </>
          )}

          {resumeData.projects && resumeData.projects.length > 0 && (
            <>
              <div className="section-title">Personal Projects</div>
              {resumeData.projects.map((proj, idx) => (
                <div key={idx} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '13.5px' }}>
                    <span>{proj.name}</span>
                    {proj.url && <span style={{ fontSize: '11px', color: '#2563eb' }}>{proj.url}</span>}
                  </div>
                  {proj.description && (
                    <ul style={{ paddingLeft: '1.2rem', marginTop: '0.25rem', fontSize: '12.5px', color: '#334155' }}>
                      {proj.description.split('\n').filter(Boolean).map((bullet, bidx) => (
                        <li key={bidx} style={{ listStyleType: 'disc', marginBottom: '0.15rem' }}>
                          {bullet.replace(/^[•\-\s]*/, '')}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      
    </div>
  );
}
