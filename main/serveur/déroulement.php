<?php 

function argent($montant, $idPartie) {
    session_start();
    $true = 'true';
    if (!isset($_SESSION["username"])) {
        echo "Erreur : utilisateur non authentifié.";
        return;
    }
    $user = $_SESSION["username"];

    $conn = new mysqli("localhost", "root", "", "test");

    if ($conn->connect_error) {
        die("Échec de la connexion : " . $conn->connect_error);
    }

    $sql_update = "UPDATE deroulement SET argent = argent + ? WHERE id_partie = ? AND joueur = ? AND tour = 'true'";
    $stmt = $conn->prepare($sql_update);
    if (!$stmt) {
        echo "Erreur lors de la préparation de la requête : " . $conn->error;
        return;
    }

    $stmt->bind_param("iis", $montant, $idPartie, $user);
    if (!$stmt->execute()) {
        echo "Erreur lors de l'exécution de la requête : " . $stmt->error;
        return;
    }

    // Effectuer une autre requête pour récupérer le solde actualisé
    $sql_select = "SELECT argent FROM deroulement WHERE id_partie = ? AND joueur = ? AND tour = 'true'";
    $stmt_select = $conn->prepare($sql_select);
    if (!$stmt_select) {
        echo "Erreur lors de la préparation de la requête SELECT : " . $conn->error;
        return;
    }
    
    $stmt_select->bind_param("is", $idPartie, $user);
    if (!$stmt_select->execute()) {
        echo "Erreur lors de l'exécution de la requête : " . $stmt_select->error;
        return;
    }

    // Récupérer le résultat de la requête
    $stmt_select->bind_result($nouveauSolde);
    $stmt_select->fetch();
    $stmt_select->close();

    $stmt->close();
    $conn->close();

    // Renvoyer le nouveau solde du joueur
    echo $nouveauSolde;
}

// Appel de la fonction avec les données reçues de la requête AJAX
if(isset($_POST['montant'], $_POST['idPartie'])) {
    $montant = $_POST['montant'];
    $idPartie = $_POST['idPartie'];
    argent($montant, $idPartie);
}

if(isset($_POST['action']) && isset($_POST['idPartie'])) {
    $action = $_POST['action'];
    $idPartie = $_POST['idPartie'];
    
    // Selon l'action spécifiée, appeler la fonction PHP appropriée ou effectuer les opérations nécessaires avec l'ID de partie
    
    if($action == "feu_assurance") {
        feu_assurance($idPartie,$conn); // Appeler la fonction feu_assurance avec l'ID de partie
    }
}
$conn = new mysqli("localhost", "root", "", "test");
function feu_assurance($idPartie, $conn) {
    // Requête SQL pour vérifier l'état de l'assurance du joueur
    $requete = "SELECT assurance FROM deroulement WHERE id_partie = $idPartie AND tour = 'true'";

    // Exécution de la requête
    $resultat = $conn->query($requete);

    // Vérification du résultat
    if ($resultat && $resultat->num_rows > 0) {
        $row = $resultat->fetch_assoc();
        $assurance = $row['assurance'];

        // Si l'assurance est "false", mettre tous les meubles à "false"
        if ($assurance === "false") {
            $updateQuery = "UPDATE deroulement SET ping_pong = 'false', velo = 'false', `machine-a-laver` = 'false', cuisine = 'false', canape = 'false', `table` = 'false', wc = 'false', baignoire = 'false', lit = 'false', radio = 'false', tv = 'false' WHERE id_partie = $idPartie AND tour = 'true'";
            if ($conn->query($updateQuery) === TRUE) {
                echo "Tous les meubles ont été mis à 'false'.";
            } else {
                echo "Erreur lors de la mise à jour des meubles : " . $conn->error;
            }
        } else {
            echo "L'assurance du joueur est 'true', aucun meuble n'a été affecté.";
        }
    } else {
        echo "Aucun joueur avec le tour = true trouvé.";
    }
}

if(isset($_POST['action']) && isset($_POST['idPartie'])) {
    $action = $_POST['action'];
    $idPartie = $_POST['idPartie'];
    
    // Selon l'action spécifiée, appeler la fonction PHP appropriée ou effectuer les opérations nécessaires avec l'ID de partie
    
    if($action == "recuperer") {
        $resultat = recupererMeublesjoueur($idPartie,$conn); // Appeler la fonction feu_assurance avec l'ID de partie
        echo json_encode(array("success" => true, "joueur" => $resultat));
    }
}


function recupererMeublesjoueur($idPartie, $conn) {
    // Requête SQL pour récupérer les informations sur les meubles du joueur pour la partie spécifiée
    $sql = "SELECT rang, maison,assurance, `ping_pong` , velo , `machine-a-laver`, cuisine, canape,`table`,wc,baignoire,lit,radio,tv  FROM deroulement WHERE id_partie = ? AND tour = 'true'";
    $sql2 = "SELECT maison FROM deroulement WHERE id_partie = ?";
    
    // Préparation de la première requête
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $idPartie);
    
    // Exécution de la première requête
    $stmt->execute();
    
    // Récupération du résultat de la première requête
    $resultat = $stmt->get_result()->fetch_assoc();
    
    // Fermeture de la première requête
    $stmt->close();
    
    // Préparation de la deuxième requête
    $stmt2 = $conn->prepare($sql2);
    $stmt2->bind_param("i", $idPartie);
    
    // Exécution de la deuxième requête
    $stmt2->execute();
    
    // Récupération du résultat de la deuxième requête
    $resultat2 = $stmt2->get_result()->fetch_assoc();
    
    // Fermeture de la deuxième requête
    $stmt2->close();
    
    // Fermeture de la connexion
    $conn->close();

    $joueur = array(
        "rang" => $resultat['rang'],
        "maison" => $resultat["maison"],
        "assurance" => $resultat["assurance"],
        "maison_des_joueurs" => $resultat2['maison'], 
        "meubles" => array(
            "ping_pong" => $resultat['ping_pong'],
            "velo" => $resultat['velo'],
            "machine_a_laver" => $resultat['machine-a-laver'],
            "cuisine" => $resultat['cuisine'],
            "canape" => $resultat['canape'],
            "table" => $resultat['table'],
            "wc" => $resultat['wc'],
            "baignoire" => $resultat['baignoire'],
            "lit" => $resultat['lit'],
            "radio" => $resultat['radio'],
            "tv" => $resultat['tv']
        )
    );
    // Retourner les données du joueur au format JSON
    return ($joueur);
}

if(isset($_POST['action']) && isset($_POST['idPartie'])) {
    $action = $_POST['action'];
    $idPartie = $_POST['idPartie'];
    
    // Selon l'action spécifiée, appeler la fonction PHP appropriée ou effectuer les opérations nécessaires avec l'ID de partie
    
    if($action == "argent") {
        $resultat = recupererArgentjoueur($idPartie,$conn); // Appeler la fonction feu_assurance avec l'ID de partie
        echo json_encode(array("success" => true, "argent" => $resultat));
    } 
}


function recupererArgentjoueur($idPartie, $conn) {
    // Requête SQL pour récupérer les informations sur les meubles du joueur pour la partie spécifiée
    $sql = "SELECT argent  FROM deroulement WHERE id_partie = ? AND tour = 'true'";
    
    // Préparation de la première requête
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $idPartie);
    
    // Exécution de la première requête
    $stmt->execute();
    
    // Récupération du résultat de la première requête
    $res = $stmt->get_result()->fetch_assoc();
    
    // Fermeture de la première requête
    $stmt->close();
    $conn->close();

    // Retourner les données du joueur au format JSON
    return ($res);
}


?>
