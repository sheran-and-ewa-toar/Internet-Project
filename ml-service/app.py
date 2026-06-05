from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import HTTPException
import traceback

from feature_sets import FEATURE_SETS

from models.common import (
    load_dataset,
    prepare_features,
    split_and_scale
)

from models.rf import train_rf
from models.xgb import train_xgb


class TrainRequest(BaseModel):
    feature_set: str
    model: str

    variance_enabled: bool = False
    variance_threshold: float = 0.01

    pearson_enabled: bool = False
    pearson_threshold: float = 0.9

app = FastAPI()

DATA_POS = "data/positive_dataset.csv"
DATA_NEG = "data/negative_dataset.csv"

@app.post("/train")
def train(job: TrainRequest):
    try:
        df = load_dataset(DATA_POS, DATA_NEG)

        features = FEATURE_SETS[job.feature_set]

        X, y = prepare_features(
            df,
            features,
            use_variance=job.variance_enabled,
            variance_threshold=job.variance_threshold,
            use_pearson=job.pearson_enabled,
            pearson_threshold=job.pearson_threshold
        )

        X_train, X_test, y_train, y_test = split_and_scale(X, y)

        if job.model == "RF":
            metrics = train_rf(X_train, X_test, y_train, y_test)

        elif job.model == "XGB":
            metrics = train_xgb(X_train, X_test, y_train, y_test)

        else:
            raise Exception("Unsupported model")

        return {
            "success": True,
            "metrics": metrics,
            "featureCount": len(X.columns)
        }

    except Exception as e:
        error_details = traceback.format_exc()

        print("TRAINING FAILED:")
        print(error_details)

        raise HTTPException(
            status_code=500,
            detail={
                "message": str(e),
                "trace": error_details
            }
        )