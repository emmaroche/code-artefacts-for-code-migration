'use strict';

import User from '../src/schemas/user.schema';

describe('user schema', () => {
    it('should resolve to mongoose model', () => {
        const user = new User({ email: 'john@home.com' });

        expect(typeof User).toBe('function');
        expect(user.email).toBe('john@home.com');
    });
});
