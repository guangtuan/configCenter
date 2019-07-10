const { clear, close } = require('../../../sys/mysql');

const assert = require('assert');

const user = require('./index');

const clearUser = clear({ table: 'user' });

beforeEach(async () => {
    await clearUser();
});

afterAll(async () => {
    await close();
});

test('add user, return a valid insertId', async () => {
    const { insertId } = await user.add({
        user: 'foo',
        salt: '12345678',
        password: 'bar'
    });
    assert.equal(true, !!insertId);
});

test('get user, return {user, password, salt}', async () => {
    const pack = {
        user: 'foo',
        salt: '12345678',
        password: 'bar'
    };
    await user.add(pack);
    const packInDb = await user.get({ user: pack.user });
    assert.deepEqual(packInDb, pack);
});