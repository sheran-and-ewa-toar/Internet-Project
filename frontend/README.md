# 🧬 miRNA Predictor Platform - Frontend Application

Welcome to the frontend user interface for the **miRNA Predictor Platform**, a Machine Learning Platform designed for structural microRNA analysis, training run tracking, and experimental feature evaluations.

This application is built using **React.js** and interfaces directly with the backend REST API to provide responsive dashboards, settings state synchronizations, and data-driven analysis views.


* **Framework:** React.js (via `create-react-app`)

* **Routing System:** React Router v6 (Client-side routing guards)

* **Data Layer:** Axios HTTP Client

* **Target Interface Port:** `http://localhost:5173` (Default Browser Window)

* **API Target Base URL:** `http://localhost:3000` (Backend API Engine)



## 🚀 Getting Started & Installation

Follow these steps sequentially to configure, execute, and evaluate the application workspace environment locally.

### 1. Install Project Dependencies
Before executing the application script runtime engine for the first time, compile the required operational node libraries using the package manager deployment command:
```bash
npm install
```

Launch the local development workspace engine. This compiles your code and automatically fires open your web browser:
```bash
npm start
```

## Screens 

### 1. Login Screen (/login)
Your entry point to the application.

What to do: Enter your research email address and password (minimum 6 characters) to authenticate your access.

What happens: The system validates your format instantly, secures a quick handshake with the backend database, and forwards you to your workspace.

### 2. Main Analytics Dashboard (/dashboard)
The primary working hub of the platform where sequence analysis occurs.

Relational Job Stream: Displays automated cards detailing recent structural machine learning experiments.

History Table Grid: Maps your complete pipeline run dataset out line-by-line so you can easily compare classification performance metrics.

Real-time Live Polling: Automatically loops a background query every 5 seconds to catch new processing updates without freezing your view.

### 3. Settings Control Panel (/settings)
Your personal profile customization suite.

Profile Syncing: Keeps your username and contact records up to date with the server.

Dynamic Theme Spectrum Switcher: Lets you instantly switch the color palette across 4 distinct styles to suit your working environment: Light, Dark, Pink, or Teal.