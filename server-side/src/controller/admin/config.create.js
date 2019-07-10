const configService = require('../../service/business/config');
const ret = require('../../service/sys/result');

module.exports = async (req, res) => {
    try {
        const { app, env, config } = req.body;
        if (await configService.existByAppAndEnv({ app, env })) {
            return ret.buildConflict({ message: `config for ${app} in ${env} already exists` }).redirect({ res });
        };
        if (await configService.createConfig({ app, env, config })) {
            return ret.buildOK({ message: 'success' }).redirect({ res });
        } else {
            return ret.buildBadRequest({ message: 'create fail' }).redirect({ res });
        }
    } catch (error) {
        ret.buildServerError({ message: 'server error' }).redirect({ res });
    }
};