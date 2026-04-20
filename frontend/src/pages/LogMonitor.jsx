import React, { useState, useMemo, useEffect } from 'react';
import { getLogs } from '../api/api';
import './LogMonitor.css';

const LogMonitor = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await getLogs();
      if (response.data && Array.isArray(response.data)) {
        const formattedLogs = response.data.map(log => ({
          id: log._id,
          timestamp: new Date(log.timestamp).toLocaleString(),
          message: `CPU: ${log.cpu}%, Mem: ${log.memory}GB, Disk: ${log.disk}%, Net: ${log.network}MBs`,
          type: 'System Metric',
          risk: parseFloat(log.riskScore).toFixed(1),
          status: log.status.charAt(0).toUpperCase() + log.status.slice(1).toLowerCase(),
        }));
        setLogs(formattedLogs);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Auto refresh every 10 seconds
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusClass = (status) => {
    const s = status.toLowerCase();
    if (s === 'critical') return 'status-critical';
    if (s === 'warning' || s === 'anomaly') return 'status-warning';
    if (s === 'suspicious') return 'status-suspicious';
    return 'status-normal';
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (filter !== 'all' && log.status.toLowerCase() !== filter) return false;
      if (search && !log.message.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [logs, filter, search]);

  return (
    <div className="log-monitor">
      <div className="monitor-header">
        <h1 className="gradient-text">Log Monitor</h1>
        <button className="refresh-btn" onClick={fetchLogs} disabled={loading}>
          <span className={`refresh-icon ${loading ? 'loading' : ''}`}>↻</span>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-dropdown">
          <span className="filter-icon">🏷️</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="normal">Normal</option>
            <option value="suspicious">Suspicious</option>
            <option value="anomaly">Anomaly</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="logs-table-container card">
        {loading && logs.length === 0 ? (
          <div className="loading-state">Loading logs from database...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="empty-state">No logs found matching your criteria.</div>
        ) : (
          <table className="logs-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Log Message</th>
              <th>Type</th>
              <th>Risk</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="log-row">
                <td className="timestamp-cell">{log.timestamp}</td>
                <td className="message-cell">{log.message}</td>
                <td className="type-cell">{log.type}</td>
                <td className="risk-cell">
                  <div className="risk-indicator">
                    <span>{log.risk}%</span>
                    <div className="risk-bar">
                      <div 
                        className={`risk-fill risk-${log.risk > 70 ? 'high' : log.risk > 40 ? 'medium' : 'low'}`}
                        style={{ width: `${log.risk}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(log.status)}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default LogMonitor;

