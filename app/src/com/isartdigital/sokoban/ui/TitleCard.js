//La Class TitleCard extends Screen
define(['jquery','utils/ui/Screen',
		'sokoban/game/abstrait/score',
		'utils/Config',
		'utils/sound/SoundFX'],function($,Screen,score,Config, SoundFX){
	//Fonction Constructer
	function TitleCard(callback,div){
		Screen.call(this,callback); // equivalent de super();
		this.maison1 = $('<div class = "house Trans leftH"></div>');
		this.maison2 = $('<div class = "house Trans"></div>');
		this.maisonR1 = $('<div class = "houseR Trans leftH"></div>');
		this.maisonR2 = $('<div class = "houseR Trans"></div>');
		this.moon = div;
		this.ground = $('<div class = "sol Trans"></div>');
		this.barque = $('<div class = "barque Trans"></div>');
		this.player = $('<div class = "Player idle TitleSize Trans"></div>');
		this.shadow = $('<div class = "Shadow TitleSize idle Trans"></div>');
		this.playerR = $('<div class = "PlayerR idle TitleSize Trans"></div>');
		this.shadowR = $('<div class = "ShadowR idle TitleSize Trans"></div>');
		this.titre = $('<div class = "titre Trans">Soul of Hiroyuki</div>');
		this.ShadowCenter = $('<div class = "ShadowCenter"></div>');
		this.haloGround = $('<div class = "haloGround Trans"></div>');
		this.river = $('<div class = "river Trans"></div>');

		this.buttonPlay = $('<button class = "button Trans" type="button">'+Config.getTrans('LABEL_PLAY')+'</button>');
		this.buttonHelp = $('<button class = "button Trans" type="button">'+Config.getTrans('LABEL_HELP')+'</button>');
		this.buttonCredit = $('<button class = "button Trans" type="button">'+Config.getTrans('LABEL_CREDIT')+'</button>');
		this.buttonHS = $('<button class = "button Trans" type="button">High score</button>');
		this.cheat = $('<button class = "button Trans" type="button">Cheat</button>');
		this.mute = $('<button class = "button Trans" type="button">Mute</button>');
		this.message = $('<div class = "Maintitre">Soul of Hiroyuki</div>');

		this.muteBool = false;
		this.buttonLogin = $('<button class = "loginButton Trans" type="button">Login</button>');
		this.login = $('<input name="login" type="text" id="pseudo"/>');
		this.loginZone = $('<div class = "login Trans"></div>');

	}

	//tentative d'heritage

	function setMethode(){
		this.init = function(){
			this.div.append(this.haloGround);
			this.div.append(this.maison1);
			this.div.append(this.maison2);
			this.div.append(this.maisonR1);
			this.div.append(this.maisonR2);
			this.div.append(this.playerR);
			this.div.append(this.shadowR);
			this.div.append(this.river);
			this.div.append(this.moon);
			this.div.append(this.ground);
			this.div.append(this.barque);
			this.div.append(this.player);
			this.div.append(this.shadow);
			this.div.append(this.titre);
			this.shadow.append(this.ShadowCenter);

			this.loginZone.append(this.login);
			this.loginZone.append(this.buttonLogin);
			this.div.append(this.loginZone);

			this.river.css({top:70+'%'});
			this.haloGround.css({top:35+'%'});
			this.ground.css({top:60+'%'});
			this.barque.css({top:70+'%',left:60+'%'});
			this.maison1.css({top:50+'%',left:50+'%'});
			this.maison2.css({top:50+'%',left:80+'%'});
			this.maisonR1.css({top:70+'%',left:50+'%'});
			this.maisonR2.css({top:70+'%',left:80+'%'});
			this.moon.css({top:30+'%',left:65+'%'});
			this.player.css({top:60+'%',left:70+'%'});
			this.shadow.css({top:50+'%',left:30+'%'});
			this.playerR.css({top:70+'%',left:70+'%'});
			this.shadowR.css({top:70+'%',left:30+'%'});
			this.titre.css({top:30+'%',left:5+'%'});

			this.loginZone.css({top:90+'%',left:42+'%'});
			this.moon.append(this.buttonPlay);
			this.moon.append(this.buttonHelp);
			this.moon.append(this.buttonCredit);
			this.moon.append(this.buttonHS);
			this.moon.append(this.cheat);
			this.moon.append(this.mute);
			this.moon.append(this.message);
			this.message.css('display' , 'none');
			this.message.css({top:45+'%',left:20+'%',width:60+'%',height:(20)+'%'});

			var that = this;
			this.buttonLogin.click(function() {
				if (that.login.val()) {
					that.buttonLogin.off("click");
					score.init(that.login.val(),that.menu.bind(that));
				};
			});

		};

		this.menu = function(){
			var that = this;
			this.menuStepOne();
			this.moon.on("transitionend",function(){that.menuStepTwo();});
		};

		this.menuStepOne = function(){
			this.river.css({top:68+'%',height:30+'%'});
			this.haloGround.css({top:30+'%',height:65+'%'});
			this.ground.css({top:55+'%',left: -20+'%',height:15+'%',width: 120+'%'});
			this.barque.css({top:70+'%',left:47+'%',width:(10*1.8)+'%',height:10+'%'});
			this.maison1.css({top:40+'%',left:35+'%',width:15+'%',height:15+'%'});
			this.maison2.css({top:40+'%',left:75+'%',width:15+'%',height:15+'%'});
			this.maisonR1.css({top:70+'%',left:35+'%',width:15+'%',height:15+'%'});
			this.maisonR2.css({top:70+'%',left:75+'%',width:15+'%',height:15+'%'});
			this.moon.css({top:23+'%',left:57.5+'%',width:12+'%',height:(12*1)+'%'});
			this.player.css({top:55+'%',left:60+'%',width:(15*0.64)+'%',height:15+'%'});
			this.shadow.css({top:45+'%',left:5+'%',width:(11*0.64)+'%',height:11+'%'});
			this.playerR.css({top:70+'%',left:60+'%',width:(15*0.64)+'%',height:15+'%'});
			this.shadowR.css({top:70+'%',left:5+'%',width:(15*0.64)+'%',height:15+'%'});
			this.titre.css({top:20+'%',left:-55+'%',width:(50*1.4)+'%',height:50+'%'});
			this.loginZone.css({top:120+'%',left:42+'%'});

		};

		this.menuStepTwo = function(){
			this.river.css({top:180+'%',height:80+'%'});
			this.haloGround.css({top:190+'%',height:70+'%'});
			this.haloGround.css({top:120+'%',height:100+'%'});
			this.ground.css({top:150+'%',left: -225+'%',height:45+'%',width: 400+'%'});
			this.barque.css({top:180+'%',left:-30+'%',width:(40*1.8)+'%',height:40+'%'});
			this.maison1.css({top:110+'%',left:-100+'%',width:50+'%',height:50+'%'});
			this.maison2.css({top:110+'%',left:170+'%',width:50+'%',height:50+'%'});
			this.maisonR1.css({top:190+'%',left:-100+'%',width:50+'%',height:50+'%'});
			this.maisonR2.css({top:190+'%',left:170+'%',width:50+'%',height:50+'%'});
			this.moon.css({top:0+'%',left:0+'%',width:100+'%',height:(100*1)+'%'});
			this.player.css({top:120+'%',left:45+'%',width:(40*0.64)+'%',height:40+'%'});
			this.shadow.css({top:60+'%',left:-100+'%',width:(40*0.64)+'%',height:40+'%'});
			this.playerR.css({top:130+'%',left:45+'%',width:(40*0.64)+'%',height:40+'%'});
			this.shadowR.css({top:90+'%',left:-100+'%',width:(40*0.64)+'%',height:40+'%'});
			this.titre.css({top:-10+'%',left:-150+'%',width:68+'%',height:98+'%'});
			this.moon.off("transitionend");
			var that = this;
			setTimeout(function(){ that.moon.on("transitionend",function(){that.menuStepThree(that.moon);}); }, 100);
			
		};

		this.menuStepThree = function(moon){
			moon.off("transitionend");

			this.river.remove();
			this.haloGround.remove();
			this.maison1.remove();
			this.maison2.remove();
			this.maisonR1.remove();
			this.maisonR2.remove();
			this.ground.remove();
			this.barque.remove();
			this.player.remove();
			this.shadow.remove();
			this.playerR.remove();
			this.shadowR.remove();
			this.titre.remove();
			this.loginZone.remove();

			this.getScreen();
			
		};

		this.getScreen = function(){
			this.buttonPlay.css({top:5+'%',left:42.5+'%',width:15+'%',height:(15)+'%'});
			this.buttonHelp.css({top:16+'%',left:16+'%',width:15+'%',height:(15)+'%'});
			this.buttonCredit.css({top:16+'%',left:71.25+'%',width:15+'%',height:(15)+'%'});
			this.buttonHS.css({top:80+'%',left:42.5+'%',width:15+'%',height:(15)+'%'});
			this.cheat.css({top:71.25+'%',left:16+'%',width:15+'%',height:(15)+'%'});
			this.mute.css({top:71.25+'%',left:71.25+'%',width:15+'%',height:(15)+'%'});
			this.message.fadeIn();
			var that = this;
			this.buttonPlay.click(function() {
  				that.buttonPlay.off("click");
  				that.leave(that.buttonPlay,"Play");
			});
			this.buttonHelp.click(function() {
  				that.buttonHelp.off("click");
  				that.leave(that.buttonHelp,"Help");
			});
			this.buttonCredit.click(function() {
  				that.buttonCredit.off("click");
  				that.leave(that.buttonCredit,"Credit");
			});
			this.buttonHS.click(function() {
  				that.buttonHS.off("click");
  				that.leave(that.buttonHS,"HS");
			});
			this.cheat.click(function() {
  				score.cheat(function(){});
			});
			this.mute.click(function() {
  				that.muteBool = !that.muteBool;
  				if (that.muteBool) {
  					that.mute.addClass("lvllock");
  					 SoundFX.stopSound();
  				}else{
  					that.mute.removeClass("lvllock");
  					SoundFX.playSound("maintheme");
  				}
			});
		};

		this.leave = function(button,target){
			var that = this;
			this.message.fadeOut();
			button.css({top:50+'%',left:50+'%',width:0+'%',height:0+'%'});
			setTimeout(function(){
			 	that.buttonPlay.css({top:50+'%',left:50+'%',width:0+'%',height:0+'%'});
				that.buttonHelp.css({top:50+'%',left:50+'%',width:0+'%',height:0+'%'});
				that.buttonCredit.css({top:50+'%',left:50+'%',width:0+'%',height:0+'%'});
				that.buttonHS.css({top:50+'%',left:50+'%',width:0+'%',height:0+'%'});
				that.cheat.css({top:50+'%',left:50+'%',width:0+'%',height:0+'%'});
				that.mute.css({top:50+'%',left:50+'%',width:0+'%',height:0+'%'});
				that.buttonPlay.off("click");
				that.buttonHelp.off("click");
				that.buttonCredit.off("click");
				that.buttonHS.off("click");
				that.mute.off("click");
				that.cheat.off("click");
				that.moon.on("transitionend",function(){
					that.moon.off("transitionend");
					that.callback(target);
				}); 
			}, 600);
		};

		this.destroy = function(){
			this.river.remove();
			this.haloGround.remove();
			this.maison1.remove();
			this.maison2.remove();
			this.maisonR1.remove();
			this.maisonR2.remove();
			this.moon.remove();
			this.ground.remove();
			this.barque.remove();
			this.player.remove();
			this.shadow.remove();
			this.playerR.remove();
			this.shadowR.remove();
			this.titre.remove();

			this.haloGround = null;
			this.maison1 = null;
			this.maison2 = null;
			this.maisonR1 = null;
			this.maisonR2 = null;
			this.moon = null;
			this.ground = null;
			this.barque = null;
			this.player = null;
			this.shadow = null;
			this.playerR = null;
			this.shadowR = null;
			this.titre = null;
			Screen.prototype.destroy();
		};
	}

	TitleCard.prototype =  Object.create(Screen.prototype); //ici on recupère les methodes de Screen.
	setMethode.call(TitleCard.prototype);
	TitleCard.prototype.Constructer = TitleCard;

	return TitleCard;

});