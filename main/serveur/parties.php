<?php

session_start();

// Vérifiez si une action est spécifiée et exécutez la fonction appropriée
if (isset($_GET['action']) && $_GET['action'] === 'ajout_partie') {
    ajout_partie();
}

if (isset($_GET['action']) && $_GET['action'] === 'charger_partie') {
    echo charger_partie();
}

if (isset($_GET['id_partie']) && (!isset($_GET['action']) || $_GET['action'] !== 'getPseudosAndMoneyForPartie')) {
    $idPartie = $_GET['id_partie'];
    rejoindrePartie($idPartie);
}

if (isset($_GET['action']) && $_GET['action'] === 'getPseudosAndMoneyForPartie' && isset($_GET['id_partie'])) {
    // Récupérer l'ID de partie depuis la requête GET
    $partieId = $_GET['id_partie'];
    // Appeler la fonction getPseudosAndMoneyForPartie() avec l'ID de partie spécifié
    echo getPseudosAndMoneyForPartie($partieId);
}
if (isset($_GET['action']) && $_GET['action'] === 'position' && isset($_GET['id_partie'])) {
    // Récupérer l'ID de partie depuis la requête GET
    $id_partie = $_GET['id_partie'];
    // Appeler la fonction position() avec l'ID de partie spécifié
    position($id_partie);
}
function ajout_partie() {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "test";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("La connexion a échoué : " . $conn->connect_error);
    }

    // Requête SQL pour créer la table des parties si elle n'existe pas
    $sql = "CREATE TABLE IF NOT EXISTS partie (
        id_partie INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nombre_joueurs INT(1) UNSIGNED,
        joueur1 VARCHAR(100),
        joueur2 VARCHAR(100),
        joueur3 VARCHAR(100),
        joueur4 VARCHAR(100),
        etat ENUM('en_attente', 'en_cours') DEFAULT 'en_attente'
    )";

    // Exécution de la premiere requête
    if ($conn->query($sql) !== TRUE) {
        die("Erreur lors de la création de la table partie : " . $conn->error);
    }
    
    // Requête SQL qui crée maintenant la partie
    $user = $_SESSION["username"];
    $sql = "INSERT INTO partie (nombre_joueurs, joueur1, etat) VALUES (1, '$user', 'en_attente')";

    if ($conn->query($sql) === TRUE) {
        $id_partie = $conn->insert_id;
        echo $id_partie; // Renvoyer l'ID de la partie nouvellement créée au JavaScript
        infos_partie($id_partie);
        $conn->close();
    } else {
        echo "Erreur lors de l'insertion d'une nouvelle ligne : " . $conn->error;
        $conn->close();
        return null;
    }
}


function charger_partie() {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "test";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("La connexion a échoué : " . $conn->connect_error);
    }

    // Requête SQL pour récupérer les parties
    $sql = "SELECT * FROM partie";
    $result = $conn->query($sql);

    $parties = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $parties[] = $row; // Ajouter les données de chaque partie au tableau
        }
    }

    // Fermer la connexion
    $conn->close();

    // Encoder les données en JSON et les renvoyer
    return json_encode($parties);
}



function rejoindrePartie($idPartie) {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "test";

    $conn = new mysqli($servername, $username, $password, $dbname);

    $sql = "SELECT * FROM partie WHERE id_partie = $idPartie";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $nombre_joueurs = $row['nombre_joueurs'];
        // Vérifier si le nombre de joueurs est inférieur à 4
        if ($nombre_joueurs < 4) {
            if ($conn->connect_error) {
                die("Connexion échouée: " . $conn->connect_error);
            }
            $joueur = "joueur".($nombre_joueurs+1);
            $username = $_SESSION["username"];
            if ($username === $row['joueur1'] || $username === $row['joueur2'] ||
                $username === $row['joueur3'] || $username === $row['joueur4']){
                return;
            }
            // Requête SQL pour mettre à jour le nombre de joueurs dans la table de la partie
            $sql1 = "UPDATE partie SET nombre_joueurs = nombre_joueurs + 1 WHERE id_partie = $idPartie";
            if ($conn->query($sql1) !== TRUE) {
                echo "Erreur lors de la mise à jour du nombre de joueurs : " . $conn->error;
            }
            // Requête SQL pour ajouter le nouvel joueur à la partie
            $sql2 = "UPDATE partie SET $joueur = '$username' WHERE id_partie = $idPartie";
            if ($conn->query($sql2) !== TRUE) {
                echo "Erreur lors de l'ajout du joueur à la table : " . $conn->error;
            } else {
                echo $idPartie;
                infos_partie($idPartie);
                return ; // Assurez-vous de terminer le script après la redirection
            }
        }
    }
    // Fermer la connexion
    $conn->close();
}

