'use strict';

const chai = require('chai');
const expect = chai.expect;
const version = require('./version');

describe('paginationAndSort', function() {
    let paginationAndSort = require(`${process.cwd()}/routes/${version}/middleware/paginationAndSort`);

    it('should populate default params when nothing is set', function(done) {
        let req = {
            params : {},
            query : {}
        };

        paginationAndSort(req,{},() => {
            expect(req.params.limit).to.equal(10);
            expect(req.params.offset).to.equal(0);
            expect(req.params.sort).to.not.exist;

            done();
        });
    });

    it('should populate params from query', function(done) {
        let req = {
            params : {},
            query : {
                limit:'15',
                offset:'100',
                sort:'email',
                email:'john@home.com'
            }
        };

        paginationAndSort(req,{},() => {
            expect(req.params).to.eql({limit:15,offset:100,sort:'email'});
            expect(req.query).to.eql({email:'john@home.com'});
            done();
        });
    });

    it('should populate params from query with max limit of 100', function(done) {
        let req = {
            params : {},
            query : {
                limit:'1000',
                offset:'100',
                sort:'email',
                email:'john@home.com'
            }
        };

        paginationAndSort(req,{},() => {
            expect(req.params).to.eql({limit:100,offset:100,sort:'email'});
            expect(req.query).to.eql({email:'john@home.com'});
            done();
        });
    });
});