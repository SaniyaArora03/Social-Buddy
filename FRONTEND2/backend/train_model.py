# train_model.py
# Train a simple Linear Regression difficulty predictor and save the pipeline.
import os
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import joblib

os.makedirs('model', exist_ok=True)

def generate_synthetic_row():
    # generate realistic synthetic features
    recent_acc = float(np.clip(np.random.beta(2,2), 0, 1))
    global_acc = float(np.clip(np.random.beta(2,2), 0, 1))
    avg_rt = float(np.clip(np.random.normal(loc=4.0, scale=1.5), 0.5, 10.0))
    recent_rt = float(np.clip(np.random.normal(loc=3.5, scale=1.2), 0.3, 8.0))
    wrong_streak = int(np.random.poisson(0.6))
    stress = float(np.clip(np.random.beta(1.5,4.0), 0, 1))
    last_diff = float(np.clip(np.random.rand(), 0,1))

    # heuristic target: higher accuracy -> higher difficulty; higher stress/wrong streak/slow RT -> lower
    score = 0.4*recent_acc + 0.25*global_acc - 0.12*(avg_rt/6.0) - 0.2*(wrong_streak / 5.0) - 0.25*stress + 0.08*last_diff
    score = float(np.clip(score + np.random.normal(scale=0.07), 0, 1))
    return {
        'recent_acc': recent_acc,
        'global_acc': global_acc,
        'avg_rt': avg_rt,
        'recent_rt': recent_rt,
        'wrong_streak': wrong_streak,
        'stress': stress,
        'last_diff': last_diff,
        'difficulty_score': score
    }

def build_dataset(n=8000):
    rows = [generate_synthetic_row() for _ in range(n)]
    return pd.DataFrame(rows)

def train_and_save():
    print("Generating synthetic dataset...")
    df = build_dataset(8000)
    FEATURES = ['recent_acc','global_acc','avg_rt','recent_rt','wrong_streak','stress','last_diff']
    TARGET = 'difficulty_score'
    X = df[FEATURES]
    y = df[TARGET]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)

    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('lr', LinearRegression())
    ])

    print("Training pipeline...")
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    y_pred = np.clip(y_pred, 0.0, 1.0)
    rmse = mean_squared_error(y_test, y_pred, squared=False)
    print(f"Test RMSE: {rmse:.4f}")
    print(f"Train R2: {pipeline.score(X_train, y_train):.4f}  Test R2: {pipeline.score(X_test, y_test):.4f}")

    out_path = 'model/difficulty_pipeline.joblib'
    joblib.dump(pipeline, out_path)
    print(f"Saved pipeline to {out_path}")

if __name__ == '__main__':
    train_and_save()
