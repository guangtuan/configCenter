import { request } from '../core/request';
import * as R from 'ramda';
import { track } from '../core/track';

export const apps = {
    state: [],
    reducers: {
        replace(state, payload) {
            return payload;
        },
        setByApp(state, { app, enable }) {
            return R.map(
                R.when(
                    R.propEq('app', app), R.assoc('appEnable', enable)
                )
            )(state)
        }
    },
    effects: (dispatch) => ({
        async load() {
            const resp = await request({
                path: 'api/admin/app.list'
            });
            R.pipe(R.prop('data'), this.replace)(resp);
            return R.prop('message')(track(resp));
        }
    })
}