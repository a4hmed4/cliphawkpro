export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url, quality } = req.body;
  if (!url || !quality) return res.status(400).json({ error: 'Missing url or quality' });

  // مثال: إرجاع رسالة وهمية (يمكنك تطويرها لاحقاً)
  res.status(200).json({
    message: 'تم التحميل بنجاح',
    url,
    quality
  });
} 