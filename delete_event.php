<?php
require 'database.php';

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

require 'session_security_check.php';
require 'csrf_security_check.php';

$event_id = $_POST['event_id'];

if (!isset($_SESSION['user_id'])) {
    echo json_encode(array(
        "success" => false,
        "message" => "User is not logged in"
    ));
    exit;
} else {
  $user_id = $_SESSION['user_id'];
}

$stmt = $mysqli->prepare("DELETE FROM events WHERE event_id=? AND created_by=?");

if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$stmt->bind_param('ss', $event_id, $user_id);

$stmt->execute();

$stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => "Events deleted successfully"
));

?>
