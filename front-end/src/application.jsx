import React from 'react';
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import App from "./page/app";
import Apps from "./page/apps";
import Login from "./page/login";
import CreateConfig from "./page/createConfig";
import styles from "./application.module.css";
const { TOKEN_KEY } = require('./core/request');

const getToken = () => localStorage.getItem(TOKEN_KEY);

const getDefaultPath = () => {
  if (!getToken()) {
    return 'login';
  } else {
    return 'apps';
  }
};

function Application() {
  return (
    <div className={styles.app}>
      <BrowserRouter>
        <Route path='/'>
          <Redirect to={getDefaultPath()} />
        </Route>
        <Route path="/app" component={App}></Route>
        <Route path="/apps" component={Apps}></Route>
        <Route path="/login" component={Login}></Route>
        <Route path="/createConfig" component={CreateConfig}></Route>
      </BrowserRouter>
    </div>
  )
};

export default Application;
