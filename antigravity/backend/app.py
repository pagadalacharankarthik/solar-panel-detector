from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import torch
import os
import uvicorn
from contextlib import asynccontextmanager

from model_loader import load_model
from inference import run_inference

# Global State
MODEL = None
DEVICE = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global MODEL
    model_path = os.path.join(os.path.dirname(__file__), "models", "antigravity_model.pt")
    MODEL = load_model(model_path, DEVICE)
    yield
    # Shutdown
    print("Shutting down...")

app = FastAPI(title="Antigravity API", version="1.0", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files
artifacts_dir = os.path.join(os.path.dirname(__file__), "artifacts")
if not os.path.exists(artifacts_dir):
    os.makedirs(artifacts_dir)
app.mount("/static", StaticFiles(directory=artifacts_dir), name="static")

@app.get("/health")
def health_check():
    return {"status": "ok", "device": str(DEVICE)}

@app.get("/infer")
def infer(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    buffer_sqft: int = Query(1200, description="Area buffer in sqft (1200 or 2400)")
):
    try:
        if MODEL is None:
            raise HTTPException(status_code=503, detail="Model not loaded")
            
        result = run_inference(MODEL, lat, lon, buffer_sqft, DEVICE)
        return result
    except Exception as e:
        print(f"Inference error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

from pydantic import BaseModel
from typing import List

class Coordinate(BaseModel):
    id: str
    lat: float
    lon: float

class BatchRequest(BaseModel):
    locations: List[Coordinate]

@app.post("/batch_infer")
def batch_infer(request: BatchRequest):
    if MODEL is None:
         raise HTTPException(status_code=503, detail="Model not loaded")
    
    results = []
    for loc in request.locations:
        try:
            # Reusing the existing run_inference logic
            # Note: sequential processing for simplicity. Parallelizing might be needed for scale.
            res = run_inference(MODEL, loc.lat, loc.lon, 1200, DEVICE)
            # Inject the original ID back so user can track it
            res['user_id'] = loc.id
            results.append(res)
        except Exception as e:
            print(f"Error processing {loc.id}: {e}")
            results.append({
                "user_id": loc.id,
                "error": str(e),
                "solar_present": False, # Default fallbacks
                "solar_area_m2": 0.0
            })
            
    return {"results": results}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
