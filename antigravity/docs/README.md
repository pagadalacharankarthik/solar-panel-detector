# Solar Panel Suitability Predictor ☀️🏡
## 🔹 1. Project Overview
This project is an advanced AI application designed to automatically detect solar panels on rooftops and assess the suitability of a house for solar energy installation.
*   **Problem:** Determining solar potential usually requires expensive site visits or manual inspection of satellite imagery.
*   **Solution:** An automated, computer-vision based system that detects available roof area and existing installations from satellite maps.
*   **Impact:** Accelerates solar adoption by giving homeowners and providers instant, data-driven assessments.

## 🔹 2. Features
*   **☀️ Solar Suitability Prediction:** Instantly calculates usable area and potential power generation.
*   **🐳 100% Dockerized:** Runs completely inside a container. Zero messy installations on your laptop.
*   **⚡ Fast Inference:** Optimized for speed, delivering results in seconds.
*   **📂 Batch Processing:** Capable of analyzing multiple locations at once via CSV upload.
*   **🖥️ User-Friendly Interface:** clean, modern web UI for interaction.

## 🔹 3. Architecture Explanation
We built this system for simplicity and performance:
1.  **Input:** User provides Latitude/Longitude or uploads a CSV.
2.  **Dataset:** Trained on thousands of satellite images containing rooftop solar arrays.
3.  **Preprocessing:** Images are fetched, normalized, and resized for the AI.
4.  **The Brain (Model):** We use a **Mask R-CNN** (Region-based Convolutional Neural Network). It doesn't just "see" the solar panel; it traces its exact shape pixel-by-pixel.
5.  **Output:** The model returns a visual overlay (mask) and calculates the exact area in square meters.
**Flow:** `User Input` → `Satellite Image Fetcher` → `AI Model` → `Suitability Report`

## 🔹 4. How Judges Should Run the Model (Important!)
We have designed this so you do **NOT** need to install Python, PyTorch, or Node.js.

### Step 0: Clone the Repo
```bash
git clone <YOUR_REPO_URL_HERE>
cd solar-3
```
### Step 1: Add Your Maps API Key (Important!)
To fetch real satellite imagery, you must add your Google Maps Static API Key.
1.  Open `docker-compose.yml` in any text editor.
2.  Find line 18:
    ```yaml
    - SOLAR_API_KEY=YOUR_KEY_HERE
    ```
3.  Replace `YOUR_KEY_HERE` with your actual Google Maps API Key.
4.  Save the file.

### Step 2: Launch the Application
Everything runs with one command. We use `docker-compose` to orchestrate the AI Backend and the Web Frontend together.
```bash
docker-compose up --build
```
*   **Note:** This command builds the Docker images, installs all dependencies inside the container, and starts the server.
*   **Output:** You will see logs from the backend and frontend. Once it says `Compiled successfully` or `Application startup complete`, it is ready.
### Step 3: Use the App
Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**
Just enter a location (e.g., `36.1699`, `-115.1398`) to test it!
## 🔹 5. How Training Works
The project comes with a **pre-trained model** (`antigravity_model.pt`) inside the `backend/models` folder. You do not need to train it to test the app.
**If you WANT to re-train it:**
We included a training command that runs strictly inside Docker (GPU optional but recommended for speed):
```bash
docker-compose run --rm backend python /app/training/train.py
```
## 🔹 6. Dataset Description
*   **Source:** [Roboflow / Custom Dataset]
*   **Input Features:** Satellite imagery (RGB), labeled polygon masks for solar panels.
*   **Size:** [Number] images tailored for diverse roof types.
## 🔹 7. Project Folder Structure
*   **antigravity/backend/**: The AI brain. Contains `app.py` (API) and `inference.py` (Prediction logic).
*   **antigravity/frontend/**: The Web UI. React-based interface for easy testing.
*   **antigravity/training/**: Scripts used to teach the model (`train.py`).
*   **docker-compose.yml**: The recipe that builds and runs the whole system.
## 🔹 8. Hackathon Deliverables

### Prediction Files
The model's predictions on the validation dataset are stored in:
```
antigravity/training/predictions.json
```

This file contains:
- **`sample_id`**: Unique identifier for each test image
- **`has_solar`**: Boolean prediction (true/false)
- **`confidence`**: Model's confidence score (0.0 to 1.0)
- **`pv_area_sqm_est`**: Estimated solar panel area in square meters
- **`bbox_or_mask`**: Bounding box coordinates
- **`qc_status`**: Quality control status (VERIFIABLE/NOT_VERIFIABLE)

### Training Logs
Training metrics are documented in:
```
antigravity/training/training_log.csv
```

### Model Card
Detailed model documentation is available at:
```
antigravity/docs/MODELCARD.md
```

## 🔹 9. Notes for Judges
*   **Offline Capable:** Once the Docker image is built, the core logic runs locally. (Satellite image fetching requires internet, but the AI prediction is local).
*   **Platform Independent:** Works on Windows, Mac, and Linux via Docker.
*   **Modifiable:** You can tweak parameters in `backend/app.py` to test different confidence thresholds.