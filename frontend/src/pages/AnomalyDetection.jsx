
import React, { useEffect, useState } from "react";
import "./AnomalyDetection.css";

const AnomalyDetection = () => {
  const [analysis, setAnalysis] = useState(null);
  const [rawData, setRawData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem("latestPrediction");

    if (savedData) {
      const data = JSON.parse(savedData);
      setRawData(data);

      const threatIntensity = (data.riskScore * 1.15).toFixed(2);
      const stabilityIndex = (100 - data.riskScore).toFixed(2);

      const performanceLoad = (
        (data.cpu + data.memory + data.network) / 3
      ).toFixed(2);

      const anomalyPressure = (
        data.riskScore * 0.8 +
        performanceLoad * 0.2
      ).toFixed(2);

      let alertTier = "LOW";
      let color = "#10b981"; // green for low

      if (data.riskScore > 75) {
        alertTier = "CRITICAL";
        color = "#8b5cf6"; // purple for critical
      } else if (data.riskScore > 55) {
        alertTier = "MODERATE";
        color = "#f59e0b"; // amber for moderate
      }

      setAnalysis({
        threatIntensity,
        stabilityIndex,
        performanceLoad,
        anomalyPressure,
        alertTier,
        confidence: data.confidence,
        color,
      });
    }
  }, []);

  if (!analysis || !rawData) {
    return (
      <div className="anomaly-container">
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h2 className="empty-title">No prediction data found</h2>
          <p className="empty-desc">Please run a prediction first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="anomaly-container">
      {/* Header */}
      <div className="anomaly-header">
        <h1 className="page-title gradient-text">AI Anomaly Intelligence Report</h1>
        <p className="page-subtitle">Advanced threat analysis and system insights</p>
      </div>

      {/* Latest Prediction Card */}
      <div className="latest-data-card">
        <div className="latest-header">
          <span className="latest-icon">📊</span>
          <h2 className="latest-title">Latest Prediction Input</h2>
        </div>
        <div className="latest-grid">
          <div className="latest-item">
            <span className="latest-label">CPU Usage</span>
            <span className="latest-value">{rawData.cpu}%</span>
          </div>
          <div className="latest-item">
            <span className="latest-label">Memory Usage</span>
            <span className="latest-value">{rawData.memory}%</span>
          </div>
          <div className="latest-item">
            <span className="latest-label">Network Usage</span>
            <span className="latest-value">{rawData.network}%</span>
          </div>
          <div className="latest-item">
            <span className="latest-label">Risk Score</span>
            <span className="latest-value highlight">{rawData.riskScore}%</span>
          </div>
          <div className="latest-item">
            <span className="latest-label">Prediction</span>
            <span className={`latest-value status-${analysis.alertTier.toLowerCase()}`}>
              {rawData.label}
            </span>
          </div>
        </div>
      </div>

      {/* Analysis Card */}
      <div className="analysis-card">
        {/* Threat Level Banner */}
        <div 
          className="threat-banner"
          style={{ backgroundColor: analysis.color }}
        >
          <span className="threat-label">Threat Level</span>
          <span className="threat-value">{analysis.alertTier}</span>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon" style={{ background: '#ede9fe', color: '#8b5cf6' }}>⚠️</div>
            <div className="metric-content">
              <span className="metric-label">Threat Intensity</span>
              <span className="metric-value">{analysis.threatIntensity}%</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: '#e6f7e6', color: '#10b981' }}>🛡️</div>
            <div className="metric-content">
              <span className="metric-label">System Stability</span>
              <span className="metric-value">{analysis.stabilityIndex}%</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: '#fff3e0', color: '#f59e0b' }}>⚡</div>
            <div className="metric-content">
              <span className="metric-label">Performance Load</span>
              <span className="metric-value">{analysis.performanceLoad}%</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: '#ede9fe', color: '#8b5cf6' }}>📊</div>
            <div className="metric-content">
              <span className="metric-label">Anomaly Pressure</span>
              <span className="metric-value">{analysis.anomalyPressure}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: '#ede9fe', color: '#8b5cf6' }}>🎯</div>
            <div className="metric-content">
              <span className="metric-label">AI Confidence</span>
              <span className="metric-value">{analysis.confidence}%</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-label">Threat Intensity Meter</span>
            <span className="progress-percent">{analysis.threatIntensity}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${analysis.threatIntensity}%`,
                background: `linear-gradient(90deg, ${analysis.color}, ${analysis.color}dd)`
              }}
            ></div>
          </div>
        </div>

        {/* AI Analysis Summary */}
        <div className="ai-summary-card">
          <div className="ai-avatar">
            <span>🤖</span>
          </div>
          <div className="ai-message">
            <strong>AI Analysis:</strong> Based on the current metrics, the system is experiencing 
            {analysis.alertTier === 'CRITICAL' ? ' critical ' : 
             analysis.alertTier === 'MODERATE' ? ' moderate ' : ' low '} 
            level anomalies. Recommended action: {
              analysis.alertTier === 'CRITICAL' ? 'Immediate investigation required.' :
              analysis.alertTier === 'MODERATE' ? 'Monitor system closely.' :
              'System operating normally.'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnomalyDetection;

