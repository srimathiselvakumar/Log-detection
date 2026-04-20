import axios from "axios";

/* =========================================
   AXIOS INSTANCE (Global API Config)
========================================= */

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", // Supports Render/Vercel
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


/* =========================================
   REQUEST INTERCEPTOR (Attach JWT if exists)
========================================= */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


/* =========================================
   RESPONSE INTERCEPTOR (Global Error Handler)
========================================= */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response?.data || error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


/* =========================================
   AUTH ENDPOINTS
========================================= */

export const loginUser = (data) =>
  api.post("/login", data);

export const registerUser = (data) =>
  api.post("/signup", data);

export const getUserProfile = () =>
  api.get("/auth/profile");


/* =========================================
   DASHBOARD ENDPOINTS
========================================= */

export const getDashboardMetrics = () =>
  api.get("/dashboard/metrics");

export const getRecentActivities = () =>
  api.get("/dashboard/recent-activities");

export const getRiskTrend = (range = "24h") =>
  api.get(`/dashboard/risk-trend?range=${range}`);

export const getSystemHealth = () =>
  api.get("/dashboard/system-health");


/* =========================================
   ANOMALY DETECTION (ML MODEL)
========================================= */

export const detectAnomaly = (data) =>
  api.post("/predict", data);

/*
Expected body example:
{
  cpu: 45,
  memory: 6.2,
  disk: 70,
  network: 1.2
}
*/


/* =========================================
   LOG MANAGEMENT
========================================= */

export const getLogs = (params) =>
  api.get("/logs", { params });

export const getLogById = (id) =>
  api.get(`/logs/${id}`);

export const searchLogs = (query) =>
  api.get(`/logs/search?q=${query}`);


/* =========================================
   ANALYTICS
========================================= */

export const getAnomalyStats = () =>
  api.get("/analytics/anomaly-stats");

export const getModelPerformance = () =>
  api.get("/analytics/model-performance");

export const getAnomalyDistribution = () =>
  api.get("/analytics/distribution");


/* =========================================
   ALERTS
========================================= */

export const getAlerts = () =>
  api.get("/alerts");

export const acknowledgeAlert = (id) =>
  api.put(`/alerts/${id}/acknowledge`);


/* =========================================
   AI MODEL CONTROL
========================================= */

export const retrainModel = () =>
  api.post("/model/retrain");

export const getModelInfo = () =>
  api.get("/model/info");

export const getModelDrift = () =>
  api.get("/model/drift");


/* =========================================
   REPORTS
========================================= */

export const generateReport = (type) =>
  api.get(`/reports/generate?type=${type}`);

export const downloadReport = (id) =>
  api.get(`/reports/download/${id}`, {
    responseType: "blob",
  });


/* =========================================
   HEALTH CHECK & SIMULATOR
========================================= */

export const healthCheck = () =>
  api.get("/health");

export const toggleSimulation = () =>
  api.post("/simulation/toggle");

export const getSimulationStatus = () =>
  api.get("/simulation/status");