function infos_partie($id_partie) {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "test";
    $user = $_SESSION["username"];
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("La connexion a échoué : " . $conn->connect_error);
    }

    // Requête SQL pour créer la table des parties si elle n'existe pas
    $sql = "CREATE TABLE IF NOT EXISTS deroulement(
        id_partie INT(6) UNSIGNED,
        joueur VARCHAR(100),
        position INT(2) UNSIGNED DEFAULT 1,
        rang INT(1) UNSIGNED ,
        tour ENUM('true', 'false') DEFAULT 'false',
        argent INT(6) UNSIGNED DEFAULT 2000,
        possede_maison ENUM('true', 'false') DEFAULT 'false',
        maison ENUM('0', '1', '2', '3', '4') DEFAULT '0',
        assurance ENUM('true', 'false') DEFAULT 'false',
        ping_pong ENUM('true', 'false') DEFAULT 'false',
        velo ENUM('true', 'false') DEFAULT 'false',
        `machine-a-laver` ENUM('true', 'false') DEFAULT 'false',
        cuisine ENUM('true', 'false') DEFAULT 'false',
        canape ENUM('true', 'false') DEFAULT 'false',
        `table` ENUM('true', 'false') DEFAULT 'false',
        wc ENUM('true', 'false') DEFAULT 'false',
        baignoire ENUM('true', 'false') DEFAULT 'false',
        lit ENUM('true', 'false') DEFAULT 'false',
        radio ENUM('true', 'false') DEFAULT 'false',
        tv ENUM('true', 'false') DEFAULT 'false',
        PRIMARY KEY (id_partie, joueur)
    )";

    // Exécution de la première requête
    if ($conn->query($sql) !== TRUE) {
        die("Erreur lors de la création de la table partie : " . $conn->error);
    }
    
    // Requête SQL qui crée maintenant la partie
    $user = $_SESSION["username"];
    $sql2 = "INSERT INTO deroulement (id_partie, joueur, rang) 
    SELECT '$id_partie', '$user', IFNULL(MAX(rang) + 1, 1) FROM deroulement WHERE id_partie = '$id_partie'";

    if ($conn->query($sql2) === TRUE) {
        $id_partie = $conn->insert_id;
    } else {
        $conn->close();
        return null;
    }
    $conn->close();
}



function getPseudosAndMoneyForPartie($partieId) {
    // Connexion à la base de données (supposons que vous avez déjà configuré votre connexion MySQL)
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "test";

    // Création de la connexion
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Vérification de la connexion
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT joueur, argent,tour, maison, rang FROM deroulement WHERE id_partie = $partieId ORDER BY rang";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $response = array();
        while($row = $result->fetch_assoc()) {
            $response[] = $row['joueur'] . " - " . $row['argent'] ." - " . $row['tour'] . " - " . $row['maison'] . " - " . $row['rang'];
        }

        $conn->close();

        return json_encode($response);
    } else {
        // Aucun résultat trouvé
        $conn->close();
        return "Aucun résultat trouvé pour l'ID de partie spécifié.";
    }
}


function position($id_partie) {
    // Connexion à la base de données
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "test";

    // Création de la connexion
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Vérification de la connexion
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql= "SELECT position, rang FROM deroulement WHERE id_partie = $id_partie ORDER BY rang";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $positions = array();
        
        while($row = $result->fetch_assoc()) {
            // Ajout des données dans le tableau des positions
            $positions[] = array("position" => $row["position"], "rang" => $row["rang"]);
        }
        
        $response = json_encode(array("positions" => $positions));
        
        header('Content-Type: application/json');
        echo $response;
    } else {
        header('Content-Type: application/json');
        echo json_encode(array("positions" => array()));
    }

    $conn->close();
}


?>
    
