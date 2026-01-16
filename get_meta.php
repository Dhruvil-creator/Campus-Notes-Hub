<?php
include 'db.php';
header('Content-Type: application/json');

$subjects_result = $conn->query("SELECT DISTINCT subject FROM notes ORDER BY subject ASC");
$branches_result = $conn->query("SELECT DISTINCT branch FROM notes ORDER BY branch ASC");

$subjects = [];
$branches = [];

if ($subjects_result) {
    while ($row = $subjects_result->fetch_assoc()) {
        $subjects[] = $row['subject'];
    }
}
if ($branches_result) {
    while ($row = $branches_result->fetch_assoc()) {
        $branches[] = $row['branch'];
    }
}

echo json_encode([
    'subjects' => $subjects,
    'branches' => $branches
]);
?>
