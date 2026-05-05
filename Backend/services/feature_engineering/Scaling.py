import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler, MaxAbsScaler
from services.Dataset import get_dataset, update_dataset


def apply_scaling(payload: dict):
    dataset_id = payload.get("dataset_id")
    operation = payload.get("operation")
    columns = payload.get("columns", [])

    # Load dataset
    df = get_dataset(dataset_id)

    if df is None or df.empty:
        return {"error": "Dataset not found or empty"}

    if not columns:
        return {"error": "No columns provided"}

   
    df.columns = df.columns.str.strip()
    columns = [c.strip() for c in columns]

   
    for col in columns:
        if col not in df.columns:
            return {"error": f"Column '{col}' not found"}

        if not pd.api.types.is_numeric_dtype(df[col]):
            return {"error": f"Column '{col}' must be numeric"}

    try:
        scaler_map = {
            "standard": StandardScaler(),
            "minmax": MinMaxScaler(),
            "robust": RobustScaler(),
            "maxabs": MaxAbsScaler()
        }

        scaler = scaler_map.get(operation)

        if not scaler:
            return {"error": "Invalid scaling operation"}

        
        scaled_values = scaler.fit_transform(df[columns])
        df.loc[:, columns] = scaled_values

        
        update_dataset(dataset_id, df)

        return {
            "message": f"{operation} scaling applied successfully",
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