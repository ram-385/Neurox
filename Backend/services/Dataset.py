import pandas as pd

DATASETS = {}

def save_dataset(dataset_id: str, df: pd.DataFrame):
    DATASETS[dataset_id] = df


def get_dataset(dataset_id: str):
    df = DATASETS.get(dataset_id)

    if df is None:
        raise ValueError("Dataset not found")
    df.columns = df.columns.str.strip()
    return df


def update_dataset(dataset_id: str, df: pd.DataFrame):
    df.columns = df.columns.str.strip()
    DATASETS[dataset_id] = df