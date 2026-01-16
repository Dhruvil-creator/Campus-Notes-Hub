<?php
include 'db.php';
header('Content-Type: application/json');
$res = $conn->query("SELECT id, username FROM users ORDER BY id DESC");
$out = [];
while($row = $res->fetch_assoc()){
    $out[] = $row;
}
echo json_encode($out);
?>
