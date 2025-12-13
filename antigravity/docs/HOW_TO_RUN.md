# How to Run Model

## Prerequisites (Step-by-Step Installation)

### 1. Install Docker Desktop (Recommended)
This is the easiest way to run the entire application (Backend + Frontend).
1.  Go to [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2.  Download the "Download for Windows" installer.
3.  Run the installer and follow the on-screen instructions (use default settings).
4.  **Important**: After installation, **restart your computer**.
5.  Open "Docker Desktop" from your Start Menu and wait for the engine to start (green icon in bottom left).

### 2. Install Python (Optional, for manual training)
Only needed if you want to run `train.py` directly on your machine instead of inside Docker.
1.  Go to Microsoft Store on your Windows.
2.  Search for "Python 3.10".
3.  Click "Get" or "Install".
4.  Open a new terminal (PowerShell) and type `python --version` to verify.

---

## 🚀 Running the App (Easiest Method)

Once Docker is installed and running:

1.  Open PowerShell in this folder (`solar 3`).
2.  Run the following command to build and start everything:
    > [!IMPORTANT]
    > **Google Maps API Key**: Before running this command, open `docker-compose.yml` and paste your Google Maps API Key where it says `YOUR_GOOGLE_MAPS_API_KEY`. If you skip this, the app will use mock images.

    ```bash
    docker-compose up --build
    ```
3.  Wait for the logs to stop scrolling. You will see messages like `Uvicorn running` and `webpack compiled`.
4.  Open your browser to: **[http://localhost:3000](http://localhost:3000)**
5.  App is ready✔️

---

## 🧠 Training the Model (Step-by-Step - Already the model is trained so,no need to train again   refer:C:\Users\chara\OneDrive\Desktop\solar 3\antigravity\backend\models\antigravity_model.pt)

You have two choices:

### Option A: Training inside Docker (No Python installation needed)
1.  Ensure Docker is running.
2.  Open PowerShell in the `solar 3` folder.
3.  Run:
    ```bash
    docker-compose run --rm backend python /app/training/train.py
    ```

### Option B: Training manually on Windows (Requires Python)
1.  Open PowerShell.
2.  Install dependencies:
    ```bash
    pip install -r antigravity/backend/requirements.txt
    ```
3.  Navigate to training folder:
    ```bash
    cd antigravity/training
    ```
4.  Run the script:
    ```bash
    python train.py
    ```

## Manual Setup (Without Docker)

### Backend
1.  Navigate to `antigravity/backend`.
2.  Install dependencies: `pip install -r requirements.txt`.
3.  Run server: `uvicorn app:app --reload`.

### Frontend
1.  Navigate to `antigravity/frontend`.
2.  Install dependencies: `npm install`.
3.  Run server: `npm start`.

## Troubleshooting

*   **"Model not found"**: Ensure `antigravity_model.pt` exists in `backend/models`. If not, the system will use a generic fallback that may produce random results for demo purposes.
*   **"API Keys missing"**: If you don't provide `SOLAR_API_KEY` in `docker-compose.yml`, the system generates mock satellite images. This is intentional behavior for the demo.
