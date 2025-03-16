import { BuildDirectory } from "../remix/constants.js";
import { FrontendType } from "./helpers.js";
const getDefaultProductionBaseUrl = (assetsBucketDomain, applicationId, productionEnvironmentId)=>{
    return `https://${assetsBucketDomain}/a/${applicationId}/${productionEnvironmentId}`;
};
/** A descriptor object that describes how different Gadget frontend types work for our use when building vite configs */ export const BaseRemixFrontendConfig = {
    distPath: `${BuildDirectory}/client`,
    manifestFilePath: `${BuildDirectory}/.vite/client-manifest.json`,
    productionBaseUrl: (assetsBucketDomain, applicationId, productionEnvironmentId)=>{
        return `${getDefaultProductionBaseUrl(assetsBucketDomain, applicationId, productionEnvironmentId)}/`;
    }
};
export const BaseViteFrontendConfig = {
    distPath: ".gadget/vite-dist",
    manifestFilePath: ".gadget/vite-dist/manifest.json",
    productionBaseUrl: getDefaultProductionBaseUrl
};
/**
 * Get the frontend config for the given framework type.
 */ export const getInternalFrontendConfig = (frameworkType)=>{
    switch(frameworkType){
        case FrontendType.Remix:
        case FrontendType.ReactRouterFramework:
            return BaseRemixFrontendConfig;
        case FrontendType.Vite:
            return BaseViteFrontendConfig;
        default:
            throw new Error(`Unknown frontend type detected: ${frameworkType}`);
    }
};
/**
 * Get the frontend type from the given indicator file content.
 */ export const getFrontendType = (indicatorFileContent)=>{
    if (Object.values(FrontendType).includes(indicatorFileContent)) {
        return indicatorFileContent;
    }
    throw new Error(`Unknown frontend type detected: ${indicatorFileContent}`);
};
