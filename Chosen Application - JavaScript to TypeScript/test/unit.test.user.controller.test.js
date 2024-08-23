import { Request, Response } from 'express';
import { save, get, deleteUser, put, list } from '../src/controllers/user.controller';
import { save as saveUser, findByID, update, where } from '../src/models/user.model';
import { transformIdOutgoing } from '../src/transformIdOutgoing';
import log from 'winston';
import { deleteUser as deleteUserModel } from '../src/models/user.model'; // Correct import

jest.mock('../src/models/user.model', () => ({
    save: jest.fn(),
    findByID: jest.fn(),
    update: jest.fn(),
    where: jest.fn(),
    deleteUser: jest.fn()  // Ensure this matches
}));
// Mock the model methods and the transform function
jest.mock('../src/models/user.model');
jest.mock('../src/transformIdOutgoing', () => ({
    transformIdOutgoing: jest.fn()
}));
jest.mock('winston', () => ({
    info: jest.fn(),
    error: jest.fn()
}));

describe('User Controller', () => {
    let mockUser;
    let transformedUser;
    let mockUserList;

    beforeEach(() => {
        jest.resetAllMocks();
        mockUser = { id: '12345f', email: 'john@home.com' };
        transformedUser = { id: '12345f', email: 'john@home.com', transformed: true };
        mockUserList = [mockUser];
    });

    it('should be able to create a user', async () => {
        saveUser.mockResolvedValue(mockUser);
        transformIdOutgoing.mockReturnValue(transformedUser);

        const req = { body: mockUser }  ;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } ;

        await save(req, res);

        expect(saveUser).toHaveBeenCalledWith(mockUser);
        expect(transformIdOutgoing).toHaveBeenCalledWith(mockUser);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(transformedUser);
    });

    it('should handle error when creating a user', async () => {
        const error = new Error('Failed to save');
        saveUser.mockRejectedValue(error);

        const req = { body: mockUser }  ;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } ;

        await save(req, res);

        expect(saveUser).toHaveBeenCalledWith(mockUser);
        expect(transformIdOutgoing).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should be able to retrieve a user by ID', async () => {
        findByID.mockResolvedValue(mockUser);
        transformIdOutgoing.mockReturnValue(transformedUser);

        const req = { params: { id: '12345f' } }  ;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } ;

        await get(req, res);

        expect(findByID).toHaveBeenCalledWith('12345f');
        expect(transformIdOutgoing).toHaveBeenCalledWith(mockUser);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(transformedUser);
    });

    it('should return 404 if user not found', async () => {
        findByID.mockResolvedValue(null);

        const req = { params: { id: '12345f' } }  ;
        const res = { sendStatus: jest.fn() } ;

        await get(req, res);

        expect(findByID).toHaveBeenCalledWith('12345f');
        expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    it('should handle error when retrieving a user by ID', async () => {
        const error = new Error('Error occurred');
        findByID.mockRejectedValue(error);

        const req = { params: { id: '12345f' } }  ;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } ;

        await get(req, res);

        expect(findByID).toHaveBeenCalledWith('12345f');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should be able to delete a user', async () => {
        deleteUserModel.mockResolvedValue(true);
    
        const req = { params: { id: '12345f' } };
        const res = { sendStatus: jest.fn() };
    
        await deleteUser(req, res);
    
        expect(deleteUserModel).toHaveBeenCalledWith('12345f');
        expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
    
    it('should return 404 if user to delete not found', async () => {
        deleteUserModel.mockResolvedValue(false);
    
        const req = { params: { id: '12345f' } };
        const res = { sendStatus: jest.fn() };
    
        await deleteUser(req, res);
    
        expect(deleteUserModel).toHaveBeenCalledWith('12345f');
        expect(res.sendStatus).toHaveBeenCalledWith(404);
    });
    
    it('should handle error when deleting a user', async () => {
        const error = new Error('Error occurred');
        deleteUserModel.mockRejectedValue(error);
    
        const req = { params: { id: '12345f' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
        await deleteUser(req, res);
    
        expect(deleteUserModel).toHaveBeenCalledWith('12345f');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
    
    it('should be able to update a user', async () => {
        update.mockResolvedValue(mockUser);
        transformIdOutgoing.mockReturnValue(transformedUser);

        const req = { params: { id: '12345f' }, body: { email: 'newemail@home.com' } }  ;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } ;

        await put(req, res);

        expect(update).toHaveBeenCalledWith('12345f', req.body);
        expect(transformIdOutgoing).toHaveBeenCalledWith(mockUser);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(transformedUser);
    });

    it('should create a new user if update does not find existing user', async () => {
        update.mockResolvedValue(null);
        saveUser.mockResolvedValue(mockUser);
        transformIdOutgoing.mockReturnValue(transformedUser);

        const req = { params: { id: '12345f' }, body: { email: 'newemail@home.com' } }  ;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } ;

        await put(req, res);

        expect(update).toHaveBeenCalledWith('12345f', req.body);
        expect(saveUser).toHaveBeenCalledWith({ ...req.body, _id: '12345f' });
        expect(transformIdOutgoing).toHaveBeenCalledWith(mockUser);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(transformedUser);
    });

    it('should handle error when updating a user', async () => {
        const error = new Error('Error occurred');
        update.mockRejectedValue(error);

        const req = { params: { id: '12345f' }, body: { email: 'newemail@home.com' } }  ;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } ;

        await put(req, res);

        expect(update).toHaveBeenCalledWith('12345f', req.body);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should be able to list users', async () => {
        where.mockResolvedValue(mockUserList);
        transformIdOutgoing.mockReturnValue(transformedUser);

        const req = { query: {}, params: { limit: 10, offset: 0, sort: 'asc' } }  ;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } ;

        await list(req, res);

        expect(where).toHaveBeenCalledWith({}, 10, 0, 'asc');
        expect(transformIdOutgoing).toHaveBeenCalledWith(mockUser);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([transformedUser]);
    });

    it('should handle error when listing users', async () => {
        const error = new Error('Error occurred');
        where.mockRejectedValue(error);

        const req = { query: {}, params: { limit: 10, offset: 0, sort: 'asc' } }  ;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } ;

        await list(req, res);

        expect(where).toHaveBeenCalledWith({}, 10, 0, 'asc');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
});
