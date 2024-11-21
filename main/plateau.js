var cases = document.getElementsByClassName("case");
var cree = [];
var indice = 0;
var divs = [];
var path ="";

const urlParams = new URLSearchParams(window.location.search);
const idPartie = urlParams.get('idPartie');
console.log(idPartie);
for (var i = 0; i < cases.length; i++) {
    cases[i].addEventListener("click", clickHandler);
    cree[i] = 0;
    divs[i] = undefined;
}

const nomUser = document.getElementById("nomUser").innerHTML;


refreshPlayerData(); // pour afficher les stats des joueurs lorsque la page se charge
afficherBoutonControlesJeu(); // pour afficher : le bouton démarrer/Les dés/etc. lorsque la page se charge
placepions(); // pour afficher les pions lorsque la page se charge
recupererMeublesPartie(idPartie);

// Dans un intervalle de 5s voir 10s on raffraichit différents choses sur la page
// pour que l'utilisateur vois toujours les dernières informations.
const intervalId1 = setInterval(function(){
    refreshPlayerData();
    afficherBoutonControlesJeu();
    placepions();
},5000)
const intervalId2 = setInterval(function(){
    console.log("idpartie=",idPartie);
    recupererMeublesPartie(idPartie);
},10000)


function clickHandler(event) {
    var caseIndex = Array.from(cases).indexOf(event.currentTarget);
    console.log(caseIndex);
    img = cases[caseIndex].getElementsByTagName("img");
    path = img.item(0).src;
    alt = img.item(0).alt;
    // Désactiver les gestionnaires d'événements pour tous les autres éléments
    for (var j = 0; j < cases.length; j++) {
        if (cases[j] !== event.currentTarget) {
            cases[j].removeEventListener("click", clickHandler);
        } else {
            indice = caseIndex;
        }
    }

    // Créer et ajouter le div contenant les informations
    if (cree[indice] === 0) {
        cree[indice] = 1;
        var containerDiv = document.createElement("div");
        divs[indice] = containerDiv;
        containerDiv.classList.add("container_infos", "absolute-position");

        var image = document.createElement("img");
        image.classList.add("image_infos");
        image.src = path;
        image.alt = alt;

        var paragraph = document.createElement("p");
        paragraph.classList.add("text_infos");
        afficher_description(paragraph, image.alt);


        var button = document.createElement("button");
        button.classList.add("bouton_infos");
        button.textContent = "Fermer";
        button.addEventListener("click", function(){
            containerDiv.style.visibility = "hidden";
            console.log("bouton");
            for (var i = 0; i < cases.length; i++) {
                cases[i].addEventListener("click", clickHandler);
            }
        });

        containerDiv.appendChild(image);
        containerDiv.appendChild(paragraph);
        containerDiv.appendChild(button);

        document.body.appendChild(containerDiv);
    } else {
        divs[indice].style.visibility = "visible";
    }
}

async function afficher_description(paragraph, nom){
    let promise = fetch(
        "serveur/description_case.php",
        {
            method: 'POST',
            headers: {'Content-Type':'application/json;charset=utf-8'},
            body: JSON.stringify({"nom": nom})
        }
    );
    let response = await promise;
    
    if (response.ok) {
        var rep = await response.json();
        // Ce qui sera fait si tout se passe bien
        console.log(rep.description);
        paragraph.textContent = rep.description;
    } else {
        paragraph.textContent = "Erreur lors de l'envoi au Serveur.";
    }
}

function refreshPlayerData(){
    // Effectuer une requête AJAX vers le script PHP pour récupérer les données de la table déroulement pour une partie spécifique
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Traitement de la réponse du serveur
            // console.log(this.responseText);
            var response = JSON.parse(this.responseText); // Convertir la réponse JSON en objet JavaScript
            var pseudos = ""; // Variable pour stocker les pseudos
            var argents = ""; // Variable pour stocker les montants d'argent

            // Boucle à travers les données pour les formater
            for (var i = 0; i < response.length; i++) {
                var data = response[i].split(" - "); // Diviser la chaîne en pseudo et argent
                var joueurId = "joueur" + (i + 1); // Créer l'ID joueurindice
                pseudos += "<td id='" + joueurId + "'>" + data[0] + "</td>"; // Ajouter le pseudo avec l'ID joueurindice
                argents += "<td>" + data[1] + " $</td>"; // Ajouter le montant d'argent
            }

            // Ajouter l'en-tête avec les indices au-dessus des pseudos
            var indices = ""; // En-tête vide pour l'alignement
            for (var j = 0; j < response.length; j++) {
                var data2=  response[j].split(" - ");
                if (data2[2] == "true") {
                    indices += "<th><span style='color:green'>joueur " + (j + 1) + "</span></th>"; // Ajouter l'indice du joueur avec couleur verte
                } else {
                    indices += "<th><span style='color:red'>joueur  " + (j + 1) + "</span></th>"; // Ajouter l'indice du joueur avec couleur rouge
                }
                if (data2[3] != 0) {
                    document.getElementById("bouton_maison"+(j+1)).style.visibility = "visible";
                    console.log("joueur"+(j+1)+" a une maison");
                }
                else {
                    console.log("joueur"+(j+1)+" n'a pas de maison");
                }
            
            }

            
            // Construire le tableau avec les pseudos sur la première ligne et les montants d'argent sur la deuxième ligne
            var formattedData = "<table><tr>" + indices + "</tr><tr>" + pseudos + "</tr><tr>" + argents + "</tr></table>";

            // Mettre à jour le contenu du div avec les données formatées
            document.getElementById("pseudo").innerHTML = formattedData;
        }
    };
    xhttp.open("GET", "serveur/parties.php?action=getPseudosAndMoneyForPartie&id_partie=" + idPartie, true);
    xhttp.send();
}


