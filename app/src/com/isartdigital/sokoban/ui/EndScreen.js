//La Class EndScreen extends Screen
define(['jquery','utils/ui/Screen','utils/Config'],function($,Screen,Config){
	/**
	 * Classe qui assure la transition apres la resolution du dernier niveau.
	 * @author Marco Martella
	 */

	/**
	 * fonction Constructeur
	 * @callback  un fonction de UIManager qui permet les transitions entres les écrans.
	 * @div  la lune dans laquel on affiche notre ecran. (ici on append des bouttons et plus)
	 */
	function EndScreen(callback,div){
		Screen.call(this,callback); // equivalent de super();
		this.next = $('<button class = "button Trans" type="button">'+Config.getTrans('LABEL_PLAY')+'</button>');
		this.hightScore = $('<button class = "button Trans" type="button">hightScore</button>');
		this.message = $('<div class = "Message Trans"></div>');
		div.append(this.next);
		div.append(this.hightScore);
		div.append(this.message);
		}

	//tentative d'heritage

	function setMethode(){
		/**
		 * fonction qui affiche l'écran dans la lune.
		 */
		this.getScreen = function(){
			this.message.empty();
			this.message.append("Bravo vous avez fini");
			this.next.css({top:70+'%',left:25+'%',width:15+'%',height:(15)+'%'});
			this.hightScore.css({top:70+'%',left:60+'%',width:15+'%',height:(15)+'%'});
			var that = this;
			this.next.click(function(){
		    	that.next.off("click");
		  		that.leave(that.next,"Play");
	  		});
	  		this.hightScore.click(function(){
		    	that.hightScore.off("click");
		  		that.leave(that.hightScore,"HS");
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
			setTimeout(function(){
					that.next.off("transitionend");
					that.next.css({top:50+'%',left:50+'%',width:0+'%',height:0+'%'});
					that.hightScore.off("transitionend");
					that.hightScore.css({top:50+'%',left:50+'%',width:0+'%',height:0+'%'});
			}, 500);
		};
	}

	EndScreen.prototype =  Object.create(Screen.prototype); //ici on recupère les methodes de Screen.
	setMethode.call(EndScreen.prototype);
	EndScreen.prototype.Constructer = EndScreen;


	return EndScreen;

});