<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

require 'session_security_check.php';

if (isset($_SESSION['token']) && isset($_SESSION['username']) && isset($_SESSION['user_id'])) {

    echo json_encode(array(
        "success" => true,
        "message" => "User is logged in",
        "user_id" => $_SESSION['user_id'],
        "username" => $_SESSION['username'],
        "token" => $_SESSION['token']
    ));
    exit;
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "User is not logged in"
    ));
    exit;
}

?>
