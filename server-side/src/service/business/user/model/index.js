const db = require('../../../sys/mysql');

const add = async ({ user, salt, password }) => {
    const prepareStatement = 'insert into user (user, password, salt) values (?, ?, ?)';
    return await db.insert({
        prepareStatement,
        values: [user, password, salt]
    });
};

const get = async ({ user }) => {
    const prepareStatement = 'select user, password, salt from user where user = ? limit 1';
    const [record] = await db.query({
        prepareStatement,
        values: [user]
    });
    return record || {};
};

module.exports = {
    add,
    get
};