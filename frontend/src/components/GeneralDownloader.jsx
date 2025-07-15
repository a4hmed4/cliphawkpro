import React from 'react';
import GeneralDownloadForm from './GeneralDownloadForm';

const GeneralDownloader = ({ language }) => {
  const supportedPlatforms = [
    { name: 'لينكد إن', icon: '💼', color: 'indigo' },
    { name: 'ريديت', icon: '🤖', color: 'orange' },
    { name: 'فيميو', icon: '🎬', color: 'cyan' },
    { name: 'ديلي موشن', icon: '🎭', color: 'purple' },
    { name: 'سناب شات', icon: '👻', color: 'yellow' },
    { name: 'تليجرام', icon: '📱', color: 'blue' }
  ];

  return (
    <div className="space-y-6">
      {/* Platform Info */}
      <div className="bg-gradient-to-r from-green-50 to-teal-100 border border-green-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">🌐</span>
          <div>
            <h3 className="text-xl font-bold text-green-800">منصات أخرى</h3>
            <p className="text-green-600">تحميل من أكثر من 1000 منصة مختلفة</p>
          </div>
        </div>
        
        {/* Supported Platforms Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {supportedPlatforms.map((platform, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-green-200 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl mb-1">{platform.icon}</div>
              <div className="text-xs font-medium text-gray-700">{platform.name}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3 border border-green-200">
            <div className="font-semibold text-green-700 mb-1">🌍 دعم عالمي</div>
            <div className="text-gray-600">أكثر من 1000 منصة مدعومة</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-green-200">
            <div className="font-semibold text-green-700 mb-1">🔧 تحديث مستمر</div>
            <div className="text-gray-600">دعم للمنصات الجديدة</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-green-200">
            <div className="font-semibold text-green-700 mb-1">⚡ تحميل سريع</div>
            <div className="text-gray-600">سرعة في التحميل والمعالجة</div>
          </div>
        </div>
      </div>

      {/* Download Form */}
      <GeneralDownloadForm language={language} />

      {/* Tips */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-teal-800 mb-3 flex items-center">
          <span className="text-xl mr-2">💡</span>
          نصائح للتحميل من المنصات الأخرى
        </h4>
        <ul className="space-y-2 text-teal-700">
          <li className="flex items-start">
            <span className="text-teal-500 mr-2">•</span>
            تأكد من أن الرابط صحيح ومتاح للجمهور
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 mr-2">•</span>
            بعض المنصات قد تحتاج إلى تسجيل دخول
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 mr-2">•</span>
            جودة الفيديو تعتمد على المصدر الأصلي
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 mr-2">•</span>
            استخدم تقطيع الفيديو لتحميل جزء محدد
          </li>
        </ul>
      </div>

      {/* Supported Platforms List */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="text-xl mr-2">📋</span>
          المنصات المدعومة
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {[
            'لينكد إن', 'ريديت', 'فيميو', 'ديلي موشن', 'سناب شات', 'تليجرام',
            'ديسكورد', 'تويش', 'ميكس كلود', 'ساوند كلود', 'سبوتيفاي', 'فاينس'
          ].map((platform, index) => (
            <div key={index} className="bg-white rounded-lg p-2 border border-gray-200 text-center">
              <span className="text-gray-700">{platform}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-600 text-sm mt-4 text-center">
          وأكثر من 1000 منصة أخرى...
        </p>
      </div>
    </div>
  );
};

export default GeneralDownloader; 