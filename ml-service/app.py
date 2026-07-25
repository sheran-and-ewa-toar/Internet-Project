from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
import requests
import os
import traceback
from feature_sets import FEATURE_SETS

from models.common import (
    load_dataset_from_db,
    prepare_features,
    split_and_scale
)

from models.rf import train_rf
from models.xgb import train_xgb

REACT_APP_BACKEND_URL = os.getenv("REACT_APP_BACKEND_URL", "http://localhost:3000")


class TrainRequest(BaseModel):
    jobId: int
    feature_set: str
    model: str

    variance_enabled: bool = False
    variance_threshold: float = 0.01

    pearson_enabled: bool = False
    pearson_threshold: float = 0.9

    user_id: int
    user_role: str


app = FastAPI()

@app.post("/train")
def train(job: TrainRequest,background_tasks: BackgroundTasks):
    try:
        background_tasks.add_task(run_training_pipeline, job)
        return {
            "success": True,
            "data": {
                "status": "Processing initialized"
            },
            "error": None
        }
    except Exception as e:
        error_details = traceback.format_exc()
        print("TRAINING FAILED:")
        print(error_details)
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "data": None,
                "error": {
                    "message": str(e),
                    "trace": error_details
                }
            }
        )
        
def run_training_pipeline(job):
    try:
        df = load_dataset_from_db()
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
            raise Exception("Unsupported machine learning model configuration choice")

        payload = {
            "status": "completed",
            "accuracy": metrics.get("accuracy"),
            "precision": metrics.get("precision"),
            "recall": metrics.get("recall"),
            "f1Score": metrics.get("f1Score") or metrics.get("f1_score"), # Fallback check for snake_case
            "cv_mean": metrics.get("cv_mean"),
            "cv_std": metrics.get("cv_std"),
            "featureCount": len(X.columns)
        }

        auth_headers = {
        "x-user-id": str(job.user_id),
        "x-user-role": job.user_role
        }
        requests.put(f"{REACT_APP_BACKEND_URL}/api/jobs/{job.jobId}", json=payload, headers=auth_headers)
        
    except Exception as e:
       
        error_details = traceback.format_exc()
        print("TRAINING PROCESS PIPELINE CRASH FAILURE:")
        print(error_details)
        
        requests.put(f"{REACT_APP_BACKEND_URL}/api/jobs/{job.jobId}", json={
            "status": "failed",
            "error": str(e)
        })
       
        requests.put(f"{REACT_APP_BACKEND_URL}/api/jobs/{job.jobId}", json={"status": "failed"})
        error_details = traceback.format_exc()

        print("TRAINING FAILED:")
        print(error_details)