"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "preventCrossUserDataAccess", {
    enumerable: true,
    get: function() {
        return preventCrossUserDataAccess;
    }
});
const _auth = require("../auth");
const _effects = require("../effects");
const _metadata = require("../metadata");
async function preventCrossUserDataAccess(params, record, options) {
    const context = (0, _effects.getActionContextFromLocalStorage)();
    if (context.type != "effect") {
        throw new Error("Can't prevent cross user data access outside of an action effect");
    }
    if (!params) {
        throw new Error("The `params` parameter is required in preventCrossUserDataAccess(params, record, options?: { userBelongsToField: string })");
    }
    if (!record) {
        throw new Error("The `record` parameter is required in preventCrossUserDataAccess(params, record, options?: { userBelongsToField: string })");
    }
    const model = context.model;
    const userBelongsToField = options?.userBelongsToField;
    // if this effect is not run in the context of a model then it does not apply
    if (!model) {
        return;
    }
    const userId = context.session?.get("user");
    const input = params[model.apiIdentifier];
    const userModel = context.authConfig?.userModelKey ? Object.values(_metadata.modelsMap).find((model)=>model.key === context.authConfig?.userModelKey) : undefined;
    if (userId && userModel) {
        (0, _auth.validateBelongsToLink)({
            input,
            record,
            params,
            tenantId: userId,
            model,
            tenantModelKey: userModel.key,
            tenantBelongsToField: userBelongsToField,
            tenantType: "user"
        });
    }
}


//# sourceMappingURL=effects.js.map