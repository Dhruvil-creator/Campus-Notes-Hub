<?php
include 'db.php';
header('Content-Type: application/json');
session_start();
$data = json_decode(file_get_contents("php://input"), true);
if(isset($data['id']) && isset($_SESSION['user'])){
    $id = intval($data['id']);
    // Only allow owners to delete their own notes
    $stmt = $conn->prepare("SELECT filename, uploaded_by FROM notes WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $res = $stmt->get_result();
    if($row = $res->fetch_assoc()){
        if($row['uploaded_by'] === $_SESSION['user']) {
            // delete file
            $file = '../uploads/' . $row['filename'];
            if(file_exists($file)) unlink($file);
            $conn->query("DELETE FROM notes WHERE id=$id");
            echo json_encode(['success'=>true]);
        } else {
            echo json_encode(['error'=>'Permission denied.']);
        }
    } else {
        echo json_encode(['error'=>'Note not found']);
    }
} else {
    echo json_encode(['error'=>'No ID or not logged in.']);
}
if(isset($data['id'])) {
    $id = intval($data['id']);
    session_start();
    $isAdmin = isset($_SESSION['admin_loggedin']) && $_SESSION['admin_loggedin'];

    $stmt = $conn->prepare("SELECT filename, uploaded_by FROM notes WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $res = $stmt->get_result();
    if($row = $res->fetch_assoc()){
        // Allow if admin or owner matches
        if($isAdmin || ($row['uploaded_by'] === $_SESSION['user'])) {
            $file = '../uploads/' . $row['filename'];
            if(file_exists($file)) unlink($file);
            $conn->query("DELETE FROM notes WHERE id=$id");
            echo json_encode(['success'=>true]);
        } else {
            echo json_encode(['error'=>'Permission denied.']);
        }
    } else {
        echo json_encode(['error'=>'Note not found']);
    }
} else {
    echo json_encode(['error'=>'No ID or not logged in.']);
}

?>
