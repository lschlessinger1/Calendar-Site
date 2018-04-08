<?php
require 'database.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
require 'session_security_check.php';
require 'csrf_security_check.php';

$calendar_id    = $_POST['calendar_id'];
$name       = $_POST['name'];

if (!isset($_SESSION['user_id'])) {
    echo json_encode(array(
        "success" => false,
        "message" => "User is not logged in"
    ));
    exit;
}

// Check to see if the calendar ID and name are valid
if (empty($calendar_id)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Calendar ID cannot be empty"
    ));
    exit;
}

if (empty($name)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Name cannot be empty"
    ));
    exit;
}

$stmt = $mysqli->prepare("UPDATE calendars SET name=? WHERE id=? AND created_by=?");
if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$stmt->bind_param('sss', $name, $calendar_id, $_SESSION['user_id']);

$stmt->execute();

$stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => "Calendar updated",
    "calendar_id" => htmlspecialchars($calendar_id),
    "name" => htmlspecialchars($name)
));

?>
