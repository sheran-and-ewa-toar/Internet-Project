from xgboost import XGBClassifier

from sklearn.model_selection import cross_val_score

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)


def train_xgb(
    X_train,
    X_test,
    y_train,
    y_test
):

    scale_pos_weight = (
        len(y_train[y_train == 0]) /
        len(y_train[y_train == 1])
    )

    model = XGBClassifier(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="binary:logistic",
        eval_metric="logloss",
        random_state=42,
        scale_pos_weight=scale_pos_weight
    )

    model.fit(
        X_train,
        y_train
    )

    predictions = model.predict(
        X_test
    )

    cv_scores = cross_val_score(
        model,
        X_train,
        y_train,
        cv=5,
        scoring="f1"
    )

    return {
        "accuracy": float(
            accuracy_score(
                y_test,
                predictions
            )
        ),
        "precision": float(
            precision_score(
                y_test,
                predictions
            )
        ),
        "recall": float(
            recall_score(
                y_test,
                predictions
            )
        ),
        "f1Score": float(
            f1_score(
                y_test,
                predictions
            )
        ),
        "cv_mean": float(
            cv_scores.mean()
        ),
        "cv_std": float(
            cv_scores.std()
        )
    }