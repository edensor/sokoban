define(['jquery'],function($){
	
	//Fonction Constructer
	function Screen(callback){
		this.callback = callback;
		this.div = $('<div class = "Screen"></div>');
	}

	function setMethode(){
		this.destroy = function(){
			this.div.remove();
			this.div = null;
		}
	}

	setMethode.call(Screen.prototype);


	return Screen;

});