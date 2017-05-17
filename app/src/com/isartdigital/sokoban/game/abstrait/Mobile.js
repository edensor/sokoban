//La Class Mobile extends StateGraphic
define(['jquery','utils/game/StateGraphic'],function($,StateGraphic){

	const SIZE = 11;
	
	/**
	 * Classe qui gere les objets mobile.
	 * @author Marco Martella
	 */

	/**
	 * fonction Constructeur
	 * @assetName  string qui determine quel asset liée a l'objet.
	 * @x coordonné ou créer l'objet.
	 * @y coordonné ou créer l'objet.
	 */
	function Mobile(assetName,x,y){
		StateGraphic.call(this,assetName,x,y); // equivalent de super();
		this.active =  true;
		this.juSpawn = false;
		this.div.css({bottom:((8-y)*SIZE+1)+"%",left:x*SIZE+"%",zIndex:y});
		this.halo.css({bottom:((6.6-y)*SIZE+1)+"%",left:(x-1.32)*SIZE+"%",zIndex:y});
		this.div.addClass('Mobile');
		this.ruDoPath = [{x:x,y:y}];
		this.mouvCount = 0;
		Mobile.list.push(this);
	}

	//tentative d'heritage

	function setMethode(){
		/**
		 * fonction qui gére le déplacement dans un direction.
		 * @direction la direction ou on veux aller.
		 * @map objet qui contient toute la grille de jeu (un peu trop fort).
		  * @return true si reussi, false sinon.
		 */
		this.tryMove =  function(direction,map){
			var isOOB = false;
			coord =  {x:this.x,y:this.y}
			switch (direction){
				case "up":
					coord.y--;
					if (coord.y === -1) {isOOB = true;}
				break;
				case "down":
					coord.y++;
					if (coord.y === 9) {isOOB = true;}
				break;
				case "left":
					coord.x--;
					if (coord.x === -1) {isOOB = true;}
				break;
				case "rigth":
					coord.x++;
					if (coord.x === 9) {isOOB = true;}
				break;
			}
			if (isOOB) {return false}
			if (map[coord.x][coord.y].isWalkable()) {
				return this.move(coord.x,coord.y,map);
			}
			return false;
		};

		/**
		 * fonction qui force le déplacement sur une case donné.
		 * @x @y les coordonnées de la case de destination.
		 * @map objet qui contient toute la grille de jeu (un peu trop fort).
		 * @return true .
		 */
		this.move = function(x,y,map){
			if (x === this.x && y === this.y) {return false;}
			this.div.css({bottom:((8-y)*SIZE+1)+"%",left:x*SIZE+"%",zIndex:y});
			this.halo.css({bottom:((6.6-y)*SIZE+1)+"%",left:(x-1.32)*SIZE+"%",zIndex:y});
			map[this.x][this.y].removeOff(this);
			this.x = x;
			this.y = y;
			map[this.x][this.y].addOn(this);
			return true;
		};

		/**
		 * fonction qui gére le undo de l'objet.
		 * @map objet qui contient toute la grille de jeu (un peu trop fort).
		 */
		this.undo = function(map){
			this.mouvCount -=1;
			if (this.mouvCount >= 0) {	
				var prevX = this.ruDoPath[this.mouvCount].x;
				var prevY = this.ruDoPath[this.mouvCount].y;
				this.move(prevX, prevY, map);
			}
			else if (this.mouvCount === -1) 
			{
				this.disactive(map);
			}
		};

		/**
		 * fonction qui gére le undo de l'objet.
		 * @map objet qui contient toute la grille de jeu (un peu trop fort).
		 */
		this.redo = function(map){
			this.mouvCount +=1;
			if (this.ruDoPath.length > this.mouvCount && this.mouvCount >= 1) {
				var nextX = this.ruDoPath[this.mouvCount].x;
				var nextY = this.ruDoPath[this.mouvCount].y;
				this.move(nextX, nextY, map);
			}
			if (this.mouvCount === 0) {
				this.reactive(map);
			}
		};

		/**
		 * fonction qui désactives les objets les enleves de l'écran.
		 * @map objet qui contient toute la grille de jeu (un peu trop fort).
		 */
		this.disactive =  function(map){
			this.active = false;
			this.div.remove();
			this.halo.remove();
			map[this.x][this.y].removeOff(this);
		}

		/**
		 * fonction qui réactives les objets les remetent à l'écran.
		 * @map objet qui contient toute la grille de jeu (un peu trop fort).
		 */
		this.reactive = function(map){
			this.active = true;
			var grid = map[this.x][this.y].div.parent();
			grid.append(this.halo);
			grid.append(this.div);
			map[this.x][this.y].addOn(this);
		}

		this.destroy =  function(){
			this.ruDoPath = null;
			this.mouvCount = 0;
			for (var i = Mobile.list.length - 1; i >= 0; i--) {
				if (Mobile.list[i] === this) {
					Mobile.list.splice(i,1);
				}
			}
			StateGraphic.prototype.destroy.call(this);
		}
	}

	Mobile.prototype =  Object.create(StateGraphic.prototype); //ici on recupère les methodes de StateGraphic.
	setMethode.call(Mobile.prototype);
	Mobile.prototype.Constructer = Mobile;

	Mobile.list = [];

	/**
	 * fonction de class qui fait undo sur tout les objets mobiles.
	 * @map objet qui contient toute la grille de jeu (un peu trop fort).
	 */
	Mobile.redoAll =  function(map){
			var lMobile = null;
			for (var i = Mobile.list.length - 1; i >= 0; i--) {
				lMobile = Mobile.list[i];
				lMobile.redo(map);
			};
		};

	 /**
	 * fonction de class qui fait redo sur tout les objets mobiles.
	 * @map objet qui contient toute la grille de jeu (un peu trop fort).
	 */
	Mobile.undoAll =  function(map){
			var lMobile = null;
			for (var i = Mobile.list.length - 1; i >= 0; i--) {
				lMobile = Mobile.list[i];
				lMobile.undo(map);
			};
		}

	 /**
	 * fonction de class qui demande a tout les objets mobiles de sensegner dans leur tableau ruDoPath leur position actuel.
	 */
	Mobile.captureInstant = function(){
		var lMobile = null;
			for (var i = Mobile.list.length - 1; i >= 0; i--) {
				lMobile = Mobile.list[i];
				if (lMobile.active) {
					if (lMobile.mouvCount < lMobile.ruDoPath.length-1) {
						lMobile.ruDoPath = lMobile.ruDoPath.splice(0,lMobile.mouvCount+1);
					}
					if (lMobile.juSpawn) {
						lMobile.juSpawn = false;
					}
					else{
						lMobile.ruDoPath.push({x:lMobile.x,y:lMobile.y});
						lMobile.mouvCount += 1;
					}
				}
			};
	}
	/**
	 * fonction de class détruit tout les objets mobiles non actif.
	 */
	Mobile.killDisactive = function(){
		var lMobile = null;
		for (var i = Mobile.list.length - 1; i >= 0; i--) {
			lMobile = Mobile.list[i];
			if (!lMobile.active) {
				lMobile.destroy();
			}
		}
	};

	return Mobile;

});