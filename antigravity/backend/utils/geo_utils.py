import math
from shapely.geometry import Point, box, Polygon
from typing import Tuple

def get_meters_per_pixel(lat: float, zoom: int) -> float:
    """
    Calculate meters per pixel at a given latitude and zoom level.
    Based on Web Mercator projection.
    """
    earth_circumference = 40075017.0  # In meters
    latitude_radians = math.radians(lat)
    return earth_circumference * math.cos(latitude_radians) / (2 ** (zoom + 8))

def get_bounding_box_for_area(lat: float, lon: float, area_sqft: int) -> Tuple[float, float, float, float]:
    """
    Returns a bounding box (min_lon, min_lat, max_lon, max_lat) centered at (lat, lon)
    that covers approximately the requested area in square feet.
    
    1200 sq ft is approx 111.48 sq meters.
    Side length = sqrt(111.48) = 10.55 meters.
    """
    area_sq_meters = area_sqft * 0.092903
    side_length_meters = math.sqrt(area_sq_meters)
    
    # Approximation: 1 degree latitude ~= 111,000 meters
    # 1 degree longitude ~= 111,000 * cos(lat) meters
    
    delta_lat = (side_length_meters / 2) / 111000.0
    delta_lon = (side_length_meters / 2) / (111000.0 * math.cos(math.radians(lat)))
    
    return (lon - delta_lon, lat - delta_lat, lon + delta_lon, lat + delta_lat)

def get_zoom_level_for_box(lat: float, area_sqft: int, image_size: int = 640) -> int:
    """
    Determine appropriate zoom level to fit the specialized area into the image size.
    We want the area to occupy a significant portion of the image but not all of it.
    """
    # Simply mapping common areas to good zoom levels for 640x640 images
    if area_sqft <= 1500:
        return 20 # Very zoomed in
    return 19
