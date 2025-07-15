export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'No URL provided' });

  // منصة الفيديو
  let platform = 'unknown';
  if (url.includes('youtube.com') || url.includes('youtu.be')) platform = 'youtube';
  else if (url.includes('tiktok.com')) platform = 'tiktok';
  else if (url.includes('instagram.com')) platform = 'instagram';
  else if (url.includes('twitter.com')) platform = 'twitter';
  else if (url.includes('facebook.com')) platform = 'facebook';

  // مثال: إرجاع بيانات وهمية (يمكنك تطويرها لاحقاً)
  res.status(200).json({
    message: 'تم استقبال الرابط',
    platform,
    url,
    qualities: [
      { label: '720p', value: '720p', size: '20MB' },
      { label: '480p', value: '480p', size: '10MB' }
    ]
  });
} 