import React, { useState, useEffect } from 'react';
import { Flame, Star, X, Check, AlertTriangle, CheckCircle, Sparkles, Plus, Globe, ExternalLink, MapPin, Target } from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_JOBS = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'Vercel',
    location: 'Remote',
    url: 'https://vercel.com/careers',
    description: `We are looking for a Senior Frontend Developer specializing in React, Next.js, TypeScript, and CSS variables. You will optimize core web vitals, build responsive interfaces, and lead state management refactoring. Strong proficiency in Node.js, REST APIs, Git, and accessibility (a11y) is required.`
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'Linear',
    location: 'San Francisco, CA',
    url: 'https://linear.app/careers',
    description: `Linear is seeking a Full Stack Engineer to build lightning-fast web applications. The ideal candidate has expertise in React, Node.js, PostgreSQL, Docker, Redis, and GraphQL. Experience with TailwindCSS, microservices architecture, and AWS ECS/S3 deploy environments is required.`
  },
  {
    id: 3,
    title: 'AI Engineering Fellow',
    company: 'OpenAI',
    location: 'San Francisco, CA',
    url: 'https://openai.com/careers',
    description: `Join us to build APIs and frontends for next-gen models. Strong experience with Python, Node.js, PyTorch, LangChain, vector databases (Pinecone), and LLM API integrations (Gemini, GPT) is required. Familiarity with React, WebSockets, and Kubernetes is highly preferred.`
  }
];

