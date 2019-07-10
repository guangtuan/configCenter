const randomString = require('randomstring');

const { md5 } = require('../../sys/hash');

const { add: addUser, get: getUser } = require('./model');

const encrypt = ({ salt }) => ({ password }) => md5([salt, password].join('-'));

const register = async ({
    user,
    password
}) => {
    const salt = randomString.generate(8);
    const encryptWithSalt = encrypt({ salt });
    const encryptedPassword = encryptWithSalt({ password });
    return await addUser({
        user,
        password: encryptedPassword,
        salt
    });
};

const verifyPassword = async ({
    user: inputUser,
    password: inputPassword
}) => {
    const { salt, user, password } = await getUser({
        user: inputUser
    });
    const encryptWithSalt = encrypt({ salt });
    return user === inputUser && encryptWithSalt({ password: inputPassword }) === password;
};

module.exports = {
    register,
    verifyPassword
};