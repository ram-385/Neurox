import pandas as pd
import numpy as np
from services.Dataset import get_dataset, update_dataset


def apply_feature_creation(payload: dict):
    dataset_id = payload.get("dataset_id")
    operation = payload.get("operation")
    columns = payload.get("columns", [])
    new_column = payload.get("new_column")
    params = payload.get("params", {})

    # Load dataset
    df = get_dataset(dataset_id)

    if df is None or df.empty:
        return {"error": "Dataset not found or empty"}

    if not columns:
        return {"error": "No columns provided"}

    
    df.columns = df.columns.str.strip()
    columns = [c.strip() for c in columns]

    # Validate columns
    for col in columns:
        if col not in df.columns:
            return {"error": f"Column '{col}' not found"}

    try:
       
        if operation == "math":
            if not new_column:
                return {"error": "new_column is required for math operation"}

            df = math_features(df, columns, new_column, params)

       
        elif operation == "binning":
            if not new_column:
                return {"error": "new_column is required for binning"}

            df = binning_feature(df, columns[0], new_column, params)

       
        elif operation == "datetime":
            df = datetime_features(df, columns[0], params)

       
        elif operation == "interaction":
            if not new_column:
                return {"error": "new_column is required for interaction"}

            df = interaction_feature(df, columns, new_column)

        else:
            return {"error": "Invalid feature creation operation"}

        #  Save dataset
        update_dataset(dataset_id, df)

        return {
            "message": f"{operation} feature created successfully",
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



def math_features(df, columns, new_column, params):
    op_type = params.get("type")

    if len(columns) != 2:
        raise ValueError("Math operation needs exactly 2 columns")

    c1, c2 = columns

    
    if not pd.api.types.is_numeric_dtype(df[c1]) or not pd.api.types.is_numeric_dtype(df[c2]):
        raise ValueError("Math operations require numeric columns")

    if op_type == "add":
        df[new_column] = df[c1] + df[c2]

    elif op_type == "subtract":
        df[new_column] = df[c1] - df[c2]

    elif op_type == "multiply":
        df[new_column] = df[c1] * df[c2]

    elif op_type == "divide":
        if (df[c2] == 0).any():
            raise ValueError("Division by zero detected")
        df[new_column] = df[c1] / df[c2]

    else:
        raise ValueError("Invalid math operation")

    return df


def binning_feature(df, column, new_column, params):
    bins = params.get("bins")
    labels = params.get("labels")

    if not bins or not labels:
        raise ValueError("bins and labels are required")

    if len(labels) != len(bins) - 1:
        raise ValueError("labels must be one less than bins")

    df[new_column] = pd.cut(df[column], bins=bins, labels=labels)
    return df


def datetime_features(df, column, params):
   
    df[column] = pd.to_datetime(df[column], errors="coerce")

    extract = params.get("extract", [])

    if "year" in extract:
        df[f"{column}_year"] = df[column].dt.year

    if "month" in extract:
        df[f"{column}_month"] = df[column].dt.month

    if "day" in extract:
        df[f"{column}_day"] = df[column].dt.day

    return df


def interaction_feature(df, columns, new_column):
    if len(columns) != 2:
        raise ValueError("Interaction needs exactly 2 columns")

    c1, c2 = columns

    if not pd.api.types.is_numeric_dtype(df[c1]) or not pd.api.types.is_numeric_dtype(df[c2]):
        raise ValueError("Interaction requires numeric columns")

    df[new_column] = df[c1] * df[c2]

    return df