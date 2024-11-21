<?php

if (isset($_GET['action']) && isset($_GET['idPartie'])){
    if ($_GET['action'] == "prochain"){
        $servername = "localhost"; 
        $username = "root"; 
        $password = ""; 
        $dbname = "test"; 
        $conn = new mysqli($servername, $username, $password, $dbname);
        if ($conn->connect_error) {
            die("Connexion échouée: " . $conn->connect_error);
        }
        $idPartie = $_GET['idPartie'];
        $sql = "SELECT rang FROM deroulement WHERE tour = 'true' AND id_partie = $idPartie ";
        $result = $conn->query($sql);
        if ($result->num_rows > 0){
            $reponse = $result->fetch_assoc();
            $rang = $reponse['rang'];
        } else {
            $conn->close();
            echo json_encode(false);
        }
        $sql2 = "UPDATE deroulement SET tour = 'false' WHERE id_partie = $idPartie";
        $result2 = $conn->query($sql2);
        if ($result2 != true){
            $conn->close();
            echo json_encode(false);
            
        }
        $sql3 = "SELECT nombre_joueurs FROM partie WHERE id_partie = $idPartie";
        $result3 = $conn->query($sql3);
        if ($result3->num_rows > 0){
            $reponse3 = $result3->fetch_assoc();
            $nombre_joueurs = $reponse3['nombre_joueurs'];
        } else {
            $conn->close();
            echo json_encode(false);
            
        }
        $rang++;
        if ($rang > $nombre_joueurs){
            $rang = 1;
        }
        $sql4 = "UPDATE deroulement SET tour = 'true' WHERE rang = $rang AND id_partie = $idPartie";
        $result4 = $conn->query($sql4);
        if ($result4 != true){
            $conn->close();
            echo json_encode(false);   
                
        }
        $conn->close();
        echo json_encode(true);
    } else {
        echo json_encode(false);
    }
} else {
    echo json_encode(false);
}