# API Reference

The backend is built with FastAPI. It exposes a RESTful interface.

## Base URL
\`http://localhost:8000\`

---

## Endpoints

### 1. Health Check
GET \`/health\`

Returns the status of the service and the compute device being used (CPU/CUDA).

**Response:**
\`\`\`json
{
  "status": "ok",
  "device": "cpu"
}
\`\`\`

---

### 2. Run Inference
GET \`/infer\`

Main endpoint to analyze a location.

**Parameters:**
*   \`lat\` (float, required): Latitude of the target location.
*   \`lon\` (float, required): Longitude of the target location.
*   \`buffer_sqft\` (int, optional): Area buffer to analyze. Default: 1200.

**Example Request:**
\`GET /infer?lat=36.1699&lon=-115.1398\`

**Success Response (200 OK):**
\`\`\`json
{
  "sample_id": "550e8400-e29b-41d4-a716-446655440000",
  "latitude": 36.1699,
  "longitude": -115.1398,
  "solar_present": true,
  "solar_area_m2": 45.5,
  "confidence": 0.98,
  "qc_status": "VERIFIABLE",
  "buffer_size_sqft": 1200,
  "model_version": "v1.0",
  "timestamp": "2026-12-08T10:00:00Z",
  "artifact_paths": {
       "original": "/static/original_550e....png",
       "overlay": "/static/overlay_550e....png"
  }
}
\`\`\`

**Error Responses:**
*   422 Validation Error: Missing lat/lon.
*   500 Internal Server Error: Model failure or API connection issue.
