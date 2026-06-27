from sklearn.ensemble import RandomForestClassifier

from sklearn.model_selection import cross_val_score

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)


def train_rf(
    X_train,
    X_test,
    y_train,
    y_test
):
    print("-> Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,
        random_state=42,
        class_weight="balanced"
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

    print("-> Random Forest model training completed.")
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