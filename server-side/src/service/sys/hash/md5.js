const crypto = require('crypto');

const md5 = string => crypto.createHash('md5').update(string, 'utf8').digest('hex');

module.exports = {
    md5
};