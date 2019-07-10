import { init, dispatch } from "@rematch/core";

describe("currentConfig model", () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it("reducer: append config item", () => {
        const { currentConfig } = require("./currentConfig");

        const store = init({
            models: { currentConfig }
        });

        store.dispatch.currentConfig.appendConfigItem({
            key: "user",
            val: "grant"
        });

        expect(store.getState().currentConfig).toEqual([["user", "grant"]]);
    });

    it("reducer: replace config", () => {
        const { currentConfig } = require("./currentConfig");

        const store = init({
            models: { currentConfig }
        });

        store.dispatch.currentConfig.appendConfigItem({
            key: "oldKey",
            val: "oldValue"
        });

        store.dispatch.currentConfig.replace(JSON.stringify({
            user: "grant"
        }));
        expect(store.getState().currentConfig).toEqual([["user", "grant"]]);
    });
});