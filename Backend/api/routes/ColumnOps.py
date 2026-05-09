from fastapi import APIRouter
from pydantic import BaseModel
from services.Dataset import get_dataset, update_dataset
import numpy as np
import pandas as pd

router = APIRouter()

#Schema
class DeleteColumnRequest(BaseModel):
    dataset_id: str
    column_name: str


class RenameColumnRequest(BaseModel):
    dataset_id: str
    old_name: str
    new_name: str


class ColumnRequest(BaseModel):
    dataset_id: str
    column: str


class FillNARequest(BaseModel):
    dataset_id: str
    column: str
    strategy: str = "mean"


class StatsRequest(BaseModel):
    dataset_id: str
    column: str
    operation: str


class PreviewRequest(BaseModel):
    dataset_id: str
    operation: str

class FilterRequest(BaseModel):
    dataset_id: str
    column: str
    operator: str
    value: str


class SortRequest(BaseModel):
    dataset_id: str
    column: str
    order: str = "asc"   # asc / desc


class GroupByRequest(BaseModel):
    dataset_id: str
    group_column: str
    agg_column: str
    operation: str

def format_response(df):
    return {
        "columns": [
            {
                "name": col,
                "type": str(df[col].dtype)
            }
            for col in df.columns
        ],
        "data": df.replace({np.nan: None}).to_dict(orient="records")
    }

# Delete Column
@router.post('/delete_column')
async def delete_column(req: DeleteColumnRequest):

    df = get_dataset(req.dataset_id)

    if df is None:
        return {"error": "Dataset not found"}

    if req.column_name not in df.columns:
        return {"error": "Column not found"}

    df = df.drop(columns=[req.column_name])
    update_dataset(req.dataset_id, df)

    return {
        "message": "Column deleted",
        **format_response(df)
    }

# Rename column
@router.post("/rename-column")
async def rename_column(req: RenameColumnRequest):

    df = get_dataset(req.dataset_id)

    if df is None:
        return {"error": "Dataset not found"}

    if req.old_name not in df.columns:
        return {"error": "Column not found"}

    if req.new_name in df.columns:
        return {"error": "New column name already exists"}

    df = df.rename(columns={req.old_name: req.new_name})
    update_dataset(req.dataset_id, df)

    return {
        "message": "Column renamed",
        **format_response(df)
    }

# Drop rows with missing values
@router.post("/drop-na")
async def drop_na(req: ColumnRequest):

    df = get_dataset(req.dataset_id)

    if df is None:
        return {"error": "Dataset not found"}

    if req.column not in df.columns:
        return {"error": "Column not found"}

    df = df.dropna(subset=[req.column])
    update_dataset(req.dataset_id, df)

    return {
        "message": "Rows with null values are removed ",
        **format_response(df)
    }


# Remove Duplicate Rows 
@router.post("/delete-duplicates-column")
async def delete_duplicates_column(req: ColumnRequest):

    df = get_dataset(req.dataset_id)

    if df is None:
        return {"error": "Dataset not found"}

    if req.column not in df.columns:
        return {"error": "Column not found"}

    df = df.drop_duplicates(subset=[req.column])
    update_dataset(req.dataset_id, df)

    return {
        "message": "Rows with duplicate values are removed",
        **format_response(df)
    }

# Fill missing Values
@router.post("/fill-na")
async def fill_na(req: FillNARequest):

    try:
        df = get_dataset(req.dataset_id)

        if df is None:
            return {"error": "Dataset not found"}

        if req.column not in df.columns:
            return {"error": "Column not found"}

        col = df[req.column]

       
        if req.strategy in ["mean", "median"]:
            if not pd.api.types.is_numeric_dtype(col):
                return {"error": f"{req.strategy} can only be applied to numeric columns"}

        if req.strategy == "mean":
            df[req.column] = col.fillna(col.mean())

        elif req.strategy == "median":
            df[req.column] = col.fillna(col.median())

        elif req.strategy == "mode":
            df[req.column] = col.fillna(col.mode()[0])

        else:
            return {"error": "Invalid strategy"}

        update_dataset(req.dataset_id, df)

        return {
            "message": "NA filled",
            **format_response(df)
        }

    except Exception as e:
        return {"error": str(e)}



