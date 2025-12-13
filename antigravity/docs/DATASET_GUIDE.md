# 💾 Dataset Guide

## 📦 Dataset Source

**Roboflow Universe - Solar Panel Detection Dataset**

- **URL**: https://universe.roboflow.com/projectsolarpanel/lsgi547-project/browse
- **Size**: 5000+ annotated satellite images
- **Format**: YOLOv8 Instance Segmentation (polygon masks)
- **License**: Public dataset (check Roboflow for specific terms)

**How to Download:**
1. Visit the Roboflow link above
2. Click "Download Dataset"
3. Select format: **YOLOv8**
4. Export and unzip to your project folder

---

## 📂 Dataset Structure
The project expects the dataset in the following format (YOLOv8 / Polygon style):

```bash
solar-3/
├── antigravity/
│   ├── dataset_train/
│   │   ├── images/  # .jpg or .png satellite images
│   │   └── labels/  # .txt files with polygon coordinates
│   ├── dataset_valid/
│   │   ├── images/
│   │   └── labels/
```

## 📝 Label Format
We use standard **YOLO normalized polygon format**:
```
<class_id> <x1> <y1> <x2> <y2> ... <xn> <yn>
```
*   `class_id`: 0 (Solar Panel).
*   `x, y`: Normalized coordinates (0-1) relative to image width/height.

## 🔄 Preprocessing
The `dataset_preprocess.py` script handles:
1.  Reading the `.txt` label file.
2.  Converting normalized polygon points back to pixel coordinates.
3.  Creating a Binary Mask (Image) where 1=Solar Panel, 0=Background.
4.  Passing this mask to the Mask R-CNN model.

## ➕ Adding New Data
1.  Collect satellite images (Google Earth / Maps).
2.  Annotate them using **Roboflow** or **CVAT**.
3.  Export as **YOLOv8 Instance Segmentation**.
4.  Unzip the folder.
5.  Copy `train` contents to `antigravity/dataset_train`.
6.  Copy `valid` contents to `antigravity/dataset_valid`.
7.  Run the **Retrain** command.