function demarrerPartie(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var responseData = JSON.parse(xhr.responseText);
                if (responseData === true){
                    console.log("la partie commence");
                    var div = document.getElementById("controles_jeu");
                    div.innerHTML = "";
                    afficherBoutonControlesJeu();
                    refreshPlayerData();
                } else if (responseData === false){
                    console.error("Erreur, la partie n'a pas pu démarrer.");
                } else {
                    console.error("Réponse JSON mal formée.");
                }
            } else {
                console.error("Erreur lors de la requête : " + xhr.status);
            }
        }
    }
    xhr.open("GET", "serveur/controles_jeu.php?action=demarrer&idPartie="+idPartie, true);
    xhr.send();
}

function lancerDes(){
    const diceImages = ["de1.png","de2.png","de3.png","de4.png","de5.png","de6.png"];
    const imageElement = document.getElementById("dés");
    imageElement.removeEventListener("click", lancerDes);
    imageElement.style.cursor = "default";

    let currentImageIndex = 0;
    const intervalId = setInterval(() => {
        imageElement.src = "images_des/" + diceImages[currentImageIndex];
        currentImageIndex++;
        playAudio_dés();
        if (currentImageIndex === diceImages.length) {
            currentImageIndex = 0;
        }
    }, 100);
    function getRandomNumber() {
        return Math.floor(Math.random() * 6) + 1;
    }
    const randomNumber = getRandomNumber();

    setTimeout(() => {
        clearInterval(intervalId);
        imageElement.src = "images_des/" + diceImages[randomNumber - 1];
        // imageElement.addEventListener("click", lancerDes);
        console.log("Résultat du dés : "+randomNumber);
        var div = document.getElementById("controles_jeu");
        var p = document.createElement("p");
        p.innerHTML = randomNumber;
        div.appendChild(p);
        recupere_position(idPartie)
        .then(function(ap){
            if (randomNumber + ap  > 36) {
                maj_position("set",ap + randomNumber - 36,false,ap);
            }
            else{
                maj_position("add", randomNumber,false,ap);
            }
        placepions();
        });
        //prochainTour();
        var p_btn = document.createElement("p");
        var bouton = document.createElement("button");
        bouton.className = "bouton";
        bouton.id = "finir_tour";
        bouton.textContent = "Finir le tour";
        bouton.addEventListener("click", prochainTour);
        bouton.addEventListener("click", function(){
            bouton.disabled = true;
        });
        p_btn.appendChild(bouton);
        div.appendChild(p_btn);
    }, 3000);
    
}

function prochainTour(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var responseData = JSON.parse(xhr.responseText);
                if (responseData === true) {
                    console.log("le joueur suivant peut jouer!");
                    cacherToutesLesBoutiques();

                    afficherBoutonControlesJeu();
                    refreshPlayerData();
                } else if (responseData === false) {
                    console.error("Erreur, on n'a pas pu passer au prochain tour.");
                } else {
                    console.error("Réponse JSON mal formée.");
                }
            } else {
                console.error("Erreur lors de la requête : " + xhr.status);
            }
        }
    };
    xhr.open("GET", "serveur/prochain_tour.php?action=prochain&idPartie="+idPartie, true);
    xhr.send();
}

function afficherBoutonControlesJeu(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var responseData = JSON.parse(xhr.responseText);
                if (responseData && responseData.etat) {
                    console.log(responseData);
                    var div = document.getElementById("controles_jeu");
                    var message = document.getElementById("message_jeu");
                    
                    if (responseData.etat == "en_attente"){
                        if (responseData.joueur1 == nomUser){
                            div.innerHTML = "";
                            var btn = document.createElement("button");
                            btn.className = "bouton";
                            btn.textContent = "Démarrer la partie";
                            btn.onclick = demarrerPartie;
                            div.appendChild(btn);
                        } else {
                            div.innerHTML = "";
                            message.innerHTML = "En attente que le joueur 1 démarre la partie.";
                        }
                    } else if (responseData.etat == "en_cours"){
                        if (responseData.joueur == nomUser){
                            message.innerHTML = "";
                            if (div.innerHTML === ""){
                                var p = document.createElement("p");
                                p.id = "lancer_des";
                                p.innerHTML = "Lancer les dés:";
                                div.appendChild(p);
                                var des = document.createElement("img");
                                des.id = "dés";
                                des.src = "images_des/de1.png";
                                des.alt = "dé";
                                des.addEventListener("click", lancerDes);
                                div.appendChild(des);
                            }
                        } else {
                            div.innerHTML = "";
                            message.innerHTML = "C'est le tour de " + responseData.joueur;
                        }
                    }
                } else {
                    console.error("Réponse JSON mal formée.");
                }
            } else {
                console.error("Erreur lors de la requête : " + xhr.status);
            }
        }
    };
    xhr.open("GET", "serveur/controles_jeu.php?action=bouton&idPartie="+idPartie, true);
    xhr.send();
}


