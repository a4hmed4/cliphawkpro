# 🦅 ClipHawk - Video Downloader & Trimmer

**ClipHawk** هو تطبيق احترافي لتحميل وتقطيع الفيديوهات من منصات متعددة مع دعم كامل للغة العربية والإنجليزية.

## ✨ المميزات

### 🎥 تحميل الفيديوهات
- **يوتيوب** - تحميل فيديوهات عالية الجودة
- **تيك توك** - تحميل فيديوهات قصيرة بدون علامة مائية
- **انستغرام** - تحميل ستوريز وريلز وIGTV
- **تويتر** - تحميل فيديوهات وسبيسز
- **فيسبوك** - تحميل فيديوهات منسبوك
- **منصات أخرى** - دعم أكثر من 1000 منصة

### ✂️ تقطيع الفيديوهات
- **تقطيع الفيديو** - تقطيع بوقت محدد
- **تقطيع الصوت** - تقطيع ملفات الصوت
- **استخراج الصوت** - تحويل الفيديو إلى MP3/M4A/AAC

### 🔒 الأمان
- **حماية من الهجمات** - Rate limiting وحماية من DDoS
- **تحقق من المدخلات** - تنظيف البيانات والملفات
- **رؤوس HTTP آمنة** - Content Security Policy
- **حماية من XSS** - تنظيف المدخلات

### 📊 التحليلات والإعلانات
- **Google Analytics** - تتبع الزوار والتفاعل
- **Google AdSense** - إعلانات مخصصة
- **تتبع الأحداث** - تحميلات وتقطيع وأخطاء

## 🚀 النشر السريع

### باستخدام Docker
```bash
# استنساخ المشروع
git clone https://github.com/yourusername/cliphawk.git
cd cliphawk

# تشغيل التطوير
docker-compose up -d

# النشر للإنتاج
docker-compose -f docker-compose.prod.yml up -d --build
```

### النشر اليدوي
```bash
# Backend
cd backend
pip install -r requirements.txt
python main.py

# Frontend
cd frontend
npm install
npm start
```

## 🌐 إعداد الدومين

### 1. شراء دومين مجاني
- **Freenom**: `.tk`, `.ml`, `.ga`, `.cf`, `.gq`
- **InfinityFree**: `.epizy.com`, `.rf.gd`

### 2. إعداد SSL مجاني
```bash
sudo certbot --nginx -d yourdomain.com
```

### 3. تكوين Nginx
```bash
# نسخ ملف التكوين
sudo cp deployment/nginx.conf /etc/nginx/sites-available/cliphawk
sudo ln -s /etc/nginx/sites-available/cliphawk /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

## 📊 إعداد Google Analytics

### 1. إنشاء حساب GA4
1. اذهب إلى [Google Analytics](https://analytics.google.com)
2. أنشئ حساب جديد
3. احصل على Measurement ID

### 2. إعداد التتبع
```javascript
// في frontend/src/config/analytics.js
export const GA_CONFIG = {
  MEASUREMENT_ID: 'G-XXXXXXXXXX', // ضع ID الخاص بك
  ENABLED: true
};
```

## 💰 إعداد Google AdSense

### 1. إنشاء حساب AdSense
1. اذهب إلى [Google AdSense](https://www.google.com/adsense)
2. أنشئ حساب جديد
3. احصل على Publisher ID

### 2. إضافة الإعلانات
```html
<!-- في frontend/public/index.html -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"></script>
```

## 🔧 التكوين

### متغيرات البيئة
```bash
# Backend (.env)
ENVIRONMENT=production
MAX_FILE_SIZE=500MB
RATE_LIMIT=20

# Frontend (.env)
REACT_APP_API_URL=https://yourdomain.com/api
REACT_APP_GA_ID=G-XXXXXXXXXX
REACT_APP_ADSENSE_ID=ca-pub-XXXXXXXXXX
```

### إعدادات الأمان
- **Rate Limiting**: 20 طلب في الدقيقة
- **File Size Limit**: 500MB كحد أقصى
- **Input Validation**: تنظيف جميع المدخلات
- **CORS Protection**: حماية من الطلبات غير المصرح بها

## 📱 الاستخدام

### تحميل فيديو
1. اختر المنصة (يوتيوب، تيك توك، إلخ)
2. الصق رابط الفيديو
3. اختر الجودة والتنسيق
4. اضغط تحميل

### تقطيع فيديو
1. ارفع ملف فيديو أو صوت
2. اختر العملية (تقطيع، استخراج صوت)
3. حدد وقت البداية والنهاية
4. اختر تنسيق المخرجات
5. اضغط تنفيذ

## 🛡️ الأمان

### حماية من الهجمات
- **DDoS Protection**: حماية من هجمات DDoS
- **SQL Injection**: حماية من حقن SQL
- **XSS Protection**: حماية من XSS
- **File Upload Security**: حماية من رفع ملفات ضارة

### مراقبة الأمان
- **Rate Limiting**: تحديد عدد الطلبات
- **IP Blocking**: حظر IPs المشبوهة
- **Log Monitoring**: مراقبة السجلات
- **Error Tracking**: تتبع الأخطاء

## 📈 التحليلات

### Google Analytics Events
- **download_started**: تتبع بداية التحميل
- **trim_action**: تتبع عمليات التقطيع
- **error_occurred**: تتبع الأخطاء
- **page_view**: تتبع عرض الصفحات

### AdSense Optimization
- **Header Ads**: إعلانات في الهيدر
- **Sidebar Ads**: إعلانات في الشريط الجانبي
- **Footer Ads**: إعلانات في الفوتر
- **Responsive Ads**: إعلانات متجاوبة

## 🔄 الصيانة

### النسخ الاحتياطي
```bash
# نسخ احتياطي يومي
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf backup_$DATE.tar.gz /var/www/cliphawk
```

### التحديثات
```bash
# تحديث أسبوعي
git pull origin main
docker-compose down
docker-compose up -d --build
```

### المراقبة
```bash
# مراقبة الموارد
htop
docker stats

# مراقبة السجلات
docker-compose logs -f
```

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم

- **Email**: support@cliphawk.com
- **Discord**: [ClipHawk Community](https://discord.gg/cliphawk)
- **Telegram**: [@ClipHawkSupport](https://t.me/ClipHawkSupport)

## 🙏 الشكر

- **yt-dlp** - لتحميل الفيديوهات
- **FFmpeg** - لمعالجة الوسائط
- **React** - لواجهة المستخدم
- **FastAPI** - للخادم الخلفي

---

**ClipHawk** - تحميل وتقطيع الفيديوهات بسهولة وأمان! 🦅 