import React from 'react';

const LanguageToggle = ({ language, setLanguage }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage('ar')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
          language === 'ar'
            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
        }`}
      >
        العربية
      </button>
      <span className="text-gray-400">|</span>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
          language === 'en'
            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
        }`}
      >
        English
      </button>
    </div>
  );
};

export default LanguageToggle; 