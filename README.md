# miRNA Predictor Platform

## Project Purpose

The miRNA Predictor Platform is a web application for configuring and monitoring machine learning experiments for microRNA classification.

Users can:

* Create training jobs
* Select feature sets and machine learning models
* View experiment results and evaluation metrics
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

### Metadata

* GET `/api/model-types`
* GET `/api/feature-sets`
* GET `/api/feature-filters`

---

## Known Limitations

* Machine learning jobs are executed sequentially within the microservice.
* WebSocket events are not persisted; users only receive events while connected.
* The system is intended for academic demonstration purposes and not production deployment.
