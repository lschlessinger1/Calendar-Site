<?php
require 'database.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

require 'session_security_check.php';
require 'csrf_security_check.php';

$name       = $_POST['name'];

if (!isset($_SESSION['user_id'])) {
    echo json_encode(array(
        "success" => false,
        "message" => "User is not logged in"
    ));
    exit;
}

// Check to see if the name is valid
if (empty($name)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Name cannot be empty"
    ));
    exit;
}

$create_cal_stmt = $mysqli->prepare("INSERT INTO calendars (created_by, name) VALUES (?, ?)");
if (!$create_cal_stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}
$create_cal_stmt->bind_param('ss', $_SESSION['user_id'], $name);
$create_cal_stmt->execute();
$create_cal_stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => "Event created",
    "name" => htmlspecialchars($name),
));

?>
