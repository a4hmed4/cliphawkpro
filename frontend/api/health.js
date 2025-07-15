import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        yt_dlp: false,
        ffmpeg: false,
        temp_directory: false,
        logs_directory: false
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      node_version: process.version
    };

    // فحص yt-dlp
    try {
      const ytdlpPath = process.env.YTDLP_PATH || 'yt-dlp';
      await new Promise((resolve, reject) => {
        execFile(ytdlpPath, ['--version'], (error, stdout) => {
          if (error) reject(error);
          else {
            healthStatus.services.yt_dlp = true;
            healthStatus.yt_dlp_version = stdout.trim();
            resolve();
          }
        });
      });
    } catch (error) {
      healthStatus.services.yt_dlp = false;
      healthStatus.yt_dlp_error = error.message;
    }

    // فحص ffmpeg
    try {
      await new Promise((resolve, reject) => {
        execFile('ffmpeg', ['-version'], (error, stdout) => {
          if (error) reject(error);
          else {
            healthStatus.services.ffmpeg = true;
            const versionLine = stdout.split('\n')[0];
            healthStatus.ffmpeg_version = versionLine.replace('ffmpeg version ', '').split(' ')[0];
            resolve();
          }
        });
      });
    } catch (error) {
      healthStatus.services.ffmpeg = false;
      healthStatus.ffmpeg_error = error.message;
    }

    // فحص مجلد temp_downloads
    const tempDir = path.join(process.cwd(), 'temp_downloads');
    try {
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      healthStatus.services.temp_directory = true;
      healthStatus.temp_directory_size = fs.readdirSync(tempDir).length;
    } catch (error) {
      healthStatus.services.temp_directory = false;
      healthStatus.temp_directory_error = error.message;
    }

    // فحص مجلد logs
    const logsDir = path.join(process.cwd(), 'logs');
    try {
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      healthStatus.services.logs_directory = true;
    } catch (error) {
      healthStatus.services.logs_directory = false;
      healthStatus.logs_directory_error = error.message;
    }

    // تحديد الحالة العامة
    const allServicesWorking = Object.values(healthStatus.services).every(service => service === true);
    healthStatus.status = allServicesWorking ? 'healthy' : 'degraded';

    res.status(200).json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
} 