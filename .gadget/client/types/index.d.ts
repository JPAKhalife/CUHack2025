/**
* This is the Gadget API client library for:
*
*       _                                 _           _
*   ___| |__   __ _ _ __   ___  ___ _ __ | | ___  ___(_) ___  _ __
*  / __| '_ \ / _` | '_ \ / _ \/ __| '_ \| |/ _ \/ __| |/ _ \| '_ \
*  \__ \ | | | (_| | |_) |  __/\__ \ |_) | | (_) \__ \ | (_) | | | |
*  |___/_| |_|\__,_| .__/ \___||___/ .__/|_|\___/|___/_|\___/|_| |_|
*                  |_|             |_|
*
* Built for environment "Jpa-khalife-dev" at version 3
* API docs: https://docs.gadget.dev/api/shapesplosion
* Edit this app here: https://shapesplosion.gadget.app/edit
*/
export { BrowserSessionStorageType, GadgetClientError, GadgetConnection, GadgetInternalError, GadgetOperationError, GadgetRecord, GadgetRecordList, GadgetValidationError, InvalidRecordError, ChangeTracking } from "@gadgetinc/api-client-core";
export type { AuthenticationModeOptions, BrowserSessionAuthenticationModeOptions, ClientOptions, InvalidFieldError, Select } from "@gadgetinc/api-client-core";
export * from "./Client.js";
export * from "./types.js";
declare global {
    interface Window {
        gadgetConfig: {
            apiKeys: {
                shopify: string;
            };
            environment: string;
            env: Record<string, any>;
            authentication?: {
                signInPath: string;
                redirectOnSuccessfulSignInPath: string;
            };
        };
    }
}
