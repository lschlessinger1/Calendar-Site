<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

require 'session_security_check.php';
require 'csrf_security_check.php';

session_destroy();

echo json_encode(array(
    "success" => true
));

exit;
?>
