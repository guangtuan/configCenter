import * as R from 'ramda';
import { trackJSON } from '../../core/track';
// 写成  R.tryCatch(R.compose(R.is(Object), JSON.parse), R.F) 不知道为啥不行
// TODO: add key/value not null verify
const meaningful = R.compose(R.not, R.not);

export const isObjectJSON = input => {
    return R.tryCatch(
        R.compose(
            R.ifElse(
                R.is(Object),
                R.compose(meaningful, trackJSON, R.toPairs),
                R.F
            ),
            JSON.parse
        ),
        R.F
    )(input);
}