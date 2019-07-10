export class ServerError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
};

export class ClientError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
};

const getFromWindow = () => {
    const ret = window.location.protocol + "//" + window.location.host;
    if (window.location.port) {
        return [ret, window.location.port].join(":");
    } else {
        return ret;
    }
};

const post = ({ path, data }) => new Promise((resolve, reject) => {
    try {
        const fullUrl = [process.env.REACT_APP_HOST || getFromWindow(), path].join('/');
        let client = new XMLHttpRequest()
        client.open('POST', fullUrl, true)
        client.setRequestHeader('Content-type', 'application/json')
        if (getToken()) {
            client.setRequestHeader('token', getToken())
        }
        client.send(JSON.stringify(data))
        client.onreadystatechange = () => {
            if (client.readyState === 4) {
                resolve({
                    status: client.status,
                    responseText: client.responseText
                })
            }
        }
    } catch (error) {
        console.log('error in post');
        console.log(error);
        return reject(error)
    }
});

const SUCCESS_CODES = [200, 201];
const NO_ACCESS_CODES = [401, 403];
const CLIENT_ERROR = [400, 409];
const SERVER_ERROR_CODES = [500];
const NOT_FOUND_CODES = [404];

export async function request({
    path, data
}) {
    console.log(`request path ${path} with data ${JSON.stringify(data)}`)
    const {
        status,
        responseText
    } = await post({
        path, data
    })
    console.log(`request path ${path} return ${status}: ${responseText}`)
    if (NO_ACCESS_CODES.includes(status)) {
        clearToken()
        window.location.pathname = '/login';
    }
    if (SUCCESS_CODES.includes(status)) {
        return JSON.parse(responseText)
    }
    if (SERVER_ERROR_CODES.includes(status)) {
        const { message } = JSON.parse(responseText);
        return Promise.reject(new ServerError(message));
    }
    if (CLIENT_ERROR.includes(status)) {
        const { message } = JSON.parse(responseText)
        return Promise.reject(new ClientError(message));
    }
    if (NOT_FOUND_CODES.includes(status)) {
        return Promise.reject(new ClientError('not found'));
    }
}

export const TOKEN_KEY = 'token'
const getToken = () => localStorage.getItem(TOKEN_KEY)
const clearToken = () => localStorage.removeItem(TOKEN_KEY)