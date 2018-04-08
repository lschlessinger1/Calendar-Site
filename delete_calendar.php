<?php
require 'database.php';

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

require 'session_security_check.php';
require 'csrf_security_check.php';

$calendar_id = $_POST['calendar_id'];

if (!isset($_SESSION['user_id'])) {
    echo json_encode(array(
        "success" => false,
        "message" => "User is not logged in"
    ));
    exit;
} else {
    $user_id = $_SESSION['user_id'];
}

// first delete all events associated with the calendar
$delete_events_stmt = $mysqli->prepare("DELETE FROM events WHERE calendar_id=? AND created_by=?");

if (!$delete_events_stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$delete_events_stmt->bind_param('ss', $calendar_id, $user_id);

$delete_events_stmt->execute();

$delete_events_stmt->close();

// now, delete the calendar
$delete_calendar_stmt = $mysqli->prepare("DELETE FROM calendars WHERE id=? AND created_by=?");

if (!$delete_calendar_stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$delete_calendar_stmt->bind_param('ss', $calendar_id, $user_id);

$delete_calendar_stmt->execute();

$delete_calendar_stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => "Calendar deleted successfully"
));

?>
