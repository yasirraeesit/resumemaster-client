import React from 'react';
import { ArrowLeft, Sparkles, Sliders, Shield, AlertTriangle, FileText, CheckCircle, Clock, Heart, Zap, Lightbulb, Wrench, BarChart2, Users, Award, HelpCircle, Settings, Menu } from 'lucide-react';

export default function InfoPage({ pageType, onBack, onLaunchWorkspace, user }) {
  
  const getPageContent = () => {
    switch (pageType) {
      case 'xyz':
        return {
          title: "Google X-Y-Z Resume Formula Guide",
          subtitle: "The gold standard for crafting high-impact bullet points used by elite tech recruiters.",
          date: "Updated October 2025",
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <section className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(139,92,246,0.2)' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>What is the X-Y-Z Formula?</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.9rem' }}>
                  Developed by Google's recruiting teams, the formula is a structured approach to writing achievements:
                </p>
                <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', padding: '1rem', borderRadius: '0.5rem', margin: '1rem 0', textAlign: 'center', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                  "Accomplished [X], as measured by [Y], by doing [Z]"
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  <p><strong>X (Accomplished):</strong> The project output, milestone, or business target achieved.</p>
                  <p><strong>Y (Measured by):</strong> The quantifiable index (revenue saved, page speed improvement, user counts, load times).</p>
                  <p><strong>Z (By doing):</strong> The exact technical stack, algorithms, libraries, or methodologies you applied.</p>
                </div>
              </section>

              <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid rgba(239,68,68,0.15)', background: 'rgba(239,68,68,0.02)' }}>
                  <h4 style={{ color: '#ef4444', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>❌ Passive Bullet (Weak)</h4>
                  <p style={{ fontStyle: 'italic', color: 'var(--text-dim)', fontSize: '0.85rem' }}>"Wrote code to optimize database query loading speeds on the server."</p>
                </div>
                <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid rgba(16,185,129,0.15)', background: 'rgba(16,185,129,0.02)' }}>
                  <h4 style={{ color: '#10b981', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>✅ Google X-Y-Z Bullet (Strong)</h4>
                  <p style={{ fontStyle: 'italic', color: 'var(--text-main)', fontSize: '0.85rem' }}>"Optimized server response speed by 45% (Y) by implementing Redis cache clusters and partitioning indexes (Z) across 1.2M user documents (X)."</p>
                </div>
              </section>

              <section className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>Pro Tips for Bullet Polish</h3>
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
                  <li>Always start with an active action verb (e.g. *Orchestrated*, *Spearheaded*, *Engineered*, *Architected*).</li>
                  <li>Use specific numerical metrics rather than vague words like "several", "some", or "various".</li>
                  <li>Focus on outcomes, not responsibilities. Tell recruiters what you *achieved*, not just what was on your task list.</li>
                </ul>
              </section>
            </div>
          )
        };

      case 'ats':
        return {
          title: "Demystifying ATS Compatibility",
          subtitle: "Learn how Applicant Tracking Systems scan resumes and how to optimize your structure.",
          date: "Updated November 2025",
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <section className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>What is an ATS?</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.9rem' }}>
                  Over 98% of Fortune 500 companies use Applicant Tracking Systems (ATS) to filter and rank candidates before human recruiters review applications. These crawlers parse text to find matching key skills, employment durations, and role titles.
                </p>
              </section>

              <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <h4 style={{ color: 'var(--text-main)', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>🎯 Skill Matching Density</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.5' }}>
                    Aim for a keyword density of 2% to 4%. Include exact terminology matching the target Job Description. For example, if the JD specifies "Next.js", do not simply state "React".
                  </p>
                </div>
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <h4 style={{ color: 'var(--text-main)', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>🏗️ Layout & Typography rules</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.5' }}>
                    Use web-safe Google fonts (such as Inter, Plus Jakarta Sans, Lora) with clean hierarchy. Avoid multi-layered text containers, non-standard shapes, and background graphics which crash parsing algorithms.
                  </p>
                </div>
              </section>

              <section className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>Checklist for ATS Success</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  <p>✔ <strong>Standard Headings:</strong> Use recognizable tags like "Experience", "Skills", and "Education".</p>
                  <p>✔ <strong>Text Format:</strong> Export directly to vector PDF format (avoid image PDFs).</p>
                  <p>✔ <strong>No Text Overlaps:</strong> Ensure margins allow text blocks to remain isolated and readable by OCR readers.</p>
                </div>
              </section>
            </div>
          )
        };

      case 'status':
        return {
          title: "System Infrastructure Status",
          subtitle: "Real-time metrics and operational health across our server clusters.",
          date: "Live Updates",
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Auth Server</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>99.98%</div>
                  <div style={{ fontSize: '0.65rem', color: '#10b981' }}>● Operational</div>
                </div>
                <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Gemini API</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>100.0%</div>
                  <div style={{ fontSize: '0.65rem', color: '#10b981' }}>● Operational</div>
                </div>
                <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Database Store</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>99.99%</div>
                  <div style={{ fontSize: '0.65rem', color: '#10b981' }}>● Operational</div>
                </div>
                <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Avg Latency</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-primary-hover)' }}>124ms</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-primary-hover)' }}>● Optimal</div>
                </div>
              </div>

              <section className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>Operational Log</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
                    <span>Authentication Signature Handshakes</span>
                    <span style={{ color: '#10b981' }}>Operational</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
                    <span>Mock Interview voice synthesizers</span>
                    <span style={{ color: '#10b981' }}>Operational</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
                    <span>PDF Export Engine vector streams</span>
                    <span style={{ color: '#10b981' }}>Operational</span>
                  </div>
                </div>
              </section>
            </div>
          )
        };

      case 'privacy':
        return {
          title: "Privacy Policy",
          subtitle: "We prioritize user privacy and secure data processing boundaries.",
          date: "Effective June 2026",
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              <section className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>1. Data We Collect</h3>
                <p>
                  ResumeMaster stores profile information, saved resume layouts, job application details, and AI generation parameters. We compile credentials and documents only to deliver tailored workspace outcomes.
                </p>
              </section>
              <section className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>2. Security & Encryption</h3>
                <p>
                  All credentials, layouts, and transcript logs are encrypted in transit using SSL certificates and stored securely inside restricted clusters. We do not sell or monetize personal documents to advertising networks.
                </p>
              </section>
              <section className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>3. Data Control</h3>
                <p>
                  You retain complete ownership over your resume entries. You can modify your stored documents or purge your database credentials entirely at any moment using the profile options in the dashboard.
                </p>
              </section>
            </div>
          )
        };

      case 'terms':
        return {
          title: "Terms of Service",
          subtitle: "Guidelines and regulations governing access to ResumeMaster.",
          date: "Effective June 2026",
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              <section className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>1. Acceptable Use</h3>
                <p>
                  You agree to use our interactive mock simulator, resume exporter, and AI document customization tool for personal, non-commercial purposes. Abuse of server APIs, scraping, or spamming prompt integrations will result in account suspensions.
                </p>
              </section>
              <section className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>2. Account Restrictions</h3>
                <p>
                  Users must maintain authentic registration tokens. You are responsible for all updates and documents generated under your profile. AI credit allotments are subject to service limits.
                </p>
              </section>
              <section className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>3. Disclaimer</h3>
                <p>
                  ResumeMaster provides design layout formatting tools and automated feedback metrics. We do not guarantee employment or candidate selection results.
                </p>
              </section>
            </div>
          )
        };

      case 'cookies':
        return {
          title: "Cookie Preferences",
          subtitle: "We apply cookies strictly to maintain user authorization states.",
          date: "Updated June 2026",
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              <section className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>Essential Cookies</h3>
                <p>
                  ResumeMaster applies session variables and local storage items (e.g. `token`, `user`, and `activeTab`) to preserve your sign-in details on browser refreshes. These cookies are required for fundamental operations.
                </p>
              </section>
              <section className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>Preference Settings</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '0.375rem', marginTop: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Authentication Tokens</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Preserves secure JWT configurations</div>
                  </div>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>Always Active</span>
                </div>
              </section>
            </div>
          )
        };

      case 'security':
        return {
          title: "Security Safeguards",
          subtitle: "Detailed outline of security controls deployed on ResumeMaster.",
          date: "Updated June 2026",
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              <section className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>Data Sanitization</h3>
                <p>
                  To secure user records against XSS injections, all user inputs mapped in our customizer dashboard are fully sanitized before db commits.
                </p>
              </section>
              <section className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>JSON Web Tokens (JWT)</h3>
                <p>
                  State modifications, database inserts, and mock evaluations are authenticated via signed headers. Unsecured requests are blocked.
                </p>
              </section>
              <section className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>Database Protection</h3>
                <p>
                  MongoDB Atlas datasets run behind firewall layers in VPC networks. Data accesses are audited to maintain secure environments.
                </p>
              </section>
            </div>
          )
        };

      default:
        return { title: "Details", subtitle: "General Guide", date: "", body: <p>No content loaded.</p> };
    }
  };

  const { title, subtitle, date, body } = getPageContent();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 6rem' }}>
      
      {/* Return Navigation */}
      <button 
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          fontSize: '0.85rem',
          marginBottom: '2rem',
          padding: 0,
          transition: 'color 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={16} /> Back to previous page
      </button>

      {/* Header Info */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', background: 'rgba(139,92,246,0.1)', color: 'var(--color-primary-hover)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Resource Guide
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>• {date}</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: '1.2' }}>
          {title}
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          {subtitle}
        </p>
      </div>

      {/* Main Page Content Body */}
      <main style={{ marginBottom: '3rem' }}>
        {body}
      </main>

      {/* CTA Card */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(79,70,229,0.1) 0%, rgba(139,92,246,0.06) 100%)',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '1rem',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Ready to construct your premium resume?
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Apply the Google metric XYZ formula and score high on ATS algorithms instantly.
        </p>
        <button 
          className="btn-primary" 
          onClick={onLaunchWorkspace} 
          style={{ padding: '0.65rem 1.5rem', fontSize: '0.88rem' }}
        >
          {user ? "Open Your Workspace Dashboard" : "Get Started For Free"}
        </button>
      </div>

    </div>
  );
}
