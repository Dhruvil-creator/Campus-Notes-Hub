<?php
include 'db.php';  // adjust path if needed
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
    $id = intval($data['id']);
    // Increment like count for this note
    $updateNote = $conn->query("UPDATE notes SET likes = likes + 1 WHERE id = $id");

    // Find uploader and increment contributor's total_likes
    $result = $conn->query("SELECT uploaded_by FROM notes WHERE id = $id");
    if ($row = $result->fetch_assoc()) {
        $uploader = $conn->real_escape_string($row['uploaded_by']);
        $conn->query("UPDATE contributors SET total_likes = total_likes + 1 WHERE username = '$uploader'");
    }

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'No note ID provided']);
}
?>
