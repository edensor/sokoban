define(['jquery'],function($){


	//Classe de base des objets interactifs dans le jeu
	//Par convention le changement de référence de doAction se fait via des méthodes setMode (setModeVoid, setModeNormal)

	
	//Fonction Constructer
	function GameObject(x,y){
		this.doAction = {};
		this.div = $('<div class = "cell"></div>');
		this.x = x;
		this.y = y;
		this._setModeVoid();
	}

	function setMethode(){
		this._setModeVoid = function(){
			this.doAction = this._doActionVoid;
		};
		this._doActionVoid = function(){};
		this._setModeNormal= function(){
			this.doAction = this._doActionNormal;
		};
		this._doActionNormal= function(){};
		this.start= function(){
			this._setModeNormal();
		};
		this.destroy= function(){
			this._setModeVoid();
			this.div.remove();
			this.div = null;
		};
		this.test= function(){
			console.log(this);
		};
	}

	setMethode.call(GameObject.prototype);


	return GameObject;

});