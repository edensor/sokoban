//La Class Tiles extends StateGraphic
define(['jquery','utils/game/StateGraphic'],function($,StateGraphic){

	const SIZE = 11;

	/**
	 * Classe qui gere les different types de cases.
	 * @author Marco Martella
	 */

	/**
	 * fonction Constructeur
	 * @assetName  string qui determine quel asset liée a l'objet.
	 * @x coordonné ou créer la case.
	 * @y coordonné ou créer la case.
	 */
	function Tiles(assetName,x,y){
		this.containe = [];
		StateGraphic.call(this,assetName,x,y); // equivalent de super();

		if (assetName === "Target") {
			Tiles.list.push(this);
			this.halo.addClass("haloTarget");
		}
		this.fx = $('<div class = "anim"></div>');
		this.shadow.append(this.fx);
		this.fx.css("background-color", "rgba(0,0,0,0)");
		this.lvlShadow = 0;
	}

	//tentative d'heritage

	function setMethode(){
		/**
		 * fonction qui ajoute un object au tableau this.contain.
		 * @pObj  l'objet a push.
		 */
		this.addOn = function(pObj){
			this.containe.push(pObj);
		};
		/**
		 * fonction qui retire un object du tableau this.contain.
		 * @pObj  l'objet a retirer.
		 */
		this.removeOff =  function(Obj){
			var length = this.containe.length;
			if (length === 1) {
				this.containe.splice(0,1);
				return;
			};
			for (var i = 0; i < length; i++) {
				if (this.containe[i] === Obj) {
					this.containe.splice(i,1);
				};
			};
		};
		/**
		 * fonction qui revoie si on peut se déplacer sur la case.
		 * @return true si on peux marcher, false sinon.
		 */
		this.isWalkable =  function(){
			switch(this.assetName){
				case "Target":
				case "Ground":
					if(this.containe.length === 0) return true;
					return false;	
				break;
				case "Wall":
					return false;
				break;
				case "Void":
					return true;
				break;
			}
		};

		/**
		 * fonction qui revoie si on peux tracé le chemin futur de l'ombre.
		 * @return true si on peut, false sinon.
		 */
		this.isFxErgoAble = function(){
			if (this.assetName === "Wall") return false;
			//if (this.isPushable() === -1) return false;
			return true;
		};

		/**
		 * fonction qui revoie si ce qui est sur la case est poussable (attention l'ombre peu etre sur la meme case qu'une boite ce qui la rend non poussable).
		 * @return !=0 si oui, 0  sinon.
		 */
		this.isPushable = function(){
			var result = 1;
			var length = this.containe.length;
			if(this.containe.length === 0) result = 0;
			for (var i = 0; i < length; i++) {
				result *=this.containe[i].isPushable;
			};
			return result;
		};

		/**
		 * fonction qui revoie si ce qui est sur la case est une boite.
		 * @return true si oui, false  sinon.
		 */
		this.isBoxOver = function(){
			var length = this.containe.length;
			for (var i = 0; i < length; i++) {
				if (Math.abs(this.containe[i].isPushable) === 1) return true;
			}
			return false;
		};
		
		this.list = [];

		this.destroy = function(){
			var lLength = this.containe;
			for (var i = this.containe.length - 1; i >= 0; i--) {
				this.containe[i].destroy();
				this.containe.splice(0,1);
			};
			this.containe = null;

			StateGraphic.prototype.destroy.call(this);
		};
	}

	Tiles.prototype =  Object.create(StateGraphic.prototype); //ici on recupère les methodes de StateGraphic.
	setMethode.call(Tiles.prototype);
	Tiles.prototype.Constructer = Tiles;

	Tiles.list =  [];

	/**
		 * fonction de classe qui revoie si toute les cases cible on une boites dessus.
		 * @return true si oui, false  sinon.
		 */
	Tiles.isFinish =  function(){
			var length = this.list.length;
			if (length === 0) return false;
			for (var i = 0; i < length; i++) {
				if (!this.list[i].isBoxOver()) return false;
			}
			this.list = [];
			return true;
		};

	return Tiles;

});