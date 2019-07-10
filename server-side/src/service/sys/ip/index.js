const ipRangeCheck = require('ip-range-check');

const {
    system: {
        ipRules
    }
} = require('../env');

const verifyIp = req => {
    const clientIp = getClientIp(req);
    console.log(`clientIp is ${clientIp} and ipRules are ${ipRules}, result: ${ipRangeCheck(clientIp, ipRules)}`);
    return ipRangeCheck(clientIp, ipRules);
};

const getClientIp = req => {
    let ip = req.connection.remoteAddress;
    if (ip.substr(0, 7) == '::ffff:') {
        return ip.substr(7);
    }
    return ip;
};

module.exports = {
    verifyIp
};