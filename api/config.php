<?php
// Prevent PHP warnings from corrupting JSON output
error_reporting(E_ALL);
ini_set('display_errors', '0');

// Comprehensive CORS headers for React frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load local .env file if available (never committed to git)
$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($key, $val) = explode('=', $line, 2);
            $key = trim($key);
            $val = trim($val);
            if (!getenv($key)) {
                putenv("$key=$val");
                $_ENV[$key] = $val;
            }
        }
    }
}

// Database Credentials (Masked for public repository; read securely from environment variables)
$db_user = getenv('DB_USER') ?: 'u833088220_Sunrise';
$db_pass = getenv('DB_PASS') ?: 'YOUR_DATABASE_PASSWORD';
$db_name = getenv('DB_NAME') ?: 'u833088220_sunrise';

// Try localhost first (when deployed on Hostinger), fallback to remote IP 193.203.185.110
$pdo = null;
$hosts = ['localhost', '127.0.0.1', '193.203.185.110'];

foreach ($hosts as $h) {
    try {
        $pdo = new PDO("mysql:host=$h;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 2
        ]);
        break;
    } catch (Exception $e) {
        // try next host
    }
}

if (!$pdo) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed. Please check Hostinger MySQL credentials.'
    ]);
    exit();
}

function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

function getJsonInput() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?: [];
}
