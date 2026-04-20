import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib
import os

# Create sample log dataset (for demo)
data = {
    "log_length": [120, 130, 110, 115, 500, 125, 118, 600, 122, 119],
    "error_count": [0, 1, 0, 0, 5, 0, 0, 6, 0, 0],
    "warning_count": [1, 0, 1, 0, 3, 1, 0, 4, 0, 1],
    "response_time": [200, 210, 190, 205, 900, 195, 198, 950, 202, 200]
}

df = pd.DataFrame(data)

X = df[["log_length", "error_count", "warning_count", "response_time"]]

# Train model
model = IsolationForest(contamination=0.2, random_state=42)
model.fit(X)

# Save model
os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/iso_model.pkl")

print("✅ Model trained and saved as models/iso_model.pkl")
