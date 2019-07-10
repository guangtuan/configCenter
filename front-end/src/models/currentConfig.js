import * as R from 'ramda';

export const currentConfig = {
    state: [],
    reducers: {
        replace(state, payload) {
            return R.compose(R.toPairs, JSON.parse)(payload);
        },
        appendConfigItem(state, { key, val }) {
            return R.append([key, val])(state);
        },
        modifyConfigItem(state, { index, key, val }) {
            return R.update(
                index,
                [key, val]
            )(state);
        },
        removeConfigItem(state, { index }) {
            return R.remove(
                index,
                1
            )(state);
        }
    },
    effects: (dispatch) => ({})
}