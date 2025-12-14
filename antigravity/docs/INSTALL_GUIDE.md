# 🛠️ Installation & Setup Guide

This guide covers how to set up the **Solar Panel Suitability Predictor** on various systems.

## 📋 System Requirements
*   **OS:** Windows 10/11, macOS, or Linux.
*   **RAM:** 8GB Minimum (16GB Recommended).
*   **Disk:** 5GB Free Space (for Docker images).
*   **Software:** Docker Desktop.

---

## 🐳 Method 1: Docker (Recommended)
This is the "Golden Path" for judges. It isolates everything.

1.  **Install Docker Desktop**: [Download Here](https://www.docker.com/products/docker-desktop/).
2.  **Clone Repository**:
    ```bash
    git clone https://github.com/pagadalacharankarthik/solar-panel-detector.git
    cd solar-panel-detector
    ```
3.  **Add API Key**:
    *   Open `docker-compose.yml`.
    *   Paste your Google Maps Key into `SOLAR_API_KEY`.
4.  **Run**:
    ```bash
    docker-compose up --build
    ```
5.  **Access**:
    *   Frontend: `http://localhost:3000`
    *   Backend Docs: `http://localhost:8000/docs`

---

## 💻 Method 2: Local Setup (No Docker)
Only use this if you want to develop the code or cannot use Docker.

### Backend (Python)
1.  Install Python 3.10+.
2.  Navigate to `antigravity/backend`.
3.  Create Venv:
    ```bash
    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate
    ```
4.  Install Deps:
    ```bash
    pip install -r requirements.txt
    ```
5.  Run:
    ```bash
    uvicorn app:app --reload
    ```

### Frontend (Node.js)
1.  Install Node.js 18+.
2.  Navigate to `antigravity/frontend`.
3.  Install:
    ```bash
    npm install
    ```
4.  Run:
    ```bash
    npm start
    ```

---

## 🎮 GPU Configuration (Advanced)
If you want to train faster using your GPU:
1.  Ensure you have **NVIDIA Drivers** installed.
2.  Install **NVIDIA Container Toolkit** for Docker.
3.  Modify `docker-compose.yml` to enable GPU support (uncomment the `deploy` section if present).
4.  Run the training command.
