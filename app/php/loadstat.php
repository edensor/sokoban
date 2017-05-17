<?php
	include "mdp.php";

	$speudo =  $_POST["sentData"];

	$stat = ["level" => [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
			,"numRestart" => 0];

	//error_reporting(E_ALL);
	$result = ["level" => [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
			,"numRestart" => 0];

	$flag = false;

	try
	{
		$connexion =  new PDO($source, $user, $motDePasse);
		$requete = "SELECT * FROM `sokoban` WHERE `pseudo` = '".$speudo."'";
		$resultat = $connexion->query($requete);
		foreach ($resultat as $ligne) {
			$flag = true;
			$lLength = count($ligne);
			for ($i=0; $i <$lLength ; $i++) {
				if ($i>0 && $i<16) {
					$result["level"][$i-1]  = intval($ligne["".$i]);
				}
			}
			$result["numRestart"] = $ligne["replay"];
		}
	}
	catch (PDOExecption $e)
	{
		json_encode( 'Erreur PDO ');
		die();
	}
	
	if (!$flag) {
		$result = $stat;
		$requete = "INSERT INTO `sokoban`( `pseudo`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`, `13`, `14`, `15`, `replay`) VALUES ('".$speudo."',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)";
		$resultat = $connexion->query($requete);
	}

    echo json_encode($result);
?>