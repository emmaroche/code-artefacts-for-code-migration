'use strict';

const chai = require('chai');
const expect = chai.expect;

describe('user schema', function() {
    it('should resolve to mongoose model', function(done) {
        let User = require(`${process.cwd()}/routes/v1/schemas/user.schema`);
        let user = new User({email:'john@home.com'});
        expect(User).to.be.a('function');
        expect(user.email).to.equal('john@home.com');
        done();
    });
});