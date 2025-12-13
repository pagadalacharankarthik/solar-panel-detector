import os
import requests
from io import BytesIO
from PIL import Image, ImageDraw
import random

GOOGLE_API_KEY = os.getenv("SOLAR_API_KEY")

def fetch_satellite_image(lat: float, lon: float, zoom: int = 20, size: str = "640x640") -> Image.Image:
    """
    Fetches a satellite image from Google Static Maps API.
    Falls back to a generated placeholder if API key is missing or request fails.
    """
    if GOOGLE_API_KEY:
        url = f"https://maps.googleapis.com/maps/api/staticmap?center={lat},{lon}&zoom={zoom}&size={size}&maptype=satellite&key={GOOGLE_API_KEY}"
        try:
            response = requests.get(url)
            if response.status_code == 200:
                print(f"Fetched image for {lat}, {lon}")
                return Image.open(BytesIO(response.content)).convert("RGB"), False
            else:
                print(f"Error fetching image: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Exception fetching image: {e}")
    
    print("Using fallback mock image generator.")
    return generate_mock_satellite_image(size), True

def generate_mock_satellite_image(size_str: str) -> Image.Image:
    """
    Generates a 'fake' satellite looking image for testing/judging without API keys.
    """
    width, height = map(int, size_str.split('x'))
    
    # Create a base Green/Brown (Grass)
    img = Image.new('RGB', (width, height), color=(34, 139, 34))
    draw = ImageDraw.Draw(img)
    
    # Draw a "Road"
    draw.rectangle([width//2 - 40, 0, width//2 + 40, height], fill=(105, 105, 105)) # Gray Road

    # Draw a "House" (Beige Rect)
    house_x1, house_y1 = width//2 - 150, height//2 - 100
    house_x2, house_y2 = width//2 + 150, height//2 + 100
    draw.rectangle([house_x1, house_y1, house_x2, house_y2], fill=(245, 245, 220)) # Beige Roof

    # Draw a "Solar Panel" (Blue/Black Rect inside the house) - This guarantees detection
    panel_x1 = house_x1 + 50
    panel_y1 = house_y1 + 50
    panel_x2 = house_x2 - 50
    panel_y2 = house_y2 - 50
    # Deep blue solar color
    draw.rectangle([panel_x1, panel_y1, panel_x2, panel_y2], fill=(25, 25, 112)) 
    
    # Add grid lines to panel to look real
    for i in range(panel_x1, panel_x2, 20):
        draw.line([(i, panel_y1), (i, panel_y2)], fill=(200, 200, 200), width=1)
    for i in range(panel_y1, panel_y2, 40):
        draw.line([(panel_x1, i), (panel_x2, i)], fill=(200, 200, 200), width=1)
        
    # Add Warning Text
    draw.text((10, 10), "DEMO MODE: INVALID API KEY", fill=(255, 0, 0))
    draw.text((10, 25), "Please add SOLAR_API_KEY in docker-compose.yml", fill=(255, 0, 0))
    draw.text((10, 40), "Using Mock Image for Demonstration", fill=(255, 255, 255))
        
    return img
