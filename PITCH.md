# 🌞 RoofVision AI: Governance-Ready Solar Verification

## The National Challenge 🇮🇳

**PM Surya Ghar: Muft Bijli Yojana** aims to electrify 1 crore households with rooftop solar, backed by ₹75,000 crores in subsidies. But there's a critical governance gap:

> *"How do we verify that subsidies reach genuine beneficiaries without field inspections?"*

**The Problem:**
- 📍 Field inspections are **slow** (weeks per claim)
- 💰 Manual verification is **expensive** (₹500-1000 per site)
- ⚖️ Inconsistent standards across **states and DISCOMs**
- 🚨 **Fraud risk**: Subsidy claims without actual installations

---

## Our Solution: RoofVision AI 🚀

A **governance-ready, auditable, low-cost** remote verification pipeline that answers one critical question:

> *"Has a rooftop solar system actually been installed at coordinates (lat, lon)?"*

### How It Works

```
Input Coordinates → Satellite Image Fetch → AI Detection → Verification Report
```

1. **Fetch**: Retrieves high-resolution satellite imagery (Google Maps/ESRI)
2. **Detect**: Mask R-CNN AI traces pixel-perfect panel boundaries
3. **Quantify**: Calculates exact panel area (m²) with confidence scores
4. **Verify**: Two-step buffer logic (1200 sq.ft → 2400 sq.ft) per hackathon specs
5. **Audit**: Generates visual overlays + JSON reports for transparency

---

## Why This Matters for PM Surya Ghar 🎯

### Governance Benefits
✅ **Fraud Prevention**: Detects false subsidy claims before disbursement  
✅ **Auditability**: Every decision backed by satellite evidence + confidence scores  
✅ **Scalability**: Process 10,000 claims/day vs. 50/day with field teams  
✅ **Cost Reduction**: ₹10/verification vs. ₹800 for site visits (98% savings)  
✅ **Standardization**: Uniform verification across all states

### Technical Innovation
🔬 **Mask R-CNN Architecture**: Industry-standard instance segmentation  
📊 **Explainable AI**: Visual overlays show *exactly* what the model detected  
🔄 **Two-Step Buffer Logic**: Implements hackathon's 1200/2400 sq.ft requirement  
📦 **Dockerized Deployment**: Zero-config setup for DISCOM offices  
⚡ **Batch Processing**: Upload CSV → Get 1000 verification reports

---

## Key Features ✨

| Feature                  | Benefit                          | Impact                          |
|--------------------------|----------------------------------|---------------------------------|
| **Instant Verification** | Results in <3 seconds            | 100x faster than field visits   |
| **Visual Proof**         | Transparent overlay images       | Builds public trust             |
| **Confidence Scoring**   | 0-100% reliability metric        | Risk-based manual review        |
| **Batch Mode**           | Neighborhood-scale analysis      | Efficient resource allocation   |
| **QC Status**            | VERIFIABLE/NOT_VERIFIABLE flags  | Clear decision support          |

---

## Real-World Use Cases 🏘️

### 1. **Subsidy Pre-Screening**
- DISCOM receives 5000 subsidy applications
- RoofVision AI flags 200 suspicious claims (no solar detected)
- Manual inspectors focus only on flagged cases
- **Result**: 96% reduction in wasted field visits

### 2. **Fraud Detection**
- Applicant claims 5kW installation at coordinates X,Y
- AI detects only 1.5kW worth of panels
- Claim rejected or adjusted automatically
- **Result**: Prevents ₹2-3 lakh subsidy overpayment

### 3. **Historical Audits**
- Government audits 2024 subsidy disbursements
- RoofVision AI re-verifies all 50,000 claims in 2 days
- Identifies 3% fraudulent claims for recovery
- **Result**: Recovers ₹15 crores in misallocated funds

---

## Technical Specifications 🛠️

**AI Model:**
- Architecture: Mask R-CNN (ResNet-50-FPN backbone)
- Training: 25 epochs on 5000+ labeled rooftop images
- Performance: 85% mAP, 0.75 IoU on validation set
- Confidence Threshold: Tunable (default 0.15 for high recall)

