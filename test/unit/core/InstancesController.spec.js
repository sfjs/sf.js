"use strict";
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;


require("../../../src/index");

var Module1 = function (sf, node, options) {
};
Module1.prototype = sf.createModulePrototype();
Module1.prototype.name = "module1";
Module1.prototype.die = function () {};
var testNode0 = document.createElement('div');
testNode0.classList.add('js-sf-module1-class');
document.body.appendChild(testNode0);
var testNode01 = document.createElement('div');

describe('API', function () {
    describe('#sf.registerInstanceType()', function () {
        it("it's a function", function () {
            expect(sf.instancesController.registerInstanceType).be.a('function');
        });
        sf.registerInstanceType(Module1,"js-sf-module1-class");
        it("on called should register new instance", function () {
            expect(window.sf.instancesController._storage.instances[Module1.prototype.name])
        });
        it("new instance should be array", function () {
            expect(window.sf.instancesController._storage.instances[Module1.prototype.name]).be.a('array')
        });
        it("0.node element of array should equal testNode0", function () {
            expect(window.sf.instancesController._storage.instances[Module1.prototype.name][0].node).to.equal(testNode0);
        });
    });
    describe('#sf.addInstance()', function () {
        sf.instancesController.addInstance(Module1.prototype.name, testNode01);
        it("1.node element of array should equal testNode01", function () {
            expect(window.sf.instancesController._storage.instances[Module1.prototype.name][1].node).to.equal(testNode01);
        });
    });
    describe('#sf.getInstance()', function () {
        var inst = sf.instancesController.getInstance(Module1.prototype.name, testNode0);
        it("function should return object", function () {
            expect(inst).be.a('object');
        });
    });
    describe('#sf.getInstances()', function () {
        var inst = sf.instancesController.getInstances(Module1.prototype.name);
        it("function should return array", function () {
            expect(inst).be.a('array');
        });
    });
    describe('#sf.removeInstance()', function () {
        it("removed instance should be undefined", function () {
            sf.instancesController.removeInstance(Module1.prototype.name, testNode01);
            expect(window.sf.instancesController._storage.instances[Module1.prototype.name][1]).to.be.undefined;
        });
    });
    //console.log(sf.getInstance('module1', testNode01))

});
