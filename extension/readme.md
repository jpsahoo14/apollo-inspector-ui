# Apollo Inspector

Apollo Inspector is a Chrome extension designed for the open-source GraphQL client, Apollo Client.

## Getting Started

To enable the Apollo Inspector extension to work, follow these instructions:

1. **Single Apollo Client Instance:**

   - If your web app has a single instance of Apollo Client, attach it to the `__APOLLO_CLIENT__` variable on the window object.

   ```js
   window.__APOLLO_CLIENT__ = yourApolloClientInstance;
   ```

2. **Multiple Apollo Client Instances:**

   - If your web app has multiple instances of Apollo Client, create an array (`ClientObject[]`) containing all these instances and attach it to the `__APOLLO_CLIENTS__` variable on the window object.

   ```js
   window.__APOLLO_CLIENTS__ = [apolloClientInstance1, apolloClientInstance2, ...];
   ```

   - Ensure that each Apollo Client instance is added to the array using following type.

   ```typescript
   type ClientObject = {
     clientId: string;
     client: ApolloClient<NormalizedCacheObject>;
   };
   ```

By following these steps, the Apollo Inspector extension can access the Apollo Client instance(s) from the window object, allowing you to debug and analyze GraphQL operations effectively.

### This tool is particularly useful for debugging various issues related to GraphQL operations in Apollo Client. Here's an overview of the tool's functionalities:

## Debuggable Issues

1. Helps figuring out `unwanted operations` being executed in render phase
2. Help in figuring out the reasons for `multiple re-renders` of the same watch query​
3. Help figuring out issues with `conflicting queries​`
4. Shows field name in case `missing field error`.
5. Detailed time info lets you figure out if queries are being fired in `Waterfall model` or not.
6. Helps figuring out if `data is taking too much time` to get written to cache.
7. Shows why an operation failed

## Built-in Features

1. **Operation Tracking:**

   - Tracks various operations, including Query, Mutation, Subscription, and cache-related operations.

2. **Operation Information:**

   - Provides detailed information for each operation, such as Operation Name, Type, Success/Failure status, Fetch policy, Execution time, Queued time, and Result size in KB.

3. **Filters:**

   - Offers filters to refine the operations list based on:
     - Operation type (Query/Mutation/Subscription)
     - Results source (Cache/Network)
     - Operation status (Succeeded/Failed)

4. **Affected Queries:**

   - Displays operations responsible for re-rendering a specific watch query in the "Affected Queries" view. Affected queries are the watch queries which re-rendered due to update in the Apollo cache store.

5. **Data Export:**

   - Allows users to copy operations data in JSON format for further analysis.

6. **Cache:**

   - Allows to copy whole Apollo cache data in JSON format.
   - Also one can clear or reset Apollo cache from configuration page.
