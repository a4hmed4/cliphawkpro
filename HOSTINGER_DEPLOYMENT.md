# 🚀 دليل نشر ClipHawk على هوستنجر

## 📋 المتطلبات الأساسية

### 1. **حساب هوستنجر**
- خطة استضافة ويب (Premium أو أعلى موصى بها)
- دومين مجاني أو مدفوع
- SSL مجاني
- قاعدة بيانات MySQL

### 2. **الأدوات المطلوبة**
- File Manager (متوفر في لوحة التحكم)
- أو FTP Client (FileZilla)
- محرر نصوص

## 🔧 خطوات النشر

### الخطوة 1: إعداد قاعدة البيانات

1. **دخول لوحة التحكم**
   ```
   https://hpanel.hostinger.com
   ```

2. **إنشاء قاعدة البيانات**
   - اذهب إلى "Databases" → "MySQL Databases"
   - أنشئ قاعدة بيانات جديدة
   - سجل: اسم قاعدة البيانات، اسم المستخدم، كلمة المرور

3. **استيراد الجدول**
   - اذهب إلى phpMyAdmin
   - اختر قاعدة البيانات الجديدة
   - انسخ محتوى `database/schema.sql` والصقه في SQL tab
   - اضغط "Go" لتنفيذ الاستعلام

### الخطوة 2: رفع الملفات

#### الطريقة الأولى: File Manager
1. **دخول File Manager**
   - اذهب إلى "Files" → "File Manager"
   - اختر مجلد `public_html`

2. **رفع ملفات Frontend**
   ```
   ارفع محتويات مجلد frontend/build/ إلى public_html/
   ```

3. **رفع ملفات Backend**
   ```
   ارفع محتويات مجلد backend/ إلى مجلد فرعي مثل api/
   ```

#### الطريقة الثانية: FTP
```bash
# رفع Frontend
ftp yourdomain.com
cd public_html
put -r frontend/build/*

# رفع Backend
cd api
put -r backend/*
```

### الخطوة 3: إعداد التكوين

1. **تعديل ملف التكوين**
   ```bash
   # انسخ ملف التكوين
   cp deployment/hostinger-config.php public_html/config.php
   
   # عدل الإعدادات
   nano public_html/config.php
   ```

2. **تحديث الإعدادات**
   ```php
   // استبدل بالقيم الصحيحة
   define('DB_NAME', 'your_database_name');
   define('DB_USER', 'your_username');
   define('DB_PASS', 'your_password');
   define('APP_URL', 'https://yourdomain.com');
   ```

### الخطوة 4: إعداد Python على هوستنجر

#### الطريقة الأولى: Python App
1. **إنشاء Python App**
   - اذهب إلى "Advanced" → "Python"
   - أنشئ تطبيق Python جديد
   - اختر Python 3.9 أو أحدث

2. **رفع Backend**
   ```bash
   # ارفع ملفات Backend إلى مجلد Python App
   cd /home/username/python_apps/cliphawk
   put -r backend/*
   ```

3. **تثبيت المتطلبات**
   ```bash
   pip install -r requirements.txt
   ```

#### الطريقة الثانية: SSH (إذا كان متوفراً)
```bash
# الاتصال بـ SSH
ssh username@yourdomain.com

# تثبيت Python dependencies
cd public_html/api
pip3 install --user -r requirements.txt

# تشغيل الخادم
python3 main.py
```

### الخطوة 5: إعداد .htaccess

1. **رفع ملف .htaccess**
   ```bash
   # ارفع ملف .htaccess إلى public_html
   put frontend/public/.htaccess public_html/.htaccess
   ```

2. **تعديل المسارات**
   ```apache
   # تأكد من صحة المسارات
   RewriteRule ^api/(.*)$ api/$1 [L]
   ```

### الخطوة 6: إعداد SSL

1. **تفعيل SSL**
   - اذهب إلى "SSL" في لوحة التحكم
   - فعّل SSL المجاني للدومين

2. **إجبار HTTPS**
   ```apache
   # في .htaccess
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

## 🔒 إعدادات الأمان

### 1. **حماية الملفات الحساسة**
```apache
# في .htaccess
<FilesMatch "\.(env|log|sql|bak|backup|old|tmp)$">
    Order allow,deny
    Deny from all
</FilesMatch>
```

### 2. **حماية المجلدات**
```apache
# منع الوصول للمجلدات الحساسة
RewriteRule ^(\.git|\.env|node_modules|vendor|storage|logs)/ - [F,L]
```

### 3. **Rate Limiting**
```php
// في config.php
define('RATE_LIMIT_REQUESTS', 100); // requests per hour
```

## 📊 إعداد Google Analytics

### 1. **إنشاء حساب Google Analytics**
- اذهب إلى [Google Analytics](https://analytics.google.com)
- أنشئ حساب جديد
- احصل على Tracking ID

### 2. **إضافة الكود**
```html
<!-- في public_html/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 💰 إعداد Google AdSense

### 1. **إنشاء حساب AdSense**
- اذهب إلى [Google AdSense](https://www.google.com/adsense)
- أنشئ حساب جديد
- انتظر الموافقة

### 2. **إضافة كود AdSense**
```html
<!-- في public_html/index.html -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossorigin="anonymous"></script>
```

## 🚀 تشغيل التطبيق

### 1. **تشغيل Backend**
```bash
# في مجلد Python App
python3 main.py

# أو باستخدام Hypercorn
hypercorn main:app --bind 0.0.0.0:8000
```

### 2. **اختبار التطبيق**
```
https://yourdomain.com
```

## 🔧 استكشاف الأخطاء

### 1. **مشاكل قاعدة البيانات**
```bash
# فحص الاتصال
mysql -u username -p database_name
```

### 2. **مشاكل Python**
```bash
# فحص إصدار Python
python3 --version

# فحص المتطلبات
pip3 list
```

### 3. **مشاكل الملفات**
```bash
# فحص الصلاحيات
chmod 755 public_html
chmod 644 public_html/.htaccess
```

### 4. **مشاكل SSL**
- تأكد من تفعيل SSL في لوحة التحكم
- انتظر 24 ساعة لتفعيل الشهادة

## 📈 مراقبة الأداء

### 1. **مراقبة الاستخدام**
- استخدم Google Analytics
- راجع سجلات الخطأ في لوحة التحكم

### 2. **تحسين الأداء**
- فعّل Gzip compression
- استخدم CDN للصور
- قلل حجم الملفات

### 3. **النسخ الاحتياطي**
- فعّل النسخ الاحتياطي التلقائي
- احتفظ بنسخة من قاعدة البيانات

## 🆘 الدعم

### 1. **دعم هوستنجر**
- Live Chat: متوفر 24/7
- Knowledge Base: مقالات مساعدة
- Community Forum: منتدى المستخدمين

### 2. **معلومات الاتصال**
```
Website: https://yourdomain.com
Email: support@yourdomain.com
```

## ✅ قائمة التحقق

- [ ] إنشاء قاعدة البيانات
- [ ] رفع ملفات Frontend
- [ ] رفع ملفات Backend
- [ ] إعداد التكوين
- [ ] تفعيل SSL
- [ ] إعداد Google Analytics
- [ ] إعداد Google AdSense
- [ ] اختبار التطبيق
- [ ] مراقبة الأداء

---

**🎉 تهانينا! ClipHawk الآن يعمل على هوستنجر!** 