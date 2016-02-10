"use strict";
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;


describe('AJAX', function () {
    var server,
        data = [{ "id": 12, "comment": "Hey there" }];
    beforeEach(function(){
        server = sinon.fakeServer.create();
        server.respondWith("POST","/test", [200, {"Content-Type":"application/json"}, JSON.stringify(data)]);
    });

    it("#AJAX.send()", function (done) {
        sf.ajax.send({url:"/test", data: {}}).then(function(answer){expect(answer[0].id).to.equals(12); done()});
        server.respond();
    });
    it("#AJAX.send() error without url", function (done) {
        sf.ajax.send({}).then(function(){},function(error){expect(error).to.equals("You should provide url"); done();});
        server.respond();
    });
    afterEach(function(){
        server.restore();
    });

});
