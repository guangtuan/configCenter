const appService = require('../../service/business/app');
const { buildOK } = require('../../service/sys/result');

module.exports = async (req, res) => {
    appService
        .list()
        .then(data => {
            buildOK({ data, message: 'load success' }).redirect({ res });
        })
        .catch(error => {
            console.log(error);
            buildOK({ message: error.getMeesage() }).redirect({ res });
        });
};