import { GadgetConnection, GadgetRecord, GadgetRecordList, DefaultSelection, LimitToKnownKeys, Selectable } from "@gadgetinc/api-client-core";
import { Query, Select, DeepFilterNever, IDsList, PromiseOrLiveIterator, User, AvailableUserSelection, UserSort, UserFilter, Scalars, UpdateUserInput, UpsertUserInput } from "../types.js";
/**
* A type that holds only the selected fields (and nested fields) of user. The present fields in the result type of this are dynamic based on the options to each call that uses it.
* The selected fields are sometimes given by the `Options` at `Options["select"]`, and if a selection isn't made in the options, we use the default selection from above.
*/
export type SelectedUserOrDefault<Options extends Selectable<AvailableUserSelection>> = DeepFilterNever<Select<User, DefaultSelection<AvailableUserSelection, Options, typeof DefaultUserSelection>>>;
/**
 * A type that represents a `GadgetRecord` type for user.
 * It selects all fields of the model by default. If you want to represent a record type with a subset of fields, you could pass in an object in the `Selection` type parameter.
 *
 * @example
 * ```ts
 * const someFunction = (record: UserRecord, recordWithName: UserRecord<{ select: { name: true; } }>) => {
 *   // The type of the `record` variable will include all fields of the model.
 *   const name = record.name;
 *   const otherField = record.otherField;
 *
 *   // The type of the `recordWithName` variable will only include the selected fields.
 *   const name = recordWithName.name;
 *   const otherField = recordWithName.otherField; // Type error: Property 'otherField' does not exist on type 'GadgetRecord<{ name: true; }>'.
 * }
 * ```
 */
export type UserRecord<Selection extends AvailableUserSelection | undefined = typeof DefaultUserSelection> = DeepFilterNever<GadgetRecord<SelectedUserOrDefault<{
    select: Selection;
}>>>;
export declare const DefaultUserSelection: {
    readonly __typename: true;
    readonly id: true;
    readonly createdAt: true;
    readonly email: true;
    readonly emailVerificationToken: true;
    readonly emailVerificationTokenExpiration: true;
    readonly emailVerified: true;
    readonly firstName: true;
    readonly googleImageUrl: true;
    readonly googleProfileId: true;
    readonly lastName: true;
    readonly lastSignedIn: true;
    readonly resetPasswordToken: true;
    readonly resetPasswordTokenExpiration: true;
    readonly roles: {
        readonly key: true;
        readonly name: true;
    };
    readonly updatedAt: true;
};
declare const modelApiIdentifier: "user";
declare const pluralModelApiIdentifier: "users";
/** Options that can be passed to the `UserManager#findOne` method */
export interface FindOneUserOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableUserSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
}
/** Options that can be passed to the `UserManager#maybeFindOne` method */
export interface MaybeFindOneUserOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableUserSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
}
/** Options that can be passed to the `UserManager#findMany` method */
export interface FindManyUsersOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableUserSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
    /** Return records sorted by these sorts */
    sort?: UserSort | UserSort[] | null;
    /** Only return records matching these filters. */
    filter?: UserFilter | UserFilter[] | null;
    /** Only return records matching this freeform search string */
    search?: string | null;
    first?: number | null;
    last?: number | null;
    after?: string | null;
    before?: string | null;
}
/** Options that can be passed to the `UserManager#findFirst` method */
export interface FindFirstUserOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableUserSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
    /** Return records sorted by these sorts */
    sort?: UserSort | UserSort[] | null;
    /** Only return records matching these filters. */
    filter?: UserFilter | UserFilter[] | null;
    /** Only return records matching this freeform search string */
    search?: string | null;
}
/** Options that can be passed to the `UserManager#maybeFindFirst` method */
export interface MaybeFindFirstUserOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableUserSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
    /** Return records sorted by these sorts */
    sort?: UserSort | UserSort[] | null;
    /** Only return records matching these filters. */
    filter?: UserFilter | UserFilter[] | null;
    /** Only return records matching this freeform search string */
    search?: string | null;
}
export interface SignUpUserOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableUserSelection;
}
export interface SignInUserOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableUserSelection;
}
export interface SignOutUserOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableUserSelection;
}
export interface UpdateUserOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableUserSelection;
}
export interface DeleteUserOptions {
}
export interface SendVerifyEmailUserOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableUserSelection;
}
export interface VerifyEmailUserOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableUserSelection;
}
export interface SendResetPasswordUserOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableUserSelection;
}
export interface ResetPasswordUserOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableUserSelection;
}
export interface ChangePasswordUserOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableUserSelection;
}
export interface UpsertUserOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableUserSelection;
}
/**
 * The fully-qualified, expanded form of the inputs for executing the signUp action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedSignUpUserVariables = {
    email: (Scalars['String'] | null) | null;
    password: (Scalars['String'] | null) | null;
};
/**
 * The inputs for executing signUp on user.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type SignUpUserVariables = FullyQualifiedSignUpUserVariables;
/**
 * The return value from executing signUp on user
 *
 **/
export type SignUpUserResult<Options extends SignUpUserOptions> = any;
/**
 * The fully-qualified, expanded form of the inputs for executing the signIn action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedSignInUserVariables = {
    email: (Scalars['String'] | null) | null;
    password: (Scalars['String'] | null) | null;
};
/**
 * The inputs for executing signIn on user.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type SignInUserVariables = FullyQualifiedSignInUserVariables;
/**
 * The return value from executing signIn on user
 * Is a GadgetRecord of the model's type.
 **/
export type SignInUserResult<Options extends SignInUserOptions> = SelectedUserOrDefault<Options> extends void ? void : GadgetRecord<SelectedUserOrDefault<Options>>;
/**
 * The return value from executing signOut on user
 * Is a GadgetRecord of the model's type.
 **/
