import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, OrdinalEncoder
from services.Dataset import get_dataset, update_dataset


def apply_encoding(payload: dict):
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

    # Clean column names
    df.columns = df.columns.str.strip()
    columns = [c.strip() for c in columns]

    # Validate columns
    for col in columns:
        if col not in df.columns:
            return {"error": f"Column '{col}' not found"}

    try:
       
        if operation == "label":
            col = columns[0]  # single column only
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))

    
        elif operation == "one_hot":
            enc = OneHotEncoder(
                drop="first",
                sparse_output=False,
                handle_unknown="ignore"  #  prevents crash
            )

            encoded = enc.fit_transform(df[columns].astype(str))
            new_cols = enc.get_feature_names_out(columns)

            encoded_df = pd.DataFrame(
                encoded,
                columns=new_cols,
                index=df.index
            )

            df = df.drop(columns=columns)
            df = pd.concat([df, encoded_df], axis=1)

        
        elif operation == "ordinal":
            order = params.get("order")

            if not order:
                return {"error": "Order is required for ordinal encoding"}

            col = columns[0]

            enc = OrdinalEncoder(categories=[order])
            df[[col]] = enc.fit_transform(df[[col]].astype(str))

        
        elif operation == "frequency":
            for col in columns:
                freq_map = df[col].value_counts().to_dict()
                df[col] = df[col].map(freq_map)

        else:
            return {"error": "Invalid encoding operation"}

        #  Save dataset
        update_dataset(dataset_id, df)

        return {
            "message": f"{operation} encoding applied successfully",
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