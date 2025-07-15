// ClipHawk Analytics Configuration
// إعدادات التحليلات والإعلانات

// Google Analytics Configuration
export const GA_CONFIG = {
  // استبدل بمعرف Google Analytics الخاص بك
  TRACKING_ID: 'G-XXXXXXXXXX', // مثال: G-ABC123DEF4
  
  // إعدادات مخصصة
  CUSTOM_DIMENSIONS: {
    USER_TYPE: 'dimension1',
    PLATFORM: 'dimension2',
    DOWNLOAD_TYPE: 'dimension3'
  },
  
  // أحداث مخصصة
  EVENTS: {
    DOWNLOAD_STARTED: 'download_started',
    DOWNLOAD_COMPLETED: 'download_completed',
    DOWNLOAD_FAILED: 'download_failed',
    TRIM_STARTED: 'trim_started',
    TRIM_COMPLETED: 'trim_completed',
    PLATFORM_SELECTED: 'platform_selected',
    LANGUAGE_CHANGED: 'language_changed',
    DARK_MODE_TOGGLED: 'dark_mode_toggled'
  }
};

// Google AdSense Configuration
export const ADSENSE_CONFIG = {
  // استبدل بمعرف AdSense الخاص بك
  CLIENT_ID: 'ca-pub-XXXXXXXXXX', // مثال: ca-pub-1234567890123456
  
  // أنواع الإعلانات
  AD_UNITS: {
    HEADER_BANNER: 'header-banner',
    SIDEBAR_BANNER: 'sidebar-banner',
    IN_ARTICLE: 'in-article',
    FOOTER_BANNER: 'footer-banner'
  },
  
  // إعدادات الإعلانات
  AD_SETTINGS: {
    AUTO_ADS: true,
    RESPONSIVE: true,
    NON_PERSONALIZED: false
  }
};

// Facebook Pixel Configuration (اختياري)
export const FACEBOOK_PIXEL_CONFIG = {
  PIXEL_ID: 'XXXXXXXXXX', // استبدل بمعرف Pixel الخاص بك
  EVENTS: {
    PAGE_VIEW: 'PageView',
    DOWNLOAD: 'Download',
    COMPLETE_REGISTRATION: 'CompleteRegistration'
  }
};

// Analytics Helper Functions
export const trackEvent = async (event, data = {}) => {
  try {
    const res = await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data })
    });
    return await res.json();
  } catch (err) {
    // يمكن إضافة منطق معالجة الخطأ هنا
    return { error: err.message };
  }
};

// AdSense Helper Functions
export class AdSense {
  constructor() {
    this.isInitialized = false;
    this.init();
  }

  // تهيئة AdSense
  init() {
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      this.isInitialized = true;
      console.log('AdSense initialized successfully');
    } else {
      console.warn('AdSense not loaded');
    }
  }

  // تحميل إعلان
  loadAd(adUnitId) {
    if (this.isInitialized) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        console.log('Ad loaded:', adUnitId);
      } catch (error) {
        console.error('Error loading ad:', error);
      }
    }
  }

  // إعلان بانر علوي
  loadHeaderBanner() {
    return (
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CONFIG.CLIENT_ID}
        data-ad-slot={ADSENSE_CONFIG.AD_UNITS.HEADER_BANNER}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    );
  }

  // إعلان جانبي
  loadSidebarBanner() {
    return (
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CONFIG.CLIENT_ID}
        data-ad-slot={ADSENSE_CONFIG.AD_UNITS.SIDEBAR_BANNER}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    );
  }

  // إعلان في المقال
  loadInArticleAd() {
    return (
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={ADSENSE_CONFIG.CLIENT_ID}
        data-ad-slot={ADSENSE_CONFIG.AD_UNITS.IN_ARTICLE}
      />
    );
  }

  // إعلان تذييل الصفحة
  loadFooterBanner() {
    return (
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CONFIG.CLIENT_ID}
        data-ad-slot={ADSENSE_CONFIG.AD_UNITS.FOOTER_BANNER}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    );
  }
}

// إنشاء مثيلات عامة
export const analytics = new Analytics();
export const adSense = new AdSense();

// تصدير الإعدادات
export default {
  GA_CONFIG,
  ADSENSE_CONFIG,
  FACEBOOK_PIXEL_CONFIG,
  analytics,
  adSense
}; 