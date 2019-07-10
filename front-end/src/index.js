import React from 'react';
import ReactDOM from 'react-dom';

import 'element-theme-default';
import "./reset.css";

import { Provider } from 'react-redux'
import * as models from './models'
import { init } from '@rematch/core'

import Application from './application';

const store = init({
    models
})

ReactDOM.render(
    <Provider store={store}>
        <Application />
    </Provider>,
    document.getElementById('root')
);