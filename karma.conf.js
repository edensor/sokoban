// list of files / patterns to load in the browser
module.exports = function(config) {
	config.set({
		basePath: './app',
		files: [
			{pattern: 'libs/**/*.js', included: false},
			{pattern: 'src/**/*.js', included: false},
			{pattern: 'test/**/*spec.js', included: false},
	      	'test/test-main.js',

		],

		//list of files to exclude
		exclude: [
		    //'src/com/isartdigital/sokoban/configReq.js'
		],

		frameworks: ['jasmine'],

	    browsers: ['Chrome'],

	    plugins: [
	      'karma-chrome-launcher',
	      'karma-jasmine'
	    ]
	});
};