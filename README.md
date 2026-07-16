# miRNA Predictor Platform

## Project Purpose

The miRNA Predictor Platform is a web application for configuring and monitoring machine learning experiments for microRNA classification.

Users can:

* Create training jobs
* Select feature sets and machine learning models
* View experiment results and evaluation metrics
* Download the full dataset used for training
* Manage personal settings and theme preferences

The system consists of:

* React frontend
* Node.js / Express backend API
* Python FastAPI machine learning microservice

---

## Installation

### Frontend

Install dependencies:

```bash
npm install
```

Run:

```bash
npm start
```

Frontend URL:

```text
http://localhost:5173
```

---

### Backend API

Install dependencies:

```bash
npm install
```

Run:

```bash
npm start
```

Backend URL:

```text
http://localhost:3000
```

---

### ML Service

Install dependencies:

```bash
pip install -r requirements.txt
```

Run:

```bash
python -m uvicorn app:app --reload --port 8000
```

ML Service URL:

```text
http://localhost:8000
```

---

## Database Setup

The backend uses **MySQL** as the database engine and **Sequelize v6** as the ORM.

The database connection configuration is located in:

`backend/config/database.js`


The connection is configured using environment variables.

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mirna_classifier_db
DB_PORT=3306
```

---

## Environment Variables

The backend requires a `.env` file located in the backend directory.

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=mirna_classifier_db
DB_PORT=3306

PORT=3000

FASTAPI_SERVICE_URL=http://localhost:8000
REACT_APP_BACKEND_URL=http://localhost:3000

INTERNAL_API_SECRET=
GEMINI_API_KEY=
```

The frontend requires a `.env` file located in the frontend directory.

Example:

```env
PORT=5173
BACKEND_URL=http://localhost:3000
```


---

## ORM Setup

The backend uses Sequelize v6 as the ORM.

Models are located in:

`backend/models/`

### Main models:

* User
* Job
* FeatureSet
* FeatureFilter
* JobFilter
* ModelType
* MiRnaData
* MiRnaFeatureValue

### Database relationships:

User → Jobs
One user can create multiple jobs.

Jobs → Feature Filters

Many-to-many relationship:

Job
 |
 |
JobFilter
 |
 |
FeatureFilter

Sequelize associations are configured in:

`backend/models/index.js`

---

## Main API Endpoints

### Authentication

* POST `/api/auth/login`
* POST `/api/auth/logout`

### Users

* GET `/api/users`
* GET `/api/users/:id`
* GET `/api/users/me`
* POST `/api/users`
* PUT `/api/users/:id`
* PUT `/api/users/me`
* DELETE `/api/users/:id`

### Settings

* GET `/api/settings`
* PUT `/api/settings`

### Jobs

* GET `/api/jobs`
* GET `/api/jobs/:id`
* POST `/api/jobs`
* PUT `/api/jobs/:id`
* DELETE `/api/jobs/:id`

### AI Analysis

* GET `/api/explain-job`

### Download

* GET `/api/dataset`

### Metadata

* GET `/api/model-types`
* GET `/api/model-types/:id`
* GET `/api/feature-sets`
* GET `/api/feature-sets/:id`
* GET `/api/feature-filters`
* GET `/api/feature-filters/:id`

---

## WebSocket Features

The application uses Socket.IO for real-time dashboard updates.

Custom events:

* `job_created`
* `job_started`
* `job_completed`
* `job_failed`

When a training job changes status, all connected browser clients receive updates immediately without refreshing the page.

This feature is demonstrated by opening multiple browser tabs and observing synchronized dashboard updates.

---

## AI Features

The platform integrates a machine learning microservice that trains classification models on miRNA feature datasets.

Supported models:

* Random Forest
* XGBoost

Supported feature sets:

* 1D features
* 2D features
* 3D features
* 1D + 2D features
* 1D + 3D features
* 2D + 3D features
* Combined feature sets

Returned metrics include:

* Accuracy
* Precision
* Recall
* F1 Score
* Cross-validation Mean
* Cross-validation Standard Deviation

In addition, there's an option to generate for each training job an AI performance analysis.

---

## Known Limitations

* Machine learning jobs are executed sequentially within the microservice.
* WebSocket events are not persisted; users only receive events while connected.
* The system is intended for academic demonstration purposes and not production deployment.
