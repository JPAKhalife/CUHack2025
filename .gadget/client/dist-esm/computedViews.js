import { assertOperationSuccess } from "@gadgetinc/api-client-core";
import { variableOptionsToVariables } from "./utils.js";
import { Call, compile, compileWithVariableValues, Var } from "tiny-graphql-query-compiler";
const computedViewOperation = (operation, variables, namespace) => {
  let fields = {
    [operation]: Call(variables ? variableOptionsToVariables(variables) : {})
  };
  if (namespace) {
    fields = namespacify(namespace, fields);
  }
  return variables ? compileWithVariableValues({ type: "query", name: operation, fields }) : { query: compile({ type: "query", name: operation, fields }), variables: {} };
};
const computedViewRunner = async (connection, operation, variableValues, namespace) => {
  const { query, variables } = computedViewOperation(operation, variableValues, namespace);
  const response = await connection.currentClient.query(query, variables);
  const dataPath = namespaceDataPath([operation], namespace);
  return assertOperationSuccess(response, dataPath);
};
const inlineComputedViewOperation = (query, gqlFieldName, variables, namespace) => {
  const operation = gqlFieldName;
  const vars = {
    query: Var({ type: "String", value: query, required: true })
  };
  if (variables)
    vars["variables"] = Var({ type: "JSONObject", value: variables });
  let fields = {
    [operation]: Call(variableOptionsToVariables(vars))
  };
  if (namespace)
    fields = namespacify(namespace, fields);
  return compileWithVariableValues({ type: "query", name: operation, fields });
};
const inlineComputedViewRunner = async (connection, gqlFieldName, viewQuery, variables, namespace) => {
  const { query, variables: vars } = inlineComputedViewOperation(viewQuery, gqlFieldName, variables, namespace);
  const response = await connection.currentClient.query(query, vars);
  const dataPath = namespaceDataPath([gqlFieldName], namespace);
  return assertOperationSuccess(response, dataPath);
};
function namespacify(namespace, fields) {
  if (!namespace)
    return fields;
  if (!Array.isArray(namespace)) {
    namespace = [namespace];
  }
  if (namespace) {
    for (let i = namespace.length - 1; i >= 0; i--) {
      fields = {
        [namespace[i]]: fields
      };
    }
  }
  return fields;
}
const namespaceDataPath = (dataPath, namespace) => {
  if (namespace) {
    dataPath.unshift(...Array.isArray(namespace) ? namespace : [namespace]);
  }
  return dataPath;
};
export {
  computedViewOperation,
  computedViewRunner,
  inlineComputedViewOperation,
  inlineComputedViewRunner
};
//# sourceMappingURL=computedViews.js.map