# Statistics of the column
@router.post("/column-stats")
async def column_stats(req: StatsRequest):

    try:
        df = get_dataset(req.dataset_id)

        if df is None:
            return {"error": "Dataset not found"}

        if req.column not in df.columns:
            return {"error": "Column not found"}

        col = df[req.column]

        if req.operation in ["mean", "median", "std"]:
            if not pd.api.types.is_numeric_dtype(col):
                return {"error": f"{req.operation} only works on numeric columns"}

        if req.operation == "mean":
            result = col.mean()

        elif req.operation == "median":
            result = col.median()

        elif req.operation == "mode":
            result = col.mode()[0]

        elif req.operation == "min":
            result = col.min()

        elif req.operation == "max":
            result = col.max()

        elif req.operation == "std":
            result = col.std()

        elif req.operation == "unique":
            result = col.nunique()

        elif req.operation == "valueCount":
            result = col.value_counts().to_dict()
        elif req.operation == 'nullCount':
             result = col.isnull().sum()

        else:
            return {"error": "Invalid operation"}

       
        if isinstance(result, float) and np.isnan(result):
            result = None
        if isinstance(result, (np.integer, np.int64)):
             result = int(result)
        elif isinstance(result, (np.floating, np.float64)):
               result = float(result)

        return {
            "type": "stat",
            "result": result
        }

    except Exception as e:
        return {"error": str(e)}


#Preview Operation
@router.post("/preview-operation")
async def preview_operation(req: PreviewRequest):

    df = get_dataset(req.dataset_id)

    if df is None:
        return {"error": "Dataset not found"}

    if req.operation == "head":
        result = df.head(10)

    elif req.operation == "tail":
        result = df.tail(10)

    elif req.operation == "sample":
        result = df.sample(10)

    else:
        return {"error": "Invalid operation"}

    return {
        "type": "table",
        "columns": [
            {
                "name": col,
                "type": str(df[col].dtype)
            }
            for col in df.columns
        ],
        "data": result.replace({np.nan: None}).to_dict(orient="records")
    }

# Filter Dataset
@router.post("/filter")
async def filter_data(req: FilterRequest):

    df = get_dataset(req.dataset_id)

    if df is None:
        return {"error": "Dataset not found"}

    if req.column not in df.columns:
        return {"error": "Column not found"}

    try:
        col = df[req.column]

        
        if pd.api.types.is_numeric_dtype(col):
            value = float(req.value)
        else:
            value = req.value

        if req.operator == "==":
            result = df[col == value]

        elif req.operator == "!=":
            result = df[col != value]

        elif req.operator == ">":
            result = df[col > value]

        elif req.operator == "<":
            result = df[col < value]

        elif req.operator == ">=":
            result = df[col >= value]

        elif req.operator == "<=":
            result = df[col <= value]

        else:
            return {"error": "Invalid operator"}


        return {
            "message": "Filter applied",
            **format_response(result)
        }

    except Exception as e:
        return {"error": str(e)}
    


# Sort dataset    
@router.post("/sort")
async def sort_data(req: SortRequest):

    df = get_dataset(req.dataset_id)

    if df is None:
        return {"error": "Dataset not found"}

    if req.column not in df.columns:
        return {"error": "Column not found"}

    try:
        ascending = True if req.order == "asc" else False

        result = df.sort_values(by=req.column, ascending=ascending)

        update_dataset(req.dataset_id, result)

        return {
            "message": "Sorted successfully",
            **format_response(result)
        }

    except Exception as e:
        return {"error": str(e)}
    
# Group dataset
@router.post("/groupby")
async def groupby_data(req: GroupByRequest):

    df = get_dataset(req.dataset_id)

    if df is None:
        return {"error": "Dataset not found"}

    if req.group_column not in df.columns or req.agg_column not in df.columns:
        return {"error": "Column not found"}

    try:
        grouped = df.groupby(req.group_column)[req.agg_column]

        if req.operation == "mean":
            result = grouped.mean()

        elif req.operation == "sum":
            result = grouped.sum()

        elif req.operation == "count":
            result = grouped.count()

        elif req.operation == "max":
            result = grouped.max()

        elif req.operation == "min":
            result = grouped.min()

        else:
            return {"error": "Invalid operation"}

        result = result.reset_index()

        update_dataset(req.dataset_id, result)

        return {
            "message": "GroupBy applied",
            **format_response(result)
        }

    except Exception as e:
        return {"error": str(e)}