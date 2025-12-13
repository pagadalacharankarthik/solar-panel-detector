import os
import requests
import sys

# Usage: python check_google_api.py YOUR_API_KEY
# Or set env var SOLAR_API_KEY

def check_api(api_key):
    if not api_key:
        print("❌ No API Key provided.")
        return

    lat, lon = 36.1699, -115.1398 # Las Vegas
    url = f"https://maps.googleapis.com/maps/api/staticmap?center={lat},{lon}&zoom=20&size=640x640&maptype=satellite&key={api_key}"
    
    print(f"Testing API Key: {api_key[:5]}...{api_key[-3:]}")
    print(f"Requesting URL: {url.replace(api_key, 'HIDDEN')}")
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print("✅ SUCCESS! Grid image fetched successfully.")
            print(f"Image size: {len(response.content)} bytes")
            
            # Save it to prove it
            with open("test_api_image.png", "wb") as f:
                f.write(response.content)
            print("✅ Saved 'test_api_image.png' to current directory.")
        else:
            print(f"❌ FAILED. Status Code: {response.status_code}")
            print(f"Error Message: {response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    key = os.getenv("SOLAR_API_KEY")
    if len(sys.argv) > 1:
        key = sys.argv[1]
    
    if not key:
        print("Please provide key as argument: python check_google_api.py YOUR_KEY")
    else:
        check_api(key)
