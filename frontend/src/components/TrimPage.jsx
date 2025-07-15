import React, { useState } from 'react';

const TrimPage = ({ language }) => {
  const [trimData, setTrimData] = useState({
    trimStart: '',
    trimEnd: '',
    format: 'mp4',
    extractAudio: false,
    // Add separate time fields
    startHours: '0',
    startMinutes: '0',
    startSeconds: '0',
    endHours: '',
    endMinutes: '',
    endSeconds: '',
  });
  
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [processedFilename, setProcessedFilename] = useState('');
  const [currentAction, setCurrentAction] = useState(''); // 'trim', 'extract', 'audio-trim'

  const videoFormats = ['mp4', 'webm', 'mkv', 'avi'];
  const audioFormats = ['mp3', 'm4a', 'aac'];
  const formats = ['mp4', 'webm', 'mkv', 'avi', 'mp3', 'm4a', 'aac'];

  // Translations
  const translations = {
    ar: {
      title: 'تقطيع الملفات',
      subtitle: 'تقطيع الفيديو والصوت واستخراج الصوت',
      uploadVideo: 'رفع فيديو أو صوت',
      selectFile: 'اختر ملف',
      dragDrop: 'اسحب الملف هنا أو اضغط للاختيار',
      trimOptions: 'خيارات التقطيع',
      startTime: 'وقت البداية',
      endTime: 'وقت النهاية',
      hours: 'ساعات',
      minutes: 'دقائق',
      seconds: 'ثواني',
      outputFormat: 'تنسيق المخرجات',
      extractAudio: 'استخراج الصوت فقط',
      extractAudioDesc: 'تحويل الفيديو إلى ملف صوتي',
      trimButton: 'تقطيع الفيديو',
      extractButton: 'استخراج الصوت',
      audioTrimButton: 'تقطيع الصوت',
      processing: 'جاري المعالجة...',
      processingStep: 'جاري معالجة الملف...',
      fileReady: 'الملف جاهز للتحميل!',
      downloadFile: 'تحميل الملف',
      enterValidFile: 'يرجى اختيار ملف صحيح',
      enterTime: 'يرجى إدخال وقت البداية أو النهاية',
      enterStartTime: 'يرجى إدخال وقت البداية على الأقل',
      enterEndTime: 'يرجى إدخال وقت النهاية',
      trimFailed: 'فشل في تقطيع الملف',
      trimCompleted: 'تم التقطيع بنجاح!',
      extractCompleted: 'تم استخراج الصوت بنجاح!',
      networkError: 'خطأ في الشبكة. تأكد من تشغيل الخادم الخلفي.',
      errorDownloading: 'خطأ في تحميل الملف',
      invalidTimeRange: 'وقت البداية يجب أن يكون أقل من وقت النهاية',
      mp4Video: '🎥 فيديو MP4',
      webmVideo: '🎥 فيديو WebM',
      mkvVideo: '🎥 فيديو MKV',
      aviVideo: '🎥 فيديو AVI',
      mp3Audio: '🎵 صوت MP3',
      m4aAudio: '🎵 صوت M4A',
      aacAudio: '🎵 صوت AAC',
      leaveEmpty: 'اتركه فارغاً للنهاية',
      features: {
        videoTrim: 'تقطيع الفيديو',
        videoTrimDesc: 'تقطيع الفيديو بوقت محدد',
        audioTrim: 'تقطيع الصوت',
        audioTrimDesc: 'تقطيع ملفات الصوت',
        audioExtract: 'استخراج الصوت',
        audioExtractDesc: 'تحويل الفيديو إلى صوت'
      },
      tips: {
        title: 'نصائح للتقطيع',
        tip1: 'يمكنك تقطيع أي نوع من الفيديوهات أو الصوت',
        tip2: 'استخدم استخراج الصوت لتحويل الفيديو إلى MP3',
        tip3: 'وقت البداية والنهاية بالثواني',
        tip4: 'اترك وقت النهاية فارغاً للوصول لنهاية الملف'
      }
    },
    en: {
      title: 'Trim Files',
      subtitle: 'Trim video and audio, extract audio',
      uploadVideo: 'Upload video or audio',
      selectFile: 'Select File',
      dragDrop: 'Drag file here or click to select',
      trimOptions: 'Trim Options',
      startTime: 'Start Time',
      endTime: 'End Time',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      outputFormat: 'Output Format',
      extractAudio: 'Extract Audio Only',
      extractAudioDesc: 'Convert video to audio file',
      trimButton: 'Trim Video',
      extractButton: 'Extract Audio',
      audioTrimButton: 'Trim Audio',
      processing: 'Processing...',
      processingStep: 'Processing file...',
      fileReady: 'File ready for download!',
      downloadFile: 'Download File',
      enterValidFile: 'Please select a valid file',
      enterTime: 'Please enter start or end time',
      enterStartTime: 'Please enter start time at least',
      enterEndTime: 'Please enter end time',
      trimFailed: 'Failed to trim file',
      trimCompleted: 'Trim completed successfully!',
      extractCompleted: 'Audio extraction completed successfully!',
      networkError: 'Network error. Make sure the backend is running.',
      errorDownloading: 'Error downloading file',
      invalidTimeRange: 'Start time must be less than end time',
      mp4Video: '🎥 MP4 Video',
      webmVideo: '🎥 WebM Video',
      mkvVideo: '🎥 MKV Video',
      aviVideo: '🎥 AVI Video',
      mp3Audio: '🎵 MP3 Audio',
      m4aAudio: '🎵 M4A Audio',
      aacAudio: '🎵 AAC Audio',
      leaveEmpty: 'Leave empty for end',
      features: {
        videoTrim: 'Video Trimming',
        videoTrimDesc: 'Trim video to specific time',
        audioTrim: 'Audio Trimming',
        audioTrimDesc: 'Trim audio files',
        audioExtract: 'Audio Extraction',
        audioExtractDesc: 'Convert video to audio'
      },
      tips: {
        title: 'Trim Tips',
        tip1: 'You can trim any type of video or audio',
        tip2: 'Use audio extraction to convert video to MP3',
        tip3: 'Start and end times in seconds',
        tip4: 'Leave end time empty to go to file end'
      }
    }
  };

  const t = translations[language] || translations.ar;

  // Helper functions for time conversion
  const timeToSeconds = (hours, minutes, seconds) => {
    return (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60 + (parseFloat(seconds) || 0);
  };

  const secondsToTime = (totalSeconds) => {
    if (!totalSeconds) return { hours: 0, minutes: 0, seconds: 0 };
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  const formatTimeDisplay = (hours, minutes, seconds) => {
    const h = hours || 0;
    const m = minutes || 0;
    const s = seconds || 0;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    if (m > 0) return `${m}:${s.toString().padStart(2, '0')}`;
    return `${s}`;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTrimData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        // More realistic progress for video processing
        if (prev < 20) {
          return prev + Math.random() * 5; // Slow start
        } else if (prev < 80) {
          return prev + Math.random() * 3; // Steady progress
        } else if (prev < 95) {
          return prev + Math.random() * 1; // Slow finish
        } else {
          return 95; // Don't reach 100% until actually complete
        }
      });
    }, 500); // Update every 500ms for smoother progress
    return interval;
  };

  const handleAction = async (action) => {
    if (!uploadedFile) {
      showMessage(t.enterValidFile, 'error');
      return;
    }

    // Convert time fields to seconds
    const startTimeSeconds = timeToSeconds(trimData.startHours, trimData.startMinutes, trimData.startSeconds);
    const endTimeSeconds = timeToSeconds(trimData.endHours, trimData.endMinutes, trimData.endSeconds);

    // For trim and audio-trim actions, require at least start time
    if ((action === 'trim' || action === 'audio-trim')) {
      if (startTimeSeconds === 0 && endTimeSeconds === 0) {
        showMessage(t.enterTime, 'error');
        return;
      }
    }

    // Validate that start time is not greater than end time if both are provided
    if (startTimeSeconds > 0 && endTimeSeconds > 0 && startTimeSeconds >= endTimeSeconds) {
      showMessage(t.invalidTimeRange, 'error');
      return;
    }

    // Ensure correct format is set based on action
    let finalFormat = trimData.format;
    if (action === 'extract') {
      // For audio extraction, ensure we use an audio format
      if (!['mp3', 'm4a', 'aac'].includes(trimData.format)) {
        finalFormat = 'mp3'; // Default to mp3 for audio extraction
      }
    } else if (action === 'audio-trim') {
      // For audio trimming, ensure we use an audio format
      if (!['mp3', 'm4a', 'aac'].includes(trimData.format)) {
        finalFormat = 'mp3'; // Default to mp3 for audio trimming
      }
    } else if (action === 'trim') {
      // For video trimming, ensure we use a video format
      if (!['mp4', 'webm', 'mkv', 'avi'].includes(trimData.format)) {
        finalFormat = 'mp4'; // Default to mp4 for video trimming
      }
    }

    setIsProcessing(true);
    setCurrentAction(action);
    setMessage('');
    setProgress(0);

    // Simulate progress
    const progressInterval = simulateProgress();

    try {
      const formDataToSend = new FormData();
      
      if (action === 'trim') {
        formDataToSend.append('trim_start', startTimeSeconds.toString());
        formDataToSend.append('trim_end', endTimeSeconds > 0 ? endTimeSeconds.toString() : '');
        formDataToSend.append('format', finalFormat);
      } else if (action === 'extract') {
        formDataToSend.append('trim_start', '0');
        formDataToSend.append('trim_end', '');
        formDataToSend.append('format', finalFormat);
      } else if (action === 'audio-trim') {
        formDataToSend.append('trim_start', startTimeSeconds.toString());
        formDataToSend.append('trim_end', endTimeSeconds > 0 ? endTimeSeconds.toString() : '');
        formDataToSend.append('format', finalFormat);
      }
      
      formDataToSend.append('file', uploadedFile);

      console.log('Sending trim request:', {
        action,
        startTime: startTimeSeconds,
        endTime: endTimeSeconds,
        format: finalFormat,
        fileName: uploadedFile.name,
        fileSize: uploadedFile.size
      });

      const response = await fetch('/api/trim', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      console.log('Trim response:', data);

      if (response.ok) {
        setProgress(100);
        const successMessage = action === 'extract' ? t.extractCompleted : t.trimCompleted;
        showMessage(successMessage, 'success');
        setProcessedFilename(data.filename);
      } else {
        console.error('Trim failed:', data);
        showMessage(data.detail || t.trimFailed, 'error');
      }
    } catch (error) {
      console.error('Network error during trim:', error);
      showMessage(t.networkError, 'error');
    } finally {
      clearInterval(progressInterval);
      setIsProcessing(false);
      setCurrentAction('');
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

  const handleDownload = async () => {
    if (!processedFilename) return;

    try {
      const response = await fetch(`/api/download-quality/${processedFilename}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = processedFilename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        showMessage(t.errorDownloading, 'error');
      }
    } catch (error) {
      showMessage(t.networkError, 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl shadow-2xl mb-6 animate-float">
          <span className="text-4xl">✂️</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t.title}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100 hover-lift">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg mb-4">
              <span className="text-2xl">🎬</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t.features.videoTrim}</h3>
            <p className="text-gray-600 text-sm">{t.features.videoTrimDesc}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-100 hover-lift">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg mb-4">
              <span className="text-2xl">🎵</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t.features.audioTrim}</h3>
            <p className="text-gray-600 text-sm">{t.features.audioTrimDesc}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-purple-100 hover-lift">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg mb-4">
              <span className="text-2xl">🎧</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t.features.audioExtract}</h3>
            <p className="text-gray-600 text-sm">{t.features.audioExtractDesc}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-xl border border-blue-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
              <div className="spinner"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.processing}</h3>
            <p className="text-gray-600">{t.processingStep}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-semibold text-gray-700">
              <span>0%</span>
              <span>{Math.round(progress)}%</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border border-gray-100">
        {/* File Upload Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t.uploadVideo}
          </h2>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center hover:border-blue-400 transition-all duration-300 bg-white/60 backdrop-blur-sm"
          >
            <input
              type="file"
              accept="video/*,audio/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <span className="text-3xl">📁</span>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    {uploadedFile ? uploadedFile.name : t.selectFile}
                  </p>
                  <p className="text-gray-600">{t.dragDrop}</p>
                </div>
              </div>
            </label>
          </div>

          {/* Action Selection Buttons (customized by file type) */}
          {uploadedFile && (
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {uploadedFile.type.startsWith('video') && (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentAction('trim')}
                    className={`px-6 py-3 rounded-xl text-lg font-bold transition-all duration-300 border-2 shadow-md ${
                      currentAction === 'trim'
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    🎬 {language === 'en' ? 'Trim Video' : 'تقطيع فيديو'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentAction('extract')}
                    className={`px-6 py-3 rounded-xl text-lg font-bold transition-all duration-300 border-2 shadow-md ${
                      currentAction === 'extract'
                        ? 'bg-purple-600 text-white border-purple-700'
                        : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    🎧 {language === 'en' ? 'Extract Audio' : 'استخراج الصوت'}
                  </button>
                </>
              )}
              {uploadedFile.type.startsWith('audio') && (
                <button
                  type="button"
                  onClick={() => setCurrentAction('audio-trim')}
                  className={`px-6 py-3 rounded-xl text-lg font-bold transition-all duration-300 border-2 shadow-md ${
                    currentAction === 'audio-trim'
                      ? 'bg-green-600 text-white border-green-700'
                      : 'bg-white text-green-700 border-green-300 hover:bg-green-50'
                  }`}
                >
                  🎵 {language === 'en' ? 'Trim Audio' : 'تقطيع صوت'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
{/*         <div className="grid md:grid-cols-3 gap-6 mb-8">
 */}          {/* Trim Video Button */}
          {/* <button
            onClick={() => handleAction('trim')}
            disabled={isProcessing || !uploadedFile}
            className={`p-6 rounded-2xl text-lg font-bold transition-all duration-300 ${
              isProcessing || !uploadedFile
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl'
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-3xl">🎬</span>
              <span>{t.trimButton}</span>
            </div>
          </button> */}

          {/* Extract Audio Button */}
          {/* <button
            onClick={() => handleAction('extract')}
            disabled={isProcessing || !uploadedFile}
            className={`p-6 rounded-2xl text-lg font-bold transition-all duration-300 ${
              isProcessing || !uploadedFile
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl'
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-3xl">🎧</span>
              <span>{t.extractButton}</span>
            </div>
          </button>
 */}
          {/* Trim Audio Button */}
          {/* <button
            onClick={() => handleAction('audio-trim')}
            disabled={isProcessing || !uploadedFile}
            className={`p-6 rounded-2xl text-lg font-bold transition-all duration-300 ${
              isProcessing || !uploadedFile
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl'
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-3xl">🎵</span>
              <span>{t.audioTrimButton}</span>
            </div>
          </button>
        </div> */}

        {/* Trim Options Section */}
        {(currentAction === 'trim' || currentAction === 'audio-trim' || currentAction === 'extract') && (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {t.trimOptions}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Time Controls: show for trim and audio-trim only */}
              {(currentAction === 'trim' || currentAction === 'audio-trim') && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-orange-700 mb-2 text-center">
                    {t.startTime} / {t.endTime}
                  </h3>
                  <div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">{t.hours}</label>
                        <input
                          type="number"
                          name="startHours"
                          value={trimData.startHours}
                          onChange={handleInputChange}
                          placeholder="0"
                          min="0"
                          max="99"
                          className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">{t.minutes}</label>
                        <input
                          type="number"
                          name="startMinutes"
                          value={trimData.startMinutes}
                          onChange={handleInputChange}
                          placeholder="0"
                          min="0"
                          max="59"
                          className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">{t.seconds}</label>
                        <input
                          type="number"
                          name="startSeconds"
                          value={trimData.startSeconds}
                          onChange={handleInputChange}
                          placeholder="0"
                          min="0"
                          max="59"
                          step="0.1"
                          className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      {formatTimeDisplay(trimData.startHours, trimData.startMinutes, trimData.startSeconds)}
                    </div>
                    
                    {/* Quick Time Presets */}
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-2">
                        {language === 'en' ? 'Quick Times:' : 'أوقات سريعة:'}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: language === 'en' ? '30 sec' : '30 ثانية', hours: 0, minutes: 0, seconds: 30 },
                          { label: language === 'en' ? '1 min' : '1 دقيقة', hours: 0, minutes: 1, seconds: 0 },
                          { label: language === 'en' ? '5 min' : '5 دقائق', hours: 0, minutes: 5, seconds: 0 },
                          { label: language === 'en' ? '10 min' : '10 دقائق', hours: 0, minutes: 10, seconds: 0 },
                          { label: language === 'en' ? '30 min' : '30 دقيقة', hours: 0, minutes: 30, seconds: 0 },
                          { label: language === 'en' ? '1 hour' : '1 ساعة', hours: 1, minutes: 0, seconds: 0 },
                        ].map((preset, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setTrimData(prev => ({
                              ...prev,
                              startHours: preset.hours.toString(),
                              startMinutes: preset.minutes.toString(),
                              startSeconds: preset.seconds.toString()
                            }))}
                            className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">{t.hours}</label>
                        <input
                          type="number"
                          name="endHours"
                          value={trimData.endHours}
                          onChange={handleInputChange}
                          placeholder="0"
                          min="0"
                          max="99"
                          className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">{t.minutes}</label>
                        <input
                          type="number"
                          name="endMinutes"
                          value={trimData.endMinutes}
                          onChange={handleInputChange}
                          placeholder="0"
                          min="0"
                          max="59"
                          className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">{t.seconds}</label>
                        <input
                          type="number"
                          name="endSeconds"
                          value={trimData.endSeconds}
                          onChange={handleInputChange}
                          placeholder="0"
                          min="0"
                          max="59"
                          step="0.1"
                          className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      {trimData.endHours || trimData.endMinutes || trimData.endSeconds 
                        ? formatTimeDisplay(trimData.endHours, trimData.endMinutes, trimData.endSeconds)
                        : t.leaveEmpty
                      }
                    </div>
                    
                    {/* Quick Time Presets for End Time */}
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-2">
                        {language === 'en' ? 'Quick Times for End:' : 'أوقات سريعة للنهاية:'}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: language === 'en' ? '1 min' : '1 دقيقة', hours: 0, minutes: 1, seconds: 0 },
                          { label: language === 'en' ? '5 min' : '5 دقائق', hours: 0, minutes: 5, seconds: 0 },
                          { label: language === 'en' ? '10 min' : '10 دقائق', hours: 0, minutes: 10, seconds: 0 },
                          { label: language === 'en' ? '30 min' : '30 دقيقة', hours: 0, minutes: 30, seconds: 0 },
                          { label: language === 'en' ? '1 hour' : '1 ساعة', hours: 1, minutes: 0, seconds: 0 },
                          { label: language === 'en' ? '2 hours' : '2 ساعة', hours: 2, minutes: 0, seconds: 0 },
                        ].map((preset, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setTrimData(prev => ({
                              ...prev,
                              endHours: preset.hours.toString(),
                              endMinutes: preset.minutes.toString(),
                              endSeconds: preset.seconds.toString()
                            }))}
                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Format Selection */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t.outputFormat}
                  </label>
                  {currentAction === 'trim' && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2 text-center">
                        {language === 'en' ? '🎥 Video Formats' : '🎥 تنسيقات الفيديو'}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {videoFormats.map((format) => (
                          <button
                            key={format}
                            type="button"
                            onClick={() => setTrimData(prev => ({ ...prev, format }))}
                            className={`p-3 rounded-lg border-2 transition-all duration-300 text-sm font-medium ${
                              trimData.format === format
                                ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-lg'
                                : 'border-gray-200 bg-white/80 text-gray-600 hover:border-orange-300 hover:bg-orange-50/50'
                            }`}
                          >
                            {format === 'mp4' ? t.mp4Video : format === 'webm' ? t.webmVideo : format === 'mkv' ? t.mkvVideo : t.aviVideo}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {(currentAction === 'audio-trim' || currentAction === 'extract') && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2 text-center">
                        {language === 'en' ? '🎵 Audio Formats' : '🎵 تنسيقات الصوت'}
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {audioFormats.map((format) => (
                          <button
                            key={format}
                            type="button"
                            onClick={() => setTrimData(prev => ({ ...prev, format }))}
                            className={`p-3 rounded-lg border-2 transition-all duration-300 text-sm font-medium ${
                              trimData.format === format
                                ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-lg'
                                : 'border-gray-200 bg-white/80 text-gray-600 hover:border-orange-300 hover:bg-orange-50/50'
                            }`}
                          >
                            {format === 'mp3' ? t.mp3Audio : format === 'm4a' ? t.m4aAudio : t.aacAudio}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Execute Action Button */}
            <div className="mt-8 text-center">
              {console.log('Current action:', currentAction, 'Is processing:', isProcessing)}
              <button
                onClick={() => handleAction(currentAction)}
                disabled={isProcessing}
                className={`px-8 py-4 rounded-xl text-xl font-bold transition-all duration-300 shadow-xl ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : currentAction === 'trim'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                      : currentAction === 'extract'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>{t.processing}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-2xl">
                      {currentAction === 'trim' ? '🎬' : currentAction === 'extract' ? '🎧' : '🎵'}
                    </span>
                    <span>
                      {currentAction === 'trim' ? t.trimButton : currentAction === 'extract' ? t.extractButton : t.audioTrimButton}
                    </span>
                  </div>
                )}
              </button>
              
              {/* Fallback button for debugging */}
              {uploadedFile && currentAction && (
                <div className="mt-4">
                  <button
                    onClick={() => handleAction(currentAction)}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    تنفيذ العملية - {currentAction}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-xl border border-indigo-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          💡 {t.tips.title}
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <span className="text-blue-500 text-xl">•</span>
            <p className="text-gray-700">{t.tips.tip1}</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-blue-500 text-xl">•</span>
            <p className="text-gray-700">{t.tips.tip2}</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-blue-500 text-xl">•</span>
            <p className="text-gray-700">{t.tips.tip3}</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-blue-500 text-xl">•</span>
            <p className="text-gray-700">{t.tips.tip4}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-6 rounded-xl shadow-lg border-2 ${
          messageType === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">
              {messageType === 'success' ? '✅' : '❌'}
            </span>
            <span className="font-semibold">{message}</span>
          </div>
        </div>
      )}

      {/* Download Link */}
      {processedFilename && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🎉</span>
              <div>
                <h4 className="font-semibold text-gray-900">{t.fileReady}</h4>
                <p className="text-sm text-gray-600">{processedFilename}</p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {t.downloadFile}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrimPage; 