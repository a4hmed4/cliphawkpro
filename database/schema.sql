-- ClipHawk Database Schema for Hostinger
-- يمكن استخدامها لتتبع الإحصائيات والتحليلات

CREATE TABLE IF NOT EXISTS `download_stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `platform` varchar(50) NOT NULL,
  `format` varchar(10) NOT NULL,
  `quality` varchar(20) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `user_agent` text,
  `download_time` timestamp DEFAULT CURRENT_TIMESTAMP,
  `file_size` bigint(20) DEFAULT NULL,
  `status` enum('success','failed') DEFAULT 'success',
  PRIMARY KEY (`id`),
  KEY `idx_platform` (`platform`),
  KEY `idx_download_time` (`download_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `trim_stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action` enum('trim','extract','audio_trim') NOT NULL,
  `input_format` varchar(10) NOT NULL,
  `output_format` varchar(10) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `trim_time` timestamp DEFAULT CURRENT_TIMESTAMP,
  `file_size_before` bigint(20) DEFAULT NULL,
  `file_size_after` bigint(20) DEFAULT NULL,
  `status` enum('success','failed') DEFAULT 'success',
  PRIMARY KEY (`id`),
  KEY `idx_action` (`action`),
  KEY `idx_trim_time` (`trim_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `error_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `error_type` varchar(100) NOT NULL,
  `error_message` text NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `user_agent` text,
  `error_time` timestamp DEFAULT CURRENT_TIMESTAMP,
  `resolved` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_error_type` (`error_type`),
  KEY `idx_error_time` (`error_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- إدراج إحصائيات افتراضية
INSERT INTO `download_stats` (`platform`, `format`, `quality`, `ip_address`, `status`) VALUES
('youtube', 'mp4', '720p', '127.0.0.1', 'success'),
('tiktok', 'mp4', '720p', '127.0.0.1', 'success'),
('instagram', 'mp4', '720p', '127.0.0.1', 'success'); 