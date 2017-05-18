define(['jquery', 'utils/loader/JsonLoader'],function($,JsonLoader){
.
	describe('JsonLoader', function () {
		var lvlGen = new JsonLoader();
		lvlGen.addLevel("level/leveldesign.json",function(){});
	  it('should lvlArray length greater than 0', function () {
	    expect(lvlGen.lvlArray.length).toEqual(15);
	  });
	});

});
