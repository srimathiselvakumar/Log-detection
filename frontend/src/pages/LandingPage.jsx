import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          color: `rgba(139, 92, 246, ${Math.random() * 0.5})`
        });
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      requestAnimationFrame(animateParticles);
    };

    resizeCanvas();
    createParticles();
    animateParticles();

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div className="landing-container">
      {/* Particle Canvas Background */}
      <canvas ref={canvasRef} className="particle-canvas"></canvas>
      
      {/* Animated Gradient Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <div className="orb orb-4"></div>

      {/* Grid Overlay */}
      <div className="grid-overlay"></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-content">
            <div className="logo-group">
              <div className="logo-wrapper">
                <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#8B5CF6"/>
                      <stop offset="1" stopColor="#EC4899"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="logo-text-wrapper">
                <span className="logo-text"> LogMind</span>
                <span className="logo-subtext">AI</span>
              </div>
            </div>
            
            <div className="nav-links">
              <Link to="/features" className="nav-link">Features</Link>
              <Link to="/solutions" className="nav-link">Solutions</Link>
              <Link to="/pricing" className="nav-link">Pricing</Link>
              <Link to="/about" className="nav-link">About</Link>
              {/* FIXED: Sign In goes to login page */}
              <Link to="/login" className="nav-link login-link">Sign In</Link>
              {/* FIXED: Get Started goes to signup page */}
               <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              <Link to="/signup" className="btn btn-primary btn-glow">
                <span>Get Started</span>
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <button className="mobile-menu-btn">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-grid">
            <div className="hero-content fade-in-up">
              <div className="hero-badge">
                <span className="badge-pulse"></span>
                <span>Enterprise AI Platform</span>
              </div>
              
              <h1 className="hero-title">
               
                <span className="gradient-text"> Intelligent Log Anomaly Detection</span>
               
              </h1>
              
              <p className="hero-subtitle">
                Harness the power of advanced machine learning to detect, predict, and prevent 
                system anomalies in real-time. Trusted by Fortune 500 companies.
              </p>
              

              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">99.9%</span>
                  <span className="stat-label">Detection Accuracy</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">1M+</span>
                  <span className="stat-label">Logs/sec</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">50ms</span>
                  <span className="stat-label">Response Time</span>
                </div>
              </div>

              <div className="hero-cta">
  <Link to="/signup" className="btn btn-primary btn-xl btn-glow">
    Launch Dashboard
    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </Link>
  <button className="btn btn-secondary btn-xl">
    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.752 11.168L10.336 8.024C9.824 7.664 9.12 7.984 9.12 8.608V14.904C9.12 15.528 9.824 15.848 10.336 15.488L14.752 12.344C15.176 12.048 15.176 11.464 14.752 11.168Z" fill="currentColor"/>
      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
    Watch Demo
  </button>
