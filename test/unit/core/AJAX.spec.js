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
    });

    it("#AJAX.send()", function (done) {
        sf.ajax.send({url:"/test", data: {}}).then(function(answer){expect(answer.id).to.equals(12); done()});
        server.respond();
    });
    it("#AJAX.send() error without url", function (done) {
        sf.ajax.send({}).then(function(){},function(error){expect(error).to.equals("You should provide url"); done();});
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
