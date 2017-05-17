define(['jquery','sokoban/game/sprites/Box',
		'sokoban/game/sprites/Player',
		'sokoban/game/sprites/Shadow'
		,'sokoban/game/sprites/Tiles'
		,'sokoban/game/sprites/Wall'],function($,Box,Player,Shadow,Tiles,Wall){

			
	function LevelGenerator(JsonArray){

		this.lvl = {map:[],par: 0,nmbS:0,delayS:0};
	}

	function setMethode(){
		this.initMap = function (){
			this.lvl.map =  [];
			Tiles.prototype.list = [];
			for (var i = 0; i < 9; i++) {
				this.lvl.map.push(new Array(9));
			}
		};
		
		this.implementMap =  function (pMap){
			this.lvl.par = pMap.par;
			this.lvl.nmbS = pMap.nmbS;
			this.lvl.delayS = pMap.delayS;
			var length1 = pMap.map.length;
			for (var y = 0; y < length1; y++) {
				var length2 = pMap.map[y].length;
				for (var x = 0; x < length2; x++) {
					switch(pMap.map[y].charAt(x)){
						case '#':
							this.lvl.map[x][y] = new Wall(x,y);
							break;
						case '@':
							this.lvl.map[x][y] = new Tiles("Ground",x,y);
							this.lvl.map[x][y].containe.push(new Player(x,y));
							break;
						case '+':
							this.lvl.map[x][y] = new Tiles("Target",x,y);
							this.lvl.map[x][y].containe.push(new Player(x,y));
							break;
						case '$':
							this.lvl.map[x][y] = new Tiles("Ground",x,y);
							this.lvl.map[x][y].containe.push(new Box("Box",x,y));
							break;
						case '*':
							this.lvl.map[x][y] = new Tiles("Target",x,y);
							this.lvl.map[x][y].containe.push(new Box("Box",x,y));
							break;
						case '.':
							this.lvl.map[x][y] = new Tiles("Target",x,y);
							break;
						case ' ':
							this.lvl.map[x][y] = new Tiles("Ground",x,y);

							break;
						case 'v':
							this.lvl.map[x][y] = new Tiles("Void",x,y);

							break;
					}
				};
			};
		};

		this.creatMap =  function(JsonArray){
			this.initMap();
			this.implementMap(JsonArray);
			return this.lvl;
		}

		this.destroy = function(){
			this.lvl = null;
		}

	}

	setMethode.call(LevelGenerator.prototype);




	return LevelGenerator;

});