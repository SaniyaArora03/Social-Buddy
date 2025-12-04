from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import numpy as np
import pandas as pd
from datetime import datetime
import base64
from io import BytesIO
from PIL import Image
import cv2

app = Flask(__name__)
CORS(app)

MODEL_PATH = 'model/difficulty_pipeline.joblib'
LOG_CSV = 'model/prediction_logs.csv'

# Load ML model
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found: {MODEL_PATH}")

model = joblib.load(MODEL_PATH)

FEATURES = ['recent_acc','global_acc','avg_rt','recent_rt','wrong_streak','stress','last_diff']


# --------------------------
# Utility to log data
# --------------------------
def append_log(row):
    df = pd.DataFrame([row])
    if os.path.exists(LOG_CSV):
        old = pd.read_csv(LOG_CSV)
        df = pd.concat([old, df], ignore_index=True)
    df.to_csv(LOG_CSV, index=False)


# --------------------------
# DIFFICULTY PREDICT ENDPOINT
# --------------------------
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)
    
    try:
        x = [float(data[f]) for f in FEATURES]
    except:
        return jsonify({"error": "Invalid input"}), 400
    
    X = np.array([x])
    pred = float(np.clip(model.predict(X)[0], 0, 1))

    log = {f: float(data[f]) for f in FEATURES}
    log["predicted_difficulty"] = pred
    log["timestamp"] = datetime.utcnow().isoformat()
    append_log(log)

    return jsonify({"difficulty": pred})


# --------------------------
# LOG OUTCOME ENDPOINT
# --------------------------
@app.route("/log", methods=["POST"])
def log_outcome():
    data = request.get_json(force=True)
    data["timestamp"] = datetime.utcnow().isoformat()
    append_log(data)
    return jsonify({"ok": True})


# --------------------------
# STRESS DETECTION (OpenCV only!)
# --------------------------
@app.route("/detect_stress", methods=["POST"])
def detect_stress():
    """
    Input:
      { "image_base64": "data:image/png;base64,..." }

    Output:
      { "stress": 0.0 - 1.0 }
    """

    data = request.get_json(force=True)
    img_b64 = data.get("image_base64", "")

    if img_b64.startswith("data:image"):
        img_b64 = img_b64.split(",", 1)[1]

    try:
        img_bytes = base64.b64decode(img_b64)
        img = Image.open(BytesIO(img_bytes)).convert("RGB")
        frame = np.array(img)

        gray = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)

        face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )
        faces = face_cascade.detectMultiScale(gray, 1.25, 4)

        if len(faces) == 0:
            return jsonify({"stress": 0.0})

        # First detected face
        x, y, w, h = faces[0]
        face = gray[y:y+h, x:x+w]

        # simple stress measure based on pixel intensity variance
        stress_raw = np.std(face) / 100
        stress = float(np.clip(stress_raw, 0.0, 1.0))

        return jsonify({"stress": stress})

    except Exception as e:
        return jsonify({"stress": 0.0, "error": str(e)})


# --------------------------
# RUN APP
# --------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
