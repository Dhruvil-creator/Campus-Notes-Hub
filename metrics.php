<?php
include 'db.php';
header('Content-Type: application/json');

$out = [];
// Uploads in last 30 days
$r = $conn->query("SELECT COUNT(*) FROM notes WHERE uploaded_at >= NOW() - INTERVAL 30 DAY");
$out['uploads'] = $r->fetch_row()[0];
// Total downloads
$r = $conn->query("SELECT SUM(downloads) FROM notes");
$out['downloads'] = (int)$r->fetch_row()[0];
// Active subjects
$r = $conn->query("SELECT COUNT(DISTINCT subject) FROM notes");
$out['subjects'] = $r->fetch_row()[0];

echo json_encode($out);
?>
