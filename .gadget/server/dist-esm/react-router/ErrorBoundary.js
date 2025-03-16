import React from "react";
import { overlayTemplate } from "../core/errors/overlay.js";
export function ErrorBoundary({ error }) {
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
    return /*#__PURE__*/ React.createElement("div", {
        dangerouslySetInnerHTML: {
            __html: overlayTemplate({
                style: "rr7Frontend",
                errorMessage: title,
                stackTrace: data,
                environmentSlug: process.env.GADGET_ENV
            })
        }
    });
}
