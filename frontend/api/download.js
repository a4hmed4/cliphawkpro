import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const ytdlpPath = process.env.YTDLP_PATH || 'yt-dlp';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url, quality = 'best', format = 'mp4', ext = 'mp4', platform } = req.body || {};

  if (!url || !/^https?:\/\/.+/.test(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const allowedExt = ['mp4', 'webm', 'mkv', 'avi', 'mp3', 'm4a', 'aac'];
  if (!allowedExt.includes(ext)) {
    return res.status(400).json({ error: 'Invalid output format' });
  }

  // تحقق من المنصة
  const supportedPlatforms = [
    { name: 'youtube', match: ['youtube.com', 'youtu.be'] },
    { name: 'tiktok', match: ['tiktok.com'] },
    { name: 'instagram', match: ['instagram.com'] },
    { name: 'twitter', match: ['twitter.com'] },
    { name: 'facebook', match: ['facebook.com'] },
  ];
  const found = supportedPlatforms.find(p => platform === p.name && p.match.some(m => url.includes(m)));
  if (!found) {
    return res.status(400).json({ error: 'Unsupported platform or invalid URL for platform.' });
  }

  try {
    const id = uuidv4();
    const tempDir = path.join(process.cwd(), 'temp_downloads');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const filename = `${id}.${ext}`;
    const filepath = path.join(tempDir, filename);

    // إعداد أوامر yt-dlp
    let ytdlpArgs = [
      url,
      '-o', filepath,
      '--no-playlist',
      '--no-warnings',
      '--quiet',
      '--restrict-filenames',
      '--merge-output-format', ext,
      '--format', 'bestvideo+bestaudio/best',
    ];
    if (['mp3', 'm4a', 'aac'].includes(ext)) {
      ytdlpArgs.push('--extract-audio');
      ytdlpArgs.push('--audio-format');
      ytdlpArgs.push(ext);
    }
    execFile(ytdlpPath, ytdlpArgs, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: 'Download failed: ' + (stderr || error.message) });
      }
      if (!fs.existsSync(filepath) || fs.statSync(filepath).size < 100 * 1024) {
        return res.status(500).json({ error: 'Download failed: File not found or too small.' });
      }
      res.status(200).json({ message: 'Download successful!', filename });
    });
  } catch (err) {
    res.status(500).json({ error: 'Download failed: ' + err.message });
  }
} 