function placepions() {
    var positions;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var responseData = JSON.parse(xhr.responseText);
                if (responseData && responseData.positions) {
                    // Récupérer les positions et les parcourir
                    positions = responseData.positions;
                    positions.forEach(function(positionObj) {
                        // Appeler la fonction pour placer les pions pour chaque pions
                        placerPionSurPosition(positionObj.position, positionObj.rang);
                    });
                } else {
                    console.error("Réponse JSON mal formée ou aucune position trouvée.");
                }
            } else {
                console.error("Erreur lors de la requête AJAX : " + xhr.status);
            }
        }
    };
    xhr.open("GET", "serveur/parties.php?action=position&id_partie="+idPartie, true);
    xhr.send();

    // Fonction pour placer un pion sur une position donnée
    function placerPionSurPosition(position, rang) {
        // Noms des images
        var nomsImages = ["Bleu2.png", "Jaune2.png", "Rouge2.png", "Vert2.png"];
    
        var caseId = "case" + position;
        var caseDiv = document.getElementById(caseId);
    
        // Supprimer le pion précédent s'il existe dans sa position actuelle
        var pionPrecedent = document.getElementById("pion" + rang);
        if (pionPrecedent) {
            pionPrecedent.parentNode.removeChild(pionPrecedent);
        }
    
        // Chemin vers les images
        var cheminImages = "images_jeu/pions/";
    
        // Image qui correspond au pion
        var nomImage = nomsImages[rang - 1];
    
        // Créer l'élément img pour le pion
        var img = document.createElement("img");
        img.src = cheminImages + nomImage;
        img.id = "pion" + rang;
        img.alt = "Image " + rang;
    
        // Ajout l'image 
        caseDiv.appendChild(img);
    }
}


function argent(montant) {
    // Création de l'objet XMLHttpRequest
    var xhr = new XMLHttpRequest();
    
    // Définition de l'URL du script PHP
    var url = "serveur/déroulement.php";
    console.log(montant,idPartie);
    // Création des données à envoyer
    var donnees = "montant=" + encodeURIComponent(montant) + "&idPartie=" + encodeURIComponent(idPartie);
    
    // Configuration de la requête
    xhr.open("POST", url, true);
    
    // Définition de l'en-tête HTTP pour spécifier le type de contenu
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    // Gestionnaire d'événement de fin de requête
    xhr.onreadystatechange = function() {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            // Réponse reçue du serveur
            console.log(xhr.responseText);
            playAudio_valide();
        }
    }
    
    // Envoi de la requête avec les données
    xhr.send(donnees);
}



var meubles = ["pingpong", "velo", "machine_a_laver", "cuisine", "canape", "table", "wc", "baignoire", "lit", "radio", "tv"];






function afficher(i, rang, etat) {
    var maison = "interface_maison_" + rang; // Construire l'ID de la maison en fonction du rang du joueur
    var idMeuble = meubles[i]; // Récupérer l'ID du meuble à partir de l'indice i
    console.log("aficher",meubles[i]);
    idMeuble += rang;
    console.log(maison,idMeuble);
    // Récupérer le div de la maison du joueur
    var divInterfaceMaison = document.getElementById(maison);
    var elementMeuble = document.getElementById(idMeuble); // Récupérer l'élément correspondant
    console.log(elementMeuble);
    console.log(divInterfaceMaison.contains(elementMeuble));
    // Vérifier si l'élément meuble existe et s'il appartient au div de la maison du joueur
    if (elementMeuble && divInterfaceMaison.contains(elementMeuble)) {
        console.log(etat=== 'true')
        console.log(etat);
        if (etat === 'true') { // Si l'état du meuble est true
            elementMeuble.style.zIndex = 3; // Modifier le z-index de l'élément à 3
            elementMeuble.style.visibility = 'visible'; // Rendre l'élément visible
            console.log("L'élément avec l'indice " + i + " a été ajouté à la maison " + maison + ".");
        } else { // Si l'état du meuble est false
            elementMeuble.style.zIndex = 0; // Modifier le z-index de l'élément à 0 (pour le cacher)
            elementMeuble.style.visibility = 'hidden'; // Rendre l'élément invisible
            console.log("L'élément avec l'indice " + i + " a été retiré de la maison " + maison + ".");
        }
    } else {
        console.log("L'élément avec l'indice " + i + " n'existe pas ou n'appartient pas au div de la maison.");
    }
}



var boutonsMaison = [];

// Générer les interfaces pour chaque joueur
for (var numero = 1; numero <= 4; numero++) {
    genererInterfaceMaison(numero);
}

