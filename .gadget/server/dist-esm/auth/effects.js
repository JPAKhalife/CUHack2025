import { validateBelongsToLink } from "../auth.js";
import { getActionContextFromLocalStorage } from "../effects.js";
import { modelsMap } from "../metadata.js";
/**
 * Applicable for multi-tenant user authenticated apps.
 * Enforces that the given record is only accessible by the current logged in user.
 *
 * For new records: sets the the current session's `userId` to the record.
 * For existing records: Verifies the record objects `userId` matches the one from the current session.
 *
 * @param params - incoming data validated against the current `userId`
 * @param record - record used to validate or set the `userId` on
 * @param {Object} options - Additional options for cross-user validation
 * @param {string} options.userBelongsToField - Specifies which related model is used for cross-user validation.
 */ export async function preventCrossUserDataAccess(params, record, options) {
    const context = getActionContextFromLocalStorage();
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
    const userModel = context.authConfig?.userModelKey ? Object.values(modelsMap).find((model)=>model.key === context.authConfig?.userModelKey) : undefined;
    if (userId && userModel) {
        validateBelongsToLink({
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
