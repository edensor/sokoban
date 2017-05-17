//La Class Player extends Pusher
define(['jquery','sokoban/game/abstrait/Pusher'],function($,Pusher){
	/**
	 * Classe qui gere le player.
	 * @author Marco Martella
	 */

	/**
	 * fonction Constructeur
	 * @x coordonné ou créer le player.
	 * @y coordonné ou créer le player.
	 */
	function Player(x,y){
		this.myPath = [];
		this.pushFiltre = 1;
		Pusher.call(this,"Player",x,y); // equivalent de super();
		this.isPushable = 0;
		this.myPath.push({x:this.x,y:this.y,d:""});
		this.anim.addClass("idle");
		this.halo.addClass("haloPlayer");
		this.gState = "wait";
		this.PathTofolow = [];
	}

	//tentative d'heritage

	function setMethode(){
		/**
		 * fonction qui gére le déplacement dans un direction.
		 * @direction la direction ou on veux aller.
		 * @map objet qui contient toute la grille de jeu (un peu trop fort).
		  * @return true si reussi, false sinon.
		 */
		this.tryMove = function(direction,map){
			if(Pusher.prototype.tryMove.call(this,direction,map)){
				if (this.myPath.length !== this.mouvCount+1) {
					this.myPath.splice(this.mouvCount+1,this.myPath.length-(this.mouvCount+1));
				}
				this.myPath.push({x:this.x,y:this.y,d:direction});
				//console.log(this.ruDoPath,this.mouvCount);
				return true;
			}
			return false;
		};

		/**
		 * fonction qui gére le déplacement selon un chemin
		 * @countFunc fonction pour permetre au stage de conter les deplacements et autre subtilité.
		 * @map objet qui contient toute la grille de jeu (un peu trop fort)
		 */
		this.takePath = function(map,countFunc){
			that = this;
			that.div.off("transitionend");
			this.gState = "move";
			var straigthLine = (that.PathTofolow[0] === that.PathTofolow[1]);
			if (that.PathTofolow.length >0 && that.tryMove(that.PathTofolow.shift(),map)) {
				if (!straigthLine) that.div.on("transitionend",function(){that.takePath(map,countFunc);});
				else setTimeout(function(){ that.takePath(map,countFunc); }, 1000/9); 
				countFunc();
			}
			else{
				this.gState = "wait";
			} 
		};

		/**
		 * fonction qui change le chemin a suivre.
		 * @path le chemin a suivre.
		 */
		this.setPath = function(path){
			this.PathTofolow = path;
		};

		this.destroy = function(){
			this.myPath = null;
			this.map = null;
			Pusher.prototype.destroy.call(this);
		};
	}

	Player.prototype =  Object.create(Pusher.prototype); //ici on recupère les methodes de Pusher.
	setMethode.call(Player.prototype);
	Player.prototype.Constructer = Player;



	return Player;

});