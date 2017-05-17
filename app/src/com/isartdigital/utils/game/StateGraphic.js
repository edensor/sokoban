//La Class stateGraphic extends GameObject

define(['jquery','utils/game/GameObject'],function($,GameObject){

	const DEFAULT_STATE = "default";
	//Fonction Constructer
	function StateGraphic(assetName,x,y){
		this.assetName = assetName;
		this.state = null;
		this.loop = false;
		this.src = null;
		GameObject.call(this,x,y); // equivalent de super();
		this.anim = $('<div class = "anim"></div>');
		this.shadow = $('<div class = "fxShadow"></div>');
		this.halo = $('<div class = "halo"></div>');
		this.setState("");
		this.div.append(this.anim);
		this.anim.append(this.shadow);
	}

	//tentative d'heritage

	function setMethode(){
		this.setState = function(pState){
			if (pState === this.state) { return};
			var body = this.anim;
			if (!body.hasClass(this.assetName)) {
				body.addClass(this.assetName);
			};
			body.addClass( pState );
			body.toggleClass( this.state );
			this.state = pState;

			return;
		};
		this.clearState = function(){
			if (this.state != null) {
				this.pause();
				this.removeAnime();
			}
			this.state = null;
		};
		this.removeAnime = function(){
			// pas fini.
		};
		this.pause = function(){
			// a remplire.
		};
		this.resume = function(){
			// a remplire.
		};
		this.isAnimEnd =  function(){
			// a remplire.
		};
		this.destroy = function(){
			this.clearState();
			this.shadow.remove();
			this.anim.remove();
			this.halo.remove();
			this.shadow = null;
			this.anim = null;
			this.halo = null;
			GameObject.prototype.destroy.call(this);
		};

	}

	StateGraphic.prototype =  Object.create(GameObject.prototype);
	setMethode.call(StateGraphic.prototype);
	StateGraphic.prototype.Constructer = StateGraphic;


	return StateGraphic;

});