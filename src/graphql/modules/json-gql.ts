import { createModule, gql } from 'graphql-modules';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';

export default createModule({
  id: 'json-module',
  dirname: __dirname,
  typeDefs: [
    gql`
      scalar JSON
      scalar JSONObject
    `
  ],
  resolvers: {
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject
  }
});
