import React from 'react';
import FacebookDownloadForm from './FacebookDownloadForm';

const FacebookDownloader = ({ language }) => {
  // Translations
  const translations = {
    ar: {
      title: 'فيسبوك',
      subtitle: 'منصة التواصل الاجتماعي الأكبر في العالم',
      videos: 'الفيديوهات',
      videosDesc: 'تحميل فيديوهات فيسبوك بجودة عالية',
      reels: 'ريلز',
      reelsDesc: 'تحميل ريلز فيسبوك القصيرة',
      stories: 'ستوريز',
      storiesDesc: 'تحميل ستوريز فيسبوك',
      tipsTitle: 'نصائح للتحميل من فيسبوك',
      tip1: 'انسخ الرابط من منشور فيسبوك',
      tip2: 'يمكنك تحميل من الحسابات العامة فقط',
      tip3: 'جودة الفيديو تصل إلى 1080p',
      tip4: 'استخدم تقطيع الفيديو لتحميل جزء محدد'
    },
    en: {
      title: 'Facebook',
      subtitle: 'The world\'s largest social media platform',
      videos: 'Videos',
      videosDesc: 'Download Facebook videos in high quality',
      reels: 'Reels',
      reelsDesc: 'Download Facebook short videos',
      stories: 'Stories',
      storiesDesc: 'Download Facebook stories',
      tipsTitle: 'Tips for downloading from Facebook',
      tip1: 'Copy the link from Facebook post',
      tip2: 'You can download from public accounts only',
      tip3: 'Video quality up to 1080p',
      tip4: 'Use video trimming to download specific parts'
    }
  };

  const t = translations[language] || translations.ar;

  return (
    <div className="space-y-6">
      {/* Platform Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">📘</span>
          <div>
            <h3 className="text-xl font-bold text-blue-800">{t.title}</h3>
            <p className="text-blue-600">{t.subtitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="font-semibold text-blue-700 mb-1">🎥 {t.videos}</div>
            <div className="text-gray-600">{t.videosDesc}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="font-semibold text-blue-700 mb-1">📱 {t.reels}</div>
            <div className="text-gray-600">{t.reelsDesc}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="font-semibold text-blue-700 mb-1">📸 {t.stories}</div>
            <div className="text-gray-600">{t.storiesDesc}</div>
          </div>
        </div>
      </div>

      {/* Download Form */}
      <FacebookDownloadForm language={language} />

      {/* Tips */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-indigo-800 mb-3 flex items-center">
          <span className="text-xl mr-2">💡</span>
          {t.tipsTitle}
        </h4>
        <ul className="space-y-2 text-indigo-700">
          <li className="flex items-start">
            <span className="text-indigo-500 mr-2">•</span>
            {t.tip1}
          </li>
          <li className="flex items-start">
            <span className="text-indigo-500 mr-2">•</span>
            {t.tip2}
          </li>
          <li className="flex items-start">
            <span className="text-indigo-500 mr-2">•</span>
            {t.tip3}
          </li>
          <li className="flex items-start">
            <span className="text-indigo-500 mr-2">•</span>
            {t.tip4}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FacebookDownloader; 