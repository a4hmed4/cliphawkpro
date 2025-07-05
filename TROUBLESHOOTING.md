# ClipHawk Troubleshooting Guide

## Common Issues and Solutions

### 1. Windows Connection Errors (WinError 10054)

**Error Message:**
```
ConnectionResetError: [WinError 10054] An existing connection was forcibly closed by the remote host
```

**Causes:**
- Windows-specific asyncio issues
- Browser closing connection prematurely
- Firewall or antivirus interference
- Network timeout

**Solutions:**

#### Option 1: Use Optimized Server Runner (Recommended)
```bash
# Use the optimized server runner
start_backend.bat

# Or manually
cd backend
python run_server.py
```

#### Option 2: Use Hypercorn Instead of Uvicorn
```bash
# Use Hypercorn server
start_backend_hypercorn.bat

# Or manually
cd backend
pip install hypercorn
hypercorn main:app --bind 0.0.0.0:8000 --worker-class asyncio --workers 1
```

#### Option 3: Use WSL (Windows Subsystem for Linux)
```bash
# Install WSL
wsl --install

# Run backend in WSL
wsl
cd /mnt/e/websites/ClipHawk/backend
python main.py
```

#### Option 4: Use Docker
```bash
# Use Docker container
start_backend_docker.bat

# Or manually
docker-compose up --build
```

#### Option 5: Disable Windows Firewall Temporarily
1. Open Windows Security
2. Go to Firewall & network protection
3. Turn off Windows Defender Firewall temporarily
4. Test the application
5. Re-enable firewall after testing

#### Option 6: Use Different Browser
- Try Chrome, Firefox, or Edge
- Disable browser extensions temporarily
- Clear browser cache

### 2. Download Issues (.mhtml files)

**Problem:** Downloads result in .mhtml files instead of videos

**Solutions:**
1. **Check URL validity** - Ensure the video is public and accessible
2. **Update yt-dlp** - Run `pip install --upgrade yt-dlp`
3. **Use different user agent** - The backend now includes a modern user agent
4. **Check network** - Ensure no VPN or proxy is blocking the connection

### 3. Backend Won't Start

**Solutions:**
1. **Check Python version** - Ensure Python 3.8+ is installed
2. **Install dependencies** - Run `pip install -r requirements.txt`
3. **Check port availability** - Ensure port 8000 is not in use
4. **Run as administrator** - Try running the batch file as administrator

### 4. Frontend Can't Connect to Backend

**Solutions:**
1. **Check backend is running** - Ensure `http://localhost:8000` is accessible
2. **Check CORS** - Backend is configured for `http://localhost:3000`
3. **Check firewall** - Allow Python/uvicorn through firewall
4. **Try different port** - Change backend port if 8000 is blocked

### 5. File Download Fails

**Solutions:**
1. **Check file size** - Large files may timeout
2. **Use different browser** - Some browsers handle downloads differently
3. **Check disk space** - Ensure enough space for downloads
4. **Disable antivirus** - Temporarily disable real-time protection

## Performance Tips

### For Better Download Performance:
1. **Use SSD storage** - Faster read/write speeds
2. **Close other applications** - Free up system resources
3. **Use wired connection** - More stable than WiFi
4. **Increase timeout** - Modify timeout settings in the code

### For Development:
1. **Use WSL** - Better performance than Windows for Python development
2. **Use Docker** - Consistent environment across systems
3. **Monitor logs** - Check console output for detailed error messages

## Environment Variables

Add these to your environment for better performance:

```bash
# Windows (in batch file)
set PYTHONUNBUFFERED=1
set PYTHONIOENCODING=utf-8
set PYTHONASYNCIODEBUG=0

# Linux/Mac
export PYTHONUNBUFFERED=1
export PYTHONIOENCODING=utf-8
export PYTHONASYNCIODEBUG=0
```

## Logging

The backend includes comprehensive logging. Check the console output for:
- Connection errors
- Download progress
- File processing status
- System information

## Support

If you continue to experience issues:
1. Check the console logs for specific error messages
2. Try the solutions above in order
3. Consider using WSL or Docker for better compatibility
4. Report specific error messages with system details 