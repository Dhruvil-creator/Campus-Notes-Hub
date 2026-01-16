<?php
session_start();
include 'db.php';
header('Content-Type: application/json');

if(!isset($_SESSION['user_loggedin']) || !$_SESSION['user_loggedin']) {
    echo json_encode(['error' => 'Login required to upload notes']);
    exit;
}

$allowed_types = ['pdf', 'doc', 'docx', 'ppt', 'pptx'];
$max_size = 5 * 1024 * 1024; // 5MB

if (
    isset($_FILES['file']) && 
    isset($_POST['title']) && 
    isset($_POST['subject']) &&
    isset($_POST['branch'])    // added branch in check
) {
    $ext = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
    $size = $_FILES['file']['size'];
    if (!in_array($ext, $allowed_types)) {
        echo json_encode(['error' => 'Invalid file type. Allowed: PDF, DOC, DOCX, PPT, PPTX.']);
        exit;
    }
    if ($size > $max_size) {
        echo json_encode(['error' => 'File too large (max 5MB).']);
        exit;
    }
    if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['error' => 'File upload error code: ' . $_FILES['file']['error']]);
        exit;
    }
    $title = trim($_POST['title']);
    $subject = trim($_POST['subject']);
    $branch = isset($_POST['branch']) ? strtoupper(trim($_POST['branch'])) : 'GENERAL'; // Convert branch to uppercase
    $description = isset($_POST['description']) ? trim($_POST['description']) : '';
    
    if (empty($title) || empty($subject) || empty($branch)) {
        echo json_encode(['error' => 'Title, subject, and branch cannot be empty.']);
        exit;
    }
    
    $filename = uniqid('note_', true) . '_' . basename($_FILES['file']['name']);
    $dest = '../uploads/' . $filename;
    $uploader = $_SESSION['user'];
    if (!is_dir('../uploads/')) {
        if (!mkdir('../uploads/', 0777, true)) {
            echo json_encode(['error' => 'Failed to create uploads directory']);
            exit;
        }
    }
    if (move_uploaded_file($_FILES['file']['tmp_name'], $dest)) {
        $stmt = $conn->prepare("INSERT INTO notes(title, subject, description, filename, uploaded_by, branch) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $title, $subject, $description, $filename, $uploader, $branch);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'File uploaded successfully']);
        } else {
            if (file_exists($dest)) { unlink($dest); }
            echo json_encode(['error' => 'Database error: ' . $stmt->error]);
        }
    } else {
        echo json_encode(['error' => 'Failed to move uploaded file']);
    }
} else {
    echo json_encode(['error' => 'Missing required fields. Need: file, title, subject, branch']);
}
?>
