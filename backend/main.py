from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import StreamingResponse, FileResponse, JSONResponse
from fastapi.security import HTTPBearer
import yt_dlp
import os
import tempfile
import shutil
from moviepy.editor import VideoFileClip
import asyncio
from typing import Optional
import uuid
import subprocess
import logging
from datetime import datetime, timedelta
import hashlib
import secrets
import re
import time
from pydantic import BaseModel
import sys
import signal
import socket
import urllib.parse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ClipHawk Pro API",
    description="Professional video downloader API",
    version="1.0.0",
    docs_url=None,  # Disable Swagger UI in production
    redoc_url=None  # Disable ReDoc in production
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["localhost", "127.0.0.1", "yourdomain.com"]
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS configuration with security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
    max_age=3600,
)

# Enhanced security middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    try:
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com;"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        return response
    except Exception as e:
        logger.error(f"Error in security headers middleware: {e}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )

# Enhanced rate limiting
class RateLimiter:
    def __init__(self):
        self.requests = {}
        self.max_requests = 20  # Increased for better UX
        self.window = 60  # seconds
        self.blocked_ips = {}
        self.block_duration = 300  # 5 minutes
    
    def is_allowed(self, client_ip: str) -> bool:
        now = datetime.now()
        
        # Check if IP is blocked
        if client_ip in self.blocked_ips:
            if now - self.blocked_ips[client_ip] < timedelta(seconds=self.block_duration):
                return False
            else:
                del self.blocked_ips[client_ip]
        
        if client_ip not in self.requests:
            self.requests[client_ip] = []
        
        # Remove old requests
        self.requests[client_ip] = [
            req_time for req_time in self.requests[client_ip]
            if now - req_time < timedelta(seconds=self.window)
        ]
        
        if len(self.requests[client_ip]) >= self.max_requests:
            # Block IP for 5 minutes
            self.blocked_ips[client_ip] = now
            return False
        
        self.requests[client_ip].append(now)
        return True

rate_limiter = RateLimiter()

# Rate limiting middleware
@app.middleware("http")
async def rate_limit_middleware(request, call_next):
    client_ip = request.client.host
    
    if not rate_limiter.is_allowed(client_ip):
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Please try again later."}
        )
    
    response = await call_next(request)
    return response

# Enhanced file validation
def validate_file_extension(filename: str) -> bool:
    allowed_extensions = {'.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm', '.mp3', '.wav', '.aac', '.m4a'}
    return any(filename.lower().endswith(ext) for ext in allowed_extensions)

def validate_file_size(file_size: int) -> bool:
    max_size = 500 * 1024 * 1024  # 500MB limit
    return file_size <= max_size

