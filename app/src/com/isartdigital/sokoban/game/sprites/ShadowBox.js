//La Class Box extends Mobile
define(['jquery','sokoban/game/abstrait/Mobile','sokoban/game/sprites/Box'],function($,Mobile,Box){
	/**
	 * Classe qui gere les shadow boites movible du jeux.
	 * @author Marco Martella
	 */

	/**
	 * fonction Constructeur
	 * @x coordonné ou créer l'objet.
	 * @y coordonné ou créer l'objet.
	 */
	function ShadowBox(x,y){
		Box.call(this,"ShadowBox",x,y); // equivalent de super();
		this.juSpawn = true;
	}

	//tentative d'heritage

	function setMethode(){

	}

	ShadowBox.prototype =  Object.create(Box.prototype); //ici on recupère les methodes de Box.
	setMethode.call(ShadowBox.prototype);
	ShadowBox.prototype.Constructer = ShadowBox;

	return ShadowBox;

});