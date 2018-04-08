<?php
// Content of database.php
$db_host     = 'localhost';
$db_username = 'wustl_inst';
$db_password = 'wustl_pass';
$db_name     = 'calendar_website';
$mysqli      = new mysqli($db_host, $db_username, $db_password, $db_name);

if ($mysqli->connect_errno) {
    printf("Connection Failed: %s\n", $mysqli->connect_error);
    exit;
}
?>
