const result = require('../../sys/result');
const tokenModel = require('./model');
const verifyToken = ({ req, res }) => {
    const token = req.header('token');
    if (tokenModel.verifyToken({ token })) {
        return result.buildOK({});
    } else {
        return result.buildUnAuthorized({
            message: 'please login'
        });
    }
};

const createToken = ({ req, res }) => {
    return tokenModel.createToken();
};

module.exports = {
    verifyToken,
    createToken
};