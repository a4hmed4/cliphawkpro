import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { event, data } = req.body;
  const logPath = path.join(process.cwd(), 'analytics.log');
  const logEntry = `${new Date().toISOString()} | ${event} | ${JSON.stringify(data)}\n`;
  fs.appendFileSync(logPath, logEntry);
  res.status(200).json({ message: 'تم تسجيل الحدث', event, data });
} 