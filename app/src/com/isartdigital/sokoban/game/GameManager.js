define(['jquery'
		,'sokoban/game/levelDesign/LevelGenerator'
		,'sokoban/game/planes/Stage'
		,'sokoban/game/abstrait/score'],function($,LevelGenerator,Stage,score){

	/**
	 * Classe qui assure demande a stage de crée le bon niveau et qui fait un peux de responsive.
	 * @author Marco Martella
	 */

	/**
	 * fonction Constructeur
	 * @loader  objet qui contient les maps du jeux.
	 * @div la div ou on append nos affaire.
	 * @callback la fonction callback a distribuer au differente instance de stage.
	 */
	function GameManager(loader,div,callback){
		this.levelMap = loader.lvlArray;
		this.creator = new LevelGenerator();
		this.gameStage =  div;
		this.stage = $('<div id = "stage"></div>');
		this.hudButton = $('<div class = "Stage"></div>');
		this.hudInfo = $('<div class = "Stage"></div>');
		this.currentLevel;
		this.gameStage.append(this.stage);
		this.gameStage.append(this.hudButton);
		this.gameStage.append(this.hudInfo);
		score.getPar(this.levelMap);
		this.callback = callback;
		var that = this;
		that.onResize()();
		$( window ).resize(that.onResize());
		$( window ).on("orientationchange",that.onResize());
	}

	function setMethode(){
		/**
		 * fonction qui contruit un niveau
		 * @idLevel  l'id du niveau.
		 */
		this.buildLevel = function(idLevel){
			var map = this.levelMap[idLevel];
			this.currentLevel = idLevel;

			var level = new Stage(this.creator.creatMap(map),this.currentLevel, this.stage,this.hudButton,this.hudInfo, this.replayLevel(), this.callback,this.onResize());
			level.display();
			level.refresHud();
			level.clickAnable();
		};

		/**
		 * fonction encapsulé qui contruit le niveau suivant
		 */
		this.nextLevel = function(){
			var _this = this;
			return function(){
				_this.buildLevel(_this.currentLevel+1);
			};
		};

		/**
		 * fonction encapsulé qui contruit le niveau precedent
		 */
		this.prevLevel = function(){
			var _this = this;
			return function(){
				_this.buildLevel(_this.currentLevel-1);
			};
		};

		/**
		 * fonction encapsulé qui recontruit le dernier niveau joué.
		 */
		this.replayLevel = function(){
			var _this = this;
			return function(){
				_this.buildLevel(_this.currentLevel);
			};
		};

		/**
		 * fonction responsive.
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

	  				_this.hudButton.css({width:sL*0.6+"px",
	  								height:sH*0.6+"px",
	  								top:(sT+0.2*sH) + "px",
	  								left:(sL+sW+0.2*sL) + "px"});
	  				_this.hudInfo.css({width:sL*0.9+"px",
	  								height:sH*0.6+"px",
	  								top:(sT+0.2*sH) + "px",
	  								left:0.05*sL + "px"});
	  				$('.hudButton').css({width: 100+"%",
	  									 height: 25+"%"})
	  			}
	  			else{
	  				sW= w*ratio;
	  				sH= w*ratio/ratioLH;
	  				sT= (h*0.5-w*(ratio/ratioLH)/2);
	  				sL=(w*0.5-w*(ratio)/2);

	  				_this.hudButton.css({width:sW+"px",
	  								height:sT+"px",
	  								top:(sT + sH) + "px",
	  								left:(sL) + "px"});
	  				_this.hudInfo.css({width:sW+"px",
	  								height:sT+"px",
	  								top:(0) + "px",
	  								left:(sL) + "px"});
	  				$('.hudButton').css({width: 25+"%",
	  									 height: 100+"%"})
	  			}
	  			$('#stage').css({width: sW+"px",
	  							height: sH+"px",
	  							top: sT + "px",
	  							left:sL + "px"});
	  			
			};
		};
		
		/**
		 * fonction destroy.
		 */
		this.destroy = function(){
			$( window ).off("resize");
			$( window ).off("orientationchange");
			this.stage.remove();
			this.stage = null;
		};
		
	}
	setMethode.call(GameManager.prototype);
	GameManager.prototype.Constructer = GameManager;

	return GameManager;
});