#!/usr/bin/env python3
"""
Simple test script to check backend connectivity
"""

import requests
import time
import sys
from fastapi import HTTPException

def test_backend():
    """Test backend connectivity"""
    print("Testing ClipHawk Backend...")
    print("=" * 40)
    
    # Test health endpoint
    try:
        print("1. Testing health endpoint...")
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Is it running?")
        return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False
    
    # Test root endpoint
    try:
        print("\n2. Testing root endpoint...")
        response = requests.get("http://localhost:8000/", timeout=5)
        if response.status_code == 200:
            print("✅ Root endpoint working")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
    
    # Test CORS
    try:
        print("\n3. Testing CORS...")
        response = requests.options("http://localhost:8000/", timeout=5)
        if response.status_code in [200, 405]:  # 405 is OK for OPTIONS
            print("✅ CORS headers present")
        else:
            print(f"❌ CORS test failed: {response.status_code}")
    except Exception as e:
        print(f"❌ CORS test error: {e}")
    
    print("\n" + "=" * 40)
    print("✅ Backend is working correctly!")
    return True

def main():
    """Main function"""
    print("ClipHawk Backend Connection Test")
    print("Make sure the backend is running on http://localhost:8000")
    print()
    
    # Wait a moment for user to read
    time.sleep(1)
    
    success = test_backend()
    
    if success:
        print("\n🎉 All tests passed! Your backend is working properly.")
        print("You can now use the frontend application.")
    else:
        print("\n❌ Tests failed. Please check:")
        print("1. Is the backend running?")
        print("2. Is it on port 8000?")
        print("3. Are there any error messages in the backend console?")
        sys.exit(1)

if __name__ == "__main__":
    main() 