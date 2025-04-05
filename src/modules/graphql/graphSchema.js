import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { companyMutations } from "./mutations/company.mutations.js";
import { companyQueries } from "./queries/company.queries.js";
import { userQueries } from "./queries/user.queries.js";

const query = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: {
    ...companyQueries,
    ...userQueries,
  },
});
const mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: {
    ...companyMutations,
  },
});

const schema = new GraphQLSchema({
  query,
  mutation,
});

export default schema;
