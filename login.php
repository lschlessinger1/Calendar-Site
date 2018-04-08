<?php
// This is a *good* example of how you can implement password-based user authentication in your web application.
require 'database.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
require 'session_security_check.php';

// Use a prepared statement
$query = "SELECT COUNT(*), id, crypted_password FROM users WHERE username=?";
$stmt  = $mysqli->prepare($query);

// Bind the parameter
$stmt->bind_param('s', $user);
$user = $_POST['username'];
$stmt->execute();

// Bind the results
$stmt->bind_result($cnt, $user_id, $pwd_hash);
$stmt->fetch();

$pwd_guess = $_POST['password'];
// Compare the submitted password to the actual password hash
if ($cnt == 1 && password_verify($pwd_guess, $pwd_hash)) {
    // Login succeeded!
    $_SESSION['user_id']  = $user_id;
    $_SESSION['username'] = $user;
    $_SESSION['token']    = bin2hex(openssl_random_pseudo_bytes(32)); // generate a 32-byte random string

    echo json_encode(array(
        "success" => true,
        "message" => "User logged in successfully",
        "user_id" => $_SESSION['user_id'],
        "username" => htmlspecialchars($_SESSION['username']),
        "token" => $_SESSION['token']
    ));
    exit;

} else {
    // Login failed
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid username/password combination"
    ), JSON_UNESCAPED_SLASHES);
    exit;
}
?>
