


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import joblib
import numpy as np
import tensorflow as tf
import os

# -----------------------------------------
# CREATE FASTAPI APP
# -----------------------------------------
app = FastAPI(title="AI Log Anomaly Detection API")

# -----------------------------------------
# CORS CONFIGURATION (REACT FRONTEND)
# -----------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------
# LOAD MODELS
# -----------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

ISO_MODEL_PATH = os.path.join(MODEL_DIR, "iso_model.pkl")
AE_MODEL_PATH = os.path.join(MODEL_DIR, "autoencoder.h5")

# Load Isolation Forest and Autoencoder
iso = joblib.load(ISO_MODEL_PATH)
autoencoder = tf.keras.models.load_model(AE_MODEL_PATH, compile=False)

# -----------------------------------------
# ROOT ROUTE
# -----------------------------------------
@app.get("/")
def home():
    return {"status": "Backend Running Successfully"}

# -----------------------------------------
# PREDICT ROUTE
# -----------------------------------------
@app.post("/predict")
async def predict(data: dict):
    try:
        # Extract values safely
        cpu = float(data.get("cpu", 0))
        memory = float(data.get("memory", 0))
        disk = float(data.get("disk", 0))
        network = float(data.get("network", 0))

        # Convert to numpy array
        features = np.array([cpu, memory, disk, network], dtype=np.float32).reshape(1, -1)

        # Isolation Forest
        iso_score = iso.decision_function(features)[0]

        # Autoencoder reconstruction loss
        recon = autoencoder.predict(features, verbose=0)
        loss = np.mean((features - recon) ** 2)

        # Risk fusion
        risk = (0.6 * min(loss / 0.1, 1) + 0.4 * ((iso_score + 1) / 2)) * 100

        # Heuristic Safety Net
        if cpu > 85 or memory > 85 or disk > 90 or network > 800:
            risk = max(risk, 85.0 + min((cpu - 85) if cpu > 85 else 0, 15))

        # Determine status
        status = "NORMAL"
        if risk > 70:
            status = "CRITICAL"
        elif risk > 40:
            status = "WARNING"

        return JSONResponse(content={
            "risk": round(float(risk), 2),
            "status": status,
            "iso_score": round(float(iso_score), 4),
            "reconstruction_loss": round(float(loss), 6)
        })

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# -----------------------------------------
# DASHBOARD METRICS ROUTE
# -----------------------------------------
@app.get("/dashboard/metrics")
def get_dashboard_metrics():
    # Dummy metrics for frontend dashboard
    return {
        "riskScore": 34,
        "status": "Healthy",
        "anomalyCount": 156,
        "normalCount": 12344,
        "criticalEvents": 3,
        "confidence": 91,
        "cpu": 45,
        "memory": 6.2,
        "network": 1.2
    }

# -----------------------------------------
# RECENT ACTIVITIES ROUTE
# -----------------------------------------
@app.get("/dashboard/recent-activities")
def get_recent_activities():
    return [
        {"id": 1, "event": "High CPU detected", "time": "2 min ago", "severity": "warning"},
        {"id": 2, "event": "Memory leak fixed", "time": "15 min ago", "severity": "success"},
        {"id": 3, "event": "Network anomaly", "time": "1 hour ago", "severity": "critical"},
        {"id": 4, "event": "System optimized", "time": "3 hours ago", "severity": "info"},
    ]

