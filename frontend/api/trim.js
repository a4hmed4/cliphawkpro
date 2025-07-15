export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url, start, end } = req.body;
  if (!url || start == null || end == null) return res.status(400).json({ error: 'Missing parameters' });

  // مثال: إرجاع رسالة وهمية (يمكنك تطويرها لاحقاً)
  res.status(200).json({
    message: 'تم تقطيع الفيديو (وهمي)',
    url,
    start,
    end
  });
} 