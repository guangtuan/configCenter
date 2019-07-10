const { commonUpdatePrepare } = require('./index');

test('[commonUpdatePrepare]: usage without key order', () => {
    const { prepareStatement, values } = commonUpdatePrepare({
        table: 'foo',
        pack: {
            name: 'grant',
            age: 25
        },
        condition: {
            id: 1
        }
    });
    expect(prepareStatement).toBe('update foo set age = ?, name = ? where id = ?');
    expect(values).toEqual([25, 'grant', 1]);
});

test('[commonUpdatePrepare]: usage with key order', () => {
    const { prepareStatement, values } = commonUpdatePrepare({
        table: 'foo',
        pack: {
            name: 'grant',
            age: 25
        },
        condition: {
            id: 1
        },
        packComparator: (key1, key2) => {
            if (key1 === 'name') {
                return -1;
            }
            return key1 - key2;
        }
    });
    expect(prepareStatement).toBe('update foo set name = ?, age = ? where id = ?');
    expect(values).toEqual(['grant', 25, 1]);
});
