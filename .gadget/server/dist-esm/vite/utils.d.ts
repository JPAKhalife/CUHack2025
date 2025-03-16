
import { FrontendType } from "./helpers.js";
/** A descriptor object that describes how different Gadget frontend types work for our use when building vite configs */
type InternalFrontendConfig = {
	distPath: string
	manifestFilePath: string
	productionBaseUrl: (assetsBucketDomain: string, applicationId: string, productionEnvironmentId: string) => string
};
export declare const BaseRemixFrontendConfig: InternalFrontendConfig;
export declare const BaseViteFrontendConfig: InternalFrontendConfig;
/**
* Get the frontend config for the given framework type.
*/
export declare const getInternalFrontendConfig: (frameworkType: FrontendType) => InternalFrontendConfig;
/**
* Get the frontend type from the given indicator file content.
*/
export declare const getFrontendType: (indicatorFileContent: string) => FrontendType;
export {};
