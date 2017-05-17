"use strict";
require(['sokoban/game/GameManager'
		,'utils/loader/JsonLoader'
		,'sokoban/ui/UIManager'
		,'utils/loader/myAjax'
		,'utils/Config'
		, 'utils/sound/SoundFX'
		,'jquery'],function(GameManager, JsonLoader, UIManager, myAjax, Config, SoundFX, $){

		var lvlGen = new JsonLoader();

		myAjax.massLoader(function(){
			Config.init(function(){lvlGen.addLevel("level/leveldesign.json",init)});
		},$('#loadBar'));
		
	/**
		 * fonction d'initialisation qui crée le manager des screens et gere un peux de responsive.
	*/
	function init(){
		SoundFX.initSound();
		var screenMaestro = new UIManager(lvlGen);
		onResize();
		$( window ).resize(onResize);
		$( window ).on("orientationchange",onResize());
		setTimeout(function(){SoundFX.playSound("maintheme");},200);
		screenMaestro.init();
	}

	/**
		 * fonction responsive designe.
	*/
	function onResize() {
			var ratio = 1;
			var ratioLH = 1.5;
  			var w = $(window).width();
  			var h = $(window).height();
  			if (h<w) {
  				if (h*ratioLH<w) {
	  				$('#gameStage').css({width: h*ratio*ratioLH+"px",
	  									 height: h*ratio+"px",
	  									 top: (h*0.5-h*ratio/2) + "px",
	  									 left:(w*0.5-h*ratio*ratioLH/2) + "px"});
	  			}
	  			else{
	  				$('#gameStage').css({width: w*ratio+"px",
	  									 height: w*ratio/ratioLH+"px",
	  									 top: (h*0.5-w*(ratio/ratioLH)/2) + "px",
	  									 left:(w*0.5-w*(ratio)/2) + "px"});
	  			}
  			}
  			else{
  				if (w*ratioLH<h) {
	  				$('#gameStage').css({width: w*ratio+"px",
	  									 height: w*ratio*ratioLH+"px",
	  									 top: (h*0.5-w*ratio*ratioLH/2) + "px",
	  									 left:(w*0.5-w*ratio/2) + "px"});
	  			}
	  			else{
	  				$('#gameStage').css({width: h*ratio/ratioLH+"px",
	  									 height: h*ratio+"px",
	  									 top: (h*0.5-h*(ratio)/2) + "px",
	  									 left:(w*0.5-h*(ratio/ratioLH)/2) + "px"});
	  			}
  			}
  			
		}

});