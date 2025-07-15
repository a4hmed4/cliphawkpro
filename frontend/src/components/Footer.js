import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const footerSections = [
    {
      title: 'الخدمات',
      links: [
        { text: 'تحميل من يوتيوب', href: '#youtube' },
        { text: 'تحميل من تيك توك', href: '#tiktok' },
        { text: 'تحميل من انستغرام', href: '#instagram' },
        { text: 'تحميل من تويتر', href: '#twitter' },
        { text: 'تحميل من فيسبوك', href: '#facebook' },
      ],
    },
    {
      title: 'الدعم',
      links: [
        { text: 'كيفية الاستخدام', href: '#how-to' },
        { text: 'الأسئلة الشائعة', href: '#faq' },
        { text: 'تواصل معنا', href: '#contact' },
        { text: 'الإبلاغ عن مشكلة', href: '#report' },
      ],
    },
    {
      title: 'حول التطبيق',
      links: [
        { text: 'من نحن', href: '#about' },
        { text: 'سياسة الخصوصية', href: '#privacy' },
        { text: 'شروط الاستخدام', href: '#terms' },
        { text: 'سياسة ملفات تعريف الارتباط', href: '#cookies' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <GitHubIcon />, href: '#github', label: 'GitHub' },
    { icon: <TwitterIcon />, href: '#twitter', label: 'Twitter' },
    { icon: <FacebookIcon />, href: '#facebook', label: 'Facebook' },
    { icon: <InstagramIcon />, href: '#instagram', label: 'Instagram' },
    { icon: <YouTubeIcon />, href: '#youtube', label: 'YouTube' },
    { icon: <EmailIcon />, href: 'mailto:contact@cliphawk.pro', label: 'Email' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
        color: 'white',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ClipHawk Pro
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                منصة احترافية لتحميل الفيديوهات من جميع المنصات الاجتماعية
                بأعلى جودة وأسرع سرعة ممكنة.
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                خدمة مجانية وآمنة 100%
              </Typography>
            </Box>
          </Grid>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <Grid item xs={12} sm={6} md={2} key={section.title}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: '#3B82F6',
                }}
              >
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {section.links.map((link) => (
                  <Box component="li" key={link.text} sx={{ mb: 1 }}>
                    <Link
                      href={link.href}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        textDecoration: 'none',
                        '&:hover': {
                          color: '#3B82F6',
                          textDecoration: 'underline',
                        },
                        fontSize: '0.9rem',
                      }}
                    >
                      {link.text}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'center' : 'center',
            gap: 2,
          }}
        >
          {/* Copyright */}
          <Typography
            variant="body2"
            sx={{
              opacity: 0.7,
              textAlign: isMobile ? 'center' : 'left',
            }}
          >
            © {new Date().getFullYear()} ClipHawk Pro. جميع الحقوق محفوظة.
          </Typography>

          {/* Social Links */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {socialLinks.map((social) => (
              <Tooltip key={social.label} title={social.label}>
                <IconButton
                  href={social.href}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      color: '#3B82F6',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Box>

        {/* Additional Info */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              opacity: 0.5,
              display: 'block',
              mb: 1,
            }}
          >
            تم تطوير هذا التطبيق باستخدام React و Material-UI
          </Typography>
          <Typography
            variant="caption"
            sx={{
              opacity: 0.5,
            }}
          >
            الإصدار 1.0.0 | آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 