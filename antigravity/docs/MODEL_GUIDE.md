# 🧠 Model Architecture & Training Guide

## 📐 Model Architecture
We use **Mask R-CNN (Region-based Convolutional Neural Network)**.
*   **Backbone:** ResNet-50 (Pre-trained on COCO dataset).
*   **Head:** Faster R-CNN (Box predictor) + Mask Branch (Pixel segmentation).
*   **Input:** 3-Channel RGB Satellite Images.
*   **Classes:** 2 (Background, Solar Panel).

### Why Mask R-CNN?
For measuring area, we need **segmentation** (pixels), not just object detection (boxes). Mask R-CNN identifies the exact contour of the solar array, allowing for accurate square-footage calculation.

---

## ⚙️ Hyperparameters
These are configured in `training/train.py`.
*   **Epochs:** 3 (for demo) / 10-20 (for production).
*   **Batch Size:** 2 (CPU-friendly) / 8+ (GPU).
*   **Learning Rate:** 0.005.
*   **Optimizer:** SGD (Stochastic Gradient Descent) with Momentum (0.9).

---

## 🎓 Training Pipeline
1.  **Data Loading:** `dataset_preprocess.py` parses the dataset.
2.  **Transformations:** Images are converted to Tensors.
3.  **Forward Pass:** Model predicts boxes and masks.
4.  **Loss Calculation:** Combined loss (Box Regression + Classification + Mask).
5.  **Backprop:** Weights updated via SGD.
6.  **Saving:** Best weights saved to `backend/models/antigravity_model.pt`.

---

## 🔄 How to Retrain
To retrain the model from scratch (e.g., if you add new data):
```bash
docker-compose run --rm backend python /app/training/train.py
```
This runs strictly inside the container.

---

## 📈 Evaluation
We use **IoU (Intersection over Union)** and **F1 Score** to measure accuracy.
*   **IoU > 0.5**: Good detection.
*   **IoU > 0.75**: Excellent detection.
*   **F1 Score**: Harmonic mean of Precision and Recall.
Logs are saved in the `training/logs/` directory.

## 🚀 Advanced Training (With Metrics)
To see IoU and F1 scores *during* training (updated per epoch), use our advanced script:

### Option 1: Run locally (inside Docker)
```bash
docker-compose run --rm backend python /app/training/train_with_metrics.py
```

### Option 2: Run in Colab/Notebook
Copy the contents of `antigravity/training/train_with_metrics.py` into your Jupyter Notebook cell, replacing the standard training loop.
