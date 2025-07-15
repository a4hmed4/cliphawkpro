import React, { useEffect, useRef } from 'react';

const AdBanner = ({ 
  adSlot, 
  adFormat = 'auto', 
  style = {}, 
  className = '',
  responsive = true,
  onAdLoad,
  onAdError 
}) => {
  const adRef = useRef(null);

  useEffect(() => {
    // تحميل الإعلان عند تحميل المكون
    if (window.adsbygoogle && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        if (onAdLoad) onAdLoad();
      } catch (error) {
        console.error('Error loading ad:', error);
        if (onAdError) onAdError(error);
      }
    }
  }, [onAdLoad, onAdError]);

  const defaultStyle = {
    display: 'block',
    textAlign: 'center',
    margin: '20px 0',
    minHeight: '90px',
    ...style
  };

  return (
    <div className={`ad-banner ${className}`} style={defaultStyle}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXX" // استبدل بمعرف AdSense الخاص بك
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
};

// مكونات إعلانات محددة مسبقاً
export const HeaderAd = () => (
  <AdBanner 
    adSlot="YOUR_HEADER_AD_SLOT"
    style={{ marginBottom: '20px' }}
    className="header-ad"
  />
);

export const SidebarAd = () => (
  <AdBanner 
    adSlot="YOUR_SIDEBAR_AD_SLOT"
    style={{ margin: '20px 0' }}
    className="sidebar-ad"
  />
);

export const FooterAd = () => (
  <AdBanner 
    adSlot="YOUR_FOOTER_AD_SLOT"
    style={{ marginTop: '20px' }}
    className="footer-ad"
  />
);

export const InArticleAd = () => (
  <AdBanner 
    adSlot="YOUR_IN_ARTICLE_AD_SLOT"
    adFormat="fluid"
    style={{ margin: '30px 0' }}
    className="in-article-ad"
  />
);

export const ResponsiveAd = ({ adSlot }) => (
  <AdBanner 
    adSlot={adSlot}
    responsive={true}
    style={{ margin: '15px 0' }}
    className="responsive-ad"
  />
);

export default AdBanner; 