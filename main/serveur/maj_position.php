<?php 

var_dump($_POST);
if(isset($_POST['mode']) && isset($_POST['pos']) && isset($_POST['idPartie']) ) {
    // Connexion à la base de données (à ajuster selon vos paramètres)
    $servername = "localhost"; // Nom du serveur MySQL
    $username = "root"; // Nom d'utilisateur MySQL
    $password = ""; // Mot de passe MySQL
    $dbname = "test"; // Nom de la base de données

    // Création de la connexion
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Vérification de la connexion
    if ($conn->connect_error) {
        die("Connexion échouée: " . $conn->connect_error);
    }

    // Récupération des données POST
    $mode = $_POST['mode'];
    $pos = $_POST['pos'];
    $idPartie = $_POST['idPartie'];

    if ($mode === "set"){
        // Requête SQL pour mettre à jour la base de données
        $sql = "UPDATE deroulement SET position = $pos WHERE tour = 'true' AND id_partie = $idPartie";

        if ($conn->query($sql) === TRUE) {
            echo "true";
        } else {
            echo "false" . $conn->error;  
        }
        $conn->close();
        
    } else if ($mode === "add"){
        // Requête SQL pour mettre à jour la base de données
        $sql = "SELECT position FROM deroulement WHERE tour = 'true' AND id_partie = $idPartie";

        $result = $conn->query($sql);
        if ($result->num_rows > 0){
            $reponse = $result->fetch_assoc();
            $ancienne_pos = $reponse['position'];
        } else {
            echo "false" . $conn->error;
        }

        $nouv_pos = $ancienne_pos + $pos;
        if ($nouv_pos>36){
            $nouv_pos -= 36;
        }

        $sql = "UPDATE deroulement SET position = $nouv_pos WHERE tour = 'true' AND id_partie = $idPartie";

        if ($conn->query($sql) === TRUE) {
            echo "true";
        } else {
            echo "false" . $conn->error;
        }

        // Fermeture de la connexion à la base de données
        $conn->close();
    }

    
} else {
    echo "Données non reçues.";
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pos = $_POST['pos'];
    echo "Données reçues : pos = $pos";
} else {
    echo "Aucune donnée POST reçue.";
}

?>