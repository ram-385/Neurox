import pandas as pd
import io

# common CSV separators
SEPARATORS = [",", ";", "\t", "|", ":"]

def try_read_csv(file_bytes):
    text = file_bytes.decode("utf-8")

    for sep in SEPARATORS:
        try:
            df = pd.read_csv(io.StringIO(text), sep=sep)

            #  valid CSV should have more than 1 column
            if df.shape[1] > 1:
                return df

        except Exception:
            continue

    raise ValueError("Could not detect CSV separator")


def read_file(file_bytes: bytes, filename: str):

    # CSV
    if filename.endswith(".csv"):
        return try_read_csv(file_bytes)

    # Excel
    elif filename.endswith(".xlsx"):
        return pd.read_excel(io.BytesIO(file_bytes))

    # JSON
    elif filename.endswith(".json"):
        return pd.read_json(io.StringIO(file_bytes.decode("utf-8")))

    # XML
    elif filename.endswith(".xml"):
        return pd.read_xml(io.StringIO(file_bytes.decode("utf-8")))

    else:
        raise ValueError("Unsupported file format")