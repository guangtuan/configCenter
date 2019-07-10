module.exports = {
    track: any => {
        console.log(any);
        return any;
    },
    trackJSON: any => {
        console.log(JSON.stringify(any, null, 4));
        return any;
    }
};