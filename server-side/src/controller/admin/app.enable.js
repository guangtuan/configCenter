const appService = require('../../service/business/app');
const { buildNotFound, buildOK, buildBadRequest } = require('../../service/sys/result');

module.exports = async (req, res) => {
    const { app } = req.body;
    const exists = await appService.existsByApp({ app });
    if (!exists) {
        return buildNotFound({ message: 'app not found' }).redirect({ res });
    }
    const success = await appService.enableApp({ app });
    if (!success) {
        buildBadRequest({ message: 'update fail' }).redirect({ res });
    } else {
        buildOK({ message: 'update success' }).redirect({ res });
    }
};