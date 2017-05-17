//La Class Wall extends StateGraphic
define(['jquery','sokoban/game/sprites/Tiles'],function($,Tiles){

	/**
	 * Classe qui gere les murs.
	 * @author Marco Martella
	 */

	/**
	 * fonction Constructeur
	 * @x coordonné ou créer du mur.
	 * @y coordonné ou créer du mur.
	 */
	function Wall(x,y){
	Tiles.call(this,"Wall",x,y); // equivalent de super();
	this.div.addClass("WallSize");
	this.div.css({zIndex:y});
	}

	//tentative d'heritage

	function setMethode(){
		
	}

	Wall.prototype =  Object.create(Tiles.prototype); //ici on recupère les methodes de Tiles.
	Tiles.call(Wall.prototype);
	Wall.prototype.Constructer = Wall;


	return Wall;

});