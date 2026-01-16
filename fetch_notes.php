<?php
// api/fetch_notes.php
include 'db.php';
header('Content-Type: application/json');

$is_special_category = false;
$sql = '';

// Handle special, predefined categories first
if (isset($_GET['category'])) {
    $category = $_GET['category'];
    switch ($category) {
        case 'top_rated':
            $sql = "SELECT * FROM notes ORDER BY rating DESC, likes DESC LIMIT 10";
            $is_special_category = true;
            break;
        case 'most_downloaded':
            $sql = "SELECT * FROM notes ORDER BY downloads DESC LIMIT 10";
            $is_special_category = true;
            break;
        case 'editors_picks':
            $sql = "SELECT * FROM notes WHERE featured_flag=1 ORDER BY uploaded_at DESC LIMIT 10";
            $is_special_category = true;
            break;
        case 'recently_added':
            $sql = "SELECT * FROM notes ORDER BY uploaded_at DESC LIMIT 10";
            $is_special_category = true;
            break;
        case 'popular_subjects':
            $sql = "SELECT subject, COUNT(*) AS count FROM notes GROUP BY subject ORDER BY count DESC LIMIT 10";
            $is_special_category = true;
            break;
        case 'featured_authors':
            $sql = "SELECT uploaded_by, COUNT(*) AS count FROM notes GROUP BY uploaded_by ORDER BY count DESC LIMIT 10";
            $is_special_category = true;
            break;
        case 'announcements':
            $sql = "SELECT * FROM announcements ORDER BY created_at DESC LIMIT 5";
            $is_special_category = true;
            break;
    }
}

// If it wasn't a special category, build a query with combined filters
if (!$is_special_category) {
    $conditions = [];

    // Filter by subject if provided
    if (isset($_GET['subject']) && $_GET['subject'] !== '' && $_GET['subject'] !== 'All Subjects') {
        $subject = $conn->real_escape_string($_GET['subject']);
        $conditions[] = "subject = '$subject'";
    }

    // Filter by branch (using 'category' GET param) if provided
    if (isset($_GET['category']) && $_GET['category'] !== '' && $_GET['category'] !== 'All Branches') {
        $branch = $conn->real_escape_string($_GET['category']);
        $conditions[] = "UPPER(branch) = UPPER('$branch')";
    }
    
    // Filter by uploader if provided
    if (isset($_GET['uploader']) && $_GET['uploader'] !== '') {
        $uploader = $conn->real_escape_string($_GET['uploader']);
        $conditions[] = "uploaded_by = '$uploader'";
    }

    $sql = "SELECT * FROM notes";
    if (count($conditions) > 0) {
        $sql .= " WHERE " . implode(' AND ', $conditions);
    }
    $sql .= " ORDER BY uploaded_at DESC";
}

// Execute the final query
$res = $conn->query($sql);
if (!$res) {
    echo json_encode(['error' => 'Database query failed: ' . $conn->error]);
    http_response_code(500);
    exit;
}

echo json_encode($res->fetch_all(MYSQLI_ASSOC));
?>
