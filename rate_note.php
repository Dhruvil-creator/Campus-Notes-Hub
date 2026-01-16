<?php
include 'db.php';  // adjust path if needed
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id']) && isset($data['rating'])) {
    $id = intval($data['id']);
    $rating = floatval($data['rating']);

    // You can implement average rating or just replace (simple version here)
    $conn->query("UPDATE notes SET rating = $rating WHERE id = $id");

    // Update contributor aggregated rating if you want (optional)
    $result = $conn->query("SELECT uploaded_by FROM notes WHERE id = $id");
    if ($row = $result->fetch_assoc()) {
        $uploader = $conn->real_escape_string($row['uploaded_by']);
        // Example: keep latest rating, or sum up, or get average in a view
        $conn->query("UPDATE contributors SET total_ratings = total_ratings + $rating WHERE username = '$uploader'");
        // You might also track number of ratings in the contributors table if desired
    }

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Missing note ID or rating value']);
}
?>
