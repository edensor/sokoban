//La Class WinScreen extends Screen
define(['jquery','utils/ui/Screen','sokoban/game/abstrait/score','utils/Config'],function($,Screen,score,Config){
	/**
	 * Classe qui affiche l'écran de victoir entre les niveaux.
	 * @author Marco Martella
	 */

	/**
	 * fonction Constructeur
	 * @callback  un fonction de UIManager qui permet les transitions entres les écrans.
	 * @div  la lune dans laquel on affiche notre ecran. (ici on append des bouttons et plus)
	 */
	function WinScreen(callback,div){
		Screen.call(this,callback); // equivalent de super();
		this.next = $('<button class = "button Trans" type="button">'+Config.getTrans('LABEL_PLAY')+'</button>');
		this.message = $('<div class = "Message Trans"></div>');
		div.append(this.next);
		div.append(this.message);

		this.score=0;
		this.par=0;
		this.numMove=0;
		this.lvl=0;
	}



	function setMethode(){
		/**
		 * fonction qui affiche l'écran dans la lune.
		 */
		this.getScreen = function(){
			this.message.empty();
			this.message.append(this.getMessage());
			this.message.fadeIn();
			this.next.css({top:70+'%',left:42.5+'%',width:15+'%',height:(15)+'%'});
			var that = this;
			this.next.click(function(){
		    	that.next.off("click");
		  		that.leave(that.next,"Next");
	  		});
		};
		/**
		 * fonction qui retire l'écran de la lune.
		 */
		this.leave = function(button,target){
			var that = this;
			this.message.fadeOut();
			button.css({top:50+'%',left:50+'%',width:0+'%',height:0+'%'});
			setTimeout(function(){ that.callback(target); }, 500);
		};
		/**
		 * fonction initialise les propriété des scores et demande a l'objet score d'ajouté les scores a ses stats.
		 * @data  unn objet contenant les scores envoyé par Stage.
		 */
		this.setData = function(data){
			this.score=data[1];
			this.par=data[2];
			this.numMove=data[0];
			this.lvl=data[3];
			var that = this;
			score.addScore(this.lvl,this.score,that.getScreen.bind(that));
		};

		/**
		 * fonction prepart la string a afficher.
		 */
		this.getMessage =  function(){
			var message = "<p>"+Config.getTrans('VICTORY_1')+" "+(this.lvl+1)+"<br>"+Config.getTrans('LABEL_PERFECT')+": "+this.par+"<br>"+Config.getTrans('HUD_TXT8')+": "+this.numMove+"<br>score: "+this.score+"</p>";
			return message;
		}
	}

	WinScreen.prototype =  Object.create(Screen.prototype); //ici on recupère les methodes de Screen.
	setMethode.call(WinScreen.prototype);
	WinScreen.prototype.Constructer = WinScreen;


	return WinScreen;

});