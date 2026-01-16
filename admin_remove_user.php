<?php
include 'db.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);
if(isset($data['id'])){
    $id = intval($data['id']);
    $stmt = $conn->prepare("SELECT username FROM users WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $res = $stmt->get_result();
    if($row = $res->fetch_assoc()){
        $user = $row['username'];
        $stmt2 = $conn->prepare("DELETE FROM notes WHERE uploaded_by=?");
        $stmt2->bind_param("s", $user);
        $stmt2->execute();
        $conn->query("DELETE FROM users WHERE id=$id");
        echo json_encode(['success'=>true]);
    } else {
        echo json_encode(['error'=>'User not found']);
    }
} else {
    echo json_encode(['error'=>'No ID provided']);
}
?>
