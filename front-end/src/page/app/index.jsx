import React, { useState, useEffect } from 'react';

import * as R from 'ramda';

import { connect } from 'react-redux';
import { Table, Switch, Message, Form, Button } from 'element-react';

import { request } from '../../core/request';
import styles from './app.module.css';

function App(props) {

    const [refresh, setRefresh] = useState(false);
    const [switching, setSwitching] = useState({ env: null, enable: false });

    const pretty = R.compose(R.partialRight(JSON.stringify, [null, 4]), JSON.parse);

    const editConfig = ({ env, config }) => () => {
        props.setCurrentEnv(env);
        props.replaceConfig(config);
        props.history.push('/createConfig');
    };

    const copyConfig = ({ config }) => () => {
        props.setCurrentEnv("");
        props.replaceConfig(config);
        props.history.push('/createConfig');
    };

    const columns = [
        {
            type: 'expand',
            expandPannel: function (data) {
                return (
                    <div>
                        <pre>{pretty(data.config)}</pre>
                        <Form inline className={styles.options}>
                            <Form.Item>
                                <Button
                                    onClick={editConfig(data)}
                                    type="text">edit</Button>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    onClick={copyConfig(data)}
                                    type="text">copy</Button>
                            </Form.Item>
                        </Form>
                    </div>
                )
            }
        },
        {
            label: 'env',
            prop: 'env'
        },
        {
            label: 'enable',
            render({ env, configEnable }) {
                return <Switch
                    value={configEnable}
                    onChange={value => {
                        setSwitching({ enable: value, env })
                    }}
                ></Switch>
            }
        },
        {
            label: 'created at',
            prop: 'createdAt'
        },
        {
            label: 'updated at',
            prop: 'lastUpdated'
        }
    ]

    useEffect(() => {
        const afterSuccess = R.pipe(Message.success, R.prop('message'));
        const afterFail = R.compose(Message.error, R.prop('message'));
        props.loadConfigs({ app: props.currentApp })
            .then(afterSuccess)
            .catch(afterFail);
    }, [refresh]);

    useEffect(() => {
        const { env, enable } = switching;
        if (!env) {
            return;
        }
        const path = enable ? 'api/admin/config.disable' : 'api/admin/config.enable';
        const data = { app: props.currentApp, env };
        const afterSuccess = R.compose(
            R.partial(props.setConfigEnable, [{ env, enable: !enable }]),
            Message.success,
            R.prop('message')
        );
        const afterFail = R.compose(
            Message.error,
            R.prop('message')
        );
        request({ path, data }).then(afterSuccess).catch(afterFail);
    }, [switching]);

    return (
        <div className={styles.container}>
            <Table
                defaultExpandAll={true}
                columns={columns}
                data={props.configs || []}
                border={true}
                rowKey={R.prop('env')}
            />
            <div
                className={styles.addButton}
                onClick={() => {
                    props.setCurrentEnv('');
                    props.history.push('/createConfig');
                }}
            >+</div>
        </div>
    )
}

const mapState = state => {
    return {
        currentApp: state.currentApp,
        configs: state.configs
    };
};

const mapDispatch = dispatch => ({
    loadConfigs: dispatch.configs.load,
    setConfigEnable: dispatch.configs.setByEnv,
    setCurrentEnv: dispatch.currentEnv.change,
    replaceConfig: dispatch.currentConfig.replace
});

export default connect(mapState, mapDispatch)(App);