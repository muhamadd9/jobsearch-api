import { GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import companyResolvers from "./resolvers/company.resolver.js";
import { companiesType, companyType } from "./types/company.types.js";
import { usersType } from "./types/user.types.js";
import userResolvers from "./resolvers/user.resolver.js";

const query = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: {
    getAllCompanies: {
      type: companiesType,
      resolve: companyResolvers.Query.getAllCompanies,
    },
    getAllUsers: {
      type: usersType,
      resolve: userResolvers.Query.getAllUsers,
    },
  },
});
const mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: {
    banOrUnBanCompany: {
      type: companyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        action: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: companyResolvers.Mutation.banOrUnBanCompany,
    },
    approveCompany: {
      type: companyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: companyResolvers.Mutation.approveCompany,
    },
  },
});

const schema = new GraphQLSchema({
  query,
  mutation,
});

export default schema;
