//La Class Box extends Mobile
define(['jquery','sokoban/game/abstrait/Mobile'],function($,Mobile){
	/**
	 * Classe qui gere les boites movible du jeux.
	 * @author Marco Martella
	 */

	/**
	 * fonction Constructeur
	 * @assetName  string qui determine quel asset liée a l'objet.
	 * @x coordonné ou créer l'objet.
	 * @y coordonné ou créer l'objet.
	 */
	function Box(assetName,x,y){
		if(assetName === "ShadowBox"){
			this.isPushable = -1;
		}
		else{
			this.isPushable = 1;
		}
		Mobile.call(this,assetName,x,y); // equivalent de super();
		this.halo.addClass("haloBox");
	}

	//tentative d'heritage

	function setMethode(){
		this.tryMove = function(direction,map){
			if(Mobile.prototype.tryMove.call(this,direction,map)){
				if (map[this.x][this.y].assetName === "Target") {
					this.anim.addClass("OnTarget");
				}
				else{
					this.anim.removeClass("OnTarget");
				}
				return true;
			}
			return false;
		};
	}

	Box.prototype =  Object.create(Mobile.prototype); //ici on recupère les methodes de Mobile.
	setMethode.call(Box.prototype);
	Box.prototype.Constructer = Box;


	return Box;

});