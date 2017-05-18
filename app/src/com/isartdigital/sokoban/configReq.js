// you can register settings like this before require.js is loaded
	var require = {
  	 baseUrl: 'src/',
  	 paths:{
		'jquery':'../libs/jquery-1.11.3.min',
		'phfinding':'../libs/pathfinding',
		'sokoban':'./com/isartdigital/sokoban',
		'utils':'./com/isartdigital/utils',
		"howler" : "../libs/howler.min"
	},
	urlArgs:'bust='+(new Date()).getTime(),
	waitSeconds: 200
	};