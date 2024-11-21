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


// Fonction pour récupérer les informations sur les meubles de chaque joueur pour une partie donnée
function recupererMeublesPartie($idPartie) {
    // Connexion à la base de données
    $connexion = connection_to_database();

    // Requête SQL pour récupérer les informations sur les meubles de chaque joueur pour la partie spécifiée
    $sql = "SELECT joueur, rang, maison, `ping_pong` , velo , `machine-a-laver`, cuisine, canape,`table`,wc,baignoire,lit,radio,tv  FROM deroulement WHERE id_partie = ?";
    
    // Préparation de la requête
    $stmt = $connexion->prepare($sql);
    $stmt->bind_param("i", $idPartie);
    
    // Exécution de la requête
    $stmt->execute();
    
    // Récupération des résultats
    $resultat = $stmt->get_result();
    
    // Création d'un tableau pour stocker les données des joueurs
    $joueurs = array();
    
    // Parcours des résultats
    while ($row = $resultat->fetch_assoc()) {
        // Ajout des données du joueur au tableau
        $joueur = array(
            "joueur_nom" => $row['joueur'],
            "rang" => $row['rang'],
            "maison" => $row['maison'],
            "meubles" => array(
                "machine_a_laver" => $row['machine-a-laver'],
                "cuisine" => $row['cuisine'],
                "canape" => $row['canape'],
                "ping_pong" => $row['ping_pong'],
                "velo" => $row['velo'],
                "table" => $row['table'],
                "wc" => $row['wc'],
                "baignoire" => $row['baignoire'],
                "lit" => $row['lit'],
                "radio" => $row['radio'],
                "tv" => $row['tv']
                // Ajoutez d'autres meubles selon vos besoins
            )
        );
        
        // Ajout du joueur au tableau des joueurs
        $joueurs[] = $joueur;
    }
    
    // Fermeture de la requête et de la connexion
    $stmt->close();
    $connexion->close();
    
    // Retourner les données au format JSON
    return json_encode(array("success" => true, "joueurs" => $joueurs));
}

// Vérifier si l'identifiant de partie est spécifié dans la requête POST
if(isset($_POST['idPartie'])) {
    $idPartie = $_POST['idPartie'];
    
    // Appeler la fonction pour récupérer les informations sur les meubles de chaque joueur pour cette partie
    $resultat = recupererMeublesPartie($idPartie);
    
    // Envoyer les données JSON en réponse
    echo $resultat;
} else {
    // Envoyer un message d'erreur si l'identifiant de partie est manquant
    echo json_encode(array("success" => false, "message" => "L'identifiant de partie est manquant."));
}


?>
