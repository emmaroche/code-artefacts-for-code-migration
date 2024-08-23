'use strict';

const chai = require('chai');
const expect = chai.expect;
const version = require('./version');

describe('index router', function() {
    it('should be a function', function(done) {
        let router = require(`${process.cwd()}/routes/${version}/`);
        expect(router).to.be.a('function');
        done();
    });
});