import React, { useState } from 'react';
import Navbar from './components/Navbar';
import YouTubeDownloader from './components/YouTubeDownloader';
import TikTokDownloader from './components/TikTokDownloader';
import TwitterDownloader from './components/TwitterDownloader';
import InstagramDownloader from './components/InstagramDownloader';
import FacebookDownloader from './components/FacebookDownloader';
import GeneralDownloader from './components/GeneralDownloader';
import TrimPage from './components/TrimPage';
import './index.css';
import logo from './assets/logo.svg';
import banner from './assets/banner.png';

function App() {
  const [currentPage, setCurrentPage] = useState('youtube');
  const [language, setLanguage] = useState('ar');
  const [darkMode, setDarkMode] = useState(false); // Default: light mode

  // Apply dark class to <html>
  React.useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkMode]);

  React.useEffect(() => {
    let base = 'cliphawkpro.vercel.app';
    if (currentPage === 'tiktok') {
      document.title = base + '/tiktok';
    } else if (currentPage === 'youtube') {
      document.title = base;
    } else {
      document.title = base + '/' + currentPage;
    }
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'youtube':
        return <YouTubeDownloader language={language} />;
      case 'tiktok':
        return <TikTokDownloader language={language} />;
      case 'twitter':
        return <TwitterDownloader language={language} />;
      case 'instagram':
        return <InstagramDownloader language={language} />;
      case 'facebook':
        return <FacebookDownloader language={language} />;
      case 'general':
        return <GeneralDownloader language={language} />;
      case 'trim':
        return <TrimPage language={language} />;
      default:
        return <YouTubeDownloader language={language} />;
    }
  };

  // Translations
  const translations = {
    ar: {
      title: 'ClipHawk Pro',
      subtitle: 'تحميل الفيديوهات باحترافية من جميع المنصات',
      footer: 'تم التطوير بواسطة Sneed & ClipHawk Pro Team Copyright © 2025'
    },
    en: {
      title: 'ClipHawk Pro',
      subtitle: 'Download videos professionally from all platforms',
      footer: ' Developed by Sneed & ClipHawk Pro Team Copyright © 2025'
    }
  };

  const t = translations[language] || translations.ar;

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} language={language} setLanguage={setLanguage} darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-3">
            <img src={logo} alt="ClipHawk Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {t.title}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
          <div className="flex justify-center mt-6">
            <img src={banner} alt="ClipHawk Banner" className="max-w-full h-auto rounded-xl shadow-md" style={{maxHeight: '180px'}} />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {renderPage()}
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm space-y-2">
          <br></br>
          <p>Developed by Sneed & ClipHawk Pro Team</p>
          <p>Copyright © 2025</p>
        </footer>
      </div>
    </div>
  );
}

export default App; 