@echo off
echo Starting ClipHawk Backend Server...
echo.

REM Set Python environment variables for Windows
set PYTHONUNBUFFERED=1
set PYTHONIOENCODING=utf-8

REM Set asyncio policy for Windows
set PYTHONASYNCIODEBUG=0

echo Checking Python installation...
python --version
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo Checking required packages...
cd backend
python -c "import fastapi, yt_dlp, moviepy" 2>nul
if errorlevel 1 (
    echo Installing required packages...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo Error: Failed to install packages
        pause
        exit /b 1
    )
)

echo.
echo Starting FastAPI server...
echo Press Ctrl+C to stop the server
echo.

REM Start the server with Windows-specific settings
python run_server.py

echo.
echo Server stopped.
pause 