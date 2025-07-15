# 📊 دليل إعداد Google Analytics و AdSense

## 🎯 Google Analytics Setup

### الخطوة 1: إنشاء حساب Google Analytics

1. **اذهب إلى Google Analytics**
   ```
   https://analytics.google.com
   ```

2. **إنشاء حساب جديد**
   - اضغط "Start measuring"
   - أدخل اسم الحساب: `ClipHawk Analytics`
   - اضغط "Next"

3. **إعداد الموقع**
   - اسم الموقع: `ClipHawk Pro`
   - الرابط: `https://yourdomain.com`
   - الصناعة: `Technology`
   - المنطقة الزمنية: `(GMT+03:00) Riyadh`
   - العملة: `USD`
   - اضغط "Next"

4. **إعدادات الأعمال**
   - حجم الأعمال: `Small business`
   - كيفية استخدام Google Analytics: `Generate leads`
   - اضغط "Create"

### الخطوة 2: الحصول على Tracking ID

1. **نسخ Tracking ID**
   ```
   G-XXXXXXXXXX (مثال: G-ABC123DEF4)
   ```

2. **تحديث الملفات**
   ```javascript
   // في frontend/public/index.html
   gtag('config', 'G-XXXXXXXXXX');
   
   // في frontend/src/config/analytics.js
   TRACKING_ID: 'G-XXXXXXXXXX'
   ```

### الخطوة 3: إعداد الأبعاد المخصصة

1. **في Google Analytics**
   - اذهب إلى Admin → Custom Definitions → Custom Dimensions
   - أنشئ 3 أبعاد مخصصة:
     - `user_type` (User scope)
     - `platform` (Hit scope)
     - `download_type` (Hit scope)

2. **تحديث الكود**
   ```javascript
   custom_map: {
     'dimension1': 'user_type',
     'dimension2': 'platform',
     'dimension3': 'download_type'
   }
   ```

### الخطوة 4: إعداد الأحداث المخصصة

1. **أحداث التحميل**
   ```javascript
   // download_started
   // download_completed
   // download_failed
   ```

2. **أحداث التقطيع**
   ```javascript
   // trim_started
   // trim_completed
   // trim_failed
   ```

3. **أحداث التفاعل**
   ```javascript
   // platform_selected
   // language_changed
   // dark_mode_toggled
   ```

## 💰 Google AdSense Setup

### الخطوة 1: إنشاء حساب AdSense

1. **اذهب إلى Google AdSense**
   ```
   https://www.google.com/adsense
   ```

2. **إنشاء حساب جديد**
   - أدخل بريدك الإلكتروني
   - اختر نوع الحساب: `Individual`
   - أدخل معلومات الموقع:
     - الرابط: `https://yourdomain.com`
     - اللغة: `Arabic`
     - العنوان: `ClipHawk Pro - تحميل الفيديوهات`
   - اضغط "Create account"

3. **إكمال الملف الشخصي**
   - أدخل اسمك الكامل
   - أدخل عنوانك
   - أدخل رقم الهاتف
   - اضغط "Submit for review"

### الخطوة 2: انتظار الموافقة

- **الوقت المتوقع**: 1-2 أسبوع
- **المتطلبات**:
  - محتوى أصلي
  - سياسة خصوصية
  - شروط الاستخدام
  - لا إعلانات منافسة

### الخطوة 3: الحصول على Publisher ID

1. **بعد الموافقة**
   ```
   ca-pub-XXXXXXXXXX (مثال: ca-pub-1234567890123456)
   ```

2. **تحديث الملفات**
   ```javascript
   // في frontend/public/index.html
   data-ad-client="ca-pub-XXXXXXXXXX"
   
   // في frontend/src/config/analytics.js
   CLIENT_ID: 'ca-pub-XXXXXXXXXX'
   ```

### الخطوة 4: إنشاء وحدات الإعلانات

1. **إعلان بانر علوي**
   - النوع: `Display ads`
   - الحجم: `Responsive`
   - اسم الوحدة: `Header Banner`
   - احفظ `ad-slot-id`

2. **إعلان جانبي**
   - النوع: `Display ads`
   - الحجم: `300x250`
   - اسم الوحدة: `Sidebar Banner`
   - احفظ `ad-slot-id`

3. **إعلان تذييل الصفحة**
   - النوع: `Display ads`
   - الحجم: `Responsive`
   - اسم الوحدة: `Footer Banner`
   - احفظ `ad-slot-id`

4. **إعلان في المقال**
   - النوع: `In-article ads`
   - الحجم: `Responsive`
   - اسم الوحدة: `In Article Ad`
   - احفظ `ad-slot-id`

## 🔧 تحديث الملفات

### 1. تحديث index.html

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    page_title: 'ClipHawk Pro - تحميل الفيديوهات باحترافية',
    page_location: window.location.href,
    custom_map: {
      'dimension1': 'user_type',
      'dimension2': 'platform',
      'dimension3': 'download_type'
    },
    send_page_view: true,
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
</script>

