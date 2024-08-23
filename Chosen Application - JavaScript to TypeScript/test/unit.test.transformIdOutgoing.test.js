'use strict';
import User from '../src/schemas/user.schema';
import transformIdOutgoing from 'C:/Users/EmmaR/OneDrive/Documents/Pipeline/langchain/output/src/transformIdOutgoing.js';
const version = require('./version');
// const transformIdOutgoing = require('C:/Users/EmmaR/OneDrive/Documents/Pipeline/langchain/output/src/Data/transformIdOutgoing.ts');

describe('transformIdOutgoing', () => {
    it('should transform _id to id in an outgoing object', (done) => {
        let outgoingObject = { _id: 'a32refdsa445', email: 'john@home.com' };
        let transformed = transformIdOutgoing(outgoingObject);
        expect(transformed.id).toBeDefined();
        expect(transformed).not.toBe(outgoingObject);
        expect(transformed.id).toBe(outgoingObject._id);
        expect(transformed._id).toBeUndefined();
        expect(transformed.email).toBe(outgoingObject.email);
        done();
    });

    it('should transform _id to id in an outgoing object that has a toObject function (e.g., mongoose model objects)', (done) => {
        let outgoingObject = { _id: 'a32refdsa445', toObject: function() { return { _id: 'a32refdsa445', email: 'john@home.com' }; } };
        let transformed = transformIdOutgoing(outgoingObject);
        expect(transformed.id).toBeDefined();
        expect(transformed).not.toBe(outgoingObject.toObject());
        expect(transformed.id).toBe(outgoingObject.toObject()._id);
        expect(transformed._id).toBeUndefined();
        expect(transformed.email).toBe(outgoingObject.toObject().email);
        done();
    });

    it('should transform _id to id in a mongoose model - contract with mongoose module version', (done) => {
        // let User = require('C:/Users/EmmaR/OneDrive/Documents/Pipeline/langchain/output/src/schemas/user.schema');
        let outgoingObject = new User({ email: 'john@home.com' });
        let transformed = transformIdOutgoing(outgoingObject);
        expect(transformed.id).toBeDefined();
        expect(transformed).not.toBe(outgoingObject.toObject());
        expect(transformed.id).toBe(outgoingObject.toObject()._id.toString());
        expect(transformed._id).toBeUndefined();
        expect(transformed.email).toBe(outgoingObject.toObject().email);
        done();
    });

    it('should remove _id from object when it is set to undefined', (done) => {
        let outgoingObject = { _id: undefined, email: 'john@home.com' };
        let transformed = transformIdOutgoing(outgoingObject);
        expect(transformed.id).toBeUndefined();
        expect(transformed._id).toBeUndefined();
        expect(transformed.email).toBe(outgoingObject.email);
        done();
    });

    it('should do nothing when _id is not present', (done) => {
        let outgoingObject = { email: 'john@home.com' };
        let transformed = transformIdOutgoing(outgoingObject);
        expect(transformed.id).toBeUndefined();
        expect(transformed._id).toBeUndefined();
        expect(transformed.email).toBe(outgoingObject.email);
        done();
    });

    it('should return an empty object when outgoingObject is not defined', (done) => {
        let transformed = transformIdOutgoing(undefined);
        expect(transformed).toEqual({});
        expect(transformed.id).toBeUndefined();
        expect(transformed._id).toBeUndefined();
        expect(transformed.email).toBeUndefined();
        done();
    });
});
