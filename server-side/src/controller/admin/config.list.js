const configService = require('../../service/business/config');
const { buildOK, buildServerError } = require('../../service/sys/result');

module.exports = async (req, res) => {
    configService.list({
        app: req.body.app
    }).then(data => {
        buildOK({ message: 'query success', data }).redirect({ res });
    }).catch(error => {
        buildServerError({ message: error.getMessage() }).redirect({ res });
    });
};