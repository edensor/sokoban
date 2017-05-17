define(['jquery','sokoban/controller/Controller'
		,'sokoban/game/sprites/Shadow'
		,'sokoban/game/abstrait/Mobile'
		,'sokoban/game/sprites/Tiles'
		,'utils/Config'
		,'phfinding'],function($,Controller,Shadow,Mobile,Tiles,Config,PathFinding){

	const SIZE = 11;
	const WIDTH = 9;
	const HEIGHT = 9;
	/**
	 * Classe La plus fournie, elle gère le Hud les conditions de undo redo.
	 * Les Controles, le PathFinding.
	 * @author Marco Martella
	 */

	/**
	 * fonction Constructeur
	 * @map  La Grid qui contient tout les Tiles.
	 * @numLvl  le numero du level
	 * @stage  là ou on vas append nos affaire.
	 * @hudButton  La ou on append les Boutons du Hud
	 * @replay  fonction pour relancher le level
	 * @screenCallback  fonction pour quitter le niveau et retourner sur la lune.
	 */
	function Stage(map,numLvl,stage,hudButton,hudInfo,replay,screenCallback,resize){
		this.map = map.map;
		this.par = map.par;
		this.nmbS = map.nmbS;
		this.nombreShadow = map.nmbS;
		this.delayS = map.delayS;
		this.numMove = 0;
		this.score = 0;
		this.numLvl = numLvl;
		this.player =  null;
		this.controller =  new Controller(this);
		this.stage = stage;
		this.hudButton = hudButton;
		this.hudInfo= hudInfo;
		this.resize =  resize;
		this.filtre = $('<div class = "filtre"></div>');
		this.filtre.css({zIndex:10});
		this.finder = new PathFinding.AStarFinder({diagonalMovement: PathFinding.DiagonalMovement.Never});
		this.ReplayF = replay;
		this.btnQuit = $(' <button class = "hudButton " type="button">'+Config.getTrans('LABEL_BACK')+'</button> ');
		this.btnReplay = $(' <button class = "hudButton " type="button">'+Config.getTrans('LABEL_RETRY')+'</button>nf ');
		this.btnUndo = $(' <button class = "hudButton " type="button">'+Config.getTrans('LABEL_UNDO')+'</button> ');
		this.btnRedo = $(' <button class = "hudButton " type="button">'+Config.getTrans('LABEL_REDO')+'</button> ');
		var that = this;
		this.screenCallback = screenCallback;
		this.btnQuit.click(function(){
			that.screenCallback("Play");
			that.letLeave();
		});
		this.btnReplay.click(that.replayMap.bind(that));
		this.btnUndo.click(that.undo.bind(that));
		this.btnRedo.click(that.redo.bind(that));
		this.hudButton.append(this.btnQuit);
		this.hudButton.append(this.btnReplay);
		this.hudButton.append(this.btnUndo);
		this.hudButton.append(this.btnRedo);
		
		this.redoAvable = 0;
		this.mouse= {x:0,y:0,state:"up"};
		this.resize();
	}

	function setMethode(){
		/**
		 * fonction qui Affiche les Tiles de la grid (this.stage) et ce que contient les Tiles.
		 */
		this.display = function(){
			this.refresHud();
			var map = this.map;
			var tiles;
			this.stage.empty();
			var length1 = map.length;
			for (var y = 0; y < length1; y++) {
				var length2 = map[y].length;
				for (var x = 0; x < length2; x++) {
					tiles = map[x][y];
					this.stage.append(tiles.div);
					if (tiles.assetName === "Target"){
						this.stage.append(tiles.halo);
						tiles.halo.css({bottom:((HEIGHT-1.7-y)*SIZE+1)+"%",left:(x-0.64)*SIZE+"%",zIndex:y});
					}
					tiles.div.css({left:x*SIZE+"%",bottom:(HEIGHT-1-y)*SIZE+"%"});

					if (tiles.assetName === "Wall") {
						if (x<8 && (map[x+1][y].assetName !== "Wall" && map[x+1][y].assetName !== "Void") ) {
							map[x+1][y].shadow.addClass("shadowLeft");
						};
						if (y<8 && (map[x][y+1].assetName !== "Wall" && map[x][y+1].assetName !== "Void") ) {
							map[x][y+1].shadow.addClass("shadowTop");
						};
					};

					var length3 = tiles.containe.length;
					for (var i = 0; i < length3; i++) {
						if (tiles.containe[i].assetName === "Player") {
							this.player = tiles.containe[i];
							this.controller.player = this.player;
						};
						this.stage.append(tiles.containe[i].halo);
						this.stage.append(tiles.containe[i].div);
					};
				};
			};
			//this.stage.append(this.filtre);
		};

		/**
		 * Fonction qui setup les ecoutes dévènemnt sourie et touch, et qui associe les callback
		 * ces callback contiennent tout l'aspect pathfinding.
		 */
		this.clickAnable = function(){
			var that = this;
			var stage = this.stage;
			var countFunction = function(){
									that.numMove++;
			         				that.someThingChange();
			         				that.redoAvable = 0;
								};

			stage.mousedown(function(e){
				that.mouse.state = "down";
				var pX = that.player.x;
				var pY = that.player.y;
				var x = Math.floor(100/SIZE*(e.clientX-stage.offset().left)/stage.width());
				var y = Math.floor(100/SIZE*(e.clientY-stage.offset().top)/stage.height());
				that.mouse.x = x;
				that.mouse.y = y;
				if (that.map[x][y].isPushable()) {
					if (Math.abs(x-pX)+Math.abs(y-pY) === 1) {
						if(that.player.tryMove(that.giveDirection(pX,x,pY,y),that.map)){
							that.numMove++;
         					that.someThingChange();
         					this.redoAvable = 0;
         					Mobile.killDisactive();
         					that.player.gState ="push";
         					that.player.div.on("transitionend",function(){
         						that.player.div.off("transitionend");
         						that.player.gState ="wait";});
						}
					}
					else{
						var path;
						var lastPath = [];
						var grid
						var walkableMatrix = that.getWalkabilityMatrix();
						var adjArray = that.giveAdjacante(x,y);
						for (var i = adjArray.length - 1; i >= 0; i--) {
							grid = new PathFinding.Grid(WIDTH, HEIGHT, walkableMatrix);
							path = that.finder.findPath(pX, pY, adjArray[i].x, adjArray[i].y, grid);
							if (lastPath.length === 0 || (lastPath.length !== 0 && path.length !== 0 && lastPath.length > path.length)){
								lastPath = path;
							}
						}
						if (that.redoAvable !== 0) {Mobile.killDisactive();}
						lastPath = that.parsDirection(lastPath);
						that.player.setPath(lastPath);
						that.player.takePath(that.map, countFunction, that.clickAnable.bind(that));
					}
				}
				else{
					var grid = new PathFinding.Grid(WIDTH, HEIGHT, that.getWalkabilityMatrix());
					var path = that.finder.findPath(pX, pY, x, y, grid);
					path = that.parsDirection(path);
					if (path.length > 0) {
						if (that.redoAvable !== 0) {Mobile.killDisactive();}
						that.player.setPath(path);
						that.player.takePath(that.map, countFunction);
					}
				}
			});

			stage.mouseup(function(e){
				that.mouse.state = "up";
			});


			stage.mousemove(function(e){
				if (that.mouse.state === "down") {
					var pX = that.player.x;
					var pY = that.player.y;
					var x = Math.floor(100/SIZE*(e.clientX-stage.offset().left)/stage.width());
					var y = Math.floor(100/SIZE*(e.clientY-stage.offset().top)/stage.height());
					if ((that.mouse.x !== x || that.mouse.y !== y)&&!(x<0||x>8||y<0||y>8)) {
						that.mouse.x = x;
						that.mouse.y = y;
						if (that.player.gState === "move" || that.player.gState === "wait"){
							if (that.map[x][y].isWalkable()) {
								var grid = new PathFinding.Grid(WIDTH, HEIGHT, that.getWalkabilityMatrix());
								var path = that.finder.findPath(pX, pY, x, y, grid);
								if (path.length !==0) {
									path = that.parsDirection(path);
									
									if (that.redoAvable !== 0) {Mobile.killDisactive();}
									that.player.setPath(path);
								}
							}
						}

						if (that.player.gState === "push"){
							if (that.map[x][y].isPushable() === 1) {
								if(that.player.tryMove(that.giveDirection(pX,x,pY,y),that.map)){
									that.numMove++;
		         					that.someThingChange();
		         					that.redoAvable = 0;
		         					Mobile.killDisactive();
		         					that.player.gState ="push";
		         					that.player.div.on("transitionend",function(){
		         						that.player.div.off("transitionend");
		         						that.player.gState ="wait";});
								}
							}
						}
					}
				}
			});

			stage.on('touchmove',function(e){
				stage.off('mousemove' , 'mousedown');
			      e.preventDefault();
			      var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			                  
					var pX = that.player.x;
					var pY = that.player.y;
					var x = Math.floor(100/SIZE*(touch.pageX-stage.offset().left)/stage.width());
					var y = Math.floor(100/SIZE*(touch.pageY-stage.offset().top)/stage.height());
					if ((that.mouse.x !== x || that.mouse.y !== y)&&!(x<0||x>8||y<0||y>8)) {
						that.mouse.x = x;
						that.mouse.y = y;
						if (that.player.gState === "move" || that.player.gState === "wait"){
							if (that.map[x][y].isWalkable()) {
								var grid = new PathFinding.Grid(WIDTH, HEIGHT, that.getWalkabilityMatrix());
								var path = that.finder.findPath(pX, pY, x, y, grid);
								if (path.length !==0) {
									path = that.parsDirection(path);
									
									if (that.redoAvable !== 0) {Mobile.killDisactive();}
									that.player.setPath(path);
								}
								if (that.player.gState === "wait") {
									that.player.takePath(that.map, countFunction);
								};
							}
						}

						if (that.map[x][y].isPushable() && that.player.gState === "wait") {
							if (Math.abs(x-pX)+Math.abs(y-pY) === 1) {
								if(that.player.tryMove(that.giveDirection(pX,x,pY,y),that.map)){
									that.numMove++;
		         					that.someThingChange();
		         					this.redoAvable = 0;
		         					Mobile.killDisactive();
		         					that.player.gState ="push";
		         					that.player.div.on("transitionend",function(){
		         						that.player.div.off("transitionend");
		         						that.player.gState ="wait";});
								}
							}
							else{
								var path;
								var lastPath = [];
								var grid
								var walkableMatrix = that.getWalkabilityMatrix();
								var adjArray = that.giveAdjacante(x,y);
								for (var i = adjArray.length - 1; i >= 0; i--) {
									grid = new PathFinding.Grid(WIDTH, HEIGHT, walkableMatrix);
									path = that.finder.findPath(pX, pY, adjArray[i].x, adjArray[i].y, grid);
									if (lastPath.length === 0 || (lastPath.length !== 0 && path.length !== 0 && lastPath.length > path.length)){
										lastPath = path;
									}
								}
								if (that.redoAvable !== 0) {Mobile.killDisactive();}
								lastPath = that.parsDirection(lastPath);
								that.player.setPath(lastPath);
								that.player.takePath(that.map, countFunction);
							}
						}

						if (that.player.gState === "push"){
							if (that.map[x][y].isPushable() === 1) {
								if(that.player.tryMove(that.giveDirection(pX,x,pY,y),that.map)){
									that.numMove++;
		         					that.someThingChange();
		         					that.redoAvable = 0;
		         					Mobile.killDisactive();
		         					that.player.gState ="push";
		         					that.player.div.on("transitionend",function(){
		         						that.player.div.off("transitionend");
		         						that.player.gState ="wait";});
								}
							}
						}
					}
					
			});

			stage.on('touchestart',function(e){
				 e.preventDefault();
			      var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				var pX = that.player.x;
				var pY = that.player.y;
				var x = Math.floor(100/SIZE*(touch.pageX-stage.offset().left)/stage.width());
				var y = Math.floor(100/SIZE*(touch.pageY-stage.offset().top)/stage.height());
				that.mouse.x = x;
				that.mouse.y = y;
				if (that.map[x][y].isPushable()) {
					if (Math.abs(x-pX)+Math.abs(y-pY) === 1) {
						if(that.player.tryMove(that.giveDirection(pX,x,pY,y),that.map)){
							that.numMove++;
         					that.someThingChange();
         					this.redoAvable = 0;
         					Mobile.killDisactive();
         					that.player.gState ="push";
         					that.player.div.on("transitionend",function(){
         						that.player.div.off("transitionend");
         						that.player.gState ="wait";});
						}
					}
					else{
						var path;
						var lastPath = [];
						var grid
						var walkableMatrix = that.getWalkabilityMatrix();
						var adjArray = that.giveAdjacante(x,y);
						for (var i = adjArray.length - 1; i >= 0; i--) {
							grid = new PathFinding.Grid(WIDTH, HEIGHT, walkableMatrix);
							path = that.finder.findPath(pX, pY, adjArray[i].x, adjArray[i].y, grid);
							if (lastPath.length === 0 || (lastPath.length !== 0 && path.length !== 0 && lastPath.length > path.length)){
								lastPath = path;
							}
						}
						if (that.redoAvable !== 0) {Mobile.killDisactive();}
						lastPath = that.parsDirection(lastPath);
						that.player.setPath(lastPath);
						that.player.takePath(that.map, countFunction);
					}
				}
				else{
					var grid = new PathFinding.Grid(WIDTH, HEIGHT, that.getWalkabilityMatrix());
					var path = that.finder.findPath(pX, pY, x, y, grid);
					path = that.parsDirection(path);
					if (path.length > 0) {
						if (that.redoAvable !== 0) {Mobile.killDisactive();}
						that.player.setPath(path);
						that.player.takePath(that.map, countFunction);
					}
				}
			});
		};

		/**
		 * fonction prend un tableau de coordonner et qui renvois un tableau avec les directions
		 * @path  le tableau que le pathfinding calcule.
		 * @return le tableau associé remplis des directions.
		 */
		this.parsDirection = function(path){
			var newPath =[];
			var lLength = path.length;
			for (var i = 1; i < lLength; i++) {
				newPath.push(this.giveDirection(path[i-1][0],path[i][0],path[i-1][1],path[i][1]));
			}
			return newPath;
		};

		/**
		 * fonction qui prend deux coordonné et qui donne la direction de l'une vers l'autre
		 * @x , @y  coordonné de depart
		 * @dx , @dy  coordonné de destination
		  * @return la direction.
		 */
		this.giveDirection = function(x,dx,y,dy){
			var direction = '';
			var deltaX = x - dx;
			var deltaY = y - dy;
			if (deltaX !== 0 ) {
				direction = deltaX<0 ? "rigth" : "left";
			};
			if (deltaY !== 0 ) {
				direction = deltaY<0 ? "down" : "up";
			};
			return direction;
		};

		/**
		 * fonction qui prend une coordonné renvoie les coordonnés de toutes les case adjacantes.
		 * @x , @y  coordonné d'un Tile
		  * @return un tableau avec les Tiles adjaçantes.
		 */
		this.giveAdjacante = function(x,y){
			var adjArray = [];
			if (x>0) adjArray.push({x:x-1,y:y});
			if (x<9) adjArray.push({x:x+1,y:y});
			if (y>0) adjArray.push({x:x,y:y-1});
			if (y<9) adjArray.push({x:x,y:y+1});
			return adjArray;
		}

		/**
		 * fonction qui calcule le tableau pour le PathFinding.
		  * @return un tableau a deux dimentions remplie de 1 et de 0.
		 */
		this.getWalkabilityMatrix = function(){
			var WalkMatrix = [];
			for (var i = 0; i < HEIGHT; i++) {
				WalkMatrix.push(new Array(9));
			}
			for (var y = 0; y < HEIGHT; y++) {
				for (var x = 0; x < WIDTH; x++) {
					WalkMatrix[y][x] = this.map[x][y].isWalkable() ? 0:1;
				}
			}
			WalkMatrix[this.player.x][this.player.y] = 0;
			return WalkMatrix;
		};

		/**
		 * fonction importante qui gére different cas.
		 * elle a pour but initial de géré les modification du hud.
		 * elle s'aucupe du spawn des ombres et du calcules des trainés au sol des ombres.
		 * elle s'aucupe aussi de check les conditions de victoir
		 */
		this.someThingChange =  function(capture,noGost){
			var boolGost = noGost || "true";
			var boolCapt = capture || "true";
			var numS = this.delayS - this.numMove%this.delayS;
			if (boolGost === "true" && this.numMove !== 0 && this.nmbS >0 && this.numMove%this.delayS === 0) {
				var x = this.player.myPath[0].x;
				var y = this.player.myPath[0].y;
				var lShadow = new Shadow(x,y,this.player.myPath);
				this.map[x][y].containe.push(lShadow);
				this.stage.append(lShadow.halo);
				this.stage.append(lShadow.div);
				this.nmbS--;
			}
			if (boolCapt === "true") {
				Shadow.doActionAll(this.map);
				Mobile.captureInstant();
			}

			this.cleanFxErgo();
			if (Shadow.nmbActive() === 0) {
				this.fxErgo(this.player.myPath,this.player.myPath[0].x,this.player.myPath[0].y);
			}
			else{
				var lshadow = null;
				for (var i = Shadow.list.length - 1; i >= 0; i--) {
					lshadow = Shadow.list[i];
					if (lshadow.active) {
						this.fxErgo(this.player.myPath,lshadow.x,lshadow.y,lshadow.numMove);
					}
				}
			}
			this.hudInfo.empty();
			var text = this.getTextHud();
			this.hudInfo.append(text);

			if (Tiles.isFinish()) {
				this.score = this.numMove <= this.par ? 2:1;
				this.nextMap();
			};

		};

		/**
		 * fonction qui refresh le Hud sans modification.
		 */
		this.refresHud =  function(){
			
			this.hudInfo.empty();
			var text = this.getTextHud();
			this.hudInfo.append(text);

		};

		/**
		 * fonction qui calcule des trainés au sol des ombres.
		 * @pPath un tableau de direction.
		 * @pX, @pY position du joueur.
		 * @pStart la ou en est l'ombre sur son chemin de directions.
		 */
		this.fxErgo =  function(pPath,pX,pY,pStart){
			var start = pStart || 0;
			var lLength = pPath.length;
			x = pX;
			y = pY;
			var dx = 0;
			var dy = 0;
			var direction = "";
			var lvlSHadow = 0;
			var min = Math.min(lLength,this.delayS);

			this.map[x][y].lvlShadow = 1/1.5;
			this.map[x][y].fx.css("background-color", "rgba(0,0,0,"+(1/1.5)+")");

			for (var i = start; i < lLength && i-start < this.delayS; i++) {
				//console.log(i,lLength,pPath[i].d);
				direction = pPath[i].d;
				dx = 0;
				dy = 0;
				switch (direction){
					case "up":
						dy = -1;
					break;
					case "down":
						dy = 1;
					break;
					case "left":
						dx = -1;
					break;
					case "rigth":
						dx = 1;
					break;
					default:
						dx = 0;
						dy = 0;
					break;
				}
				if (x+dx>8||x+dx<0) return;
				if (y+dy>8||y+dy<0) return;
				if (!this.map[x+dx][y+dy].isFxErgoAble()) return;
				lvlSHadow = (min-(i-start))/min/1.5;
				if (this.map[x+dx][y+dy].lvlShadow<lvlSHadow) {
					this.map[x+dx][y+dy].lvlShadow = lvlSHadow;
					this.map[x+dx][y+dy].fx.css("background-color", "rgba(0,0,0,"+lvlSHadow+")");
				}
				x = x+dx;
				y = y+dy;
			}
		}

		/**
		 * fonction qui enlève tout les traces au sol.
		 */
		this.cleanFxErgo = function(){
			for (var x = this.map.length - 1; x >= 0; x--) {
				for (var y = this.map[0].length - 1; y >= 0; y--) {
					if (this.map[x][y].lvlShadow !== 0) {
						this.map[x][y].lvlShadow = 0;
						this.map[x][y].fx.css("background-color", "rgba(0,0,0,"+0+")");
					}
				}
			}
		};

		/**
		 * fonction qui calcule des String pour le Hud.
		 */
		this.getTextHud =  function(){
			var ombre = '';
			var reste = '';
			var deplacement = '';
			var par = '';
			if(this.nmbS > 0){
				reste = Config.getTrans('HUD_TXT1')+" "+this.nmbS+" "+Config.getTrans('HUD_TXT2');
				ombre = Config.getTrans('HUD_TXT3')+" "+(this.delayS - this.numMove%this.delayS)+" "+Config.getTrans('HUD_TXT4');
			}
			deplacement = Config.getTrans('HUD_TXT5')+" "+this.numMove+Config.getTrans('HUD_TXT6');
			par = Config.getTrans('HUD_TXT7')+" "+this.par+" "+Config.getTrans('HUD_TXT8');
			var text = $('<p>'+Config.getTrans('LABEL_LEVEL')+" "+this.numLvl+'<br>'+reste+'<br>'+ombre+'<br>'+deplacement+'<br>'+par+'</p>');
			return text;
		};

		/**
		 * fonction demande a Mobile de fair le Undo général et gère quelque condition.
		 */
		this.undo = function(){
			if (this.numMove !==0) {
				Mobile.undoAll(this.map);
				if (this.numMove >0) this.numMove -=1;
				this.nmbS =this.nombreShadow - Shadow.nmbActive();
				this.someThingChange("false","false");
				this.redoAvable +=1;
			};
		};

		/**
		 * fonction demande a Mobile de fair le Redo général et gère quelque condition.
		 */
		this.redo = function(){
			if (this.redoAvable !==0) {
				Mobile.redoAll(this.map);
				 this.numMove +=1;
				this.someThingChange("false","false");
				this.nmbS =this.nombreShadow - Shadow.nmbActive();
				this.redoAvable -=1;
			};
		};

		/**
		 * fonction qui sonne la fin du niveau.
		 */
		this.nextMap =  function(){
			this.screenCallback("FinishLvl",[this.numMove,this.score,this.par,this.numLvl]);
			this.letLeave();
		};

		/**
		 * fonction qui relance le même niveau.
		 */
		this.replayMap =  function(){
			this.destroy();
			this.ReplayF();
		};

		/**
		 * fonction qui prepart a la fin du niveau.
		 */
		this.letLeave = function(){
			var that = this;
			this.hudInfo.empty();
			this.controller.destroy();
			this.btnQuit.off( "click");
			this.btnReplay.off( "click");
			this.btnUndo.off( "click");
			this.btnRedo.off( "click");
			this.stage.off('touchmove');
			this.stage.off('touchstart');
			this.stage.off('mousedown');
			this.stage.off('mouseup');
			this.stage.off('mousemove');
			setTimeout(function(){ 
				that.destroy();
			}, 1000);
		};

		/**
		 * fonction qui detruit le niveau.
		 */
		this.destroy = function(){
			this.stage.off('touchmove');
			this.stage.off('touchstart');
			this.stage.off('mousedown');
			this.stage.off('mouseup');
			this.stage.off('mousemove');
			this.controller.destroy();
			var map = this.map;
			var tiles;
			this.stage.empty();
			this.finder = null;
			this.filtre = null;
			this.hudInfo.empty();
			this.hudButton.empty();
			var length1 = map.length;
			for (var y = 0; y < length1; y++) {
				var length2 = map[y].length;
				for (var x = 0; x < length2; x++) {
					tiles = map[x][y];
					tiles.destroy;
				};
			};
			this.map = null;
			Shadow.list = [];
			Mobile.list = [];
			Tiles.list = [];
		};
	}

	setMethode.call(Stage.prototype);
	Stage.prototype.Constructer = Stage;

return Stage;

});