export default function JobMatcher({ resumeData, setResumeData, onAddToWishlist, onGoToTracker }) {
  const [jobs, setJobs] = useState(SAMPLE_JOBS);
  const [jobIndex, setJobIndex] = useState(0);
  const [customJd, setCustomJd] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState('');
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [swipeDir, setSwipeDir] = useState('');
  const [syncedJob, setSyncedJob] = useState(null);

  // Fetch live developer jobs from Arbeitnow public API
  useEffect(() => {
    const loadLiveJobs = async () => {
      try {
        const response = await fetch('https://www.arbeitnow.com/api/job-board-api');
        const result = await response.json();
        if (result && result.data && result.data.length > 0) {
          const fetchedJobs = result.data.map((job, idx) => {
            // Helper to strip HTML tags from raw descriptions
            const cleanedText = (job.description || '')
              .replace(/<\/?[^>]+(>|$)/g, "")
              .replace(/&nbsp;/g, " ")
              .replace(/&amp;/g, "&")
              .replace(/\n\s*\n/g, '\n')
              .trim();
              
            return {
              id: idx + 4,
              title: job.title,
              company: job.company_name,
              location: job.location || 'Remote',
              url: job.url,
              description: cleanedText.length > 300 ? cleanedText.slice(0, 300) + '...' : cleanedText,
              fullDescription: cleanedText
            };
          });
          setJobs([...SAMPLE_JOBS, ...fetchedJobs]);
        }
      } catch (err) {
        console.warn('[JobMatcher] Failed to pull live postings, using fallbacks:', err);
      }
    };
    loadLiveJobs();
  }, []);

  const currentJob = jobs[jobIndex % jobs.length];

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

  const handleMatch = async (jdText) => {
    setLoading(true);
    setMatchResult(null);
    setSuggestions('');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    try {
      const response = await fetch(`${API_URL}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: getFullResumeText(),
          resumeSkills: resumeData.skills || [],
          jobDescription: jdText
        })
      });
      const result = await response.json();
      setMatchResult(result);
      
      if (result.score >= 70) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      alert('Match failed. Verify that server is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (dir) => {
    setSwipeDir(dir);
    const jobBeingActedOn = currentJob;
    setTimeout(() => {
      if (dir === 'right') {
        // Push to tracker wishlist
        if (onAddToWishlist) {
          onAddToWishlist(jobBeingActedOn);
          setSyncedJob(jobBeingActedOn);
          // Auto-dismiss the banner after 6s
          setTimeout(() => setSyncedJob(null), 6000);
        }
        // Run match diagnostic on either full description or summary description
        handleMatch(jobBeingActedOn.fullDescription || jobBeingActedOn.description);
      } else {
        setMatchResult(null);
        setSyncedJob(null);
        setJobIndex(prev => prev + 1);
      }
      setSwipeDir('');
    }, 500);
  };

  const handleSuggest = async () => {
    if (!matchResult) return;
    setSuggestLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    try {
      const response = await fetch(`${API_URL}/ai/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: getFullResumeText(),
          jobDescription: customJd || currentJob.fullDescription || currentJob.description
        })
      });
      const result = await response.json();
      if (result.suggestedBullets) {
        setSuggestions(result.suggestedBullets);
      }
    } catch (err) {
      alert('Suggestions request failed. Backend configuration issue.');
    } finally {
      setSuggestLoading(false);
    }
  };

  const handleAddSuggestion = () => {
    if (!suggestions) return;
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: 'Target Match Achievement',
          role: 'Custom Tailored Contribution',
          startDate: 'Recent',
          endDate: 'Present',
          description: suggestions
        }
      ]
    }));
    alert('AI recommended accomplishments added to your resume draft!');
    setSuggestions('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
      
      {/* LEFT PANEL: Tinder-style card deck */}
      <div>
        <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Flame size={22} className="logo-highlight" />
          Interactive Job Swiper
        </h2>

        {/* Custom JD Entry */}
        <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Match Custom Job Description</h4>
          <textarea
            className="form-textarea"
            placeholder="Paste any active job posting description here to calculate ATS match score..."
            value={customJd}
            onChange={(e) => setCustomJd(e.target.value)}
            style={{ fontSize: '0.85rem' }}
          />
          {customJd && (
            <button className="btn-primary" style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.85rem' }} onClick={() => handleMatch(customJd)} disabled={loading}>
              Calculate Match Score
            </button>
          )}
        </div>

        {/* Swiping Deck */}
        <div className={`glass-card ${swipeDir === 'left' ? 'swipe-left' : swipeDir === 'right' ? 'swipe-right' : ''}`} style={{ position: 'relative', overflow: 'hidden', padding: '2rem', minHeight: '380px', display: 'flex', flexDirection: 'column', justifycontent: 'space-between', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--color-primary-hover)', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontWeight: 'bold' }}>
                {currentJob.company}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <MapPin size={10} /> {currentJob.location}
                </span>
              </div>
            </div>
            
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {currentJob.title}
              {currentJob.url && (
                <a href={currentJob.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-hover)' }}>
                  <ExternalLink size={16} />
                </a>
              )}
            </h3>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {currentJob.description}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn-secondary" style={{ borderRadius: '50%', width: '50px', height: '50px', padding: 0, color: 'var(--color-danger)' }} onClick={() => handleSwipe('left')}>
              <X size={24} />
            </button>
            <button className="btn-primary" style={{ borderRadius: '50%', width: '50px', height: '50px', padding: 0 }} onClick={() => handleSwipe('right')}>
              <Check size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Match Diagnostic Audits */}
      <div className="glass-card" style={{ maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Match Analytics Dashboard</h3>

        {/* Sync Confirmation Banner */}
        {syncedJob && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '0.65rem',
            padding: '0.85rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            animation: 'tabFadeIn 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.1rem' }}>🎯</span>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10b981' }}>Added to Wishlist!</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <strong>{syncedJob.title}</strong> @ {syncedJob.company} is now in your Job Tracker.
                </div>
              </div>
            </div>
            <button
              className="btn-secondary"
              style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', whiteSpace: 'nowrap', borderColor: 'rgba(16,185,129,0.3)', color: '#10b981' }}
              onClick={onGoToTracker}
            >
              View Tracker →
            </button>
          </div>
        )}
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Analyzing Compatibility and Keywords...</div>
        ) : matchResult ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Score Ring */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', background: `conic-gradient(var(--color-primary) ${matchResult.score}%, rgba(255,255,255,0.05) 0)`, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.25rem', color: 'var(--text-main)' }}>
                  {matchResult.score}%
                </div>
              </div>
              <div>
                <h4 style={{ color: 'var(--text-main)', fontSize: '1rem' }}>ATS Alignment Rating</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {matchResult.score >= 80 ? 'Highly compatible! Ideal layout.' : matchResult.score >= 50 ? 'Medium compatibility. Add missing keywords.' : 'Low compatibility. Major gaps detected.'}
                </p>
              </div>
            </div>

            {/* Keyword gaps */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Keywords Check</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                {matchResult.matchedKeywords?.map((kw, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                    ✓ {kw}
                  </span>
                ))}
                {matchResult.missingKeywords?.map((kw, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                    ✗ {kw}
                  </span>
                ))}
              </div>
              {matchResult.missingKeywords?.length > 0 && (
                <div style={{ background: 'rgba(139, 92, 246, 0.05)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(139,92,246,0.1)' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Missing critical skills: <strong>{matchResult.missingKeywords.slice(0, 5).join(', ')}</strong>.
                  </p>
                  <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', gap: '0.25rem' }} onClick={handleSuggest} disabled={suggestLoading}>
                    <Sparkles size={12} /> Generate Tailored Work Bullets
                  </button>
                  
                  {suggestLoading && <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', marginTop: '0.5rem' }}>Generating custom achievements...</div>}
                  
                  {suggestions && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <pre style={{ fontSize: '0.75rem', color: 'var(--text-main)', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                        {suggestions}
                      </pre>
                      <button className="btn-primary" style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', marginTop: '0.5rem' }} onClick={handleAddSuggestion}>
                        <Plus size={12} /> Add to Resume Experience
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Structured match analysis summary */}
            {matchResult.analysis && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>AI Match Diagnostic Summary</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {matchResult.analysis}
                </p>
              </div>
            )}

          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '4rem' }}>
            <Target size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            Swipe RIGHT (✓) on a job card to run active compatibility and ATS keyword analysis.
          </div>
        )}
      </div>

    </div>
  );
}
