<?php
session_start();
header('Content-Type: application/json');
if(isset($_SESSION['admin_loggedin']) && $_SESSION['admin_loggedin']) {
    echo json_encode(['admin_loggedin'=>true, 'admin'=>$_SESSION['admin']]);
} else {
    echo json_encode(['admin_loggedin'=>false]);
}
?>
