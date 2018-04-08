<?php
require 'database.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

require 'session_security_check.php';
require 'csrf_security_check.php';
require 'colors.php';

$calendar_id       = $_POST['calendar'];
$title       = $_POST['title'];
$date        = $_POST['date'];
$start_time  = $_POST['start_time'];
$finish_time = $_POST['finish_time'];
$color = $_POST['color'];

if (!isset($_SESSION['user_id'])) {
    echo json_encode(array(
        "success" => false,
        "message" => "User is not logged in"
    ));
    exit;
}

// Check to see if the title, date, start_time, and finish_time are valid.
if (empty($title)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Title cannot be empty"
    ));
    exit;
}

if (empty($date)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Date cannot be empty"
    ));
    exit;
}

if (empty($start_time)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Start time cannot be empty"
    ));
    exit;
}

if (empty($finish_time)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Finish time cannot be empty"
    ));
    exit;
}

if (empty($color)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Color cannot be empty"
    ));
    exit;
}

if (empty($calendar_id)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Calendar cannot be empty"
    ));
    exit;
}

if (!array_key_exists($color, $EVENT_COLORS_HEX_CODES)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Please choose a color from the list"
    ));
    exit;
} else {
    $color = $EVENT_COLORS_HEX_CODES[$color];
}


// make sure that times are valid and that start time is before finish time
$format = 'Y-m-d H:i';

$start_time_str  = $date . ' ' . $start_time;
$finish_time_str = $date . ' ' . $finish_time;

$date_tz = new DateTimeZone('America/Chicago');

$start_date_time  = DateTime::createFromFormat($format, $start_time_str, $date_tz);
$finish_date_time = DateTime::createFromFormat($format, $finish_time_str, $date_tz);

if ($start_date_time === false) {
    echo json_encode(array(
        "success" => false,
        "message" => "Start time is invalid"
    ));
    exit;
}

if ($finish_date_time === false) {
    echo json_encode(array(
        "success" => false,
        "message" => "Finish time is invalid"
    ));
    exit;
}

if ($start_date_time > $finish_date_time) {
    echo json_encode(array(
        "success" => false,
        "message" => "Start time must be before finish time"
    ));
    exit;
}

$stmt = $mysqli->prepare("INSERT INTO events (created_by, title, date, start_time, finish_time, color, calendar_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$start_date_time_str  = $start_date_time->format($format);
$finish_date_time_str = $finish_date_time->format($format);

$stmt->bind_param('sssssss', $_SESSION['user_id'], $title, $date, $start_date_time_str, $finish_date_time_str, $color, $calendar_id);

$stmt->execute();

$stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => "Event created",
    "title" => htmlspecialchars($title),
    "date" => htmlspecialchars($date),
    "start_time" => htmlspecialchars($start_time),
    "finish_time" => htmlspecialchars($finish_time),
    "color" => htmlspecialchars($color),
    "calendar_id" => htmlspecialchars($calendar_id)
));

?>
