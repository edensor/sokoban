define(['jquery'],function($){
	function Controller(level){
		this.player = level.player;
    this.level = level;
		$(document).keydown(this.keyManager.bind(this));
	}

	function setMethode(){
		this.keyManager = function(event){
				var direction = "";
			switch (event.which || event.keyCode){
   			  	case 37: // fleche gauche
      			 	direction =  "left";
      			break;
    			 case 38: // fleche haut
       				direction =  "up";
      			break;
     			case 39: // fleche droite
     				direction =  "rigth";
      			break;
    			 case 40: // fleche bas
      				direction =  "down";
      			break;
  			}
  			if (direction !== "" && this.player.tryMove(direction,this.level.map)) {
  				this.level.numMove++;
          this.level.someThingChange();
          this.level.redoAvable = 0;
  			};
		}

    this.destroy = function(){
      $(document).off('keydown');
    };
		
	}

	setMethode.call(Controller.prototype);
	Controller.prototype.Constructer = Controller;

return Controller;

});