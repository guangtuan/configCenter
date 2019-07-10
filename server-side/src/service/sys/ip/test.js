test('verify', () => {
    jest.mock('../env/index.js', () => {
        return {
            system: {
                ipRules: ['192.168.1.1', '192.168.1.0/24']
            }
        };
    });

    const { verifyIp } = require('./index');

    const validReq1 = {
        connection: {
            remoteAddress: '192.168.1.104'
        }
    };
    expect(verifyIp(validReq1)).toBe(true);

    const validReq2 = {
        connection: {
            remoteAddress: '::ffff:192.168.1.1'
        }
    };
    expect(verifyIp(validReq2)).toBe(true);

    const invalidReq = {
        connection: {
            remoteAddress: '10.10.1.1'
        }
    };
    expect(verifyIp(invalidReq)).toBe(false);
});