</div>

              <div className="hero-trustpilot">
                <div className="trustpilot-avatars">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
                  <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="User" />
                  <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="User" />
                  <span className="trustpilot-count">+2.5k</span>
                </div>
                <div className="trustpilot-text">
                  <div className="trustpilot-stars">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFB800"/>
                      </svg>
                    ))}
                  </div>
                  <span>Trusted by 500+ enterprise teams</span>
                </div>
              </div>
            </div>

            <div className="hero-visual fade-in-up">
              <div className="visual-card">
                <div className="visual-header">
                  <div className="visual-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="visual-title">Live Anomaly Detection</span>
                </div>
                <div className="visual-content">
                  <div className="live-graph">
                    {[35, 42, 28, 55, 48, 62, 45, 38, 52, 44].map((height, i) => (
                      <div key={i} className="graph-bar" style={{ height: `${height}%` }}>
                        <div className="bar-fill" style={{ 
                          height: `${height}%`,
                          animationDelay: `${i * 0.1}s` 
                        }}></div>
                      </div>
                    ))}
                  </div>
                  <div className="live-stats">
                    <div className="live-stat">
                      <span className="stat-dot green"></span>
                      <span>Normal</span>
                    </div>
                    <div className="live-stat">
                      <span className="stat-dot yellow"></span>
                      <span>Anomalies</span>
                    </div>
                    <div className="live-stat">
                      <span className="stat-dot red"></span>
                      <span>Critical</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header fade-in-up">
            <span className="section-badge">POWERFUL FEATURES</span>
            <h2 className="section-title">
              Enterprise-Grade Anomaly Detection
              <span className="gradient-text">Powered by Advanced AI</span>
            </h2>
            <p className="section-subtitle">
              Everything you need to monitor, detect, and prevent system anomalies at scale
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card-h card-hover fade-in-up">
              <div className="feature-icon-wrapper">
                <div className="feature-icon-bg"></div>
                <span className="feature-icon">🤖</span>
              </div>
              <h3 className="feature-title">AI-Powered Detection</h3>
              <p className="feature-desc">
                Advanced ensemble models including Isolation Forest and Autoencoder for 99.9% detection accuracy
              </p>
              <Link to="/features/ai-detection" className="feature-link">
                Learn more
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className="feature-card-h card-hover fade-in-up" data-delay="0.1">
              <div className="feature-icon-wrapper">
                <div className="feature-icon-bg"></div>
                <span className="feature-icon">⚡</span>
              </div>
              <h3 className="feature-title">Real-Time Monitoring</h3>
              <p className="feature-desc">
                Process millions of logs per second with sub-50ms latency for instant anomaly detection
              </p>
              <Link to="/features/real-time" className="feature-link">
                Learn more
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className="feature-card-h card-hover fade-in-up" data-delay="0.2">
              <div className="feature-icon-wrapper">
                <div className="feature-icon-bg"></div>
                <span className="feature-icon">🔮</span>
              </div>
              <h3 className="feature-title">Predictive Analytics</h3>
              <p className="feature-desc">
                Forecast potential system failures 24 hours in advance with 85% prediction accuracy
              </p>
              <Link to="/features/predictive" className="feature-link">
                Learn more
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className="feature-card-h card-hover fade-in-up" data-delay="0.3">
              <div className="feature-icon-wrapper">
                <div className="feature-icon-bg"></div>
                <span className="feature-icon">🔔</span>
              </div>
              <h3 className="feature-title">Smart Alerting</h3>
              <p className="feature-desc">
                Intelligent alert routing with noise reduction and context-aware notifications
              </p>
              <Link to="/features/alerting" className="feature-link">
                Learn more
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className="feature-card-h card-hover fade-in-up" data-delay="0.4">
              <div className="feature-icon-wrapper">
                <div className="feature-icon-bg"></div>
                <span className="feature-icon">📊</span>
              </div>
              <h3 className="feature-title">Advanced Analytics</h3>
              <p className="feature-desc">
                Comprehensive dashboards with custom metrics, trends, and anomaly patterns
              </p>
              <Link to="/features/analytics" className="feature-link">
                Learn more
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className="feature-card-h card-hover fade-in-up" data-delay="0.5">
              <div className="feature-icon-wrapper">
                <div className="feature-icon-bg"></div>
                <span className="feature-icon">🔒</span>
              </div>
              <h3 className="feature-title">Enterprise Security</h3>
              <p className="feature-desc">
                SOC2 Type II compliant with end-to-end encryption and RBAC
              </p>
              <Link to="/features/security" className="feature-link">
                Learn more
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture Flow */}
      <section className="architecture">
        <div className="container">
          <div className="section-header fade-in-up">
            <span className="section-badge">HOW IT WORKS</span>
            <h2 className="section-title">
              Intelligent Detection Pipeline
              <span className="gradient-text">From Log to Insight</span>
            </h2>
          </div>

          <div className="flow-container fade-in-up">
            <div className="flow-grid">
              <div className="flow-node">
                <div className="flow-node-icon">📥</div>
                <div className="flow-node-content">
                  <h4>Log Ingestion</h4>
                  <p>Collect logs from any source</p>
                </div>
                <div className="flow-node-stats">1M+ logs/sec</div>
              </div>
              <div className="flow-arrow">→</div>
              
              <div className="flow-node">
                <div className="flow-node-icon">🔄</div>
                <div className="flow-node-content">
                  <h4>Preprocessing</h4>
                  <p>Parse, normalize, enrich</p>
                </div>
                <div className="flow-node-stats">&lt;10ms</div>
              </div>
              <div className="flow-arrow">→</div>
              
              <div className="flow-node">
                <div className="flow-node-icon">🧠</div>
                <div className="flow-node-content">
                  <h4>ML Analysis</h4>
                  <p>Isolation Forest + Autoencoder</p>
                </div>
                <div className="flow-node-stats">99.9% acc</div>
              </div>
              <div className="flow-arrow">→</div>
              
              <div className="flow-node">
                <div className="flow-node-icon">🎯</div>
                <div className="flow-node-content">
                  <h4>Anomaly Detection</h4>
                  <p>Real-time scoring</p>
                </div>
                <div className="flow-node-stats">50ms</div>
              </div>
              <div className="flow-arrow">→</div>
              
              <div className="flow-node">
                <div className="flow-node-icon">📢</div>
                <div className="flow-node-content">
                  <h4>Alert Generation</h4>
                  <p>Smart notifications</p>
                </div>
                <div className="flow-node-stats">Real-time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="trusted-by">
        <div className="container">
          <div className="trusted-header fade-in-up">
            <span className="trusted-badge">TRUSTED BY INDUSTRY LEADERS</span>
          </div>
          <div className="company-grid fade-in-up">
            <div className="company-logo">
              <div className="logo-placeholder">TechCorp</div>
            </div>
            <div className="company-logo">
              <div className="logo-placeholder">CloudScale</div>
            </div>
            <div className="company-logo">
              <div className="logo-placeholder">DataFlow</div>
            </div>
            <div className="company-logo">
              <div className="logo-placeholder">SecureNet</div>
            </div>
            <div className="company-logo">
              <div className="logo-placeholder">AI Dynamics</div>
            </div>
            <div className="company-logo">
              <div className="logo-placeholder">FutureStack</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-card fade-in-up">
            <div className="cta-content">
              <h2 className="cta-title">
                Ready to transform your log monitoring?
              </h2>
              <p className="cta-subtitle">
                Join 500+ enterprises already using LogMind AI to detect anomalies in real-time
              </p>
              <div className="cta-buttons">
                {/* FIXED: Start Free Trial goes to signup */}
                <Link to="/signup" className="btn btn-primary btn-xl btn-glow">
                  Start Free Trial
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link to="/contact" className="btn btn-outline btn-xl">
                  Contact Sales
                </Link>
              </div>
              <p className="cta-note">
                No credit card required. 14-day free trial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-text">LogMind AI</span>
              </div>
              <p className="footer-description">
                Next-generation log anomaly detection powered by advanced machine learning.
              </p>
              <div className="social-links">
                <a href="#" className="social-link">📘</a>
                <a href="#" className="social-link">🐦</a>
                <a href="#" className="social-link">💼</a>
                <a href="#" className="social-link">📺</a>
              </div>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#">Features</a>
                <a href="#">Solutions</a>
                {/* FIXED: Pricing link */}
                <Link to="/pricing">Pricing</Link>
                <Link to="/demo">Demo</Link>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <Link to="/about">About</Link>
                <Link to="/careers">Careers</Link>
                <Link to="/blog">Blog</Link>
                <Link to="/press">Press</Link>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <Link to="/docs">Documentation</Link>
                <Link to="/api">API</Link>
                <Link to="/support">Support</Link>
                <Link to="/status">Status</Link>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <Link to="/privacy">Privacy</Link>
                <Link to="/terms">Terms</Link>
                <Link to="/security">Security</Link>
                <Link to="/compliance">Compliance</Link>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 LogMind AI. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;