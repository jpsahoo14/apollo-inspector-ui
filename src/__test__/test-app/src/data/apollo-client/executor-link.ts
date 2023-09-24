import { ApolloLink, Observable } from "@apollo/client";
import { execute, subscribe, getOperationAST } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import { schemaDocumentNode } from "../data-schema/schema";
import { resolvers } from "../resolvers/resolver";

export const executorLink = new ApolloLink((operation) => {
  const { query: document, variables: variableValues } = operation;
  const { operation: operationType } = getOperationAST(document, null)!;
  const operationContext = operation.getContext();

  // IncrementalSchemaLink sets `contextValue` and `schema` in operation's context
  const graphqlSchema = makeExecutableSchema({
    typeDefs: schemaDocumentNode,
    resolvers,
  });

  if (operationType === "subscription") {
    // eslint-disable-next-line msteams/must-unsubscribe
    return subscribe({
      schema: graphqlSchema,
      document,
      contextValue: operationContext,
      variableValues,
    });
  }

  return new Observable((observer) => {
    try {
      Promise.resolve(
        execute({
          schema: graphqlSchema,
          document,
          variableValues,
          contextValue: operationContext,
        })
      ).then(
        (result) => {
          if (!observer.closed) {
            observer.next(result);
            observer.complete();
          }
        },
        (error) => {
          /* istanbul ignore next */
          if (!observer.closed) {
            observer.error(error);
          }
        }
      );
    } catch (error) {
      /* istanbul ignore next */
      if (!observer.closed) {
        observer.error(error);
      }
    }
  });
});
