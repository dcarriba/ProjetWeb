<?php
function connection_to_database() {

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "test";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    return $conn;
}

if(isset($_POST['meuble'], $_POST['idPartie'])) {
    $meuble = $_POST['meuble']; 
    $idPartie = $_POST['idPartie'];
    ajout_meuble($meuble, $idPartie);
}
if(isset($_POST['numero'], $_POST['idPartie'])) {
    $numero = $_POST['numero']; 
    $idPartie = $_POST['idPartie'];
    ajout_maison($numero, $idPartie);
} 

function ajout_meuble($meuble, $idPartie) {
    $conn = connection_to_database();

    if(!isset($meuble)) {
        echo "Erreur : le meuble n'est pas spécifié.";
        return;
    }

    $sql = "UPDATE deroulement SET `$meuble` = 'true' WHERE id_partie = ? AND tour = 'true'";

    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        echo "Erreur de préparation de la requête : " . $conn->error;
        return;
    }

    // Liaison des paramètres
    $stmt->bind_param("s", $idPartie); 

    // Exécution de la requête
    if ($stmt->execute()) {
        echo "Meuble ajouté avec succès !";
    } else {
        echo "Erreur lors de l'ajout du meuble : " . $stmt->error;
    }


    $stmt->close();
    $conn->close();
}

function ajout_maison($numero,$idPartie) {
    $conn = connection_to_database();
    $numero = intval($numero);
    if(!isset($numero)) {
        echo "Erreur : le numéro de maison n'est pas spécifié.";
        return;
    }

    $sql = "UPDATE deroulement SET maison = ? WHERE id_partie = ? AND tour = 'true'";

    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        echo "Erreur de préparation de la requête : " . $conn->error;
        return;
    }

    // Liaison des paramètres
    $stmt->bind_param("ss", $numero, $idPartie); 

    // Exécution de la requête
    if ($stmt->execute()) {
        echo "Maison ".$numero."ajoutée avec succès dans la partie:".$idPartie ." !";
    } else {
        echo "Erreur lors de l'ajout de la maison : " . $stmt->error;
    }
}
?>
