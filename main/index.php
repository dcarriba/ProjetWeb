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

?>
<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <title>Projet</title>
        <link rel="icon" href="images/ville2.ico">
        <link href="style.css" rel="stylesheet">
        <script src="index.js" defer></script>
    </head>
    <body>
        <header>
        </header>
        <div id="menu_haut">
            <p>
                User : <span id="username"><?php nomUser() ?></span>
                <a href="login.php" class="bouton">Déconnexion</a>
            </p>
        </div>
        <div>
            <h1>Projet WEB - Jeu Ville</h1>
            <img src="images/ville2.jpg" alt="logo" width="200px">
            <h2>Page Principale</h2>
            <p>Bienvenue <?php nomUser() ?> !</p>
            <h3 class="titre_listePartiesContainer">Vos parties</h3>
            <div class="listePartiesContainer">
                <div class="boutonsContainer">
                    <button id="btnCreerPartie" class="bouton">Nouvelle partie</button>
                    <!-- <button id="btnChargerParties" class="bouton">Recharger</button> -->
                </div>
                <div id="vosParties">
                    
                </div>
            </div><br>
            <h3 class="titre_listePartiesContainer">Rejoindre de nouvelles parties</h3>
            <div class="listePartiesContainer">
                <div class="boutonsContainer">
                    <!-- <button id="btnCreerPartie" class="bouton">Nouvelle partie</button> -->
                    <button id="btnChargerParties" class="bouton">Recharger</button>
                </div>
                <div id="nouvellesParties">
                    
                </div>
            </div><br>
        </div>
        <footer>
        </footer>
    </body>
</html>
