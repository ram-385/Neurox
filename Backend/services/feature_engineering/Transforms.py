import pandas as pd
import numpy as np
from scipy.stats import boxcox
from sklearn.preprocessing import PowerTransformer
from services.Dataset import get_dataset, update_dataset


def apply_transformation(payload: dict):
    dataset_id = payload.get("dataset_id")
    operation = payload.get("operation")
    columns = payload.get("columns", [])
    params = payload.get("params", {})

    # Load dataset
    df = get_dataset(dataset_id)

    if df is None or df.empty:
        return {"error": "Dataset not found or empty"}

    if not columns:
        return {"error": "No columns provided"}

    #  normalize columns
    columns = [col.strip() for col in columns]
    df.columns = df.columns.str.strip()

    # Validate columns
    for col in columns:
        if col not in df.columns:
            return {"error": f"Column '{col}' not found"}

        if not pd.api.types.is_numeric_dtype(df[col]):
            return {"error": f"Column '{col}' must be numeric"}

    try:
        if operation == "log":
            df = log_transform(df, columns)

        elif operation == "sqrt":
            df = sqrt_transform(df, columns)

        elif operation == "power":
            power = params.get("power", 2)
            df = power_transform(df, columns, power)

        elif operation == "reciprocal":
            df = reciprocal_transform(df, columns)

        elif operation == "boxcox":
            df = boxcox_transform(df, columns)

        elif operation == "yeojohnson":
            df = yeojohnson_transform(df, columns)

        elif operation == "exponential":
            df = exponential_transform(df, columns)

        elif operation == "clip":
            df = clip_transform(df, columns, params)

        else:
            return {"error": "Invalid transformation operation"}

        # Save updated dataset
        update_dataset(dataset_id, df)

        return {
            "message": f"{operation} transformation applied successfully",
           "columns": [
            {
                "name": col,
                "type": str(df[col].dtype)
            }
            for col in df.columns
        ],
        "data": df.replace({np.nan: None}).to_dict(orient="records")
        }

    except Exception as e:
        return {"error": str(e)}




def log_transform(df: pd.DataFrame, columns: list):
    for col in columns:
        #  safe log
        df[col] = np.log1p(df[col].clip(lower=0))
    return df


def sqrt_transform(df: pd.DataFrame, columns: list):
    for col in columns:
        if (df[col] < 0).any():
            raise ValueError(f"{col} contains negative values")
        df[col] = np.sqrt(df[col])
    return df


def power_transform(df: pd.DataFrame, columns: list, power: float):
    for col in columns:
        df[col] = np.power(df[col], power)
    return df


def reciprocal_transform(df: pd.DataFrame, columns: list):
    for col in columns:
        if (df[col] == 0).any():
            raise ValueError(f"{col} contains zero values")
        df[col] = 1 / df[col]
    return df


def boxcox_transform(df: pd.DataFrame, columns: list):
    for col in columns:
        if (df[col] <= 0).any():
            raise ValueError(f"{col} must be positive for Box-Cox")
        df[col], _ = boxcox(df[col])
    return df


def yeojohnson_transform(df: pd.DataFrame, columns: list):
    transformer = PowerTransformer(method="yeo-johnson")
    df[columns] = transformer.fit_transform(df[columns])
    return df


def exponential_transform(df: pd.DataFrame, columns: list):
    for col in columns:
        df[col] = np.exp(df[col])
    return df


def clip_transform(df: pd.DataFrame, columns: list, params: dict):
    lower = params.get("min")
    upper = params.get("max")

    if lower is None or upper is None:
        raise ValueError("Clip requires 'min' and 'max'")

    for col in columns:
        df[col] = df[col].clip(lower, upper)

    return df