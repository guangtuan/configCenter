const service = require('../../service/business/app');

module.exports = async (req, res) => {
    const { app, env } = req.query;
    const content = await service.queryByAppAndEnv({ app, env });
    res.statusCode = 200;
    res.send(content);
};