// Fonction pour générer l'interface de la maison pour un joueur donné
function genererInterfaceMaison(numero) {
    // Création des éléments HTML pour la maison du joueur
    div_bout = document.getElementById("maisons_boutons");
    div_mais = document.getElementById("maisons");
    const divInterfaceMaison = document.createElement('div');
    divInterfaceMaison.className = 'interface_maison'; // Utilisation d'une classe pour cibler toutes les maisons
    divInterfaceMaison.id = 'interface_maison_' + numero; // Utilisation de l'ID du joueur pour identifier la maison
    divInterfaceMaison.style.display = 'none'; // Cacher la maison initialement

    // Création des images pour la maison
    const imgMaison = creerElementImage('maison'+numero, 'images_jeu/maison/maison_a_meubler_vide.png', 'maison', 'maison');
    const imgBaignoire = creerElementImage('baignoire'+numero, 'images_jeu/maison/baignoire.png', 'baignoire','meubles');
    const imgCanape = creerElementImage('canape'+numero, 'images_jeu/maison/canape.png', 'canape', 'meubles');
    const imgCuisine = creerElementImage('cuisine'+numero, 'images_jeu/maison/cuisine.png', 'cuisine', 'meubles');
    const imgLit = creerElementImage('lit'+numero, 'images_jeu/maison/lit.png', 'lit', 'meubles');
    const imgMachineALaver = creerElementImage('machine_a_laver'+numero, 'images_jeu/maison/machine-a-laver.png', 'machine_a_laver', 'meubles');
    const imgPingPong = creerElementImage('pingpong'+numero, 'images_jeu/maison/ping_pong.png', 'pingpong','meubles');
    const imgRadio = creerElementImage('radio'+numero, 'images_jeu/maison/radio.png', 'radio','meubles');
    const imgTable = creerElementImage('table'+numero, 'images_jeu/maison/table.png', 'table','meubles');
    const imgTv = creerElementImage('tv'+numero, 'images_jeu/maison/tv.png', 'tv','meubles');
    const imgVelo = creerElementImage('velo'+numero, 'images_jeu/maison/velo.png', 'velo','meubles');
    const imgWc = creerElementImage('wc'+numero, 'images_jeu/maison/wc.png', 'wc','meubles');

    // Fonction pour créer les éléments img
    function creerElementImage(id, src, alt, classe) {
        const img = document.createElement('img');
        img.id = id;
        img.className = classe;
        img.src = src;
        img.alt = alt;
        return img;
    }

    // Ajout des images à la maison
    divInterfaceMaison.appendChild(imgMaison);
    divInterfaceMaison.appendChild(imgBaignoire);
    divInterfaceMaison.appendChild(imgCanape);
    divInterfaceMaison.appendChild(imgCuisine);
    divInterfaceMaison.appendChild(imgLit);
    divInterfaceMaison.appendChild(imgMachineALaver);
    divInterfaceMaison.appendChild(imgPingPong);
    divInterfaceMaison.appendChild(imgRadio);
    divInterfaceMaison.appendChild(imgTable);
    divInterfaceMaison.appendChild(imgTv);
    divInterfaceMaison.appendChild(imgVelo);
    divInterfaceMaison.appendChild(imgWc);

    // Création du bouton pour afficher/cacher la maison
    const boutonAfficher = document.createElement('button');
    boutonAfficher.className = 'bouton';
    boutonAfficher.id = 'bouton_maison' + numero;
    boutonAfficher.textContent = 'Afficher/Cacher Maison du joueur ' + numero;

    // Fonction pour afficher/cacher la maison
    boutonAfficher.addEventListener("click", function() {
        var maisonId = 'interface_maison_' + numero;
        var maison = document.getElementById(maisonId);
        
        // Si la maison est affichée, la cacher et activer tous les autres boutons
        if (maison.style.display === 'block') {
            maison.style.display = 'none';
            activerTousLesBoutons();
        } else { // Si la maison est cachée, la montrer et désactiver les autres boutons
            maison.style.display = 'block';
            desactiverAutresBoutons(boutonAfficher);
        }
    });

    // Ajout du bouton à la liste des boutons
    boutonsMaison.push(boutonAfficher);

    // Ajout du bouton à la page
    div_bout.appendChild(boutonAfficher);
    div_mais.appendChild(divInterfaceMaison);
}

// Fonction pour désactiver tous les boutons sauf celui fourni en argument
function desactiverAutresBoutons(boutonActif) {
    boutonsMaison.forEach(function(bouton) {
        if (bouton !== boutonActif) {
            bouton.disabled = true;
        }
    });
}

// Fonction pour activer tous les boutons
function activerTousLesBoutons() {
    boutonsMaison.forEach(function(bouton) {
        bouton.disabled = false;
    });
}


function maj_position(mode, pos, retour,ap) {
    // si mode === "add" : on incémente la position du joueur de pos
    // si mode === "set" : on met le joueur a la position pos

    // Création d'un objet FormData
    var formData = new FormData();
    formData.append('pos', pos);
    formData.append('mode', mode);
    formData.append("idPartie", idPartie);

    // Envoi des données à la page PHP via AJAX
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'serveur/maj_position.php', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            if (mode === "add") {
                if (ap+pos >36){
                    pos = ap + pos - 36;
                    traitant_case(ap + pos,retour,ap);
                }
                else{
                    traitant_case(ap + pos,retour,ap);
                }
            
            }
            else{
                traitant_case(pos,retour,ap);
            }
        }
    };
    xhr.send(formData);
}

function cacherBoutique(boutiqueCounter,toute) {
    // Construit l'ID de la boutique
    var boutiqueId = 'boutique_' + boutiqueCounter;
    
    // Sélectionne la boutique par son ID
    var boutique = document.getElementById(boutiqueId);
    
    // Vérifie si la boutique existe
    if (boutique) {
        // Récupère tous les boutons de classe "bouton_produit" dans la boutique
        var boutonsProduit = boutique.getElementsByClassName('bouton_produit'+boutiqueCounter);
        
        // Parcourt tous les boutons de produit et modifie leur couleur de fond
        if (!toute){
            for (var i = 0; i < boutonsProduit.length; i++) {
                // boutonsProduit[i].enabled = true;
                if (!boutonsProduit[i].disabled) {
                    boutonsProduit[i].style.backgroundColor = 'rgb(255, 226, 48)';
                }
            }
        }
        // Cache la boutique
        boutique.style.display = 'none';
    }
}

function cacherToutesLesBoutiques() {
    var nombreDeBoutiques = 18; 
    

    for (var i = 1; i <= nombreDeBoutiques; i++) {
        cacherBoutique(i,true);
    }
}

