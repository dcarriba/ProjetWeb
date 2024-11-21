<?php

session_start();

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']){
    header("Location: login.php");
}

function nomUser(){
    if (isset($_SESSION['logged_in']) && $_SESSION['logged_in']){
        echo $_SESSION['username'];
    }
}

function creerPlateau(){
    $file = file("serveur/cases.csv");;
    for ($i = 1; $i<=36; $i++){
        $line = explode(';', $file[$i-1]);
        echo '
        <div class="case" id="case'.$i.'">
            <div class="numéro">'.$i.'</div>
            <img class="image" src="images/'.$line[0].'" alt="'.$line[0].'">
        </div>
        ';
    }
}

if (isset($_GET['idPartie'])) {
    $idPartie = $_GET['idPartie'];
    
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "test";

    $conn = new mysqli($servername, $username, $password, $dbname);

    $sql = "SELECT joueur1, joueur2, joueur3, joueur4 FROM partie WHERE id_partie = $idPartie";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $username = $_SESSION["username"];
        if ($username === $row['joueur1'] || $username === $row['joueur2'] ||
            $username === $row['joueur3'] || $username === $row['joueur4']){
            // le joueur est bien dans la partie, donc rien ne se passe
        } else {
            // le joueur n'est pas dans la partie, donc on le redirige vers la page principale
            header("Location: index.php");
        }
    } else {
        // erreur de connexion à la base de donnée
        header("Location: index.php");
    }
} else {
    header("Location: index.php");
}

$noms_boutiques = array(
    "Salle de bain" ,"Meubles","Maison 1","Gare du nord","Appareils électroniques","Immobilier","Inter SPORT","Assurance","Maison 2","Gare du sud est","Meubles","Immobilier","Maison 3",
    "Appareils électroniques","Décathlon","Gare du sud ouest","Cuisine","Maison 4" 
);
$listes = array(
    array(
        "images_jeu/maison/baignoire.png" => 700,
        "images_jeu/maison/wc.png" => 300,
    ),
    array(
        "images_jeu/maison/canape.png" => 800,
        "images_jeu/maison/table.png" => 200,
        "images_jeu/maison/lit.png" => 400,
    ),
    array(
        "images/maison1.jpg" => 2000,
    ),
    array(
        "images/gare2.jpg" => 150,
        "images/gare3.jpg" => 250,
    ),
    array(
        "images_jeu/maison/machine-a-laver.png" => 450,
        "images_jeu/maison/radio.png" => 200,
        "images_jeu/maison/tv.png" => 350,
    ),
    array(
        "images/maison1.jpg" => 2500,
        "images/maison2.jpg" => 2700,
        "images/maison3.jpg" => 2900,
        "images/maison4.jpg" => 3100,
    ),
    array(
        "images_jeu/maison/velo.png" => 300,
        "images_jeu/maison/ping_pong.png" => 500,
 
    ),
    array(
        "images/assurance2.png" => 300,
    ),
    array(
        "images/maison2.jpg" => 2200,
    ),
    array(
        "images/gare1_case2.jpg" => 300,
        "images/gare3.jpg" => 150,
    ),
    array(
        "images_jeu/maison/canape.png" => 800,
        "images_jeu/maison/table.png" => 200,
        "images_jeu/maison/lit.png" => 400,
    ),
    array(
        "images/maison1.jpg" => 2500,
        "images/maison2.jpg" => 2700,
        "images/maison3.jpg" => 2900,
        "images/maison4.jpg" => 3100,
    ),
    array(
        "images/maison3.jpg" => 2400,
    ),
    array(
        "images_jeu/maison/machine-a-laver.png" => 500,
        "images_jeu/maison/radio.png" => 150,
        "images_jeu/maison/tv.png" => 400,
    ),
    array(
        "images_jeu/maison/velo.png" => 350,
        "images_jeu/maison/ping_pong.png" => 530,
 
    ),
    array(
        "images/gare1_case2.jpg" => 300,
        "images/gare2.jpg" => 200,
    ),
    array(
        "images_jeu/maison/cuisine.png" => 1100,
    ),
    array(
        "images/maison3.jpg" => 2600,
    ),
 
);
?>
<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" href="images/ville2.ico">
        <link rel="stylesheet" href="plateau.css">
        <link rel="stylesheet" href="maison.css">
        <script src="plateau.js" defer ></script>
        <title>Jeux</title>
    </head>
    <body>
        <div id="menu_haut">
            <p>
                User : <span id="nomUser"><?php nomUser() ?></span>
                <a href="index.php" class="bouton">Retour au Menu</a>
                <a href="login.php" class="bouton">Déconnexion</a>
            </p>
        </div>
        <div class="container">
            <?php creerPlateau() ?>
        </div>
        <div>
            <?php 
                creerboutiques($listes, $noms_boutiques);
                creerCasino();
            ?>
        </div><br>
        <div id="controles_jeu"></div><br>
        <p id="message_jeu"></p>
        <div id="pseudo">
        </div><br>
        <div id="maisons_boutons">
        </div>
        <div id="maisons">
        </div>
    </body>
