const { pointfree } = require('./index');

test('test make Date api pointfree', () => {
    const D = pointfree(Date.prototype);
    const now = new Date();
    expect(D.getFullYear(now)).toBe(now.getFullYear());

    const pfGetFullYear = pointfree(Date.prototype.getFullYear);
    expect(pfGetFullYear(now)).toBe(now.getFullYear());
    const nowString = now.toString();
    expect(D.new(nowString).toString()).toBe(nowString);
});

test('define a class with function, and make it pointfree', () => {
    function TestClass(p1, p2) {
        this.a = 1;
        this.p1 = p1;
        this.p2 = p2;
    };
    TestClass.prototype.add = function (b, c) {
        return this.a + b + c;
    };
    TestClass.prototype.toString = function () {
        return this.p1 + this.p2;
    };
    TestClass.prototype.constructor = TestClass;

    const testC = new TestClass();
    expect(testC.add(2, 3)).toBe(6);
    const T = pointfree(TestClass.prototype);
    expect(T.add(testC, 2, 3)).toBe(6);

    const pfAdd = pointfree(TestClass.prototype.add);
    expect(pfAdd(testC, 2, 3)).toBe(6);

    const pfCon = pointfree(TestClass.prototype.constructor);
    expect(pfCon(1, 2).toString()).toBe(new TestClass(1, 2).toString());

    const testp = new TestClass('grant', 'zhuang');
    expect('grantzhuang').toBe(testp.toString());
    expect(T.new('grant', 'zhuang').toString()).toBe(testp.toString());
});

test('define a class in es6, and make it pointfree', () => {
    class App {
        constructor(a, b) {
            this.a = a;
            this.b = b;
        }
        func(d, e) {
            return this.a + this.b + d + e;
        }
        toString() {
            return `${this.a}${this.b}`;
        }
    }
    const A = pointfree(App.prototype);
    expect(A.new(1, 2).toString()).toBe(new App(1, 2).toString());
    expect(A.new(1, 2).func(3, 4)).toBe(new App(1, 2).func(3, 4));
    const pfFunc = pointfree(App.prototype.func);
    expect(pfFunc(new App(1, 2), 3, 4)).toBe(new App(1, 2).func(3, 4));
    const pfCon = pointfree(App.prototype.constructor);
    expect(pfCon(1, 2).toString()).toBe(new App(1, 2).toString());
});