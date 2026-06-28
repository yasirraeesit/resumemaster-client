import React from 'react';
import { ArrowRight, LayoutGrid, CheckCircle } from 'lucide-react';

export default function TemplatesLibraryPage({ selectedTemplate, onSelectTemplate }) {
  const TEMPLATES = [
    {
      id: 'elegant',
      name: 'Elegant Serif',
      badge: 'Corporate Standard',
      desc: 'Traditional centered layout with classic Times New Roman typography. Perfect for formal industries, finance, law, and senior executive roles.',
      accent: '#1e293b',
      mockup: (
        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.4rem', height: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.6rem 0.5rem', width: '100%', boxSizing: 'border-box', overflow: 'hidden', fontFamily: 'Georgia, serif', color: '#1e293b', fontSize: '4.5px', lineHeight: '1.25' }}>
          <div style={{ fontSize: '7px', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '1px' }}>JANE DOE</div>
          <div style={{ fontSize: '4.5px', color: '#475569', fontStyle: 'italic', marginBottom: '2px' }}>Senior Software Engineer</div>
          <div style={{ fontSize: '3.5px', color: '#64748b', display: 'flex', gap: '4px', marginBottom: '3px' }}>
            <span>jane.doe@email.com</span>•<span>(555) 019-2834</span>•<span>San Francisco, CA</span>
          </div>
          <div style={{ width: '100%', height: '0.5px', background: '#cbd5e1', marginBottom: '4px' }}></div>
          
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
            <div>
              <div style={{ fontSize: '4.5px', fontWeight: 'bold', color: '#0f172a', borderBottom: '0.5px solid #cbd5e1', paddingBottom: '1px', marginBottom: '2px', letterSpacing: '0.2px' }}>SUMMARY</div>
              <div style={{ fontSize: '3.8px', color: '#334155' }}>Experienced Senior Frontend Engineer with 6+ years building premium React applications and design systems.</div>
            </div>
            <div>
              <div style={{ fontSize: '4.5px', fontWeight: 'bold', color: '#0f172a', borderBottom: '0.5px solid #cbd5e1', paddingBottom: '1px', marginBottom: '2px', letterSpacing: '0.2px' }}>EXPERIENCE</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '3.8px' }}>
                <span>Senior Software Engineer — TechCorp</span>
                <span style={{ fontWeight: 'normal', color: '#64748b' }}>2021 - Present</span>
              </div>
              <div style={{ fontSize: '3.5px', color: '#475569', paddingLeft: '3px' }}>
                • Built custom CSS design systems, boosting load speed by 35%.
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'modern',
      name: 'Modern Minimalist',
      badge: 'Popular All-rounder',
      desc: 'Clean left-aligned layout using geometric sans-serif type. Sleek horizontal dividers and structured padding optimize recruiter view times.',
      accent: '#3b82f6',
      mockup: (
        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.4rem', height: '140px', display: 'flex', flexDirection: 'column', padding: '0.6rem 0.5rem', width: '100%', boxSizing: 'border-box', overflow: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b', fontSize: '4.5px', lineHeight: '1.25', textAlign: 'left' }}>
          <div style={{ fontSize: '8px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.2px' }}>Jane Doe</div>
          <div style={{ fontSize: '5px', color: '#3b82f6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2px', marginBottom: '2px' }}>Senior Frontend Engineer</div>
          <div style={{ fontSize: '3.8px', color: '#64748b', display: 'flex', gap: '5px', marginBottom: '4px' }}>
            <span>jane.doe@email.com</span>•<span>(555) 019-2834</span>•<span>San Francisco, CA</span>
          </div>
          
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div>
              <div style={{ fontSize: '4.8px', fontWeight: 'bold', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '1px', marginBottom: '2px' }}>Summary</div>
              <div style={{ fontSize: '3.8px', color: '#475569' }}>High-performance engineer focused on user experience, state optimization, and interactive design.</div>
            </div>
            <div>
              <div style={{ fontSize: '4.8px', fontWeight: 'bold', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '1px', marginBottom: '2px' }}>Experience</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '3.8px' }}>
                <span style={{ fontWeight: 'bold' }}>TechCorp Solutions <span style={{ fontWeight: 'normal', color: '#64748b' }}>— Senior Engineer</span></span>
                <span style={{ color: '#64748b' }}>2021 - Present</span>
              </div>
              <div style={{ fontSize: '3.5px', color: '#475569', paddingLeft: '3px', marginTop: '1px' }}>
                • Rebuilt client dashboard with custom State Store, cutting latency by 35%.
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'technical',
      name: 'Technical Indigo',
      badge: 'Developer Favorite',
      desc: 'Engineered layout featuring code-like background capsules for skills, bold inline headers, and a prominent primary accent line on top.',
      accent: '#10b981',
      mockup: (
        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.4rem', height: '140px', display: 'flex', flexDirection: 'column', padding: '0.6rem 0.5rem', width: '100%', boxSizing: 'border-box', overflow: 'hidden', fontFamily: 'system-ui, monospace', color: '#0f172a', fontSize: '4.5px', lineHeight: '1.2', borderTop: '4px solid #10b981', textAlign: 'left' }}>
          <div style={{ fontSize: '8px', fontWeight: 'bold' }}>JANE DOE</div>
          <div style={{ fontSize: '4.8px', color: '#10b981', fontWeight: 'bold', letterSpacing: '0.2px', marginBottom: '2px' }}>[ Senior Frontend Developer ]</div>
          <div style={{ fontSize: '3.8px', color: '#475569', display: 'flex', gap: '4px', marginBottom: '4px' }}>
            <span>sf, ca</span>|<span>linkedin.com/in/janedoe</span>|<span>github.com/janedoe</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>
              <div style={{ fontSize: '4.8px', fontWeight: 'bold', color: '#10b981', borderBottom: '0.5px solid #e2e8f0', paddingBottom: '1px', marginBottom: '2px' }}>WORK EXPERIENCE</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '3.8px', fontWeight: 'bold' }}>
                <span>TechCorp / Senior Dev</span>
                <span style={{ color: '#64748b' }}>01/2021 - Present</span>
              </div>
              <div style={{ fontSize: '3.5px', color: '#334155', paddingLeft: '3px' }}>
                • Optimized state stores in React, dropping API load times by 35%.
              </div>
            </div>

            <div>
              <div style={{ fontSize: '4.8px', fontWeight: 'bold', color: '#10b981', borderBottom: '0.5px solid #e2e8f0', paddingBottom: '1px', marginBottom: '2px' }}>KEY SKILLS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', marginTop: '1px' }}>
                {['React', 'TypeScript', 'Node.js', 'Next.js', 'Vite'].map((skill, sidx) => (
                  <span key={sidx} style={{ fontSize: '3.5px', padding: '0.5px 2px', borderRadius: '2px', background: 'rgba(16,185,129,0.06)', border: '0.5px solid rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 600 }}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'executive',
      name: 'Executive Two-Column',
      badge: 'Senior Management',
      desc: 'Premium two-column layout with a prominent sidebar. Ideal for separating core skills/contact on the left, and experience on the right.',
      accent: '#6d28d9',
      mockup: (
        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.4rem', height: '140px', display: 'grid', gridTemplateColumns: '30% 1fr', overflow: 'hidden', width: '100%', boxSizing: 'border-box', fontFamily: 'system-ui, sans-serif', color: '#1e293b', fontSize: '4.2px', lineHeight: '1.2', textAlign: 'left' }}>
          {/* Sidebar */}
          <div style={{ background: '#1e1b4b', padding: '0.6rem 0.35rem', color: '#ffffff', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div>
              <div style={{ fontSize: '6px', fontWeight: 'bold', color: '#ffffff' }}>Jane Doe</div>
              <div style={{ fontSize: '3.5px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Sr. Engineer</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', fontSize: '3px', color: 'rgba(255,255,255,0.6)' }}>
              <span>✉️ jane.doe@email.com</span>
              <span>📞 (555) 019-2834</span>
              <span>📍 SF, CA</span>
            </div>
            <div>
              <div style={{ fontSize: '4px', fontWeight: 'bold', borderBottom: '0.5px solid rgba(255,255,255,0.2)', paddingBottom: '1px', marginBottom: '2px', color: '#fff' }}>SKILLS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', fontSize: '3.2px', color: 'rgba(255,255,255,0.7)' }}>
                <span>• React & Next.js</span>
                <span>• TypeScript</span>
                <span>• CSS Variables</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ padding: '0.6rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div>
              <div style={{ fontSize: '4.8px', fontWeight: 'bold', color: '#1e1b4b', borderBottom: '0.5px solid #e2e8f0', paddingBottom: '1px', marginBottom: '2px' }}>SUMMARY</div>
              <div style={{ fontSize: '3.8px', color: '#475569' }}>Senior Frontend Engineer with 6+ years of experience leading high-fidelity React architectures.</div>
            </div>
            <div>
              <div style={{ fontSize: '4.8px', fontWeight: 'bold', color: '#1e1b4b', borderBottom: '0.5px solid #e2e8f0', paddingBottom: '1px', marginBottom: '2px' }}>EXPERIENCE</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '3.8px', fontWeight: 'bold' }}>
                <span>Senior Software Engineer</span>
                <span style={{ fontWeight: 'normal', color: '#64748b' }}>2021 - Pres.</span>
              </div>
              <div style={{ fontSize: '3.5px', color: '#475569', paddingLeft: '3px' }}>
                • Developed optimized React state stores, reducing dashboard load times by 35%.
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'creative',
      name: 'Creative Gradient',
      badge: 'Modern Marketing & Product',
      desc: 'Standout design with an eye-catching gradient header and rounded header bounds. Highly recommended for creative roles and startups.',
      accent: '#ec4899',
      mockup: (
        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.4rem', height: '140px', display: 'flex', flexDirection: 'column', overflow: 'hidden', width: '100%', boxSizing: 'border-box', fontFamily: 'system-ui, sans-serif', color: '#0f172a', fontSize: '4.5px', lineHeight: '1.2', textAlign: 'left' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', padding: '0.5rem', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '7.5px', fontWeight: '800' }}>Jane Doe</div>
              <div style={{ fontSize: '4.5px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>Creative Frontend Developer</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', fontSize: '3.5px', textAlign: 'right', color: 'rgba(255,255,255,0.75)' }}>
              <span>jane.doe@email.com</span>
              <span>San Francisco, CA</span>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>
              <div style={{ fontSize: '4.8px', fontWeight: 'bold', color: '#4f46e5', marginBottom: '1px' }}>HIGHLIGHTED PROJECTS</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '3.8px', fontWeight: 'bold' }}>
                <span>Dynamic CSS Playground</span>
                <span style={{ color: '#7c3aed' }}>github.com/janedoe/sandbox</span>
              </div>
              <div style={{ fontSize: '3.5px', color: '#475569', paddingLeft: '3px' }}>
                • Built interactive CSS variable editor used by over 5k monthly active devs.
              </div>
            </div>

            <div>
              <div style={{ fontSize: '4.8px', fontWeight: 'bold', color: '#4f46e5', marginBottom: '1px' }}>PROFESSIONAL HISTORY</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '3.8px' }}>
                <span style={{ fontWeight: 'bold' }}>TechCorp Solutions <span style={{ fontWeight: 'normal', color: '#64748b' }}>— Senior Engineer</span></span>
                <span style={{ color: '#64748b' }}>2021 - Present</span>
              </div>
              <div style={{ fontSize: '3.5px', color: '#475569', paddingLeft: '3px' }}>
                • Designed reusable styling system across 4 teams, improving visual consistency.
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'emerald',
      name: 'Clean Emerald',
      badge: 'Healthcare & Science',
      desc: 'A gorgeous layout with high-impact green accents, stylized header, and structured skills sections. Perfect for healthcare, biology, and research roles.',
      accent: '#059669',
      mockup: (
        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.4rem', height: '140px', display: 'flex', flexDirection: 'column', padding: '0.6rem 0.5rem', width: '100%', boxSizing: 'border-box', overflow: 'hidden', fontFamily: 'system-ui, sans-serif', color: '#1e293b', fontSize: '4.5px', lineHeight: '1.25', textAlign: 'left' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1.5px solid #059669', paddingBottom: '3px', marginBottom: '4px' }}>
            <div>
              <div style={{ fontSize: '8px', fontWeight: '800', color: '#064e3b' }}>Jane Doe</div>
              <div style={{ fontSize: '4.8px', color: '#059669', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2px' }}>Senior Frontend Engineer</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5px', fontSize: '3.5px', textAlign: 'right', color: '#64748b' }}>
              <span>✉️ jane.doe@email.com</span>
              <span>📍 San Francisco, CA</span>
            </div>
          </div>

          {/* Body */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>
              <div style={{ fontSize: '4.8px', fontWeight: 'bold', color: '#059669', borderBottom: '0.5px solid #ecfdf5', paddingBottom: '1px', marginBottom: '2px', letterSpacing: '0.2px' }}>EXPERIENCE</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '3.8px', fontWeight: 'bold' }}>
                <span>Senior Software Engineer — TechCorp</span>
                <span style={{ color: '#059669' }}>2021 - Present</span>
              </div>
              <div style={{ fontSize: '3.5px', color: '#475569', paddingLeft: '3px' }}>
                • Built custom CSS design systems, cutting dashboard API load times by 35%.
              </div>
            </div>

            <div>
              <div style={{ fontSize: '4.8px', fontWeight: 'bold', color: '#059669', borderBottom: '0.5px solid #ecfdf5', paddingBottom: '1px', marginBottom: '2px', letterSpacing: '0.2px' }}>SKILLS & KNOWLEDGE</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', marginTop: '1px' }}>
                {['React', 'TypeScript', 'Node.js', 'Next.js', 'Vite'].map((skill, sidx) => (
                  <span key={sidx} style={{ background: '#ecfdf5', color: '#065f46', fontSize: '3.5px', padding: '0.5px 2.5px', borderRadius: '2px', border: '0.5px solid #d1fae5', fontWeight: 600 }}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
      
      {/* Header Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.15)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.78rem', color: 'var(--color-primary-hover)', fontWeight: 'bold', marginBottom: '0.75rem' }}>
            <LayoutGrid size={12} /> CV Design Systems
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Resumes Library
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
            Browse and activate layouts tailored to maximize recruiter view times
          </p>
        </div>
      </div>

      {/* Grid List */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {TEMPLATES.map(tmpl => {
          const isActive = selectedTemplate === tmpl.id;
          return (
            <div
              key={tmpl.id}
              className="glass-card"
              style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                border: isActive ? '2.5px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'all 0.25s ease',
                background: isActive ? 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(30,30,50,0.4))' : 'rgba(255,255,255,0.02)',
                boxShadow: isActive ? '0 10px 30px rgba(139,92,246,0.12)' : 'none',
                position: 'relative'
              }}
            >
              {tmpl.mockup}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700, margin: 0 }}>
                    {tmpl.name}
                  </h3>
                  {isActive && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.65rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 'bold' }}>
                      <CheckCircle size={10} /> Active
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary-hover)', fontWeight: 600, letterSpacing: '0.02em', alignSelf: 'flex-start' }}>
                  {tmpl.badge}
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0.4rem 0 0 0' }}>
                  {tmpl.desc}
                </p>
              </div>

              <button
                className={isActive ? 'btn-secondary' : 'btn-primary'}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  marginTop: '0.5rem'
                }}
                onClick={() => onSelectTemplate(tmpl.id)}
              >
                {isActive ? 'Continue with Layout' : 'Use Template Layout'} <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
