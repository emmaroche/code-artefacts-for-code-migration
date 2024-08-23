'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
//import { mockReq, mockRes } from 'sinon-express-mock'
const mockReq = require('sinon-express-mock').mockReq;
const mockRes = require('sinon-express-mock').mockRes;
const mockery = require('mockery');
const version = require('./version');

chai.use(sinonChai);


describe('user controller', function() {
    let sandbox = null;
    let mockUser = {id:'12345f', email:'john@home.com'};

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        mockery.enable();
    });

    afterEach(function() {
        sandbox.restore();
        mockery.deregisterAll();
        mockery.disable();
    });

    let userCreateController = require(`${process.cwd()}/routes/${version}/controllers/user.controller`);

    let defaultUser = {
        email: 'john@home.com'
    };

    it('should be able to create a user', function() {
        let saveUserStub = sinon.sandbox.stub().resolves(mockUser);

        mockery.registerMock('../models/user.model.js', {save: saveUserStub});
        const request = {
            body : defaultUser
        };
        const req = mockReq(request);
        const res = mockRes();
        return userCreateController.save(req,res).then(function() {
            expect(res.status).to.be.calledWith(201);
            expect(res.json).to.be.calledWith(mockUser);
        });
    });

    it('should not be able to create a user', function() {
        let saveUserStub = sinon.sandbox.stub().rejects(new Error('Failed to save'));

        mockery.registerMock('../models/user.model.js', {save: saveUserStub});
        const request = {
            body : defaultUser
        };
        const req = mockReq(request);
        const res = mockRes();
        return userCreateController.save(req,res).then(function() {
            expect(res.status).to.be.calledWith(400);
            expect(res.json).to.be.calledWith({error:'Failed to save'});

        });
    });

    it('should be able find user by id', function() {
        let saveUserStub = sinon.sandbox.stub().resolves(mockUser);

        mockery.registerMock('../models/user.model.js', {findByID: saveUserStub});
        const request = {
            params : {id:'a5f6df5sd7f'}
        };
        const req = mockReq(request);
        const res = mockRes();
        return userCreateController.get(req,res).then(function() {
            expect(res.status).to.be.calledWith(200);
            expect(res.json).to.be.calledWith(mockUser);
        });
    });


    it('should get a 404 if user does not exist', function() {
        let saveUserStub = sinon.sandbox.stub().resolves(null);

        mockery.registerMock('../models/user.model.js', {findByID: saveUserStub});
        const request = {
            params : {id:'a5f6df5sd7f'}
        };
        const req = mockReq(request);
        const res = mockRes();
        return userCreateController.get(req,res).then(function() {
            expect(res.sendStatus).to.be.calledWith(404);
        });
    });

    it('should get a 400 if error occurs while finding user', function() {
        let saveUserStub = sinon.sandbox.stub().rejects(new Error('Error occurred'));

        mockery.registerMock('../models/user.model.js', {findByID: saveUserStub});
        const request = {
            params : {id:'a5f6df5sd7f'}
        };
        const req = mockReq(request);
        const res = mockRes();
        return userCreateController.get(req,res).then(function() {
            expect(res.status).to.be.calledWith(400);
            expect(res.json).to.be.calledWith({error:'Error occurred'});

        });
    });


    it('should be able delete user by id', function() {
        let deleteUserStub = sinon.sandbox.stub().resolves(mockUser);

        mockery.registerMock('../models/user.model.js', {delete: deleteUserStub});
        const request = {
            params : {id:'a5f6df5sd7f'}
        };
        const req = mockReq(request);
        const res = mockRes();
        return userCreateController.delete(req,res).then(function() {
            expect(res.sendStatus).to.be.calledWith(204);
        });
    });


    it('should get a 404 if user does not exist when deleting', function() {
        let deleteUserStub = sinon.sandbox.stub().resolves(null);

        mockery.registerMock('../models/user.model.js', {delete: deleteUserStub});
        const request = {
            params : {id:'a5f6df5sd7f'}
        };
        const req = mockReq(request);
        const res = mockRes();
        return userCreateController.delete(req,res).then(function() {
            expect(res.sendStatus).to.be.calledWith(404);
        });
    });

    it('should get a 400 if error occurs while deleting users', function() {
        let deleteUserStub = sinon.sandbox.stub().rejects(new Error('Error occurred'));

        mockery.registerMock('../models/user.model.js', {delete: deleteUserStub});
        const request = {
            params : {id:'a5f6df5sd7f'}
        };
        const req = mockReq(request);
        const res = mockRes();
        return userCreateController.delete(req,res).then(function() {
            expect(res.status).to.be.calledWith(400);
            expect(res.json).to.be.calledWith({error:'Error occurred'});

        });
    });


    it('should be able put user by id and update it', function() {
        let updateUserStub = sinon.sandbox.stub().resolves(mockUser);

        mockery.registerMock('../models/user.model.js', {update: updateUserStub});
        const request = {
            params : {id:'a5f6df5sd7f'}
        };
        const req = mockReq(request);
        const res = mockRes();
        return userCreateController.put(req,res).then(function() {
            expect(res.status).to.be.calledWith(200);
            expect(res.json).to.be.calledWith(mockUser);
        });
    });

    it('should be able put user by id and create it', function() {
        let updateUserStub = sinon.sandbox.stub().resolves(null);
        let saveUserStub = sinon.sandbox.stub().resolves(mockUser);

        mockery.registerMock('../models/user.model.js', {update: updateUserStub, save:saveUserStub});
        const request = {
            params : {id:'a5f6df5sd7f'}
        };
        const req = mockReq(request);
        const res = mockRes();
        return userCreateController.put(req,res).then(function() {
            expect(res.status).to.be.calledWith(201);
            expect(res.json).to.be.calledWith(mockUser);
        });
    });

    it('should throw an error when putting with id in body', function() {
        let updateUserStub = sinon.sandbox.stub().resolves(mockUser);

        mockery.registerMock('../models/user.model.js', {update: updateUserStub});
        const request = {
            params : {id:'a5f6df5sd7f'},
            body : {id:12345}
        };
        const req = mockReq(request);
        const res = mockRes();
        return userCreateController.put(req,res).then(function() {
            expect(res.status).to.be.calledWith(400);
            expect(res.json).to.be.calledWith({error:'cannot have an id in the body of the request, must be the resource locator'});
        });
    });


    it('should be able list user by query', function() {
        let listUserStub = sinon.sandbox.stub().resolves([mockUser]);

        mockery.registerMock('../models/user.model.js', {where: listUserStub});
        const request = {};
        const req = mockReq(request);
        const res = mockRes();
        return userCreateController.list(req,res).then(function() {
            expect(res.status).to.be.calledWith(200);
            expect(res.json).to.be.calledWith([mockUser]);
        });
    });

    it('should get a 400 if error occurs while querying users', function() {
        let listUserStub = sinon.sandbox.stub().rejects(new Error('Error occurred'));
        mockery.registerMock('../models/user.model.js', {where: listUserStub});
        const request = {};
        const req = mockReq(request);
        const res = mockRes();
        return userCreateController.list(req,res).then(function() {
            expect(res.status).to.be.calledWith(400);
            expect(res.json).to.be.calledWith({error:'Error occurred'});

        });
    });
});