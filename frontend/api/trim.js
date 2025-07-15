import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const busboy = require('busboy');
  const bb = busboy({ headers: req.headers });
  let trimStart = 0, trimEnd = null, format = 'mp4', filename = null, filePath = null;
  let uploadFilePath = null;
  let hasFile = false;

  bb.on('field', (fieldname, val) => {
    if (fieldname === 'trim_start') trimStart = parseFloat(val);
    if (fieldname === 'trim_end') trimEnd = parseFloat(val);
    if (fieldname === 'format') format = val;
    if (fieldname === 'filename') filename = val;
  });
  bb.on('file', (fieldname, file, info) => {
    const tempDir = path.join(process.cwd(), 'temp_downloads');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const id = uuidv4();
    uploadFilePath = path.join(tempDir, `${id}_${info.filename}`);
    filePath = uploadFilePath;
    hasFile = true;
    file.pipe(fs.createWriteStream(uploadFilePath));
  });
  bb.on('close', () => {
    if (!filePath && filename) {
      const tempDir = path.join(process.cwd(), 'temp_downloads');
      filePath = path.join(tempDir, filename);
    }
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(400).json({ error: 'No file provided' });
    }
    const allowedExt = ['.mp4', '.webm', '.mkv', '.avi', '.mp3', '.m4a', '.aac', '.wav'];
    const ext = format.startsWith('.') ? format : '.' + format;
    if (!allowedExt.includes(ext)) {
      return res.status(400).json({ error: 'Invalid output format' });
    }
    const outFile = filePath.replace(/\.[^/.]+$/, '') + '_trimmed' + ext;
    let command = ffmpeg(filePath).setStartTime(trimStart);
    if (trimEnd && trimEnd > trimStart) command = command.setDuration(trimEnd - trimStart);
    command.output(outFile).on('end', () => {
      if (!fs.existsSync(outFile) || fs.statSync(outFile).size < 10 * 1024) {
        return res.status(500).json({ error: 'Trim failed: Output file not found or too small.' });
      }
      res.status(200).json({ message: 'Trim completed successfully', filename: path.basename(outFile) });
    }).on('error', (err) => {
      res.status(500).json({ error: 'Trim failed: ' + err.message });
    }).run();
  });
  req.pipe(bb);
} 