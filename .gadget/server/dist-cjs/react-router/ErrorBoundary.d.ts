
import React from "react";
export declare function ErrorBoundary({ error }: {
	error: {
		status: number
		statusText: string
		data: any
	} | Error
}): React.ReactNode;
