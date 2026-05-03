import pandas as pd

DATASETS = {}

def save_dataset(dataset_id: str, df: pd.DataFrame):
    DATASETS[dataset_id] = df

def get_dataset(dataset_id: str):
     df =  DATASETS.get(dataset_id)
     if df is None:
         raise ValueError('Dataset not found')
     return df

def update_dataset(dataset_id: str, df: pd.DataFrame):
    DATASETS[dataset_id] = df