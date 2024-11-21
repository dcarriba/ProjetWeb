<?php
session_start();

$jsonData = file_get_contents('php://input'); // on recoit le json du client
$data = json_decode($jsonData, true); // on decode le json dans un array Php associatif
if ($data !== null) { // si le decoding à bien marché
    $nom = $data['nom'];
    $response = array();
    $response['description'] = "";
    $file = file("cases.csv");
    foreach ($file as $line){
        $line = explode(";",$line);
        if ($line[0] == $nom) {
            $response['description'] = $line[1];
            break;
        }
    }
    echo json_encode($response);
} else {
    http_response_code(400); // Bad Request
    echo "Invalid JSON data";
}
