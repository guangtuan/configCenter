const appService = require('../../service/business/app');
const { buildNotFound, buildOK, buildBadRequest } = require('../../service/sys/result');

module.exports = async (req, res) => {
    const { app } = req.body;
    const exists = await appService.existsByApp({ app });
    if (!exists) {
        return buildNotFound({ message: 'app not found' }).redirect({ res });
    }
    const success = await appService.disableApp({ app });
    if (!success) {
        buildBadRequest({ message: 'update fail' }).redirect({ res });
    } else {
        buildOK({ message: 'update success' }).redirect({ res });
    }
};