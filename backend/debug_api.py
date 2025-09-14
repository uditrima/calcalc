#!/usr/bin/env python3
import requests
import json
from datetime import datetime

def test_api():
    base_url = "http://localhost:5000/api"
    
    # Test date parsing
    test_date = "2025-09-13"
    print(f"Testing date: {test_date}")
    
    try:
        parsed = datetime.strptime(test_date, '%Y-%m-%d').date()
        print(f"Date parsed successfully: {parsed}")
    except Exception as e:
        print(f"Date parsing error: {e}")
        return
    
    # Test API call
    url = f"{base_url}/diary/entries?date={test_date}"
    print(f"Testing URL: {url}")
    
    try:
        response = requests.get(url)
        print(f"Status code: {response.status_code}")
        print(f"Response headers: {dict(response.headers)}")
        print(f"Response body: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Parsed JSON: {json.dumps(data, indent=2)}")
        else:
            print("Error response received")
            
    except Exception as e:
        print(f"Request error: {e}")

if __name__ == "__main__":
    test_api()
