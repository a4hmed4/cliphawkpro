import React, { useState } from 'react';
import os from 'os';
import yt_dlp from 'yt-dlp';

const DownloadFormGeneral = ({ language }) => {
  const [formData, setFormData] = useState({
    url: '',
    quality: '720p',
    format: 'mp4',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [downloadFilename, setDownloadFilename] = useState('');
  const [progress, setProgress] = useState(0);

  // Video and audio formats
  const videoFormats = ['mp4', 'webm', 'mkv', 'avi'];
  const audioFormats = ['mp3', 'm4a', 'aac'];

  const qualities = ['360p', '480p', '720p'];
  const audioQualities = ['128k', '192k', '256k', '320k'];
  const formats = ['mp4', 'webm', 'mp3'];

  // Translations
  const translations = {
    ar: {
      downloadVideo: 'تحميل الفيديو',
      videoUrl: 'رابط الفيديو',
      quality: 'جودة الفيديو',
      audioQuality: 'جودة الصوت',
      format: 'نوع الملف',
      downloadFrom: 'تحميل من',
      pasteLink: 'الصق الرابط واختر الإعدادات المفضلة',
      processing: 'جاري المعالجة...',
      downloadFile: 'تحميل الملف',
      fileReady: 'الملف جاهز للتحميل!',
      downloadFailed: 'فشل في التحميل',
      networkError: 'خطأ في الشبكة. تأكد من تشغيل الخادم الخلفي.',
      downloadCompleted: 'تم التحميل بنجاح!',
      mp4Video: '🎥 فيديو MP4',
      mp3Audio: '🎵 صوت MP3',
      selectQuality: 'اختر الجودة المناسبة'
    },
    en: {
      downloadVideo: 'Download Video',
      videoUrl: 'Video URL',
      quality: 'Video Quality',
      audioQuality: 'Audio Quality',
      format: 'File Format',
      downloadFrom: 'Download from',
      pasteLink: 'Paste the link and choose your preferred settings',
      processing: 'Processing...',
      downloadFile: 'Download File',
      fileReady: 'File ready for download!',
      downloadFailed: 'Download failed',
      networkError: 'Network error. Make sure the backend is running.',
      downloadCompleted: 'Download completed successfully!',
      mp4Video: '🎥 MP4 Video',
      mp3Audio: '🎵 MP3 Audio',
      selectQuality: 'Select appropriate quality'
    }
  };

  const t = translations[language] || translations.en;

  // Add a new state for selected extension
  const [selectedExt, setSelectedExt] = useState('mp4');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.url.trim()) {
      showMessage(t.enterValidUrl, 'error');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setDownloadFilename('');
    setProgress(0);

    // Simulate progress bar
    let fakeProgress = 0;
    const progressInterval = setInterval(() => {
      fakeProgress += Math.random() * 20;
      setProgress(prev => (fakeProgress > 90 ? 90 : fakeProgress));
    }, 400);

    try {
      const requestData = {
        url: formData.url.trim(),
        quality: formData.quality,
        format: formData.format,
        ext: selectedExt,
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      };

      const response = await fetch('http://localhost:8000/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        showMessage(data.message, 'success');
        setDownloadFilename(data.filename);
      } else {
        showMessage(data.detail || t.downloadFailed, 'error');
      }
    } catch (error) {
      clearInterval(progressInterval);
      showMessage(t.networkError, 'error');
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleDownload = async (filename) => {
    if (!filename) return;

    try {
      const response = await fetch(`http://localhost:8000/download/${filename}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Clean up the file on the server
        await fetch(`http://localhost:8000/cleanup/${filename}`, {
          method: 'DELETE',
        });
        
        if (filename === downloadFilename) {
          setDownloadFilename('');
        }
        
        showMessage(t.downloadCompleted, 'success');
      } else {
        showMessage('Failed to download file', 'error');
      }
    } catch (error) {
      showMessage(t.errorDownloading, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Download Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
            <span className="text-2xl">🎥</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t.downloadFrom} General
          </h2>
          <p className="text-gray-600">
            {t.pasteLink}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.videoUrl}
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="https://www.instagram.com/..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          {/* Quality and Format Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.format === 'mp4' ? t.quality : t.audioQuality}
              </label>
              <select
                name="quality"
                value={formData.quality}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {(formData.format === 'mp4' ? qualities : audioQualities).map((quality) => (
                  <option key={quality} value={quality}>
                    {quality}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.format}
              </label>
              <div className="grid grid-cols-2 gap-3 mb-2">
                {formats.map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ 
                        ...prev, 
                        format,
                        quality: format === 'mp4' ? '720p' : '192k'
                      }));
                      setSelectedExt(format === 'mp4' ? 'mp4' : 'mp3');
                    }}
                    className={`p-3 rounded-lg border transition-colors font-medium ${
                      formData.format === format
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {format === 'mp4' ? t.mp4Video : t.mp3Audio}
                  </button>
                ))}
              </div>
              {/* Extension select */}
              <select
                value={selectedExt}
                onChange={e => setSelectedExt(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {(formData.format === 'mp4' ? videoFormats : audioFormats).map(ext => (
                  <option key={ext} value={ext}>{ext.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress Bar */}
          {isLoading && (
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Download Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg text-lg font-medium transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{t.processing}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>⬇️</span>
                  <span>{t.downloadVideo}</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          messageType === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center space-x-2">
            <span>
              {messageType === 'success' ? '✅' : '❌'}
            </span>
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}

      {/* Download Links */}
      <div className="space-y-4">
        {downloadFilename && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎥</span>
                <div>
                  <h4 className="font-medium text-gray-900">{t.fileReady}</h4>
                  <p className="text-sm text-gray-600">{downloadFilename}</p>
                </div>
              </div>
              <button
                onClick={() => handleDownload(downloadFilename)}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                {t.downloadFile}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadFormGeneral; 