</html>


<?php

function boutique($meubles, $boutique_counter, $nom_boutique) {
    // Début du conteneur principal
    echo '<div class="boutique" id="boutique_' . $boutique_counter . '" style="display: none;">';
    echo '<h2>' . $nom_boutique . '</h2>';
    // Initialisation du compteur pour les identifiants uniques des boutons
    $id_counter = 1;

    // Boucle à travers les meubles
    foreach ($meubles as $meuble => $prix) {
        // Extraire le nom du meuble à partir de l'URL de l'image
        $nom_meuble = basename($meuble);
        $extension = pathinfo($nom_meuble, PATHINFO_EXTENSION);
        $nom_meuble = basename($nom_meuble, '.' . $extension);
        echo '<div class="produit">';
        echo '<img src="' . $meuble . '" alt="' . $nom_meuble . '">';
        echo '<button class="bouton_produit bouton_'.$nom_meuble.' bouton_produit'.$boutique_counter.'" data-nom="' . $nom_meuble . '" data-prix="' . $prix . '" data-boutique="' . $boutique_counter . '" onclick="achat(\'' . $nom_meuble . '\', ' . $prix . ', this)">' . $prix . ' $</button>';        echo '</div>';
        // Incrémentation du compteur
        $id_counter++;
    }

    // Fin du conteneur principal
    echo '<button class="bouton_fermer" id="bouton_fermer_' . $boutique_counter . '" onclick="cacherBoutique(' . $boutique_counter . ',false)">Fermer</button>';

    echo '</div>';
}

function creerboutiques($listes,$noms_boutiques ) {
    // Initialisation du compteur pour les boutiques
    $boutique_counter = 1;

    // Boucle à travers les listes de meubles
    foreach ($listes as $liste) {
        // Appel de la fonction boutique pour créer une boutique avec la liste de meubles actuelle
        boutique($liste, $boutique_counter ,$noms_boutiques[$boutique_counter-1]);
        // Incrémentation du compteur
        $boutique_counter++;
    }
} 


function creerCasino(){
    echo '
    <div class="boutique" id="casino" style="display: none;">
        <h2>Casino</h2>
        <div id="casino_jeu">
            <img src="images_jeu/casino/casino1.png" alt="image casino">
            <img src="images_jeu/casino/casino2.png" alt="image casino">
            <img src="images_jeu/casino/casino3.png" alt="image casino"><br>
        </div><br>
        <button class="bouton" id="bouton_jouer_casino" onclick="jouerCasino()">Jouer</button><br>
        <p>Tentez votre chance de gagner 2000 $</p>
        <button class="bouton_fermer" id="bouton_fermer_casino" onclick="cacherCasino()">Fermer</button>
    </div>
    ';
}











?>
