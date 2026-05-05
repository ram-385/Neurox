import pandas as pd
import numpy as np
from scipy import stats
from services.Dataset import get_dataset, update_dataset


def apply_outlier_removal(payload: dict):
    dataset_id = payload.get("dataset_id")
    operation = payload.get("operation")
    columns = payload.get("columns", [])
    params = payload.get("params", {})

    df = get_dataset(dataset_id)

    if df is None or df.empty:
        return {"error": "Dataset not found or empty"}

    if not columns:
        return {"error": "No columns provided"}

    # Clean columns
    df.columns = df.columns.str.strip()
    columns = [col.strip() for col in columns]

    # Validate
    for col in columns:
        if col not in df.columns:
            return {"error": f"Column '{col}' not found"}
        if not pd.api.types.is_numeric_dtype(df[col]):
            return {"error": f"Column '{col}' must be numeric"}

    try:
        if operation == "z_score":
            threshold = params.get("z_threshold", 3)
            df = z_score_outlier_removal(df, columns, threshold)

        elif operation == "iqr":
            multiplier = params.get("iqr_multiplier", 1.5)
            df = iqr_outlier_removal(df, columns, multiplier)

        elif operation == "percentile":
            low = params.get("lower_percentile", 1)
            high = params.get("upper_percentile", 99)
            df = percentile_outlier_removal(df, columns, low, high)

        else:
            return {"error": "Invalid outlier removal operation"}

        #  reset index after row removal
        df = df.reset_index(drop=True)

        update_dataset(dataset_id, df)

        return {
            "message": "Outliers removed successfully",
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




def z_score_outlier_removal(df, columns, threshold):
    #  Compute zscore for all columns together
    z_scores = np.abs(stats.zscore(df[columns], nan_policy='omit'))

    #  Handle single column case
    if len(columns) == 1:
        mask = z_scores < threshold
    else:
        mask = (z_scores < threshold).all(axis=1)

    return df[mask]


def iqr_outlier_removal(df, columns, multiplier):
    mask = pd.Series([True] * len(df))

    for col in columns:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1

        lower = Q1 - multiplier * IQR
        upper = Q3 + multiplier * IQR

        mask &= (df[col] >= lower) & (df[col] <= upper)

    return df[mask]


def percentile_outlier_removal(df, columns, low, high):
    mask = pd.Series([True] * len(df))

    for col in columns:
        lower = df[col].quantile(low / 100)
        upper = df[col].quantile(high / 100)

        mask &= (df[col] >= lower) & (df[col] <= upper)

    return df[mask]



def apply_outlier_capping(payload: dict):
    dataset_id = payload.get("dataset_id")
    operation = payload.get("operation")
    columns = payload.get("columns", [])
    params = payload.get("params", {})

    df = get_dataset(dataset_id)

    if df is None or df.empty:
        return {"error": "Dataset not found or empty"}

    if not columns:
        return {"error": "No columns provided"}

    # Clean columns
    df.columns = df.columns.str.strip()
    columns = [col.strip() for col in columns]

    for col in columns:
        if col not in df.columns:
            return {"error": f"Column '{col}' not found"}
        if not pd.api.types.is_numeric_dtype(df[col]):
            return {"error": f"Column '{col}' must be numeric"}

    try:
        if operation == "z_score":
            threshold = params.get("z_threshold", 3)
            df = z_score_outlier_capping(df, columns, threshold)

        elif operation == "iqr":
            multiplier = params.get("iqr_multiplier", 1.5)
            df = iqr_outlier_capping(df, columns, multiplier)

        elif operation == "percentile":
            low = params.get("lower_percentile", 1)
            high = params.get("upper_percentile", 99)
            df = percentile_outlier_capping(df, columns, low, high)

        else:
            return {"error": "Invalid outlier capping operation"}

        update_dataset(dataset_id, df)

        return {
            "message": "Outliers capped successfully",
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


def z_score_outlier_capping(df, columns, threshold):
    for col in columns:
        mean = df[col].mean()
        std = df[col].std()

        upper = mean + threshold * std
        lower = mean - threshold * std

        df[col] = np.clip(df[col], lower, upper)

    return df


def iqr_outlier_capping(df, columns, multiplier):
    for col in columns:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1

        upper = Q3 + multiplier * IQR
        lower = Q1 - multiplier * IQR

        df[col] = np.clip(df[col], lower, upper)

    return df


def percentile_outlier_capping(df, columns, low, high):
    for col in columns:
        lower = df[col].quantile(low / 100)
        upper = df[col].quantile(high / 100)

        df[col] = np.clip(df[col], lower, upper)

    return df