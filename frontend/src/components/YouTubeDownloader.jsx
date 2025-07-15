import React from 'react';
import YouTubeDownloadForm from './YouTubeDownloadForm';

const YouTubeDownloader = ({ language }) => {
  // Translations
  const translations = {
    ar: {
      title: 'يوتيوب',
      subtitle: 'أكبر منصة فيديو في العالم',
      videos: 'الفيديوهات',
      videosDesc: 'دعم كامل لجميع أنواع الفيديوهات',
      audio: 'الصوتيات',
      audioDesc: 'استخراج الصوت بجودة عالية',
      speed: 'السرعة',
      speedDesc: 'تحميل سريع ومستقر',
      tipsTitle: 'نصائح للتحميل من يوتيوب',
      tip1: 'تأكد من أن الفيديو متاح للجمهور',
      tip2: 'يمكنك تحميل قوائم التشغيل كاملة',
      tip3: 'جودة 1080p متاحة للفيديوهات عالية الدقة',
      tip4: 'استخدم تقطيع الفيديو لتحميل أجزاء محددة'
    },
    en: {
      title: 'YouTube',
      subtitle: 'The world\'s largest video platform',
      videos: 'Videos',
      videosDesc: 'Full support for all video types',
      audio: 'Audio',
      audioDesc: 'High-quality audio extraction',
      speed: 'Speed',
      speedDesc: 'Fast and stable download',
      tipsTitle: 'Tips for downloading from YouTube',
      tip1: 'Make sure the video is available to the public',
      tip2: 'You can download complete playlists',
      tip3: '1080p quality available for high-definition videos',
      tip4: 'Use video trimming to download specific parts'
    }
  };

  const t = translations[language] || translations.ar;

  return (
    <div className="space-y-6">
      {/* Platform Info */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">📺</span>
          <div>
            <h3 className="text-xl font-bold text-red-800">{t.title}</h3>
            <p className="text-red-600">{t.subtitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3 border border-red-200">
            <div className="font-semibold text-red-700 mb-1">🎥 {t.videos}</div>
            <div className="text-gray-600">{t.videosDesc}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-red-200">
            <div className="font-semibold text-red-700 mb-1">🎵 {t.audio}</div>
            <div className="text-gray-600">{t.audioDesc}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-red-200">
            <div className="font-semibold text-red-700 mb-1">⚡ {t.speed}</div>
            <div className="text-gray-600">{t.speedDesc}</div>
          </div>
        </div>
      </div>

      {/* Download Form */}
      <YouTubeDownloadForm language={language} />

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
          <span className="text-xl mr-2">💡</span>
          {t.tipsTitle}
        </h4>
        <ul className="space-y-2 text-blue-700">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            {t.tip1}
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            {t.tip2}
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            {t.tip3}
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            {t.tip4}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default YouTubeDownloader; 