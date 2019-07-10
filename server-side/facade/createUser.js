const [ig0, ig1, user, password] = process.argv;

if (!user) {
    throw new Error('please give user');
}

if (!password) {
    throw new Error('please give password');
}

const { register } = require('../src/service/business/user');
const db = require('../src/service/sys/mysql');

register({
    user, password
})
    .then(console.log)
    .catch(console.log)
    .finally(db.close);