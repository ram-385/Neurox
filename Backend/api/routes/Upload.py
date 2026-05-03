from fastapi import APIRouter, UploadFile, File
import uuid
import numpy as np

from utils.file_handler import read_file
from services.Dataset import save_dataset

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    
    # read file
    content = await file.read()

    # convert to DataFrame
    df = read_file(content, file.filename)

    # generate dataset id
    dataset_id = str(uuid.uuid4())

    # store dataset
    save_dataset(dataset_id, df)
    
    data = df.replace({np.nan: None}).to_dict("records")
    return {
        "dataset_id": dataset_id,
        "columns": [
            {
                "name": col,
                "type": str(df[col].dtype)
            }
            for col in df.columns
        ],
        "Data": data
    }