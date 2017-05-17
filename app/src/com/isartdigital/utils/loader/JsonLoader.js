define(['jquery'],function($){
	
	//Fonction Constructer
	function JsonLoader(){
		this.lvlArray =  [];
	}

	function setMethode(){
		this.addLevel = function(URL,callBack){

			var myLvlArray = this.lvlArray;
			$.getJSON( URL, function( data ) {
				 var lLength = data.levelDesign.length;
				 for (var i = 0; i < lLength; i++) {
				 	 myLvlArray.push(data.levelDesign[i]);
				 };
				 callBack();
			});
		};
		
	};

	setMethode.call(JsonLoader.prototype);


	return JsonLoader;

});