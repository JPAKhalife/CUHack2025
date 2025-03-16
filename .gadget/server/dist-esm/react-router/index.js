import { AppDirectory, BuildDirectory } from "./constants.js";
export { ErrorBoundary } from "./ErrorBoundary.js";
/**
 * Parameters for running a React Router app in Gadget.
 */ export const reactRouterConfigOptions = {
    buildDirectory: BuildDirectory,
    appDirectory: AppDirectory
};
