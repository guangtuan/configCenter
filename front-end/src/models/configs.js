import { request } from '../core/request';
import * as R from 'ramda';

export const configs = {
    state: [],
    reducers: {
        setConfigs(state, payload) {
            return payload;
        },
        addConfig(state, payload) {
            return [...R.clone(state), payload];
        },
        setByEnv(state, { env, enable }) {
            return R.map(
                R.when(
                    R.propEq('env', env), R.assoc('configEnable', enable)
                )
            )(state)
        }
    },
    effects: (dispatch) => ({
        async load({ app }) {
            const resp = await request({
                path: 'api/admin/config.list',
                data: { app }
            })
            R.pipe(R.prop('data'), this.setConfigs)(resp);
            return R.prop('message')(resp);
        }
    })
}