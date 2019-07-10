const express = require('express');
const bodyParser = require('body-parser');

const createApp = ({ static }) => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(require('cors')());
    app.use(express.static(static));
    return app;
};

const register = ({ app }) => ({ method }) => ({ controller, route }) => {
    const API_PREFIX = '/api';
    const apiRoute = [API_PREFIX, route].join('/');
    app[method](apiRoute, controller);
};

module.exports = { createApp, register };