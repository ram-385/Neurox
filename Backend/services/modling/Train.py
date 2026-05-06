import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import ( accuracy_score,precision_score,recall_score, f1_score,mean_squared_error,mean_absolute_error,r2_score)
from ..Dataset import get_dataset
from .models import MODEL_REGISTRY


def generate_decision_boundary(model, X, y, f1, f2):

    x_min, x_max = X[f1].min() - 1, X[f1].max() + 1
    y_min, y_max = X[f2].min() - 1, X[f2].max() + 1

    xx, yy = np.meshgrid(
        np.linspace(x_min, x_max, 100),
        np.linspace(y_min, y_max, 100)
    )

    grid = np.c_[xx.ravel(), yy.ravel()]

    Z = model.predict(grid)
    Z = Z.reshape(xx.shape)

    return {
        "xx": xx.tolist(),
        "yy": yy.tolist(),
        "Z": Z.tolist(),
        "points": {
            "x": X[f1].tolist(),
            "y": X[f2].tolist(),
            "labels": y.tolist()
        }
    }


def train_model(req):
    dataset_id = req.dataset_id
    df = get_dataset(dataset_id)

    
    if hasattr(req, "features") and req.features:
        X = df[req.features]
    else:
        X = df.drop(columns=[req.target])

    y = df[req.target]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=req.test_size,
        random_state=42
    )

   
    model_handler = MODEL_REGISTRY.get(req.model)
    if not model_handler:
        raise ValueError("Invalid model")

    model = model_handler.train(X_train, y_train, req.task)
    y_pred = model_handler.predict(model, X_test)


    if req.task == "classification":
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

    
    boundary = None
    if (
        req.task == "classification" and
        hasattr(req, "features") and
        req.features and
        len(req.features) == 2
    ):
        boundary = generate_decision_boundary(
            model,
            X,
            y,
            req.features[0],
            req.features[1]
        )

    return {
        "model": req.model,
        "task": req.task,
        "metrics": metrics,
        "predictions": y_pred.tolist(),
        "feature_importance": importance,
        "decision_boundary": boundary
    }