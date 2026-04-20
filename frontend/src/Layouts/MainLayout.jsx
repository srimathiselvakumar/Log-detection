import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { name: 'Anomaly Detection', icon: '🔬', path: '/anomaly-detection' },
    { name: 'Log Monitor', icon: '📝', path: '/logs' },
    { name: 'Predict', icon: '🔮', path: '/predict' },
    { name: 'About', icon: 'ℹ️', path: '/about' },
  ];

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('user');
    
    // Navigate to landing page
    navigate('/');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">LogMind AI</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;