<?php
// Content of database.php
$db_host     = 'localhost';
$db_username = '[INSERT_USERNAME]';
$db_password = '[INSERT_PASSWORD]';
$db_name     = '[INSERT_DB_NAME]';
$mysqli      = new mysqli($db_host, $db_username, $db_password, $db_name);

if ($mysqli->connect_errno) {
    printf("Connection Failed: %s\n", $mysqli->connect_error);
    exit;
}
?>
