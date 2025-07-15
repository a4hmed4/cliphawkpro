import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  ContentPaste as PasteIcon,
  Clear as ClearIcon,
  YouTube as YouTubeIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  TikTok as TikTokIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

const VideoDownloader = ({ isLoading, setIsLoading }) => {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);

  const platforms = [
    {
      name: 'YouTube',
      icon: <YouTubeIcon />,
      color: '#FF0000',
      patterns: ['youtube.com', 'youtu.be'],
    },
    {
      name: 'Instagram',
      icon: <InstagramIcon />,
      color: '#E4405F',
      patterns: ['instagram.com'],
    },
    {
      name: 'Twitter',
      icon: <TwitterIcon />,
      color: '#1DA1F2',
      patterns: ['twitter.com', 'x.com'],
    },
    {
      name: 'Facebook',
      icon: <FacebookIcon />,
      color: '#1877F2',
      patterns: ['facebook.com', 'fb.com'],
    },
    {
      name: 'TikTok',
      icon: <TikTokIcon />,
      color: '#000000',
      patterns: ['tiktok.com'],
    },
  ];

  useEffect(() => {
    detectPlatform(url);
  }, [url]);

  const detectPlatform = (inputUrl) => {
    if (!inputUrl) {
      setPlatform(null);
      return;
    }

    const detectedPlatform = platforms.find((p) =>
      p.patterns.some((pattern) => inputUrl.includes(pattern))
    );

    setPlatform(detectedPlatform);
    setError('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      setError('لا يمكن الوصول إلى الحافظة');
    }
  };

  const handleClear = () => {
    setUrl('');
    setPlatform(null);
    setError('');
    setSuccess('');
    setVideoInfo(null);
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      setError('يرجى إدخال رابط الفيديو');
      return;
    }

    if (!platform) {
      setError('الرابط غير مدعوم. يرجى التأكد من أن الرابط من منصة مدعومة');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call to backend
      const response = await fetch('http://localhost:8000/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        throw new Error('فشل في تحميل الفيديو');
      }

      const data = await response.json();
      setVideoInfo(data);
      setSuccess('تم العثور على الفيديو بنجاح! اختر جودة التحميل');
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تحميل الفيديو');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQualityDownload = async (quality) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/download-quality', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim(), quality }),
      });

      if (!response.ok) {
        throw new Error('فشل في تحميل الفيديو');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `video_${quality}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      setSuccess('تم تحميل الفيديو بنجاح!');
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تحميل الفيديو');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Main Download Card */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 3,
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            تحميل الفيديوهات باحترافية
          </Typography>

          <Typography
            variant="body1"
            sx={{ textAlign: 'center', mb: 4, color: 'text.secondary' }}
          >
            قم بلصق رابط الفيديو من يوتيوب، تيك توك، انستغرام، تويتر أو فيسبوك
          </Typography>

          {/* URL Input */}
          <Box sx={{ position: 'relative', mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '1.1rem',
                },
              }}
              InputProps={{
                endAdornment: (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="لصق من الحافظة">
                      <IconButton onClick={handlePaste} size="small">
                        <PasteIcon />
                      </IconButton>
                    </Tooltip>
                    {url && (
                      <Tooltip title="مسح">
                        <IconButton onClick={handleClear} size="small">
                          <ClearIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                ),
              }}
            />
          </Box>

          {/* Platform Detection */}
          {platform && (
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Chip
                icon={platform.icon}
                label={`تم اكتشاف: ${platform.name}`}
                sx={{
                  backgroundColor: platform.color,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1rem',
                  py: 1,
                }}
              />
            </Box>
          )}

          {/* Download Button */}
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleDownload}
              disabled={!url.trim() || isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <DownloadIcon />}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
                },
              }}
            >
              {isLoading ? 'جاري التحليل...' : 'تحليل الفيديو'}
            </Button>
          </Box>

          {/* Error/Success Messages */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Video Info and Quality Selection */}
      {videoInfo && (
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              معلومات الفيديو
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" color="text.secondary">
                  <strong>العنوان:</strong> {videoInfo.title}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" color="text.secondary">
                  <strong>المدة:</strong> {videoInfo.duration}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              اختر جودة التحميل
            </Typography>

            <Grid container spacing={2}>
              {videoInfo.qualities?.map((quality) => (
                <Grid item xs={12} sm={6} md={4} key={quality.label}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3,
                      },
                    }}
                    onClick={() => handleQualityDownload(quality.value)}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {quality.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {quality.size}
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      sx={{ mt: 1 }}
                    >
                      تحميل
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Supported Platforms */}
      <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
            المنصات المدعومة
          </Typography>
          
          <Grid container spacing={2} justifyContent="center">
            {platforms.map((platform) => (
              <Grid item key={platform.name}>
                <Chip
                  icon={platform.icon}
                  label={platform.name}
                  sx={{
                    backgroundColor: platform.color,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '1rem',
                    py: 1,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VideoDownloader; 