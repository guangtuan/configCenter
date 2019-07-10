const uuidv4 = require('uuid/v4');

const tokenHolder = {
    value: ''
};

const createToken = () => {
    const token = uuidv4();
    tokenHolder.value = token;
    return { token };
};

const verifyToken = ({ token }) => typeof token === 'string' && token.length > 0 && tokenHolder.value === token;

module.exports = {
    createToken,
    verifyToken
};