import React, { useState, useEffect } from 'react';
import { getLogs, toggleSimulation, getSimulationStatus } from '../api/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Stats computed from logs
  const [stats, setStats] = useState({
    riskScore: 0,
    status: 'Healthy',
    anomalyCount: 0,
    normalCount: 0,
    criticalEvents: 0,
    cpu: 0,
    memory: 0,
    network: 0,
    confidence: 100
  });

  const fetchDashboardData = async () => {
    try {
      const [logsResponse, statusResponse] = await Promise.all([
        getLogs(),
        getSimulationStatus()
      ]);
      
      const latestLogs = logsResponse.data || [];
      setLogs(latestLogs);
      setIsSimulating(statusResponse.data.isSimulating);
      
      if (latestLogs.length > 0) {
        const latest = latestLogs[0];
        const criticalCount = latestLogs.filter(l => l.status === 'CRITICAL').length;
        const warningCount = latestLogs.filter(l => l.status === 'WARNING').length;
        const totalAnomalies = criticalCount + warningCount;
        const normalCount = latestLogs.length - totalAnomalies;
        
        setStats({
          riskScore: latest.riskScore || 0,
          status: latest.status || 'NORMAL',
          anomalyCount: totalAnomalies,
          normalCount: normalCount,
          criticalEvents: criticalCount,
          cpu: latest.cpu || 0,
          memory: latest.memory || 0,
          network: latest.network || 0,
          confidence: Math.max(0, 100 - (latest.riskScore || 0))
        });
      }
    } catch (err) {
      console.error("Dashboard fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh every 5 seconds to catch simulation logs live!
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSimulation = async () => {
    try {
      const res = await toggleSimulation();
      setIsSimulating(res.data.isSimulating);
    } catch(err) {
      console.error(err);
      alert("Failed to toggle simulation check backend.");
    }
  };

  if (loading && logs.length === 0) {
    return (
      <div className="dashboard">
        <h2>Loading Enterprise Analytics...</h2>
      </div>
    );
  }

  // Pre-process chart data
  // Reverse logs so rightmost is newest
  const chartData = [...logs].reverse().map(log => ({
    time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    risk: parseFloat(log.riskScore),
    cpu: parseFloat(log.cpu)
  })).slice(-20); // Only keep the last 20 ticks for clean charting

  const pieData = [
    { name: 'Normal', value: stats.normalCount, color: '#10b981' },
    { name: 'Warning', value: stats.anomalyCount - stats.criticalEvents, color: '#f59e0b' },
    { name: 'Critical', value: stats.criticalEvents, color: '#ef4444' }
  ].filter(d => d.value > 0);

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="gradient-text">Live System Analytics</h1>
          <p className="header-date">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>

        <div className="header-right">
          <div className="live-indicator">
            <span className={`live-dot ${isSimulating ? 'active-pulse' : 'paused'}`} style={{ backgroundColor: isSimulating ? '#10b981' : '#6b7280'}}></span>
            <span>{isSimulating ? 'Simulation Active' : 'System Idle'}</span>
          </div>
          <button 
            className={`simulate-btn ${isSimulating ? 'active-sim' : ''}`}
            onClick={handleToggleSimulation}
          >
            {isSimulating ? 'Stop Live Server Simulation' : '▶ Start AI Traffic Simulation'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {/* Risk Score */}
        <div className="kpi-card">
          <div className="kpi-icon-wrapper">
            <span className="kpi-icon">📊</span>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Current Risk</p>
            <div className="kpi-value-wrapper">
              <span className="kpi-value" style={{ color: '#8b5cf6' }}>
                {Math.round(stats.riskScore)}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${stats.riskScore}%`, backgroundColor: '#8b5cf6' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="kpi-card">
          <div className="kpi-icon-wrapper status-healthy-bg">
            <span className="kpi-icon">🛡️</span>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Node Status</p>
            <div className="kpi-value-wrapper">
              <span className="kpi-value" style={{ 
                color: stats.status === 'CRITICAL' ? '#ef4444' : stats.status === 'WARNING' ? '#f59e0b' : '#10b981' 
              }}>
                {stats.status}
              </span>
            </div>
          </div>
        </div>

        {/* Anomalies */}
        <div className="kpi-card">
          <div className="kpi-icon-wrapper warning-bg">
            <span className="kpi-icon">⚠️</span>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Flags (Last 100)</p>
            <div className="kpi-value-wrapper">
              <span className="kpi-value" style={{ color: '#f59e0b' }}>
                {stats.anomalyCount}
              </span>
            </div>
            <div className="anomaly-breakdown">
              <span className="badge">Normal: {stats.normalCount}</span>
            </div>
          </div>
        </div>

        {/* Critical Events */}
        <div className="kpi-card">
          <div className="kpi-icon-wrapper critical-bg">
            <span className="kpi-icon">❌</span>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Critical Alerts</p>
            <div className="kpi-value-wrapper">
              <span className="kpi-value" style={{ color: '#ef4444' }}>
                {stats.criticalEvents}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      {logs.length > 0 && (
      <div className="charts-grid advanced-charts">
        <div className="chart-card line-chart-card">
          <h3 className="chart-title">Risk & CPU Trend (Live)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                <XAxis dataKey="time" tick={{fontSize: 12}} />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} name="Risk Score (%)" dot={false} />
                <Line type="monotone" dataKey="cpu" stroke="#8b5cf6" strokeWidth={2} name="CPU Usage (%)" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card pie-chart-card">
          <h3 className="chart-title">Status Distribution</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pie-legend">
            {pieData.map(d => (
              <span key={d.name} style={{color: d.color, fontWeight: 'bold', marginRight: '10px'}}>
                 ■ {d.name} ({d.value})
              </span>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Live Metrics */}
      <div className="metrics-grid">
        <div className="metric-item">
          <p className="metric-label">CPU Usage</p>
          <p className="metric-value">{stats.cpu}%</p>
        </div>
        <div className="metric-item">
          <p className="metric-label">Memory</p>
          <p className="metric-value">{stats.memory} GB</p>
        </div>
        <div className="metric-item">
          <p className="metric-label">Network</p>
          <p className="metric-value">{stats.network} MB/s</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
