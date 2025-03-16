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
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _overlay = require("../core/errors/overlay");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
    return /*#__PURE__*/ _react.default.createElement("div", {
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
