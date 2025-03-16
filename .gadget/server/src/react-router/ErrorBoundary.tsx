import React, { useEffect } from "react";
import { overlayTemplate } from "../core/errors/overlay";

export function ErrorBoundary({ error }: { error: { status: number; statusText: string; data: any } | Error }): React.ReactNode {
  let title: string;
  let data: string | undefined;

  if ("status" in error && "statusText" in error && "data" in error) {
    title = `${error.status}${error.statusText ? `: ${error.statusText}` : ""}`;
    data = error.data;
  } else if (error instanceof Error) {
    title = `Error: ${error.message}`;
    data = error.stack;
  } else {
    title = "An unknown error occurred";
  }

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: overlayTemplate({
          style: "rr7Frontend",
          errorMessage: title,
          stackTrace: data,
          environmentSlug: process.env.GADGET_ENV!,
        }),
      }}
    ></div>
  );
}
