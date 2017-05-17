//La Class SelectScreen extends Screen
define(['jquery','utils/ui/Screen','sokoban/game/abstrait/score','utils/Config'],function($,Screen,score,Config){
	/**
	 * Classe qui affiche l'écran de selection des niveaux
	 * @author Marco Martella
	 */

	/**
	 * fonction Constructeur
	 * @callback  un fonction de UIManager qui permet les transitions entres les écrans.
	 * @div  la lune dans laquel on affiche notre ecran. (ici on append des bouttons et plus)
	 */
	function SelectScreen(callback,div){
		Screen.call(this,callback); // equivalent de super();
		this.buttonArray = [];
		for (var i = 0; i < 15; i++) {
			this.buttonArray.push($('<button class = "button Trans" type="button">'+(i+1)+'</button>'));
			div.append(this.buttonArray[i]);
		}
		this.buttonBack = $('<button class = "button Trans" type="button">'+Config.getTrans('LABEL_BACK')+'</button>');
		div.append(this.buttonBack);
	}

	//tentative d'heritage

	function setMethode(){
		/**
		 * fonction qui affiche l'écran dans la lune.
		 */
		this.getScreen = function(){
			var that = this;
			var center = 42.5;
			var x = 0;
			var y = 0;
			var newLvlFound =  false;
			var lButton = null;
			var target = null;
			var lLength = that.buttonArray.length;
			for (var i = 0; i < lLength; i++) {
				x= Math.cos(((Math.floor(i/5)/3+1)+i)*2*Math.PI/5)*(Math.floor(i/5)*0.9+1);
				y= Math.sin(((Math.floor(i/5)/3+1)+i)*2*Math.PI/5)*(Math.floor(i/5)*0.9+1);
				lButton = that.buttonArray[i];
				target = i===0 ? "Help" : i;
				if(score.stat.level[i] === 0){
					if (!newLvlFound) {
						newLvlFound =  true;
						lButton.removeClass("lvllock");
						lButton.addClass("nextLevel");
						lButton.click(that.createCallback(lButton,target));
					}
					else lButton.addClass("lvllock");
				}
				else{
					lButton.removeClass("nextLevel");
					lButton.removeClass("lvllock");
					lButton.click(that.createCallback(lButton,target));
				}
				setTimeout(
					that.createCallbackTimeout(lButton,x,y)
				,i*100);
				
			}
			that.buttonBack.css({top:center+'%',left:center+'%',width:15+'%',height:(15)+'%'});
			that.buttonBack.click(that.createCallback(that.buttonBack,'Menu'));
		};

		/**
		 * fonction qui retire l'écran de la lune.
		 */
		this.leave = function(button,target){
			var that = this;
			button.css({top:50+'%',left:50+'%',width:0+'%',height:0+'%'});
			setTimeout(function(){
				for (var i = that.buttonArray.length - 1; i >= 0; i--) {
					that.buttonArray[i].css({top:50+'%',left:50+'%',width:0+'%',height:0+'%'});
					that.buttonArray[i].off("click");
				};
			 	that.buttonBack.css({top:50+'%',left:50+'%',width:0+'%',height:0+'%'});
				that.buttonBack.off("click");
				setTimeout(function(){ 
					console.log("yoyoyo");
					that.callback(target); }, 500); 
			}, 600);
		};

		/**
		 * fonction qui crée des fonction callBack
		 * @pButton le bouton qui perd l'ecoute de l'evenement "click".
		 * @pTarget  l'endroit (ici le niveau) dans lequel on veux aller.
		 */
		this.createCallback =  function(pButton, pTarget){
			var that = this;
	  		return function(){
		    	pButton.off("click");
		  		that.leave(pButton,pTarget);
	  		}
		};

		/**
		 * fonction qui crée des fonction callBack
		 * @pButton le bouton qui veux etres modifier.
		 * @x  la futur position en x du pButton;
		 * @y  la futur position en x du pButton;
		 */
		this.createCallbackTimeout =  function(pButton,x, y){
			var that = this;
			var center = 42.5;
	  		return function(){
		    	pButton.css({top:(center+15*x)+'%',left:(center+15*y)+'%',width:15+'%',height:(15)+'%'});
	  		}
		};

	}

	SelectScreen.prototype =  Object.create(Screen.prototype); //ici on recupère les methodes de Screen.
	setMethode.call(SelectScreen.prototype);
	SelectScreen.prototype.Constructer = SelectScreen;


	return SelectScreen;

});