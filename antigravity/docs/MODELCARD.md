# Model Card: Antigravity Solar Detector

## Model Details
*   **Name**: Antigravity Solar Detector v1.0
*   **Version**: 1.0.0
*   **Type**: Convolutional Neural Network (Instance Segmentation)
*   **Architecture**: Mask R-CNN (ResNet-50-FPN backbone)
*   **Framework**: PyTorch
*   **Date**: December 2026

## Intended Use
*   **Primary Use**: Automatic detection and area estimation of rooftop solar panels from satellite imagery.
*   **Input**: RGB Satellite Images (Google Maps Static API / ESRI).
*   **Output**: Binary mask (Solar / Non-Solar), bounding boxes, confidence scores.

## Dataset
*   **Source**: Roboflow Universe - [Solar Panel Detection Dataset](https://universe.roboflow.com/projectsolarpanel/lsgi547-project/browse?queryText=&pageSize=50&startingIndex=0&browseQuery=true)
*   **Size**: 5000+ labeled satellite images (640x640px)
*   **Classes**:
    *   0: Background (Roof, Ground, Vegetation)
    *   1: Solar Panel
*   **Format**: YOLOv8 Instance Segmentation (polygon annotations)
*   **Augmentations**: Random flipping, rotation, brightness/contrast adjustments

## Performance
*   **Metric**: Intersection over Union (IoU)
*   **Threshold**: > 0.5 IoU is considered a true positive.
*   **Reported Accuracy**: ~0.85 mAP (mean Average Precision) on validation set.

## Limitations

### Technical Limitations
*   **Occlusion**: Tree cover or overlapping buildings may obscure panels, preventing detection.
*   **Resolution Dependency**: Performance degrades significantly at resolutions worse than 30cm/pixel.
*   **False Positives**: Skylights, swimming pools, and greenhouses may be misclassified as solar panels due to similar geometric patterns.

### Operational Limitations
*   **Satellite Imagery Lag**: Detection accuracy depends on satellite imagery freshness (typically 6-12 months old for urban areas, 2-5 years for rural areas).
*   **New Installations**: Cannot detect solar panels installed after the satellite imagery capture date.
*   **Weather Conditions**: Cloud cover or snow in satellite imagery will prevent accurate detection.
*   **Temporal Mismatch**: Subsidy verification for recent installations (< 6 months) may require supplementary verification methods.

### Recommended Use Cases
✅ **Suitable for:**
- Pre-screening existing solar installations
- Fraud detection in subsidy programs
- Large-scale solar adoption surveys
- Historical installation tracking

❌ **Not recommended as sole method for:**
- Verifying installations completed within the last 6-12 months
- High-stakes decisions without manual verification
- Areas with frequent cloud cover or poor satellite coverage

## Ethical Considerations
*   **Privacy**: The model operates on publicly available satellite imagery. No PII is processed.
*   **Bias**: Training data is predominantly from US suburban areas. Performance in dense urban environments or developing nations with different roof architectures (e.g., terracotta, flat concrete) may vary.

## Failure Modes
*   **Shadows**: Deep shadows cast by trees or nearby buildings can mimic the dark rectangular shape of panels, leading to false positives.
*   **Water Bodies**: Swimming pools or water tanks with regular geometries can be confused with panels due to similar reflectivity.
*   **Low Resolution**: Validation accuracy drops below 60% when image ground sample distance (GSD) exceeds 50cm/pixel.

## Retraining Guidance
To retrain or fine-tune this model for a new region:
1.  **Data Collection**: Gather at least 500 positive samples (roofs with solar) and 500 negative samples (roofs without) from the target geography.
2.  **Annotation**: Use tools like CVAT or Roboflow to draw polygon masks around panels. Export in YOLOv8 instance segmentation format.
3.  **Training**:
    *   Initialize with weights from `antigravity_model.pt`.
    *   Use a learning rate of `1e-4` with cosine decay.
    *   Train for 20-50 epochs depending on dataset size.
