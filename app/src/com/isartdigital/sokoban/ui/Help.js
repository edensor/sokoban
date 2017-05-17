//La Class Help extends Screen
define(['jquery','utils/ui/Screen','utils/Config'],function($,Screen,Config){
	/**
	 * Classe qui affiche l'écran d'aide
	 * @author Marco Martella
	 */

	/**
	 * fonction Constructeur
	 * @callback  un fonction de UIManager qui permet les transitions entres les écrans.
	 * @div  la lune dans laquel on affiche notre ecran. (ici on append des bouttons et plus)
	 */
	function Help(callback,div){
		Screen.call(this,callback); // equivalent de super();
		this.next = $('<button class = "button Trans" type="button">Next</button>');
		this.message = $('<div class = "Message Trans"></div>');
		div.append(this.next);
		div.append(this.message);
	}

	//tentative d'heritage

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
		  		that.leave(that.next,0);
	  		});
		};
		/**
		 * fonction qui revoie le text d'aide.
		 */
		this.getMessage = function(){
			var message =  "<p>"+Config.getTrans('HELP_DESCR_GAME')+"</p>";
			for (var i = 0; i < 3; i++) {
				message += "<p>"+Config.getTrans('HELP_HOWTOPLAY'+(i+1))+"</p>";
			};
			return message;
		}
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

	Help.prototype =  Object.create(Screen.prototype); //ici on recupère les methodes de Screen.
	setMethode.call(Help.prototype);
	Help.prototype.Constructer = Help;


	return Help;

});