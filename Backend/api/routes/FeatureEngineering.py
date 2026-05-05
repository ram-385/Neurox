from fastapi import APIRouter

from services.feature_engineering.Encoding import apply_encoding
from services.feature_engineering.Scaling import apply_scaling
from services.feature_engineering.Transforms import apply_transformation
from services.feature_engineering.Creation import apply_feature_creation
from services.feature_engineering.Outliers import apply_outlier_removal, apply_outlier_capping

router = APIRouter(prefix="/feature-engineering", tags=["Feature Engineering"])


@router.post("/FeatureEngineering")
def feature_engineering_route(payload: dict):
    """
    payload = {
        "type": "encoding | scaling | transformation | feature_creation | outlier_removal | outlier_capping",
        ...rest payload
    }
    """

    operation_type = payload.get("type")

    if not operation_type:
        return {"error": "type is required"}

    try:
        if operation_type == "encoding":
            return apply_encoding(payload)

        elif operation_type == "scaling":
            return apply_scaling(payload)

        elif operation_type == "feature_transformation":
            return apply_transformation(payload)

        elif operation_type == "feature_creation":
            return apply_feature_creation(payload)

        elif operation_type == "outlier_removal":
            return apply_outlier_removal(payload)

        elif operation_type == "outlier_capping":
            return apply_outlier_capping(payload)

        else:
            return {"error": "Invalid feature engineering type"}

    except Exception as e:
        return {"error": str(e)}