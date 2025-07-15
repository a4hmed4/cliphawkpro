import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { event, data, platform, url, userAgent, timestamp } = req.body;
  
  if (!event) {
    return res.status(400).json({ error: 'Event type is required' });
  }

  try {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
    
    const logPath = path.join(logDir, 'analytics.log');
    const currentTime = new Date().toISOString();
    
    const logEntry = {
      timestamp: timestamp || currentTime,
      event: event,
      data: data || {},
      platform: platform || 'unknown',
      url: url || '',
      userAgent: userAgent || '',
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown'
    };
    
    const logLine = `${JSON.stringify(logEntry)}\n`;
    fs.appendFileSync(logPath, logLine);
    
    res.status(200).json({ 
      message: 'Event logged successfully', 
      event: event,
      timestamp: currentTime
    });
  } catch (error) {
    console.error('Analytics logging error:', error);
    res.status(500).json({ error: 'Failed to log event' });
  }
} 