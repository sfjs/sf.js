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
TestInstance.prototype.optionsToGrab = {
    test1: {
        value: "test1-value"
    },
    test2: {
        processor: function (option) {
            return "aaaa";
        }
    },
    test3: {
        domAttr: "someAttr"
    },
    test4: {
        domAttr: "someAttr",
        processor: function (node,val,key) {
            return val+"aaaa";

        }
    },
    test5: {
        value: "bb",
        processor: function (node,val,key) {
            return val+"aaaa";

        }
    }
};

describe('BaseDomConstructor', function () {
    describe('#grabOptions()', function () {
        it('should have method grabOptions', function () {
            expect(TestInstance.prototype.grabOptions).to.exist;
        });
        it('grabOptions and its a function', function () {
            expect(TestInstance.prototype.grabOptions).be.a('function');
        });
        var testDomNode = document.createElement("div");
        testDomNode.setAttribute("someAttr", "test");

        it('should return default option if node have no attr', function () {
            expect(new TestInstance(sf,testDomNode).options).to.have.property('test1').with.equal("test1-value");
        });
        it('should return processed option if processor available', function () {
            expect(new TestInstance(sf,testDomNode).options).to.have.property('test2').with.equal("aaaa");
        });
        it('should return option from dom', function () {
            expect(new TestInstance(sf,testDomNode).options).to.have.property('test3').with.equal("test");
        });
        it('should return processed option from dom if processor available', function () {
            expect(new TestInstance(sf,testDomNode).options).to.have.property('test4').with.equal("testaaaa");
        });
        it('should return processed option from default value if processor available nd dom attribute not available', function () {
            expect(new TestInstance(sf,testDomNode).options).to.have.property('test5').with.equal("bbaaaa");
        });
    });

});

