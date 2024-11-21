<?php
session_start();
$_SESSION = array();
session_destroy();

?>
<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <title>Projet</title>
        <link rel="icon" href="images/ville2.ico">
        <link href="style.css" rel="stylesheet">
        <script src="login.js" defer ></script> <!--defer    pour que le js attende que la page soit chargée-->
    </head>
    <body>
        <header>
        </header>
        <div id="menu_haut">
            <button id="connexion" class="bouton">Connexion</button>
            <button id="register" class="bouton">Créer compte</button>
            <!-- <button id="guest" class="bouton">Invité</button> -->
            <br>
        </div>
        <div>
            <h1>Projet WEB - Jeu Ville</h1>
            <img src="images/ville2.jpg" alt="logo" width="200px">
            <h2>Page Principale</h2>
            <p>Veuillez vous connecter pour pouvoir jouer</p>
            <div id="login_form" hidden>
                <div id="bouton_close_form">
                    <button class="bouton">X</button>
                </div>
                <form id="form" action="" >
                    <p id="form_title"></p>
                    <label for="login">Nom d'utilisateur:</label>
                    <input type="text" name="login" id="login" required>
                    <br><br>
                    <label for="mdp">Mot de passe:</label>
                    <input type="password" name="mdp" id="mdp" required>
                    <br><br>
                    <button type="submit" class="bouton">Valider</button>
                    <br>
                    <p id="message"></p>
                </form>
            </div>
        </div>
        <footer>
        </footer>
	</body>
</html>