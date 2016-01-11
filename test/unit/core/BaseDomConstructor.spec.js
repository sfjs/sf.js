"use strict";
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;
var sf = require("../../../src/index");

/**
 * Lets create wen test instance for testing
 * @param spiral
 * @param node
 * @param options
 * @constructor
 */
var TestInstance = function (spiral, node, options) {
    this.init(spiral, node, options);
};
TestInstance.prototype = Object.create(sf.modules.core.BaseDOMConstructor.prototype);


describe('BaseDomConstructor', function(){
    describe('#grabOptions()', function(){
        it('BaseDomConstructor should have method grabOptions', function(){
            expect(TestInstance.prototype.grabOptions).to.exist;
        });
        //TODO more tests
    });

});

