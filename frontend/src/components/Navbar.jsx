import React, { useState } from 'react';
import LanguageToggle from './LanguageToggle';
import logo from '../assets/logo.svg';

const Navbar = ({ currentPage, setCurrentPage, language, setLanguage, darkMode, setDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const platforms = {
    ar: [
      { id: 'youtube', name: 'يوتيوب', icon: '📺', description: 'تحميل فيديوهات يوتيوب' },
      { id: 'tiktok', name: 'تيك توك', icon: '🎵', description: 'تحميل فيديوهات تيك توك' },
      { id: 'twitter', name: 'تويتر', icon: '🐦', description: 'تحميل فيديوهات تويتر' },
      { id: 'instagram', name: 'انستغرام', icon: '📷', description: 'تحميل فيديوهات انستغرام' },
      { id: 'facebook', name: 'فيسبوك', icon: '📘', description: 'تحميل فيديوهات فيسبوك' },
      { id: 'general', name: 'منصات أخرى', icon: '🌐', description: 'تحميل من منصات أخرى' },
      { id: 'trim', name: 'تقطيع الملفات', icon: '✂️', description: 'تقطيع الفيديو والصوت' }
    ],
    en: [
      { id: 'youtube', name: 'YouTube', icon: '📺', description: 'Download YouTube videos' },
      { id: 'tiktok', name: 'TikTok', icon: '🎵', description: 'Download TikTok videos' },
      { id: 'twitter', name: 'Twitter', icon: '🐦', description: 'Download Twitter videos' },
      { id: 'instagram', name: 'Instagram', icon: '📷', description: 'Download Instagram videos' },
      { id: 'facebook', name: 'Facebook', icon: '📘', description: 'Download Facebook videos' },
      { id: 'general', name: 'Other', icon: '🌐', description: 'Download from other platforms' },
      { id: 'trim', name: 'Trim', icon: '✂️', description: 'Trim video and audio' }
    ]
  };

  const currentPlatforms = platforms[language] || platforms.ar;

  const getCurrentPlatform = () => {
    return currentPlatforms.find(p => p.id === currentPage) || currentPlatforms[0];
  };

  return (
    <nav className={`bg-white dark:bg-gray-950 shadow-lg border-b border-gray-100 dark:border-gray-800 ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="ClipHawk Logo" className="w-10 h-10 object-contain" />
            <div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">ClipHawk</span>
              <div className="text-xs text-gray-500 dark:text-gray-300">Pro</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {currentPlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setCurrentPage(platform.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === platform.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
                    : 'text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{platform.icon}</span>
                  <span>{platform.name}</span>
                </div>
              </button>
            ))}
            <div className="border-l border-gray-300 dark:border-gray-700 h-6 mx-3"></div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={darkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.03a1 1 0 011.41 0l.71.7a1 1 0 01-1.41 1.42l-.7-.71a1 1 0 010-1.41zM18 9a1 1 0 100 2h-1a1 1 0 100-2h1zm-2.03 4.22a1 1 0 010 1.41l-.7.71a1 1 0 01-1.42-1.41l.71-.7a1 1 0 011.41 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-2.03a1 1 0 00-1.41 0l-.71.7a1 1 0 001.41 1.42l.7-.71a1 1 0 000-1.41zM4 11a1 1 0 100-2H3a1 1 0 100 2h1zm2.03-4.22a1 1 0 000-1.41l-.7-.71A1 1 0 014.6 5.46l.71.7a1 1 0 001.41 0zM10 6a4 4 0 100 8 4 4 0 000-8z" /></svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>
            <LanguageToggle language={language} setLanguage={setLanguage} />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">{language === 'ar' ? 'فتح القائمة' : 'Open menu'}</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
            {currentPlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => {
                  setCurrentPage(platform.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-right px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  currentPage === platform.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
                    : 'text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span>{platform.icon}</span>
                  <span>{platform.name}</span>
                </div>
              </button>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-3">
              <div className="flex justify-center">
                <LanguageToggle language={language} setLanguage={setLanguage} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Platform Indicator */}
      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center">
            <span className="text-lg mr-2">{getCurrentPlatform().icon}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {getCurrentPlatform().description}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 