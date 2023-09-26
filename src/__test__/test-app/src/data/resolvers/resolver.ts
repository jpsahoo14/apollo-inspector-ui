import { Query } from "./query/query";
import { mutation } from "./mutation/mutation";
import { subscrption } from "./subscription/subscription";

export const resolvers = {
  Query,
  Mutation: mutation,
  Subscription: subscrption,
};
