define(['jquery','utils/loader/myAjax'],function($,myAjax){
	//objet score qui gere le score du player

	var score = {};

	/**
	 * fonction qui initialise le scores avec de l'ajax.
	 * @login le login de l'utilisateur.
	 * @callback fonction a appeler un fois l'initialisation fini.
	 */
	score.init = function(login,callback){
		var that = this;
		this.login = login;
		var lcallback = function(data){
			that.stat = data;
			callback();
		};
		myAjax.getStat(login,lcallback);
	};

	score.cheat = function(callback){
		this.stat = {"level":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],"numRestart":"0"};	
		callback();
	};

	/**
	 * fonction qui actualise le scores d'un niveau avec de l'ajax si l'utilisateur a fait mieux.
	 * @numlvl l'ID du eau joué.
	 * @login le login de l'utilisateur.
	 * @callback fonction a appeler un fois l'initialisation fini.
	 */
	score.addScore = function(numlvl,score,callback){
		var lscore = this.stat.level[numlvl];
		if (lscore === 0 || lscore< score) {
			this.stat.level[numlvl] = score;
			console.log(score);
			myAjax.setStat(this.login,numlvl+1,score,callback);
			return;
		};
		callback();
	};

	/**
	 * fonction qui recupère le par des niveaux.
	 * @mapArray tableau contenant les maps avec leur description.
	 */
	score.getPar = function(mapArray){
		var lLength = mapArray.length;
		this.par = [];
		for (var i = 0; i < lLength; i++) {
			this.par.push(mapArray[i].par);
		};
	}

	/**
	 * fonction additionne les scores de tout les niveau .
	 */
	score.setfinalScore = function(){
		var resut = 0;
		for (var i = this.stat.level.length - 1; i >= 0; i--) {
			resut += this.stat.level[i];
		}
		return resut;
	}

	/**
	 * fonction qui construit le tableau des high Score avec de l'ajax.
	 * @callback fonction a appeller une fois fini.
	 */
	score.getHS =  function(callback){
	// 	var that = this;
	// 	var lcallback = function(data){
	// 		var playerIsIn = false;
	// 		var lLength = data.length;
	// 		var lScore = 0;
	// 		var table = '<TABLE><CAPTION><b>High Score</b></CAPTION><TR> <TH> Pseudo </TH>';
	// 		table += '<TH>Score</TH>';
	// 		table += '</TR>';
	// 		for (var i = 0; i < lLength; i++) {
	// 			if (data[i].pseudo === that.login) playerIsIn = true;
	// 			lScore = 0;
	// 			table += '<TR>';
	// 			table += '<TH>'+(data[i].pseudo)+'</TH>';
	// 			for (var j = 0; j < 15; j++) {
	// 				lScore += data[i].level[j];
	// 			}
	// 			table += '<TH>'+(lScore)+'</TD>';
	// 			table += '</TR>';
	// 		}
	// 		if (!playerIsIn) {
	// 			lScore = 0;
	// 			table += '<TR>';
	// 			table += '<TH>'+(that.login)+'</TH>';
	// 			for (var j = 0; j < 15; j++) {
	// 				lScore += that.stat.level[j];
	// 			}
	// 			table += '<TH>'+(lScore)+'</TD>';
	// 			table += '</TR>';
	// 		}
	// 		table += '</TABLE> ';
	// 		console.log(table);
	// 		callback(table);
	// 	};

	// 	MyAjax.getHS(lcallback);
		callback();
	 }


	return score;

});