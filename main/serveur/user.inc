<?php
global $file;
$file = file("users.csv");

function exist($login){
    $file = file("users.csv");
    foreach ($file as $f){
        $f = explode(";",$f);
        if ($f[0] == $login) {
            return true;
        }     
    }
    return false;
}

function loginOK($login,$mdp){
    $file = file("users.csv");
    foreach ($file as $f){
        $f = explode(";",$f);
        if ($f[0] == $login && $f[1] == $mdp) {
            return true;
        }
    } 
    return false;
}
   

?>