export const track = any => {
    console.log(any);
    return any;
};
export const trackJSON = any => {
    console.log(JSON.stringify(any, null, 4));
    return any;
};