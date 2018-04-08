<?php
require 'database.php';

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

require 'session_security_check.php';

if (isset($_SESSION['token']) && isset($_SESSION['username']) && isset($_SESSION['user_id'])) {
    require 'csrf_security_check.php';
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "User is not logged in"
    ));
    exit;
}

$query = "SELECT * FROM calendars WHERE created_by=?";

$stmt = $mysqli->prepare($query);
if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$stmt->bind_param('s', $_SESSION['user_id']);

$stmt->execute();

$result = $stmt->get_result();

$data                     = array();
$data["id_list"]    = array();
$data["created_by_list"]  = array();
$data["name_list"]  = array();

while ($row = $result->fetch_assoc()) {
    array_push($data["id_list"], htmlspecialchars($row['id']));
    array_push($data["created_by_list"], htmlspecialchars($row['created_by']));
    array_push($data["name_list"], htmlspecialchars($row['name']));
}

$stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => "Calendars fetched successfully",
    "results" => $data
));

?>
