import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./landing.css";

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Features data for better management
  const features = [
    {
      icon: "🎥",
      title: "HD Video Conferencing",
      description: "Crystal clear 4K video with AI noise cancellation and virtual backgrounds.",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      icon: "💬",
      title: "Smart Chat",
      description: "AI-powered chat with file sharing, threads, and smart suggestions.",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: "🛡️",
      title: "Enterprise Security",
      description: "End-to-end encryption, SSO, and GDPR compliance built-in.",
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: "📊",
      title: "Advanced Analytics",
      description: "Meeting insights, participation metrics, and productivity reports.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: "🤖",
      title: "AI Assistant",
      description: "Automated meeting notes, action items, and smart summaries.",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: "🔧",
      title: "Custom Integrations",
      description: "Slack, Jira, Google Workspace, Microsoft Teams, and more.",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <div className="landing-page">
      {/* NAVBAR - Enhanced */}
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="container nav-container">
          <div className="brand">
            <div className="brand-logo">
              <span className="logo-icon">🎯</span>
            </div>
            <h2 className="brand-text">ZAT Room</h2>
          </div>

          <nav className="nav-links">
            <a href="#purpose" className="nav-link">Our Purpose</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#pricing" className="nav-link">Enterprise</a>
            <a href="#testimonials" className="nav-link">Testimonials</a>
            <Link to="/login" className="nav-cta">
              Get Started
            </Link>
          </nav>

          <div className="mobile-menu-btn">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>

      {/* HERO SECTION - Enhanced */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="bg-grid"></div>
          <div className="floating-element el1"></div>
          <div className="floating-element el2"></div>
          <div className="floating-element el3"></div>
        </div>
        
        <div className="container hero-content">
          <div className="hero-text">
            <div className="badge-container">
              <span className="badge-new">✨ Enterprise Security 2.0</span>
              <span className="badge-trending">🚀 Trending Worldwide</span>
            </div>
            <h1>
              Where Teams <span className="gradient-text">Connect</span> &
              <span className="gradient-text-2"> Create</span>
            </h1>
            <p className="hero-subtitle">
              The intelligent workspace for modern teams. High-fidelity video, 
              persistent chat, and secure collaboration—all powered by AI.
            </p>
            <div className="hero-buttons">
              <Link to="/login">
                <button className="btn btn-primary">
                  <span className="btn-icon">🚀</span>
                  Start Free Trial
                </button>
              </Link>
              <button className="btn btn-outline">
                <span className="btn-icon">🎬</span>
                Watch Demo
              </button>
              <button className="btn btn-ghost">
                <span className="btn-icon">📞</span>
                Book Demo
              </button>
            </div>
            
            <div className="stats-bar">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Active Teams</span>
              </div>
              <div className="stat">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Countries</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.9</span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="video-call-mockup">
              <div className="mockup-header">
                <div className="header-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="meeting-title">Team Sync Meeting</span>
                <div className="participant-count">👥 12</div>
              </div>
              
              <div className="video-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={`video-tile tile-${i}`}>
                    <div className="user-avatar">
                      <span>U{i}</span>
                    </div>
                    <div className="user-status"></div>
                  </div>
                ))}
                <div className="screen-share-tile">
                  <div className="screen-content">
                    <div className="code-window">
                      <div className="code-line"></div>
                      <div className="code-line"></div>
                      <div className="code-line"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="call-controls">
                <button className="control-btn mic-active">🎤</button>
                <button className="control-btn video-active">📹</button>
                <button className="control-btn share">🔄</button>
                <button className="control-btn record">⏺️</button>
                <button className="control-btn end-call">📞</button>
              </div>
              
              <div className="chat-sidebar">
                <div className="chat-header">
                  <span>💬 Live Chat</span>
                  <span className="chat-badge">3</span>
                </div>
                <div className="chat-messages">
                  <div className="message">
                    <span className="sender">Alex:</span>
                    <span className="text">Can you share the deck?</span>
                  </div>
                  <div className="message">
                    <span className="sender">Sam:</span>
                    <span className="text">Just shared it!</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="floating-card card-1">
              <span className="card-icon">📊</span>
              <span className="card-text">Live Analytics</span>
            </div>
            <div className="floating-card card-2">
              <span className="card-icon">🤖</span>
              <span className="card-text">AI Assistant Active</span>
            </div>
          </div>
        </div>
        
        {/* Trusted by logos */}
        <div className="trusted-by">
          <span className="trusted-label">Trusted by innovative teams:</span>
          <div className="company-logos">
            {['Microsoft', 'Google', 'Apple', 'Amazon', 'Spotify', 'Netflix'].map((company) => (
              <div key={company} className="company-logo">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PURPOSE SECTION */}
      <section className="purpose-section" id="purpose">
        <div className="container">
          <div className="section-header center">
            <div className="section-badge">🎯 Our Vision</div>
            <h2>Redefining digital collaboration</h2>
            <p className="section-subtitle">
              We're on a mission to make remote work feel human again
            </p>
          </div>

          <div className="purpose-grid">
            <div className="purpose-card">
              <div className="purpose-icon">🚀</div>
              <h3>The Problem</h3>
              <p>
                Teams lose 31% of their day switching between apps. Context switching kills 
                productivity and creativity in distributed teams.
              </p>
              <div className="purpose-stats">
                <span>31% productivity loss</span>
                <span>12 tools average</span>
              </div>
            </div>
            
            <div className="purpose-card featured">
              <div className="purpose-icon">💡</div>
              <h3>Our Solution</h3>
              <p>
                One unified platform for all collaboration needs. Video, chat, files, and 
                project management in a seamless experience.
              </p>
              <div className="solution-benefits">
                <span>✅ 70% less switching</span>
                <span>✅ 40% faster decisions</span>
              </div>
            </div>
            
            <div className="purpose-card">
              <div className="purpose-icon">🔒</div>
              <h3>Our Promise</h3>
              <p>
                Enterprise-grade security with zero compromise on user experience. 
                Built with privacy-by-design from day one.
              </p>
              <div className="security-badges">
                <span>🔐 E2E Encryption</span>
                <span>🌐 GDPR Compliant</span>
              </div>
            </div>
          </div>
          
          <div className="purpose-video">
            <div className="video-placeholder">
              <div className="play-button">▶️</div>
              <span>Watch our story (2:30)</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - Enhanced */}
      <section className="features-section" id="features">
        <div className="features-background"></div>
        <div className="container">
          <div className="section-header center">
            <div className="section-badge">✨ Features</div>
            <h2>Everything you need to collaborate better</h2>
            <p className="section-subtitle">
              Powerful features designed for modern teams
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`feature-card ${hoveredFeature === index ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="feature-icon-wrapper">
                  <span className="feature-icon">{feature.icon}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-cta">
                  <span className="learn-more">Learn more →</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Advanced Features */}
          <div className="advanced-features">
            <h3 className="advanced-title">Advanced Capabilities</h3>
            <div className="capabilities-grid">
              <div className="capability">
                <span className="capability-icon">🎯</span>
                <h4>Smart Noise Cancellation</h4>
                <p>AI-powered background noise removal</p>
              </div>
              <div className="capability">
                <span className="capability-icon">👁️</span>
                <h4>Eye Contact Correction</h4>
                <p>Maintain natural eye contact</p>
              </div>
              <div className="capability">
                <span className="capability-icon">📝</span>
                <h4>Live Transcription</h4>
                <p>Real-time meeting transcription</p>
              </div>
              <div className="capability">
                <span className="capability-icon">🎨</span>
                <h4>Virtual Backgrounds</h4>
                <p>Custom backgrounds & blur</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-header center">
            <div className="section-badge">❤️ Loved By Teams</div>
            <h2>What our customers say</h2>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                "ZAT Room reduced our meeting time by 40%. The AI summaries are a game-changer."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div className="author-info">
                  <h4>John Doe</h4>
                  <p>CTO, TechCorp Inc.</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card featured">
              <div className="testimonial-content">
                "Our global team collaboration improved dramatically. The video quality is unmatched."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">SA</div>
                <div className="author-info">
                  <h4>Sarah Adams</h4>
                  <p>Head of Remote, GlobalTech</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                "Security features gave us peace of mind while scaling our remote team."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">MK</div>
                <div className="author-info">
                  <h4>Mike Chen</h4>
                  <p>Security Lead, FinanceCorp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="pricing-section" id="pricing">
        <div className="container">
          <div className="section-header center">
            <div className="section-badge">💰 Pricing</div>
            <h2>Simple, transparent pricing</h2>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Free</h3>
                <div className="price">$0<span>/month</span></div>
              </div>
              <ul className="pricing-features">
                <li>✓ Up to 10 participants</li>
                <li>✓ 40 min meeting limit</li>
                <li>✓ Basic chat</li>
                <li>✓ 1 GB storage</li>
              </ul>
              <button className="pricing-btn">Get Started</button>
            </div>
            
            <div className="pricing-card popular">
              <div className="popular-badge">Most Popular</div>
              <div className="pricing-header">
                <h3>Pro</h3>
                <div className="price">$12<span>/user/month</span></div>
              </div>
              <ul className="pricing-features">
                <li>✓ Up to 100 participants</li>
                <li>✓ Unlimited meetings</li>
                <li>✓ Advanced analytics</li>
                <li>✓ 100 GB storage</li>
                <li>✓ Priority support</li>
              </ul>
              <button className="pricing-btn primary">Start Free Trial</button>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Enterprise</h3>
                <div className="price">Custom</div>
              </div>
              <ul className="pricing-features">
                <li>✓ Unlimited participants</li>
                <li>✓ SSO & SCIM</li>
                <li>✓ Custom contract</li>
                <li>✓ Dedicated support</li>
                <li>✓ Custom integrations</li>
              </ul>
              <button className="pricing-btn">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to transform your team collaboration?</h2>
            <p>Join 10,000+ teams using ZAT Room today</p>
            <div className="cta-buttons">
              <Link to="/login">
                <button className="btn btn-primary btn-lg">
                  🚀 Start Free 14-Day Trial
                </button>
              </Link>
              <button className="btn btn-outline btn-lg">
                📞 Book a Demo
              </button>
            </div>
            <div className="cta-perks">
              <span>✓ No credit card required</span>
              <span>✓ Free onboarding</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-section">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">🎯</span>
                <h3>ZAT Room</h3>
              </div>
              <p>Making remote work feel human again.</p>
              <div className="social-links">
                {['twitter', 'linkedin', 'github', 'youtube'].map((social) => (
                  <a key={social} href="#" className={`social-link ${social}`}>
                    {social === 'twitter' ? '𝕏' : social.charAt(0).toUpperCase()}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="footer-links-group">
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Enterprise</a>
              <a href="#">Security</a>
              <a href="#">Roadmap</a>
            </div>
            
            <div className="footer-links-group">
              <h4>Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">Blog</a>
              <a href="#">Community</a>
              <a href="#">Support</a>
            </div>
            
            <div className="footer-links-group">
              <h4>Company</h4>
              <a href="#purpose">About</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
              <a href="#">Partners</a>
            </div>
            
            <div className="footer-links-group">
              <h4>Legal</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Security</a>
              <a href="#">Compliance</a>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} ZAT Room Inc. All rights reserved.</p>
            <div className="footer-locale">
              <span>🌐 English</span>
              <span>📍 Global</span>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Floating Action Button */}
      <div className="fab">
        <span>💬</span>
      </div>
    </div>
  );
};

export default Landing;