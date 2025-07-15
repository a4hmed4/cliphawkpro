import React from 'react';
import InstagramDownloadForm from './InstagramDownloadForm';

const InstagramDownloader = ({ language }) => {
  return (
    <div className="space-y-6">
      {/* Platform Info */}
      <div className="bg-gradient-to-r from-pink-50 to-orange-100 border border-pink-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">📷</span>
          <div>
            <h3 className="text-xl font-bold text-pink-800">انستغرام</h3>
            <p className="text-pink-600">منصة الصور والفيديوهات الشهيرة</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3 border border-pink-200">
            <div className="font-semibold text-pink-700 mb-1">📱 ستوريز</div>
            <div className="text-gray-600">تحميل ستوريز انستغرام</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-pink-200">
            <div className="font-semibold text-pink-700 mb-1">📹 ريلز</div>
            <div className="text-gray-600">تحميل ريلز انستغرام</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-pink-200">
            <div className="font-semibold text-pink-700 mb-1">🎵 IGTV</div>
            <div className="text-gray-600">تحميل فيديوهات IGTV</div>
          </div>
        </div>
      </div>

      {/* Download Form */}
      <InstagramDownloadForm language={language} />

      {/* Tips */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-orange-800 mb-3 flex items-center">
          <span className="text-xl mr-2">💡</span>
          نصائح للتحميل من انستغرام
        </h4>
        <ul className="space-y-2 text-orange-700">
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">•</span>
            انسخ الرابط من المنشور أو الستوري
          </li>
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">•</span>
            يمكنك تحميل من الحسابات العامة فقط
          </li>
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">•</span>
            دعم كامل لستوريز وريلز وIGTV
          </li>
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">•</span>
            استخدم تقطيع الفيديو لتحميل جزء محدد
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InstagramDownloader; 