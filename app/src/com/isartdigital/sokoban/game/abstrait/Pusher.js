//La Class Pusher extends Mobile
define(['jquery','sokoban/game/abstrait/Mobile'],function($,Mobile){
	/**
	 * Classe qui gere les objets qui peuvent pousser.
	 * @author Marco Martella
	 */

	/**
	 * fonction Constructeur
	 * @assetName  string qui determine quel asset liée a l'objet.
	 * @x coordonné ou créer l'objet.
	 * @y coordonné ou créer l'objet.
	 */
	function Pusher(assetName,x,y){
		Mobile.call(this,assetName,x,y); // equivalent de super();
		this.div.removeClass("cell");
		this.div.addClass("characterSize");
	}

	//tentative d'heritage

	function setMethode(){
		/**
		 * fonction qui gére la poussé dans un direction.
		 * @direction la direction ou on veux pousser.
		 * @map objet qui contient toute la grille de jeu (un peu trop fort).
		  * @return true si reussi, false sinon.
		 */
		this.trypush = function(direction,map){
			var coord =  {x:this.x,y:this.y}
			switch (direction){
				case "up":
					coord.y--;
					if (coord.y <= 0) {return false;}
				break;
				case "down":
					coord.y++;
					if (coord.y >= 8) {return false;}
				break;
				case "left":
					coord.x--;
					if (coord.x <= 0) {return false;}
				break;
				case "rigth":
					coord.x++;
					if (coord.x >= 8) {return false;}
				break;
			}
			if ( (this.pushFiltre == map[coord.x][coord.y].isPushable()) && map[coord.x][coord.y].containe[0].tryMove(direction,map)) {
				Mobile.prototype.tryMove.call(this,direction,map);
				return true;
			};
			return false;

		};
		/**
		 * fonction qui gére le déplacement dans un direction.
		 * @direction la direction ou on veux aller.
		 * @map objet qui contient toute la grille de jeu (un peu trop fort).
		  * @return true si reussi, false sinon.
		 */
		this.tryMove = function(direction,map){
			if(!Mobile.prototype.tryMove.call(this,direction,map)){
				if(this.trypush(direction,map)) return true;
				return false;
			}
			return true;
		};
		
	}

	Pusher.prototype =  Object.create(Mobile.prototype); //ici on recupère les methodes de Mobile.
	setMethode.call(Pusher.prototype);
	Pusher.prototype.Constructer = Pusher;


	return Pusher;

});