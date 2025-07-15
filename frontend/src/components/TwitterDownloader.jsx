import React from 'react';
import TwitterDownloadForm from './TwitterDownloadForm';

const TwitterDownloader = ({ language }) => {
  return (
    <div className="space-y-6">
      {/* Platform Info */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-100 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">🐦</span>
          <div>
            <h3 className="text-xl font-bold text-blue-800">تويتر</h3>
            <p className="text-blue-600">منصة التواصل الاجتماعي الرائدة</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="font-semibold text-blue-700 mb-1">📹 فيديوهات قصيرة</div>
            <div className="text-gray-600">تحميل فيديوهات تويتر وسبيسز</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="font-semibold text-blue-700 mb-1">🎵 بودكاست</div>
            <div className="text-gray-600">تحميل ملفات الصوت من سبيسز</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="font-semibold text-blue-700 mb-1">⚡ تحميل سريع</div>
            <div className="text-gray-600">سرعة في التحميل والمعالجة</div>
          </div>
        </div>
      </div>

      {/* Download Form */}
      <TwitterDownloadForm language={language} />

      {/* Tips */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-cyan-800 mb-3 flex items-center">
          <span className="text-xl mr-2">💡</span>
          نصائح للتحميل من تويتر
        </h4>
        <ul className="space-y-2 text-cyan-700">
          <li className="flex items-start">
            <span className="text-cyan-500 mr-2">•</span>
            انسخ الرابط من التغريدة أو سبيس
          </li>
          <li className="flex items-start">
            <span className="text-cyan-500 mr-2">•</span>
            يمكنك تحميل فيديوهات من التغريدات العامة
          </li>
          <li className="flex items-start">
            <span className="text-cyan-500 mr-2">•</span>
            دعم كامل لتحميل سبيسز كملفات صوتية
          </li>
          <li className="flex items-start">
            <span className="text-cyan-500 mr-2">•</span>
            استخدم تقطيع الفيديو لتحميل جزء محدد
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TwitterDownloader; 