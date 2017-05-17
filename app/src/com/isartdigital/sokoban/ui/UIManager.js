define(['jquery',
		'sokoban/game/GameManager',
		'sokoban/ui/Credit',
		'sokoban/ui/Help',
		'sokoban/ui/HighScore',
		'sokoban/ui/TitleCard',
		'sokoban/ui/WinScreen',
		'sokoban/ui/SelectScreen',
		'sokoban/ui/EndScreen',
		],function($,GameManager,Credit,Help,HighScore,TitleCard,WinScreen,SelectScreen,EndScreen){

	/**
	 * Classe permettant de jongler entre les differents screen du jeu.
	 * @author Marco Martella
	 */

	 /**
	 * fonction Constructeur
	 * @param	lvlGen, un object contenant le tableau des niveaux.
	 */

	function UIManager(lvlGen){
		this.currentScreen = null;
		this.menu = null;
		this.SelectScreen = null;
		this.Credit = null;
		this.HighScore = null;
		this.WinScreen = null;
		this.GameOver = null;
		this.Help = null;
		this.EndScreen = null;
		this.stage = $('#gameStage');
		this.moon = $('<div class = "moon Trans"></div>');
		this.gameStage = $('<div class = "Stage Trans"></div>');
		this.gameMaestro = new GameManager(lvlGen,this.gameStage,this.getScreenCallback());
		this.boolMoonScreen = true;
	}

	function setMethode(){
		/**
		 * fonction qui crée les instnaces des differents screen qui sont dans la lune.
		 */
		this.init = function(){
			this.menu = new TitleCard(this.getScreenCallback(),this.moon);
			this.SelectScreen = new SelectScreen(this.getScreenCallback(),this.moon);
			this.Credit = new Credit(this.getScreenCallback(),this.moon);
			this.HighScore = new HighScore(this.getScreenCallback(),this.moon);
			this.WinScreen = new WinScreen(this.getScreenCallback(),this.moon);
			this.Help = new Help(this.getScreenCallback(),this.moon);
			this.EndScreen = new EndScreen(this.getScreenCallback(),this.moon);

			var that = this;
			$( window ).resize(that.onResize());
			$( window ).on("orientationchange",that.onResize());

			this.start();
		};

		/**
		 * fonction lance l'écrant titre.
		 */
		this.start = function(){
			this.stage.empty();
			this.menu.init();
			this.stage.append(this.menu.div);
			this.stage.append(this.gameStage);
			this.gameStage.css({top:150+'%'});
			var that = this;
			that.onResize()();
			//setTimeout(function(){ that.menu.menu(); }, 100);
		};

		/**
		 * fonction Callback donnée a tout les screens pour s'appeler entre elles.
		 * @target	un String qui est l'endroit ou on veux aller.
		 * @data	un objet qui permet optionellement de passer des infos entre les screens.
		 */
		this.getScreenCallback =  function(){
			var that = this;
			return callback = function(target,data){
				that.currentScreen = null;
				that.getMoonScreen();
				if (target === "Play") {
					that.currentScreen = that.SelectScreen;
				}
				if (target === "Help") {
					that.currentScreen = that.Help;
				}
				if (target === "Credit") {
					that.currentScreen = that.Credit;
				}
				if (target === "HS") {
					that.currentScreen = that.HighScore;
				}
				if (target === "Menu") {
					that.currentScreen = that.menu;
				}
				if (target === "Next") {
					if (that.gameMaestro.currentLevel < 14) {
						that.getGameScreen();
						that.gameMaestro.nextLevel()();
					}
					else{
						that.currentScreen = that.EndScreen;
					}
				}
				if (target === "End") {
					that.currentScreen = that.EndScreen;
				}

				if (target === "FinishLvl") {
					that.WinScreen.setData(data);
				}

				for (var i = 0; i < 15; i++) {
					if (target === i ) {
					that.getGameScreen();
					that.gameMaestro.buildLevel(i);
					break;
					}
				}
				if (that.currentScreen !== null) {
					that.currentScreen.getScreen();
				}
				
			}
		};

		/**
		 * fonction qui assure la transition entre la lune et l'ecran de jeu.
		 */
		this.getGameScreen = function(){
			if (this.boolMoonScreen) {
				this.boolMoonScreen = false;
				this.moon.css({top:-150+'%'});
				this.gameStage.css({top:0+'%'});
			}
		};

		/**
		 * fonction qui assure la transition entre l'ecran de jeu et la lune.
		 */
		this.getMoonScreen =  function(){
			if (!this.boolMoonScreen) {
				this.boolMoonScreen = true;
				this.moon.css({top:-0+'%'});
				this.gameStage.css({top:150+'%'});
			}
		};

		/**
		 * fonction qui assure le coté responsive de l'écran titre et de la lune.
		 */
		this.onResize = function() {
			var  _this = this;
			return function(){
				var ratio = 1;
				var ratioLH = 1;
				var sW = 0;
				var sH = 0;
				var sT = 0;
				var sL = 0;
	  			var w = $('#gameStage').width();
	  			var h = $('#gameStage').height();
	  			if (h*ratioLH<w) {
	  				sW= h*ratio*ratioLH;
	  				sH= h*ratio;
	  				sT= (h*0.5-h*ratio/2);
	  				sL=(w*0.5-h*ratio*ratioLH/2);
	  			}
	  			else{
	  				sW= w*ratio;
	  				sH= w*ratio/ratioLH;
	  				sT= (h*0.5-w*(ratio/ratioLH)/2);
	  				sL=(w*0.5-w*(ratio)/2);

	  			}
	  			$('.Screen').css({width: sW+"px",
	  							height: sH+"px",
	  							top: sT + "px",
	  							left:sL + "px"});
	  			
			};
		};

		/**
		 * fonction qui detruit l'instance.
		 */
		this.destroy = function(){
			$( window ).off("resize");
			$( window ).off("orientationchange");
			this.stage.remove();
			this.currentScreen.destroy();
			this.menu.destroy();
			this.SelectScreen.destroy();
			this.Credit.destroy();
			this.HighScore.destroy();
			this.WinScreen.destroy();
			this.GameOver.destroy();
			this.Help.destroy();
			this.EndScreen.destroy();
			this.gameMaestro.destroy();
			this.stage = null;
			this.currentScreen = null;
			this.menu = null;
			this.SelectScreen = null;
			this.Credit = null;
			this.HighScore = null;
			this.WinScreen = null;
			this.GameOver = null;
			this.Help = null;
			this.EndScreen = null;
			this.gameMaestro = null;
		};
	}

	setMethode.call(UIManager.prototype);
	TitleCard.prototype.Constructer = UIManager;


return UIManager;

});