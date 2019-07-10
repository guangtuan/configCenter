const configService = require('../../service/business/config');
const ret = require('../../service/sys/result');

module.exports = async (req, res) => {
    try {
        const { app, env } = req.body;
        if (!(await configService.existByAppAndEnv({ app, env }))) {
            return ret.buildBadRequest({ message: `config for ${app} in ${env} does not exists` }).redirect({ res });
        };
        if (await configService.disableConfig({ app, env })) {
            return ret.buildOK({ message: 'success' }).redirect({ res });
        } else {
            return ret.buildBadRequest({ message: 'update fail' }).redirect({ res });
        }
    } catch (error) {
        ret.buildServerError({ message: 'server error' }).redirect({ res });
    }
};