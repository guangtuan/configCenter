const service = require('./index');
const db = require('../../sys/mysql');

const clearApp = db.clear({ table: 'app' });
const clearConfig = db.clear({ table: 'config' });

const { trackJSON } = require('../../sys/track');

const R = require('ramda');

beforeEach(async () => {
    await clearApp();
    await clearConfig();
});

afterEach(async () => {
    await clearApp();
    await clearConfig();
});

afterAll(db.close);

test('load config list by app', async () => {
    const prepareSQL = `
    INSERT INTO cc.app ( id, app, created_at, ENABLE, updated_at )
    VALUES
    ( 1, 'config-center', '2019-07-05 16:04:26', 1, '2019-07-05 16:04:30' );
    INSERT INTO config ( app, env, config, created_at, enable, updated_at )
    VALUES
    ( 'config-center', 'dev', '{\"a\":1}', '2019-07-07 12:51:55', 1, '2019-07-07 12:51:55' );
    INSERT INTO config ( app, env, config, created_at, enable, updated_at )
    VALUES
    ( 'config-center', 'release', '{\"a\":2}', '2019-07-07 07:51:55', 1, '2019-07-07 07:51:55' );
    `;
    await db.query({ prepareStatement: prepareSQL });
    const expectResult = [{
        app: 'config-center',
        env: 'dev',
        config: '{\"a\":1}',
        createdAt: '2019-07-07 12:51',
        configEnable: true,
        lastUpdated: '2019-07-07 12:51:55'
    }, {
        app: 'config-center',
        env: 'release',
        config: '{\"a\":2}',
        createdAt: '2019-07-07 07:51',
        configEnable: true,
        lastUpdated: '2019-07-07 07:51:55'
    }];
    const actualResult = await service.list({ app: 'config-center' });
    expect(actualResult).toEqual(expectResult);
});

test('create config and then disable it and then enable it and then update its content', async () => {
    const createResult = await service.createConfig({
        app: 'config-center',
        env: 'release',
        config: JSON.stringify({ foo: 'bar' })
    });
    expect(createResult).toBe(true);
    const existResult = await service.existByAppAndEnv({ app: 'config-center', env: 'release' });
    expect(existResult).toBe(true);
    const disableResult = await service.disableConfig({ app: 'config-center', env: 'release' });
    expect(disableResult).toBe(true);
    const enableResult = await service.enableConfig({ app: 'config-center', env: 'release' });
    expect(enableResult).toBe(true);
    const updateResult = await service.updateContent({ app: 'config-center', env: 'release', config: JSON.stringify({ bar: 'foo' }) });
    expect(updateResult).toBe(true);
});