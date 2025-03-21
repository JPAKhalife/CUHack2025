import { validateBelongsToLink } from "../auth.js";
import { getActionContextFromLocalStorage, getCurrentContext, internalModelManagerForModel, maybeGetActionContextFromLocalStorage } from "../effects.js";
import { InvalidActionInputError } from "../errors.js";
import { Globals } from "../globals.js";
import { AppTenancyKey } from "../tenancy.js";
import { assert } from "../utils.js";
import { invalidPlanNames } from "./constants.js";
export const ShopifyShopState = {
    Installed: {
        created: "installed"
    },
    Uninstalled: {
        created: "uninstalled"
    }
};
export const ShopifySyncState = {
    Created: "created",
    Running: "running",
    Completed: "completed",
    Errored: "errored"
};
export const ShopifyBulkOperationState = {
    Created: "created",
    Completed: "completed",
    Canceled: "canceled",
    Failed: "failed",
    Expired: "expired"
};
export const ShopifySellingPlanGroupProductVariantState = {
    Started: "started",
    Created: "created",
    Deleted: "deleted"
};
export const ShopifySellingPlanGroupProductState = {
    Started: "started",
    Created: "created",
    Deleted: "deleted"
};
/**
 * The following is used to power shopifySync model.
 * Learn more about syncing visit our docs: https://docs.gadget.dev/guides/plugins/shopify/syncing-shopify-data#syncing
 */ export async function shopifySync(params, record) {
    const context = getActionContextFromLocalStorage();
    const effectAPIs = context.effectAPIs;
    const syncRecord = assert(record, "cannot start a shop sync from this action");
    const shopId = assert(syncRecord.shopId, "a shop is required to start a sync");
    if (!syncRecord.models || Array.isArray(syncRecord.models) && syncRecord.models.every((m)=>typeof m == "string")) {
        try {
            await effectAPIs.sync(syncRecord.id.toString(), shopId, syncRecord.syncSince, syncRecord.models, syncRecord.force, params.startReason);
        } catch (error) {
            Globals.logger.error({
                error,
                connectionSyncId: syncRecord.id
            }, "an error occurred starting shop sync");
            throw error;
        }
    } else {
        throw new InvalidActionInputError("Models must be an array of api identifiers");
    }
}
export async function abortSync(params, record) {
    const context = getActionContextFromLocalStorage();
    const effectAPIs = context.effectAPIs;
    const syncRecord = assert(record, "a record is required to abort a shop sync");
    const syncId = assert(syncRecord.id, "a sync id is required to start a sync");
    if (!params.errorMessage) {
        record.errorMessage = "Sync aborted";
    }
    Globals.logger.info({
        userVisible: true,
        connectionSyncId: syncId
    }, "aborting sync");
    try {
        await effectAPIs.abortSync(syncId.toString());
    } catch (error) {
        Globals.logger.error({
            error,
            connectionSyncId: syncId
        }, "an error occurred aborting sync");
        throw error;
    }
}
/**
 * Applicable for multi-tenant Shopify apps(public apps), or Shopify Customer Extension apps
 * Enforces that the given record is only accessible by the current shop or customer
 *
 * For new records: sets the the current session's `shopId` to the record. If the tenant is a customer then will set the current sessions' customerId to the record.
 * For existing records: Verifies the record objects `shopId` and/or `customerId` matches the one from the current session.
 *
 * *
 * @param params - incoming data validated against the current `shopId`
 * @param record - record used to validate or set the `shopId` on
 * @param {Object} options - Additional options for cross-shop or cross-customer validation
 * @param {string} options.shopBelongsToField - Specifies which related model is used for cross-shop validation.
 * @param {string} options.customerBelongsToField - Specifies which related model is used for cross-customer validation.
 * @param {boolean} options.enforceCustomerTenancy - Whether or not to enforce customer tenacy. Defaults to true.
 */ export async function preventCrossShopDataAccess(params, record, options) {
    const enforceCustomerTenancy = options?.enforceCustomerTenancy ?? true;
    const context = getActionContextFromLocalStorage();
    if (context.type != "effect") {
        throw new Error("Can't prevent cross shop data access outside of an action effect");
    }
    if (!params) {
        throw new Error("The `params` parameter is required in preventCrossShopDataAccess(params, record, options?: { shopBelongsToField: string })");
    }
    if (!record) {
        throw new Error("The `record` parameter is required in preventCrossShopDataAccess(params, record, options?: { shopBelongsToField: string })");
    }
    const model = context.model;
    const appTenancy = context[AppTenancyKey];
    const shopBelongsToField = options?.shopBelongsToField;
    const customerBelongsToField = options?.customerBelongsToField;
    // if there's no tenancy let's continue
    if (appTenancy?.shopify?.shopId === undefined) {
        return;
    }
    // if this effect is not run in the context of a model then it does not apply
    if (!model) {
        return;
    }
    const shopId = String(appTenancy.shopify.shopId);
    const customerId = appTenancy.shopify.customerId ? String(appTenancy.shopify.customerId) : undefined;
    const input = params[model.apiIdentifier];
    validateBelongsToLink({
        input,
        record,
        params,
        tenantId: shopId,
        model,
        tenantModelKey: ShopifyShopKey,
        tenantBelongsToField: shopBelongsToField,
        tenantType: "shop",
        tenantName: "Shopify"
    });
    if (customerId && enforceCustomerTenancy) {
        validateBelongsToLink({
            input,
            record,
            params,
            tenantId: customerId,
            model,
            tenantModelKey: ShopifyCustomerKey,
            tenantBelongsToField: customerBelongsToField,
            tenantType: "customer",
            tenantName: "Shopify"
        });
    }
}
/**
 * Syncs Shopify models across all models
 *
 * @param params - list of Shopify app credentials to sync data from
 * @param syncSince - starting point for data sync (default: all time)
 * @param models - list of model names to sync data from
 * @param force - enforces syncswithout checking if they're up to date
 * @param startReason - a string reason stored on the created 'shopifySync' records
 */ export async function globalShopifySync(params) {
    const context = maybeGetActionContextFromLocalStorage();
    const effectAPIs = assert(context ? context.effectAPIs : getCurrentContext().effectAPIs, "effect apis is missing from the current context");
    const api = assert(context ? context.api : getCurrentContext().api, "api client is missing from the current context");
    const { apiKeys, syncSince, models, force, startReason } = params;
    const { shopModelIdentifier, installedViaKeyFieldIdentifier, shopifySyncModelApiIdentifier, runShopifySyncAction, accessTokenIdentifier, forceFieldIdentifier } = await effectAPIs.getSyncIdentifiers();
    const manager = internalModelManagerForModel(api, shopModelIdentifier, []);
    const pageSize = 250;
    let pageInfo = {
        first: pageSize,
        hasNextPage: true
    };
    const results = [];
    if (apiKeys && apiKeys.length > 0) {
        try {
            while(pageInfo.hasNextPage){
                const records = await manager.findMany({
                    filter: {
                        [installedViaKeyFieldIdentifier]: {
                            in: apiKeys
                        },
                        state: {
                            inState: "created.installed"
                        },
                        planName: {
                            notIn: invalidPlanNames
                        }
                    },
                    first: pageInfo.first,
                    after: pageInfo.endCursor
                });
                results.push(...records);
                pageInfo = records.pagination.pageInfo;
            }
        } catch (error) {
            Globals.logger.info({
                userVisible: true,
                error,
                apiKeys
            }, "could not get shops for all API keys");
            throw error;
        }
        for (const result of results){
            // skip the sync if there is no accessToken set or if the state is uninstalled
            if (Globals.platformModules.lodash().isEmpty(result[accessTokenIdentifier]) || result.state?.created == "uninstalled") {
                Globals.logger.info({
                    shopId: result.id
                }, "skipping sync for shop without access token or is uninstalled");
                continue;
            }
            try {
                const shopifySyncModelManager = Globals.platformModules.lodash().get(api, runShopifySyncAction.dotNotationPath);
                await shopifySyncModelManager[runShopifySyncAction.apiIdentifier]({
                    [shopifySyncModelApiIdentifier]: {
                        shop: {
                            _link: result.id
                        },
                        domain: result.domain,
                        syncSince,
                        models,
                        ...forceFieldIdentifier ? {
                            force
                        } : undefined
                    },
                    startReason
                });
            } catch (error) {
                // log that the sync could not be started for the shop but continue
                Globals.logger.warn({
                    userVisible: true,
                    error,
                    shop: result
                }, "couldn't start sync for shop");
            }
        }
    } else {
        throw new InvalidActionInputError("missing at least 1 api key");
    }
}
var TenantType;
const shopifyModelKey = (modelName)=>{
    const modelKey = modelName.replaceAll(" ", "");
    return `DataModel-Shopify-${modelKey}`;
};
/**
 * Updates the state of a `bulkOperation` record from Shopify when the operation completes.
 *
 * @param record - the `bulkOperation` record updated
 */ export async function finishBulkOperation(record) {
    if (!record?.id) {
        Globals.logger.warn(`Expected bulk operation record to be present for action`);
        return;
    }
    const context = getActionContextFromLocalStorage();
    const shopifyAPI = await context.connections.shopify.forShopId(record.shopId);
    if (!shopifyAPI) {
        Globals.logger.error(`Could not instantiate Shopify client for shop ID ${record.shopId}`);
        return;
    }
    const bulkOperation = (await shopifyAPI.graphql(`query {
        node(id: "${ShopifyBulkOperationGIDForId(record.id)}") {
          ... on BulkOperation {
            id
            status
            errorCode
            createdAt
            completedAt
            objectCount
            fileSize
            url
            type
            partialDataUrl
            rootObjectCount
          }
        }
      }`, {})).node;
    // normalize the mixed upper/lowercase (GraphQL/REST) to lowercase
    const { status, errorCode, type } = bulkOperation;
    Object.assign(record, {
        ...bulkOperation,
        status: status?.toLowerCase(),
        errorCode: errorCode?.toLowerCase(),
        type: type?.toLowerCase(),
        id: record.id
    });
}
const ShopifyShopKey = shopifyModelKey("Shop");
const ShopifyCustomerKey = shopifyModelKey("Customer");
const ShopifyBulkOperationGIDForId = (id)=>`gid://shopify/BulkOperation/${id}`;
