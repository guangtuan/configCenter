const pointfree = prototypeOrFunc => {
    if (typeof prototypeOrFunc === 'function') {
        if (isConstructor(prototypeOrFunc)) {
            return (...args) => new prototypeOrFunc(...args);
        } else {
            return (...args) => prototypeOrFunc.bind(args.shift())(...args);
        }
    }
    const Type = {};
    Object.getOwnPropertyNames(prototypeOrFunc).forEach(func => {
        if ('constructor' === func) {
            Type.new = (...args) => new prototypeOrFunc.constructor(...args);
        } else {
            Type[func] = (...args) => args.shift()[func](...args);
        }
    });
    return Type;
};

function isConstructor(obj) {
    return !!obj.prototype && !!obj.prototype.constructor.name;
}

module.exports = {
    pointfree
};