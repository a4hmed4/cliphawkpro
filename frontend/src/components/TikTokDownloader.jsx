import React from 'react';
import TikTokDownloadForm from './TikTokDownloadForm';

const TikTokDownloader = ({ language }) => {
  // Translations
  const translations = {
    ar: {
      title: 'تيك توك',
      subtitle: 'منصة الفيديوهات القصيرة الأسرع نمواً',
      shortVideos: 'فيديوهات قصيرة',
      shortVideosDesc: 'تحميل فيديوهات تيك توك بجودة عالية',
      noWatermark: 'بدون علامة مائية',
      noWatermarkDesc: 'تحميل نظيف بدون علامات تيك توك',
      fastDownload: 'تحميل فوري',
      fastDownloadDesc: 'سرعة في التحميل والمعالجة',
      tipsTitle: 'نصائح للتحميل من تيك توك',
      tip1: 'انسخ الرابط من تطبيق تيك توك أو الموقع',
      tip2: 'يمكنك تحميل فيديوهات خاصة إذا كان لديك صلاحية',
      tip3: 'جودة الفيديو تصل إلى 1080p',
      tip4: 'استخدم تقطيع الفيديو لتحميل جزء محدد'
    },
    en: {
      title: 'TikTok',
      subtitle: 'The fastest growing short video platform',
      shortVideos: 'Short Videos',
      shortVideosDesc: 'Download TikTok videos in high quality',
      noWatermark: 'No Watermark',
      noWatermarkDesc: 'Clean download without TikTok marks',
      fastDownload: 'Instant Download',
      fastDownloadDesc: 'Fast download and processing',
      tipsTitle: 'Tips for downloading from TikTok',
      tip1: 'Copy the link from TikTok app or website',
      tip2: 'You can download private videos if you have permission',
      tip3: 'Video quality up to 1080p',
      tip4: 'Use video trimming to download specific parts'
    }
  };

  const t = translations[language] || translations.ar;

  return (
    <div className="space-y-6">
      {/* Platform Info */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-100 border border-pink-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">🎵</span>
          <div>
            <h3 className="text-xl font-bold text-pink-800">{t.title}</h3>
            <p className="text-pink-600">{t.subtitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3 border border-pink-200">
            <div className="font-semibold text-pink-700 mb-1">📱 {t.shortVideos}</div>
            <div className="text-gray-600">{t.shortVideosDesc}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-pink-200">
            <div className="font-semibold text-pink-700 mb-1">🎵 {t.noWatermark}</div>
            <div className="text-gray-600">{t.noWatermarkDesc}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-pink-200">
            <div className="font-semibold text-pink-700 mb-1">⚡ {t.fastDownload}</div>
            <div className="text-gray-600">{t.fastDownloadDesc}</div>
          </div>
        </div>
      </div>

      {/* Download Form */}
      <TikTokDownloadForm language={language} />

      {/* Tips */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
          <span className="text-xl mr-2">💡</span>
          {t.tipsTitle}
        </h4>
        <ul className="space-y-2 text-purple-700">
          <li className="flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            {t.tip1}
          </li>
          <li className="flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            {t.tip2}
          </li>
          <li className="flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            {t.tip3}
          </li>
          <li className="flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            {t.tip4}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TikTokDownloader; 