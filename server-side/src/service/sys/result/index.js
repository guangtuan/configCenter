const statusCode = {
    BAD_REQUEST: 400,
    OK: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    UN_AUTHORIZED: 401,
    FORBIDDEN: 403,
    SERVER_ERROR: 500,
    CONFLICT: 409
};

const build = ({ code }) => ({ message, data }) => ({
    ok: () => code === statusCode.OK,
    data: () => data,
    redirect: ({ res }) => {
        res.statusCode = code;
        res.send({
            message,
            data
        });
    }
});

const buildOK = build({ code: statusCode.OK });
const buildCreated = build({ code: statusCode.CREATED });
const buildConflict = build({ code: statusCode.CONFLICT });
const buildNotFound = build({ code: statusCode.NOT_FOUND });
const buildForbidden = build({ code: statusCode.FORBIDDEN });
const buildBadRequest = build({ code: statusCode.BAD_REQUEST });
const buildServerError = build({ code: statusCode.SERVER_ERROR });
const buildUnAuthorized = build({ code: statusCode.UN_AUTHORIZED });

module.exports = {
    build,
    buildOK,
    buildCreated,
    buildBadRequest,
    buildNotFound,
    buildServerError,
    buildUnAuthorized,
    buildForbidden,
    buildConflict
};
