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
* Built for environment `Avawiebe` at version 3
* Framework version: ^1.3.0
* Edit this app here: https://shapesplosion.gadget.dev/edit
*/
import type { Client } from "@gadget-client/shapesplosion";
import { Logger } from "./AmbientContext";
export { InvalidRecordError } from "@gadgetinc/api-client-core";
export * from "./metadataFileTypes";
export * from "./AmbientContext";
export * from "./AppConfigs";
export * from "./AppConfiguration";
export * from "./AppConnections";
import { AppConnections } from "./AppConnections";
export * from "./auth";
export * as DefaultEmailTemplates from "./email-templates/index";
export * from "./emails";
export { InvalidStateTransitionError } from "./errors";
export * from "./global-actions";
export * from "./routes";
export * from "./state-chart/index";
export * from "./types";
export * from "./ActionOptions";
export * from "./effects";
export * from "./utils";
export { preventCrossShopDataAccess, ShopifyBulkOperationState, ShopifySellingPlanGroupProductState, ShopifySellingPlanGroupProductVariantState, ShopifyShopState, ShopifySyncState, abortSync, finishBulkOperation, globalShopifySync, shopifySync } from "./shopify/index";
/**
* @internal
*/
import { Globals, actionContextLocalStorage } from "./globals";
export * from "./models/Session";
export * from "./models/User";
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
