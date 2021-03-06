var fs = require('fs'),
path = require('path');
_ = require('lodash');
should = require('should');

var Mocha = require('mocha');
var mocha = new Mocha();

log=console.log;

// Instantiate a Mocha instance.

process.env.NODE_ENV = 'local';
process.env.DEBUG = '*';
Matrix = require('../index.js').Matrix;

setTimeout(function(){
  log('timeout')
  Matrix.events.on('matrix-ready', function(){
    var testDir = __dirname;

    log('ready')

    // Add each .js file to the mocha instance
    fs.readdirSync(testDir).filter(function(file) {
      // Only keep the .js files
      return file.substr(-7) === 'test.js';

    }).forEach(function(file) {
      console.log('Test Loading', file);
      mocha.addFile(
        path.join(testDir, file)
      );
    });

    // Run the tests.
    mocha.run(function(failures) {
      process.on('exit', function() {
        process.exit(failures);
      });
      Matrix.haltTheMatrix();
    });
  })
}, 500 )
