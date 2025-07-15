import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });
  const { filename } = req.query;
  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid filename' });
  }
  // منع path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }
  const tempDir = path.join(process.cwd(), 'temp_downloads');
  const filePath = path.join(tempDir, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  try {
    fs.unlinkSync(filePath);
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting file' });
  }
} 