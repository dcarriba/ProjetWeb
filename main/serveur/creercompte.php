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
        if (!exist($login)){
            $handle = fopen('users.csv', 'a');
            $data = array($login,$mdp,0);
            $line = implode(';', $data);
            fwrite($handle, $line . PHP_EOL);
            fclose($handle);
            if (loginOK($login,$mdp)){
                $_SESSION['logged_in'] = true;
                $_SESSION['username'] = $login;
                $response["logged_in"] = true;
                $response["message"] = "Connexion réussi !";
            } else {
                $response["message"] = "Erreur";
            }
            // $response["message"] = "Votre compte a bien été créer. Veuillez vous connecter.";
        } else {
            $response["message"] = "Le nom d'utilisateur existe déjà";
        }
    } else {
        $response["message"] = "Erreur, Formulaire Loginnvide";
    }
    echo json_encode($response);
} else {
    http_response_code(400); // Bad Request
    echo "Invalid JSON data";
}