function achat (produit,prix,bouton){
    recuperer_argent(idPartie).then(function(money){
        console.log("argent=",money.argent);
        if (money.argent >= prix) {
            if (produit.startsWith("maison")) {
                bouton.disabled = true;
                var chiffre = produit.match(/maison(\d+)/);
                if (chiffre[1]) {
                    var numeroMaison = chiffre[1];
                    argent(-prix);
                    maison(chiffre[1],idPartie);
                    cacherToutesLesBoutiques();
                    console.log("Produit de type maison acheté pour " + prix + " $, maison numéro " + numeroMaison);
                } else {
                    console.log("Produit de type maison acheté pour " + prix + " $");
                }
            }
            else if (produit.startsWith("assurance")){
                bouton.disabled = true;
                produit = "assurance";
                ajout_meuble(produit,idPartie);
                argent(-prix);
            }
            else if (produit.startsWith("gare")){
                console.log(produit);
                if (produit.startsWith("gare1")) {
                    recupere_position(idPartie)
                .then(function(ap){
                    maj_position("set",8,true,ap);});
                    cacherToutesLesBoutiques();
                    argent(-prix);
                    playAudio_train();
                    placepions();
                }
                else if (produit.startsWith("gare2")) {
                    recupere_position(idPartie)
                .then(function(ap){
                    maj_position("set",19,true,ap);});
                    cacherToutesLesBoutiques();
                    argent(-prix);
                    playAudio_train();
                    placepions();
                }
                else{
                    recupere_position(idPartie)
                .then(function(ap){
                    maj_position("set",31,true,ap);});
                    cacherToutesLesBoutiques();
                    argent(-prix);
                    playAudio_train();
                    placepions();
                }

            }
            else {
                bouton.disabled = true;
                ajout_meuble(produit,idPartie);
                argent(-prix);

            }
        } else {
            playAudio_invalide();
            bouton.style.backgroundColor = "red";
        }
            
    });

}

function desactiverBoutons(classe) {
    console.log(classe);
    console.log("desactiver");
    var boutons = document.getElementsByClassName(classe);
    console.log(boutons);
    for (var i = 0; i < boutons.length; i++) {
        boutons[i].disabled = true;
    }
}
function activerBoutons(classe) {
    console.log(classe);
    console.log("desactiver");
    var boutons = document.getElementsByClassName(classe);
    console.log(boutons);
    for (var i = 0; i < boutons.length; i++) {
        boutons[i].disabled = false;
    }
}

function maison(numero,idPartie) {
    // Création de l'objet XMLHttpRequest
    
    var xhr = new XMLHttpRequest();
    
    // Définition de l'URL du script PHP
    var url = "serveur/achats.php";
    console.log(numero,idPartie);
    // Création des données à envoyer
    var donnees = "numero=" + encodeURIComponent(numero) + "&idPartie=" + encodeURIComponent(idPartie);
    
    // Configuration de la requête
    xhr.open("POST",url, true);
    
    // Définition de l'en-tête HTTP pour spécifier le type de contenu
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    // Gestionnaire d'événement de fin de requête
    xhr.onreadystatechange = function() {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            // Réponse reçue du serveur
            console.log(xhr.responseText);
        }
    }
    
    // Envoi de la requête avec les données
    xhr.send(donnees);
}

/* ajouter(0, 1);
ajouter(1, 1);
ajouter(2, 1);
ajouter(3, 1);
ajouter(4, 1);
ajouter(5, 1);
ajouter(6, 1);
ajouter(7, 1);
ajouter(8, 1);
ajouter(9, 1);
ajouter(10, 1); 

ajouter(4,2);
ajouter(5,2);
ajouter(10,4); */



function ajout_meuble(meuble,idPartie) {
    // Création de l'objet XMLHttpRequest
    var xhr = new XMLHttpRequest();
    
    // Définition de l'URL du script PHP
    var url = "serveur/achats.php";
    console.log(meuble,idPartie);
    // Création des données à envoyer
    var donnees = "meuble=" + encodeURIComponent(meuble) + "&idPartie=" + encodeURIComponent(idPartie);
    
    // Configuration de la requête
    xhr.open("POST",url, true);
    
    // Définition de l'en-tête HTTP pour spécifier le type de contenu
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    // Gestionnaire d'événement de fin de requête
    xhr.onreadystatechange = function() {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            // Réponse reçue du serveur
            console.log(xhr.responseText);
        }
    }
    
    // Envoi de la requête avec les données
    xhr.send(donnees);
}





function recupererMeublesPartie(idPartie) {
    // Création de l'objet XMLHttpRequest
    var xhr = new XMLHttpRequest();
    
    // Définition de l'URL du script PHP
    var url = "serveur/verifier_meubles.php";

    // Création des données à envoyer
    var donnees = "idPartie=" + encodeURIComponent(idPartie);
    
    // Configuration de la requête
    xhr.open("POST", url, true);
    
    // Définition de l'en-tête HTTP pour spécifier le type de contenu
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    // Gestionnaire d'événement de fin de requête
    xhr.onreadystatechange = function() {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            // Réponse reçue du serveur
            var reponse = JSON.parse(xhr.responseText);
            if (reponse.success) {
                // Traitement des données reçues
                var winner = Array();
                var joueurs = reponse.joueurs;
                joueurs.forEach(function(joueur) {
                    winner.push([joueur.joueur_nom, true]);
                    console.log("Joueur : " + joueur.rang);
                    if (joueur.maison === '0'){ // si il ne possède pas de maison, il ne peut pas gagner.
                        winner[winner.length-1][1] = false
                    }
                    console.log(joueur.meubles);
                    console.log("Meubles :");
                    for (var [meuble, valeur] of Object.entries(joueur.meubles)) {
                        console.log(meuble + " : " + valeur);
                        // Appeler la fonction afficher pour chaque meuble
                        console.log("meubleeeeeeeee:", meuble, "valeur=", valeur);
                        if (meuble == "ping_pong"){
                            meuble = "pingpong";
                            console.log(meuble);
                        }
                        if (valeur === "false"){
                            winner[winner.length-1][1] = false
                        }
                        afficher(meubles.indexOf(meuble), joueur.rang, valeur);
                    }
                    console.log("---------------");
                    
                    
                });
                console.log("WINNER ??? ", winner);
                winner.forEach(function (elt){
                    if (elt[1]===true){
                        win(elt[0]);
                    }
                });
            } else {
                console.error("Erreur : " + reponse.message);
            }
        }
    }
    
    // Envoi de la requête avec les données
    xhr.send(donnees);
}

