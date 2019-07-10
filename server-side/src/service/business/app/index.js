const { insert, query, update, commonUpdatePrepare } = require('../../sys/mysql');
const R = require('ramda');
const { track } = require('../../sys/track');
const { pointfree } = require('../../sys/makeItPointfree');
const Dayjs = require('dayjs');
const DAYJS = pointfree(Dayjs.prototype);

const create = async ({ app }) => {
    const prepareStatement = 'insert into app (app, created_at, updated_at) values (?, ?, ?)';
    const values = [app, new Date(), new Date()];
    const extractResult = R.compose(R.and(R.is(Number), R.gt(R.__, 1)), R.prop('insertId'));
    return extractResult(await insert({
        prepareStatement,
        values
    }));
};

const existsByApp = async ({ app }) => {
    const prepareStatement = 'select count(id) as count from app where app = ?';
    const [{ count }] = await query({
        prepareStatement,
        values: [app]
    });
    return count > 0;
};

const list = async () => {
    const prepareStatement = `
        SELECT
            app.id AS appId,
            app.app AS app,
            app.created_at AS appCreatedAt,
            app.enable AS appEnable,
            app.updated_at AS lastUpdated,
            (
            SELECT
                count( id ) 
            FROM
                config 
            WHERE
                config.app = app.app 
            ) AS configCount 
        FROM
            app 
        ORDER BY
            app.updated_at DESC
    `;
    const queryResult = await query({
        prepareStatement
    });
    const APP_ENABLE = 'appEnable';
    const display = R.map(
        R.compose(
            R.over(
                R.lens(R.prop('lastUpdated'), R.assoc('lastUpdated')),
                R.compose(R.partialRight(DAYJS.format, ['YYYY-MM-DD HH:mm:ss']), Dayjs)
            ),
            R.over(
                R.lens(R.prop('appCreatedAt'), R.assoc('appCreatedAt')),
                R.compose(R.partialRight(DAYJS.format, ['YYYY-MM-DD HH:mm']), Dayjs)
            ),
            R.ifElse(
                R.compose(R.equals(1), R.prop(APP_ENABLE)),
                R.set(R.lensProp(APP_ENABLE), true),
                R.set(R.lensProp(APP_ENABLE), false)
            )
        )
    );
    return display(queryResult);
};

const createUpdater = ({ pack }) => async ({ app }) => {
    const condition = { app };
    const createUpdateCommand = R.compose(update, commonUpdatePrepare);
    const extractResult = R.compose(R.gt(R.__, 0), R.prop('affectedRows'));
    return extractResult(await createUpdateCommand({
        table: 'app',
        pack: R.assoc('updated_at', new Date())(pack),
        condition
    }));
};

const enableApp = createUpdater({ pack: { enable: 1 } });
const disableApp = createUpdater({ pack: { enable: 2 } });

const queryByAppAndEnv = async ({ app, env }) => {
    const prepareStatement = `    	
        SELECT
            config.config as content
        FROM
            app
            LEFT JOIN config ON app.app = config.app 
        WHERE
            app.app = ? 
            AND config.env = ?
            AND app.ENABLE = 1 
            AND config.ENABLE = 1;
    `;
    return R.compose(R.prop('content'), R.head, track)(await query({ prepareStatement, values: [app, env] }));
};

module.exports = {
    create,
    existsByApp,
    enableApp,
    disableApp,
    list,
    queryByAppAndEnv
};