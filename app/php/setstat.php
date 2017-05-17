<?php 
include "mdp.php";

$speudo =  $_POST["login"];
$champs =  $_POST["champs"];
$value =  $_POST["value"];

error_reporting(E_ALL);

try
{
	$connexion =  new PDO($source, $user, $motDePasse);
	$requete = "UPDATE `sokoban` SET `".$champs."`='".$value."' WHERE `pseudo` = '".$speudo."'";
	$resultat = $connexion->query($requete);
	foreach ($resultat as $ligne) {
		echo ($ligne).'<br />';
	}
}

catch (PDOExecption $e)
{
	print 'Erreur PDO : ' .$e->getMessage().'<br />';
	die();
}

?>