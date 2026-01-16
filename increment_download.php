<?php
include 'db.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);
if(isset($data['id'])){
    $id = intval($data['id']);
    $conn->query("UPDATE notes SET downloads = downloads + 1 WHERE id=$id");
    echo json_encode(['success'=>true]);
} else {
    echo json_encode(['error'=>'No ID provided']);
}
?>
