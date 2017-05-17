//La Class HighScore extends Screen
define(['jquery','utils/ui/Screen','sokoban/game/abstrait/score','utils/Config'],function($,Screen,score,Config){
	/**
	 * Classe qui affiche l'écran des scores.
	 * @author Marco Martella
	 */

	/**
	 * fonction Constructeur
	 * @callback  un fonction de UIManager qui permet les transitions entres les écrans.
	 * @div  la lune dans laquel on affiche notre ecran. (ici on append des bouttons et plus)
	 */
	function HighScore(callback,div){
		Screen.call(this,callback); // equivalent de super();
		this.next = $('<button class = "button Trans" type="button">'+Config.getTrans('LABEL_BACK')+'</button>');
		this.message = $('<div class = "Message Trans"></div>');
		div.append(this.next);
		div.append(this.message);
	}

	//tentative d'heritage

	function setMethode(){
		/**
		 * fonction qui affiche l'écran dans la lune et qui demande a l'objet scores de recuperer le tableaux des high Score.
		 */
		this.getScreen = function(){
			console.log("yo");
			this.message.empty();
			score.getHS(this.getScreen2.bind(this));
		};

		/**
		 * fonction qui affiche l'écran dans la lune.
		 */
		this.getScreen2 = function(table){
			this.message.append(table);
			this.message.fadeIn();
			this.next.css({top:70+'%',left:42.5+'%',width:15+'%',height:(15)+'%'});
			var that = this;
			this.next.click(function(){
		    	that.next.off("click");
		  		that.leave(that.next,"Menu");
	  		});
		};
		/**
		 * fonction qui retire l'écran de la lune.
		 */
		this.leave = function(button,target){
			var that = this;
			this.message.fadeOut();
			button.css({top:50+'%',left:50+'%',width:0+'%',height:0+'%'});
			button.on("transitionend",function(){
					button.off("transitionend");
					that.callback(target);
				}); 
		};
	}

	HighScore.prototype =  Object.create(Screen.prototype); //ici on recupère les methodes de Screen.
	setMethode.call(HighScore.prototype);
	HighScore.prototype.Constructer = HighScore;


	return HighScore;

});