import React, { useEffect } from 'react';
import { analytics } from '../config/analytics';

const AnalyticsTracker = ({ 
  children, 
  pageName, 
  trackPageView = true,
  customDimensions = {}
}) => {
  useEffect(() => {
    if (trackPageView && pageName) {
      // تتبع عرض الصفحة
      analytics.trackPageView(pageName);
      
      // إرسال أبعاد مخصصة
      if (window.gtag && Object.keys(customDimensions).length > 0) {
        window.gtag('config', 'G-XXXXXXXXXX', {
          custom_map: customDimensions
        });
      }
    }
  }, [pageName, trackPageView, customDimensions]);

  return <>{children}</>;
};

// مكونات تتبع محددة
export const DownloadTracker = ({ platform, format, quality, onDownloadStart, onDownloadSuccess, onDownloadError }) => {
  const handleDownloadStart = () => {
    analytics.trackDownload(platform, format, quality);
    if (onDownloadStart) onDownloadStart();
  };

  const handleDownloadSuccess = (fileSize) => {
    analytics.trackDownloadSuccess(platform, format, quality, fileSize);
    if (onDownloadSuccess) onDownloadSuccess();
  };

  const handleDownloadError = (error) => {
    analytics.trackDownloadFailed(platform, error);
    if (onDownloadError) onDownloadError();
  };

  return {
    trackStart: handleDownloadStart,
    trackSuccess: handleDownloadSuccess,
    trackError: handleDownloadError
  };
};

export const TrimTracker = ({ action, inputFormat, outputFormat, onTrimStart, onTrimSuccess, onTrimError }) => {
  const handleTrimStart = () => {
    analytics.trackTrim(action, inputFormat, outputFormat);
    if (onTrimStart) onTrimStart();
  };

  const handleTrimSuccess = () => {
    analytics.trackEvent('trim_completed', {
      action,
      input_format: inputFormat,
      output_format: outputFormat
    });
    if (onTrimSuccess) onTrimSuccess();
  };

  const handleTrimError = (error) => {
    analytics.trackEvent('trim_failed', {
      action,
      input_format: inputFormat,
      output_format: outputFormat,
      error
    });
    if (onTrimError) onTrimError();
  };

  return {
    trackStart: handleTrimStart,
    trackSuccess: handleTrimSuccess,
    trackError: handleTrimError
  };
};

export const UserInteractionTracker = () => {
  const trackPlatformSelection = (platform) => {
    analytics.trackPlatformSelected(platform);
  };

  const trackLanguageChange = (language) => {
    analytics.trackLanguageChanged(language);
  };

  const trackDarkModeToggle = (isDark) => {
    analytics.trackDarkModeToggled(isDark);
  };

  const trackButtonClick = (buttonName, context = {}) => {
    analytics.trackEvent('button_click', {
      button_name: buttonName,
      ...context
    });
  };

  const trackFormSubmission = (formName, success = true) => {
    analytics.trackEvent('form_submission', {
      form_name: formName,
      success
    });
  };

  return {
    trackPlatformSelection,
    trackLanguageChange,
    trackDarkModeToggle,
    trackButtonClick,
    trackFormSubmission
  };
};

// Hook لاستخدام التتبع
export const useAnalytics = () => {
  const trackEvent = (eventName, parameters = {}) => {
    analytics.trackEvent(eventName, parameters);
  };

  const trackPageView = (pageName) => {
    analytics.trackPageView(pageName);
  };

  const trackDownload = (platform, format, quality) => {
    analytics.trackDownload(platform, format, quality);
  };

  const trackDownloadSuccess = (platform, format, quality, fileSize) => {
    analytics.trackDownloadSuccess(platform, format, quality, fileSize);
  };

  const trackDownloadFailed = (platform, error) => {
    analytics.trackDownloadFailed(platform, error);
  };

  const trackTrim = (action, inputFormat, outputFormat) => {
    analytics.trackTrim(action, inputFormat, outputFormat);
  };

  return {
    trackEvent,
    trackPageView,
    trackDownload,
    trackDownloadSuccess,
    trackDownloadFailed,
    trackTrim
  };
};

export default AnalyticsTracker; 