export type SignOutUserResult<Options extends SignOutUserOptions> = SelectedUserOrDefault<Options> extends void ? void : GadgetRecord<SelectedUserOrDefault<Options>>;
/**
 * The fully-qualified, expanded form of the inputs for executing the update action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedUpdateUserVariables = {
    user?: UpdateUserInput;
};
/**
 * The inputs for executing update on user.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type UpdateUserVariables = UpdateUserInput;
/**
 * The return value from executing update on user
 * Is a GadgetRecord of the model's type.
 **/
export type UpdateUserResult<Options extends UpdateUserOptions> = SelectedUserOrDefault<Options> extends void ? void : GadgetRecord<SelectedUserOrDefault<Options>>;
/**
 * The return value from executing delete on user
 * Is void because this action deletes the record
 **/
export type DeleteUserResult<Options extends DeleteUserOptions> = void;
/**
 * The fully-qualified, expanded form of the inputs for executing the sendVerifyEmail action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedSendVerifyEmailUserVariables = {
    email: (Scalars['String'] | null) | null;
};
/**
 * The inputs for executing sendVerifyEmail on user.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type SendVerifyEmailUserVariables = FullyQualifiedSendVerifyEmailUserVariables;
/**
 * The return value from executing sendVerifyEmail on user
 *
 **/
export type SendVerifyEmailUserResult<Options extends SendVerifyEmailUserOptions> = any;
/**
 * The fully-qualified, expanded form of the inputs for executing the verifyEmail action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedVerifyEmailUserVariables = {
    code: (Scalars['String'] | null) | null;
};
/**
 * The inputs for executing verifyEmail on user.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type VerifyEmailUserVariables = FullyQualifiedVerifyEmailUserVariables;
/**
 * The return value from executing verifyEmail on user
 *
 **/
export type VerifyEmailUserResult<Options extends VerifyEmailUserOptions> = any;
/**
 * The fully-qualified, expanded form of the inputs for executing the sendResetPassword action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedSendResetPasswordUserVariables = {
    email: (Scalars['String'] | null) | null;
};
/**
 * The inputs for executing sendResetPassword on user.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type SendResetPasswordUserVariables = FullyQualifiedSendResetPasswordUserVariables;
/**
 * The return value from executing sendResetPassword on user
 *
 **/
export type SendResetPasswordUserResult<Options extends SendResetPasswordUserOptions> = any;
/**
 * The fully-qualified, expanded form of the inputs for executing the resetPassword action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedResetPasswordUserVariables = {
    password: (Scalars['String'] | null) | null;
    code: (Scalars['String'] | null) | null;
};
/**
 * The inputs for executing resetPassword on user.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type ResetPasswordUserVariables = FullyQualifiedResetPasswordUserVariables;
/**
 * The return value from executing resetPassword on user
 *
 **/
export type ResetPasswordUserResult<Options extends ResetPasswordUserOptions> = any;
/**
 * The fully-qualified, expanded form of the inputs for executing the changePassword action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedChangePasswordUserVariables = {
    currentPassword: (Scalars['String'] | null) | null;
    newPassword: (Scalars['String'] | null) | null;
};
/**
 * The inputs for executing changePassword on user.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type ChangePasswordUserVariables = FullyQualifiedChangePasswordUserVariables;
/**
 * The return value from executing changePassword on user
 * Is a GadgetRecord of the model's type.
 **/
export type ChangePasswordUserResult<Options extends ChangePasswordUserOptions> = SelectedUserOrDefault<Options> extends void ? void : GadgetRecord<SelectedUserOrDefault<Options>>;
/**
 * The fully-qualified, expanded form of the inputs for executing the upsert action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedUpsertUserVariables = {
    on?: ((Scalars['String'] | null))[];
    user?: UpsertUserInput;
    email: (Scalars['String'] | null) | null;
    password: (Scalars['String'] | null) | null;
};
/**
 * The inputs for executing upsert on user.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type UpsertUserVariables = Omit<UpsertUserInput, "on"> & {
    on?: ((Scalars['String'] | null))[];
};
/**
 * The return value from executing upsert on user
 *
 **/
export type UpsertUserResult<Options extends UpsertUserOptions> = any;
/**
 * A manager for the user model with all the available operations for reading and writing to it.*/
