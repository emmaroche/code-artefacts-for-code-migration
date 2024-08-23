'use strict';

const version = require('./version');
const paginationAndSort = require('C:/Users/EmmaR/OneDrive/Documents/Pipeline/langchain/output/src/middleware/paginationAndSort.js');
// const jest = require('jest');

describe('paginationAndSort', () => {
    it('should populate default params when nothing is set', (done) => {
        const req = {
            params: {},
            query: {}
        };

        paginationAndSort(req, {}, () => {
            expect(req.params.limit).toBe(10);
            expect(req.params.offset).toBe(0);
            expect(req.params.sort).toBeUndefined();

            done();
        });
    });

    it('should populate params from query', (done) => {
        const req = {
            params: {},
            query: {
                limit: '15',
                offset: '100',
                sort: 'email',
                email: 'john@home.com'
            }
        };

        paginationAndSort(req, {}, () => {
            expect(req.params).toEqual({ limit: 15, offset: 100, sort: 'email' });
            expect(req.query).toEqual({ email: 'john@home.com' });
            done();
        });
    });

    it('should populate params from query with max limit of 100', (done) => {
        const req = {

            params: {},
            query: {
                limit: '1000',
                offset: '100',
                sort: 'email',
                email: 'john@home.com'
            }
        };

        paginationAndSort(req, {}, () => {
            expect(req.params).toEqual({ limit: 100, offset: 100, sort: 'email' });
            expect(req.query).toEqual({ email: 'john@home.com' });
            done();
        });
    });
});
