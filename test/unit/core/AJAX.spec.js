"use strict";
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;
sessionStorage.setItem('sfFlashMessage', JSON.stringify({message:'test', timeout: 1 }));
require("../../../src/index");

describe('AJAX', function () {
    var server,
        data = { "id": 12, "comment": "Hey there",'action':{'flash':{'message':'testFlashMessage'}}};
    beforeEach(function(){
        server = sinon.fakeServer.create();
        server.respondWith("POST","/test", [200, {"Content-Type":"application/json"}, JSON.stringify(data)]);
        server.respondWith("POST","/test1", [500, {"Content-Type":"application/json"}, JSON.stringify(data)]);
        server.respondWith("POST","/test2", [999, {"Content-Type":"application/json"}, JSON.stringify(data)]);
        server.respondWith("POST","/test4", [200, {"Content-Type":"application/json"}, 'not json data']);
        server.respondWith("POST","/test5", [200,{"Content-Type":"fake"},'']);
    });

    it("#AJAX.send()", function (done) {
        sf.ajax.send({url:"/test", data: {}, onProgress: function(){}}).then(function(answer){expect(answer.id).to.equals(12); done()});
        server.respond();
    });
    it("#AJAX.send() error without url", function (done) {
        sf.ajax.send({}).then(function(){},function(error){expect(error).to.equals("You should provide url"); done();});
        server.respond();
    });
    it("#AJAX.send() answer with code 500 should call error callback ", function (done) {
        sf.ajax.send({url:"/test1", data: {}}).then(function(){},function(){done();});
        server.respond();
    });
    it("#AJAX.send() answer with code 999 should call error callback ", function (done) {
        sf.ajax.send({url:"/test2", data: {}}).then(function(){},function(){done();});
        server.respond();
    });
    it("#AJAX.send() should resolve width not json answer ", function (done) {
        sf.ajax.send({url:"/test4", data: {}}).then(function(){done()},function(error){done(error)});
        server.respond();
    });
    it("#AJAX.send() should resolve width empty answer ", function (done) {
        sf.ajax.send({url:"/test5", data: {}}).then(function(){done()},function(error){done(error)});
        server.respond();
    });
    it("#sessionStorage sfFlashMessage should has data", function () {
        expect(JSON.parse(sessionStorage.getItem('sfFlashMessage')).message).to.equals('testFlashMessage')
    });
    it("#flashMessage div should exist", function () {
        expect(document.getElementsByClassName('flash-wrapper')[0]).to.exist
    });
    afterEach(function(){
        server.restore();
    });

});
