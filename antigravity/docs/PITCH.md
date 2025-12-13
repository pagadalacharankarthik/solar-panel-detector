# Antigravity: Accelerating Solar Adoption from Space 🌍

### The Problem
Adopting solar energy is riddled with friction. Homeowners and policymakers lack instant, accurate data on rooftop potential. Manual site visits are expensive ($200+/visit) and slow. Existing automated solutions are often gated behind enterprise contracts or lack transparency.

### The Solution: Antigravity
**Antigravity** is an open, instant, AI-driven assessment tool.
*   **Input**: Any location (Latitude/Longitude).
*   **Process**: Real-time satellite fetching + Deep Learning Segmentation.
*   **Output**: Verified "Solar Present" status and precise area quantification (m²).

### Innovation
Unlike simple bounding-box detectors, Antigravity uses **Instance Segmentation (Mask R-CNN)**. This allows us to handle:
1.  Irregular roof shapes.
2.  Complex panel arrays (L-shaped, fragmented).
3.  Obstruction analysis (chimneys, vents).

### Architecture
*   **Cloud-Native**: Fully dockerized microservices.
*   **Scalable**: Stateless inference engine, ready for Kubernetes.
*   **Modular**: Plug-and-play model backend (can swap for YOLOv8-Seg or Transformer-based models).

### Market Potential
*   **Residential & Commercial**: Instant leads for solar installers.
*   **Government**: City-scale renewable potential mapping.
*   **Insurance**: Property asset verification.

### Impact
By reducing the "soft costs" of solar acquisition (site audits), Antigravity accelerates the global transition to renewable energy.
