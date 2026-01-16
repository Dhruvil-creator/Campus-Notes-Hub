<?php
include 'db.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data['id']) || !isset($data['username'])){
    echo json_encode(['error'=>'Missing fields']);
    exit;
}
$id = intval($data['id']);
$username = trim($data['username']);

$stmt = $conn->prepare("UPDATE users SET username=? WHERE id=?");
$stmt->bind_param("si", $username, $id);
$stmt->execute();
echo json_encode(['success'=>true]);
?>
