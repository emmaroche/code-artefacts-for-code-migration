'use strict';

const chai = require('chai');
const expect = chai.expect;
const version = require('./version');

describe('transformIdOutgoing', function() {
    it('should transform _id to id in an outgoing object', function(done) {
        let outgoingObject = {_id : 'a32refdsa445', email:'john@home.com'};
        let transformIdOutgoing = require(`${process.cwd()}/routes/${version}/transformIdOutgoing`);
        let transformed = transformIdOutgoing(outgoingObject);
        expect(transformed.id).to.exist;
        expect(transformed).to.not.equal(outgoingObject);
        expect(transformed.id).to.equal(outgoingObject._id);
        expect(transformed._id).to.not.exist;
        expect(transformed.email).to.equal(outgoingObject.email);
        done();
    });


    it('should transform _id to id in an outgoing object that has a toObject function (e.g. mongoose model objects)', function(done) {
        let outgoingObject = {_id : 'a32refdsa445', toObject : function() {return {_id:'a32refdsa445',email:'john@home.com'};}};
        let transformIdOutgoing = require(`${process.cwd()}/routes/${version}/transformIdOutgoing`);
        let transformed = transformIdOutgoing(outgoingObject);
        expect(transformed.id).to.exist;
        expect(transformed).to.not.equal(outgoingObject.toObject());
        expect(transformed.id).to.equal(outgoingObject.toObject()._id);
        expect(transformed._id).to.not.exist;
        expect(transformed.email).to.equal(outgoingObject.toObject().email);
        done();
    });

    it('should transform _id to id in an mongoose model - contract with mogoose module version', function(done) {
        let User = require(`${process.cwd()}/routes/v1/schemas/user.schema`);
        let outgoingObject = new User({email:'john@home.com'});
        let transformIdOutgoing = require(`${process.cwd()}/routes/${version}/transformIdOutgoing`);
        let transformed = transformIdOutgoing(outgoingObject);
        expect(transformed.id).to.exist;
        expect(transformed).to.not.equal(outgoingObject.toObject());
        expect(transformed.id).to.equal(outgoingObject.toObject()._id.toString());
        expect(transformed._id).to.not.exist;
        expect(transformed.email).to.equal(outgoingObject.toObject().email);
        done();
    });



    it('should remove _id from object when it is set to undefined', function(done) {
        let outgoingObject = {_id : undefined, email:'john@home.com'};
        let transformIdOutgoing = require(`${process.cwd()}/routes/${version}/transformIdOutgoing`);
        let transformed = transformIdOutgoing(outgoingObject);
        expect(transformed.id).to.not.exist;
        expect(transformed._id).to.not.exist;
        expect(transformed.email).to.equal(outgoingObject.email);
        done();
    });


    it('should do nothing when _id is not present', function(done) {
        let outgoingObject = {email:'john@home.com'};
        let transformIdOutgoing = require(`${process.cwd()}/routes/${version}/transformIdOutgoing`);
        let transformed = transformIdOutgoing(outgoingObject);
        expect(transformed.id).to.not.exist;
        expect(transformed._id).to.not.exist;
        expect(transformed.email).to.equal(outgoingObject.email);
        done();
    });

    it('should return an empty object when outgoingObject is not defined', function(done) {
        let transformIdOutgoing = require(`${process.cwd()}/routes/${version}/transformIdOutgoing`);
        let transformed = transformIdOutgoing(undefined);
        expect(transformed).to.eql({});
        expect(transformed.id).to.not.exist;
        expect(transformed._id).to.not.exist;
        expect(transformed.email).to.not.exist;
        done();
    });
});