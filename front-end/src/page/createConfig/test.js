import { isObjectJSON } from './calc';

test('test object-json string validate', () => {
    const strForObject = JSON.stringify({
        a: 123
    });
    expect(isObjectJSON(strForObject)).toBe(true);
    const strForInt = JSON.stringify(123);
    expect(isObjectJSON(strForInt)).toBe(false);
    const strForBoolean = JSON.stringify(true);
    expect(isObjectJSON(strForBoolean)).toBe(false);
});