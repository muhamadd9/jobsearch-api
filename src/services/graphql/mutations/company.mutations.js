import { GraphQLEnumType, GraphQLNonNull, GraphQLString } from "graphql";
import { companyType } from "../types/company.types.js";
import companyResolvers from "../resolvers/company.resolver.js";

export const companyMutations = {
  banOrUnBanCompany: {
    type: companyType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
      action: {
        type: new GraphQLNonNull(
          new GraphQLEnumType({
            name: "BanOrUnBanCompanyAction",
            values: {
              ban: { value: "ban" },
              unban: { value: "unban" },
            },
          })
        ),
      },
      authorization: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: companyResolvers.Mutation.banOrUnBanCompany,
  },
  approveCompany: {
    type: companyType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
      authorization: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: companyResolvers.Mutation.approveCompany,
  },
};
