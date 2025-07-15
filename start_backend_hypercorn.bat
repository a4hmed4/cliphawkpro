@echo off
echo Starting ClipHawk Backend with Hypercorn (Windows Optimized)...
echo.

REM Set Python environment variables for Windows
set PYTHONUNBUFFERED=1
set PYTHONIOENCODING=utf-8
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

REM Install Hypercorn if not installed
python -c "import hypercorn" 2>nul
if errorlevel 1 (
    echo Installing Hypercorn...
    pip install hypercorn
    if errorlevel 1 (
        echo Error: Failed to install Hypercorn
        pause
        exit /b 1
    )
)

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
echo Starting Hypercorn server...
echo Backend will be available at http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

REM Start the server with Hypercorn
hypercorn main:app --bind 0.0.0.0:8000 --worker-class asyncio --workers 1 --access-logfile - --error-logfile -

echo.
echo Server stopped.
pause 