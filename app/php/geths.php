<?php
	include "mdp.php";

	//error_reporting(E_ALL);

	$result = [];

	$flag = false;

	try
	{
		$connexion =  new PDO($source, $user, $motDePasse);
		$requete = "SELECT * FROM `sokoban` WHERE `1`!=0 AND `2`!=0 AND `3`!=0 AND `4`!=0 AND `5`!=0 AND `6`!=0 AND `7`!=0 AND `8`!=0 AND `9`!=0 AND `10`!=0 AND `11`!=0 AND `12`!=0 AND `13`!=0 AND `14`!=0 AND `15`!=0 ORDER BY `1`+`2`+`3`+`4`+`5`+`6`+`7`+`8`+`9`+`10`+`11`+`12`+`13`+`14`+`15` DESC LIMIT 10";
		$resultat = $connexion->query($requete);
		foreach ($resultat as $ligne) {
			$flag = true;
			$lLength = count($ligne);
			$lArray = ["level" => [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
			,"pseudo" => ''];
			for ($i=0; $i <$lLength ; $i++) {
				if ($i>0 && $i<16) {
					$lArray["level"][$i-1]  = intval($ligne["".$i]);
				}
			}
			$lArray["pseudo"] = $ligne["pseudo"];
			$result[] = $lArray;
		}
	}
	catch (PDOExecption $e)
	{
		json_encode( 'Erreur PDO ');
		die();
	}

    echo json_encode($result);
?>