function win(nom){
    clearInterval(intervalId1);
    clearInterval(intervalId2);
    setTimeout(function(){
        var page = document.getElementsByTagName("body")[0];
        page.innerHTML = "";
        var div = document.createElement("div");
        div.id = "winner";
        var p = document.createElement("p");
        var img = document.createElement("img");
        var btn = document.createElement("button");
        btn.className = "bouton";
        btn.textContent = "Quitter";
        btn.addEventListener("click", supprimerPartie);
        if (nom === nomUser){
            img.src = "images/win.gif";
            img.alt = "image_win";
            p.innerHTML = "Vous avez gagné !!";
        } else {
            img.src = "images/game_over.png";
            img.alt = "image_game_over";
            p.innerHTML = "Vous avez perdu.<br>"+nom+" a gagné la partie.";
        }
        div.appendChild(img);
        div.appendChild(p);
        div.appendChild(btn);
        page.appendChild(div);
    }, 500);
}

function supprimerPartie(){
    fetch(
        "serveur/supprimer_partie.php",
        {
            method: 'POST',
            headers: {'Content-Type':'application/json;charset=utf-8'},
            body: JSON.stringify({"idPartie": idPartie})
        }
    )
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la requête AJAX : ' + response.status);
        }
        return response.text();
    })
    .then(data => {
        console.log("data===",data); // Affiche la réponse dans la console
        if (data === "true") {
            window.location.href = 'index.php';
        } else {
            console.error('Erreur lors de la suppression de la partie');
        }
    })
    .catch(error => {
        console.error(error);
    });
}

function ouvrirBoutique(numero){
    recupererMeublesjoueur(idPartie);
    var boutique = document.getElementById("boutique_" + numero);
    if (boutique.style.display === "none") {
        boutique.style.display = "block";
    } else {
        boutique.style.display = "none";
    }
}
// maj_position(8);
// ouvrirBoutique(5);

// -----

function creerCarte(idPartie) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'serveur/mystere.php', true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var carte = JSON.parse(xhr.responseText);
            afficherCarte(carte,idPartie);
        }
    };

    xhr.send();
}

function afficherCarte(carte,idPartie) {
    var carteDiv = document.createElement('div');
    carteDiv.className = 'carte_mystere';
    carteDiv.innerHTML = '<h3>Carte Mystère</h3><p>Carte numéro ' + carte.indice + '</p><p>' + carte.description + '</p><br><button class="bouton" onclick=supprimerCarte()>Fermer</button>';

    document.body.appendChild(carteDiv);
    traiter_carte(carte.indice,idPartie);
}

function supprimerCarte() {
    var carteDiv = event.target.parentNode;
    var conteneurCartes = document.getElementById('carte_mystere');
    document.body.removeChild(carteDiv);
}


//maj_position(6);

//creerCarte(idPartie);


function traiter_carte(indice, idPartie) {
    recuperer_argent(idPartie).then(function(money){
        if (indice == 1) {
            argent(1000);
        } else if (indice == 2) {
            feu_assurance(idPartie);
        } else if (indice == 3) {
            if (money.argent < 300) {
                argent(-money.argent);
            }
            else {
                argent(-300);
            }
        } else if (indice == 4) {
            argent(300);
        } else if (indice == 5) {
            recupere_position(idPartie)
            .then(function(ap){
            maj_position("set",1,false,ap);});
        } else if (indice == 6) {
            if (money.argent < 300) {
                argent(-money.argent);
            }
            else {
            argent(-300);
            }
        } else if (indice == 7 ){
            recupere_position(idPartie)
            .then(function(ap){
                if (ap + 3 > 36) {
                    maj_position("set", ap + 3 -36 ,true,ap);
                }
                else {
                    maj_position("set", ap + 3,true,ap);

                }
            maj_position("set", ap + 3,true,ap);});
        }
        else if (indice == 8) {
            recupere_position(idPartie)
            .then(function(ap){
                if (ap - 3 < 3) {
                    maj_position("set", 36 + ap - 3,true,ap);
                }
                else{
                    maj_position("set",ap - 3,true,ap);
                }
            });
        }
        else if (indice == 9) {
            rejouer();
        }
        refreshPlayerData();
    });
}


function recupere_position(idPartie) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'serveur/envoie_position.php?id=' + idPartie, true);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var position = JSON.parse(xhr.responseText);
                    resolve(position);
                } else {
                    reject(xhr.statusText);
                }
            }
        };

        xhr.send();
    });
}

function feu_assurance(idPartie) {
    var xhr = new XMLHttpRequest();
    var url = "serveur/déroulement.php";
    action = "feu_assurance";
    var params = "action=" + action + "&idPartie=" + idPartie;
    
    xhr.open("POST", url, true);
    
    // Set the content type header information for the POST request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
        }
    }
    
    // Send the POST request
    xhr.send(params);
}



