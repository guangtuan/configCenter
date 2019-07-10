const { createToken, verifyToken } = require('./index');

const assert = require('assert');

test('create token and verify', () => {
    const { token } = createToken();
    assert.equal(true, verifyToken({
        token
    }));
});

test('single point login', () => {
    const { token: oldToken } = createToken();
    createToken();
    assert.equal(false, verifyToken({
        token: oldToken
    }));
});