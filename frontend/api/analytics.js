export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { event, data } = req.body;
  // يمكنك هنا تسجيل الحدث في قاعدة بيانات أو خدمة خارجية
  res.status(200).json({ message: 'تم تسجيل الحدث', event, data });
} 