function traitant_case(numero,retour,ap) {
    if (numero < ap && retour == false && numero >1) {
        argent(1000);
    }
    console.log("Traitement de la case " + numero);
    if (retour == false) {
        switch (numero) {
            case 1:
                console.log("Action pour le numéro 1");
                argent(2000);
                break;
            case 2:
                console.log("Action pour le numéro 2");
                ouvrirBoutique(1);
                break;
            case 3:
                console.log("Action pour le numéro 3");
                recuperer_argent(idPartie).then(function(money){
                    if (money.argent < 500) {
                        argent(-money.argent);
                    }
                    else {
                        argent(-500);
                    }
                });
                break;
            case 4:
                console.log("Action pour le numéro 4");
                ouvrirBoutique(2);
                break;
            case 5:
                console.log("Action pour le numéro 5");

                break;
            case 6:
                console.log("Action pour le numéro 6");
                creerCarte(idPartie);
                break;
            case 7:
                console.log("Action pour le numéro 7");
                ouvrirBoutique(3);
                break;
            case 8:
                console.log("Action pour le numéro 8");
                ouvrirBoutique(4);
                break;
            case 9:
                console.log("Action pour le numéro 9");
                afficherCasino();
                break;
            case 10:
                console.log("Action pour le numéro 10");
                creerCarte(idPartie);
                break;
            case 11:
                console.log("Action pour le numéro 11");
                ouvrirBoutique(5);
                break;
            case 12:
                console.log("Action pour le numéro 12");
                ouvrirBoutique(6);
                break;
            case 13:
                console.log("Action pour le numéro 13");
                creerCarte(idPartie);
                break;
            case 14:
                console.log("Action pour le numéro 14");
                ouvrirBoutique(7);
                break;
            case 15:
                console.log("Action pour le numéro 15");
                ouvrirBoutique(8);
                break;
            case 16:
                console.log("Action pour le numéro 16");
                ouvrirBoutique(9);
                break;
            case 17:
                console.log("Action pour le numéro 17");
                rejouer();
                break;
            case 18:
                console.log("Action pour le numéro 18");
                break;
            case 19:
                console.log("Action pour le numéro 19");
                ouvrirBoutique(10);
                break;
            case 20:
                console.log("Action pour le numéro 20");
                creerCarte(idPartie);
                break;
            case 21:
                console.log("Action pour le numéro 21");
                ouvrirBoutique(11);
                break;
            case 22:
                console.log("Action pour le numéro 22");
                recuperer_argent(idPartie).then(function(money){
                    if (money.argent < 100) {
                        argent(-money.argent);
                    }
                    else {
                        argent(-100);
                    }
                });
                break;
            case 23:
                console.log("Action pour le numéro 23");
                ouvrirBoutique(12);
                break;
            case 24:
                console.log("Action pour le numéro 24");
                recuperer_argent(idPartie).then(function(money){
                    if (money.argent < 500) {
                        argent(-money.argent);
                    }
                    else {
                        argent(-500);
                    }
                });
                break;
            case 25:
                console.log("Action pour le numéro 25");
                creerCarte(idPartie);

                break;
            case 26:
                console.log("Action pour le numéro 26");
                ouvrirBoutique(13);
                break;
            case 27:
                console.log("Action pour le numéro 27");
                ouvrirBoutique(14);
                break;
            case 28:
                console.log("Action pour le numéro 28");
                argent(500);
                break;
            case 29:
                console.log("Action pour le numéro 29");
                creerCarte(idPartie);
                break;
            case 30:
                console.log("Action pour le numéro 30");
                ouvrirBoutique(15);
                break;
            case 31:
                console.log("Action pour le numéro 31");
                ouvrirBoutique(16);
                break;
            case 32:
                console.log("Action pour le numéro 32");
                creerCarte(idPartie);
                break;
            case 33:
                console.log("Action pour le numéro 33");
                maj_position("set",1,false,ap);
                break;
            case 34:
                console.log("Action pour le numéro 34");
                ouvrirBoutique(17);
                break;
            case 35:
                console.log("Action pour le numéro 35");
                ouvrirBoutique(18);
                break;
            case 36:
                console.log("Action pour le numéro 36");
                creerCarte(idPartie);
                break;
            default:
                console.log("Numéro invalide");
            }
    }
}


function recupererMeublesjoueur(idPartie) {
    // Création de l'objet XMLHttpRequest
    var xhr = new XMLHttpRequest();
    
    // Définition de l'URL du script PHP
    var url = "serveur/déroulement.php";
    
    // Création des données à envoyer
    var donnees = "action=recuperer" + "&idPartie=" + idPartie;
    
    // Configuration de la requête
    xhr.open("POST", url, true);
    
    // Définition de l'en-tête HTTP pour spécifier le type de contenu
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    // Gestionnaire d'événement de fin de requête
    xhr.onreadystatechange = function() {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            // Réponse reçue du serveur
            var reponse = JSON.parse(xhr.responseText);
            if (reponse.success) {
                // Traitement des données reçues
                var joueur = reponse.joueur;
                console.log("testttttttttttttt"+joueur);
            
                // Parcourir les maisons des joueurs et désactiver les boutons correspondants
                for (var index in joueur.maison_des_joueurs) {
                    console.log(joueur.maison);
                    var numero = joueur.maison_des_joueurs[index];
                    if (numero != "0") {
                        desactiverBoutons("bouton_maison"+numero);
                    }
                }
                if(joueur.assurance === "true"){
                    desactiverBoutons("bouton_assurance");
                }
                else{
                    activerBoutons("bouton_assurance");
                }
                if (joueur.maison != "0") {
                    console.log("le joueur a une maison");
                    desactiverBoutons("bouton_maison1");
                    desactiverBoutons("bouton_maison2");
                    desactiverBoutons("bouton_maison3");
                    desactiverBoutons("bouton_maison4");
                }

                for (var meuble in joueur.meubles) {
                    if (joueur.meubles.hasOwnProperty(meuble)) {
                        console.log(joueur.meubles[meuble]);
                        console.log("boucles meubles");
                        var etat = joueur.meubles[meuble];
                        if (etat === "true") {
                            if (meuble === "machine_a_laver"){
                                meuble = "machine-a-laver";
                            }
                            desactiverBoutons("bouton_"+meuble);
                        } else {
                            activerBoutons("bouton_"+meuble);
                        }
                    }
                } 
            } else {
                console.error("Erreur : donnés non recue ");
            }
        }
    }
    // Envoi de la requête avec les données
    xhr.send(donnees);
}

