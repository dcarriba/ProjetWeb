<?php

if(isset($_GET['idPartie']) && isset($_GET['action'])) {
    if ($_GET['action'] == "demarrer"){
        demarrer();
    }
    if ($_GET['action'] == "bouton"){
        bouton();
    }

} else {
    echo "Erreur : données manquantes.";
}

function demarrer(){
    $id_partie = $_GET['idPartie'];

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "test";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "UPDATE partie SET etat = 'en_cours' WHERE id_partie = $id_partie ";


    $result = $conn->query($sql); 

    $sql2 = "UPDATE deroulement SET tour = 'true' WHERE id_partie = $id_partie AND rang = 1";

    $result2 = $conn->query($sql2); 

    if ($result === true && $result2 === true){
        $conn->close();
        echo json_encode(true);
    } else {
        $conn->close();
        echo json_encode(false);
    }

    
}

function bouton(){
    $id_partie = $_GET['idPartie'];

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "test";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT etat, joueur1 FROM partie WHERE id_partie = $id_partie ";

    $result = $conn->query($sql);


    // $reponse = $result->fetch_assoc();

    $sql2 = "SELECT joueur FROM deroulement WHERE id_partie = $id_partie AND tour = 'true'";

    $result2 = $conn->query($sql2);

    if ($result->num_rows > 0){
        $result = $result->fetch_assoc();
        $reponse = $result;
        if ($result2->num_rows > 0){
            $result2 = $result2->fetch_assoc();
            $reponse = $result + $result2;
        }
    }
    

    echo json_encode($reponse);

}