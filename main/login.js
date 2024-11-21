var boutonConnexion = document.getElementById("connexion");
var boutonCreer = document.getElementById("register");
var boutonFermer = document.getElementById("bouton_close_form").getElementsByTagName("button")[0];
boutonConnexion.addEventListener("click", login);
boutonCreer.addEventListener("click", register);
boutonFermer.addEventListener("click", fermer);

var formulairePresent = "";

function afficherFormulaire(titre){
    if (formulairePresent !== titre){
        document.getElementById("login_form").hidden = false;
        document.getElementById("form_title").innerHTML = titre;
        document.getElementById("login").value = "";
        document.getElementById("mdp").value = "";
        document.getElementById("message").innerHTML = "";
        formulairePresent = titre;
    }
}

function login(){
    afficherFormulaire("Connexion:");
}

function register(){
    afficherFormulaire("Créer un compte:");
}

function fermer(){
    document.getElementById("login_form").hidden = true;
    document.getElementById("form_title").innerHTML = "";
    document.getElementById("login").value = "";
    document.getElementById("mdp").value = "";
    document.getElementById("message").innerHTML = "";
    formulairePresent = "";
}

var formulaire = document.getElementById("form");
formulaire.addEventListener("submit", envoyerFormulaire);

async function envoyerFormulaire(event){
    event.preventDefault();
    var login = document.getElementById("login").value;
    var mdp = document.getElementById("mdp").value;
    var url = "";
    var typeFormulaire = document.getElementById("form_title").innerHTML;
    if (typeFormulaire === "Connexion:"){
        url = "serveur/connexion.php";
    } else if (typeFormulaire === "Créer un compte:"){
        url = "serveur/creercompte.php";
    }
    let promise = fetch(
        url,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({"login" : login, "mdp" : mdp})
        }
    );
    let response = await promise;
    if (response.ok){
        var rep = await response.json();
        // console.log(rep.message);
        document.getElementById("message").innerHTML = rep.message;
        if (rep.logged_in){
            window.location.replace("index.php"); // https://www.semrush.com/blog/javascript-redirect/
        }
    } else {
        document.getElementById("message").innerHTML = "Erreur lors de l'envoi au Serveur.";
    }
}


