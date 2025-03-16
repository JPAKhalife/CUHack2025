/// <reference path="./ActionContextTypes.d.ts" />
/**
* This is the Gadget server side types library for:
*
*       _                                 _           _             
*   ___| |__   __ _ _ __   ___  ___ _ __ | | ___  ___(_) ___  _ __  
*  / __| '_ \ / _` | '_ \ / _ \/ __| '_ \| |/ _ \/ __| |/ _ \| '_ \ 
*  \__ \ | | | (_| | |_) |  __/\__ \ |_) | | (_) \__ \ | (_) | | | |
*  |___/_| |_|\__,_| .__/ \___||___/ .__/|_|\___/|___/_|\___/|_| |_|
*                  |_|             |_|                              
*
* Built for environment `Jpa-khalife-dev` at version 3
* Framework version: ^1.3.0
* Edit this app here: https://shapesplosion.gadget.dev/edit
*/
import type { Client } from "@gadget-client/shapesplosion";
import { Logger } from "./AmbientContext.js";
export { InvalidRecordError } from "@gadgetinc/api-client-core";
export * from "./metadataFileTypes.js";
export * from "./AmbientContext.js";
export * from "./AppConfigs.js";
export * from "./AppConfiguration.js";
export * from "./AppConnections.js";
import { AppConnections } from "./AppConnections.js";
export * from "./auth.js";
export * as DefaultEmailTemplates from "./email-templates/index.js";
export * from "./emails.js";
export { InvalidStateTransitionError } from "./errors.js";
export * from "./global-actions.js";
export * from "./routes.js";
export * from "./state-chart/index.js";
export * from "./types.js";
export * from "./ActionOptions.js";
export * from "./effects.js";
export * from "./utils.js";
export { preventCrossShopDataAccess, ShopifyBulkOperationState, ShopifySellingPlanGroupProductState, ShopifySellingPlanGroupProductVariantState, ShopifyShopState, ShopifySyncState, abortSync, finishBulkOperation, globalShopifySync, shopifySync } from "./shopify/index.js";
/**
* @internal
*/
import { Globals, actionContextLocalStorage } from "./globals.js";
export * from "./models/Session.js";
export * from "./models/User.js";
/**
* A map of connection name to instantiated connection objects for the app.
*/
declare let connections: AppConnections;
/**
* An instance of the Gadget logger
*/
declare let logger: Logger;
/**
* An instance of the Gadget API client that has admin permissions
*/
declare let api: Client;
/**
* This is used internally to set the connections.
* @internal
*/
export declare const setConnections: unknown;
/**
* This is used internally to set the rootLogger.
* @internal
*/
export declare const setLogger: unknown;
/**
* This is used internally to set the client Instance
* @internal
*/
export declare const setApiClient: unknown;
export { api, logger, connections };
/**
* @internal
*/
export { Globals, actionContextLocalStorage };
