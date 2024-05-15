<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "calendar_app";


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

$action = $_POST['action'];

if ($action == 'add') {
    $date = $_POST['date'];
    $title = $_POST['title'];
    $description = $_POST['description'];
    $time = $_POST['time'];
    $sql = "INSERT INTO events (date, title, description, time) VALUES ('$date', '$title', '$description', '$time')";
    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
} elseif ($action == 'get') {
    $date = $_POST['date'];
    $sql = "SELECT * FROM events WHERE date = '$date'";
    $result = $conn->query($sql);
    $events = [];
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
    echo json_encode($events);
} elseif ($action == 'update') {
    $id = $_POST['id'];
    $date = $_POST['date'];
    $title = $_POST['title'];
    $description = $_POST['description'];
    $time = $_POST['time'];
    $sql = "UPDATE events SET date='$date', title='$title', description='$description', time='$time' WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo "Record updated successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
} elseif ($action == 'delete') {
    $id = $_POST['id'];
    $sql = "DELETE FROM events WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo "Record deleted successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
} elseif ($action == 'list') {
    $year = $_POST['year'];
    $month = $_POST['month'];
    $sql = "SELECT * FROM events WHERE YEAR(date) = $year AND MONTH(date) = $month";
    $result = $conn->query($sql);
    $events = [];
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
    echo json_encode($events);
}

$conn->close();
?>
