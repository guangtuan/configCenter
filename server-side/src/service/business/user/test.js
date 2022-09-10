const { register, verifyPassword } = require('./index');
const { clear, close } = require('../../sys/mysql');

const assert = require('assert');

const clearUser = clear({
    table: 'user',
});

beforeEach(clearUser);

afterEach(clearUser);

afterAll(close);

test('test register', async () => {
    const { insertId } = await register({
        user: 'foo',
        password: 'bar',
    });
    assert.equal(true, !!insertId);
});

test('test verify password', async () => {
    const pack = {
        user: 'foo',
        password: 'bar',
    };
    await register(pack);
    const userValidResult = await verifyPassword(pack);
    assert.equal(true, userValidResult);
});
