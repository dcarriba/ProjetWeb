<?php 

$serveur = "localhost";
$utilisateur = "root";
$motDePasse = "";
$baseDeDonnees = "test";

$connexion = new mysqli($serveur, $utilisateur, $motDePasse, $baseDeDonnees);

// Vérifier la connexion
if ($connexion->connect_error) {
    die("La connexion à la base de données a échoué : " . $connexion->connect_error);
}

function recupere_position() {
    global $connexion;

    // Requête SQL pour récupérer la position du joueur
    $requete = "SELECT position FROM deroulement WHERE tour = true";

    // Exécute la requête
    $resultat = $connexion->query($requete);

    // Vérifie si la requête a réussi
    if ($resultat) {
        // Récupère la première ligne de résultat
        $row = $resultat->fetch_assoc();

        // Vérifie si une position a été trouvée
        if ($row) {
            // Renvoie la position au format JSON
            echo $row['position'];
        } else {
            // Si aucun résultat trouvé, renvoie un message d'erreur
            echo 'Aucune position trouvée';
        }
    } else {
        // Si la requête a échoué, renvoie un message d'erreur
        echo 'Erreur lors de l\'exécution de la requête';
    }
}

// Appel de la fonction pour récupérer la position
recupere_position();

// Fermeture de la connexion à la base de données
$connexion->close();
?>