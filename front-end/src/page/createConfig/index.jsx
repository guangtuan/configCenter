import React, { useState, useEffect } from 'react';

import * as R from 'ramda';

import { connect } from 'react-redux';
import { Input, Button, Message, Form, Card } from 'element-react';

import { request } from '../../core/request';
import styles from './createConfig.module.css';

import { isObjectJSON } from './calc';

// edit content of an env of an app
// case edit: use internal state: env
// case create: use props.currentEnv
function CreateConfig(props) {

    const [env, setEnv] = useState("");
    const [key, setKey] = useState("");
    const [val, setVal] = useState("");
    const [disableAdd, setDisableAdd] = useState(true);
    const [update, setUpdate] = useState(false);

    const back = () => {
        props.history.go(-1);
    };

    const submit = () => {
        R.ifElse(
            envValid,
            R.ifElse(
                contentValid,
                createConfig,
                R.partial(Message.error, ['content invalid'])
            ),
            R.partial(Message.error, ['env invalid'])
        )({
            app: props.currentApp,
            env: env,
            config: JSON.stringify(R.fromPairs(props.currentConfig))
        });
    };

    const envValid = R.compose(R.compose(R.not, R.not), R.prop('env'));
    const contentValid = R.compose(isObjectJSON, R.prop('config'));

    const createConfig = R.compose(
        options => request(options)
            .then(R.pipe(R.prop('message'), Message.success, back))
            .catch(R.pipe(R.prop('message'), Message.error)),
        R.compose(
            R.assoc('path', update ? 'api/admin/config.update' : 'api/admin/config.create'),
            R.objOf('data')
        )
    );

    useEffect(() => {
        setEnv(props.currentEnv);
    }, []);
    useEffect(() => {
        setUpdate(R.compose(R.not, R.isEmpty)(props.currentEnv));
    }, []);
    useEffect(() => {
        setDisableAdd(R.or(R.isEmpty(key), R.isEmpty(val)));
    }, [key, val]);

    const append = () => {
        props.appendConfigItem({ key, val });
        R.ap([setKey, setVal], [""]);
    };

    const modifyKey = index => key => {
        props.modifyConfigItem({ index, key, val: props.currentConfig[index][1] });
    };

    const modifyVal = index => val => {
        props.modifyConfigItem({ index, val, key: props.currentConfig[index][0] });
    };

    const remove = index => () => {
        props.removeConfigItem({ index });
    };

    const display = ([key, val], index) => (
        <div key={index}>
            <Form inline>
                <Form.Item label="key">
                    <Input
                        onChange={modifyKey(index)}
                        value={key}
                    ></Input>
                </Form.Item>
                <Form.Item label="val">
                    <Input
                        onChange={modifyVal(index)}
                        value={val}
                    ></Input>
                </Form.Item>
                <Form.Item>
                    <Button
                        type="warning"
                        onClick={remove(index)}
                    >DEL</Button>
                </Form.Item>
            </Form>
        </div>
    );

    return (
        <div className={styles.container}>
            <Card
                className={styles.editting}
                header={<div>Write config item in key-value</div>}
            >
                {props.currentConfig.map(display)}
                {
                    <Form inline>
                        <Form.Item label="key">
                            <Input
                                value={key}
                                onChange={setKey}
                            ></Input>
                        </Form.Item>
                        <Form.Item label="val">
                            <Input
                                value={val}
                                onChange={setVal}
                            ></Input>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                disabled={disableAdd}
                                type="primary"
                                onClick={append}
                            >ADD</Button>
                        </Form.Item>
                    </Form>
                }
            </Card>
            <Form className={styles.submit} inline>
                <Form.Item label="env name">
                    <Input
                        readOnly={R.not(R.isEmpty(props.currentEnv))}
                        value={env}
                        onChange={setEnv}
                        placeholder="env name"
                    ></Input>
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        onClick={submit}
                    >submit</Button>
                </Form.Item>
            </Form>
        </div>
    )
};

const mapState = state => {
    return {
        currentEnv: state.currentEnv,
        currentApp: state.currentApp,
        currentConfig: state.currentConfig
    };
};

const mapDispatch = dispatch => ({
    appendConfigItem: dispatch.currentConfig.appendConfigItem,
    modifyConfigItem: dispatch.currentConfig.modifyConfigItem,
    removeConfigItem: dispatch.currentConfig.removeConfigItem
});

export default connect(mapState, mapDispatch)(CreateConfig);