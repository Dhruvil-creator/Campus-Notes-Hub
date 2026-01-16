<?php
session_start();
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
if(isset($data['username']) && isset($data['password'])){
    $stmt = $conn->prepare("SELECT * FROM users WHERE username=? AND password=?");
    $stmt->bind_param("ss", $data['username'], $data['password']);
    $stmt->execute();
    $res = $stmt->get_result();
    if($res->num_rows > 0){
        $_SESSION['user_loggedin'] = true;
        $_SESSION['user'] = $data['username'];
        unset($_SESSION['admin']);
        echo json_encode(['success'=>true]);
    } else {
        echo json_encode(['error'=>'Invalid credentials']);
    }
} else {
    echo json_encode(['error'=>'Missing fields']);
}
?>
