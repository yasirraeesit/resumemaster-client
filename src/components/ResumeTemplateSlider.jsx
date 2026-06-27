import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Award, FileText, CheckCircle2, ShieldCheck, Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, ZoomIn, ZoomOut, Download } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'elegant',
    name: 'Elegant Serif (Executive/Finance)',
    profile: {
      name: 'DAVID J. KIM, CFA',
      title: 'Senior Portfolio Manager',
      contact: 'david.kim@financialcorp.com  |  (212) 555-0189  |  New York, NY',
      summary: 'Distinguished Portfolio Manager with over 10 years of expertise directing quantitative equity portfolios. Expert in asset allocation strategies, econometric valuation models, and risk mitigation. Spearheaded global investment policies managing $850M+ in active AUM, consistently delivering upper-quartile alpha.',
      skills: ['Portfolio Optimization', 'Asset Allocation', 'Quantitative Risk Modeling', 'Valuation (DCF, LBO)', 'Econometric Forecasting', 'Bloomberg Terminal', 'CFA Charterholder'],
      experience: [
        {
          role: 'Senior Portfolio Manager',
          company: 'Goldman Sachs Asset Management',
          dates: 'Oct 2021 - Present',
          bullets: [
            'Spearheaded the restructuring of a $420M quantitative equity portfolio, improving the active Sharpe ratio by 18% and generating 120bps of excess alpha over the S&P 500 benchmark.',
            'Formulated and executed a defensive hedging strategy utilizing options overlays that mitigated peak-to-trough drawdowns by 35% during the market volatility of 2022.',
            'Collaborated with a team of 6 quantitative research analysts to deploy a machine-learning-driven sentiment analysis model, increasing stock selection model accuracy by 14%.'
          ]
        },
        {
          role: 'Investment Portfolio Analyst',
          company: 'Morgan Stanley Wealth Management',
          dates: 'Aug 2017 - Sep 2021',
          bullets: [
            'Conducted rigorous bottom-up equity research and valuation modeling on 45+ consumer sector equities with market caps exceeding $10B, resulting in 12 buy recommendations.',
            'Constructed automated cash-flow projection and stress-testing models using SQL and Python, reducing manual portfolio analysis time by 15 hours per week.'
          ]
        }
      ],
      education: [
        {
          school: 'Wharton School of the University of Pennsylvania',
          degree: 'Master of Business Administration (MBA) in Finance  |  GPA: 3.92'
        },
        {
          school: 'Cornell University',
          degree: 'Bachelor of Science in Applied Economics & Management  |  magna cum laude'
        }
      ],
      projects: [
        {
          name: 'Alternative Data Yield Engine',
          description: 'Designed an open-source arbitrage engine parsing public real estate registry filings to identify localized property market yields, achieving a backtested Sharpe ratio of 1.65.'
        }
      ]
    }
  },
  {
    id: 'modern',
    name: 'Modern Minimalist (Design/Product)',
    profile: {
      name: 'EMILY WATSON',
      title: 'Principal Product Designer',
      contact: 'emily.watson@ux.design  |  +44 (0) 20 7946 0192  |  London, UK',
      summary: 'Human-centered Product Designer with 9+ years of experience leading cross-functional design organizations to build high-scale consumer applications. Expert in mixed-methods UX research, interactive wireframing, and design system governance. Passionate about marrying customer empathy with commercial metrics.',
      skills: ['Interaction Design', 'Design Systems', 'Usability Diagnostics', 'Figma Ecosystem', 'Rapid Prototyping', 'Product Strategy', 'Front-End Development'],
      experience: [
        {
          role: 'Principal Product Designer',
          company: 'Google (Workspace & Suite)',
          dates: 'Jan 2022 - Present',
          bullets: [
            'Directed the design overhaul of Google Calendar workspace integration, decreasing task-completion time metrics by 22% for over 150 million daily active users.',
            'Established a unified cross-platform component library system, reducing design-to-engineering implementation cycles by 40% and ensuring accessibility conformity.',
            'Championed user-advocacy testing cycles with 80+ international participants, refining the shared-drives UI to decrease common error pathways by 31%.'
          ]
        },
        {
          role: 'Senior Product Designer',
          company: 'Spotify (Discovery & Playlists)',
          dates: 'Mar 2018 - Dec 2021',
          bullets: [
            'Architected the interactive layout for the personalized playlist discovery tab, which drove an 18% improvement in weekly active stream rates.',
            'Collaborated with engineering to prototype motion-based micro-interactions, raising the app store user review index from 4.3 to 4.7 over 12 months.'
          ]
        }
      ],
      education: [
        {
          school: 'University College London (UCL)',
          degree: 'M.Sc. in Human-Computer Interaction (Distinction)'
        },
        {
          school: 'Royal College of Art, London',
          degree: 'B.A. in Interaction Design (First Class Honours)'
        }
      ],
      projects: [
        {
          name: 'A11y-Grid Accessibility System',
          description: 'Developed and open-sourced a WCAG contrast-ratio auditing framework integrated directly with Figma plugins, amassing 25k+ community installations.'
        }
      ]
    }
  },
  {
    id: 'technical',
    name: 'Technical Indigo (Software/Cloud)',
    profile: {
      name: 'SARAH J. JENKINS',
      title: 'Principal Cloud Systems Engineer',
      contact: 'sarah.j@cloudnet.io  |  github.com/sjenkins  |  Austin, TX',
      summary: 'Distinguished Systems Architect and DevOps pioneer with 8+ years of experience developing high-availability cloud infrastructure pipelines. Expert in Kubernetes scaling, Infrastructure as Code (IaC), and automated container security models. Proven history of reducing infrastructure spend by 25% while improving uptime to 99.99%.',
      skills: ['Kubernetes / Docker', 'Terraform (IaC)', 'AWS & GCP Architectures', 'Go / Python / Rust', 'CI/CD Automation', 'Prometheus / Grafana', 'eBPF Kernel Monitoring'],
      experience: [
        {
          role: 'Principal Cloud Systems Engineer',
          company: 'Cloudflare',
          dates: 'Jun 2022 - Present',
          bullets: [
            'Re-architected cross-regional Kubernetes cluster network routing rules, reducing global API edge latency measurements by 28% and ensuring high resilience.',
            'Authored a custom declarative Terraform provider mapping directly to legacy networking endpoints, mitigating configuration drift incidents by 94%.',
            'Led zero-downtime database migration strategy from legacy clusters to cloud instances, moving 4.5 Petabytes of customer transactions without service interruption.'
          ]
        },
        {
          role: 'Senior DevOps Architect',
          company: 'HashiCorp',
          dates: 'Jan 2019 - May 2022',
          bullets: [
            'Engineered automated security-scanning workflows in HashiCorp Consul/Vault pipeline, capturing 98.7% of container image vulnerabilities prior to staging release.',
            'Optimized microservice scaling parameters, leading to an immediate 32% decrease in compute resource utilization and an annual budget saving of $1.8M.'
          ]
        }
      ],
      education: [
        {
          school: 'University of Texas at Austin',
          degree: 'B.S. in Computer Science  |  Specialization in Distributed Systems'
        }
      ],
      projects: [
        {
          name: 'Kube-Watchdog Daemon',
          description: 'Developed an eBPF-based resource usage sentinel daemon that proactively halts leaky Kubernetes namespaces, featured at KubeCon 2023.'
        }
      ]
    }
  },
  {
    id: 'executive',
    name: 'Executive Two-Column (Operations/Management)',
    profile: {
      name: 'MARCUS VANCE',
      title: 'VP of Global Operations',
      contact: 'mvance@ops.com  |  (415) 555-0144  |  San Francisco, CA',
      summary: 'Strategic Operations Executive with 12+ years of experience steering hyper-growth SaaS organizations. Expert at building scalable business systems, optimizing vendor allocations, and driving structural change to maximize operating margins.',
      skills: ['Global SaaS Operations', 'P&L / Financial Audits', 'Process Automation', 'Cross-Functional Leadership', 'Enterprise Systems Integration', 'Agile Product Scaling', 'Vendor Negotiations'],
      experience: [
        {
          role: 'VP of Global Operations',
          company: 'Stripe, Inc.',
          dates: 'Nov 2021 - Present',
          bullets: [
            'Directed international support operations scaling from 50 to 320 members across 4 continents, maintaining a 96% Customer Satisfaction (CSAT) rating.',
            'Pioneered an AI-assisted ticket triage automation, reducing mean-time-to-resolution (MTTR) by 45% and saving $2.4M in operational staffing expenses.',
            'Negotiated multi-year global enterprise software vendor licensing structures, capturing $3.2M in annual recurring operational savings.'
          ]
        },
        {
          role: 'Director of Business Operations',
          company: 'HubSpot',
          dates: 'Sep 2017 - Oct 2021',
          bullets: [
            'Owned execution of department budgets exceeding $85M, consistently delivering operations under budget targets while scaling customer onboarding programs by 50%.',
            'Implemented a robust CRM data standardization protocol, reducing lead-to-opportunity routing delays from 12 hours down to 15 minutes.'
          ]
        }
      ],
      education: [
        {
          school: 'Stanford Graduate School of Business',
          degree: 'Master of Business Administration (MBA)  |  Arjay Miller Scholar'
        },
        {
          school: 'University of California, Berkeley',
          degree: 'Bachelor of Arts in Economics (Highest Honors)'
        }
      ],
      projects: [
        {
          name: 'Operations Sentinel Dashboard',
          description: 'Designed and deployed an integrated internal reporting dashboard monitoring business health metrics in real-time, reducing planning cycle lengths by 10 days.'
        }
      ]
    }
  },
  {
    id: 'creative',
    name: 'Creative Gradient (Marketing/Art)',
    profile: {
      name: 'ALEX MERCER',
      title: 'Creative Art Director',
      contact: 'alex@mercerart.design  |  Los Angeles, CA  |  (213) 555-0928',
      summary: 'Award-winning Creative Director with 10 years of experience defining brand visual systems and immersive multimedia marketing campaigns. Dedicated to bridging typography, interactive digital graphics, and high-impact visual storytelling.',
      skills: ['Art Direction & Brand Identity', 'UI/UX Visual Systems', 'Adobe Creative Suite Mastery', 'Motion Graphic Design', 'Video Production Management', 'Front-End Design Systems', 'Marketing Analytics'],
      experience: [
        {
          role: 'Creative Art Director',
          company: 'Vercel, Inc.',
          dates: 'Aug 2021 - Present',
          bullets: [
            'Led the visual rebranding initiative and Webby-nominated launch campaign for Next.js, resulting in a 150% boost in unique monthly developer engagements.',
            'Constructed a global asset generation workflow system that standardized product marketing materials across 10 international agencies.',
            'Designed immersive interactive developer landing page layouts, increasing conversion rates on key hosting products by 38%.'
          ]
        },
        {
          role: 'Senior Brand Designer',
          company: 'Figma',
          dates: 'Feb 2018 - Jul 2021',
          bullets: [
            'Designed the brand identity and multi-channel marketing campaigns for Figma Config global conference, drawing record-breaking live attendance of 80k+.',
            'Partnered with product teams to design dark-mode template system assets, driving a 25% increase in user-template store downloads.'
          ]
        }
      ],
      education: [
        {
          school: 'Rhode Island School of Design (RISD)',
          degree: 'Bachelor of Fine Arts (BFA) in Graphic Design'
        }
      ],
      projects: [
        {
          name: 'The Typographic Grid Collective',
          description: 'Founded and curated a collaborative web directory showcasing responsive typographic layouts, attracting over 50,000 unique monthly visitors.'
        }
      ]
    }
  },
  {
    id: 'emerald',
    name: 'Clean Emerald (AI/Research)',
    profile: {
      name: 'DR. CHLOE CHEN',
      title: 'Principal AI Researcher',
      contact: 'chloe.chen@deepmind.com  |  chloechen.ai  |  San Francisco, CA',
      summary: 'Preeminent Artificial Intelligence Researcher specializing in Reinforcement Learning (RL) and Large Language Model (LLM) alignment protocols. Published 15+ peer-reviewed papers in top-tier machine learning conferences including NeurIPS, ICML, and ICLR. Pioneer in designing scalable reasoning architectures.',
      skills: ['PyTorch / JAX Ecosystem', 'Reinforcement Learning (RLHF)', 'Distributed Training Frameworks', 'LLM Architectural Optimization', 'Mathematical Logic & Analysis', 'Python / C++ Integration'],
      experience: [
        {
          role: 'Principal Research Scientist',
          company: 'Google DeepMind (Gemini Core Team)',
          dates: 'Jan 2022 - Present',
          bullets: [
            'Co-authored next-generation reasoning architectures for the Gemini model family, increasing mathematical reasoning benchmark accuracy by 12.5%.',
            'Led a team of 8 researchers to design optimization loops using JAX, boosting compute pipeline scaling efficiency on TPU clusters by 35%.',
            'Developed novel reward-modeling protocols that significantly minimized toxic hallucinations in output layers without sacrificing generation capability.'
          ]
        },
        {
          role: 'AI Research Scientist',
          company: 'OpenAI (Alignment Team)',
          dates: 'Oct 2019 - Dec 2021',
          bullets: [
            'Contributed to the core reinforcement learning from human feedback (RLHF) modules, improving conversational fluency.',
            'Scaled distributed training routines on 2048+ NVIDIA GPU environments, reducing model convergence cycles by 3 weeks.'
          ]
        }
      ],
      education: [
        {
          school: 'Stanford University',
          degree: 'Ph.D. in Computer Science (Artificial Intelligence Laboratory)'
        },
        {
          school: 'Tsinghua University',
          degree: 'B.S. in Computer Science & Technology (Yao Class)'
        }
      ],
      projects: [
        {
          name: 'JAX-RL-Optimizers Library',
          description: 'Created and open-sourced an optimized library of JAX-based operations for reinforcement learning, amassing 4k+ GitHub stars.'
        }
      ]
    }
  }
];

