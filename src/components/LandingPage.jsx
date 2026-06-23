import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Zap, Target, PenTool, Flame, ListChecks, HelpCircle, Check, Award, Wand2, Globe, Heart, Shield, RefreshCw, FileText, FileUp, Sparkle, Plus } from 'lucide-react';

export default function LandingPage({ onLaunchWorkspace }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  
  // Interactive mockup state to show live AI polish simulation
  const [mockBulletText, setMockBulletText] = useState("• Wrote code for the frontend UI.");
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishStep, setPolishStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPolishing(true);
      setTimeout(() => {
        setMockBulletText("• Engineered responsive React components, improving UI performance by 35%.");
        setIsPolishing(false);
        setPolishStep(1);
      }, 2000);

      setTimeout(() => {
        setIsPolishing(true);
        setTimeout(() => {
          setMockBulletText("• Wrote code for the frontend UI.");
          setIsPolishing(false);
          setPolishStep(0);
        }, 1500);
      }, 6000);

    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const FAQS = [
    { q: "How does the AI Resume Builder work?", a: "Our builder integrates directly with Google's Gemini API to analyze your career achievements. It formats and rewrites your bullets using Google's X-Y-Z formula (Accomplished X, measured by Y, by doing Z) for maximum impact." },
    { q: "What is the Tinder-style Job Matcher?", a: "It's an interactive matching tool. You swipe through standard tech jobs, and our engine automatically performs a real-time comparison with your CV. It computes your ATS compatibility rating and highlights missing keywords." },
    { q: "Can I import my existing resume?", a: "Yes! You can upload an existing PDF resume. Our parser uses Gemini to extract your experience, education, skills, and projects, mapping them straight into our interactive builder." },
    { q: "Is ResumeMaster.online free to use?", a: "Yes! You can create and export your resume completely free. We also offer premium features for advanced AI bullet rewriting and deep match Diagnostics." }
  ];

  return (
    <div style={{ color: 'var(--text-main)', background: 'var(--bg-app)', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      
      {/* Split Hero Section - Inspired by easy-cv.ai */}
      <section className="hero-landing">
        
        {/* Left Side: Dark Hero Info Panel */}
        <div className="hero-landing-panel">
          <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: 'rgba(139,92,246,0.15)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />
          
          <div style={{ maxWidth: '540px', zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', padding: '0.5rem 1.25rem', borderRadius: '9999px', fontSize: '0.85rem', color: '#fff', fontWeight: '600', marginBottom: '2rem' }}>
              <Sparkles size={14} className="floating-element" style={{ color: '#c084fc' }} /> AI-Powered Career Suite
            </div>
            
            <h1 style={{ fontSize: '3.6rem', fontWeight: '800', lineHeight: '1.15', letterSpacing: '-0.03em', marginBottom: '1.5rem', color: '#ffffff' }}>
              Apply smarter.<br />
              <span style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Get hired faster.
              </span>
            </h1>
            
            <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.75)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
              Tailor resumes and cover letters for every job posting, swipe through compatible roles, and land your dream job with high-performance AI.
            </p>

            {/* Bullet Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <Zap size={18} style={{ color: '#c084fc' }} />
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>AI-optimized bullet point writer (Google XYZ formula)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <Flame size={18} style={{ color: '#f472b6' }} />
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>Tinder-style Job Matcher with ATS diagnostic scoring</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <PenTool size={18} style={{ color: '#60a5fa' }} />
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>Custom AI Cover Letters & LinkedIn Optimization</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem' }}>
              <button className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.05rem', borderRadius: '0.75rem' }} onClick={onLaunchWorkspace}>
                Create Your CV Now <ArrowRight size={18} />
              </button>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                Free to start · Ready in 2 minutes
              </span>
            </div>

            {/* Overlapping User Avatars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
              <div style={{ display: 'flex', marginLeft: '0.25rem' }}>
                {['men/32', 'women/44', 'men/75', 'women/65'].map((name, i) => (
                  <img
                    key={i}
                    src={`https://randomuser.me/api/portraits/${name}.jpg`}
                    alt="user"
                    width="32"
                    height="32"
                    loading="lazy"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '2px solid #1e1b4b',
                      marginLeft: i > 0 ? '-10px' : '0',
                      objectFit: 'cover'
                    }}
                  />
                ))}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                ⭐ <strong style={{ color: '#fff' }}>1,000+</strong> resumes built this week
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Light Mockup/Preview Panel */}
        <div className="hero-landing-mockup">
          <div style={{ position: 'absolute', top: '20%', right: '10%', width: '250px', height: '250px', background: 'rgba(139,92,246,0.06)', filter: 'blur(70px)', borderRadius: '50%', pointerEvents: 'none' }} />
          
          <div className="mockup-container floating-element" style={{ animationDuration: '6s' }}>
            <div className="mockup-header">
              <div className="mockup-dot" style={{ background: '#ef4444' }} />
              <div className="mockup-dot" style={{ background: '#f59e0b' }} />
              <div className="mockup-dot" style={{ background: '#10b981' }} />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '1rem', fontFamily: 'monospace' }}>resumemaster.online/builder</span>
            </div>
            
            <div className="mockup-body">
              {/* Form Input fields */}
              <div className="mockup-left">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#64748b' }}>FULL NAME</label>
                  <div className="mockup-field" style={{ fontWeight: 'bold' }}>Jane Doe</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#64748b' }}>JOB TITLE</label>
                  <div className="mockup-field">Senior Frontend Engineer</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#64748b' }}>EXPERIENCE BULLET</label>
                  <div className="mockup-field" style={{ height: '70px', overflow: 'hidden', border: isPolishing ? '1.5px solid #8b5cf6' : '1px solid #cbd5e1', transition: 'border-color 0.3s' }}>
                    {mockBulletText}
                  </div>
                </div>
                <button style={{
                  background: isPolishing ? '#d8b4fe' : '#8b5cf6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}>
                  <Wand2 size={12} /> {isPolishing ? "AI is Polishing..." : "AI Google XYZ Rewrite"}
                </button>
              </div>

              {/* Dynamic live PDF sheet rendering */}
              <div className="mockup-right">
                {isPolishing && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(255,255,255,0.85)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    zIndex: 10
                  }}>
                    <Sparkles size={24} style={{ color: '#8b5cf6', animation: 'spin 1.5s linear infinite' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6' }}>Optimizing metrics & impact...</span>
                  </div>
                )}
                
                <div style={{ textAlign: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#0f172a' }}>Jane Doe</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>San Francisco, CA | jane.doe@example.com</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#8b5cf6', borderBottom: '1px solid #8b5cf6', paddingBottom: '1px' }}>PROFESSIONAL EXPERIENCE</div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 'bold', color: '#1e293b' }}>
                      <span>TechCorp Solutions</span>
                      <span>Jan 2021 – Present</span>
                    </div>
                    <div style={{ fontSize: '0.65rem', italic: 'true', color: '#64748b' }}>Senior Software Engineer</div>
                    <div style={{ fontSize: '0.65rem', color: '#334155', marginTop: '0.25rem', lineHeight: '1.4', background: polishStep === 1 ? '#faf5ff' : 'transparent', padding: '0.25rem', borderRadius: '4px', transition: 'background-color 0.5s' }}>
                      {mockBulletText}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section - Inspired by high-end design systems */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.15)', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.8rem', color: 'var(--color-primary-hover)', fontWeight: 'bold', marginBottom: '1rem' }}>
            Features Set
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>
            Built for modern <span style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>job search success</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Construct premium CV structures and automate matches in a unified career dashboard.
          </p>
        </div>

        <div className="bento-grid">
          
          {/* Card 1: Large Bento Card (AI Resume Builder) */}
          <div className="bento-card bento-large">
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.75rem' }}>AI Resume Builder</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Construct print-ready PDF resumes. Swap templates instantly (Serif, Minimalist, Technical) and auto-optimize bullet points using Google's metrics formula.
              </p>
              <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#fff' }}><Check size={14} color="var(--color-success)" /> Print-Ready Templates</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#fff' }}><Check size={14} color="var(--color-success)" /> Metric XYZ Optimizer</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#fff' }}><Check size={14} color="var(--color-success)" /> Live Preview Swap</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#fff' }}><Check size={14} color="var(--color-success)" /> Clean Font Control</li>
              </ul>
            </div>
            <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--color-primary-hover)', fontWeight: 'bold' }}>
              Powered by Google Gemini API &rarr;
            </div>
          </div>

          {/* Card 2: Small Bento Card (Job Matcher) */}
          <div className="bento-card">
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)', marginBottom: '1.5rem' }}>
                <Flame size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.75rem' }}>Tinder Matcher</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Swipe through tech postings to check real-time ATS keyword compatibility scores and find matching roles instantly.
              </p>
            </div>
            <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 'bold' }}>
              Interactive Matching &rarr;
            </div>
          </div>

          {/* Card 3: Small Bento Card (Job Tracker) */}
          <div className="bento-card">
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
                <ListChecks size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.75rem' }}>Kanban Tracker</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Track applications on an elegant drag-and-drop workflow board from target leads up to final job offers.
              </p>
            </div>
            <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>
              Pipeline Board &rarr;
            </div>
          </div>

          {/* Card 4: Large Bento Card (AI Copilot Suite) */}
          <div className="bento-card bento-large">
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)', marginBottom: '1.5rem' }}>
                <PenTool size={24} />
              </div>
              <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.75rem' }}>AI Career Copilot</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Write tailored cover letters based on target job descriptions, prepare for live technical interviews with predictive mock question simulators, and boost LinkedIn SEO search results.
              </p>
              <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#fff' }}><Check size={14} color="var(--color-success)" /> Mock Interview Simulator</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#fff' }}><Check size={14} color="var(--color-success)" /> Custom AI Cover Letters</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#fff' }}><Check size={14} color="var(--color-success)" /> LinkedIn Summary Generator</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#fff' }}><Check size={14} color="var(--color-success)" /> Key Terms Identifier</li>
              </ul>
            </div>
            <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold' }}>
              Complete Career Co-Pilot &rarr;
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Tabbed Workflow Timeline Section */}
      <section style={{ padding: '6rem 2rem', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139,92,246,0.1)', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.8rem', color: 'var(--color-primary-hover)', fontWeight: 'bold', marginBottom: '1rem' }}>
              Interactive Walkthrough
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>How ResumeMaster works</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Get optimized results and track active opportunities in 3 simple phases.</p>
          </div>

          <div className="workflow-section">
            
            {/* Left side: Interactive Tab Selection */}
            <div className="workflow-tabs-container">
              
              <div className={`workflow-interactive-tab ${activeStep === 0 ? 'active' : ''}`} onClick={() => setActiveStep(0)}>
                <div className="workflow-step-num">1</div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.4rem' }}>Create or Import Experience</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Type your details directly into our clean editor, or drop in your existing PDF CV. Gemini extracts your structured education, projects, and skills.
                  </p>
                </div>
              </div>

              <div className={`workflow-interactive-tab ${activeStep === 1 ? 'active' : ''}`} onClick={() => setActiveStep(1)}>
                <div className="workflow-step-num">2</div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.4rem' }}>AI Bullet & Keyword Analysis</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Trigger Google's metrics formula to re-format accomplishments. Check keywords against target postings to generate optimized diagnostic scores.
                  </p>
                </div>
              </div>

              <div className={`workflow-interactive-tab ${activeStep === 2 ? 'active' : ''}`} onClick={() => setActiveStep(2)}>
                <div className="workflow-step-num">3</div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.4rem' }}>Manage Pipeline & Apply</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Organize submissions, log interviews, and export print-ready resumes. Use the Copilot tab to build cover letters.
                  </p>
                </div>
              </div>

            </div>

            {/* Right side: Live graphic mockup switching */}
            <div className="workflow-preview-panel">
              {activeStep === 0 && (
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', color: '#1e293b' }}>
                  <div>
                    <span style={{ background: '#f5f3ff', color: '#8b5cf6', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>PHASE 1</span>
                    <h3 style={{ fontSize: '1.25rem', marginTop: '0.75rem', color: '#0f172a' }}>Interactive CV Importer</h3>
                    <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem', lineHeight: '1.5' }}>
                      Drag and drop your resume file or fill out details. The builder segments sections instantly.
                    </p>
                  </div>
                  
                  <div style={{ border: '2px dashed #cbd5e1', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center', background: '#f8fafc', position: 'relative' }}>
                    <FileUp size={36} style={{ color: '#8b5cf6', margin: '0 auto 0.75rem' }} />
                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Drop your existing resume PDF here</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>Extracts text & structure in seconds</div>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', color: '#1e293b' }}>
                  <div>
                    <span style={{ background: '#ecfdf5', color: '#10b981', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>PHASE 2</span>
                    <h3 style={{ fontSize: '1.25rem', marginTop: '0.75rem', color: '#0f172a' }}>Keyword Diagnostic Score</h3>
                    <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem', lineHeight: '1.5' }}>
                      Analyze target job descriptions to identify missing skills and keywords automatically.
                    </p>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.75rem', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Target Role: Senior Web Developer</span>
                      <span style={{ background: '#ecfdf5', color: '#10b981', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>85% Match Score</span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                      <div style={{ height: '100%', width: '85%', background: '#10b981' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>✓ React</span>
                      <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>✓ TypeScript</span>
                      <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>✗ Docker</span>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', color: '#1e293b' }}>
                  <div>
                    <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>PHASE 3</span>
                    <h3 style={{ fontSize: '1.25rem', marginTop: '0.75rem', color: '#0f172a' }}>Kanban Pipeline Tracking</h3>
                    <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem', lineHeight: '1.5' }}>
                      Log and move active job opportunities into standard columns so you never miss a submission or interview follow-up.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '0.75rem' }}>
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>Wishlist</div>
                      <div style={{ background: '#f8fafc', padding: '0.35rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 'bold' }}>Google - Eng</div>
                    </div>
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>Applied</div>
                      <div style={{ background: '#f8fafc', padding: '0.35rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 'bold', borderLeft: '2px solid #8b5cf6' }}>Vercel - UI</div>
                    </div>
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>Interview</div>
                      <div style={{ background: '#f8fafc', padding: '0.35rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 'bold', borderLeft: '2px solid #10b981' }}>Stripe - Dev</div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* Masonry Testimonials Section */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold', marginBottom: '1rem' }}>
            Success Stories
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>What Job Seekers Say</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Read verified reports from tech professionals who landed positions using ResumeMaster.</p>
        </div>

        <div className="testimonial-grid">
          
          <div className="testimonial-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.15rem', color: '#fbbf24', fontSize: '0.9rem' }}>
                {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>VERIFIED USER</span>
            </div>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.5rem' }}>"Landed a job at Vercel!"</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              "The AI Bullet writer translated my simple project notes into metrics-focused XYZ achievements. My response rate rose significantly."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Alex Mercer" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.85rem' }}>Alex Mercer</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Frontend Developer @ Vercel</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.15rem', color: '#fbbf24', fontSize: '0.9rem' }}>
                {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>VERIFIED USER</span>
            </div>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.5rem' }}>"ATS diagnostic is a game changer"</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              "The Tinder-style matcher is addictive. It highlighted missing keywords on my CV, letting me tailor descriptions before applying."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah Jenkins" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.85rem' }}>Sarah Jenkins</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Cloud Engineer @ Cloudflare</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '6rem 2rem', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Transparent pricing</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Get hired faster with plans tailored for every stage of your job hunt.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 360px))', gap: '2rem', justifyContent: 'center' }}>
            
            {/* Free plan */}
            <div className="bento-card pricing-card-free" style={{ padding: '2.5rem 2.25rem' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>Basic</h4>
                <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#fff', marginBottom: '1.5rem' }}>
                  $0 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ forever</span>
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0 }}>
                  <li style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}><Check size={16} color="var(--color-success)" /> 1 Saved Resume Profile</li>
                  <li style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}><Check size={16} color="var(--color-success)" /> Standard PDF Export</li>
                  <li style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}><Check size={16} color="var(--color-success)" /> Drag & Drop Kanban Tracker</li>
                </ul>
              </div>
              <button className="btn-secondary" style={{ width: '100%', marginTop: '2rem' }} onClick={onLaunchWorkspace}>Start Free</button>
            </div>

            {/* Pro plan */}
            <div className="bento-card pricing-card-pro" style={{ padding: '2.5rem 2.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.2rem', color: '#fff' }}>Pro</h4>
                  <span className="pricing-badge-pro">RECOMMENDED</span>
                </div>
                <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#fff', marginBottom: '1.5rem' }}>
                  $12 <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: 'normal' }}>/ month</span>
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0 }}>
                  <li style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}><Check size={16} color="#c084fc" /> Unlimited Resumes</li>
                  <li style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}><Check size={16} color="#c084fc" /> Google X-Y-Z AI Bullet Enhancer</li>
                  <li style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}><Check size={16} color="#c084fc" /> Tinder-style Swiper Diagnostics</li>
                  <li style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}><Check size={16} color="#c084fc" /> Custom Cover Letters & LinkedIn SEO</li>
                  <li style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}><Check size={16} color="#c084fc" /> Mock Interview Preparation</li>
                </ul>
              </div>
              <button className="btn-primary" style={{ width: '100%', marginTop: '2rem' }} onClick={onLaunchWorkspace}>Upgrade to Pro</button>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Quick answers to common questions about ResumeMaster.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {FAQS.map((faq, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '1.25rem', cursor: 'pointer' }} onClick={() => toggleFaq(idx)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', color: '#fff', fontSize: '1rem' }}>
                <span>{faq.q}</span>
                <span style={{ fontSize: '1.2rem', color: 'var(--color-primary-hover)' }}>{activeFaq === idx ? '−' : '+'}</span>
              </div>
              {activeFaq === idx && (
                <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Premium 4-Column SaaS Footer */}
      <footer className="footer-container">
        <div className="footer-grid">
          
          {/* Brand Info */}
          <div className="footer-column">
            <a href="#" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Resume<span className="logo-highlight">Master</span>
            </a>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>
              Construct premium CV layouts, optimize application content using Google's metrics formula, swipe through matched roles, and manage pipelines automatically.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', padding: '0.35rem 0.75rem', borderRadius: '6px', width: 'fit-content' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>All systems operational</span>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="footer-column">
            <h4>Product</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onLaunchWorkspace(); }} className="footer-link">Resume Builder</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onLaunchWorkspace(); }} className="footer-link">Job Matcher</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onLaunchWorkspace(); }} className="footer-link">Kanban Tracker</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onLaunchWorkspace(); }} className="footer-link">Career Copilot</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onLaunchWorkspace(); }} className="footer-link">Pricing Plans</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#" className="footer-link">Google XYZ Formula Guide</a></li>
              <li><a href="#" className="footer-link">ATS Compatibility Blog</a></li>
              <li><a href="#" className="footer-link">Resume Templates</a></li>
              <li><a href="#" className="footer-link">Help Center</a></li>
              <li><a href="#" className="footer-link">API Status</a></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Terms of Service</a></li>
              <li><a href="#" className="footer-link">Cookie Preferences</a></li>
              <li><a href="#" className="footer-link">Security Safeguards</a></li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', color: 'var(--text-dim)', fontSize: '0.85rem', gap: '1rem' }}>
          <div>
            &copy; {new Date().getFullYear()} ResumeMaster. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Made with <Heart size={12} style={{ color: '#ec4899' }} /> for career builders.
          </div>
        </div>
      </footer>

    </div>
  );
}
