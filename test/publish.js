var mocha       = require('mocha');
var chai        = require('chai');
var should      = require('should');
var fs          = require('fs-extra');
var _           = require('underscore');

var add         = require('../src/lib/add.es6');
var init        = require('../src/lib/init.es6');
var scenarios   = require('./helpers/scenarios.js');

var PKG         = require('../src/lib/package.es6');
var CONFIG      = require( '../src/lib/config.es6' );

chai.should();

var working_dir = __dirname+'/.scenarios/a';

var config = CONFIG({working_dir}, {cli: false});
config.initAll();

describe('spore#publish', function() {
  
  before( function() {
    scenarios.setupAll();
    
    scenarios.setup( 'a' )
    
    init(config);
    
    config.path_to_file = 'contracts/a.sol';
    config.initPkg();
    
    add( config );
    
  });
  
  after( function() {
    scenarios.cleanup();
  });
  
  it("should have the correct hash", function(done){
    
    var hash = require('../src/lib/publish.es6')( config );
    
    hash.should.eql('QmU1CxrGNyHA4idkExQgAi7JZmJ1f3zVfWpa76m7LPnBbK');
    
    done();
  });
  
  it("should be a different hash if something change", function(done){
    
    var path_to_file = config.path_to_file = 'readme.md';
    
    fs.writeFileSync( working_dir + '/' + path_to_file, '# title' );
    
    add( config );
    
    var hash = require('../src/lib/publish.es6')( config );
    
    hash.should.not.eql('QmU1CxrGNyHA4idkExQgAi7JZmJ1f3zVfWpa76m7LPnBbK');
    
    done();
  });
  
});
