const { buildOK, buildUnAuthorized } = require('../../service/sys/result');
const userService = require('../../service/business/user');
const tokenService = require('../../service/business/token');

module.exports = async (req, res) => {
    const {
        user,
        password
    } = req.body;
    if (!(await userService.verifyPassword({ user, password }))) {
        return buildUnAuthorized({ message: 'login fail' }).redirect({ res });
    }
    const { token } = tokenService.createToken({ req, res });
    buildOK({
        data: { token },
        message: 'login success'
    }).redirect({ res });
};