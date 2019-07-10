module.exports = {
    system: {
        static: (() => {
            if (!process.env.STATIC) {
                throw new Error('please config STATIC environment variable');
            }
            return process.env.STATIC;
        })(),
        ipRules: (() => {
            if (!process.env.IP_RULES) {
                throw new Error('please config IP_RULES environment variable');
            }
            return process.env.IP_RULES.split(',');
        })()
    }
};