import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler

import os
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

# 2. Extract database configurations directly from the environment variables
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT', '3306') # Defaults to standard MySQL port
DB_NAME = os.getenv('DB_NAME')

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Build connection pool config for Pandas execution mapping
engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=2,
    pool_recycle=3600
)

def load_dataset_from_db():
    """
    Queries the live MySQL EAV tables and flattens them into a unified wide DataFrame.
    """
    query_mirna = "SELECT id, isPositive FROM MiRnaData;"
    df_mirna = pd.read_sql(query_mirna, con=engine)
    
    query_features = "SELECT mirnaId, featureName, featureValue FROM MiRnaFeatureValue;"
    df_features = pd.read_sql(query_features, con=engine)
    
    df_pivoted = df_features.pivot(index='mirnaId', columns='featureName', values='featureValue')
    
    if 'label' in df_pivoted.columns:
        df_pivoted = df_pivoted.drop(columns=['label'])

    df = df_mirna.set_index('id').join(df_pivoted, how='inner')
 
    df = df.rename(columns={'isPositive': 'label'})
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