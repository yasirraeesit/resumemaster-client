import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sparkles, FileText, Download, Save, Plus, Trash2, ArrowRight, Target, X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function ResumeBuilder({ resumeData, setResumeData, token, onTriggerAuth }) {
  const [activeSubTab, setActiveSubTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [availableResumes, setAvailableResumes] = useState([]);
  const [parsingStatus, setParsingStatus] = useState('');
  const [importPreview, setImportPreview] = useState(null); // { data, warnings, method }
  const [selectedTemplate, setSelectedTemplate] = useState('elegant');
  const [pdfExporting, setPdfExporting] = useState(false);
  const resumePreviewRef = useRef(null);

  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const [layoutSettings, setLayoutSettings] = useState({
    fontSize: 13,
    lineHeight: 1.45,
    margin: 12,
    accentColor: '#3b82f6',
    showCustomizer: false
  });

  const sections = resumeData.sections || ['summary', 'skills', 'experience', 'education', 'projects'];

  const getSectionLabel = (key) => {
    if (key === 'summary') return 'Summary';
    if (key === 'skills') return 'Skills';
    if (key === 'experience') return 'Work Experience';
    if (key === 'education') return 'Education';
    if (key === 'projects') return 'Projects';
    
    const customSec = resumeData.customSections?.[key];
    if (customSec) return customSec.title;
    
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const isFirstSection = (key) => {
    return sections.indexOf(key) <= 0;
  };

  const isLastSection = (key) => {
    const idx = sections.indexOf(key);
    return idx === -1 || idx === sections.length - 1;
  };

  const moveSection = (sectionKey, direction) => {
    const currentSections = resumeData.sections || ['summary', 'skills', 'experience', 'education', 'projects'];
    const index = currentSections.indexOf(sectionKey);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentSections.length) return;
    
    const updatedSections = [...currentSections];
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[newIndex];
    updatedSections[newIndex] = temp;
    
    setResumeData(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  const handleAddCustomSection = () => {
    const title = prompt('Enter the name of your custom section:');
    if (!title || !title.trim()) return;
    
    const cleanTitle = title.trim();
    const secKey = `custom_${cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
    const currentSections = resumeData.sections || ['summary', 'skills', 'experience', 'education', 'projects'];
    const updatedSections = [...currentSections, secKey];
    
    setResumeData(prev => ({
      ...prev,
      sections: updatedSections,
      customSections: {
        ...(prev.customSections || {}),
        [secKey]: {
          title: cleanTitle,
          items: []
        }
      }
    }));
    
    setActiveSubTab(secKey);
  };

  const handleCustomSectionItemChange = (secKey, index, value) => {
    setResumeData(prev => {
      const customSections = { ...(prev.customSections || {}) };
      const section = { ...customSections[secKey] };
      const items = [...(section.items || [])];
      items[index] = value;
      section.items = items;
      customSections[secKey] = section;
      return {
        ...prev,
        customSections
      };
    });
  };

  const addCustomSectionItem = (secKey) => {
    setResumeData(prev => {
      const customSections = { ...(prev.customSections || {}) };
      const section = { ...customSections[secKey] };
      const items = [...(section.items || []), ''];
      section.items = items;
      customSections[secKey] = section;
      return {
        ...prev,
        customSections
      };
    });
  };

  const removeCustomSectionItem = (secKey, index) => {
    setResumeData(prev => {
      const customSections = { ...(prev.customSections || {}) };
      const section = { ...customSections[secKey] };
      const items = [...(section.items || [])];
      items.splice(index, 1);
      section.items = items;
      customSections[secKey] = section;
      return {
        ...prev,
        customSections
      };
    });
  };

  const deleteCustomSection = (secKey) => {
    if (!confirm('Are you sure you want to delete this custom section?')) return;
    
    const currentSections = resumeData.sections || ['summary', 'skills', 'experience', 'education', 'projects'];
    const updatedSections = currentSections.filter(k => k !== secKey);
    
    setResumeData(prev => {
      const customSections = { ...(prev.customSections || {}) };
      delete customSections[secKey];
      return {
        ...prev,
        sections: updatedSections,
        customSections
      };
    });
    
    setActiveSubTab('personal');
  };

  // ATS Score Engine state
  const [showAtsPanel, setShowAtsPanel] = useState(false);
  const [showBulletScanner, setShowBulletScanner] = useState(false);
  const [atsJd, setAtsJd]               = useState('');
  const [atsLoading, setAtsLoading]     = useState(false);
  const [atsResult, setAtsResult]       = useState(null);

  // ── Passive Bullet Point Weak-Word Scanner ─────────────────────────
  const WEAK_PATTERNS = [
    { regex: /^(worked on|work on)/i,                suggestion: 'Led', icon: '⚡' },
    { regex: /^(helped with|helped)/i,               suggestion: 'Contributed to', icon: '💡' },
    { regex: /^(assisted|assisting)/i,               suggestion: 'Supported', icon: '🔧' },
    { regex: /^(responsible for)/i,                  suggestion: 'Owned', icon: '🎯' },
    { regex: /^(did|does|doing)/i,                   suggestion: 'Executed', icon: '✅' },
    { regex: /^(made)/i,                             suggestion: 'Built / Engineered', icon: '🏗️' },
    { regex: /^(was in charge of)/i,                 suggestion: 'Managed', icon: '📋' },
    { regex: /^(tried to|tried)/i,                   suggestion: 'Spearheaded / Achieved', icon: '🚀' },
    { regex: /^(used|using)/i,                       suggestion: 'Leveraged', icon: '⚙️' },
    { regex: /^(got)/i,                              suggestion: 'Delivered', icon: '📦' },
    { regex: /^(wrote)/i,                            suggestion: 'Authored / Developed', icon: '✍️' },
    { regex: /^(fixed)/i,                            suggestion: 'Resolved / Optimized', icon: '🔩' },
    { regex: /^(participated in|participated)/i,     suggestion: 'Collaborated on / Driven', icon: '🤝' },
    { regex: /^(utilize|utilized)/i,                 suggestion: 'Leveraged / Deployed', icon: '⚙️' },
    { regex: /^(managed to|managed)/i,               suggestion: 'Orchestrated / Directed', icon: '👑' },
    { regex: /^(handled)/i,                          suggestion: 'Oversaw / Administered', icon: '💼' },
    { regex: /^(guided)/i,                           suggestion: 'Mentored / Facilitated', icon: '🌱' },
    { regex: /^(created)/i,                          suggestion: 'Designed / Innovated', icon: '🎨' },
    { regex: /^(improved)/i,                         suggestion: 'Enhanced / Boosted', icon: '📈' },
    { regex: /\bvarious\b/i,                         suggestion: 'List specific examples instead of "various"', icon: '📝' },
    { regex: /\bseveral\b/i,                         suggestion: 'Be specific — use numbers like "5+ projects"', icon: '🔢' },
    { regex: /\bsome\b/i,                            suggestion: 'Quantify — avoid vague "some"', icon: '📊' },
    { regex: /\b(dynamic|motivated|team player|detail-oriented)\b/i, suggestion: 'Show impact instead of using clichés', icon: '📣' }
  ];

  const bulletWarnings = useMemo(() => {
    const warnings = [];
    const allBullets = [
      ...(resumeData.experience || []).flatMap((exp, expIdx) =>
        (exp.description || '').split('\n').filter(Boolean).map(line => ({
          line: line.replace(/^[•\-\s]*/, '').trim(),
          original: line,
          source: `Experience #${expIdx + 1}`,
          expIdx
        }))
      ),
      ...(resumeData.projects || []).flatMap((proj, projIdx) =>
        (proj.description || '').split('\n').filter(Boolean).map(line => ({
          line: line.replace(/^[•\-\s]*/, '').trim(),
          original: line,
          source: `Project: ${proj.name || `#${projIdx + 1}`}`,
          projIdx
        }))
      )
    ];

    allBullets.forEach(({ line, original, source, expIdx, projIdx }) => {
      WEAK_PATTERNS.forEach(({ regex, suggestion, icon }) => {
        if (regex.test(line)) {
          const isFixable = !suggestion.includes(' ') || suggestion.includes(' / ');
          warnings.push({ line, original, source, suggestion, icon, expIdx, projIdx, regex, isFixable });
        }
      });
    });

    return warnings;
  }, [resumeData.experience, resumeData.projects]);

  const handleQuickFix = (warning) => {
    const { line, original, suggestion, expIdx, projIdx, regex } = warning;
    const cleanSuggestion = suggestion.split('/')[0].trim().split(' ')[0].trim();
    const match = line.match(regex);
    if (!match) return;
    const weakWord = match[0];
    const isCapitalized = weakWord && weakWord[0] === weakWord[0].toUpperCase();
    const finalReplacement = isCapitalized 
      ? cleanSuggestion.charAt(0).toUpperCase() + cleanSuggestion.slice(1)
      : cleanSuggestion.toLowerCase();
    const fixedLine = line.replace(regex, finalReplacement);

    if (expIdx !== undefined) {
      setResumeData(prev => {
        const experience = [...(prev.experience || [])];
        const exp = { ...experience[expIdx] };
        const lines = (exp.description || '').split('\n');
        const updatedLines = lines.map(l => {
          if (l.trim() === original.trim()) {
            const prefix = l.match(/^[•\-\s]*/)?.[0] || '• ';
            return `${prefix}${fixedLine}`;
          }
          return l;
        });
        exp.description = updatedLines.join('\n');
        experience[expIdx] = exp;
        return { ...prev, experience };
      });
    } else if (projIdx !== undefined) {
      setResumeData(prev => {
        const projects = [...(prev.projects || [])];
        const proj = { ...projects[projIdx] };
        const lines = (proj.description || '').split('\n');
        const updatedLines = lines.map(l => {
          if (l.trim() === original.trim()) {
            const prefix = l.match(/^[•\-\s]*/)?.[0] || '• ';
            return `${prefix}${fixedLine}`;
          }
          return l;
        });
        proj.description = updatedLines.join('\n');
        projects[projIdx] = proj;
        return { ...prev, projects };
      });
    }
  };

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

  const moveArrayItem = (section, index, direction) => {
    setResumeData(prev => {
      const arr = [...(prev[section] || [])];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= arr.length) return prev;
      
      const temp = arr[index];
      arr[index] = arr[newIndex];
      arr[newIndex] = temp;
      
      return {
        ...prev,
        [section]: arr
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

  const handleGenerateSummary = async () => {
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    try {
      const response = await fetch(`${API_URL}/ai/generate-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: resumeData.personalInfo.title,
          skills: resumeData.skills,
          experience: resumeData.experience,
          projects: resumeData.projects
        })
      });
      const result = await response.json();
      if (result.summary) {
        setResumeData(prev => ({
          ...prev,
          summary: result.summary
        }));
      } else if (result.error) {
        alert(result.error);
      }
    } catch (err) {
      alert('AI summary generation failed. Make sure the server is active.');
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

  // ── Client-side import normalizer ─────────────────────────────────
  const normalizeImportedResume = (data) => {
    if (!data || typeof data !== 'object') return null;

    const cleanBullets = (str) => {
      if (!str || typeof str !== 'string') return '';
      return str
        .replace(/\r\n/g, '\n')
        .replace(/\n{2,}/g, '\n')
        .split('\n')
        .map(l => l.replace(/^[•\-\*\s]+/, '').trim())
        .filter(l => l.length > 1)
        .map(l => `• ${l}`)
        .join('\n');
    };

    const toArr = (v) => Array.isArray(v) ? v : [];
    const toStr = (v) => (v && typeof v === 'string') ? v.trim() : '';

    return {
      personalInfo: {
        fullName:  toStr(data.personalInfo?.fullName),
        title:     toStr(data.personalInfo?.title),
        email:     toStr(data.personalInfo?.email),
        phone:     toStr(data.personalInfo?.phone),
        location:  toStr(data.personalInfo?.location),
        website:   toStr(data.personalInfo?.website),
        github:    toStr(data.personalInfo?.github),
        linkedin:  toStr(data.personalInfo?.linkedin),
      },
      summary: toStr(data.summary),
      skills: toArr(data.skills).map(toStr).filter(Boolean),
      experience: toArr(data.experience).map(e => ({
        company:   toStr(e.company),
        role:      toStr(e.role),
        location:  toStr(e.location || ''),
        startDate: toStr(e.startDate),
        endDate:   toStr(e.endDate),
        description: cleanBullets(e.description)
      })),
      education: toArr(data.education).map(e => ({
        school:       toStr(e.school),
        degree:       toStr(e.degree),
        fieldOfStudy: toStr(e.fieldOfStudy || ''),
        startDate:    toStr(e.startDate),
        endDate:      toStr(e.endDate),
        description:  cleanBullets(e.description || '')
      })),
      projects: toArr(data.projects).map(p => ({
        name:        toStr(p.name),
        description: cleanBullets(p.description),
        url:         toStr(p.url)
      })),
      sections: data.sections || ['summary', 'skills', 'experience', 'education', 'projects'],
      customSections: data.customSections || {}
    };
  };

  const buildImportWarnings = (data) => {
    const warnings = [];
    (data.experience || []).forEach((exp, i) => {
      if (!exp.role || exp.role === 'Unknown Role') warnings.push(`Experience #${i + 1}: Role title not detected`);
      if (!exp.company || exp.company === 'Unknown Company') warnings.push(`Experience #${i + 1}: Company name not detected`);
    });
    (data.education || []).forEach((edu, i) => {
      if (!edu.school) warnings.push(`Education #${i + 1}: School name not detected`);
    });
    if (!data.personalInfo?.fullName) warnings.push('Full name could not be extracted');
    if (!data.personalInfo?.email)    warnings.push('Email address not found in PDF');
    return warnings;
  };

  const handleImportPDF = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setParsingStatus('Uploading & parsing PDF...');
    setImportPreview(null);
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
        const normalized = normalizeImportedResume(result.extractedData);
        const warnings = buildImportWarnings(normalized);
        setImportPreview({ data: normalized, warnings, method: result.method || 'unknown' });
        setParsingStatus('');
      } else {
        setParsingStatus(result.error || 'Failed to parse PDF.');
        setTimeout(() => setParsingStatus(''), 5000);
      }
    } catch (err) {
      setParsingStatus('Upload error. Backend offline or PDF parser broken.');
      setTimeout(() => setParsingStatus(''), 5000);
    }
  };

  const applyImport = () => {
    if (!importPreview) return;
    setResumeData(importPreview.data);
    setImportPreview(null);
    setActiveSubTab('personal');
    setSaveStatus('Resume imported! Review and edit the fields below.');
    setTimeout(() => setSaveStatus(''), 5000);
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
        margin:       0,
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', minHeight: 'calc(100vh - 150px)' }}>
      
      {/* LEFT: Builder Form Panel */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: 'calc(100vh - 130px)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <FileText size={22} className="logo-highlight" />
            Resume Profile Editor
          </h2>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '0.25rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button
              className="btn-secondary"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', gap: '0.35rem', color: '#3b82f6', borderColor: 'rgba(59,130,246,0.25)', background: 'rgba(59,130,246,0.05)' }}
              onClick={() => document.getElementById('resume-pdf-import-input').click()}
            >
              ⚡ Import
            </button>
            <input id="resume-pdf-import-input" type="file" accept=".pdf" onChange={handleImportPDF} style={{ display: 'none' }} />
            
            <button
              className="btn-secondary"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.78rem',
                gap: '0.35rem',
                color: bulletWarnings.length > 0 ? '#f59e0b' : 'var(--text-muted)',
                borderColor: bulletWarnings.length > 0 ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)',
                background: bulletWarnings.length > 0 ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.02)',
                position: 'relative'
              }}
              onClick={() => setShowBulletScanner(v => !v)}
            >
              <AlertTriangle size={14} /> Scan
              {bulletWarnings.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#f59e0b',
                  color: '#000',
                  borderRadius: '50%',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  width: '14px',
                  height: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>{bulletWarnings.length}</span>
              )}
            </button>

            <button
              className="btn-secondary"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', gap: '0.35rem', color: '#10b981', borderColor: 'rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.05)' }}
              onClick={() => setShowAtsPanel(v => !v)}
            >
              <Target size={14} /> ATS
            </button>

            <button className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', gap: '0.35rem' }} onClick={handleSave}>
              <Save size={14} /> Save
            </button>

            <button className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', gap: '0.35rem', opacity: pdfExporting ? 0.7 : 1 }} onClick={handleDownloadPDF} disabled={pdfExporting}>
              <Download size={14} /> {pdfExporting ? 'Export' : 'Export'}
            </button>
          </div>
        </div>

        {saveStatus && <div style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>{saveStatus}</div>}

        {/* Bullet Point Weak-Word Scanner Panel */}
        {showBulletScanner && (
          <div className="glass-card" style={{ marginBottom: '1rem', padding: '1.25rem', border: '1px solid rgba(245,158,11,0.15)', background: 'rgba(245,158,11,0.03)', animation: 'tabFadeIn 0.2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertTriangle size={15} style={{ color: '#f59e0b' }} />
                Bullet Strength Diagnostics
              </h4>
              <button onClick={() => setShowBulletScanner(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            </div>

            {bulletWarnings.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem' }}>
                <CheckCircle size={16} /> All bullets look strong — no weak openers detected!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  {bulletWarnings.length} weak phrasing{bulletWarnings.length > 1 ? 's' : ''} detected. Replace them with stronger action verbs:
                </p>
                {bulletWarnings.map((w, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.2rem 1fr auto', gap: '0.5rem', alignItems: 'start', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.78rem' }}>
                    <span>{w.icon}</span>
                    <div>
                      <div style={{ color: 'var(--text-dim)', marginBottom: '0.15rem' }}>
                        <em>"{w.line.length > 65 ? w.line.slice(0, 65) + '…' : w.line}"</em>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                        📍 {w.source}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                      <div style={{ color: '#10b981', fontSize: '0.72rem', whiteSpace: 'nowrap', fontWeight: 600 }}>
                        → {w.suggestion}
                      </div>
                      {w.isFixable && (
                        <button
                          onClick={() => handleQuickFix(w)}
                          style={{
                            padding: '0.15rem 0.45rem',
                            fontSize: '0.65rem',
                            borderRadius: '4px',
                            background: 'rgba(16,185,129,0.1)',
                            border: '1px solid rgba(16,185,129,0.3)',
                            color: '#10b981',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            fontWeight: 'bold'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(16,185,129,0.1)'; e.currentTarget.style.color = '#10b981'; }}
                        >
                          Quick Fix
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {parsingStatus && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(5, 5, 10, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.25s ease'
          }}>
            <div className="glass-card" style={{
              padding: '2.5rem',
              borderRadius: '1.25rem',
              width: '400px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'linear-gradient(135deg, rgba(30,30,50,0.65), rgba(15,15,25,0.85))',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(139,92,246,0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Laser Scanning Line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '3px',
                background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)',
                boxShadow: '0 0 10px var(--color-primary), 0 0 20px var(--color-primary)',
                animation: 'scanLaser 2s linear infinite'
              }}></div>

              {/* Glowing Pulse Document Icon */}
              <div style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(139,92,246,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(139,92,246,0.15)',
                boxShadow: '0 0 20px rgba(139,92,246,0.08)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-5px',
                  left: '-5px',
                  right: '-5px',
                  bottom: '-5px',
                  borderRadius: '50%',
                  border: '2px dashed rgba(139,92,246,0.3)',
                  animation: 'spin 8s linear infinite'
                }}></div>
                <FileText size={36} className="logo-highlight" style={{ opacity: 0.9 }} />
              </div>

              {/* Loader Info */}
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.4rem', fontWeight: 700 }}>
                  Analyzing Resume PDF
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                  {parsingStatus}
                </p>
              </div>

              {/* Pulsing Progress Bar */}
              <div style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                height: '6px',
                borderRadius: '9999px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-hover))',
                  width: '100%',
                  borderRadius: '9999px',
                  animation: 'progressPulse 1.5s ease-in-out infinite'
                }}></div>
              </div>
              
              <span style={{ fontSize: '0.72rem', color: 'var(--color-primary-hover)', fontWeight: 700, letterSpacing: '0.08em' }}>
                EXTRACTING PROFILE DATA...
              </span>
            </div>
          </div>
        )}

        {/* Import Review Card */}
        {importPreview && (
          <div className="glass-card" style={{ border: '1px solid rgba(139,92,246,0.25)', background: 'rgba(139,92,246,0.04)', padding: '1.25rem', animation: 'tabFadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  📄 Import Preview
                  <span style={{ fontSize: '0.7rem', background: importPreview.method === 'gemini' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: importPreview.method === 'gemini' ? '#10b981' : '#f59e0b', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 600 }}>
                    {importPreview.method === 'gemini' ? '✨ AI Parsed' : '⚙️ Heuristic'}
                  </span>
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Review the extracted data before loading it into the builder.</p>
              </div>
              <button onClick={() => setImportPreview(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            {/* Summary counts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
              {[
                { label: 'Experience', count: importPreview.data.experience?.length || 0, icon: '💼' },
                { label: 'Education',  count: importPreview.data.education?.length  || 0, icon: '🎓' },
                { label: 'Projects',   count: importPreview.data.projects?.length   || 0, icon: '🚀' },
                { label: 'Skills',     count: importPreview.data.skills?.length     || 0, icon: '⚡' },
                { label: 'Name',       count: importPreview.data.personalInfo?.fullName ? '✓' : '✗', icon: '👤', isText: true },
              ].map(({ label, count, icon, isText }) => (
                <div key={label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', padding: '0.6rem 0.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '1rem' }}>{icon}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
                    {isText ? <span style={{ color: count === '✓' ? '#10b981' : '#ef4444' }}>{count}</span> : count}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Warnings */}
            {importPreview.warnings.length > 0 && (
              <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600, marginBottom: '0.3rem' }}>⚠️ {importPreview.warnings.length} field{importPreview.warnings.length > 1 ? 's' : ''} need review:</p>
                {importPreview.warnings.map((w, i) => (
                  <div key={i} style={{ fontSize: '0.72rem', color: 'var(--text-muted)', paddingLeft: '0.75rem' }}>• {w}</div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-primary" style={{ flex: 1, fontSize: '0.85rem' }} onClick={applyImport}>
                <CheckCircle size={14} /> Accept & Load into Builder
              </button>
              <button className="btn-secondary" style={{ fontSize: '0.85rem' }} onClick={() => setImportPreview(null)}>
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Tab Selector */}
        <div className="editor-tabs-container">
          <button
            className={`editor-sub-tab-btn ${activeSubTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('personal')}
          >
            CONTACT
          </button>
          {sections.map(secKey => (
            <button
              key={secKey}
              className={`editor-sub-tab-btn ${activeSubTab === secKey ? 'active' : ''}`}
              onClick={() => setActiveSubTab(secKey)}
            >
              {getSectionLabel(secKey).toUpperCase()}
            </button>
          ))}
          
          {/* Add Custom Section Trigger */}
          <button 
            className="editor-sub-tab-btn" 
            style={{ borderStyle: 'dashed', opacity: 0.8 }} 
            onClick={handleAddCustomSection}
          >
            + Add Section
          </button>
        </div>

        {/* Dynamic Section Editor Header */}
        {activeSubTab !== 'personal' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '0.5rem 0.85rem', borderRadius: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
              Section Positioning:
            </span>
            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
              <button 
                className="btn-secondary" 
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', opacity: isFirstSection(activeSubTab) ? 0.3 : 1, cursor: isFirstSection(activeSubTab) ? 'not-allowed' : 'pointer' }}
                onClick={() => moveSection(activeSubTab, 'up')}
                disabled={isFirstSection(activeSubTab)}
                title="Move section up"
              >
                ▲ Move Up
              </button>
              <button 
                className="btn-secondary" 
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', opacity: isLastSection(activeSubTab) ? 0.3 : 1, cursor: isLastSection(activeSubTab) ? 'not-allowed' : 'pointer' }}
                onClick={() => moveSection(activeSubTab, 'down')}
                disabled={isLastSection(activeSubTab)}
                title="Move section down"
              >
                ▼ Move Down
              </button>
              {activeSubTab.startsWith('custom_') && (
                <button 
                  className="btn-secondary" 
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.2)' }}
                  onClick={() => deleteCustomSection(activeSubTab)}
                  title="Delete this section"
                >
                  Delete Section
                </button>
              )}
            </div>
          </div>
        )}


        {/* Profile Info Subtab */}
        {activeSubTab === 'personal' && (
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Personal Details</h3>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Professional Summary</label>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', gap: '0.25rem', color: 'var(--color-primary-hover)' }} 
                    onClick={handleGenerateSummary} 
                    disabled={loading}
                  >
                    <Sparkles size={12} /> Generate with AI
                  </button>
                </div>
                <textarea className="form-textarea" rows={3} value={resumeData.summary || ''} onChange={(e) => setResumeData(p => ({ ...p, summary: e.target.value }))} />
              </div>
            </div>
          </div>
        )}

        {/* Experience Subtab */}
        {activeSubTab === 'experience' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Work History</h3>
              <button className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => addArrayItem('experience', { company: '', role: '', startDate: '', endDate: '', location: '', description: '' })}>
                <Plus size={14} /> Add Role
              </button>
            </div>

            {resumeData.experience.map((exp, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input className="form-input" style={{ flex: 1 }} placeholder="Company" value={exp.company || ''} onChange={(e) => handleArrayFieldChange('experience', idx, 'company', e.target.value)} />
                  <input className="form-input" style={{ flex: 1 }} placeholder="Role" value={exp.role || ''} onChange={(e) => handleArrayFieldChange('experience', idx, 'role', e.target.value)} />
                  <div style={{ display: 'flex', gap: '0.2rem' }}>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.5rem', opacity: idx === 0 ? 0.35 : 1, cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                      disabled={idx === 0}
                      onClick={() => moveArrayItem('experience', idx, 'up')}
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.5rem', opacity: idx === resumeData.experience.length - 1 ? 0.35 : 1, cursor: idx === resumeData.experience.length - 1 ? 'not-allowed' : 'pointer' }}
                      disabled={idx === resumeData.experience.length - 1}
                      onClick={() => moveArrayItem('experience', idx, 'down')}
                      title="Move Down"
                    >
                      ▼
                    </button>
                    <button className="btn-secondary" style={{ padding: '0.5rem', color: 'var(--color-danger)' }} onClick={() => removeArrayItem('experience', idx)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
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
              <h3 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Academic History</h3>
              <button className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => addArrayItem('education', { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' })}>
                <Plus size={14} /> Add Education
              </button>
            </div>

            {resumeData.education.map((edu, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input className="form-input" style={{ flex: 1 }} placeholder="School" value={edu.school || ''} onChange={(e) => handleArrayFieldChange('education', idx, 'school', e.target.value)} />
                  <input className="form-input" style={{ flex: 1 }} placeholder="Degree & Major" value={edu.degree || ''} onChange={(e) => handleArrayFieldChange('education', idx, 'degree', e.target.value)} />
                  <div style={{ display: 'flex', gap: '0.2rem' }}>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.5rem', opacity: idx === 0 ? 0.35 : 1, cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                      disabled={idx === 0}
                      onClick={() => moveArrayItem('education', idx, 'up')}
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.5rem', opacity: idx === resumeData.education.length - 1 ? 0.35 : 1, cursor: idx === resumeData.education.length - 1 ? 'not-allowed' : 'pointer' }}
                      disabled={idx === resumeData.education.length - 1}
                      onClick={() => moveArrayItem('education', idx, 'down')}
                      title="Move Down"
                    >
                      ▼
                    </button>
                    <button className="btn-secondary" style={{ padding: '0.5rem', color: 'var(--color-danger)' }} onClick={() => removeArrayItem('education', idx)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
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
              <h3 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Projects</h3>
              <button className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => addArrayItem('projects', { name: '', description: '', url: '' })}>
                <Plus size={14} /> Add Project
              </button>
            </div>

            {resumeData.projects.map((proj, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input className="form-input" style={{ flex: 1 }} placeholder="Project Name" value={proj.name || ''} onChange={(e) => handleArrayFieldChange('projects', idx, 'name', e.target.value)} />
                  <input className="form-input" style={{ flex: 1 }} placeholder="Project URL" value={proj.url || ''} onChange={(e) => handleArrayFieldChange('projects', idx, 'url', e.target.value)} />
                  <div style={{ display: 'flex', gap: '0.2rem' }}>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.5rem', opacity: idx === 0 ? 0.35 : 1, cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                      disabled={idx === 0}
                      onClick={() => moveArrayItem('projects', idx, 'up')}
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.5rem', opacity: idx === resumeData.projects.length - 1 ? 0.35 : 1, cursor: idx === resumeData.projects.length - 1 ? 'not-allowed' : 'pointer' }}
                      disabled={idx === resumeData.projects.length - 1}
                      onClick={() => moveArrayItem('projects', idx, 'down')}
                      title="Move Down"
                    >
                      ▼
                    </button>
                    <button className="btn-secondary" style={{ padding: '0.5rem', color: 'var(--color-danger)' }} onClick={() => removeArrayItem('projects', idx)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
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
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Technical Keywords</h3>
            <div className="form-group">
              <label className="form-label">Keywords (Comma-separated)</label>
              <textarea className="form-textarea" rows={5} placeholder="React, Node.js, AWS, Postgres, TailwindCSS..." value={resumeData.skills ? resumeData.skills.join(', ') : ''} onChange={handleSkillsChange} />
            </div>
          </div>
        )}

        {/* Custom Section Editor */}
        {activeSubTab.startsWith('custom_') && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>List of Achievements / Entries:</span>
              <button 
                className="btn-secondary" 
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} 
                onClick={() => addCustomSectionItem(activeSubTab)}
              >
                <Plus size={14} /> Add Bullet
              </button>
            </div>
            
            {((resumeData.customSections?.[activeSubTab]?.items) || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>•</span>
                <input 
                  className="form-input" 
                  style={{ flex: 1 }} 
                  placeholder="e.g. AWS Certified Solutions Architect" 
                  value={item || ''} 
                  onChange={(e) => handleCustomSectionItemChange(activeSubTab, idx, e.target.value)} 
                />
                <button 
                  className="btn-secondary" 
                  style={{ padding: '0.5rem', color: 'var(--color-danger)' }} 
                  onClick={() => removeCustomSectionItem(activeSubTab, idx)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            
            {((resumeData.customSections?.[activeSubTab]?.items) || []).length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)', fontSize: '0.85rem', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '0.75rem' }}>
                No entries added yet. Click "Add Bullet" to add your first point.
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT: Live Printable Preview Pane */}
      <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 130px)' }}>
        <div className="glass-card" style={{ padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', borderRadius: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Template Layout:</span>
            <select className="form-select" style={{ padding: '0.3rem 1.5rem 0.3rem 0.75rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }} value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
              <option value="elegant"   style={{ background: '#121020', color: 'var(--text-main)' }}>Elegant Serif</option>
              <option value="modern"    style={{ background: '#121020', color: 'var(--text-main)' }}>Modern Minimalist</option>
              <option value="technical" style={{ background: '#121020', color: 'var(--text-main)' }}>Technical Indigo</option>
              <option value="executive" style={{ background: '#121020', color: 'var(--text-main)' }}>Executive Two-Column</option>
              <option value="creative"  style={{ background: '#121020', color: 'var(--text-main)' }}>Creative Gradient</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Color Accent Presets */}
            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
              {[
                { hex: '#0f172a', name: 'Charcoal' },
                { hex: '#3b82f6', name: 'Blue' },
                { hex: '#10b981', name: 'Emerald' },
                { hex: '#6d28d9', name: 'Purple' },
                { hex: '#ec4899', name: 'Rose' },
                { hex: '#991b1b', name: 'Burgundy' }
              ].map(color => (
                <button
                  key={color.hex}
                  onClick={() => setLayoutSettings(prev => ({ ...prev, accentColor: color.hex }))}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: color.hex,
                    border: layoutSettings.accentColor === color.hex ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                    boxShadow: layoutSettings.accentColor === color.hex ? `0 0 6px ${color.hex}` : 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.15s ease',
                    transform: layoutSettings.accentColor === color.hex ? 'scale(1.15)' : 'scale(1)'
                  }}
                  title={color.name}
                />
              ))}
            </div>

            <button 
              className="btn-secondary" 
              style={{ 
                padding: '0.3rem 0.65rem', 
                fontSize: '0.8rem', 
                borderColor: layoutSettings.showCustomizer ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)', 
                background: layoutSettings.showCustomizer ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.025)',
                color: 'var(--text-main)'
              }} 
              onClick={() => setLayoutSettings(prev => ({ ...prev, showCustomizer: !prev.showCustomizer }))}
            >
              ⚙️ Spacing
            </button>
          </div>
        </div>

        {/* Spacing & Layout Customizer Drawer */}
        {layoutSettings.showCustomizer && (
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'tabFadeIn 0.2s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              
              {/* Font Size Slider */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span>Font Size</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--color-primary-hover)' }}>{layoutSettings.fontSize}px</span>
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="16" 
                  step="1" 
                  style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                  value={layoutSettings.fontSize} 
                  onChange={e => setLayoutSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))} 
                />
              </div>

              {/* Line Height Slider */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span>Line Spacing</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--color-primary-hover)' }}>{layoutSettings.lineHeight}x</span>
                </label>
                <input 
                  type="range" 
                  min="1.1" 
                  max="1.8" 
                  step="0.05" 
                  style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                  value={layoutSettings.lineHeight} 
                  onChange={e => setLayoutSettings(prev => ({ ...prev, lineHeight: parseFloat(e.target.value) }))} 
                />
              </div>

              {/* Margins Slider */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span>Margins (A4 padding)</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--color-primary-hover)' }}>{layoutSettings.margin}mm</span>
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="24" 
                  step="1" 
                  style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                  value={layoutSettings.margin} 
                  onChange={e => setLayoutSettings(prev => ({ ...prev, margin: parseInt(e.target.value) }))} 
                />
              </div>



            </div>
          </div>
        )}


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

        <div 
          className={`resume-preview-container template-${selectedTemplate}`} 
          id="printable-cv" 
          ref={resumePreviewRef}
          style={{
            fontSize: `${layoutSettings.fontSize}px`,
            lineHeight: layoutSettings.lineHeight,
            padding: `${layoutSettings.margin}mm`,
            '--theme-color': layoutSettings.accentColor,
            '--theme-bg': layoutSettings.accentColor + '0d'
          }}
        >
          <h1>{resumeData.personalInfo.fullName || 'Your Name'}</h1>
          <div className="contact-info">
            {resumeData.personalInfo.title && <span>{resumeData.personalInfo.title}</span>}
            {resumeData.personalInfo.email && <span> | {resumeData.personalInfo.email}</span>}
            {resumeData.personalInfo.phone && <span> | {resumeData.personalInfo.phone}</span>}
            {resumeData.personalInfo.location && <span> | {resumeData.personalInfo.location}</span>}
            {resumeData.personalInfo.linkedin && <span> | {resumeData.personalInfo.linkedin}</span>}
          </div>

          {sections.map(secKey => {
            if (secKey === 'summary' && resumeData.summary) {
              return (
                <div key="summary">
                  <div className="section-title">Summary</div>
                  <p style={{ fontSize: '13px', color: '#334155' }}>{resumeData.summary}</p>
                </div>
              );
            }
            if (secKey === 'skills' && resumeData.skills && resumeData.skills.length > 0) {
              return (
                <div key="skills">
                  <div className="section-title">Skills & Technologies</div>
                  <p style={{ fontSize: '13px', color: '#334155', fontWeight: 'bold' }}>
                    {resumeData.skills.join(', ')}
                  </p>
                </div>
              );
            }
            if (secKey === 'experience' && resumeData.experience && resumeData.experience.length > 0) {
              return (
                <div key="experience">
                  <div className="section-title">Work Experience</div>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '13.5px' }}>
                        <span>{exp.role} — {exp.company}</span>
                        <span>{exp.startDate} - {exp.endDate}</span>
                      </div>
                      {exp.description && (
                        <ul style={{ paddingLeft: '1.2rem', marginTop: '0.25rem', fontSize: '12.5px', color: '#334155' }}>
                          {exp.description
                            .replace(/\r\n/g, '\n').replace(/\n{2,}/g, '\n')
                            .split('\n')
                            .map(b => b.replace(/^[•\-\*\s]+/, '').trim())
                            .filter(b => b.length > 1)
                            .map((bullet, bidx) => (
                              <li key={bidx} style={{ listStyleType: 'disc', marginBottom: '0.15rem' }}>
                                {bullet}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              );
            }
            if (secKey === 'education' && resumeData.education && resumeData.education.length > 0) {
              return (
                <div key="education">
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
                </div>
              );
            }
            if (secKey === 'projects' && resumeData.projects && resumeData.projects.length > 0) {
              return (
                <div key="projects">
                  <div className="section-title">Personal Projects</div>
                  {resumeData.projects.map((proj, idx) => (
                    <div key={idx} style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '13.5px' }}>
                        <span>{proj.name}</span>
                      </div>
                      {proj.description && (
                        <ul style={{ paddingLeft: '1.2rem', marginTop: '0.25rem', fontSize: '12.5px', color: '#334155' }}>
                          {proj.description
                            .replace(/\r\n/g, '\n').replace(/\n{2,}/g, '\n')
                            .split('\n')
                            .map(b => b.replace(/^[•\-\*\s]+/, '').trim())
                            .filter(b => b.length > 1)
                            .map((bullet, bidx) => (
                              <li key={bidx} style={{ listStyleType: 'disc', marginBottom: '0.15rem' }}>
                                {bullet}
                              </li>
                            ))}
                        </ul>
                      )}
                      {proj.url && (
                        <div style={{ fontSize: '11.5px', marginTop: '0.2rem', paddingLeft: '1.2rem', textAlign: 'left' }}>
                          🔗 <a href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--theme-color, #2563eb)', textDecoration: 'none', fontWeight: 500 }}>{proj.url}</a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            }
            
            // Custom sections
            const customSec = resumeData.customSections?.[secKey];
            if (customSec && customSec.items && customSec.items.length > 0) {
              return (
                <div key={secKey}>
                  <div className="section-title">{customSec.title}</div>
                  <ul style={{ paddingLeft: '1.2rem', marginTop: '0.25rem', fontSize: '12.5px', color: '#334155' }}>
                    {customSec.items.map((item, idx) => (
                      <li key={idx} style={{ listStyleType: 'disc', marginBottom: '0.15rem' }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
      
    </div>
  );
}
