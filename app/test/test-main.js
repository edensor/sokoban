var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    //console.log(file);
    if (/spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

console.log(tests.length);

var require = {
    // Karma serves files from '/base'
    baseUrl: '/base/app/src',

    paths: {
        'jquery':'../libs/jquery-1.11.3.min',
        'phfinding':'../libs/pathfinding',
        'sokoban':'./com/isartdigital/sokoban',
        'utils':'./com/isartdigital/utils',
        "howler" : "../libs/howler.min"
    },

    shim: {
        'underscore': {
            exports: '_'
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
};