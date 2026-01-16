<?php
session_start();
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
if(isset($data['username']) && isset($data['password'])){
    $username = trim($data['username']);
    $password = trim($data['password']);
    if(strlen($username) < 3 || strlen($password) < 3){
        echo json_encode(['error' => 'Username and password must be at least 3 characters.']);
        exit;
    }
    $stmt = $conn->prepare("SELECT id FROM users WHERE username=?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $res = $stmt->get_result();
    if($res->num_rows > 0){
        echo json_encode(['error'=>'Username already taken.']);
    }else{
        $stmt = $conn->prepare("INSERT INTO users(username, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $username, $password);
        if($stmt->execute()){
            echo json_encode(['success'=>'Registration successful! Please login.']);
        }else{
            echo json_encode(['error'=>'Registration failed.']);
        }
    }
}else{
    echo json_encode(['error'=>'Missing fields.']);
}
?>
