const appService = require('../../service/business/app');
const { buildOK, buildBadRequest, buildConflict } = require('../../service/sys/result');

module.exports = async (req, res) => {
    const { app } = req.body;
    const exists = await appService.existsByApp({ app });
    if (exists) {
        return buildConflict({ message: `app with name ${app} already exists` }).redirect({ res });
    }
    const success = await appService.create({ app });
    if (!success) {
        buildBadRequest({ message: 'create fail' }).redirect({ res });
    } else {
        buildOK({ message: 'create success' }).redirect({ res });
    }
};