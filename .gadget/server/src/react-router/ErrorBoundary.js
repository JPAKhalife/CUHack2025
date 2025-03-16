"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ErrorBoundary", {
    enumerable: true,
    get: function() {
        return ErrorBoundary;
    }
});
function _interop_require_default() {
    const data = require("@swc/helpers/_/_interop_require_default");
    _interop_require_default = function() {
        return data;
    };
    return data;
}
function _react() {
    const data = /*#__PURE__*/ _interop_require_default()._(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _overlay = require("../core/errors/overlay");
function ErrorBoundary({ error }) {
    let title;
    let data;
    if ("status" in error && "statusText" in error && "data" in error) {
        title = `${error.status}${error.statusText ? `: ${error.statusText}` : ""}`;
        data = error.data;
    } else if (error instanceof Error) {
        title = `Error: ${error.message}`;
        data = error.stack;
    } else {
        title = "An unknown error occurred";
    }
    return /*#__PURE__*/ _react().default.createElement("div", {
        dangerouslySetInnerHTML: {
            __html: (0, _overlay.overlayTemplate)({
                style: "rr7Frontend",
                errorMessage: title,
                stackTrace: data,
                environmentSlug: process.env.GADGET_ENV
            })
        }
    });
}


//# sourceMappingURL=ErrorBoundary.js.map