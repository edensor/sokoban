define(['jquery'],function($){

	var loadArray = ["./assets/arrowW.png",
				  "./assets/arrowascW.png",
				  "./assets/barqueW.png",
				  "./assets/faceWallW.png",
				  "./assets/faceWallRW.png",
				  "./assets/mur-horrorW.png",
				  "./assets/ombre-angleW.png",
				  "./assets/plancher-horrorW.png",
				  "./assets/playerW.png",
				  "./assets/playerRW.png",
				  "./assets/rubantW.png",
				  "./assets/rubantNoirW.png",
				  "./assets/ruban-sur-tombeW.png",
				  "./assets/rubanB-sur-tombeW.png",
				  "./assets/shadowW.png",
				  "./assets/shadowRW.png",
				  "./assets/tombeW.png",
				  "./sounds/main_theme.mp3",
				  ];

	
	MyAjax={};

	MyAjax.getStat = function(login,callBack){
	    callBack({"level":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"numRestart":"0"});
	};

	MyAjax.setStat = function(login,lvl,numMove,callBack){
		callBack();
	};

	MyAjax.getHS = function(callBack){
		$.ajax({
	    	url: './php/geths.php',
	    	type : 'post',
	    	success : function(data){
	    		callBack(JSON.parse(data));
	    	},
	    	error : function(){
	    		console.log("can't access setStat.php");
	    	}
	    });
	};

	MyAjax.getTranslation = function(callBack1,callback2){
		$.ajax({
	    	url: "./assets/LocalizedTextField.xml",
	    	dataType : 'xml',
			async: true,
			cache: false,
	    	success : function(data){
	    		var xml = data;
	    		callBack1($(xml),callback2);
	    	},
	    	error : function(){
	    		console.log("can't access LocalizedTextField.xliff");
	    	}
	    });
	};

	MyAjax.massLoader = function(callBack,div){
		var lcallback = function(){
						var total = loadArray.length;
						var j =0;
		    			return function(){
		    				j++;
		    				console.log(j/total);
		    				div.css({width:((j/total)*100)+'%'});
		    				if (j/total === 1) callBack();
		    			}
			    	}();
		for (var i = loadArray.length - 1; i >= 0; i--) {
			Url = loadArray[i];
			$.ajax({
		    	url: Url,
		    	type : 'get',
				async: true,
				cache: false,
		    	success : lcallback,
	    		error : function(){
	    		console.log("can't access assets");
		    	}
	    	});
		};
	};
		
	return MyAjax;
});