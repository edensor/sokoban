//La Class Shadow extends Pusher
define(['jquery','sokoban/game/abstrait/Pusher','sokoban/game/sprites/ShadowBox'],function($,Pusher,ShadowBox){
	/**
	 * Classe qui gere la Shadow.
	 * @author Marco Martella
	 */

	/**
	 * fonction Constructeur
	 * @path le chemin que l'ombre doit suivre.
	 * @x coordonné ou créer le player.
	 * @y coordonné ou créer le player.
	 */
	function Shadow(x,y,path){
		this.isPushable = 0;
		this.pushFiltre = -1;
		this.path = path;
		Shadow.list.push(this);
		Pusher.call(this,"Shadow",x,y); // equivalent de super();
		this.anim.addClass("idle");
		this.halo.addClass("haloShadow");
		this.arrow = $('<div class = "arrow"></div>');
		this.shadow.append(this.arrow);
		this.juSpawn = true;
		this.numMove = 0;
		this.boolAsc = true;

	}

	//tentative d'heritage

	function setMethode(){
		/**
		 * fonction qui gére la poussé dans un direction.
		 * @direction la direction ou on veux aller.
		 * @map objet qui contient toute la grille de jeu (un peu trop fort).
		  * @return true si reussi, false sinon.
		 */
		this.trypush = function(direction,map){
			var coord =  {x:this.x,y:this.y}
			var dy = 0;
			var dx = 0;
			switch (direction){
				case "up":
					dy--;
					if (coord.y <= 1) {return false;}
				break;
				case "down":
					dy++;
					if (coord.y >= 7) {return false;}
				break;
				case "left":
					dx--;
					if (coord.x <= 1) {return false;}
				break;
				case "rigth":
					dx++;
					if (coord.x >= 7) {return false;}
				break;
			}
			if ( (map[coord.x+dx][coord.y+dy].isPushable() !== 0) && map[coord.x+2*dx][coord.y+2*dy].isWalkable()) {
				var sBox = null;
				if(map[coord.x+dx][coord.y+dy].isPushable() === 1){
					sBox = new ShadowBox(coord.x+2*dx,coord.y+2*dy);
					map[coord.x+2*dx][coord.y+2*dy].containe.push(sBox);
					this.div.parent().append(sBox.div);
				}
				else{
					sBox = map[coord.x+dx][coord.y+dy].containe[0];
					sBox.tryMove(direction,map);
				}
				this.move(coord.x+dx,coord.y+dy,map);
				return true;
			}
			return false;
		};

		/**
		 * fonction qui gére le déplacement dans un direction.
		 * @direction la direction ou on veux aller.
		 * @map objet qui contient toute la grille de jeu (un peu trop fort).
		  * @return true si reussi, false sinon.
		 */
		this.tryMove = function(direction,map){
			var degre = 0;
			switch(this.path[this.numMove+1].d){
				case "up":
					degre = 90;
				break;
				case "down":
					degre = 270;
				break;
				case "left":
					degre = 0;
				break;
				case "rigth":
					degre = 180;
				break;
			}
			this.arrow.css({transform:"rotate("+ degre +"deg)"});
			return Pusher.prototype.tryMove.call(this,direction,map)
		};

		/**
		 * fonction qui gére le undo de l'ombre.
		 * @map objet qui contient toute la grille de jeu (un peu trop fort).
		 */
		this.undo = function(map){
			this.numMove--;
			Pusher.prototype.undo.call(this,map);
			if (this.mouvCount>=-1) {
				switch(this.path[this.numMove+1].d){
					case "up":
						degre = 90;
					break;
					case "down":
						degre = 270;
					break;
					case "left":
						degre = 0;
					break;
					case "rigth":
						degre = 180;
					break;
				}
				this.arrow.css({transform:"rotate("+ degre +"deg)"});
			}
		};

		/**
		 * fonction qui gére le redo de l'ombre.
		 * @map objet qui contient toute la grille de jeu (un peu trop fort).
		 */
		this.redo = function(map){
			this.numMove++;
			Pusher.prototype.redo.call(this,map);
			if (this.mouvCount>=-1) {
				switch(this.path[this.numMove+1].d){
					case "up":
						degre = 90;
					break;
					case "down":
						degre = 270;
					break;
					case "left":
						degre = 0;
					break;
					case "rigth":
						degre = 180;
					break;
				}
				this.arrow.css({transform:"rotate("+ degre +"deg)"});
			}
		};

		/**
		 * fonction qui gére le changement d'etat si l'ombre n'est plus ou est re syncrhonisé avec le player.
		 */
		this.synchrone =  function(){
			var x = this.path[this.numMove].x
			var y = this.path[this.numMove].y
			if (!this.boolAsc && x === this.x && y === this.y) {
				this.boolAsc = true;
				this.arrow.toggleClass("dsync");
			}
			if (this.boolAsc && (x !== this.x || y !== this.y)) {
				this.boolAsc = false;
				this.arrow.toggleClass("dsync");
			}
		};


		this.destroy = function(){
			this.myPath = null;
			for (var i = Shadow.list.length - 1; i >= 0; i--) {
				if (Shadow.list[i] === this) {
					Shadow.list.splice(i,1);
				}
			}
			Pusher.prototype.destroy.call(this);
		};
	}

	Shadow.prototype =  Object.create(Pusher.prototype); //ici on recupère les methodes de Pusher.
	setMethode.call(Shadow.prototype);
	Shadow.prototype.Constructer = Shadow;


	Shadow.doActionAll =  function(map){
		var lShadow = null;
		for (var i = Shadow.list.length - 1; i >= 0; i--) {
			lShadow = Shadow.list[i];
			if (lShadow.active) {
				lShadow.tryMove(lShadow.path[lShadow.numMove].d,map);
				lShadow.synchrone();
				lShadow.numMove++;
			}
		}
	};

	Shadow.destroyAll = function(){
		var lShadow = null;
		for (var i = Shadow.list.length - 1; i >= 0; i--) {
			lShadow = Shadow.list[i];
			lShadow.destroy;
			Shadow.list.splice(i,1);
		}
	};

	Shadow.nmbActive = function(){
		var j = 0;
		var lShadow = null;
		for (var i = Shadow.list.length - 1; i >= 0; i--) {
			lShadow = Shadow.list[i];
			if (lShadow.active) {
				j++;
			}
		}
		return j;
	}

	Shadow.list = [];

	return Shadow;

});