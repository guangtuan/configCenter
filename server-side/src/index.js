const { verifyToken } = require('./service/business/token');
const { verifyIp } = require('./service/sys/ip');

const {
    system: {
        static
    }
} = require('./service/sys/env');

const { createApp, register } = require('./service/sys/app');

const app = createApp({ static: static });

const registerToApp = register({ app });

const { admin, core, open } = require('./controller');

const result = require('./service/sys/result');

(({ app, port }) => {
    app.use('/api/admin/*', (req, res, next) => {
        const verifyTokenResult = verifyToken({ req, res });
        if (verifyTokenResult.ok()) {
            next();
        } else {
            verifyTokenResult.redirect({ res });
        }
    });
    app.use('/api/core/*', (req, res, next) => {
        if (verifyIp(req)) {
            next();
        } else {
            result.buildForbidden({ message: '403 forbidden' }).redirect({ res });
        }
    });
    [...admin, ...open, ...core].forEach(registerToApp({ method: 'post' }));
    [...core].forEach(registerToApp({ method: 'get' }));
    app.listen(port, () => {
        console.log(`app listening on port ${port}`);
        console.log(
            app._router.stack
                .map(({ route }) => route)
                .filter(_ => !!_)
                .map(({ path }) => path)
        );
    });
})({
    app,
    port: 80
});