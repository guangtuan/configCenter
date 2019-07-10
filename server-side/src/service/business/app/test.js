const service = require('./index');
const db = require('../../sys/mysql');
const clearApp = db.clear({ table: 'app' });
const clearConfig = db.clear({ table: 'config' });

beforeEach(
    async () => {
        await clearApp();
        await clearConfig();
    }
);

afterAll(
    async () => {
        await clearApp();
        await clearConfig();
        await db.close();
    }
);

test('list apps, in the case of there are not records in database', async () => {
    const actualResult = await service.list();
    const expectResult = [];
    expect(actualResult).toEqual(expectResult);
});

test('list apps, in the case of there are some records in database', async () => {
    const sql = `
    INSERT INTO cc.app ( id, app, created_at, ENABLE, updated_at )
    VALUES
        ( 1, 'config-center', '2019-07-05 16:04:26', 1, '2019-07-05 16:04:30' ),
        ( 2, 'test1-project', '2019-07-05 16:04:26', 2, '2019-07-06 16:04:30' );
    INSERT INTO cc.config (
        id,
        app,
        env,
        config,
        created_at,
        ENABLE,
        updated_at 
    )
    VALUES
        (
            1,
            'config-center',
            'test',
            '{\"foo\":\"new value\"}',
            '2019-07-05 10:54:54',
            1,
        '2019-07-05 08:04:47' 
        );
    `;
    await db.query({
        prepareStatement: sql
    });
    const actualResult = await service.list();
    const expectResult = [
        {
            appId: 2,
            app: 'test1-project',
            appCreatedAt: '2019-07-05 16:04',
            lastUpdated: '2019-07-06 16:04:30',
            appEnable: false,
            configCount: 0
        },
        {
            appId: 1,
            app: 'config-center',
            appCreatedAt: '2019-07-05 16:04',
            lastUpdated: '2019-07-05 16:04:30',
            appEnable: true,
            configCount: 1
        }
    ];
    expect(actualResult).toEqual(expectResult);
});

test('set app enable', async () => {
    const sql = `
        INSERT INTO cc.app ( id, app, created_at, ENABLE, updated_at )
        VALUES
            ( 1, 'config-center', '2019-07-05 16:04:26', 1, '2019-07-05 16:04:30' );
    `;
    await db.query({ prepareStatement: sql });
    const disableResult = await service.disableApp({ app: 'config-center' });
    expect(disableResult).toBe(true);
    const enableResult = await service.enableApp({ app: 'config-center' });
    expect(enableResult).toBe(true);
});

test('create app', async () => {
    const app = require('randomstring').generate(16);
    const createResult = await service.create({ app });
    expect(createResult).toBe(true);
});

test('query by app and env, both app and env are enable', async () => {
    const prepareData = `
        INSERT INTO cc.app ( id, app, created_at, ENABLE, updated_at )
        VALUES
            ( 1, 'config-center', '2019-07-05 16:04:26', 1, '2019-07-05 16:04:30' );
        INSERT INTO cc.config (
            id,
            app,
            env,
            config,
            created_at,
            ENABLE,
            updated_at 
        )
        VALUES
            (
                1,
                'config-center',
                'test',
                '{\"foo\":\"new value\"}',
                '2019-07-05 10:54:54',
                1,
            '2019-07-05 08:04:47' 
            );
    `;
    await db.query({ prepareStatement: prepareData });
    const queryResult = await service.queryByAppAndEnv({ app: 'config-center', env: 'test' });
    expect(queryResult).toBe('{\"foo\":\"new value\"}');
});

test('query by app and env, app is disable', async () => {
    const prepareData = `
        INSERT INTO cc.app ( id, app, created_at, ENABLE, updated_at )
        VALUES
            ( 1, 'config-center', '2019-07-05 16:04:26', 2, '2019-07-05 16:04:30' );
        INSERT INTO cc.config (
            id,
            app,
            env,
            config,
            created_at,
            ENABLE,
            updated_at 
        )
        VALUES
            (
                1,
                'config-center',
                'test',
                '{\"foo\":\"new value\"}',
                '2019-07-05 10:54:54',
                1,
            '2019-07-05 08:04:47' 
            );
    `;
    await db.query({ prepareStatement: prepareData });
    const queryResult = await service.queryByAppAndEnv({ app: 'config-center', env: 'test' });
    expect(queryResult).toBe(undefined);
});

test('query by app and env, env is disable', async () => {
    const prepareData = `
        INSERT INTO cc.app ( id, app, created_at, ENABLE, updated_at )
        VALUES
            ( 1, 'config-center', '2019-07-05 16:04:26', 1, '2019-07-05 16:04:30' );
        INSERT INTO cc.config (
            id,
            app,
            env,
            config,
            created_at,
            ENABLE,
            updated_at 
        )
        VALUES
            (
                1,
                'config-center',
                'test',
                '{\"foo\":\"new value\"}',
                '2019-07-05 10:54:54',
                2,
            '2019-07-05 08:04:47' 
            );
    `;
    await db.query({ prepareStatement: prepareData });
    const queryResult = await service.queryByAppAndEnv({ app: 'config-center', env: 'test' });
    expect(queryResult).toBe(undefined);
});

test('query by app and env, both app and env are disable', async () => {
    const prepareData = `
        INSERT INTO cc.app ( id, app, created_at, ENABLE, updated_at )
        VALUES
            ( 1, 'config-center', '2019-07-05 16:04:26', 2, '2019-07-05 16:04:30' );
        INSERT INTO cc.config (
            id,
            app,
            env,
            config,
            created_at,
            ENABLE,
            updated_at 
        )
        VALUES
            (
                1,
                'config-center',
                'test',
                '{\"foo\":\"new value\"}',
                '2019-07-05 10:54:54',
                2,
            '2019-07-05 08:04:47' 
            );
    `;
    await db.query({ prepareStatement: prepareData });
    const queryResult = await service.queryByAppAndEnv({ app: 'config-center', env: 'test' });
    expect(queryResult).toBe(undefined);
});