<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossorigin="anonymous"></script>
```

### 2. تحديث analytics.js

```javascript
export const GA_CONFIG = {
  TRACKING_ID: 'G-XXXXXXXXXX',
  // ... باقي الإعدادات
};

export const ADSENSE_CONFIG = {
  CLIENT_ID: 'ca-pub-XXXXXXXXXX',
  AD_UNITS: {
    HEADER_BANNER: 'YOUR_HEADER_AD_SLOT',
    SIDEBAR_BANNER: 'YOUR_SIDEBAR_AD_SLOT',
    IN_ARTICLE: 'YOUR_IN_ARTICLE_AD_SLOT',
    FOOTER_BANNER: 'YOUR_FOOTER_AD_SLOT'
  }
};
```

### 3. تحديث AdBanner.jsx

```javascript
data-ad-client="ca-pub-XXXXXXXXXX"
data-ad-slot={adSlot}
```

## 📱 إضافة الإعلانات في التطبيق

### 1. في Navbar.jsx

```javascript
import { HeaderAd } from './AdBanner';

// في أعلى الصفحة
<HeaderAd />
```

### 2. في الصفحات الرئيسية

```javascript
import { SidebarAd, InArticleAd } from './AdBanner';

// في الجانب
<SidebarAd />

// في وسط المحتوى
<InArticleAd />
```

### 3. في Footer

```javascript
import { FooterAd } from './AdBanner';

// في تذييل الصفحة
<FooterAd />
```

## 📊 مراقبة الأداء

### 1. Google Analytics

1. **الزيارات**
   - Real-time: مراقبة الزيارات المباشرة
   - Audience: تحليل الجمهور
   - Acquisition: مصادر الزيارات

2. **السلوك**
   - Behavior: سلوك المستخدمين
   - Events: الأحداث المخصصة
   - Conversions: التحويلات

3. **التقارير**
   - Downloads: تقارير التحميل
   - Platforms: المنصات الأكثر استخداماً
   - Errors: الأخطاء الشائعة

### 2. Google AdSense

1. **الأداء**
   - Page views: مشاهدات الصفحات
   - Impressions: ظهور الإعلانات
   - Clicks: النقرات
   - CTR: معدل النقر

2. **الأرباح**
   - Revenue: الإيرادات
   - RPM: الإيراد لكل ألف مشاهدة
   - CPC: التكلفة لكل نقرة

3. **التحسين**
   - Ad units: أداء وحدات الإعلانات
   - Ad sizes: أحجام الإعلانات
   - Placements: مواقع الإعلانات

## 🔒 إعدادات الخصوصية

### 1. سياسة الخصوصية

```html
<!-- إضافة رابط سياسة الخصوصية -->
<a href="/privacy-policy">سياسة الخصوصية</a>
```

### 2. إعدادات GDPR

```javascript
// في analytics.js
gtag('config', 'G-XXXXXXXXXX', {
  anonymize_ip: true,
  allow_google_signals: false,
  allow_ad_personalization_signals: false
});
```

### 3. Cookie Consent

```javascript
// إضافة موافقة الكوكيز
const acceptCookies = () => {
  localStorage.setItem('cookies_accepted', 'true');
  gtag('consent', 'update', {
    'analytics_storage': 'granted',
    'ad_storage': 'granted'
  });
};
```

## 🚀 تحسين الأداء

### 1. تحسين تحميل الإعلانات

```javascript
// تحميل الإعلانات بشكل متأخر
const loadAd = () => {
  setTimeout(() => {
    (adsbygoogle = window.adsbygoogle || []).push({});
  }, 1000);
};
```

### 2. تحسين Analytics

```javascript
// إرسال البيانات بشكل متأخر
const sendAnalytics = (data) => {
  requestIdleCallback(() => {
    gtag('event', 'custom_event', data);
  });
};
```

## ✅ قائمة التحقق

### Google Analytics
- [ ] إنشاء حساب
- [ ] الحصول على Tracking ID
- [ ] إعداد الأبعاد المخصصة
- [ ] إعداد الأحداث المخصصة
- [ ] اختبار التتبع
- [ ] إعداد التقارير

### Google AdSense
- [ ] إنشاء حساب
- [ ] انتظار الموافقة
- [ ] الحصول على Publisher ID
- [ ] إنشاء وحدات الإعلانات
- [ ] إضافة الإعلانات للموقع
- [ ] اختبار الإعلانات
- [ ] مراقبة الأداء

### الخصوصية
- [ ] إضافة سياسة الخصوصية
- [ ] إعداد GDPR
- [ ] إضافة موافقة الكوكيز
- [ ] اختبار الإعدادات

---

**🎉 تهانينا! Analytics و AdSense جاهزان للعمل!** 