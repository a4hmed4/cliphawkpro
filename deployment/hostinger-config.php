<?php
/**
 * ClipHawk Hostinger Configuration
 * إعدادات ClipHawk لهوستنجر
 */

// Database Configuration (if using MySQL)
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name'); // استبدل باسم قاعدة البيانات الخاصة بك
define('DB_USER', 'your_username'); // استبدل باسم المستخدم
define('DB_PASS', 'your_password'); // استبدل بكلمة المرور

// Application Configuration
define('APP_NAME', 'ClipHawk');
define('APP_URL', 'https://yourdomain.com'); // استبدل بالدومين الخاص بك
define('APP_ENV', 'production');

// Security Configuration
define('SECRET_KEY', 'your-secret-key-here'); // استبدل بمفتاح سري قوي
define('JWT_SECRET', 'your-jwt-secret-here'); // استبدل بمفتاح JWT

// File Upload Configuration
define('MAX_FILE_SIZE', 100 * 1024 * 1024); // 100MB
define('ALLOWED_EXTENSIONS', ['mp4', 'avi', 'mov', 'mkv', 'webm', 'mp3', 'wav', 'aac', 'm4a']);

// Rate Limiting
define('RATE_LIMIT_REQUESTS', 100); // requests per hour
define('RATE_LIMIT_WINDOW', 3600); // 1 hour in seconds

// Logging Configuration
define('LOG_LEVEL', 'INFO');
define('LOG_FILE', '/home/username/public_html/logs/cliphawk.log'); // استبدل بالمسار الصحيح

// Google Analytics Configuration
define('GA_TRACKING_ID', 'G-XXXXXXXXXX'); // استبدل بمعرف Google Analytics

// AdSense Configuration
define('ADSENSE_CLIENT_ID', 'ca-pub-XXXXXXXXXX'); // استبدل بمعرف AdSense

// Database Connection Function
function getDBConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        return null;
    }
}

// Logging Function
function logActivity($message, $level = 'INFO') {
    $logEntry = date('Y-m-d H:i:s') . " [$level] " . $message . PHP_EOL;
    error_log($logEntry, 3, LOG_FILE);
}

// Rate Limiting Function
function checkRateLimit($ip) {
    $pdo = getDBConnection();
    if (!$pdo) return true; // Allow if DB connection fails
    
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count 
        FROM download_stats 
        WHERE ip_address = ? 
        AND download_time > DATE_SUB(NOW(), INTERVAL 1 HOUR)
    ");
    $stmt->execute([$ip]);
    $result = $stmt->fetch();
    
    return $result['count'] < RATE_LIMIT_REQUESTS;
}

// Security Functions
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

function validateUrl($url) {
    return filter_var($url, FILTER_VALIDATE_URL) && 
           preg_match('/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/', $url);
}

// Error Handling
function handleError($error, $context = []) {
    $pdo = getDBConnection();
    if ($pdo) {
        $stmt = $pdo->prepare("
            INSERT INTO error_logs (error_type, error_message, ip_address, user_agent) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([
            $context['type'] ?? 'general',
            $error,
            $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
        ]);
    }
    
    logActivity("Error: $error", 'ERROR');
}

// Initialize configuration
if (APP_ENV === 'production') {
    error_reporting(0);
    ini_set('display_errors', 0);
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

// Set timezone
date_default_timezone_set('UTC');

// Set memory limit for large file processing
ini_set('memory_limit', '512M');
ini_set('max_execution_time', 300); // 5 minutes

// Enable output buffering
ob_start();

// Set session security
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.use_strict_mode', 1);

?> 