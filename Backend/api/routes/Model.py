from fastapi import APIRouter
from services.modling.Train import train_model
from typing import  Optional,Annotated
from pydantic import BaseModel, Field


class TrainRequest(BaseModel):
    dataset_id: Annotated[str, Field(..., description="ID of the dataset to be used for training")] 
    target: Annotated[str, Field(..., description="Name of the target variable in the dataset")]
    model: Optional[str] = None
    task: Annotated[str, Field(..., description="Type of task (classification or regression)")]
    test_size: Annotated[float, Field(..., description="Proportion of the dataset to include in the test split")]


router = APIRouter()

@router.post("/train")
def train_route(payload: TrainRequest):
    """
    payload = {
        "dataset_id": "string",
        "target": "string",
        "model": "string",
        "task": "classification | regression",
        "test_size": float
    }"""
    return train_model(payload)