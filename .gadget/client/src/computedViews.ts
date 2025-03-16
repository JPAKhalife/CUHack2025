import { assertOperationSuccess, type GadgetConnection, type VariablesOptions } from "@gadgetinc/api-client-core";
import { variableOptionsToVariables } from "./utils.js";
import { Call, compile, compileWithVariableValues, Var, type Variable } from "tiny-graphql-query-compiler";

// This is a function that represents a computed view that doesn't take any input parameters/variables.
// Result is an explicit type parameter defining the shape of the full result.
export type ComputedViewFunctionWithoutVariables<Result> = () => Promise<Result>;

// Represents a computed view that doesn't take any input parameters/variables.
// It includes the view function and the view metadata.
export interface ComputedViewWithoutVariables<Result> extends ComputedViewFunctionWithoutVariables<Result> {
  type: "computedView";
  operationName: string;
  namespace: string | string[] | null;
  resultType: Result;
}

// This is a function that represents a computed view that takes input parameters/variables.
// Result is an explicit type parameter defining the shape of the full result.
// Variables is an explicit type parameter that describes the shape of the variables parameter.
export type ComputedViewFunctionWithVariables<Variables, Result> = (variables: Variables) => Promise<Result>;

// Represents a computed view that takes input parameters/variables.
// It includes the view function and the view metadata.
export interface ComputedViewWithVariables<Variables, Result> extends ComputedViewFunctionWithVariables<Variables, Result> {
  type: "computedView";
  operationName: string;
  namespace: string | string[] | null;
  variables: VariablesOptions;
  variablesType: Variables;
  resultType: Result;
}

export const computedViewOperation = (
  operation: string,
  variables?: VariablesOptions,
  namespace?: string | string[] | null
): {
  query: string;
  variables: Record<string, any>;
} => {
  let fields = {
    [operation]: Call(variables ? variableOptionsToVariables(variables) : {}),
  };

  if (namespace) {
    fields = namespacify(namespace, fields);
  }

  return variables
    ? compileWithVariableValues({ type: "query", name: operation, fields })
    : { query: compile({ type: "query", name: operation, fields }), variables: {} };
};

export const computedViewRunner = async (
  connection: GadgetConnection,
  operation: string,
  variableValues?: VariablesOptions,
  namespace?: string | string[] | null
): Promise<any> => {
  const { query, variables } = computedViewOperation(operation, variableValues, namespace);
  const response = await connection.currentClient.query(query, variables);
  const dataPath = namespaceDataPath([operation], namespace);
  return assertOperationSuccess(response, dataPath);
};

export const inlineComputedViewOperation = (
  query: string,
  gqlFieldName: string,
  variables?: Record<string, any>,
  namespace?: string | string[] | null
): {
  query: string;
  variables: Record<string, any>;
} => {
  const operation = gqlFieldName;
  const vars: Record<string, Variable> = {
    query: Var({ type: "String", value: query, required: true }),
  };
  if (variables) vars["variables"] = Var({ type: "JSONObject", value: variables });
  let fields = {
    [operation]: Call(variableOptionsToVariables(vars)),
  };
  if (namespace) fields = namespacify(namespace, fields);
  return compileWithVariableValues({ type: "query", name: operation, fields });
};

export const inlineComputedViewRunner = async (
  connection: GadgetConnection,
  gqlFieldName: string,
  viewQuery: string,
  variables?: Record<string, any>,
  namespace?: string | string[] | null
): Promise<unknown> => {
  const { query, variables: vars } = inlineComputedViewOperation(viewQuery, gqlFieldName, variables, namespace);
  const response = await connection.currentClient.query(query, vars);
  const dataPath = namespaceDataPath([gqlFieldName], namespace);
  return assertOperationSuccess(response, dataPath);
};

/**
 * Had to duplicate these from api-client-core to make 0.15.20 tests happy,
 * Hopefully we can get rid of this duplication at some point
 *
 * Wrap a field selection in a set of namespaces
 **/
function namespacify(namespace: string[] | string | undefined | null, fields: any) {
  if (!namespace) return fields;
  if (!Array.isArray(namespace)) {
    namespace = [namespace];
  }
  if (namespace) {
    for (let i = namespace.length - 1; i >= 0; i--) {
      fields = {
        [namespace[i]]: fields,
      };
    }
  }
  return fields;
}

const namespaceDataPath = (dataPath: string[], namespace?: string[] | string | null) => {
  if (namespace) {
    dataPath.unshift(...(Array.isArray(namespace) ? namespace : [namespace]));
  }
  return dataPath;
};
