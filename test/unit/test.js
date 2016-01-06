"use strict";
var assert = chai.assert;
var should = chai.should();

//TODO remove example
describe('Array', function(){

    before(function(){
        console.log('this called in before all');
    });
    beforeEach(function(){
        console.log('invoke before each method');
    });

    afterEach(function(){
        console.log('invoke after each method');
    });
    after(function(){
        console.log('this called in after all');
    });



    describe('#indexOf()', function(){

        it('should return -1 when the value is not present', function(){
            console.log('invoke one assert');
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));

        });
    });

    describe('#indexOf()', function(){

        it('should return -1 when the value is not present', function(){
            console.log('invoke second should');
            [1,2,3].indexOf(5).should.equal(-1);
            [1,2,3].indexOf(0).should.equal(-1);
        });
    });
});