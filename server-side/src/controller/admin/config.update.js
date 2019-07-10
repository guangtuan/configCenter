const configService = require('../../service/business/config');
const ret = require('../../service/sys/result');

module.exports = async (req, res) => {
    try {
        const { app, env, config } = req.body;
        if (!(await configService.existByAppAndEnv({ app, env }))) {
            return ret.buildBadRequest({ message: `config for ${app} in ${env} does not exists` }).redirect({ res });
        };
        if (await configService.updateContent({ app, env, config })) {
            return ret.buildOK({ message: 'success' }).redirect({ res });
        } else {
            return ret.buildBadRequest({ message: 'update fail' }).redirect({ res });
        }
    } catch (error) {
        ret.buildServerError({ message: 'server error' }).redirect({ res });
    }
};