def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal attacks"""
    import re
    # Remove any path separators and dangerous characters
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    # Limit length
    if len(filename) > 100:
        filename = filename[:100]
    return filename

def validate_url(url: str) -> bool:
    # Enhanced URL validation
    url_pattern = re.compile(
        r'^https?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
        r'localhost|'  # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    
    # Additional checks
    if not bool(url_pattern.match(url)):
        return False
    
    # Check for suspicious patterns
    suspicious_patterns = [
        'javascript:', 'data:', 'file:', 'ftp:', 'gopher:',
        'mailto:', 'news:', 'telnet:', 'view-source:'
    ]
    
    for pattern in suspicious_patterns:
        if pattern in url.lower():
            return False
    
    return True

# Create temp directory for downloads
TEMP_DIR = "temp_downloads"
os.makedirs(TEMP_DIR, exist_ok=True)

class DownloadRequest(BaseModel):
    url: str
    quality: str
    format: str  # "mp4" or "mp3"
    ext: str = "mp4"  # الامتداد المطلوب

class DownloadResponse(BaseModel):
    message: str
    filename: Optional[str] = None

class TrimResponse(BaseModel):
    message: str
    filename: Optional[str] = None

def get_yt_dlp_options(quality: str, format: str, ext: str):
    """Configure yt-dlp options based on quality, format, and extension"""
    # Map extension to yt-dlp format string
    video_ext_map = {
        'mp4': 'mp4',
        'webm': 'webm',
        'mkv': 'mkv',
        'avi': 'avi',
    }
    audio_ext_map = {
        'mp3': 'mp3',
        'm4a': 'm4a',
        'aac': 'aac',
    }
    if format == "mp3":
        return {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': ext if ext in audio_ext_map else 'mp3',
                'preferredquality': '192',
            }],
            'outtmpl': f'{TEMP_DIR}/audio_protected.%(ext)s',
        }
    else:
        # For video, map quality to format
        quality_map = {
            "144p": "worst[height<=144]",
            "240p": "worst[height<=240]",
            "360p": "worst[height<=360]",
            "480p": "worst[height<=480]",
            "720p": "worst[height<=720]",
            "1080p": "worst[height<=1080]",
        }
        fmt = video_ext_map.get(ext, 'mp4')
        return {
            'format': f'{quality_map.get(quality, "best")}+{fmt}/bestvideo+bestaudio/best',
            'merge_output_format': ext if ext in video_ext_map else 'mp4',
            'outtmpl': f'{TEMP_DIR}/video_protected.%(ext)s',
        }

def convert_audio_file(input_path: str, output_path: str, target_format: str):
    """Convert audio file to target format using ffmpeg"""
    try:
        codec_map = {
            'mp3': 'aac',
            'm4a': 'm4a',
            'aac': 'aac',
            'wav': 'pcm_s16le'
        }
        
        codec = codec_map.get(target_format, 'aac')
        
        cmd = [
            'ffmpeg', '-i', input_path, '-vn',
            '-acodec', codec,
            '-ab', '192k',
            '-ar', '44100',
            '-y', output_path
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0 and os.path.exists(output_path):
            return True
            
        return False
    except Exception as e:
        logger.error(f"Audio conversion failed: {e}")
        return False

def trim_video(input_path: str, output_path: str, start_time: float, end_time: float):
    """Trim video using ffmpeg directly"""
    try:
        logger.info(f"Starting video trim: {input_path} -> {output_path}")
        
        # Get input file size for progress estimation
        input_size = os.path.getsize(input_path)
        logger.info(f"Input file size: {input_size} bytes")
        
        cmd = ['ffmpeg', '-i', input_path, '-y']
        
        # Add trim parameters
        if end_time is not None and end_time > start_time:
            duration = end_time - start_time
            cmd.extend(['-ss', str(start_time), '-t', str(duration)])
        else:
            cmd.extend(['-ss', str(start_time)])
        
        # Video codec options - more compatible settings
        cmd.extend([
            '-c:v', 'libx264',
            '-c:a', 'aac',
            '-preset', 'fast',  # Faster encoding
            '-crf', '23',
            '-movflags', '+faststart'  # Better streaming
        ])
        
        cmd.append(output_path)
        
        logger.info(f"Running video trim command: {' '.join(cmd)}")
        
        # Increase timeout for large files
        timeout = 600 if input_size > 100 * 1024 * 1024 else 300  # 10 minutes for files > 100MB
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        
        if result.returncode == 0 and os.path.exists(output_path):
            file_size = os.path.getsize(output_path)
            logger.info(f"Video trim successful: {output_path} ({file_size} bytes)")
            return file_size > 0
        else:
            logger.error(f"FFmpeg video trim error: {result.stderr}")
            logger.error(f"FFmpeg stdout: {result.stdout}")
            return False
    except subprocess.TimeoutExpired:
        logger.error(f"Video trim timeout after {timeout} seconds")
        return False
    except Exception as e:
        logger.error(f"Error trimming video: {e}")
        return False

def trim_audio(input_path: str, output_path: str, start_time: float, end_time: float):
    """Trim audio using ffmpeg directly"""
    try:
        logger.info(f"Starting audio trim: {input_path} -> {output_path}")
        
        # Determine output format from file extension
        output_ext = os.path.splitext(output_path)[1].lower()
        
        cmd = ['ffmpeg', '-i', input_path, '-y']
        
        # Add trim parameters
        if end_time is not None and end_time > start_time:
            duration = end_time - start_time
            cmd.extend(['-ss', str(start_time), '-t', str(duration)])
        else:
            cmd.extend(['-ss', str(start_time)])
        
        # Audio codec options based on output format
        if output_ext == '.mp3':
            # For MP3 output, check if input is already MP3
            input_ext = os.path.splitext(input_path)[1].lower()
            if input_ext == '.mp3':
                # If input is MP3, use copy codec
                cmd.extend([
                    '-vn',  # No video
                    '-acodec', 'copy'  # Copy audio stream without re-encoding
                ])
            else:
                # If input is not MP3, convert to MP3 using libmp3lame
                cmd.extend([
                    '-vn',  # No video
                    '-acodec', 'libmp3lame',
                    '-ab', '192k',  # Audio bitrate
                    '-ar', '44100',  # Sample rate
                    '-ac', '2'  # 2 channels (stereo)
                ])
        elif output_ext == '.m4a':
            # For M4A output, use aac codec
            cmd.extend([
                '-vn',  # No video
                '-acodec', 'aac',
                '-ab', '192k',  # Audio bitrate
                '-ar', '44100',  # Sample rate
                '-ac', '2'  # 2 channels (stereo)
            ])
        else:
            # For other formats (aac, wav), use aac codec
            cmd.extend([
                '-vn',  # No video
                '-acodec', 'aac',
                '-ab', '192k',  # Audio bitrate
                '-ar', '44100',  # Sample rate
                '-ac', '2'  # 2 channels (stereo)
            ])
        
        cmd.append(output_path)
        
        logger.info(f"Running audio trim command: {' '.join(cmd)}")
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        
        if result.returncode == 0 and os.path.exists(output_path):
            file_size = os.path.getsize(output_path)
            logger.info(f"Audio trim successful: {output_path} ({file_size} bytes)")
            return file_size > 0
        else:
            logger.error(f"FFmpeg audio trim error: {result.stderr}")
            logger.error(f"FFmpeg stdout: {result.stdout}")
            # Try fallback method for MP3 files
            if output_ext == '.mp3' and ('Invalid audio stream' in result.stderr or 'Invalid argument' in result.stderr):
                logger.info("Trying fallback method for MP3")
                return trim_audio_fallback(input_path, output_path, start_time, end_time)
            return False
    except subprocess.TimeoutExpired:
        logger.error("Audio trim timeout")
        return False
    except Exception as e:
        logger.error(f"Error trimming audio: {e}")
        return False

def trim_audio_fallback(input_path: str, output_path: str, start_time: float, end_time: float):
    """Fallback method for trimming audio when main method fails"""
    try:
        logger.info(f"Using fallback method for audio trim: {input_path} -> {output_path}")
        
        # Determine output format from file extension
        output_ext = os.path.splitext(output_path)[1].lower()
        input_ext = os.path.splitext(input_path)[1].lower()
        
        cmd = ['ffmpeg', '-i', input_path, '-y']
        
        # Add trim parameters
        if end_time is not None and end_time > start_time:
            duration = end_time - start_time
            cmd.extend(['-ss', str(start_time), '-t', str(duration)])
        else:
            cmd.extend(['-ss', str(start_time)])
        
        # Use appropriate codec based on output format
        if output_ext == '.mp3':
            # Always use libmp3lame for MP3 output in fallback
            cmd.extend([
                '-vn',  # No video
                '-acodec', 'libmp3lame',
                '-ab', '192k',  # Audio bitrate
                '-ar', '44100',  # Sample rate
                '-ac', '2'  # 2 channels (stereo)
            ])
        else:
            # For other formats, use aac codec
            cmd.extend([
                '-vn',  # No video
                '-acodec', 'aac',
                '-ab', '192k',  # Audio bitrate
                '-ar', '44100',  # Sample rate
                '-ac', '2'  # 2 channels (stereo)
            ])
        
        cmd.append(output_path)
        
        logger.info(f"Running fallback audio trim command: {' '.join(cmd)}")
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        
        if result.returncode == 0 and os.path.exists(output_path):
            file_size = os.path.getsize(output_path)
            logger.info(f"Fallback audio trim successful: {output_path} ({file_size} bytes)")
            return file_size > 0
        else:
            logger.error(f"Fallback FFmpeg audio trim error: {result.stderr}")
            logger.error(f"Fallback FFmpeg stdout: {result.stdout}")
            return False
    except Exception as e:
        logger.error(f"Error in fallback audio trim: {e}")
        return False

def convert_video_format(input_path: str, output_path: str, target_format: str):
    """Convert video file to target format using ffmpeg"""
    try:
        format_map = {
            'avi': ['-c:v', 'libx264', '-c:a', 'aac'],
            'mkv': ['-c:v', 'libx264', '-c:a', 'aac'],
            'webm': ['-c:v', 'libvpx', '-c:a', 'aac'],
            'mp4': ['-c:v', 'libx264', '-c:a', 'aac']
        }
        
        codec_options = format_map.get(target_format, ['-c:v', 'libx264', '-c:a', 'aac'])
        
        cmd = ['ffmpeg', '-i', input_path, '-y'] + codec_options + [output_path]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        
        if result.returncode == 0 and os.path.exists(output_path):
            return True
        return False
    except Exception as e:
        logger.error(f"Video conversion failed: {e}")
        return False

@app.post("/download")
async def download_video(request: DownloadRequest):
    # Rate limiting check
    client_ip = request.client.host
    if not rate_limiter.is_allowed(client_ip):
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
    
    url = request.url
    platform = getattr(request, 'platform', None)
    
    # Enhanced URL validation
    if not validate_url(url):
        raise HTTPException(status_code=400, detail="Invalid URL format")
    
    # Platform validation
    if platform == 'youtube' and not ('youtube.com' in url or 'youtu.be' in url):
        raise HTTPException(status_code=400, detail="URL must be a YouTube link.")
    if platform == 'tiktok' and 'tiktok.com' not in url:
        raise HTTPException(status_code=400, detail="URL must be a TikTok link.")
    if platform == 'instagram' and 'instagram.com' not in url:
        raise HTTPException(status_code=400, detail="URL must be an Instagram link.")
    if platform == 'twitter' and 'twitter.com' not in url:
        raise HTTPException(status_code=400, detail="URL must be a Twitter link.")
    if platform == 'facebook' and 'facebook.com' not in url:
        raise HTTPException(status_code=400, detail="URL must be a Facebook link.")
    
    # Set output extension
    ext = request.ext or 'mp4'
    # Set quality
    quality = request.quality or '720p'
    
    # Validate extension
    if ext not in ['mp4', 'webm', 'mkv', 'avi', 'mp3', 'm4a', 'aac']:
        raise HTTPException(status_code=400, detail="Invalid output format")
    
    # yt-dlp options with fallback
    ytdlp_opts = {
        'outtmpl': os.path.join(TEMP_DIR, '%(title)s.%(ext)s'),
        'format': 'best',  # Start with best available
        'postprocessors': [],
        'ignoreerrors': True,
        'no_warnings': False,
        'extractaudio': request.format == 'mp3' or ext in ['mp3', 'm4a', 'aac'],
    }
    
    if request.format == 'mp3' or ext in ['mp3', 'm4a', 'aac']:
        # Audio extraction
        ytdlp_opts['format'] = 'bestaudio/best'
        
        # Map extensions to ffmpeg codecs
        codec_map = {
            'mp3': 'aac',
            'm4a': 'm4a',
            'aac': 'aac',
        }
        
        preferred_codec = codec_map.get(ext, 'aac')
        
        ytdlp_opts['postprocessors'].append({
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'aac',  # Always use AAC for better compatibility
            'preferredquality': quality.replace('k', '') if quality and quality.endswith('k') else '192',
        })
        
    else:
        # Video - use simpler format selection to avoid merge errors
        ytdlp_opts['format'] = 'best[ext=mp4]/best'
        ytdlp_opts['merge_output_format'] = 'mp4'
    # Download
    try:
        with yt_dlp.YoutubeDL(ytdlp_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            
            # If audio, change extension
            if request.format == 'mp3' or ext in ['mp3', 'm4a', 'aac']:
                base = os.path.splitext(filename)[0]
                target_filename = base + '.' + ext
                
                # Check if the converted file exists
                if not os.path.exists(target_filename):
                    # Try to find the actual downloaded file
                    for file in os.listdir(TEMP_DIR):
                        if file.startswith(os.path.basename(base)) and file.endswith(('.mp3', '.m4a', '.aac')):
                            filename = os.path.join(TEMP_DIR, file)
                            break
                            
                # Always rename to the correct extension
                if filename.endswith('.m4a'):
                    if ext == 'mp3':
                        # Rename m4a to mp3
                        new_filename = os.path.splitext(filename)[0] + '.mp3'
                        try:
                            os.rename(filename, new_filename)
                            filename = new_filename
                        except:
                            pass
                    elif ext == 'aac':
                        # Rename m4a to aac
                        new_filename = os.path.splitext(filename)[0] + '.aac'
                        try:
                            os.rename(filename, new_filename)
                            filename = new_filename
                        except:
                            pass
                        
                # Use target filename if it exists
                if os.path.exists(target_filename):
                    filename = target_filename
            
            # Handle video formats
            else:
                # For video, always download as mp4 first
                if not filename.endswith('.mp4'):
                    # Find the actual mp4 file
                    for file in os.listdir(TEMP_DIR):
                        if file.startswith(os.path.basename(os.path.splitext(filename)[0])) and file.endswith('.mp4'):
                            filename = os.path.join(TEMP_DIR, file)
                            break
                            
                # Convert to target format if needed
                if ext != 'mp4' and filename.endswith('.mp4'):
                    input_file = filename
                    output_file = os.path.splitext(filename)[0] + f'.{ext}'
                    if convert_video_format(input_file, output_file, ext):
                        filename = output_file
            
            safe_filename = os.path.basename(filename)
            
            # Check for .html/.mhtml or very small files
            file_ext = os.path.splitext(filename)[1].lower()
            if file_ext in ['.html', '.mhtml'] or not os.path.exists(filename) or os.path.getsize(filename) < 100*1024:
                if os.path.exists(filename):
                    os.remove(filename)
                raise HTTPException(status_code=500, detail="Download failed: The site returned a web page instead of a video/audio file. This usually means the video is protected, unavailable, or your network is blocking the download. Try another link or check your connection.")
                
        return {"message": "Download successful!", "filename": safe_filename}
    except Exception as e:
        # Clean up any partial downloads
        try:
            for file in os.listdir(TEMP_DIR):
                if file.startswith('Lege-Cy') or file.startswith('%(title)s'):
                    os.remove(os.path.join(TEMP_DIR, file))
        except:
            pass
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")

@app.post("/trim", response_model=TrimResponse)
async def trim_video_endpoint(
    trim_start: float = Form(0),
    trim_end: Optional[float] = Form(None),
    format: str = Form("mp4"),
    filename: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    """Trim video/audio file"""
    try:
        # Validate trim parameters
        if trim_start < 0:
            raise HTTPException(status_code=400, detail="Start time cannot be negative")
        
        if trim_end is not None and trim_end <= trim_start:
            raise HTTPException(status_code=400, detail="End time must be greater than start time")
        
        input_file = None
        
        if filename:
            # Use downloaded file
            input_file = os.path.join(TEMP_DIR, filename)
            if not os.path.exists(input_file):
                raise HTTPException(status_code=404, detail="File not found")
        elif file:
            # Use uploaded file
            unique_id = str(uuid.uuid4())[:8]
            input_file = os.path.join(TEMP_DIR, f"{unique_id}_{file.filename}")
            with open(input_file, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        else:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Detect if input file is audio-only
        input_ext = os.path.splitext(input_file)[1].lower()
        audio_extensions = {'.mp3', '.m4a', '.aac', '.wav', '.flac', '.ogg'}
        is_audio_file = input_ext in audio_extensions
        
        # Check if this is audio extraction from video (extract action)
        is_audio_extraction = False
        if not is_audio_file and format in ['mp3', 'm4a', 'aac']:
            is_audio_extraction = True
            logger.info(f"Detected audio extraction from video: {input_file}")
        
        # Determine output format based on input and requested format
        if is_audio_file or is_audio_extraction:
            # For audio files or audio extraction, use the requested format or default to mp3
            output_format = format if format in ['mp3', 'm4a', 'aac'] else 'mp3'
            extension = f".{output_format}"
        else:
            # For video files, use the requested format or default to mp4
            output_format = format if format in ['mp4', 'webm', 'mkv', 'avi'] else 'mp4'
            extension = f".{output_format}"
        
        # Create output filename
        base_name = os.path.splitext(input_file)[0]
        if is_audio_extraction:
            output_file = f"{base_name}_extracted{extension}"
        else:
            output_file = f"{base_name}_trimmed{extension}"
        
        logger.info(f"Processing file: {input_file} -> {output_file}")
        logger.info(f"Start time: {trim_start}, End time: {trim_end}, Format: {output_format}")
        logger.info(f"Is audio file: {is_audio_file}, Is audio extraction: {is_audio_extraction}")
        
        # Process the file
        if is_audio_file or is_audio_extraction:
            success = trim_audio(input_file, output_file, trim_start, trim_end)
        else:
            success = trim_video(input_file, output_file, trim_start, trim_end)
        
        if success and os.path.exists(output_file):
            # Verify the output file is not empty
            if os.path.getsize(output_file) > 0:
                return TrimResponse(
                    message="Trim completed successfully",
                    filename=os.path.basename(output_file)
                )
            else:
                # Remove empty file
                os.remove(output_file)
                raise HTTPException(status_code=500, detail="Trim resulted in empty file")
        else:
            # Try fallback method for audio extraction
            if is_audio_extraction and not success:
                logger.info("Trying fallback method for audio extraction")
                fallback_success = trim_audio_fallback(input_file, output_file, trim_start, trim_end)
                if fallback_success and os.path.exists(output_file) and os.path.getsize(output_file) > 0:
                    return TrimResponse(
                        message="Audio extraction completed successfully (using fallback method)",
                        filename=os.path.basename(output_file)
                    )
            
            raise HTTPException(status_code=500, detail="Failed to trim video/audio")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Trim failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Trim failed: {str(e)}")

@app.get("/download/{filename}")
async def get_download(filename: str):
    """Stream the downloaded file to the client"""
    try:
        file_path = os.path.join(TEMP_DIR, filename)
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
        
        def iterfile():
            try:
                with open(file_path, "rb") as f:
                    while True:
                        chunk = f.read(8192)  # Read in chunks
                        if not chunk:
                            break
                        yield chunk
            except (ConnectionResetError, BrokenPipeError, socket.error) as e:
                logger.warning(f"Connection error during file streaming: {e}")
                return
            except Exception as e:
                logger.error(f"Error reading file: {e}")
                return
        
        # Determine content type by extension
        ext = filename.split('.')[-1].lower()
        content_types = {
            'mp4': 'video/mp4',
            'webm': 'video/webm',
            'mkv': 'video/x-matroska',
            'mov': 'video/quicktime',
            'avi': 'video/x-msvideo',
            'flv': 'video/x-flv',
            'wmv': 'video/x-ms-wmv',
            'mp3': 'audio/mpeg',
            'm4a': 'audio/mp4',
            'aac': 'audio/aac',
            'wav': 'audio/wav',
        }
        content_type = content_types.get(ext, 'application/octet-stream')
        
        ascii_filename = ("".join([c if ord(c) < 128 else "_" for c in filename]) or "downloaded_file")
        content_disposition = (
            f"attachment; filename=\"{ascii_filename}\"; "
            f"filename*=UTF-8''{urllib.parse.quote(filename)}"
        )
        
        return StreamingResponse(
            iterfile(),
            media_type=content_type,
            headers={
                "Content-Disposition": content_disposition,
                "Cache-Control": "no-cache",
                "Connection": "close"
            }
        )
    except (ConnectionResetError, BrokenPipeError, socket.error) as e:
        logger.warning(f"Connection error in download endpoint: {e}")
        return JSONResponse(
            status_code=499,
            content={"detail": "Connection was closed by client"}
        )
    except Exception as e:
        logger.error(f"Error in download endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.delete("/cleanup/{filename}")
async def cleanup_file(filename: str):
    """Clean up downloaded file"""
    file_path = os.path.join(TEMP_DIR, filename)
    
    if os.path.exists(file_path):
        os.remove(file_path)
        return {"message": "File cleaned up successfully"}
    else:
        raise HTTPException(status_code=404, detail="File not found")

@app.get("/")
async def root():
    return {"message": "ClipHawk API is running!"}

# Signal handlers for graceful shutdown
def signal_handler(signum, frame):
    logger.info(f"Received signal {signum}, shutting down gracefully...")
    sys.exit(0)

# Register signal handlers
signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

# Suppress asyncio connection lost errors on Windows
def suppress_asyncio_errors():
    """Suppress common asyncio errors on Windows"""
    import warnings
    
    # Suppress specific asyncio warnings
    warnings.filterwarnings("ignore", category=DeprecationWarning, module="asyncio")
    warnings.filterwarnings("ignore", message=".*_ProactorBasePipeTransport.*")
    
    # Override asyncio error handler
    def custom_exception_handler(loop, context):
        if "ProactorBasePipeTransport" in str(context.get('exception', '')):
            # Ignore connection reset errors
            return
        # Log other exceptions
        logger.error(f"Asyncio exception: {context}")
    
    # Set custom exception handler
    try:
        loop = asyncio.get_event_loop()
        loop.set_exception_handler(custom_exception_handler)
    except RuntimeError:
        # No event loop running
        pass

# Call the suppression function
suppress_asyncio_errors()

@app.on_event("startup")
async def startup_event():
    logger.info("ClipHawk Pro API starting up...")
    cleanup_old_files()
    print('PYTHON:', sys.executable)
    print('yt-dlp:', subprocess.getoutput('yt-dlp --version'))
    print('ffmpeg:', subprocess.getoutput('ffmpeg -version'))

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("ClipHawk Pro API shutting down...")
    # Clean up all temporary files
    try:
        shutil.rmtree(TEMP_DIR)
        os.makedirs(TEMP_DIR)
    except Exception as e:
        logger.error(f"Error during cleanup: {e}")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

def cleanup_old_files():
    # دالة تنظيف الملفات المؤقتة (قابلة للتطوير لاحقاً)
    pass

if __name__ == "__main__":
    import uvicorn
    
    # Configure asyncio for Windows with better error handling
    if sys.platform == "win32":
        # Use WindowsSelectorEventLoopPolicy instead of ProactorEventLoopPolicy
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        
        # Suppress asyncio warnings
        import warnings
        warnings.filterwarnings("ignore", category=DeprecationWarning, module="asyncio")
    
    # Configure uvicorn with better error handling
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        log_level="warning",  # Reduce log noise
        access_log=False,     # Disable access logs to reduce noise
        loop="asyncio",
        timeout_keep_alive=5,  # Shorter keep-alive
        timeout_graceful_shutdown=10,
        limit_concurrency=100,
        limit_max_requests=1000,
        backlog=2048
    ) 