define(['jquery','utils/loader/myAjax'],function($,myAjax){

var Config = {};

Config.localisation = "US";

Config.init = function(callback){
	myAjax.getTranslation(Config.setData,callback);
};

Config.setData =  function(pData,callback){
	Config.source = '';
	if (Config.localisation === "US") Config.source = "source";
	else Config.source = "target";
	Config.data = pData;
	callback();
}

Config.getTrans = function(id){
	console.log(Config.data.find('#'+id+' '+Config.source).text());
	return Config.data.find('#'+id+' '+Config.source).text();
}

return Config;

});