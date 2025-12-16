# 🌞 RoofVision AI - Solar Panel Detection System

![Status](https://img.shields.io/badge/Project-Solar_Panel_Detector-success) ![Docker](https://img.shields.io/badge/Docker-Ready-blue) ![AI](https://img.shields.io/badge/AI-Mask_RCNN-orange) ![License](https://img.shields.io/badge/License-MIT-green)

> **EcoInnovators Ideathon 2026 Submission**  
> AI-powered rooftop solar verification for PM Surya Ghar subsidy scheme

---

## 🚀 Quick Start (30 Seconds)

**Prerequisite:** 
- Make sure [Docker Desktop](https://www.docker.com/products/docker-desktop/) is installed and **OPEN** (running).
- Clone the repository to your local machine.
- Open the cloned repository in **VS Code** or your preferred code editor.
- After cloning the repo, add your **Google Maps API key** in the appropriate configuration file.


```bash
git clone https://github.com/pagadalacharankarthik/solar-panel-detector.git
cd solar-panel-detector
docker-compose up --build
```

Open `http://localhost:3000` - Done! ✅

## 🎥 Demo & Pitch
- 🎬 **[Watch Demo Video (Google Drive)](https://youtu.be/ozMlMRPu5yQ )**
- 📊 **[View Pitch Deck PDF (Google Drive)](https://drive.google.com/file/d/1xQadrAJC6R2n38n1oHNufdViybT5EkPR/view?usp=drivesdk)**

---

## 📌 The Challenge

**PM Surya Ghar: Muft Bijli Yojana** aims to electrify 1 crore households with ₹75,000 crores in subsidies. But how do we verify installations without expensive field visits?

### The Problem
- 📍 Field inspections: **2-3 weeks** per claim
- 💰 Manual verification: **₹800** per site  
- ⚖️ Inconsistent standards across states
- 🚨 **Fraud risk**: Claims without actual installations

### Our Solution
**RoofVision AI** verifies solar panel installations remotely using satellite imagery and AI:

> **The Question:** "Has a rooftop solar system actually been installed at this location?"  
> **Our Answer:** Delivered in <3 seconds with visual proof.

**How It Works:**
1. Enter GPS coordinates (latitude, longitude)
2. AI fetches satellite image from Google Maps
3. Computer vision detects solar panels automatically
4. Returns: YES/NO + confidence score + visual overlay

**Key Benefits:**
- ✅ **Fast**: 3 seconds vs. 2-3 weeks (field inspection)
- ✅ **Cheap**: ₹10 vs. ₹800 (manual verification)
- ✅ **Transparent**: Visual proof shows exactly what AI detected
- ✅ **Scalable**: Process 10,000 claims/day vs. 50/day manually

---

## ✨ Key Features

| Feature                  | Benefit                          | Impact                          |
|--------------------------|----------------------------------|---------------------------------|
| **Instant Verification** | Results in <3 seconds            | 100x faster than field visits   |
| **Visual Proof**         | Transparent overlay images       | Builds public trust             |
| **Confidence Scoring**   | 0-100% reliability metric        | Risk-based manual review        |
| **Batch Processing**     | Neighborhood-scale analysis      | 10,000 claims/day               |
| **Two-Step Buffer**      | 1200→2400 sqft logic             | Hackathon compliant             |
| **QC Status**            | VERIFIABLE/NOT_VERIFIABLE flags  | Clear decision support          |

---

## 🏗️ Architecture

```
Input Coordinates → Satellite Image Fetch → AI Detection → Verification Report
```

**Tech Stack:**
- **AI**: PyTorch, Mask R-CNN (ResNet-50-FPN)
- **Backend**: Python, FastAPI, OpenCV
- **Frontend**: React, Tailwind CSS
- **Infrastructure**: Docker, Docker Compose
- **APIs**: Google Maps Static API

---

## 📂 Project Structure

```
roofvision-ai/
├── antigravity/
│   ├── backend/              # FastAPI + AI Engine
│   │   ├── models/           # antigravity_model.pt (176 MB)
│   │   ├── utils/            # Image fetching, preprocessing
│   │   ├── app.py            # Main API server
│   │   └── inference.py      # Detection logic
│   ├── frontend/             # React Web UI
│   ├── training/             # Model training scripts
│   │   ├── predictions.json  # Test set results
│   │   └── training_log.csv  # Metrics (loss, IoU)
│   └── docs/                 # Comprehensive documentation
├── docker-compose.yml        # One-command deployment
├── PITCH.md                  # Hackathon pitch
└── README.md                 # This file
```

---

## 🔧 Setup & Installation

### Prerequisites
- **Docker Desktop** (Windows/Mac/Linux) Make sure [Docker Desktop](https://www.docker.com/products/docker-desktop/) is installed and **OPEN** (running).
- **Google Maps API Key** (for real satellite imagery)

### Step 1: Clone Repository
```bash
git clone https://github.com/pagadalacharankarthik/solar-panel-detector.git
cd solar-panel-detector
```

### Step 2: Add API Key
Edit `docker-compose.yml`:
```yaml
environment:
  - SOLAR_API_KEY=YOUR_GOOGLE_MAPS_KEY_HERE
```

### Step 3: Launch
```bash
docker-compose up --build
```

### Step 4: Access
- **Web UI**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs

---

## 📊 Impact Metrics

### Performance at Scale (1 Crore Households)

| Metric            | Manual       | RoofVision AI | Improvement        |
|-------------------|--------------|---------------|--------------------|
| Verification Time | 2-3 weeks    | <1 day        | **95% faster**     |
| Cost per Claim    | ₹800         | ₹10           | **98% cheaper**    |
| Daily Capacity    | 50 claims    | 10,000 claims | **200x scale**     |
| Fraud Detection   | ~5% reactive | ~15% proactive| **3x better**      |

**Projected Savings**: ₹7,900 crores in operational costs

---

## 📚 Documentation
> **Explore the full documentation in the [`antigravity/docs/`](antigravity/docs/) folder.**

- **[PITCH.md](PITCH.md)** - Hackathon pitch & impact analysis
- **[MODELCARD.md](antigravity/docs/MODELCARD.md)** - Model details, limitations
- **[HOW_TO_RUN.md](antigravity/docs/HOW_TO_RUN.md)** - Detailed setup
- **[API.md](antigravity/docs/API.md)** - Backend API reference

---

## 🎓 Hackathon Deliverables

✅ **Pipeline Code**: `antigravity/backend/`  
✅ **Trained Model**: `antigravity/backend/models/antigravity_model.pt` (176 MB)  
✅ **Prediction Files**: `antigravity/training/predictions.json`  
✅ **Training Logs**: `antigravity/training/training_log.csv`  
✅ **Model Card**: `antigravity/docs/MODELCARD.md`  
✅ **Environment**: `docker-compose.yml`, `requirements.txt`  
✅ **Documentation**: 9 comprehensive guides  

---

## ⚠️ Limitations & Transparency

**Technical:**
- Satellite imagery lag (6-12 months urban, 2-5 years rural)
- Weather dependency (clouds block detection)
- Resolution requirements (30cm/pixel minimum)

**Operational:**
- Cannot detect panels installed after imagery date
- Should not be sole verification method

**Recommended Use:**
- ✅ Pre-screening existing installations
- ✅ Fraud detection in subsidy programs
- ❌ Sole verification for recent installations (<6 months)

See [MODELCARD.md](antigravity/docs/MODELCARD.md) for full details.

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Email**: charankarthik366@gmail.com 

---

**Made with ❤️ for India's Solar Revolution**

*Powering PM Surya Ghar with Transparent AI*
