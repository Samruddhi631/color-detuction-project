<?php

$hostName = "localhost";
$dbUser = "root";
$dbpassword = "";
$dbName = "colordetection";

// create connection
$conn = mysqli_connect($hostName, $dbUser, $dbpassword, $dbName);
if(!$conn){
    echo "cccc";
    exit();

}
?>
