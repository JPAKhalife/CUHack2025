"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ErrorBoundary: function() {
        return _ErrorBoundary.ErrorBoundary;
    },
    reactRouterConfigOptions: function() {
        return reactRouterConfigOptions;
    }
});
const _constants = require("./constants");
const _ErrorBoundary = require("./ErrorBoundary");
/**
 * Parameters for running a React Router app in Gadget.
 */ const reactRouterConfigOptions = {
    buildDirectory: _constants.BuildDirectory,
    appDirectory: _constants.AppDirectory
};
