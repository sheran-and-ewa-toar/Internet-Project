import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler

def load_dataset(pos_path, neg_path):
    pos_df = pd.read_csv(pos_path)
    neg_df = pd.read_csv(neg_path)

    pos_df["label"] = 1
    neg_df["label"] = 0

    df = pd.concat([pos_df, neg_df], ignore_index=True)

    return df


def prepare_features(
    df,
    feature_columns,
    use_variance=False,
    variance_threshold=0.01,
    use_pearson=False,
    pearson_threshold=0.9
):
    METADATA_COLUMNS = [
    'mirgenedb_id', 'mirbase_id', 'seed', 'chromosome', 'strand',
    'mature_sequence', 'star_sequence', 'mature_arm', 'star_arm',
    'precursor', 'precursor_with_flank',
    'secondary_structure_with_flank',
    'secondary_structure', 'start', 'end', 'dual_mature'
    ]

    df = df.drop(columns=[c for c in METADATA_COLUMNS if c in df.columns], errors="ignore")
    available = [
        col for col in feature_columns
        if col in df.columns
    ]

    X = df[available].copy()

    for col in available:
        X[col] = pd.to_numeric(
            X[col],
            errors="coerce"
        )

    if use_variance:

        variances = X.var()

        keep = variances[
            variances > variance_threshold
        ].index

        X = X[keep]

    if use_pearson:

        corr = X.corr().abs()

        upper = corr.where(
            np.triu(
                np.ones(corr.shape),
                k=1
            ).astype(bool)
        )

        drop_cols = [
            column
            for column in upper.columns
            if any(
                upper[column] > pearson_threshold
            )
        ]

        X = X.drop(
            columns=drop_cols,
            errors="ignore"
        )

    y = df["label"]

    return X, y


def split_and_scale(X, y):

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        stratify=y,
        random_state=42
    )

    imputer = SimpleImputer(
        strategy="median"
    )

    X_train = imputer.fit_transform(
        X_train
    )

    X_test = imputer.transform(
        X_test
    )

    scaler = StandardScaler()

    X_train = scaler.fit_transform(
        X_train
    )

    X_test = scaler.transform(
        X_test
    )

    return (
        X_train,
        X_test,
        y_train,
        y_test
    )