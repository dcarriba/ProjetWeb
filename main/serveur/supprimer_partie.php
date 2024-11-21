<?php

$jsonData = file_get_contents('php://input'); // on recoit le json du client
$data = json_decode($jsonData, true); // on decode le json dans un array Php associatif
if ($data !== null) { // si le decoding à bien marché
    $idPartie = $data['idPartie'];

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "test";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "DELETE FROM deroulement WHERE id_partie = $idPartie";

    if ($conn->query($sql) === TRUE) {
        $response = "true";
    } else {
        $response = "false" . $conn->error;
        $conn->close();
        echo $response;
    }

    $sql2 = "DELETE FROM partie WHERE id_partie = $idPartie";

    if ($conn->query($sql2) === TRUE) {
        $response = "true";
    } else {
        $response = "false" . $conn->error;
        $conn->close();
        echo $response;
    }
    $conn->close();
    echo $response;
} else {
    http_response_code(400); // Bad Request
    echo "Invalid JSON data";
}
