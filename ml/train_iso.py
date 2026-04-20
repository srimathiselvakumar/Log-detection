import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

X = pd.read_csv("../data/features.csv")

iso = IsolationForest(n_estimators=150, contamination=0.05, random_state=42)
iso.fit(X)

joblib.dump(iso, "../models/iso_model.pkl")
