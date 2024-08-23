'use strict';

const version = require('./version');
const userModel = require('C:/Users/EmmaR/OneDrive/Documents/Pipeline/langchain/output/src/models/user.model.js');

describe('user model', () => {

    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    let defaultUser = {
        email: 'john@home.com'
    };

    it('should be able to save', () => {
        const mockModel = jest.fn().mockImplementation(() => ({
            save: jest.fn().mockReturnValue('saved')
        }));
        jest.mock('../src/schemas/user.schema', () => mockModel);

        expect(userModel.save(defaultUser)).toBe('saved');
    });

    it('should be able to findByID', async () => {
        const mockModel = {
            findById: jest.fn().mockResolvedValue('findById')
        };
        jest.mock('../src/schemas/user.schema', () => mockModel);
    
        await expect(userModel.findByID('5ae5dca079e219ddc56884ed')).resolves.toBe('findById');
    });
    

    it('should return null with invalid object id when findByID', async () => {
        const mockModel = {
            findById: jest.fn().mockResolvedValue(null)  // Simulate Mongoose returning null for invalid ID
        };
        jest.mock('../src/schemas/user.schema', () => mockModel);
    
        await expect(userModel.findByID('123456')).toBe(null);
    });
    
    it('should be able to delete', async () => {
        const mockModel = {
            findByIdAndRemove: jest.fn().mockReturnValue('findByIdAndRemove')
        };
        jest.mock('../src/schemas/user.schema.js', () => mockModel);

        await expect(userModel.delete('5ae5dca079e219ddc56884ed')).toBe('findByIdAndRemove');
    });

    it('should return null with invalid object id when delete', async () => {
        const mockModel = {
            findByIdAndRemove: jest.fn().mockReturnValue('findByIdAndRemove')
        };
        jest.mock('../src/schemas/user.schema', () => mockModel);

        await expect(userModel.delete('123456')).toBe(null);
    });

    it('should be able to update', async () => {
        const mockModel = {
            findByIdAndUpdate: jest.fn().mockReturnValue('findByIdAndUpdate')
        };
        jest.mock('../src/schemas/user.schema', () => mockModel);

        await expect(userModel.update('5ae5dca079e219ddc56884ed')).toBe('findByIdAndUpdate');
    });

    it('should return null with invalid object id when updating', async () => {
        const mockModel = {
            findByIdAndUpdate: jest.fn().mockReturnValue('findByIdAndUpdate')
        };
        jest.mock('../src/schemas/user.schema', () => mockModel);

        await expect(userModel.update('123456')).toBe(null);
    });

});
