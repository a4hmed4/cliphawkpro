import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { execFile } from 'child_process';

const ytdlpPath = process.env.YTDLP_PATH || 'yt-dlp'; // يجب تثبيت yt-dlp في السيرفر أو إضافته في devDependencies

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

  // منصة يوتيوب: اقبل فقط روابط يوتيوب إذا كان platform === 'youtube'
  if (platform === 'youtube') {
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return res.status(400).json({ error: 'URL must be a YouTube link.' });
    }
    // تحقق من صحة الرابط
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL.' });
    }
    try {
      const id = uuidv4();
      const tempDir = path.join(process.cwd(), 'temp_downloads');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
      const filename = `${id}.${ext}`;
      const filepath = path.join(tempDir, filename);
      const stream = ytdl(url, { quality: quality === 'highest' ? 'highest' : 'lowest' });
      let output = fs.createWriteStream(filepath);
      if (['mp3', 'm4a', 'aac'].includes(ext)) {
        ffmpeg(stream)
          .audioCodec(ext === 'mp3' ? 'libmp3lame' : 'aac')
          .toFormat(ext)
          .on('end', () => {
            res.status(200).json({ message: 'Download successful!', filename });
          })
          .on('error', (err) => {
            res.status(500).json({ error: 'Download failed: ' + err.message });
          })
          .save(filepath);
      } else {
        stream.pipe(output);
        output.on('finish', () => {
          res.status(200).json({ message: 'Download successful!', filename });
        });
        output.on('error', (err) => {
          res.status(500).json({ error: 'Download failed: ' + err.message });
        });
      }
    } catch (err) {
      res.status(500).json({ error: 'Download failed: ' + err.message });
    }
    return;
  }

  // باقي المنصات: TikTok, Instagram, Twitter, Facebook
  const supportedPlatforms = [
    { name: 'tiktok', match: 'tiktok.com' },
    { name: 'instagram', match: 'instagram.com' },
    { name: 'twitter', match: 'twitter.com' },
    { name: 'facebook', match: 'facebook.com' },
  ];
  const found = supportedPlatforms.find(p => platform === p.name && url.includes(p.match));
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
        return res.status(500).json({ error: 'Download failed: ' + stderr || error.message });
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