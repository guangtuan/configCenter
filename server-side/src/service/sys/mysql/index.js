const mysql = require('mysql');
const R = require('ramda');

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const port = process.env.DB_PORT;
const logSql = (env => {
    if (env === 'true') {
        return true;
    }
    return false;
})(process.env.LOG_SQL);

const database = 'cc';

const pool = mysql.createPool({
    connectionLimit: 10,
    host,
    user,
    password,
    port,
    database,
    multipleStatements: true
});

const run = resultHandle => ({ prepareStatement, values }) =>
    new Promise((resolve, reject) => {
        logSql && console.log(`${mysql.format(prepareStatement, values)}`);
        pool.query(prepareStatement, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            resultHandle({ resolve })(result);
        });
    });

const insertResultHandle = ({ resolve }) => ({ insertId }) => {
    resolve({ insertId });
};

const deleteResultHandle = ({ resolve }) => ({ affectedRows }) => {
    resolve({ affectedRows });
};

const updateResultHandle = ({ resolve }) => ({ affectedRows }) => {
    resolve({ affectedRows });
};

const queryResultHandle = ({ resolve }) => data => {
    resolve(data);
};

const insert = run(insertResultHandle);
const remove = run(deleteResultHandle);
const update = run(updateResultHandle);
const query = run(queryResultHandle);

const commonUpdatePrepare = ({
    table, pack, condition, packComparator, conditionComparator
}) => {
    const packKeys = R.compose(R.sort(packComparator), R.keys);
    const whereKeys = R.compose(R.sort(conditionComparator), R.keys);
    const keys = {
        pack: packKeys(pack),
        where: whereKeys(condition)
    };
    const appendPlaceholder = R.concat(R.__, ' = ?');
    const connectPack = R.join(', ');
    const connectWhere = R.join(' and ');
    const packToSQL = R.compose(connectPack, R.map(appendPlaceholder));
    const whereToSQL = R.compose(connectWhere, R.map(appendPlaceholder));
    const prepareStatement = `update ${table} set ${packToSQL(keys.pack)} where ${whereToSQL(keys.where)}`;
    const valueFromPack = R.props(keys.pack);
    const valueFromCondition = R.props(keys.where);
    return {
        prepareStatement,
        values: R.concat(valueFromPack(pack), valueFromCondition(condition))
    };
};

const clear = ({ table }) => async () => {
    const sql = `delete from ${table}`;
    await remove({ prepareStatement: sql, values: [] });
};

const close = () =>
    new Promise((resolve, reject) => {
        pool.end(error => {
            if (error) {
                return reject(error);
            }
            return resolve();
        });
    });

module.exports = {
    insert,
    close,
    clear,
    remove,
    update,
    query,
    commonUpdatePrepare
};