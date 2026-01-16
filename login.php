<?php
session_start();
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
if(isset($data['username'], $data['password'])){
    $stmt = $conn->prepare("SELECT * FROM admins WHERE username=? AND password=?");
    $stmt->bind_param("ss", $data['username'], $data['password']);
    $stmt->execute();
    $res = $stmt->get_result();
    if($res->num_rows > 0){
        $_SESSION['admin_loggedin'] = true;   // Use this for session checks!
        $_SESSION['admin'] = $data['username'];
        echo json_encode(['success'=>true]);
    } else {
        echo json_encode(['error'=>'Invalid credentials']);
    }
}
?>