export default function ResumeTemplateSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    if (!isHovered) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % TEMPLATES.length);
      }, 5000); // 5 seconds per slide to allow reading
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isHovered]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + TEMPLATES.length) % TEMPLATES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % TEMPLATES.length);
  };

  const currentTemplate = TEMPLATES[currentIndex];
  const p = currentTemplate.profile;

  return (
    <div
      className="mockup-container"
      style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 30px 60px -15px rgba(8, 7, 16, 0.25), 0 0 40px rgba(139, 92, 246, 0.1)',
        width: '100%',
        maxWidth: '540px',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Mockup Header - Premium AI Workspace Editor Toolbar */}
      <div 
        className="mockup-header" 
        style={{ 
          background: 'rgba(248, 250, 252, 0.95)', 
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          padding: '0.65rem 1.25rem',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* OS Window Dots */}
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <div className="mockup-dot" style={{ background: '#ef4444', width: '9px', height: '9px', borderRadius: '50%' }} />
            <div className="mockup-dot" style={{ background: '#f59e0b', width: '9px', height: '9px', borderRadius: '50%' }} />
            <div className="mockup-dot" style={{ background: '#10b981', width: '9px', height: '9px', borderRadius: '50%' }} />
          </div>
          
          <span style={{ height: '14px', width: '1px', background: '#cbd5e1' }} />
          
          {/* Editor Menus */}
          <div style={{ display: 'flex', gap: '0.85rem', fontSize: '0.72rem', color: '#64748b', fontWeight: 'bold' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="editor-menu-item">File</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="editor-menu-item">Edit</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
              <Sparkles size={10} /> AI Writer
            </span>
          </div>
        </div>

        {/* Engine Status & Export Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Gemini AI Pulse Badge */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.35rem', 
            background: 'rgba(139, 92, 246, 0.08)', 
            border: '1px solid rgba(139, 92, 246, 0.2)',
            padding: '0.2rem 0.6rem', 
            borderRadius: '9999px',
            fontSize: '0.68rem',
            fontWeight: 'bold',
            color: '#6d28d9'
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6', animation: 'pulseGreen 1.5s infinite' }} />
            <span>Gemini AI Engine</span>
          </div>

          <button style={{
            background: '#0f172a',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '0.25rem 0.55rem',
            fontSize: '0.68rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            <Download size={10} /> Export PDF
          </button>
        </div>
      </div>

      {/* PDF Viewer Action Bar */}
      <div 
        style={{
          background: 'rgba(248, 250, 252, 0.95)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          padding: '0.45rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.72rem',
          color: '#475569',
          fontWeight: 600
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Page 1 of 1</span>
          <span style={{ height: '12px', width: '1px', background: '#cbd5e1' }} />
          <span>Paper: A4 Standard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }} title="Zoom Out">
            <ZoomOut size={13} />
          </button>
          <span>71%</span>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }} title="Zoom In">
            <ZoomIn size={13} />
          </button>
        </div>
      </div>

      {/* Viewport for Scaled A4 Document */}
      <div 
        className="a4-preview-wrapper"
        style={{ 
          height: '650px', 
          width: '100%',
          overflow: 'hidden', 
          position: 'relative', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-start',
          background: '#e2e8f0', // Clean grey backdrop highlighting the white paper document
          padding: '1.5rem 0'
        }}
      >
        {/* Absolute dynamic background glowing blur */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.08), transparent 70%)', pointerEvents: 'none' }} />

        {/* Scaled A4 Document Sheet */}
        <div 
          className={`a4-document template-${currentTemplate.id}`}
          style={{ 
            width: '595px', 
            height: '842px', 
            background: '#ffffff', 
            color: '#1e293b', 
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05)',
            transform: 'scale(0.71)', 
            transformOrigin: 'top center',
            padding: '45px 40px',
            position: 'absolute',
            top: '1.5rem',
            textAlign: 'left',
            boxSizing: 'border-box',
            fontFeatureSettings: '"kern", "liga"',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            lineHeight: 1.45
          }}
        >
          {/* 1. Elegant Serif Template */}
          {currentTemplate.id === 'elegant' && (
            <div style={{ fontFamily: '"Times New Roman", Times, serif', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <div style={{ textAlign: 'center', borderBottom: '1px double #475569', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.05em', color: '#0f172a', margin: '0 0 0.25rem' }}>{p.name}</h1>
                  <div style={{ fontSize: '11px', color: '#475569', fontStyle: 'italic' }}>{p.contact}</div>
                </div>
                
                <p style={{ fontSize: '11.5px', color: '#334155', textAlign: 'justify', margin: '0 0 1rem', textIndent: '1.5rem' }}>{p.summary}</p>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ borderBottom: '1.5px solid #1e293b', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Briefcase size={12} /> Work Experience
                  </div>
                  {p.experience.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 'bold', color: '#1e293b' }}>
                        <span>{exp.role} &mdash; {exp.company}</span>
                        <span>{exp.dates}</span>
                      </div>
                      <ul style={{ paddingLeft: '1.2rem', margin: '0.2rem 0 0', fontSize: '11px', color: '#334155', listStyleType: 'disc' }}>
                        {exp.bullets.map((b, bi) => <li key={bi} style={{ marginBottom: '0.2rem', textAlign: 'justify' }}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ borderBottom: '1.5px solid #1e293b', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <GraduationCap size={12} /> Education
                  </div>
                  {p.education.map((edu, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{edu.degree}</span>
                      <span style={{ fontStyle: 'italic', color: '#475569' }}>{edu.school}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ borderBottom: '1.5px solid #1e293b', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', color: '#0f172a' }}>
                  Core Competencies & Expertise
                </div>
                <div style={{ fontSize: '11px', color: '#334155', fontWeight: 'bold', lineHeight: 1.4 }}>
                  {p.skills.join('  •  ')}
                </div>
              </div>
            </div>
          )}

          {/* 2. Modern Minimalist Template */}
          {currentTemplate.id === 'modern' && (
            <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#0f172a', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 0.15rem', letterSpacing: '-0.03em' }}>{p.name}</h1>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.title}</div>
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'right', lineHeight: 1.4 }}>
                    {p.contact.split('  |  ').map((c, i) => <div key={i}>{c}</div>)}
                  </div>
                </div>

                <p style={{ fontSize: '11px', color: '#475569', lineHeight: 1.5, margin: '0 0 1.25rem' }}>{p.summary}</p>

                <div style={{ marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '11px', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', borderBottom: '1px solid #ede9fe', paddingBottom: '0.2rem' }}>Experience</h2>
                  {p.experience.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '0.15rem' }}>
                        <span>{exp.role} <span style={{ fontWeight: 400, color: '#64748b' }}>at</span> {exp.company}</span>
                        <span style={{ color: '#64748b', fontWeight: 500 }}>{exp.dates}</span>
                      </div>
                      <ul style={{ paddingLeft: '1.1rem', margin: 0, fontSize: '10.5px', color: '#475569', listStyleType: 'circle' }}>
                        {exp.bullets.map((b, bi) => <li key={bi} style={{ marginBottom: '0.2rem' }}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '11px', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', borderBottom: '1px solid #ede9fe', paddingBottom: '0.2rem' }}>Education</h2>
                  {p.education.map((edu, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>{edu.degree}</span>
                      <span style={{ color: '#475569' }}>{edu.school}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 style={{ fontSize: '11px', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Skills Architecture</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {p.skills.map((s, idx) => (
                    <span key={idx} style={{ background: '#f5f3ff', color: '#6d28d9', fontSize: '10px', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid #ede9fe', fontWeight: 600 }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. Technical Indigo Template */}
          {currentTemplate.id === 'technical' && (
            <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', borderTop: '6px solid #4f46e5', paddingTop: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1.5px dashed #e2e8f0', paddingBottom: '0.75rem', marginBottom: '0.85rem' }}>
                  <div>
                    <h1 style={{ fontSize: '23px', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>{p.name}</h1>
                    <div style={{ fontSize: '11.5px', color: '#4f46e5', fontWeight: 600, marginTop: '0.1rem' }}>{p.title}</div>
                  </div>
                  <div style={{ fontSize: '10px', color: '#475569', textAlign: 'right', lineHeight: 1.4 }}>
                    {p.contact.split('  |  ').map((c, i) => <div key={i}>{c}</div>)}
                  </div>
                </div>

                <p style={{ fontSize: '11.5px', color: '#334155', lineHeight: 1.45, margin: '0 0 1rem' }}>{p.summary}</p>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ background: '#f5f3ff', borderLeft: '4px solid #4f46e5', fontSize: '11px', fontWeight: 'bold', padding: '0.2rem 0.5rem', marginBottom: '0.45rem', color: '#1e1b4b', letterSpacing: '0.02em' }}>PROFESSIONAL EXPERIENCE</div>
                  {p.experience.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700 }}>
                        <span>{exp.role} &mdash; <strong style={{ color: '#4f46e5' }}>{exp.company}</strong></span>
                        <span style={{ color: '#4f46e5' }}>{exp.dates}</span>
                      </div>
                      <ul style={{ paddingLeft: '1.2rem', margin: '0.15rem 0 0', fontSize: '10.5px', color: '#475569', listStyleType: 'square' }}>
                        {exp.bullets.map((b, bi) => <li key={bi} style={{ marginBottom: '0.2rem' }}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ background: '#f5f3ff', borderLeft: '4px solid #4f46e5', fontSize: '11px', fontWeight: 'bold', padding: '0.2rem 0.5rem', marginBottom: '0.4rem', color: '#1e1b4b', letterSpacing: '0.02em' }}>ACADEMIC PATHWAY</div>
                  {p.education.map((edu, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 700 }}>{edu.school}</span>
                      <span style={{ color: '#475569', fontStyle: 'italic' }}>{edu.degree}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ background: '#f5f3ff', borderLeft: '4px solid #4f46e5', fontSize: '11px', fontWeight: 'bold', padding: '0.2rem 0.5rem', marginBottom: '0.4rem', color: '#1e1b4b', letterSpacing: '0.02em' }}>TECHNICAL MATRIX</div>
                <div style={{ fontSize: '10.5px', color: '#334155', fontWeight: 600 }}>
                  {p.skills.join('  •  ')}
                </div>
              </div>
            </div>
          )}

          {/* 4. Executive Two-Column Template */}
          {currentTemplate.id === 'executive' && (
            <div style={{ fontFamily: 'Georgia, serif', color: '#1e293b', display: 'grid', gridTemplateColumns: '165px 1fr', gap: '1.25rem', height: '100%', margin: '-45px -40px', boxSizing: 'border-box' }}>
              
              {/* Left Column (Colored Sidebar) */}
              <div style={{ background: '#1e1b4b', color: '#e2e8f0', padding: '45px 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ borderBottom: '1px solid rgba(167, 139, 250, 0.4)', paddingBottom: '0.75rem' }}>
                  <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', margin: '0 0 0.25rem', lineHeight: 1.2 }}>{p.name.split(',')[0]}</h1>
                  <div style={{ fontSize: '9.5px', color: '#a78bfa', fontWeight: 'bold', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{p.title}</div>
                </div>

                <div>
                  <div style={{ fontSize: '10.5px', fontWeight: 'bold', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>Contact</div>
                  <div style={{ fontSize: '9px', lineHeight: 1.4, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {p.contact.split('  |  ').map((c, i) => <div key={i}>{c}</div>)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '10.5px', fontWeight: 'bold', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>Expertise</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {p.skills.map((s, idx) => (
                      <div key={idx} style={{ fontSize: '9.5px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ color: '#a78bfa' }}>&bull;</span> {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Column (Main Content) */}
              <div style={{ padding: '45px 1.25rem 45px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ borderBottom: '2px solid #6d28d9', fontSize: '11px', fontWeight: 'bold', color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: '0.2rem', marginBottom: '0.45rem' }}>Executive Summary</div>
                    <p style={{ fontSize: '10.5px', color: '#334155', lineHeight: 1.45, textAlign: 'justify', margin: 0 }}>{p.summary}</p>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ borderBottom: '2px solid #6d28d9', fontSize: '11px', fontWeight: 'bold', color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: '0.2rem', marginBottom: '0.5rem' }}>Career History</div>
                    {p.experience.map((exp, idx) => (
                      <div key={idx} style={{ marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontWeight: 'bold', color: '#1e293b' }}>
                          <span>{exp.role}</span>
                          <span style={{ fontSize: '9.5px', color: '#64748b' }}>{exp.dates}</span>
                        </div>
                        <div style={{ fontSize: '10px', fontStyle: 'italic', color: '#475569', marginBottom: '0.15rem' }}>{exp.company}</div>
                        <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '10px', color: '#334155', listStyleType: 'circle' }}>
                          {exp.bullets.map((b, bi) => <li key={bi} style={{ marginBottom: '0.2rem', lineHeight: 1.35 }}>{b}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ borderBottom: '2px solid #6d28d9', fontSize: '11px', fontWeight: 'bold', color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: '0.2rem', marginBottom: '0.4rem' }}>Education</div>
                  {p.education.map((edu, idx) => (
                    <div key={idx} style={{ fontSize: '9.5px', color: '#334155', marginBottom: '0.2rem' }}>
                      <div style={{ fontWeight: 'bold' }}>{edu.degree}</div>
                      <div style={{ color: '#64748b', fontStyle: 'italic' }}>{edu.school}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 5. Creative Gradient Template */}
          {currentTemplate.id === 'creative' && (
            <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#1e293b', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)', padding: '1.25rem 1.5rem', borderRadius: '12px', color: '#fff', margin: '-45px -40px 1rem', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.15)' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: '0 0 0.15rem', letterSpacing: '-0.02em' }}>{p.name}</h1>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', fontWeight: 'bold', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{p.title}</div>
                  <div style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.8)', marginTop: '0.35rem' }}>{p.contact}</div>
                </div>

                <p style={{ fontSize: '11px', color: '#334155', lineHeight: 1.45, margin: '0 0 1.25rem' }}>{p.summary}</p>

                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ background: 'linear-gradient(90deg, #4f46e5, #7c3aed)', color: '#fff', fontSize: '9.5px', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 'bold', display: 'inline-block', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>PROFESSIONAL CHRONOLOGY</div>
                  {p.experience.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontWeight: 'bold' }}>
                        <span>{exp.role} <span style={{ color: '#7c3aed' }}>@</span> {exp.company}</span>
                        <span style={{ color: '#7c3aed' }}>{exp.dates}</span>
                      </div>
                      <ul style={{ paddingLeft: '1.1rem', margin: '0.15rem 0 0', fontSize: '10px', color: '#475569', listStyleType: 'disc' }}>
                        {exp.bullets.map((b, bi) => <li key={bi} style={{ marginBottom: '0.15rem' }}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ background: 'linear-gradient(90deg, #4f46e5, #7c3aed)', color: '#fff', fontSize: '9.5px', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 'bold', display: 'inline-block', marginBottom: '0.45rem', letterSpacing: '0.05em' }}>ACADEMICS</div>
                  {p.education.map((edu, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{edu.degree}</span>
                      <span style={{ color: '#475569', fontStyle: 'italic' }}>{edu.school}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ background: 'linear-gradient(90deg, #4f46e5, #7c3aed)', color: '#fff', fontSize: '9.5px', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 'bold', display: 'inline-block', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>EXPERTISE</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {p.skills.map((s, idx) => (
                    <span key={idx} style={{ background: '#f5f3ff', color: '#7c3aed', fontSize: '9px', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 'bold', border: '1px solid rgba(124, 58, 237, 0.1)' }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. Clean Emerald Template */}
          {currentTemplate.id === 'emerald' && (
            <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2.5px solid #059669', paddingBottom: '0.5rem', marginBottom: '0.85rem' }}>
                  <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#064e3b', margin: 0 }}>{p.name}</h1>
                    <div style={{ fontSize: '11px', color: '#059669', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.1rem' }}>{p.title}</div>
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#475569', textAlign: 'right', lineHeight: 1.3 }}>
                    {p.contact.split('  |  ').map((c, i) => <div key={i}>{c}</div>)}
                  </div>
                </div>

                <p style={{ fontSize: '11px', color: '#334155', lineHeight: 1.45, fontStyle: 'italic', margin: '0 0 1rem' }}>{p.summary}</p>

                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ color: '#065f46', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.45rem' }}>Professional Experience</div>
                  {p.experience.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontWeight: 'bold' }}>
                        <span style={{ color: '#0f172a' }}>{exp.role} <span style={{ color: '#64748b', fontWeight: 'normal' }}>| {exp.company}</span></span>
                        <span style={{ color: '#059669' }}>{exp.dates}</span>
                      </div>
                      <ul style={{ paddingLeft: '1.1rem', margin: '0.15rem 0 0', fontSize: '10px', color: '#475569', listStyleType: 'disc' }}>
                        {exp.bullets.map((b, bi) => <li key={bi} style={{ marginBottom: '0.15rem' }}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: '#065f46', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Education & Accreditations</div>
                  {p.education.map((edu, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 'bold' }}>{edu.school}</span>
                      <span style={{ color: '#059669' }}>{edu.degree}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ color: '#065f46', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>Skills & Knowledge</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {p.skills.map((s, idx) => (
                    <span key={idx} style={{ background: '#ecfdf5', color: '#065f46', fontSize: '9.5px', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid #d1fae5', fontWeight: 600 }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Scaled PDF watermark representing vector precision */}
        <div style={{ 
          position: 'absolute', 
          bottom: '2.5rem', 
          right: '2.5rem', 
          opacity: 0.15,
          color: '#1e293b', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.35rem',
          fontSize: '11px',
          fontWeight: 'bold',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          pointerEvents: 'none'
        }}>
          <FileText size={14} />
          <span>ResumeMaster Vector PDF Engine</span>
        </div>
      </div>

      {/* Manual Controls (Overlay Navigation Arrows) */}
      <div style={{
        position: 'absolute',
        top: '55%',
        left: 0,
        right: 0,
        transform: 'translateY(-50%)',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 0.75rem',
        pointerEvents: 'none',
        zIndex: 20
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          style={{
            pointerEvents: 'auto',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            color: '#1e293b',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="slider-nav-btn"
          title="Previous Template"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          style={{
            pointerEvents: 'auto',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            color: '#1e293b',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="slider-nav-btn"
          title="Next Template"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dots Indicator & PDF Export Simulation Footer */}
      <div 
        style={{
          padding: '0.85rem 1.25rem',
          borderTop: '1px solid rgba(226, 232, 240, 0.8)',
          background: 'rgba(248, 250, 252, 0.9)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Carousel Dots */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {TEMPLATES.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              style={{
                width: currentIndex === idx ? '20px' : '7px',
                height: '7px',
                borderRadius: '9999px',
                background: currentIndex === idx ? '#8b5cf6' : '#cbd5e1',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: 0
              }}
              title={`Switch to Template ${idx + 1}`}
            />
          ))}
        </div>

        {/* Live Export Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontSize: '0.75rem', fontWeight: 'bold' }}>
          <ShieldCheck size={14} style={{ color: '#10b981' }} />
          <span>ATS Compliant Structure</span>
        </div>
      </div>
    </div>
  );
}
