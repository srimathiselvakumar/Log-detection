import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  const services = [
    {
      id: 1,
      title: 'Dashboard',
      icon: '📊',
      description: 'Real-time system overview with KPI metrics, risk scores, and live status monitoring. Get instant insights into your infrastructure health.',
      features: [
        'Live system status indicators',
        'Risk score tracking',
        'AI confidence meter',
        'Recent activities log',
        'Performance metrics'
      ],
      link: '/dashboard',
      color: '#8b5cf6'
    },
    {
      id: 2,
      title: 'Live Alerts',
      icon: '🔔',
      description: 'Intelligent alerting system that notifies you of critical anomalies in real-time. Never miss a potential threat.',
      features: [
        'Real-time notifications',
        'Severity-based alerts',
        'Email notifications',
        'Alert history',
        'Customizable thresholds'
      ],
      link: '/alerts',
      color: '#ec4899'
    },
    {
      id: 3,
      title: 'Predict Page',
      icon: '🔮',
      description: 'Advanced ML-powered prediction engine that analyzes system metrics to forecast potential anomalies before they occur.',
      features: [
        'AI-powered predictions',
        'Risk score calculation',
        'Confidence metrics',
        'Historical analysis',
        'Trend detection'
      ],
      link: '/predict',
      color: '#3b82f6'
    },
    {
      id: 4,
      title: 'Log Monitoring',
      icon: '📝',
      description: 'Comprehensive log management system with real-time streaming, filtering, and advanced search capabilities.',
      features: [
        'Real-time log streaming',
        'Advanced filtering',
        'Search functionality',
        'Log categorization',
        'Export capabilities'
      ],
      link: '/logs',
      color: '#10b981'
    },
    {
      id: 5,
      title: 'Anomaly Detection',
      icon: '🚨',
      description: 'State-of-the-art machine learning algorithms that detect unusual patterns and potential security threats in your system.',
      features: [
        'ML-based detection',
        'Pattern recognition',
        'Threat intelligence',
        'Automated analysis',
        'Detailed reports'
      ],
      link: '/anomaly-detection',
      color: '#f59e0b'
    }
  ];

  const stats = [
    { value: '99.9%', label: 'Detection Accuracy' },
    { value: '1M+', label: 'Logs Processed/sec' },
    { value: '50ms', label: 'Response Time' },
    { value: '24/7', label: 'Monitoring' },
    { value: '500+', label: 'Enterprise Clients' },
    { value: '99.99%', label: 'Uptime SLA' }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: '15+ years in cybersecurity and AI'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Ex-Google ML engineer'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      bio: 'Product strategy & UX expert'
    },
    {
      name: 'David Kim',
      role: 'Lead Engineer',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      bio: 'Full-stack & cloud architecture'
    }
  ];

  return (
    <div className="about-page">
      {/* Animated Background - Light Lavender */}
      <div className="about-background">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
        <div className="gradient-sphere sphere-3"></div>
        <div className="gradient-sphere sphere-4"></div>
      </div>

      {/* Grid Pattern - Light */}
      <div className="grid-pattern"></div>

      {/* Floating Particles - Light */}
      <div className="floating-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
            }}
          ></div>
        ))}
      </div>

      <div className="about-wrapper">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content">
            <h1 className="hero-title">
             <span className="gradient-text">LogMind AI</span>
            </h1>
            <p className="hero-subtitle">
              Revolutionizing log monitoring with cutting-edge artificial intelligence
            </p>
            <div className="hero-stats">
              {stats.slice(0, 3).map((stat, index) => (
                <div key={index} className="hero-stat-item">
                  <span className="hero-stat-value">{stat.value}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="mission-content">
            <h2 className="section-title">Our Mission</h2>
            <p className="mission-text">
              At LogMind AI, we're on a mission to transform how businesses monitor and protect their infrastructure. 
              By combining advanced machine learning algorithms with intuitive design, we make anomaly detection 
              accessible, accurate, and actionable for organizations of all sizes.
            </p>
            <div className="mission-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">🎯</span>
                <h3>99.9% Accuracy</h3>
                <p>Industry-leading detection rates</p>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">⚡</span>
                <h3>Real-time Processing</h3>
                <p>Millions of logs per second</p>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🛡️</span>
                <h3>Enterprise Security</h3>
                <p>SOC2 Type II compliant</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive AI-powered solutions for your infrastructure monitoring needs
          </p>

          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-header" style={{ background: `linear-gradient(135deg, ${service.color}15, ${service.color}05)` }}>
                  <span className="service-icon" style={{ background: service.color }}>
                    {service.icon}
                  </span>
                  <h3 className="service-title" style={{ color: '#1f2937' }}>{service.title}</h3>
                </div>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>
                      <span className="feature-check" style={{ color: service.color }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={service.link} className="service-link" style={{ color: service.color }}>
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h2 className="section-title">Meet Our Team</h2>
          <p className="section-subtitle">
            The brilliant minds behind LogMind AI
          </p>

          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <img src={member.avatar} alt={member.name} className="team-avatar" />
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="tech-section">
          <h2 className="section-title">Technology Stack</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <span className="tech-icon">⚛️</span>
              <span className="tech-name">React</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🚀</span>
              <span className="tech-name">Node.js</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🗄️</span>
              <span className="tech-name">MongoDB</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🤖</span>
              <span className="tech-name">TensorFlow</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">📊</span>
              <span className="tech-name">Python</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🔒</span>
              <span className="tech-name">JWT Auth</span>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta">
          <div className="cta-content">
            <h2>Ready to transform your log monitoring?</h2>
            <p>Join 500+ enterprises already using LogMind AI</p>
            <div className="cta-buttons">
              <Link to="/signup" className="cta-button primary">
                Get Started Free
              </Link>
              <Link to="/contact" className="cta-button secondary">
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;