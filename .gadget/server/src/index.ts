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
/// <reference path="./ActionContextTypes.d.ts" />
import type { Client } from "@gadget-client/shapesplosion";
import { Logger } from "./AmbientContext";
export { InvalidRecordError } from '@gadgetinc/api-client-core'

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
import type { RouteContext } from "./routes";

export {
  preventCrossShopDataAccess,
  ShopifyBulkOperationState,
  ShopifySellingPlanGroupProductState,
  ShopifySellingPlanGroupProductVariantState,
  ShopifyShopState,
  ShopifySyncState,
  abortSync,
  finishBulkOperation,
  globalShopifySync,
  shopifySync,
} from "./shopify/index";

/**
 * @internal
 */
import { Globals, actionContextLocalStorage } from "./globals";
export * from "./models/Session";
export * from "./models/User";

/**
* A map of connection name to instantiated connection objects for the app.
*/
let connections: AppConnections;

/**
 * An instance of the Gadget logger
 */
let logger: Logger;
/**
 * An instance of the Gadget API client that has admin permissions
 */
let api: Client;

/**
* This is used internally to set the connections.
* @internal
*/
export const setConnections = (appConnections: AppConnections) => {
  connections = new Proxy(appConnections, {
    get: (target: any, prop: string) => {
      const actionContext = actionContextLocalStorage.getStore();
      if(actionContext && actionContext.connections) {
        return actionContext.connections[prop];
      }

      const routeContext = Globals.requestContext.get("requestContext");
      if(routeContext && routeContext.connections) {
        return routeContext.connections[prop];
      }

      return target[prop];
    }
  })
}

/**
 * This is used internally to set the rootLogger.
 * @internal
 */
export const setLogger = (rootLogger: Logger) => {
  // set the internal facing global logger to be this instance, which is tagged with the platform source
  Globals.logger = rootLogger;

  // set the user-facing global logger to be this instance tagged with the user source, as users are importing this global and using it
  logger = rootLogger.child({ source: "user" });
};

/**
 * This is used internally to set the client Instance
 * @internal
 */
export const setApiClient = (client: Client) => {
  api = client;
}

export {
  api, logger, connections
};

/**
 * @internal
 */
export {
  Globals,
  actionContextLocalStorage
};