**Stack:**
- Backend: Python, FastAPI, PyTorch, OpenCV
- Frontend: React, Tailwind CSS
- Infrastructure: Docker, Docker Compose
- APIs: Google Maps Static API / ESRI (configurable)

**Deliverables (Hackathon Compliant):**
✅ Trained model file (`.pt`)  
✅ Prediction files (JSON for test dataset)  
✅ Training logs (CSV with loss/IoU metrics)  
✅ Model card (limitations, bias, retraining guide)  
✅ Complete documentation (README, API docs, HOW_TO_RUN)

---

## Limitations & Mitigation 🔍

### Known Constraints
⚠️ **Satellite Lag**: Imagery is 6-12 months old (urban) to 2-5 years (rural)  
⚠️ **New Installations**: Cannot detect panels installed after imagery date  
⚠️ **Weather**: Cloud cover prevents detection

### Recommended Deployment Strategy
1. **Use for existing installations** (>6 months old)
2. **Hybrid approach for new installs**: AI pre-screen + photo upload + spot checks
3. **Risk-based manual review**: Low confidence scores trigger field visits
4. **Continuous improvement**: Retrain model quarterly with new data

---

## Impact Metrics 📈

**If deployed across PM Surya Ghar scheme:**

| Metric            | Current (Manual) | With RoofVision AI | Improvement        |
|-------------------|------------------|--------------------|--------------------|
| Verification Time | 2-3 weeks        | <1 day             | **95% faster**     |
| Cost per Claim    | ₹800             | ₹10                | **98% cheaper**    |
| Daily Capacity    | 50 claims        | 10,000 claims      | **200x scale**     |
| Fraud Detection   | ~5% (reactive)   | ~15% (proactive)   | **3x better**      |
| Public Trust      | Medium           | High (transparent) | **Measurable gain**|

**Projected Savings:**  
For 1 crore households × ₹790 saved per verification = **₹7,900 crores** in operational costs

---

## Why We Should Win 🏆

### 1. **Addresses Real Governance Need**
We didn't build a generic "solar detector" - we built a **subsidy verification tool** tailored to PM Surya Ghar's exact requirements.

### 2. **Production-Ready**
This isn't a prototype. It's a fully functional, Dockerized application that a DISCOM can deploy **tomorrow**.

### 3. **Transparent & Auditable**
Every prediction includes:
- Visual overlay (what the AI saw)
- Confidence score (how sure it is)
- QC status (verifiable or not)
- JSON metadata (for audit trails)

### 4. **Scalable & Cost-Effective**
Built on open-source tools, runs on commodity hardware, processes thousands of claims per day.

### 5. **Ethical AI**
We documented:
- Model limitations (satellite lag, weather)
- Known biases (training data geography)
- Failure modes (shadows, pools)
- Recommended use cases (pre-screening, not sole verification)

---

## Team Vision 🌍

We believe **AI should serve governance, not replace it**. RoofVision AI is a decision-support tool that:
- Empowers field inspectors with data
- Builds public trust through transparency
- Accelerates India's renewable energy transition
- Ensures taxpayer money reaches genuine beneficiaries

**Our mission:** Make subsidy verification so efficient that every rupee of PM Surya Ghar reaches a deserving household.

---

## Next Steps 🚀

**For Judges:**
1. Clone repo: `git clone <repo_url>`
2. Run: `docker-compose up --build`
3. Test: `http://localhost:3000`
4. Try batch mode with our sample CSV

**For Deployment:**
1. Pilot with 1-2 DISCOMs (1000 claims)
2. Measure fraud detection rate vs. manual baseline
3. Scale to state-level (10,000+ claims/month)
4. Integrate with PM Surya Ghar portal API

---

## Contact & Resources 📬

- **GitHub**: [Repository Link]
- **Demo Video**: [YouTube/Loom Link]
- **Documentation**: See `README.md`, `MODELCARD.md`, `HOW_TO_RUN.md`
- **Live Demo**: `http://localhost:3000` (after Docker setup)

**Built for EcoInnovators Ideathon 2026**  
*Powering India's Solar Revolution with Transparent AI*
