# ClipHawk Deployment Guide

## 🚀 النشر على الدومين

### 1. شراء دومين مجاني
- **Freenom**: `.tk`, `.ml`, `.ga`, `.cf`, `.gq`
- **InfinityFree**: `.epizy.com`, `.rf.gd`
- **000webhost**: `.000webhostapp.com`

### 2. إعداد VPS (Virtual Private Server)
```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Docker و Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# تثبيت Nginx
sudo apt install nginx certbot python3-certbot-nginx -y
```

### 3. إعداد SSL مجاني
```bash
# الحصول على شهادة SSL مجانية
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# تجديد تلقائي
sudo crontab -e
# إضافة: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 4. نشر التطبيق
```bash
# استنساخ المشروع
git clone https://github.com/yourusername/cliphawk.git
cd cliphawk

# تعديل الإعدادات
cp .env.example .env
# تعديل المتغيرات في .env

# بناء وتشغيل
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🔒 تحسينات الأمان

### 1. جدار الحماية
```bash
# إعداد UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. مراقبة الأمان
```bash
# تثبيت Fail2ban
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. النسخ الاحتياطي
```bash
# إنشاء سكريبت النسخ الاحتياطي
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf backup_$DATE.tar.gz /var/www/cliphawk
aws s3 cp backup_$DATE.tar.gz s3://your-backup-bucket/
```

## 📊 Google Analytics

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

### 3. تتبع الأحداث
```javascript
// تتبع التحميل
trackDownload('youtube', 'mp4', '720p');

// تتبع التقطيع
trackTrim('extract', 'mp3');
```

## 💰 Google AdSense

### 1. إنشاء حساب AdSense
1. اذهب إلى [Google AdSense](https://www.google.com/adsense)
2. أنشئ حساب جديد
3. احصل على Publisher ID

### 2. إعداد الإعلانات
```html
<!-- في frontend/public/index.html -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"></script>
```

### 3. إضافة وحدات إعلانية
```html
<!-- إعلان في الهيدر -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"></ins>
```

## 🔧 إعدادات إضافية

### 1. تحسين الأداء
```nginx
# في nginx.conf
gzip on;
gzip_types text/plain text/css application/json application/javascript;
client_max_body_size 500M;
```

### 2. مراقبة الأداء
```bash
# تثبيت htop للمراقبة
sudo apt install htop -y

# مراقبة الموارد
htop
```

### 3. السجلات
```bash
# مراقبة سجلات التطبيق
docker-compose logs -f backend
docker-compose logs -f nginx
```

## 📱 تحسين SEO

### 1. Meta Tags
```html
<meta name="description" content="ClipHawk - تحميل وتقطيع الفيديوهات من يوتيوب وتيك توك وانستغرام">
<meta name="keywords" content="تحميل فيديو, يوتيوب, تيك توك, تقطيع فيديو">
```

### 2. Sitemap
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

## 🚨 الأمان المتقدم

### 1. حماية من DDoS
```nginx
# في nginx.conf
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
```

### 2. حماية من SQL Injection
- استخدام Pydantic للتحقق من المدخلات
- تنظيف البيانات قبل المعالجة

### 3. حماية من XSS
```javascript
// تنظيف المدخلات
const sanitizeInput = (input) => {
  return input.replace(/[<>]/g, '');
};
```

## 📈 مراقبة الأداء

### 1. Google Analytics Events
- تتبع التحميلات
- تتبع التقطيع
- تتبع الأخطاء

### 2. AdSense Optimization
- إعلانات في المواقع المناسبة
- تحسين CTR
- مراقبة الإيرادات

### 3. Server Monitoring
- مراقبة CPU و RAM
- مراقبة مساحة التخزين
- مراقبة الشبكة

## 🔄 الصيانة الدورية

### 1. تحديث النظام
```bash
# تحديث أسبوعي
sudo apt update && sudo apt upgrade -y
docker-compose pull
docker-compose up -d
```

### 2. تنظيف الملفات المؤقتة
```bash
# تنظيف يومي
find /var/www/cliphawk/temp_downloads -mtime +1 -delete
```

### 3. مراجعة السجلات
```bash
# مراجعة أسبوعية
grep "ERROR" /var/log/nginx/error.log
grep "WARNING" /var/log/cliphawk/app.log
``` 