export type UserManager = {
    readonly connection: GadgetConnection;
    findOne: {
        /**
         * Finds one user by ID. Returns a `Promise` that resolves to the record if found and rejects the promise if the record isn't found.
         **/
        <Options extends FindOneUserOptions>(id: string, options?: LimitToKnownKeys<Options, FindOneUserOptions>): PromiseOrLiveIterator<Options, UserRecord<Options["select"]>>;
        type: 'findOne';
        operationName: typeof modelApiIdentifier;
        modelApiIdentifier: typeof modelApiIdentifier;
        findByVariableName: 'id';
        defaultSelection: typeof DefaultUserSelection;
        namespace: null;
        optionsType: FindOneUserOptions;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
    };
    maybeFindOne: {
        /**
         * Finds one user by ID. Returns a `Promise` that resolves to the record if found and returns null otherwise.
         **/
        <Options extends MaybeFindOneUserOptions>(id: string, options?: LimitToKnownKeys<Options, MaybeFindOneUserOptions>): PromiseOrLiveIterator<Options, UserRecord<Options["select"]> | null>;
        type: 'maybeFindOne';
        operationName: typeof modelApiIdentifier;
        modelApiIdentifier: typeof modelApiIdentifier;
        optionsType: MaybeFindOneUserOptions;
        findByVariableName: 'id';
        defaultSelection: typeof DefaultUserSelection;
        namespace: null;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
    };
    findMany: {
        /**
         * Finds many user. Returns a `Promise` for a `GadgetRecordList` of objects according to the passed `options`. Optionally filters the returned records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
         **/
        <Options extends FindManyUsersOptions>(options?: LimitToKnownKeys<Options, FindManyUsersOptions>): PromiseOrLiveIterator<Options, GadgetRecordList<UserRecord<Options["select"]>>>;
        type: 'findMany';
        operationName: typeof pluralModelApiIdentifier;
        modelApiIdentifier: typeof modelApiIdentifier;
        optionsType: FindManyUsersOptions;
        defaultSelection: typeof DefaultUserSelection;
        namespace: null;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
    };
    findFirst: {
        /**
         * Finds the first matching user. Returns a `Promise` that resolves to a record if found and rejects the promise if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
         **/
        <Options extends FindFirstUserOptions>(options?: LimitToKnownKeys<Options, FindFirstUserOptions>): PromiseOrLiveIterator<Options, UserRecord<Options["select"]>>;
        type: 'findFirst';
        operationName: typeof pluralModelApiIdentifier;
        optionsType: FindFirstUserOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultUserSelection;
        namespace: null;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
    };
    maybeFindFirst: {
        /**
         * Finds the first matching user. Returns a `Promise` that resolves to a record if found, or null if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` pagination options.
         **/
        <Options extends MaybeFindFirstUserOptions>(options?: LimitToKnownKeys<Options, MaybeFindFirstUserOptions>): PromiseOrLiveIterator<Options, UserRecord<Options["select"]> | null>;
        type: 'maybeFindFirst';
        operationName: typeof pluralModelApiIdentifier;
        optionsType: MaybeFindFirstUserOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultUserSelection;
        namespace: null;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
    };
    findById: {
        /**
        * Finds one user by its id. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
        **/
        <Options extends FindOneUserOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneUserOptions>): PromiseOrLiveIterator<Options, UserRecord<Options["select"]>>;
        type: 'findOne';
        operationName: typeof pluralModelApiIdentifier;
        findByField: 'id';
        findByVariableName: 'id';
        optionsType: FindOneUserOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultUserSelection;
        namespace: null;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
    };
    maybeFindById: {
        /**
        * Finds one user by its id. Returns a Promise that resolves to the record if found and returns null if the record isn't found.
        **/
        <Options extends FindOneUserOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneUserOptions>): Promise<UserRecord<Options["select"]> | null>;
        type: 'maybeFindOne';
        operationName: typeof pluralModelApiIdentifier;
        findByField: 'id';
        findByVariableName: 'id';
        optionsType: FindOneUserOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultUserSelection;
        namespace: null;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
    };
    findByEmail: {
        /**
        * Finds one user by its email. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
        **/
        <Options extends FindOneUserOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneUserOptions>): PromiseOrLiveIterator<Options, UserRecord<Options["select"]>>;
        type: 'findOne';
        operationName: typeof pluralModelApiIdentifier;
        findByField: 'email';
        findByVariableName: 'email';
        optionsType: FindOneUserOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultUserSelection;
        namespace: null;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
    };
    maybeFindByEmail: {
        /**
        * Finds one user by its email. Returns a Promise that resolves to the record if found and returns null if the record isn't found.
        **/
        <Options extends FindOneUserOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneUserOptions>): Promise<UserRecord<Options["select"]> | null>;
        type: 'maybeFindOne';
        operationName: typeof pluralModelApiIdentifier;
        findByField: 'email';
        findByVariableName: 'email';
        optionsType: FindOneUserOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultUserSelection;
        namespace: null;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
    };
    signUp: {
        /**
         * Executes the signUp action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the flat style, all-params-together overload that most use cases should use.
        *
        * @example
        * * const result = await api.user.signUp({
          *   email: "example@email.com",
          *   password: "nohacking123%",
          * });
        **/
        <Options extends SignUpUserOptions>(variables: SignUpUserVariables, options?: LimitToKnownKeys<Options, SignUpUserOptions>): Promise<SignUpUserResult<Options>>;
        /**
         * Executes the signUp action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
        *
        * @example
        * * const result = await api.user.signUp({
          *   email: "example@email.com",
          *   password: "nohacking123%",
          * });
        **/
        <Options extends SignUpUserOptions>(variables: FullyQualifiedSignUpUserVariables, options?: LimitToKnownKeys<Options, SignUpUserOptions>): Promise<SignUpUserResult<Options>>;
        type: 'action';
        operationName: 'signUpUser';
        operationReturnType: 'SignUpUser';
        namespace: null;
        modelApiIdentifier: typeof modelApiIdentifier;
        operatesWithRecordIdentity: false;
        modelSelectionField: typeof modelApiIdentifier;
        isBulk: false;
        isDeleter: false;
        variables: {
            email: {
                required: true;
                type: 'String';
            };
            password: {
                required: true;
                type: 'String';
            };
        };
        variablesType: ((FullyQualifiedSignUpUserVariables | SignUpUserVariables));
        hasAmbiguousIdentifier: false;
        paramOnlyVariables: [];
        hasReturnType: true;
        acceptsModelInput: false;
        hasCreateOrUpdateEffect: false;
        imports: ['Scalars'];
        optionsType: SignUpUserOptions;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    bulkSignUp: {
        /**
          * Executes the bulkSignUp action with the given inputs.
          */
        <Options extends SignUpUserOptions>(inputs: (FullyQualifiedSignUpUserVariables | SignUpUserVariables)[], options?: LimitToKnownKeys<Options, SignUpUserOptions>): Promise<any[]>;
        type: 'action';
        operationName: 'bulkSignUpUsers';
        isBulk: true;
        isDeleter: false;
        hasReturnType: true;
        acceptsModelInput: false;
        operatesWithRecordIdentity: false;
        singleActionFunctionName: 'signUp';
        modelApiIdentifier: typeof modelApiIdentifier;
        modelSelectionField: typeof pluralModelApiIdentifier;
        optionsType: SignUpUserOptions;
        namespace: null;
        variables: {
            inputs: {
                required: true;
                type: '[BulkSignUpUsersInput!]';
            };
        };
        variablesType: (FullyQualifiedSignUpUserVariables | SignUpUserVariables)[];
        paramOnlyVariables: [];
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    signIn: {
        /**
         * Executes the signIn action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the flat style, all-params-together overload that most use cases should use.
        *
        * @example
        * * const userRecord = await api.user.signIn({
          *   email: "example@email.com",
          *   password: "nohacking123%",
          * });
        **/
        <Options extends SignInUserOptions>(variables: SignInUserVariables, options?: LimitToKnownKeys<Options, SignInUserOptions>): Promise<SignInUserResult<Options>>;
        /**
         * Executes the signIn action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
        *
        * @example
        * * const userRecord = await api.user.signIn({
          *   email: "example@email.com",
          *   password: "nohacking123%",
          * });
        **/
        <Options extends SignInUserOptions>(variables: FullyQualifiedSignInUserVariables, options?: LimitToKnownKeys<Options, SignInUserOptions>): Promise<SignInUserResult<Options>>;
        type: 'action';
        operationName: 'signInUser';
        operationReturnType: 'SignInUser';
        namespace: null;
        modelApiIdentifier: typeof modelApiIdentifier;
        operatesWithRecordIdentity: true;
        modelSelectionField: typeof modelApiIdentifier;
        isBulk: false;
        isDeleter: false;
        variables: {
            email: {
                required: true;
                type: 'String';
            };
            password: {
                required: true;
                type: 'String';
            };
        };
        variablesType: ((FullyQualifiedSignInUserVariables | SignInUserVariables));
        hasAmbiguousIdentifier: false;
        paramOnlyVariables: [];
        hasReturnType: false;
        acceptsModelInput: false;
        hasCreateOrUpdateEffect: false;
        imports: ['Scalars'];
        optionsType: SignInUserOptions;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    bulkSignIn: {
        /**
          * Executes the bulkSignIn action with the given inputs.
          */
        <Options extends SignInUserOptions>(inputs: (FullyQualifiedSignInUserVariables | SignInUserVariables & {
            id: string;
        })[], options?: LimitToKnownKeys<Options, SignInUserOptions>): Promise<SignInUserResult<Options>[]>;
        type: 'action';
        operationName: 'bulkSignInUsers';
        isBulk: true;
        isDeleter: false;
        hasReturnType: false;
        acceptsModelInput: false;
        operatesWithRecordIdentity: true;
        singleActionFunctionName: 'signIn';
        modelApiIdentifier: typeof modelApiIdentifier;
        modelSelectionField: typeof pluralModelApiIdentifier;
        optionsType: SignInUserOptions;
        namespace: null;
        variables: {
            inputs: {
                required: true;
                type: '[BulkSignInUsersInput!]';
            };
        };
        variablesType: (FullyQualifiedSignInUserVariables | SignInUserVariables & {
            id: string;
        })[];
        paramOnlyVariables: [];
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    signOut: {
        /**
         * Executes the signOut actionon one record specified by `id`.Runs the action and returns a Promise for the updated record.
        *
        * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
        *
        * @example
        * * const userRecord = await api.user.signOut("1");
        **/
        <Options extends SignOutUserOptions>(id: string, options?: LimitToKnownKeys<Options, SignOutUserOptions>): Promise<SignOutUserResult<Options>>;
        type: 'action';
        operationName: 'signOutUser';
        operationReturnType: 'SignOutUser';
        namespace: null;
        modelApiIdentifier: typeof modelApiIdentifier;
        operatesWithRecordIdentity: true;
        modelSelectionField: typeof modelApiIdentifier;
        isBulk: false;
        isDeleter: false;
        variables: {
            id: {
                required: true;
                type: 'GadgetID';
            };
        };
        variablesType: ({
            id: string;
        });
        hasAmbiguousIdentifier: false;
        paramOnlyVariables: [];
        hasReturnType: false;
        acceptsModelInput: false;
        hasCreateOrUpdateEffect: false;
        imports: [];
        optionsType: SignOutUserOptions;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    bulkSignOut: {
        /**
          * Executes the bulkSignOut action with the given inputs.
          */
        <Options extends SignOutUserOptions>(ids: string[], options?: LimitToKnownKeys<Options, SignOutUserOptions>): Promise<SignOutUserResult<Options>[]>;
        type: 'action';
        operationName: 'bulkSignOutUsers';
        isBulk: true;
        isDeleter: false;
        hasReturnType: false;
        acceptsModelInput: false;
        operatesWithRecordIdentity: true;
        singleActionFunctionName: 'signOut';
        modelApiIdentifier: typeof modelApiIdentifier;
        modelSelectionField: typeof pluralModelApiIdentifier;
        optionsType: SignOutUserOptions;
        namespace: null;
        variables: {
            ids: {
                required: true;
                type: '[GadgetID!]';
            };
        };
        variablesType: IDsList | undefined;
        paramOnlyVariables: [];
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    update: {
        /**
         * Executes the update actionon one record specified by `id`.Runs the action and returns a Promise for the updated record.
        *
        * This is the flat style, all-params-together overload that most use cases should use.
        *
        * @example
        * * const userRecord = await api.user.update("1", {
          *   email: "example@email.com",
          *   emailVerified: true,
          *   firstName: "example value for firstName",
          *   googleImageUrl: "https://example.com",
          *   lastName: "example value for lastName",
          * });
        **/
        <Options extends UpdateUserOptions>(id: string, variables: UpdateUserVariables, options?: LimitToKnownKeys<Options, UpdateUserOptions>): Promise<UpdateUserResult<Options>>;
        /**
         * Executes the update actionon one record specified by `id`.Runs the action and returns a Promise for the updated record.
        *
        * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
        *
        * @example
        * * const userRecord = await api.user.update("1", {
          *   user: {
          *     email: "example@email.com",
          *     emailVerified: true,
          *     firstName: "example value for firstName",
          *     googleImageUrl: "https://example.com",
          *     lastName: "example value for lastName",
          *   },
          * });
        **/
        <Options extends UpdateUserOptions>(id: string, variables: FullyQualifiedUpdateUserVariables, options?: LimitToKnownKeys<Options, UpdateUserOptions>): Promise<UpdateUserResult<Options>>;
        type: 'action';
        operationName: 'updateUser';
        operationReturnType: 'UpdateUser';
        namespace: null;
        modelApiIdentifier: typeof modelApiIdentifier;
        operatesWithRecordIdentity: true;
        modelSelectionField: typeof modelApiIdentifier;
        isBulk: false;
        isDeleter: false;
        variables: {
            id: {
                required: true;
                type: 'GadgetID';
            };
            user: {
                required: false;
                type: 'UpdateUserInput';
            };
        };
        variablesType: ({
            id: string;
        } & (FullyQualifiedUpdateUserVariables | UpdateUserVariables));
        hasAmbiguousIdentifier: false;
        paramOnlyVariables: [];
        hasReturnType: false;
        acceptsModelInput: true;
        hasCreateOrUpdateEffect: true;
        imports: ['UpdateUserInput'];
        optionsType: UpdateUserOptions;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    bulkUpdate: {
        /**
          * Executes the bulkUpdate action with the given inputs.
          */
        <Options extends UpdateUserOptions>(inputs: (FullyQualifiedUpdateUserVariables | UpdateUserVariables & {
            id: string;
        })[], options?: LimitToKnownKeys<Options, UpdateUserOptions>): Promise<UpdateUserResult<Options>[]>;
        type: 'action';
        operationName: 'bulkUpdateUsers';
        isBulk: true;
        isDeleter: false;
        hasReturnType: false;
        acceptsModelInput: true;
        operatesWithRecordIdentity: true;
        singleActionFunctionName: 'update';
        modelApiIdentifier: typeof modelApiIdentifier;
        modelSelectionField: typeof pluralModelApiIdentifier;
        optionsType: UpdateUserOptions;
        namespace: null;
        variables: {
            inputs: {
                required: true;
                type: '[BulkUpdateUsersInput!]';
            };
        };
        variablesType: (FullyQualifiedUpdateUserVariables | UpdateUserVariables & {
            id: string;
        })[];
        paramOnlyVariables: [];
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    delete: {
        /**
         * Executes the delete actionon one record specified by `id`.Deletes the record on the server. Returns a Promise that resolves if the delete succeeds.
        *
        * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
        *
        * @example
        * * await api.user.delete("1");
        **/
        <Options extends DeleteUserOptions>(id: string, options?: LimitToKnownKeys<Options, DeleteUserOptions>): Promise<DeleteUserResult<Options>>;
        type: 'action';
        operationName: 'deleteUser';
        operationReturnType: 'DeleteUser';
        namespace: null;
        modelApiIdentifier: typeof modelApiIdentifier;
        operatesWithRecordIdentity: true;
        modelSelectionField: typeof modelApiIdentifier;
        isBulk: false;
        isDeleter: true;
        variables: {
            id: {
                required: true;
                type: 'GadgetID';
            };
        };
        variablesType: ({
            id: string;
        });
        hasAmbiguousIdentifier: false;
        paramOnlyVariables: [];
        hasReturnType: false;
        acceptsModelInput: false;
        hasCreateOrUpdateEffect: false;
        imports: [];
        optionsType: DeleteUserOptions;
        selectionType: Record<string, never>;
        schemaType: null;
        defaultSelection: null;
    };
    bulkDelete: {
        /**
          * Executes the bulkDelete action with the given inputs.Deletes the records on the server.
          */
        <Options extends DeleteUserOptions>(ids: string[], options?: LimitToKnownKeys<Options, DeleteUserOptions>): Promise<DeleteUserResult<Options>[]>;
        type: 'action';
        operationName: 'bulkDeleteUsers';
        isBulk: true;
        isDeleter: true;
        hasReturnType: false;
        acceptsModelInput: false;
        operatesWithRecordIdentity: true;
        singleActionFunctionName: 'delete';
        modelApiIdentifier: typeof modelApiIdentifier;
        modelSelectionField: typeof pluralModelApiIdentifier;
        optionsType: DeleteUserOptions;
        namespace: null;
        variables: {
            ids: {
                required: true;
                type: '[GadgetID!]';
            };
        };
        variablesType: IDsList | undefined;
        paramOnlyVariables: [];
        selectionType: Record<string, never>;
        schemaType: null;
        defaultSelection: null;
    };
    sendVerifyEmail: {
        /**
         * Executes the sendVerifyEmail action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the flat style, all-params-together overload that most use cases should use.
        *
        * @example
        * * const result = await api.user.sendVerifyEmail({
          *   email: "example@email.com",
          * });
        **/
        <Options extends SendVerifyEmailUserOptions>(variables: SendVerifyEmailUserVariables, options?: LimitToKnownKeys<Options, SendVerifyEmailUserOptions>): Promise<SendVerifyEmailUserResult<Options>>;
        /**
         * Executes the sendVerifyEmail action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
        *
        * @example
        * * const result = await api.user.sendVerifyEmail({
          *   email: "example@email.com",
          * });
        **/
        <Options extends SendVerifyEmailUserOptions>(variables: FullyQualifiedSendVerifyEmailUserVariables, options?: LimitToKnownKeys<Options, SendVerifyEmailUserOptions>): Promise<SendVerifyEmailUserResult<Options>>;
        type: 'action';
        operationName: 'sendVerifyEmailUser';
        operationReturnType: 'SendVerifyEmailUser';
        namespace: null;
        modelApiIdentifier: typeof modelApiIdentifier;
        operatesWithRecordIdentity: true;
        modelSelectionField: typeof modelApiIdentifier;
        isBulk: false;
        isDeleter: false;
        variables: {
            email: {
                required: true;
                type: 'String';
            };
        };
        variablesType: ((FullyQualifiedSendVerifyEmailUserVariables | SendVerifyEmailUserVariables));
        hasAmbiguousIdentifier: false;
        paramOnlyVariables: [];
        hasReturnType: true;
        acceptsModelInput: false;
        hasCreateOrUpdateEffect: false;
        imports: ['Scalars'];
        optionsType: SendVerifyEmailUserOptions;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    bulkSendVerifyEmail: {
        /**
          * Executes the bulkSendVerifyEmail action with the given inputs.
          */
        <Options extends SendVerifyEmailUserOptions>(inputs: (FullyQualifiedSendVerifyEmailUserVariables | SendVerifyEmailUserVariables & {
            id: string;
        })[], options?: LimitToKnownKeys<Options, SendVerifyEmailUserOptions>): Promise<any[]>;
        type: 'action';
        operationName: 'bulkSendVerifyEmailUsers';
        isBulk: true;
        isDeleter: false;
        hasReturnType: true;
        acceptsModelInput: false;
        operatesWithRecordIdentity: true;
        singleActionFunctionName: 'sendVerifyEmail';
        modelApiIdentifier: typeof modelApiIdentifier;
        modelSelectionField: typeof pluralModelApiIdentifier;
        optionsType: SendVerifyEmailUserOptions;
        namespace: null;
        variables: {
            inputs: {
                required: true;
                type: '[BulkSendVerifyEmailUsersInput!]';
            };
        };
        variablesType: (FullyQualifiedSendVerifyEmailUserVariables | SendVerifyEmailUserVariables & {
            id: string;
        })[];
        paramOnlyVariables: [];
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    verifyEmail: {
        /**
         * Executes the verifyEmail action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the flat style, all-params-together overload that most use cases should use.
        *
        * @example
        * * const result = await api.user.verifyEmail({
          *   code: "example value for code",
          * });
        **/
        <Options extends VerifyEmailUserOptions>(variables: VerifyEmailUserVariables, options?: LimitToKnownKeys<Options, VerifyEmailUserOptions>): Promise<VerifyEmailUserResult<Options>>;
        /**
         * Executes the verifyEmail action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
        *
        * @example
        * * const result = await api.user.verifyEmail({
          *   code: "example value for code",
          * });
        **/
        <Options extends VerifyEmailUserOptions>(variables: FullyQualifiedVerifyEmailUserVariables, options?: LimitToKnownKeys<Options, VerifyEmailUserOptions>): Promise<VerifyEmailUserResult<Options>>;
        type: 'action';
        operationName: 'verifyEmailUser';
        operationReturnType: 'VerifyEmailUser';
        namespace: null;
        modelApiIdentifier: typeof modelApiIdentifier;
        operatesWithRecordIdentity: true;
        modelSelectionField: typeof modelApiIdentifier;
        isBulk: false;
        isDeleter: false;
        variables: {
            code: {
                required: true;
                type: 'String';
            };
        };
        variablesType: ((FullyQualifiedVerifyEmailUserVariables | VerifyEmailUserVariables));
        hasAmbiguousIdentifier: false;
        paramOnlyVariables: [];
        hasReturnType: true;
        acceptsModelInput: false;
        hasCreateOrUpdateEffect: false;
        imports: ['Scalars'];
        optionsType: VerifyEmailUserOptions;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    bulkVerifyEmail: {
        /**
          * Executes the bulkVerifyEmail action with the given inputs.
          */
        <Options extends VerifyEmailUserOptions>(inputs: (FullyQualifiedVerifyEmailUserVariables | VerifyEmailUserVariables & {
            id: string;
        })[], options?: LimitToKnownKeys<Options, VerifyEmailUserOptions>): Promise<any[]>;
        type: 'action';
        operationName: 'bulkVerifyEmailUsers';
        isBulk: true;
        isDeleter: false;
        hasReturnType: true;
        acceptsModelInput: false;
        operatesWithRecordIdentity: true;
        singleActionFunctionName: 'verifyEmail';
        modelApiIdentifier: typeof modelApiIdentifier;
        modelSelectionField: typeof pluralModelApiIdentifier;
        optionsType: VerifyEmailUserOptions;
        namespace: null;
        variables: {
            inputs: {
                required: true;
                type: '[BulkVerifyEmailUsersInput!]';
            };
        };
        variablesType: (FullyQualifiedVerifyEmailUserVariables | VerifyEmailUserVariables & {
            id: string;
        })[];
        paramOnlyVariables: [];
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    sendResetPassword: {
        /**
         * Executes the sendResetPassword action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the flat style, all-params-together overload that most use cases should use.
        *
        * @example
        * * const result = await api.user.sendResetPassword({
          *   email: "example@email.com",
          * });
        **/
        <Options extends SendResetPasswordUserOptions>(variables: SendResetPasswordUserVariables, options?: LimitToKnownKeys<Options, SendResetPasswordUserOptions>): Promise<SendResetPasswordUserResult<Options>>;
        /**
         * Executes the sendResetPassword action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
        *
        * @example
        * * const result = await api.user.sendResetPassword({
          *   email: "example@email.com",
          * });
        **/
        <Options extends SendResetPasswordUserOptions>(variables: FullyQualifiedSendResetPasswordUserVariables, options?: LimitToKnownKeys<Options, SendResetPasswordUserOptions>): Promise<SendResetPasswordUserResult<Options>>;
        type: 'action';
        operationName: 'sendResetPasswordUser';
        operationReturnType: 'SendResetPasswordUser';
        namespace: null;
        modelApiIdentifier: typeof modelApiIdentifier;
        operatesWithRecordIdentity: true;
        modelSelectionField: typeof modelApiIdentifier;
        isBulk: false;
        isDeleter: false;
        variables: {
            email: {
                required: true;
                type: 'String';
            };
        };
        variablesType: ((FullyQualifiedSendResetPasswordUserVariables | SendResetPasswordUserVariables));
        hasAmbiguousIdentifier: false;
        paramOnlyVariables: [];
        hasReturnType: true;
        acceptsModelInput: false;
        hasCreateOrUpdateEffect: false;
        imports: ['Scalars'];
        optionsType: SendResetPasswordUserOptions;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    bulkSendResetPassword: {
        /**
          * Executes the bulkSendResetPassword action with the given inputs.
          */
        <Options extends SendResetPasswordUserOptions>(inputs: (FullyQualifiedSendResetPasswordUserVariables | SendResetPasswordUserVariables & {
            id: string;
        })[], options?: LimitToKnownKeys<Options, SendResetPasswordUserOptions>): Promise<any[]>;
        type: 'action';
        operationName: 'bulkSendResetPasswordUsers';
        isBulk: true;
        isDeleter: false;
        hasReturnType: true;
        acceptsModelInput: false;
        operatesWithRecordIdentity: true;
        singleActionFunctionName: 'sendResetPassword';
        modelApiIdentifier: typeof modelApiIdentifier;
        modelSelectionField: typeof pluralModelApiIdentifier;
        optionsType: SendResetPasswordUserOptions;
        namespace: null;
        variables: {
            inputs: {
                required: true;
                type: '[BulkSendResetPasswordUsersInput!]';
            };
        };
        variablesType: (FullyQualifiedSendResetPasswordUserVariables | SendResetPasswordUserVariables & {
            id: string;
        })[];
        paramOnlyVariables: [];
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    resetPassword: {
        /**
         * Executes the resetPassword action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the flat style, all-params-together overload that most use cases should use.
        *
        * @example
        * * const result = await api.user.resetPassword({
          *   code: "example value for code",
          *   password: "nohacking123%",
          * });
        **/
        <Options extends ResetPasswordUserOptions>(variables: ResetPasswordUserVariables, options?: LimitToKnownKeys<Options, ResetPasswordUserOptions>): Promise<ResetPasswordUserResult<Options>>;
        /**
         * Executes the resetPassword action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
        *
        * @example
        * * const result = await api.user.resetPassword({
          *   code: "example value for code",
          *   password: "nohacking123%",
          * });
        **/
        <Options extends ResetPasswordUserOptions>(variables: FullyQualifiedResetPasswordUserVariables, options?: LimitToKnownKeys<Options, ResetPasswordUserOptions>): Promise<ResetPasswordUserResult<Options>>;
        type: 'action';
        operationName: 'resetPasswordUser';
        operationReturnType: 'ResetPasswordUser';
        namespace: null;
        modelApiIdentifier: typeof modelApiIdentifier;
        operatesWithRecordIdentity: true;
        modelSelectionField: typeof modelApiIdentifier;
        isBulk: false;
        isDeleter: false;
        variables: {
            password: {
                required: true;
                type: 'String';
            };
            code: {
                required: true;
                type: 'String';
            };
        };
        variablesType: ((FullyQualifiedResetPasswordUserVariables | ResetPasswordUserVariables));
        hasAmbiguousIdentifier: false;
        paramOnlyVariables: [];
        hasReturnType: true;
        acceptsModelInput: false;
        hasCreateOrUpdateEffect: false;
        imports: ['Scalars'];
        optionsType: ResetPasswordUserOptions;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    bulkResetPassword: {
        /**
          * Executes the bulkResetPassword action with the given inputs.
          */
        <Options extends ResetPasswordUserOptions>(inputs: (FullyQualifiedResetPasswordUserVariables | ResetPasswordUserVariables & {
            id: string;
        })[], options?: LimitToKnownKeys<Options, ResetPasswordUserOptions>): Promise<any[]>;
        type: 'action';
        operationName: 'bulkResetPasswordUsers';
        isBulk: true;
        isDeleter: false;
        hasReturnType: true;
        acceptsModelInput: false;
        operatesWithRecordIdentity: true;
        singleActionFunctionName: 'resetPassword';
        modelApiIdentifier: typeof modelApiIdentifier;
        modelSelectionField: typeof pluralModelApiIdentifier;
        optionsType: ResetPasswordUserOptions;
        namespace: null;
        variables: {
            inputs: {
                required: true;
                type: '[BulkResetPasswordUsersInput!]';
            };
        };
        variablesType: (FullyQualifiedResetPasswordUserVariables | ResetPasswordUserVariables & {
            id: string;
        })[];
        paramOnlyVariables: [];
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    changePassword: {
        /**
         * Executes the changePassword actionon one record specified by `id`.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the flat style, all-params-together overload that most use cases should use.
        *
        * @example
        * * const userRecord = await api.user.changePassword("1", {
          *   currentPassword: "nohacking123%",
          *   newPassword: "nohacking123%",
          * });
        **/
        <Options extends ChangePasswordUserOptions>(id: string, variables: ChangePasswordUserVariables, options?: LimitToKnownKeys<Options, ChangePasswordUserOptions>): Promise<ChangePasswordUserResult<Options>>;
        /**
         * Executes the changePassword actionon one record specified by `id`.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
        *
        * @example
        * * const userRecord = await api.user.changePassword("1", {
          *   currentPassword: "nohacking123%",
          *   newPassword: "nohacking123%",
          * });
        **/
        <Options extends ChangePasswordUserOptions>(id: string, variables: FullyQualifiedChangePasswordUserVariables, options?: LimitToKnownKeys<Options, ChangePasswordUserOptions>): Promise<ChangePasswordUserResult<Options>>;
        type: 'action';
        operationName: 'changePasswordUser';
        operationReturnType: 'ChangePasswordUser';
        namespace: null;
        modelApiIdentifier: typeof modelApiIdentifier;
        operatesWithRecordIdentity: true;
        modelSelectionField: typeof modelApiIdentifier;
        isBulk: false;
        isDeleter: false;
        variables: {
            id: {
                required: true;
                type: 'GadgetID';
            };
            currentPassword: {
                required: true;
                type: 'String';
            };
            newPassword: {
                required: true;
                type: 'String';
            };
        };
        variablesType: ({
            id: string;
        } & (FullyQualifiedChangePasswordUserVariables | ChangePasswordUserVariables));
        hasAmbiguousIdentifier: false;
        paramOnlyVariables: [];
        hasReturnType: false;
        acceptsModelInput: false;
        hasCreateOrUpdateEffect: false;
        imports: ['Scalars'];
        optionsType: ChangePasswordUserOptions;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    bulkChangePassword: {
        /**
          * Executes the bulkChangePassword action with the given inputs.
          */
        <Options extends ChangePasswordUserOptions>(inputs: (FullyQualifiedChangePasswordUserVariables | ChangePasswordUserVariables & {
            id: string;
        })[], options?: LimitToKnownKeys<Options, ChangePasswordUserOptions>): Promise<ChangePasswordUserResult<Options>[]>;
        type: 'action';
        operationName: 'bulkChangePasswordUsers';
        isBulk: true;
        isDeleter: false;
        hasReturnType: false;
        acceptsModelInput: false;
        operatesWithRecordIdentity: true;
        singleActionFunctionName: 'changePassword';
        modelApiIdentifier: typeof modelApiIdentifier;
        modelSelectionField: typeof pluralModelApiIdentifier;
        optionsType: ChangePasswordUserOptions;
        namespace: null;
        variables: {
            inputs: {
                required: true;
                type: '[BulkChangePasswordUsersInput!]';
            };
        };
        variablesType: (FullyQualifiedChangePasswordUserVariables | ChangePasswordUserVariables & {
            id: string;
        })[];
        paramOnlyVariables: [];
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    upsert: {
        /**
         * Executes the upsert action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the flat style, all-params-together overload that most use cases should use.
        *
        * @example
        * * const result = await api.user.upsert({
          *   email: "example@email.com",
          *   emailVerified: true,
          *   firstName: "example value for firstName",
          *   id: "1",
          *   lastName: "example value for lastName",
          *   on: ["email"],
          *   password: "nohacking123%",
          * });
        **/
        <Options extends UpsertUserOptions>(variables: UpsertUserVariables, options?: LimitToKnownKeys<Options, UpsertUserOptions>): Promise<UpsertUserResult<Options>>;
        /**
         * Executes the upsert action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
        *
        * @example
        * * const result = await api.user.upsert({
          *   email: "example@email.com",
          *   on: ["email"],
          *   password: "nohacking123%",
          *   user: {
          *     email: "example@email.com",
          *     emailVerified: true,
          *     firstName: "example value for firstName",
          *     id: "1",
          *     lastName: "example value for lastName",
          *   },
          * });
        **/
        <Options extends UpsertUserOptions>(variables: FullyQualifiedUpsertUserVariables, options?: LimitToKnownKeys<Options, UpsertUserOptions>): Promise<UpsertUserResult<Options>>;
        type: 'action';
        operationName: 'upsertUser';
        operationReturnType: 'UpsertUser';
        namespace: null;
        modelApiIdentifier: typeof modelApiIdentifier;
        operatesWithRecordIdentity: false;
        modelSelectionField: typeof modelApiIdentifier;
        isBulk: false;
        isDeleter: false;
        variables: {
            on: {
                required: false;
                type: '[String!]';
            };
            user: {
                required: false;
                type: 'UpsertUserInput';
            };
            email: {
                required: true;
                type: 'String';
            };
            password: {
                required: true;
                type: 'String';
            };
        };
        variablesType: ((FullyQualifiedUpsertUserVariables | UpsertUserVariables));
        hasAmbiguousIdentifier: false;
        paramOnlyVariables: ['on'];
        hasReturnType: {
            '... on SignUpUserResult': {
                hasReturnType: true;
            };
            '... on UpdateUserResult': {
                hasReturnType: false;
            };
        };
        acceptsModelInput: true;
        hasCreateOrUpdateEffect: true;
        imports: ['Scalars', 'UpsertUserInput'];
        optionsType: UpsertUserOptions;
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
    bulkUpsert: {
        /**
          * Executes the bulkUpsert action with the given inputs.
          */
        <Options extends UpsertUserOptions>(inputs: (FullyQualifiedUpsertUserVariables | UpsertUserVariables)[], options?: LimitToKnownKeys<Options, UpsertUserOptions>): Promise<any[]>;
        type: 'action';
        operationName: 'bulkUpsertUsers';
        isBulk: true;
        isDeleter: false;
        hasReturnType: {
            users: {
                hasReturnType: {
                    '... on User': {
                        select: true;
                    };
                    '... on UpsertUserReturnType': {
                        hasReturnType: true;
                    };
                };
            };
        };
        acceptsModelInput: true;
        operatesWithRecordIdentity: false;
        singleActionFunctionName: 'upsert';
        modelApiIdentifier: typeof modelApiIdentifier;
        modelSelectionField: typeof pluralModelApiIdentifier;
        optionsType: UpsertUserOptions;
        namespace: null;
        variables: {
            inputs: {
                required: true;
                type: '[BulkUpsertUsersInput!]';
            };
        };
        variablesType: (FullyQualifiedUpsertUserVariables | UpsertUserVariables)[];
        paramOnlyVariables: ['on'];
        selectionType: AvailableUserSelection;
        schemaType: Query["user"];
        defaultSelection: typeof DefaultUserSelection;
    };
};
/**
 * A manager for the user model with all the available operations for reading and writing to it.*/
export declare const UserManager: {
    new (connection: GadgetConnection): UserManager;
};
export {};
