<?php
session_start();
header('Content-Type: application/json');
if(isset($_SESSION['user_loggedin']) && $_SESSION['user_loggedin']){
    echo json_encode(['user_loggedin'=>true, 'username'=>$_SESSION['user']]);
} else {
    echo json_encode(['user_loggedin'=>false]);
}
?>
