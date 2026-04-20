

import React, { useState } from "react";
import { detectAnomaly } from "../api/api";
import "./Predict.css";

const Predict = () => {
  const [formData, setFormData] = useState({
    cpu: "",
    memory: "",
    disk: "",
    network: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeField, setActiveField] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await detectAnomaly({
        cpu: parseFloat(formData.cpu),
        memory: parseFloat(formData.memory),
        disk: parseFloat(formData.disk),
        network: parseFloat(formData.network),
      });

      const backendData = response.data;

      const sharedPredictionData = {
        cpu: parseFloat(formData.cpu),
        memory: parseFloat(formData.memory),
        disk: parseFloat(formData.disk),
        network: parseFloat(formData.network),
        riskScore: backendData.risk,
        status: backendData.status,
        isoScore: backendData.iso_score,
        reconstructionLoss: backendData.reconstruction_loss,
        confidence: 100 - backendData.risk,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(
        "latestPrediction",
        JSON.stringify(sharedPredictionData)
      );

      setResult(sharedPredictionData);
    } catch (err) {
      console.error("Prediction error:", err);
      setError("Failed to get prediction. Check backend.");
    }

    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'CRITICAL': return '#8b5cf6';
      case 'WARNING': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'CRITICAL': return '#ede9fe';
      case 'WARNING': return '#fff3e0';
      default: return '#e6f7e6';
    }
  };

  return (
    <div className="predict-container">
      {/* Decorative Elements */}
      <div className="predict-bg">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
      </div>

      <div className="predict-wrapper">
        {/* Header */}
        <div className="predict-header">
          <h1 className="predict-title gradient-text">
            AI Anomaly Detection
          </h1>
          <p className="predict-subtitle">
            Enter system metrics to analyze potential anomalies
          </p>
        </div>

        {/* Main Content */}
        <div className="predict-content">
          {/* Form Section */}
          <div className="form-section">
            <div className="form-card">
              <div className="form-card-header">
                <span className="header-icon">🔬</span>
                <h2>Input Parameters</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="predict-form">
                <div className="form-grid">
                  {/* CPU Field */}
                  <div className={`input-group ${activeField === 'cpu' ? 'focused' : ''}`}>
                    <label className="input-label">
                      <span className="label-icon">💻</span>
                      CPU Usage (%)
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        name="cpu"
                        placeholder="0-100"
                        value={formData.cpu}
                        onChange={handleChange}
                        onFocus={() => setActiveField('cpu')}
                        onBlur={() => setActiveField(null)}
                        required
                        className="predict-input"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                      {formData.cpu && <span className="input-unit">%</span>}
                    </div>
                  </div>

                  {/* Memory Field */}
                  <div className={`input-group ${activeField === 'memory' ? 'focused' : ''}`}>
                    <label className="input-label">
                      <span className="label-icon">📊</span>
                      Memory Usage (GB)
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        name="memory"
                        placeholder="0-64"
                        value={formData.memory}
                        onChange={handleChange}
                        onFocus={() => setActiveField('memory')}
                        onBlur={() => setActiveField(null)}
                        required
                        className="predict-input"
                        step="0.1"
                        min="0"
                      />
                      {formData.memory && <span className="input-unit">GB</span>}
                    </div>
                  </div>

                  {/* Disk Field */}
                  <div className={`input-group ${activeField === 'disk' ? 'focused' : ''}`}>
                    <label className="input-label">
                      <span className="label-icon">💾</span>
                      Disk Usage (%)
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        name="disk"
                        placeholder="0-100"
                        value={formData.disk}
                        onChange={handleChange}
                        onFocus={() => setActiveField('disk')}
                        onBlur={() => setActiveField(null)}
                        required
                        className="predict-input"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                      {formData.disk && <span className="input-unit">%</span>}
                    </div>
                  </div>

                  {/* Network Field */}
                  <div className={`input-group ${activeField === 'network' ? 'focused' : ''}`}>
                    <label className="input-label">
                      <span className="label-icon">🌐</span>
                      Network Traffic (MB/s)
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        name="network"
                        placeholder="0-1000"
                        value={formData.network}
                        onChange={handleChange}
                        onFocus={() => setActiveField('network')}
                        onBlur={() => setActiveField(null)}
                        required
                        className="predict-input"
                        step="0.1"
                        min="0"
                      />
                      {formData.network && <span className="input-unit">MB/s</span>}
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className={`predict-button ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="button-spinner"></span>
                      <span>Analyzing System...</span>
                    </>
                  ) : (
                    <>
                      <span className="button-icon">🔮</span>
                      <span>Run AI Prediction</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Result Section */}
          <div className="result-section">
            {result ? (
              <div className="result-card">
                <div className="result-header">
                  <div 
                    className="status-badge"
                    style={{ 
                      background: getStatusBg(result.status),
                      color: getStatusColor(result.status)
                    }}
                  >
                    <span className="status-dot" style={{ background: getStatusColor(result.status) }}></span>
                    {result.status}
                  </div>
                  <span className="result-time">{new Date(result.timestamp).toLocaleTimeString()}</span>
                </div>

                <div className="result-stats">
                  {/* Risk Score Gauge */}
                  <div className="stat-gauge">
                    <div className="gauge-header">
                      <span className="gauge-label">Risk Score</span>
                      <span className="gauge-value" style={{ color: getStatusColor(result.status) }}>
                        {result.riskScore}%
                      </span>
                    </div>
                    <div className="gauge-bar">
                      <div 
                        className="gauge-fill"
                        style={{ 
                          width: `${result.riskScore}%`,
                          background: `linear-gradient(90deg, ${getStatusColor(result.status)}, ${getStatusColor(result.status)}dd)`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div className="stat-gauge">
                    <div className="gauge-header">
                      <span className="gauge-label">AI Confidence</span>
                      <span className="gauge-value" style={{ color: '#8b5cf6' }}>
                        {result.confidence}%
                      </span>
                    </div>
                    <div className="gauge-bar">
                      <div 
                        className="gauge-fill"
                        style={{ 
                          width: `${result.confidence}%`,
                          background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Input Summary */}
                  <div className="input-summary">
                    <h4>Input Summary</h4>
                    <div className="summary-grid">
                      <div className="summary-item">
                        <span className="summary-label">CPU</span>
                        <span className="summary-value">{result.cpu}%</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Memory</span>
                        <span className="summary-value">{result.memory}GB</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Disk</span>
                        <span className="summary-value">{result.disk}%</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Network</span>
                        <span className="summary-value">{result.network}MB/s</span>
                      </div>
                    </div>
                  </div>

                  {/* Model Details */}
                  <div className="model-details">
                    <div className="detail-item">
                      <span className="detail-label">Isolation Score</span>
                      <span className="detail-value">{result.isoScore.toFixed(4)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Reconstruction Loss</span>
                      <span className="detail-value">{result.reconstructionLoss.toFixed(4)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="result-actions">
                  <button className="action-btn secondary" onClick={() => setResult(null)}>
                    New Prediction
                  </button>
                  <button className="action-btn primary" onClick={() => window.location.href = '/anomaly-detection'}>
                    View Detailed Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="result-placeholder">
                <div className="placeholder-icon">🔮</div>
                <h3>Ready to Predict</h3>
                <p>Enter system metrics and click "Run AI Prediction" to analyze anomalies</p>
                <div className="placeholder-features">
                  <div className="feature">
                    <span className="feature-icon">✓</span>
                    <span>Real-time analysis</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">✓</span>
                    <span>ML-powered detection</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">✓</span>
                    <span>Instant results</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
                <button className="error-close" onClick={() => setError('')}>×</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;