// ouvrirBoutique(14);
// creerCarte(idPartie);


function rejouer(){
    bouton = document.getElementById("finir_tour");
    bouton.remove();
    const imageElement = document.getElementById("dés");
    p = document.getElementById("lancer_des");
    p.innerHTML = "Relancer les dés:";
    imageElement.addEventListener("click", lancerDes);
    imageElement.style.cursor = "pointer";
}




function recuperer_argent(idPartie) {
    return new Promise(function(resolve, reject) {
        // Création de l'objet XMLHttpRequest
        var xhr = new XMLHttpRequest();
        
        // Définition de l'URL du script PHP
        var url = "serveur/déroulement.php";
        
        // Création des données à envoyer
        var donnees = "action=argent" + "&idPartie=" + idPartie;
        
        // Configuration de la requête
        xhr.open("POST", url, true);
        
        // Définition de l'en-tête HTTP pour spécifier le type de contenu
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        // Gestionnaire d'événement de fin de requête
        xhr.onreadystatechange = function() {
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                // Réponse reçue du serveur
                var reponse = JSON.parse(xhr.responseText);
                if (reponse.success) {
                    var argent = reponse.argent;
                    resolve(argent);
                } else {
                    console.error("Erreur : données non reçues ");
                    reject(new Error("Erreur : données non reçues"));
                }
            }
        }
        
        // Envoi de la requête avec les données
        xhr.send(donnees);
    });
}

function playAudio_dés() {
    var audio = new Audio('son/9085.mp3');
    audio.play();
}

function playAudio_train() {
    var audio = new Audio('son/tchoutchou.mp3');
    audio.play();
}

function playAudio_valide() {
    var audio = new Audio('son/valide.mp3');
    audio.play();
}

function playAudio_invalide() {
    var audio = new Audio('son/9759.mp3');
    audio.play();
}

function playAudio_gain(){
    var audio = new Audio('son/gain.wav');
    audio.play();
}

function playAudio_tourne(){
    var audio = new Audio('son/spin.wav');
    audio.play();
}

function playAudio_mise(){
    var audio = new Audio('son/mise.wav');
    audio.play();

}
function playAudio_perte(){
    var audio = new Audio('son/perte.mp3');
    audio.play();

}
function afficherCasino(){
    var casino = document.getElementById("casino");
    if (casino.style.display === "none") {
        casino.style.display = "block";
    } else {
        casino.style.display = "none";
    }
}

function jouerCasino(){
    playAudio_mise();
    const casinoImages = ["casino1.png","casino2.png","casino3.png","casino4.png","casino5.png","casino6.png","casino7.png","casino8.png"];
    var imageCasinoUn = document.getElementById("casino_jeu").getElementsByTagName("img")[0];
    var imageCasinoDeux = document.getElementById("casino_jeu").getElementsByTagName("img")[1];
    var imageCasinoTrois = document.getElementById("casino_jeu").getElementsByTagName("img")[2];
    const boutonJouer = document.getElementById("bouton_jouer_casino");
    boutonJouer.removeEventListener("click", jouerCasino);
    boutonJouer.disabled = true;

    let currentImageIndexUn = 0;
    const intervalIdUn = setInterval(() => {
        imageCasinoUn.src = "images_jeu/casino/" + casinoImages[currentImageIndexUn];
        currentImageIndexUn++;
        if (currentImageIndexUn === casinoImages.length) {
            currentImageIndexUn = 0;
        }
    }, 100);
    let currentImageIndexDeux = 1;
    const intervalIdDeux = setInterval(() => {
        imageCasinoDeux.src = "images_jeu/casino/" + casinoImages[currentImageIndexDeux];
        currentImageIndexDeux++;
        if (currentImageIndexDeux === casinoImages.length) {
            currentImageIndexDeux = 0;
        }
    }, 100);
    let currentImageIndexTrois = 2;
    const intervalIdTrois = setInterval(() => {
        imageCasinoTrois.src = "images_jeu/casino/" + casinoImages[currentImageIndexTrois];
        currentImageIndexTrois++;
        playAudio_tourne();
        if (currentImageIndexTrois === casinoImages.length) {
            currentImageIndexTrois = 0;
        }
    }, 100);

    function getRandomNumber() {
        return Math.floor(Math.random() * 8) + 1;
    }
    const randomNumberUn = getRandomNumber();
    const randomNumberDeux = getRandomNumber();
    const randomNumberTrois = getRandomNumber();

    setTimeout(() => {
        clearInterval(intervalIdUn);
        imageCasinoUn.src = "images_jeu/casino/" + casinoImages[randomNumberUn - 1];
    }, 3000);
    setTimeout(() => {
        clearInterval(intervalIdDeux);
        imageCasinoDeux.src = "images_jeu/casino/" + casinoImages[randomNumberDeux - 1];
    }, 3500);
    setTimeout(() => {
        clearInterval(intervalIdTrois);
        imageCasinoTrois.src = "images_jeu/casino/" + casinoImages[randomNumberTrois - 1];
        var p = document.getElementById("casino").getElementsByTagName("p")[0];
        if (imageCasinoUn.src === imageCasinoDeux.src && imageCasinoUn.src === imageCasinoTrois.src){
            playAudio_gain();
            p.textContent = "Vous avez gagné 2000 $";
            argent(2000);
        } else {
            playAudio_perte();
            p.textContent = "Vous avez perdu.";
        }
    }, 4000);
    
}

function cacherCasino(){
    var casino = document.getElementById("casino");
    if (casino) {        
        casino.style.display = 'none';
    }
}

