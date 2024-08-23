'use strict';

const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const mockery = require('mockery');
const version = require('./version');

describe('user model', function() {
    let sandbox = null;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        mockery.enable();
    });

    afterEach(function() {
        sandbox.restore();
        mockery.deregisterAll();
        mockery.disable();
    });

    let defaultUser = {
        email: 'john@home.com'
    };
    let userModel = require(`${process.cwd()}/routes/${version}/models/user.model`);

    it('should be able to save', function(done) {
        let mockModel = function() {};
        mockModel.prototype.save = function() {
            return 'saved';
        };
        mockery.registerMock('../schemas/user.schema.js', mockModel);
        expect(userModel.save(defaultUser)).to.equal('saved');
        done();
    });

    it('should be able to findByID', function(done) {
        let mockModel = {
            findById () {
                return 'findById';
            }
        };
        mockery.registerMock('../schemas/user.schema.js', mockModel);
        expect(userModel.findByID('5ae5dca079e219ddc56884ed')).to.equal('findById');
        done();
    });

    it('should return null with invalid object id when findByID', function(done) {
        let mockModel = {
            findById () {
                return 'findById';
            }
        };
        mockery.registerMock('../schemas/user.schema.js', mockModel);
        expect(userModel.findByID('123456')).to.equal(null);
        done();
    });

    it('should be able to delete', function(done) {
        let mockModel = {
            findByIdAndRemove () {
                return 'findByIdAndRemove';
            }
        };
        mockery.registerMock('../schemas/user.schema.js', mockModel);
        expect(userModel.delete('5ae5dca079e219ddc56884ed')).to.equal('findByIdAndRemove');
        done();
    });

    it('should return null with invalid object id when delete', function(done) {
        let mockModel = {
            findByIdAndRemove () {
                return 'findByIdAndRemove';
            }
        };
        mockery.registerMock('../schemas/user.schema.js', mockModel);
        expect(userModel.delete('123456')).to.equal(null);
        done();
    });


    it('should be able to update', function(done) {
        let mockModel = {
            findByIdAndUpdate () {
                return 'findByIdAndUpdate';
            }
        };
        mockery.registerMock('../schemas/user.schema.js', mockModel);
        expect(userModel.update('5ae5dca079e219ddc56884ed')).to.equal('findByIdAndUpdate');
        done();
    });

    it('should return null with invalid object id when updating', function(done) {
        let mockModel = {
            findByIdAndUpdate () {
                return 'findByIdAndUpdate';
            }
        };
        mockery.registerMock('../schemas/user.schema.js', mockModel);
        expect(userModel.update('123456')).to.equal(null);
        done();
    });

});