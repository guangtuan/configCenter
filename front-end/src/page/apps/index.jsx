import React, { useState, useEffect } from 'react';

import * as R from 'ramda';

import { request } from '../../core/request';
import { connect } from 'react-redux'
import { Table, Switch, Dialog, Input, Button, Message } from 'element-react';
import styles from './apps.module.css';

function Apps(props) {

    const [editing, setEditing] = useState({ app: null, enable: false });
    const [appCreateDialog, setAppCreateDialog] = useState(false);
    const [appName, setAppName] = useState('');
    const [listLoad, setListLoad] = useState(false);

    const triggerListLoad = () => {
        setListLoad(!listLoad);
    };

    const columns = [
        {
            label: 'app',
            prop: 'app'
        },
        {
            label: 'enable',
            render({ app, appEnable }) {
                return <Switch
                    onChange={value => {
                        setEditing({ enable: value, app })
                    }}
                    value={appEnable}
                ></Switch>
            }
        },
        {
            label: 'created at',
            prop: 'appCreatedAt',
            width: 200
        },
        {
            label: 'updated at',
            prop: 'lastUpdated',
            width: 200
        },
        {
            label: 'config count',
            render({ app, configCount }) {
                return <div className={styles.configCount} onClick={
                    () => {
                        console.log('click app is ', app);
                        props.changeCurrentApp(app);
                        props.history.push('app');
                    }
                }>{configCount} configs</div>
            }
        }
    ];

    useEffect(() => {
        let ignore = false;
        const afterFail = R.when(
            () => !ignore,
            Message.error
        );
        const afterSuccess = R.when(
            () => !ignore,
            Message.success
        );
        props.load().then(afterSuccess).catch(afterFail);
        return () => { ignore = true; }
    }, [listLoad]);

    useEffect(() => {
        const { enable, app } = editing;
        if (!app) {
            return;
        }
        let ignore = false;
        const options = {
            path: enable ? "api/admin/app.disable" : "api/admin/app.enable",
            data: { app }
        };
        const afterSuccess = R.compose(
            R.partial(props.setByApp, [{ enable: !enable, app }]),
            Message.success,
            R.prop('message')
        );
        const afterFail = R.pipe(
            R.props('message'),
            Message.error
        );
        request(options)
            .then(R.ifElse(() => ignore, R.F, afterSuccess))
            .catch(afterFail);
        return () => { ignore = true; }
    }, [editing]);

    const createApp = () => {
        const afterSuccess = R.compose(
            triggerListLoad,
            R.partial(setAppCreateDialog, [false]),
            Message.success,
            R.prop('message')
        );
        const afterFail = R.compose(
            R.partial(setAppCreateDialog, [false]),
            Message.error,
            R.prop('message')
        );
        request({
            path: "api/admin/app.create",
            data: { app: appName }
        })
            .then(afterSuccess)
            .catch(afterFail);
    }

    return <div className={styles.container}>
        <Table
            columns={columns}
            data={props.apps}
            border={true}
            rowKey={R.prop('app')}
        />
        <div
            className={styles.addButton}
            onClick={R.partial(setAppCreateDialog, [true])}
        >+</div>
        <Dialog
            title="add app"
            size="tiny"
            visible={appCreateDialog}
            onCancel={R.partial(setAppCreateDialog, [false])}>
            <Dialog.Body>
                <Input
                    value={appName}
                    onChange={setAppName}
                    placeholder="app name">
                </Input>
            </Dialog.Body>
            <Dialog.Footer className="dialog-footer">
                <Button onClick={R.compose(setAppCreateDialog, R.F)}>cancel</Button>
                <Button type="primary" onClick={createApp}>ok</Button>
            </Dialog.Footer>
        </Dialog>
    </div>
};

const mapState = state => {
    return {
        apps: state.apps
    };
};

const mapDispatch = dispatch => ({
    changeCurrentApp: dispatch.currentApp.change,
    load: dispatch.apps.load,
    setByApp: dispatch.apps.setByApp
});

export default connect(mapState, mapDispatch)(Apps);