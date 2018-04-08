<?php
require 'database.php';

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

require 'session_security_check.php';
require 'colors.php';

if (isset($_SESSION['token']) && isset($_SESSION['username']) && isset($_SESSION['user_id'])) {
    require 'csrf_security_check.php';
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "User is not logged in"
    ));
    exit;
}

$query = "SELECT events.event_id, events.created_by, events.title, events.date, events.start_time, events.finish_time,
events.color, events.calendar_id, calendars.name
                FROM events
                LEFT JOIN calendars ON events.calendar_id=calendars.id
                WHERE events.created_by=?";
$stmt = $mysqli->prepare($query);
if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$stmt->bind_param('s', $_SESSION['user_id']);

$stmt->execute();

$result = $stmt->get_result();

$data                     = array();
$data["event_id_list"]    = array();
$data["created_by_list"]  = array();
$data["title_list"]       = array();
$data["date_list"]        = array();
$data["start_time_list"]  = array();
$data["finish_time_list"] = array();
$data["color_list"]        = array();
$data["calendar_id_list"]        = array();
$data["calendar_name_list"]        = array();

while ($row = $result->fetch_assoc()) {
    array_push($data["event_id_list"], htmlspecialchars($row['event_id']));
    array_push($data["created_by_list"], htmlspecialchars($row['created_by']));
    array_push($data["title_list"], htmlspecialchars($row['title']));
    array_push($data["date_list"], htmlspecialchars($row['date']));
    array_push($data["start_time_list"], htmlspecialchars($row['start_time']));
    array_push($data["finish_time_list"], htmlspecialchars($row['finish_time']));
    array_push($data["color_list"], htmlspecialchars($row['color']));
    array_push($data["calendar_id_list"], htmlspecialchars($row['calendar_id']));
    array_push($data["calendar_name_list"], htmlspecialchars($row['name']));
}

$stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => "Events fetched successfully",
    "results" => $data
));

?>
