<?php
require_once __DIR__ . '/config.php';

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Auto-create media_items table in MySQL if not exists
try {
    if (isset($pdo)) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS media_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            url VARCHAR(500) NOT NULL,
            filename VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            alt VARCHAR(255) DEFAULT '',
            caption TEXT NULL,
            size_bytes INT DEFAULT 0,
            folder VARCHAR(100) DEFAULT 'General',
            format VARCHAR(50) DEFAULT 'WEBP',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    }
} catch (Exception $e) {
    // continue
}

// GET: Retrieve all media items from database
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        if (isset($pdo)) {
            $stmt = $pdo->query("SELECT * FROM media_items ORDER BY id DESC");
            $items = $stmt->fetchAll();
            jsonResponse($items ?: []);
        }
    } catch (Exception $e) {
        // continue
    }
    jsonResponse([]);
}

// DELETE: Remove media item
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id && isset($pdo)) {
        try {
            $stmt = $pdo->prepare("DELETE FROM media_items WHERE id = ?");
            $stmt->execute([$id]);
        } catch (Exception $e) {}
    }
    jsonResponse(['status' => 'success', 'message' => 'Media item deleted']);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['status' => 'error', 'message' => 'POST method required for uploads'], 405);
}

$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0777, true);
}
@chmod($uploadDir, 0777);

$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'pdf', 'mp4', 'ico', 'avif'];
$maxSize = 25 * 1024 * 1024; // 25MB

// 1. Check if multipart file was sent (under 'file', 'image', 'thumbnail', etc.)
$fileKey = null;
foreach (['file', 'image', 'thumbnail', 'photo', 'upload', 'media'] as $k) {
    if (isset($_FILES[$k]) && is_array($_FILES[$k]) && isset($_FILES[$k]['error'])) {
        $fileKey = $k;
        break;
    }
}

if ($fileKey && $_FILES[$fileKey]['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES[$fileKey];

    if ($file['size'] > $maxSize) {
        jsonResponse(['status' => 'error', 'message' => 'File size exceeds 25MB limit'], 400);
    }

    $origName = $file['name'] ?? 'upload.jpg';
    $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
    if (!$ext || !in_array($ext, $allowedExtensions)) {
        $ext = 'jpg';
    }

    $uniqueName = 'sunraise_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $targetPath = $uploadDir . $uniqueName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        @chmod($targetPath, 0644);

        $host = $_SERVER['HTTP_HOST'] ?? 'testers.acheva.in';
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
        if (strpos($host, 'testers.acheva.in') !== false) {
            $protocol = "https://";
        }
        $fileUrl = $protocol . $host . '/api/uploads/' . $uniqueName;
        $title = pathinfo($origName, PATHINFO_FILENAME);
        $folder = $_POST['folder'] ?? 'Uploads';

        // Insert into database
        if (isset($pdo)) {
            try {
                $stmt = $pdo->prepare("INSERT INTO media_items (url, filename, title, alt, size_bytes, folder, format) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $fileUrl,
                    $uniqueName,
                    $title,
                    $title,
                    $file['size'],
                    $folder,
                    strtoupper($ext)
                ]);
            } catch (Exception $e) {}
        }

        jsonResponse([
            'status' => 'success',
            'message' => 'File uploaded successfully',
            'url' => $fileUrl,
            'filename' => $uniqueName,
            'size' => $file['size'],
            'title' => $title
        ], 201);
    } else {
        jsonResponse(['status' => 'error', 'message' => 'Failed to save uploaded file to destination'], 500);
    }
}

// 2. Check if Base64 JSON payload was sent
$input = getJsonInput();
$base64Data = $input['image'] ?? $input['base64'] ?? $input['file'] ?? null;
if ($base64Data) {
    $ext = 'png';
    if (preg_match('/^data:image\/(\w+);base64,/', $base64Data, $type)) {
        $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
        $ext = strtolower($type[1]);
        if ($ext === 'jpeg') $ext = 'jpg';
    }
    $base64Data = str_replace(' ', '+', $base64Data);
    $decodedData = base64_decode($base64Data);

    if ($decodedData === false) {
        jsonResponse(['status' => 'error', 'message' => 'Invalid base64 encoding'], 400);
    }

    $uniqueName = 'sunraise_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $targetPath = $uploadDir . $uniqueName;

    if (file_put_contents($targetPath, $decodedData)) {
        @chmod($targetPath, 0644);

        $host = $_SERVER['HTTP_HOST'] ?? 'testers.acheva.in';
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
        if (strpos($host, 'testers.acheva.in') !== false) {
            $protocol = "https://";
        }
        $fileUrl = $protocol . $host . '/api/uploads/' . $uniqueName;
        $title = $input['title'] ?? 'Uploaded Media';
        $folder = $input['folder'] ?? 'Uploads';

        // Insert into database
        if (isset($pdo)) {
            try {
                $stmt = $pdo->prepare("INSERT INTO media_items (url, filename, title, alt, size_bytes, folder, format) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $fileUrl,
                    $uniqueName,
                    $title,
                    $title,
                    strlen($decodedData),
                    $folder,
                    strtoupper($ext)
                ]);
            } catch (Exception $e) {}
        }

        jsonResponse([
            'status' => 'success',
            'message' => 'Base64 image saved successfully',
            'url' => $fileUrl,
            'filename' => $uniqueName,
            'size' => strlen($decodedData)
        ], 201);
    } else {
        jsonResponse(['status' => 'error', 'message' => 'Failed to write base64 file to disk'], 500);
    }
}

// If reached here, no valid file or base64 was found
$errCode = isset($_FILES['file']['error']) ? $_FILES['file']['error'] : 'no_file';
jsonResponse(['status' => 'error', 'message' => 'No file received or upload error occurred. Error code: ' . $errCode], 400);
