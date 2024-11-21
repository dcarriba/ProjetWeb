<?php

function renvoyerCarteAleatoire($cheminFichier) {
    // Vérifie si le fichier existe
    if (!file_exists($cheminFichier)) {
        return "Le fichier CSV n'existe pas.";
    }

    // Ouvre le fichier en lecture
    $handle = fopen($cheminFichier, 'r');

    // Vérifie si l'ouverture du fichier a réussi
    if (!$handle) {
        return "Impossible d'ouvrir le fichier CSV.";
    }

    // Tableau pour stocker les données des cartes
    $cartes = array();

    // Lit le fichier ligne par ligne
    while (($data = fgetcsv($handle, 1000, ";")) !== false) {
        $description = $data[0]; // La première colonne contient la description
        $indice = $data[1]; // La deuxième colonne contient l'indice

        // Ajoute les données de la carte au tableau
        $cartes[] = array(
            'description' => $description,
            'indice' => $indice
        );
    }

    // Ferme le fichier
    fclose($handle);

    // Sélectionne une carte au hasard
    $carteAleatoire = $cartes[array_rand($cartes)];

    // Encodage de la carte au hasard en format JSON
    $jsonCarteAleatoire = json_encode($carteAleatoire);

    // Retourne la carte au hasard encodée en JSON
    return $jsonCarteAleatoire;
}

$cheminFichierCSV = 'mystere.csv';

// Renvoie la carte au hasard encodée en JSON au JavaScript
echo renvoyerCarteAleatoire($cheminFichierCSV);