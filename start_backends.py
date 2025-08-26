import subprocess
import time
import sys
import os

def start_backends():
    print("🚀 Starting Backend Servers...")
    
    # Start Flask backend (for test-dashboard-ui)
    print("📡 Starting Flask Backend (Port 5000)...")
    flask_process = subprocess.Popen([
        sys.executable, "dbapi.py"
    ], cwd=os.getcwd())
    
    # Wait a moment for Flask to start
    time.sleep(3)
    
    # Start FastAPI backend (for main CRM)
    print("📡 Starting FastAPI Backend (Port 8000)...")
    fastapi_process = subprocess.Popen([
        sys.executable, "-m", "uvicorn", "backend.main:app", "--reload", "--port", "8000"
    ], cwd=os.getcwd())
    
    print("✅ Both backends started!")
    print("📊 Flask Backend: http://localhost:5000")
    print("📊 FastAPI Backend: http://localhost:8000")
    print("🔄 Press Ctrl+C to stop both servers")
    
    try:
        # Keep the script running
        flask_process.wait()
        fastapi_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Stopping servers...")
        flask_process.terminate()
        fastapi_process.terminate()
        print("✅ Servers stopped!")

if __name__ == "__main__":
    start_backends() 