@echo off
echo Starting ClipHawk Backend with Docker...
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not installed or not running
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not running
    echo Please start Docker Desktop
    pause
    exit /b 1
)

echo Building Docker image...
docker-compose build
if errorlevel 1 (
    echo Error: Failed to build Docker image
    pause
    exit /b 1
)

echo.
echo Starting ClipHawk Backend container...
echo Backend will be available at http://localhost:8000
echo Press Ctrl+C to stop the container
echo.

REM Start the container
docker-compose up

echo.
echo Container stopped.
pause 