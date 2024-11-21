function ajouterPartie() {
    fetch('serveur/parties.php?action=ajout_partie', {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la requête AJAX : ' + response.status);
        }
        return response.text();
    })
    .then(data => {
        console.log("data===",data); // Affiche la réponse dans la console
        // Rediriger vers la partie avec l'ID récupéré
        const idPartie = parseInt(data); // Convertir la réponse en nombre entier
        if (!isNaN(idPartie)) {
            window.location.href = 'plateau.php?idPartie=' + idPartie;
        } else {
            console.error('Erreur: Identifiant de partie non valide.');
        }
    })
    .catch(error => {
        console.error(error);
    });
}

function chargerParties() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // console.log(xhr.responseText);
                var parties = JSON.parse(xhr.responseText);
                afficherParties(parties);
            } else {
                console.error('Erreur lors du chargement des parties:', xhr.status);
            }
        }
    };
    xhr.open('GET', 'serveur/parties.php?action=charger_partie', true);
    xhr.send();
}

function afficherParties(parties) {
    // Fonction pour afficher les parties en attente dans le div déroulant

    var vosParties = document.getElementById('vosParties');
    vosParties.innerHTML = ''; // Effacer le contenu précédent

    var nouvellesParties = document.getElementById('nouvellesParties');
    nouvellesParties.innerHTML = ''; // Effacer le contenu précédent

    // Parcourir chaque partie et l'ajouter à la liste
    parties.forEach(function(partie) {
        var joueurDansPartie = false;
        

        var username  = document.getElementById("username").innerHTML;

        var divPartie = document.createElement('div');
        divPartie.className = 'partie';
        var descriptionPartie = document.createElement('p');

        var J1 = "";
        if (partie.joueur1 !== null){
            J1 = "Joueur 1 = "+partie.joueur1;
        }
        var J2 = "";
        if (partie.joueur2 !== null){
            J2 = "Joueur 2 = "+partie.joueur2;
        }
        var J3 = "";
        if (partie.joueur3!== null){
            J3 = "Joueur 3 = "+partie.joueur3;
        }
        var J4 = "";
        if (partie.joueur4 !== null){
            J4 = "Joueur 4 = "+partie.joueur4;
        }
        descriptionPartie.innerHTML = 'ID de partie : ' + partie.id_partie + ' | Nombre de joueurs : '
        + partie.nombre_joueurs + '/4 <br>' + J1 + ' ' + J2 + ' ' + J3 + ' ' + J4;
        
        // Créer un bouton "Rejoindre" ou "Reprendre la partie" 
        var btn = document.createElement('button');
        if (partie.joueur1 === username || partie.joueur2 === username ||
            partie.joueur3 === username || partie.joueur4 === username ){
            joueurDansPartie = true;
            btn.textContent = 'Reprendre la partie';
            btn.className = "bouton";
            btn.onclick = function() {
                window.location.href = 'plateau.php?idPartie=' + partie.id_partie;
            };
            if (partie.joueur1 === username){
                var btnCreerPartie = document.getElementById('btnCreerPartie');
                btnCreerPartie.textContent = "Vous avez déjà créé une partie"
                btnCreerPartie.disabled = true; 

            }
        } else {
            btn.textContent = 'Rejoindre';
            btn.className = "bouton";
            btn.onclick = function() {
                rejoindrePartie(partie.id_partie);
            };  
            if (partie.nombre_joueurs >= 4){
                btn.textContent = 'Complet';
                btn.disabled = true;
            }
        }
        divPartie.appendChild(descriptionPartie);
        divPartie.appendChild(btn);
        if (joueurDansPartie){
            vosParties.appendChild(divPartie);
        } else {
            if (partie.etat == "en_attente"){
                nouvellesParties.appendChild(divPartie);
            }
        }
    });
}

function rejoindrePartie(idPartie) {
    // Fonction pour rejoindre une partie

    fetch('serveur/parties.php?action=rejoindrePartie&id_partie=' + idPartie, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la requête AJAX : ' + response.status);
        }
        return response.text();
    })
    .then(data => {
        console.log("data===",data); // Affiche la réponse dans la console
        // Rediriger vers la partie avec l'ID récupéré
        const idPartieRejointe = parseInt(data); // Convertir la réponse en nombre entier
        if (!isNaN(idPartieRejointe)) {
            window.location.href = 'plateau.php?idPartie=' + idPartieRejointe;
        } else {
            console.error('Erreur: Identifiant de partie non valide.');
        }
    })
    .catch(error => {
        console.error(error);
    });
}

// --

chargerParties(); // Charger les parties au chargement de la page

var btnChargerParties = document.getElementById('btnChargerParties');
btnChargerParties.addEventListener('click', chargerParties);
var btnCreerPartie = document.getElementById('btnCreerPartie');
btnCreerPartie.addEventListener('click', ajouterPartie);
