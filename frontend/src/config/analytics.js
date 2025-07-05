// Google Analytics Configuration
export const GA_CONFIG = {
  MEASUREMENT_ID: 'GA_MEASUREMENT_ID', // Replace with your actual GA4 Measurement ID
  ENABLED: true
};

// Google AdSense Configuration
export const ADSENSE_CONFIG = {
  PUBLISHER_ID: 'ca-pub-YOUR_PUBLISHER_ID', // Replace with your actual Publisher ID
  ENABLED: true,
  AD_SLOTS: {
    HEADER: 'YOUR_HEADER_AD_SLOT_ID',
    SIDEBAR: 'YOUR_SIDEBAR_AD_SLOT_ID',
    FOOTER: 'YOUR_FOOTER_AD_SLOT_ID'
  }
};

// Analytics Events
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof gtag !== 'undefined' && GA_CONFIG.ENABLED) {
    gtag('event', eventName, {
      event_category: 'ClipHawk',
      event_label: window.location.pathname,
      ...parameters
    });
  }
};

// Track page views
export const trackPageView = (pageName) => {
  if (typeof gtag !== 'undefined' && GA_CONFIG.ENABLED) {
    gtag('config', GA_CONFIG.MEASUREMENT_ID, {
      page_title: pageName,
      page_location: window.location.href
    });
  }
};

// Track download events
export const trackDownload = (platform, format, quality) => {
  trackEvent('download_started', {
    platform: platform,
    format: format,
    quality: quality
  });
};

// Track trim events
export const trackTrim = (action, format) => {
  trackEvent('trim_action', {
    action: action,
    format: format
  });
}; 