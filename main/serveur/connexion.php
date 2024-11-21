<?php
require "user.inc";

session_start();

$jsonData = file_get_contents('php://input'); // on recoit le json du client
$data = json_decode($jsonData, true); // on decode le json dans un array Php associatif
if ($data !== null) { // si le decoding à bien marché
    $login = $data['login'];
    $mdp = $data['mdp'];
    $response = array();
    if ($login && $mdp) {
        if (exist($login)){
            if (loginOK($login,$mdp)){
                $_SESSION['logged_in'] = true;
                $_SESSION['username'] = $login;
                $response["logged_in"] = true;
                $response["message"] = "Connexion réussi !";
            } else {
                $response["message"] = "Mot de passe invalide";
            }
        } else {
            $response["message"] = "Ce nom d'utilisateur n'existe pas";
        }
    } else {
        $response["message"] = "Erreur, Formulaire Loginnvide";
    }
    echo json_encode($response);
} else {
    http_response_code(400); // Bad Request
    echo "Invalid JSON data";
}
