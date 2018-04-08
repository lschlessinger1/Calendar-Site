<?php
// Session Hijacking Protection
// Assume Content-Type: application/json
ini_set("session.cookie_httponly", 1);
session_start();

// User Agent Consistency Protection
$previous_ua = @$_SESSION['useragent'];
$current_ua  = $_SERVER['HTTP_USER_AGENT'];

if (isset($_SESSION['useragent']) && $previous_ua !== $current_ua) {
    die(json_encode(array(
        "success" => false,
        "message" => "Session hijack detected"
    )));
} else {
    $_SESSION['useragent'] = $current_ua;
}

// Session Fixation Protection
session_name('cse-330-calendar-session');
?>
