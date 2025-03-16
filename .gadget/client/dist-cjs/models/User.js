"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var User_exports = {};
__export(User_exports, {
  DefaultUserSelection: () => DefaultUserSelection,
  UserManager: () => UserManager
});
module.exports = __toCommonJS(User_exports);
var import_builder = require("../builder.js");
const DefaultUserSelection = {
  __typename: true,
  id: true,
  createdAt: true,
  email: true,
  emailVerificationToken: true,
  emailVerificationTokenExpiration: true,
  emailVerified: true,
  firstName: true,
  googleImageUrl: true,
  googleProfileId: true,
  lastName: true,
  lastSignedIn: true,
  resetPasswordToken: true,
  resetPasswordTokenExpiration: true,
  roles: { key: true, name: true },
  updatedAt: true
};
const modelApiIdentifier = "user";
const pluralModelApiIdentifier = "users";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const UserManager = (0, import_builder.buildModelManager)(
  modelApiIdentifier,
  pluralModelApiIdentifier,
  DefaultUserSelection,
  [
    {
      type: "findOne",
      operationName: modelApiIdentifier,
      modelApiIdentifier,
      findByVariableName: "id",
      defaultSelection: DefaultUserSelection,
      namespace: null
    },
    {
      type: "maybeFindOne",
      operationName: modelApiIdentifier,
      modelApiIdentifier,
      findByVariableName: "id",
      defaultSelection: DefaultUserSelection,
      namespace: null
    },
    {
      type: "findMany",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultUserSelection,
      namespace: null
    },
    {
      type: "findFirst",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultUserSelection,
      namespace: null
    },
    {
      type: "maybeFindFirst",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultUserSelection,
      namespace: null
    },
    {
      type: "findOne",
      operationName: pluralModelApiIdentifier,
      functionName: "findById",
      findByField: "id",
      findByVariableName: "id",
      modelApiIdentifier,
      defaultSelection: DefaultUserSelection,
      namespace: null
    },
    {
      type: "maybeFindOne",
      operationName: pluralModelApiIdentifier,
      functionName: "maybeFindById",
      findByField: "id",
      findByVariableName: "id",
      modelApiIdentifier,
      defaultSelection: DefaultUserSelection,
      namespace: null
    },
    {
      type: "findOne",
      operationName: pluralModelApiIdentifier,
      functionName: "findByEmail",
      findByField: "email",
      findByVariableName: "email",
      modelApiIdentifier,
      defaultSelection: DefaultUserSelection,
      namespace: null
    },
    {
      type: "maybeFindOne",
      operationName: pluralModelApiIdentifier,
      functionName: "maybeFindByEmail",
      findByField: "email",
      findByVariableName: "email",
      modelApiIdentifier,
      defaultSelection: DefaultUserSelection,
      namespace: null
    },
    {
      type: "action",
      operationName: "signUpUser",
      operationReturnType: "SignUpUser",
      functionName: "signUp",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: false,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: {
        email: { required: true, type: "String" },
        password: { required: true, type: "String" }
      },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: true,
      acceptsModelInput: false,
      hasCreateOrUpdateEffect: false,
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "bulkSignUpUsers",
      functionName: "bulkSignUp",
      isBulk: true,
      isDeleter: false,
      hasReturnType: true,
      acceptsModelInput: false,
      operatesWithRecordIdentity: false,
      singleActionFunctionName: "signUp",
      modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { inputs: { required: true, type: "[BulkSignUpUsersInput!]" } },
      paramOnlyVariables: [],
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "signInUser",
      operationReturnType: "SignInUser",
      functionName: "signIn",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: {
        email: { required: true, type: "String" },
        password: { required: true, type: "String" }
      },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: false,
      acceptsModelInput: false,
      hasCreateOrUpdateEffect: false,
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "bulkSignInUsers",
      functionName: "bulkSignIn",
      isBulk: true,
      isDeleter: false,
      hasReturnType: false,
      acceptsModelInput: false,
      operatesWithRecordIdentity: true,
      singleActionFunctionName: "signIn",
      modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { inputs: { required: true, type: "[BulkSignInUsersInput!]" } },
      paramOnlyVariables: [],
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "signOutUser",
      operationReturnType: "SignOutUser",
      functionName: "signOut",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: { id: { required: true, type: "GadgetID" } },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: false,
      acceptsModelInput: false,
      hasCreateOrUpdateEffect: false,
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "bulkSignOutUsers",
      functionName: "bulkSignOut",
      isBulk: true,
      isDeleter: false,
      hasReturnType: false,
      acceptsModelInput: false,
      operatesWithRecordIdentity: true,
      singleActionFunctionName: "signOut",
      modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { ids: { required: true, type: "[GadgetID!]" } },
      paramOnlyVariables: [],
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "updateUser",
      operationReturnType: "UpdateUser",
      functionName: "update",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: {
        id: { required: true, type: "GadgetID" },
        user: { required: false, type: "UpdateUserInput" }
      },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: false,
      acceptsModelInput: true,
      hasCreateOrUpdateEffect: true,
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "bulkUpdateUsers",
      functionName: "bulkUpdate",
      isBulk: true,
      isDeleter: false,
      hasReturnType: false,
      acceptsModelInput: true,
      operatesWithRecordIdentity: true,
      singleActionFunctionName: "update",
      modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { inputs: { required: true, type: "[BulkUpdateUsersInput!]" } },
      paramOnlyVariables: [],
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "deleteUser",
      operationReturnType: "DeleteUser",
      functionName: "delete",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: true,
      variables: { id: { required: true, type: "GadgetID" } },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: false,
      acceptsModelInput: false,
      hasCreateOrUpdateEffect: false,
      defaultSelection: null
    },
    {
      type: "action",
      operationName: "bulkDeleteUsers",
      functionName: "bulkDelete",
      isBulk: true,
      isDeleter: true,
      hasReturnType: false,
      acceptsModelInput: false,
      operatesWithRecordIdentity: true,
      singleActionFunctionName: "delete",
      modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { ids: { required: true, type: "[GadgetID!]" } },
      paramOnlyVariables: [],
      defaultSelection: null
    },
    {
      type: "action",
      operationName: "sendVerifyEmailUser",
      operationReturnType: "SendVerifyEmailUser",
      functionName: "sendVerifyEmail",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: { email: { required: true, type: "String" } },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: true,
      acceptsModelInput: false,
      hasCreateOrUpdateEffect: false,
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "bulkSendVerifyEmailUsers",
      functionName: "bulkSendVerifyEmail",
      isBulk: true,
      isDeleter: false,
      hasReturnType: true,
      acceptsModelInput: false,
      operatesWithRecordIdentity: true,
      singleActionFunctionName: "sendVerifyEmail",
      modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: {
        inputs: { required: true, type: "[BulkSendVerifyEmailUsersInput!]" }
      },
      paramOnlyVariables: [],
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "verifyEmailUser",
      operationReturnType: "VerifyEmailUser",
      functionName: "verifyEmail",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: { code: { required: true, type: "String" } },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: true,
      acceptsModelInput: false,
      hasCreateOrUpdateEffect: false,
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "bulkVerifyEmailUsers",
      functionName: "bulkVerifyEmail",
      isBulk: true,
      isDeleter: false,
      hasReturnType: true,
      acceptsModelInput: false,
      operatesWithRecordIdentity: true,
      singleActionFunctionName: "verifyEmail",
      modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: {
        inputs: { required: true, type: "[BulkVerifyEmailUsersInput!]" }
      },
      paramOnlyVariables: [],
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "sendResetPasswordUser",
      operationReturnType: "SendResetPasswordUser",
      functionName: "sendResetPassword",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: { email: { required: true, type: "String" } },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: true,
      acceptsModelInput: false,
      hasCreateOrUpdateEffect: false,
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "bulkSendResetPasswordUsers",
      functionName: "bulkSendResetPassword",
      isBulk: true,
      isDeleter: false,
      hasReturnType: true,
      acceptsModelInput: false,
      operatesWithRecordIdentity: true,
      singleActionFunctionName: "sendResetPassword",
      modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: {
        inputs: { required: true, type: "[BulkSendResetPasswordUsersInput!]" }
      },
      paramOnlyVariables: [],
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "resetPasswordUser",
      operationReturnType: "ResetPasswordUser",
      functionName: "resetPassword",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: {
        password: { required: true, type: "String" },
        code: { required: true, type: "String" }
      },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: true,
      acceptsModelInput: false,
      hasCreateOrUpdateEffect: false,
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "bulkResetPasswordUsers",
      functionName: "bulkResetPassword",
      isBulk: true,
      isDeleter: false,
      hasReturnType: true,
      acceptsModelInput: false,
      operatesWithRecordIdentity: true,
      singleActionFunctionName: "resetPassword",
      modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: {
        inputs: { required: true, type: "[BulkResetPasswordUsersInput!]" }
      },
      paramOnlyVariables: [],
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "changePasswordUser",
      operationReturnType: "ChangePasswordUser",
      functionName: "changePassword",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: {
        id: { required: true, type: "GadgetID" },
        currentPassword: { required: true, type: "String" },
        newPassword: { required: true, type: "String" }
      },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: false,
      acceptsModelInput: false,
      hasCreateOrUpdateEffect: false,
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "bulkChangePasswordUsers",
      functionName: "bulkChangePassword",
      isBulk: true,
      isDeleter: false,
      hasReturnType: false,
      acceptsModelInput: false,
      operatesWithRecordIdentity: true,
      singleActionFunctionName: "changePassword",
      modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: {
        inputs: { required: true, type: "[BulkChangePasswordUsersInput!]" }
      },
      paramOnlyVariables: [],
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "upsertUser",
      operationReturnType: "UpsertUser",
      functionName: "upsert",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: false,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: {
        on: { required: false, type: "[String!]" },
        user: { required: false, type: "UpsertUserInput" },
        email: { required: true, type: "String" },
        password: { required: true, type: "String" }
      },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: ["on"],
      hasReturnType: {
        "... on SignUpUserResult": { hasReturnType: true },
        "... on UpdateUserResult": { hasReturnType: false }
      },
      acceptsModelInput: true,
      hasCreateOrUpdateEffect: true,
      defaultSelection: DefaultUserSelection
    },
    {
      type: "action",
      operationName: "bulkUpsertUsers",
      functionName: "bulkUpsert",
      isBulk: true,
      isDeleter: false,
      hasReturnType: {
        users: {
          hasReturnType: {
            "... on User": { select: true },
            "... on UpsertUserReturnType": { hasReturnType: true }
          }
        }
      },
      acceptsModelInput: true,
      operatesWithRecordIdentity: false,
      singleActionFunctionName: "upsert",
      modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { inputs: { required: true, type: "[BulkUpsertUsersInput!]" } },
      paramOnlyVariables: ["on"],
      defaultSelection: DefaultUserSelection
    }
  ]
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DefaultUserSelection,
  UserManager
});
//# sourceMappingURL=User.js.map
