<?php
// Cross-Site Request Forgery Protection
// Assume Content-Type: application/json
//In PHP < 5.6, use the insecure: if($_SESSION['token'] !== $_POST['token'])

if (!hash_equals($_SESSION['token'], $_POST['token'])) {
    print(json_encode(array(
        "success" => false,
        "message" => "Cross-site request forgery detected"
    )));
    exit;
}
?>
