const db = require('../../sys/mysql');
const R = require('ramda');
const Dayjs = require('dayjs');
const { pointfree } = require('../../sys/makeItPointfree');
const DAYJS = pointfree(Dayjs.prototype);

const createUpdater = ({ pack }) => async ({ app, env }) => {
    const condition = { app, env };
    const createUpdateCommand = R.compose(db.update, db.commonUpdatePrepare);
    const extractResult = R.compose(R.gt(R.__, 0), R.prop('affectedRows'));
    return extractResult(await createUpdateCommand({
        table: 'config',
        pack: R.assoc('updated_at', new Date())(pack),
        condition
    }));
};

const enableConfig = createUpdater({ pack: { enable: 1 } });
const disableConfig = createUpdater({ pack: { enable: 2 } });

const existByAppAndEnv = async ({ app, env }) => {
    const prepareStatement = 'select count(id) as count from config where app = ? and env = ?';
    const queryResult = await db.query({
        prepareStatement,
        values: [app, env]
    });
    const extractResult = R.compose(R.gt(R.__, 0), R.prop('count'), R.head);
    return extractResult(queryResult);
};

const createConfig = async ({ app, env, config }) => {
    const prepareStatement = `
    INSERT INTO config ( app, env, config, created_at, enable, updated_at )
    VALUES
    ( ?, ?, ?, ?, ?, ? );
    `;
    const now = new Date();
    const values = [app, env, config, now, 1, now];
    const extractResult = R.compose(R.and(R.is(Number), R.gt(R.__, 1)), R.prop('insertId'));
    return extractResult(await db.insert({ prepareStatement, values }));
};

const updateContent = async ({ app, env, config }) => {
    const updater = createUpdater({ pack: { config } });
    return await updater({ app, env });
};

const list = async ({ app }) => {
    const prepareStatement = `
        SELECT
            app,
            env,
            config,
            created_at AS createdAt,
            ENABLE AS configEnable,
            updated_at AS lastUpdated 
        FROM
            config 
        WHERE
            app = ?
        ORDER BY
            updated_at DESC;
    `;
    const queryResult = await db.query({ prepareStatement, values: [app] });
    const CONFIG_ENABLE = 'configEnable';
    const display = R.map(
        R.compose(
            R.over(
                R.lens(R.prop('lastUpdated'), R.assoc('lastUpdated')),
                R.compose(R.partialRight(DAYJS.format, ['YYYY-MM-DD HH:mm:ss']), Dayjs)
            ),
            R.over(
                R.lens(R.prop('createdAt'), R.assoc('createdAt')),
                R.compose(R.partialRight(DAYJS.format, ['YYYY-MM-DD HH:mm']), Dayjs)
            ),
            R.ifElse(
                R.compose(R.equals(1), R.prop(CONFIG_ENABLE)),
                R.set(R.lensProp(CONFIG_ENABLE), true),
                R.set(R.lensProp(CONFIG_ENABLE), false)
            )
        )
    );
    return display(queryResult);
};

module.exports = {
    list,
    enableConfig,
    disableConfig,
    createConfig,
    updateContent,
    existByAppAndEnv
};