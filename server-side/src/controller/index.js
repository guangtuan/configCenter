const fs = require('fs');
const path = require('path');
const R = require('ramda');

const listDirectory = base => {
    const fullPath = subDirName => path.join(__dirname, base, subDirName);
    const resolve = subDirName => {
        const controllerPath = fullPath(subDirName);
        console.log('load controller: ', controllerPath);
        const controller = require(controllerPath);
        const JS_FILE_SUFFIX = '.js';
        const route = [base, subDirName.replace(JS_FILE_SUFFIX, '')].join('/');
        return {
            controller,
            route
        };
    };
    return fs.readdirSync(path.join(__dirname, base)).map(resolve);
};

const admin = listDirectory('admin');
const core = listDirectory('core');
const open = listDirectory('open');

module.exports = {
    admin,
    core,
    open
};