"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ShopifyBulkOperationState: function() {
        return ShopifyBulkOperationState;
    },
    ShopifySellingPlanGroupProductState: function() {
        return ShopifySellingPlanGroupProductState;
    },
    ShopifySellingPlanGroupProductVariantState: function() {
        return ShopifySellingPlanGroupProductVariantState;
    },
    ShopifyShopState: function() {
        return ShopifyShopState;
    },
    ShopifySyncState: function() {
        return ShopifySyncState;
    },
    abortSync: function() {
        return abortSync;
    },
    finishBulkOperation: function() {
        return finishBulkOperation;
    },
    globalShopifySync: function() {
        return globalShopifySync;
    },
    preventCrossShopDataAccess: function() {
        return preventCrossShopDataAccess;
    },
    shopifySync: function() {
        return shopifySync;
    }
});
const _auth = require("../auth");
const _effects = require("../effects");
const _errors = require("../errors");
const _globals = require("../globals");
const _tenancy = require("../tenancy");
const _utils = require("../utils");
const _constants = require("./constants");
const ShopifyShopState = {
    Installed: {
        created: "installed"
    },
    Uninstalled: {
        created: "uninstalled"
    }
};
const ShopifySyncState = {
    Created: "created",
    Running: "running",
    Completed: "completed",
    Errored: "errored"
};
const ShopifyBulkOperationState = {
    Created: "created",
    Completed: "completed",
    Canceled: "canceled",
    Failed: "failed",
    Expired: "expired"
};
const ShopifySellingPlanGroupProductVariantState = {
    Started: "started",
    Created: "created",
    Deleted: "deleted"
};
const ShopifySellingPlanGroupProductState = {
    Started: "started",
    Created: "created",
    Deleted: "deleted"
};
async function shopifySync(params, record) {
    const context = (0, _effects.getActionContextFromLocalStorage)();
    const effectAPIs = context.effectAPIs;
    const syncRecord = (0, _utils.assert)(record, "cannot start a shop sync from this action");
    const shopId = (0, _utils.assert)(syncRecord.shopId, "a shop is required to start a sync");
    if (!syncRecord.models || Array.isArray(syncRecord.models) && syncRecord.models.every((m)=>typeof m == "string")) {
        try {
            await effectAPIs.sync(syncRecord.id.toString(), shopId, syncRecord.syncSince, syncRecord.models, syncRecord.force, params.startReason);
        } catch (error) {
            _globals.Globals.logger.error({
                error,
                connectionSyncId: syncRecord.id
            }, "an error occurred starting shop sync");
            throw error;
        }
    } else {
        throw new _errors.InvalidActionInputError("Models must be an array of api identifiers");
    }
}
async function abortSync(params, record) {
    const context = (0, _effects.getActionContextFromLocalStorage)();
    const effectAPIs = context.effectAPIs;
    const syncRecord = (0, _utils.assert)(record, "a record is required to abort a shop sync");
    const syncId = (0, _utils.assert)(syncRecord.id, "a sync id is required to start a sync");
    if (!params.errorMessage) {
        record.errorMessage = "Sync aborted";
    }
    _globals.Globals.logger.info({
        userVisible: true,
        connectionSyncId: syncId
    }, "aborting sync");
    try {
        await effectAPIs.abortSync(syncId.toString());
    } catch (error) {
        _globals.Globals.logger.error({
            error,
            connectionSyncId: syncId
        }, "an error occurred aborting sync");
        throw error;
    }
}
async function preventCrossShopDataAccess(params, record, options) {
    const enforceCustomerTenancy = options?.enforceCustomerTenancy ?? true;
    const context = (0, _effects.getActionContextFromLocalStorage)();
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
    const appTenancy = context[_tenancy.AppTenancyKey];
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
    (0, _auth.validateBelongsToLink)({
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
        (0, _auth.validateBelongsToLink)({
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
async function globalShopifySync(params) {
    const context = (0, _effects.maybeGetActionContextFromLocalStorage)();
    const effectAPIs = (0, _utils.assert)(context ? context.effectAPIs : (0, _effects.getCurrentContext)().effectAPIs, "effect apis is missing from the current context");
    const api = (0, _utils.assert)(context ? context.api : (0, _effects.getCurrentContext)().api, "api client is missing from the current context");
    const { apiKeys, syncSince, models, force, startReason } = params;
    const { shopModelIdentifier, installedViaKeyFieldIdentifier, shopifySyncModelApiIdentifier, runShopifySyncAction, accessTokenIdentifier, forceFieldIdentifier } = await effectAPIs.getSyncIdentifiers();
    const manager = (0, _effects.internalModelManagerForModel)(api, shopModelIdentifier, []);
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
                            notIn: _constants.invalidPlanNames
                        }
                    },
                    first: pageInfo.first,
                    after: pageInfo.endCursor
                });
                results.push(...records);
                pageInfo = records.pagination.pageInfo;
            }
        } catch (error) {
            _globals.Globals.logger.info({
                userVisible: true,
                error,
                apiKeys
            }, "could not get shops for all API keys");
            throw error;
        }
        for (const result of results){
            // skip the sync if there is no accessToken set or if the state is uninstalled
            if (_globals.Globals.platformModules.lodash().isEmpty(result[accessTokenIdentifier]) || result.state?.created == "uninstalled") {
                _globals.Globals.logger.info({
                    shopId: result.id
                }, "skipping sync for shop without access token or is uninstalled");
                continue;
            }
            try {
                const shopifySyncModelManager = _globals.Globals.platformModules.lodash().get(api, runShopifySyncAction.dotNotationPath);
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
                _globals.Globals.logger.warn({
                    userVisible: true,
                    error,
                    shop: result
                }, "couldn't start sync for shop");
            }
        }
    } else {
        throw new _errors.InvalidActionInputError("missing at least 1 api key");
    }
}
var TenantType;
const shopifyModelKey = (modelName)=>{
    const modelKey = modelName.replaceAll(" ", "");
    return `DataModel-Shopify-${modelKey}`;
};
async function finishBulkOperation(record) {
    if (!record?.id) {
        _globals.Globals.logger.warn(`Expected bulk operation record to be present for action`);
        return;
    }
    const context = (0, _effects.getActionContextFromLocalStorage)();
    const shopifyAPI = await context.connections.shopify.forShopId(record.shopId);
    if (!shopifyAPI) {
        _globals.Globals.logger.error(`Could not instantiate Shopify client for shop ID ${record.shopId}`);
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


//# sourceMappingURL=effects.js.map