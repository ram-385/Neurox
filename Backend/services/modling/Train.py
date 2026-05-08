import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    mean_squared_error,
    mean_absolute_error,
    r2_score
)
from ..Dataset import get_dataset
from .models import MODEL_REGISTRY

import os
import json
import uuid
import joblib
import time

MODEL_CACHE = {}
def _train_internal(req):
    dataset_id = req.dataset_id
    df = get_dataset(dataset_id)

    if df is None:
        raise ValueError("Dataset not found")

    if req.target not in df.columns:
        raise ValueError("Target column not found in dataset")

    X = df.drop(columns=[req.target])
    y = df[req.target]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=req.test_size,
        random_state=42
    )

    model_handler = MODEL_REGISTRY.get(req.model)
    if not model_handler:
        raise ValueError("Invalid model")

    start_time = time.time()
    model = model_handler.train(X_train, y_train, req.task)
    training_time = time.time() - start_time

    y_pred = model_handler.predict(model, X_test)

    if req.task == "Classification":
        metrics = {
            "Accuracy": float(accuracy_score(y_test, y_pred)),
            "Precision": float(precision_score(y_test, y_pred, average="weighted", zero_division=0)),
            "Recall": float(recall_score(y_test, y_pred, average="weighted", zero_division=0)),
            "F1-Score": float(f1_score(y_test, y_pred, average="weighted", zero_division=0))
        }
    else:
        mse = mean_squared_error(y_test, y_pred)
        metrics = {
            "MAE": float(mean_absolute_error(y_test, y_pred)),
            "MSE": float(mse),
            "RMSE": float(mse ** 0.5),
            "R2Score": float(r2_score(y_test, y_pred))
        }

    importance = model_handler.feature_importance(model, X.columns)

    return {
        "model": req.model,
        "task": req.task,
        "metrics": metrics,
        "predictions": y_pred.tolist(),
        "feature_importance": importance,
        "training_time": round(training_time, 4),
        "model_obj": model,
        "feature_columns": X.columns.tolist()
    }



def train_model(req):
    result = _train_internal(req)

    cache_id = str(uuid.uuid4())
    MODEL_CACHE[cache_id] = result["model_obj"]

    return {
        "model_id": cache_id,
        "model": req.model,
        "task": req.task,
        "metrics": result["metrics"],
        "predictions": result["predictions"],
        "feature_importance": result["feature_importance"],
        "training_time": result["training_time"],
        "message": "Model trained successfully."
    }

def save_model(req):
    model = MODEL_CACHE.get(req.model_id)
    if model is None:
        raise ValueError("Model not found or expired")
    model_id = str(uuid.uuid4())
    os.makedirs("saved_models", exist_ok=True)
    model_path = f"saved_models/{model_id}.pkl"
    joblib.dump(model, model_path)
    metadata = {
        "model_id": model_id,
        "source_model_id": req.model_id,
    }
    with open(f"saved_models/{model_id}.json", "w") as f:
        json.dump(metadata, f)
    return {
        "message": "Model saved successfully",
        "model_id": model_id
    }

# get performance
def performance(req):
    dataset_id = req.dataset_id
    df = get_dataset(dataset_id)

    if df is None:
        raise ValueError("Dataset not found")

    if req.target not in df.columns:
        raise ValueError("Target column not found in dataset")

    X = df.drop(columns=[req.target])
    y = df[req.target]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=req.test_size,
        random_state=42
    )

    performance_list = []

    for model_name, model_handler in MODEL_REGISTRY.items():
        try:
            model = model_handler.train(X_train, y_train, req.task)
            y_pred = model_handler.predict(model, X_test)

            if req.task == "Classification":
                score = float(accuracy_score(y_test, y_pred))
                metric_name = "Accuracy"
            else:
                score = float(r2_score(y_test, y_pred))
                metric_name = "R2Score"

            performance_list.append({
                "model": model_name,
                "metric": metric_name,
                "score": score
            })

        except Exception as e:
            performance_list.append({
                "model": model_name,
                "metric": "Error",
                "score": str(e)
            })

    return {
        "task": req.task,
        "performance": performance_list,
        "message":'peformance  meauserd'
    }