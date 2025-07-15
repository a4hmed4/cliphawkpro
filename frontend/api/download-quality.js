export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { url, quality, format, ext, platform } = req.body;
  if (!url || !quality) return res.status(400).json({ error: 'Missing url or quality' });
  // إعادة توجيه للـ download مع الجودة
  const response = await fetch('/api/download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, quality, format, ext, platform })
  });
  const data = await response.json();
  res.status(response.status).json(data);
} 