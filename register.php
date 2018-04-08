<?php
require 'database.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
require 'session_security_check.php';

$username = $_POST['username'];
$password = $_POST['password'];

// Check to see if the username and password are valid.
if (empty($username)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Username cannot be empty"
    ));
    exit;
}

if (empty($password)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Password cannot be empty"
    ));
    exit;
}

if (!preg_match('/^[\w_\-]+$/', $username)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid username"
    ));
    exit;
}

if (strlen($password) < 5) {
    echo json_encode(array(
        "success" => false,
        "message" => "Password must have at least 5 characters"
    ));
    exit;
}

// check if another user has already registered this username
$safe_username = $mysqli->real_escape_string($username);

$res = $mysqli->query("SELECT id FROM users WHERE username='" . $safe_username . "'");

if ($res->num_rows > 0) {
    // username taken
    echo json_encode(array(
        "success" => false,
        "message" => "Username has been taken"
    ));
    exit;
}

$stmt = $mysqli->prepare("INSERT INTO users (username, crypted_password) VALUES (?, ?)");
if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$crypted_password = password_hash($password, PASSWORD_DEFAULT);
$stmt->bind_param('ss', $username, $crypted_password);

$stmt->execute();

$_SESSION['user_id']  = $mysqli->insert_id;
$_SESSION['username'] = $username;
$_SESSION['token']    = bin2hex(openssl_random_pseudo_bytes(32)); // generate a 32-byte random string

$stmt->close();

// BEGIN create default calendar
$create_cal_stmt = $mysqli->prepare("INSERT INTO calendars (created_by, name) VALUES (?, ?)");
if (!$create_cal_stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}
$create_cal_stmt->bind_param('ss', $_SESSION['user_id'], $username);
$create_cal_stmt->execute();
$create_cal_stmt->close();
// END create default calendar

echo json_encode(array(
    "success" => true,
    "message" => "User registered successfully",
    "user_id" => $_SESSION['user_id'],
    "username" => htmlspecialchars($_SESSION['username']),
    "token" => $_SESSION['token']
));
?>
