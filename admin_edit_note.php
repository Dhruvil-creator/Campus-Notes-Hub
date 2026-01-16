<?php
include 'db.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(['error' => 'Missing note ID']);
    exit;
}

$id = intval($data['id']);
$title = isset($data['title']) ? trim($data['title']) : '';
$subject = isset($data['subject']) ? trim($data['subject']) : '';
$description = isset($data['description']) ? trim($data['description']) : '';
$branch = isset($data['branch']) ? strtoupper(trim($data['branch'])) : 'GENERAL';  // Normalize to uppercase

$stmt = $conn->prepare("UPDATE notes SET title=?, subject=?, description=?, branch=? WHERE id=?");
$stmt->bind_param("ssssi", $title, $subject, $description, $branch, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Failed to update note']);
}
?>
