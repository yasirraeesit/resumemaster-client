import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, Globe, HelpCircle, Copy, Check, Mic, MicOff, Star, Trash2, FolderOpen, Save } from 'lucide-react';

export default function CareerSuite({ resumeData, token }) {
  const [activeTool, setActiveTool] = useState('cover');
  const [targetJd, setTargetJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Cover Letter parameters
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Detailed');

  // Generated materials
  const [coverLetter, setCoverLetter] = useState('');
  const [linkedin, setLinkedin] = useState(null);
  const [interviewPrep, setInterviewPrep] = useState(null);

  // Saved documents dashboard
  const [savedDocs, setSavedDocs] = useState([]);
  const [saveTitle, setSaveTitle] = useState('');
  const [savingDoc, setSavingDoc] = useState(false);

  // Speech-to-text and Interview evaluations states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingQuestionId, setRecordingQuestionId] = useState(null);
  const [transcripts, setTranscripts] = useState({});
  const [evalLoading, setEvalLoading] = useState({});
  const [evaluations, setEvaluations] = useState({});

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  // Fetch saved documents if token is active
  const fetchSavedDocuments = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (Array.isArray(result)) {
        setSavedDocs(result);
      }
    } catch (err) {
      console.warn('Failed to load saved documents:', err);
    }
  };

  useEffect(() => {
    if (activeTool === 'saved') {
      fetchSavedDocuments();
    }
  }, [activeTool, token]);

  const getFullResumeText = () => {
    return `
      ${resumeData.personalInfo?.fullName || ''}
      ${resumeData.personalInfo?.title || ''}
      ${resumeData.summary || ''}
      ${(resumeData.skills || []).join(' ')}
      ${(resumeData.experience || []).map(e => `${e.role} ${e.company} ${e.description}`).join(' ')}
      ${(resumeData.projects || []).map(p => `${p.name} ${p.description}`).join(' ')}
    `;
  };

  const getKeywordsCheck = () => {
    if (!targetJd) return [];
    const candidateSkills = resumeData.skills || [];
    const jdLower = targetJd.toLowerCase();
    
    const relevantSkills = candidateSkills.filter(skill => {
      if (!skill) return false;
      const cleanSkill = skill.toLowerCase().trim();
      if (cleanSkill.length < 2) return false;
      const regex = new RegExp('\\b' + cleanSkill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'i');
      return regex.test(jdLower);
    });

    const clLower = (coverLetter || '').toLowerCase();
    return relevantSkills.map(skill => {
      const cleanSkill = skill.toLowerCase().trim();
      const regex = new RegExp('\\b' + cleanSkill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'i');
      const isMatched = regex.test(clLower);
      return { skill, isMatched };
    });
  };

  const handleGenerate = async () => {
    if (activeTool !== 'linkedin' && activeTool !== 'saved' && (!targetJd || targetJd.trim() === '')) {
      alert('Please paste a target Job Description first.');
      return;
    }
    setLoading(true);
    setCopied(false);

    const body = {
      resumeText: getFullResumeText(),
      jobDescription: targetJd,
      tone,
      length
    };

    try {
      if (activeTool === 'cover') {
        const res = await fetch(`${API_URL}/career/cover-letter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const result = await res.json();
        setCoverLetter(result.coverLetter || '');
      } else if (activeTool === 'linkedin') {
        const res = await fetch(`${API_URL}/career/linkedin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText: getFullResumeText() })
        });
        const result = await res.json();
        setLinkedin(result);
      } else if (activeTool === 'interview') {
        const res = await fetch(`${API_URL}/career/interview-prep`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const result = await res.json();
        setInterviewPrep(result.questions || []);
      }
    } catch (err) {
      alert('Failed to generate materials. Verify backend server is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save generated document to database
  const handleSaveDoc = async (type, content) => {
    if (!token) {
      alert('Please Sign In first to save documents to your profile.');
      return;
    }
    if (!saveTitle.trim()) {
      alert('Please provide a document title (e.g. Cover Letter - Stripe).');
      return;
    }

    setSavingDoc(true);
    try {
      const response = await fetch(`${API_URL}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: saveTitle,
          content: content,
          type: type
        })
      });
      const result = await response.json();
      if (result.success) {
        alert('Document saved successfully to your MongoDB profile!');
        setSaveTitle('');
        fetchSavedDocuments();
      } else {
        alert(result.error || 'Failed to save document.');
      }
    } catch (err) {
      alert('Save request failed.');
    } finally {
      setSavingDoc(false);
    }
  };

  // Delete saved document
  const handleDeleteDoc = async (id) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      const response = await fetch(`${API_URL}/documents/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        fetchSavedDocuments();
      }
    } catch (err) {
      alert('Delete request failed.');
    }
  };

  // Browser-based Speech-to-Text handler
  const handleRecordSpeech = (qId) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Try Google Chrome or Safari.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      setRecordingQuestionId(null);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setRecordingQuestionId(qId);
    };

    recognition.onresult = (event) => {
      const resultText = event.results[0][0].transcript;
      setTranscripts(prev => ({
        ...prev,
        [qId]: (prev[qId] || '') + ' ' + resultText
      }));
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      setRecordingQuestionId(null);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setRecordingQuestionId(null);
    };

    recognition.start();
  };

  // Evaluate transcribed answer with Gemini
  const handleEvaluateAnswer = async (qId, questionText) => {
    const answer = transcripts[qId];
    if (!answer || answer.trim() === '') {
      alert('Please speak or type an answer first before evaluating.');
      return;
    }

    setEvalLoading(prev => ({ ...prev, [qId]: true }));
    try {
      const response = await fetch(`${API_URL}/career/interview-evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          userAnswer: answer,
          resumeText: getFullResumeText()
        })
      });
      const result = await response.json();
      setEvaluations(prev => ({
        ...prev,
        [qId]: result
      }));
    } catch (err) {
      alert('Failed to evaluate answer. Verify backend server on port 5001.');
    } finally {
      setEvalLoading(prev => ({ ...prev, [qId]: false }));
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
      
      {/* LEFT: Configuration Input */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={22} className="logo-highlight" />
          AI Copilot Suite
        </h2>

        {/* Tool selectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            className={`btn-secondary ${activeTool === 'cover' ? 'active' : ''}`}
            style={{ justifyContent: 'flex-start', background: activeTool === 'cover' ? 'rgba(139,92,246,0.1)' : 'transparent', borderColor: activeTool === 'cover' ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)' }}
            onClick={() => { setActiveTool('cover'); setCopied(false); }}
          >
            <FileText size={18} /> Tailored Cover Letter
          </button>
          <button
            className={`btn-secondary ${activeTool === 'linkedin' ? 'active' : ''}`}
            style={{ justifyContent: 'flex-start', background: activeTool === 'linkedin' ? 'rgba(139,92,246,0.1)' : 'transparent', borderColor: activeTool === 'linkedin' ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)' }}
            onClick={() => { setActiveTool('linkedin'); setCopied(false); }}
          >
            <Globe size={18} /> LinkedIn Optimization
          </button>
          <button
            className={`btn-secondary ${activeTool === 'interview' ? 'active' : ''}`}
            style={{ justifyContent: 'flex-start', background: activeTool === 'interview' ? 'rgba(139,92,246,0.1)' : 'transparent', borderColor: activeTool === 'interview' ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)' }}
            onClick={() => { setActiveTool('interview'); setCopied(false); }}
          >
            <HelpCircle size={18} /> Mock Interview Prep (STT)
          </button>
          <button
            className={`btn-secondary ${activeTool === 'saved' ? 'active' : ''}`}
            style={{ justifyContent: 'flex-start', background: activeTool === 'saved' ? 'rgba(139,92,246,0.1)' : 'transparent', borderColor: activeTool === 'saved' ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)' }}
            onClick={() => { setActiveTool('saved'); setCopied(false); }}
          >
            <FolderOpen size={18} /> Saved Materials ({savedDocs.length})
          </button>
        </div>

        {activeTool !== 'linkedin' && activeTool !== 'saved' && (
          <div className="form-group">
            <label className="form-label">Target Job Description</label>
            <textarea
              className="form-textarea"
              rows={6}
              placeholder="Paste the job description listing to align and target..."
              value={targetJd}
              onChange={(e) => setTargetJd(e.target.value)}
            />
          </div>
        )}

        {activeTool === 'cover' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Tone</label>
              <select 
                className="form-input" 
                value={tone} 
                onChange={(e) => setTone(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-main)', fontSize: '0.8rem', padding: '0.4rem 0.5rem' }}
              >
                <option value="Professional">Professional</option>
                <option value="Confident">Confident</option>
                <option value="Enthusiastic">Enthusiastic</option>
                <option value="Creative">Creative</option>
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Length</label>
              <select 
                className="form-input" 
                value={length} 
                onChange={(e) => setLength(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-main)', fontSize: '0.8rem', padding: '0.4rem 0.5rem' }}
              >
                <option value="Detailed">Detailed (~400 words)</option>
                <option value="Short">Short (~250 words)</option>
              </select>
            </div>
          </div>
        )}

        {activeTool !== 'saved' && (
          <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
            {loading ? 'Analyzing & Tailoring...' : 'Generate AI Materials'}
          </button>
        )}
        
        {activeTool === 'saved' && !token && (
          <div style={{ fontSize: '0.85rem', color: 'var(--color-warning)', background: 'rgba(245,158,11,0.05)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(245,158,11,0.15)' }}>
            Please sign in to retrieve your saved documents from MongoDB Compass database.
          </div>
        )}
      </div>

      {/* RIGHT: Results Display Panel */}
      <div className="glass-card" style={{ maxHeight: 'calc(100vh - 130px)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
            {activeTool === 'saved' ? 'Saved Document dashboard' : 'Generated Artifacts'}
          </h3>
          {copied && <span style={{ fontSize: '0.8rem', color: 'var(--color-success)', fontWeight: 'bold' }}>Copied!</span>}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem' }}>
            Running Gemini deep alignment models...
          </div>
        ) : (
          <div>
            
            {/* Cover Letter */}
            {activeTool === 'cover' && (
              <div>
                {coverLetter ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Document Title"
                          value={saveTitle}
                          onChange={(e) => setSaveTitle(e.target.value)}
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', width: '220px' }}
                        />
                        <button className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', gap: '0.25rem' }} onClick={() => handleSaveDoc('cover_letter', coverLetter)} disabled={savingDoc}>
                          <Save size={12} /> Save to Profile
                        </button>
                      </div>
                      <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', gap: '0.25rem' }} onClick={() => handleCopy(coverLetter)}>
                        <Copy size={12} /> Copy
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '1.25rem', marginTop: '0.5rem' }}>
                      {/* Left: Cover Letter Editor */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <textarea
                          className="form-textarea"
                          rows={24}
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.88rem',
                            color: 'var(--text-muted)',
                            background: 'rgba(0,0,0,0.2)',
                            padding: '1.25rem',
                            borderRadius: '0.75rem',
                            border: '1px solid rgba(255,255,255,0.05)',
                            lineHeight: '1.6',
                            resize: 'vertical'
                          }}
                        />
                      </div>

                      {/* Right: Live ATS Keywords Match Panel */}
                      <div className="glass-card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '0.75rem', height: 'fit-content' }}>
                        <h4 style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem', fontWeight: 'bold' }}>
                          <Sparkles size={14} /> ATS Keywords Check
                        </h4>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '1rem', lineHeight: 1.4 }}>
                          These skills from your profile match the target JD. Make sure they are mentioned in the cover letter text:
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {getKeywordsCheck().length === 0 ? (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                              No matching keywords found between your skills and the JD.
                            </div>
                          ) : (
                            getKeywordsCheck().map(({ skill, isMatched }) => (
                              <div key={skill} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                fontSize: '0.75rem',
                                color: isMatched ? 'var(--text-main)' : 'var(--text-dim)',
                                background: isMatched ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.01)',
                                padding: '0.35rem 0.5rem',
                                borderRadius: '0.35rem',
                                border: isMatched ? '1px solid rgba(16,185,129,0.15)' : '1px solid rgba(255,255,255,0.03)',
                                transition: 'all 0.25s ease'
                              }}>
                                <span style={{ color: isMatched ? '#10b981' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                  {isMatched ? '✓' : '○'}
                                </span>
                                <span style={{ fontWeight: isMatched ? 600 : 'normal' }}>{skill}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '3rem' }}>No cover letter generated yet. Click generate above.</div>
                )}
              </div>
            )}

            {/* LinkedIn */}
            {activeTool === 'linkedin' && (
              <div>
                {linkedin ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Document Title"
                        value={saveTitle}
                        onChange={(e) => setSaveTitle(e.target.value)}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', width: '220px' }}
                      />
                      <button className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', gap: '0.25rem' }} onClick={() => handleSaveDoc('linkedin', JSON.stringify(linkedin))} disabled={savingDoc}>
                        <Save size={12} /> Save Optimization
                      </button>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Headline Options</h4>
                      {linkedin.headlines?.map((hl, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                          <span style={{ flex: 1, color: 'var(--text-muted)' }}>{hl}</span>
                          <button style={{ background: 'transparent', border: 'none', color: 'var(--color-primary-hover)', cursor: 'pointer' }} onClick={() => handleCopy(hl)}>
                            <Copy size={13} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>About Summary</h4>
                        <button className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }} onClick={() => handleCopy(linkedin.about)}>
                          Copy About
                        </button>
                      </div>
                      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', lineHeight: '1.5' }}>
                        {linkedin.about}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '3rem' }}>No LinkedIn optimizations generated yet.</div>
                )}
              </div>
            )}

            {/* Interview Prep & Speech Evaluation */}
            {activeTool === 'interview' && (
              <div>
                {interviewPrep && interviewPrep.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {interviewPrep.map((q, idx) => (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', padding: '1.25rem', borderRadius: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', background: q.type === 'Technical' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(236, 72, 153, 0.15)', color: q.type === 'Technical' ? 'var(--color-accent)' : 'var(--color-secondary)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 'bold' }}>
                            {q.type}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Q#{q.id}</span>
                        </div>
                        <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.75rem', lineHeight: '1.4' }}>{q.question}</h4>
                        
                        {/* Audio Speech Recording Interface */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.04)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 'bold' }}>Spoken Response Simulator</span>
                            <button
                              className="btn-secondary"
                              onClick={() => handleRecordSpeech(q.id)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.75rem',
                                background: recordingQuestionId === q.id ? 'var(--color-danger)' : 'transparent',
                                borderColor: recordingQuestionId === q.id ? 'transparent' : 'rgba(255,255,255,0.15)',
                                color: 'var(--text-main)',
                                gap: '0.25rem'
                              }}
                            >
                              {recordingQuestionId === q.id ? <MicOff size={12} /> : <Mic size={12} />}
                              {recordingQuestionId === q.id ? 'Stop Dictating' : 'Speak Answer'}
                            </button>
                          </div>
                          
                          <textarea
                            className="form-textarea"
                            rows={3}
                            placeholder="Click 'Speak Answer' to record, or type your practice response here..."
                            value={transcripts[q.id] || ''}
                            onChange={(e) => setTranscripts(prev => ({ ...prev, [q.id]: e.target.value }))}
                            style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.08)' }}
                          />

                          {transcripts[q.id] && (
                            <button
                              className="btn-primary"
                              onClick={() => handleEvaluateAnswer(q.id, q.question)}
                              disabled={evalLoading[q.id]}
                              style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                            >
                              {evalLoading[q.id] ? 'Coaching Model Analyzing Spoken Answer...' : 'Evaluate Answer with AI Coach'}
                            </button>
                          )}
                        </div>

                        {/* Speech Evaluation Diagnostics */}
                        {evaluations[q.id] && (
                          <div style={{ background: 'rgba(13, 10, 26, 0.5)', padding: '1rem', borderRadius: '0.5rem', border: '1.5px solid var(--color-primary)', marginTop: '0.75rem' }}>
                            <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                              <h5 style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 'bold' }}>AI Evaluation Score</h5>
                              <span style={{ fontSize: '0.85rem', background: 'var(--color-primary)', color: 'var(--text-main)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
                                {evaluations[q.id].score}/100
                              </span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <div><strong>Strengths:</strong> {evaluations[q.id].strengths}</div>
                              <div><strong>Weaknesses:</strong> {evaluations[q.id].weaknesses}</div>
                              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '4px', marginTop: '0.25rem' }}>
                                <strong>Recommended Model Answer (STAR):</strong>
                                <p style={{ marginTop: '0.25rem', italic: 'true', fontSize: '0.75rem', color: 'var(--text-main)' }}>
                                  {evaluations[q.id].modelAnswer}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div style={{ background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
                          <h5 style={{ fontSize: '0.8rem', color: 'var(--color-primary-hover)', marginBottom: '0.25rem' }}>Coaching Answer Tips:</h5>
                          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                            {q.tips}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '3rem' }}>No interview preparation cards predicted yet.</div>
                )}
              </div>
            )}

            {/* Saved Documents Tab */}
            {activeTool === 'saved' && (
              <div>
                {savedDocs.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {savedDocs.map((doc) => (
                      <div key={doc._id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.7rem', background: doc.type === 'cover_letter' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(236, 72, 153, 0.15)', color: doc.type === 'cover_letter' ? 'var(--color-accent)' : 'var(--color-secondary)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 'bold' }}>
                              {doc.type === 'cover_letter' ? 'Cover Letter' : 'LinkedIn Opt'}
                            </span>
                            <h4 style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 'bold' }}>{doc.title}</h4>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', gap: '0.25rem' }} onClick={() => handleCopy(doc.content)}>
                              <Copy size={12} /> Copy
                            </button>
                            <button className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDeleteDoc(doc._id)}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        
                        {doc.type === 'cover_letter' ? (
                          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                            {doc.content}
                          </pre>
                        ) : (
                          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: '0.5rem', maxHeight: '180px', overflowY: 'auto', fontSize: '0.8rem' }}>
                            {/* LinkedIn content parse */}
                            {(() => {
                              try {
                                const parsed = JSON.parse(doc.content);
                                return (
                                  <div>
                                    <div style={{ fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Headlines:</div>
                                    <ul style={{ paddingLeft: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                      {parsed.headlines?.map((hl, i) => <li key={i}>{hl}</li>)}
                                    </ul>
                                    <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>About Summary:</div>
                                    <p style={{ color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{parsed.about}</p>
                                  </div>
                                );
                              } catch (e) {
                                return <p style={{ color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{doc.content}</p>;
                              }
                            })()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '3rem' }}>
                    No saved cover letters or LinkedIn optimizations found. Generate one and save it to profile.
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
