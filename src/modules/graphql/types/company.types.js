import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { imgType } from "./globalTypes.js";

export const companyType = new GraphQLObjectType({
  name: "Company",
  fields: {
    companyName: { type: GraphQLString },
    description: { type: GraphQLString },
    industry: { type: GraphQLString },
    numberOfEmployees: { type: GraphQLInt },
    createdBy: { type: GraphQLID },
    logo: { type: imgType },
    coverPic: { type: imgType },
    companyEmail: { type: GraphQLString },
    address: { type: GraphQLString },
    approvedByAdmin: { type: GraphQLBoolean },
    _id: { type: GraphQLID },
    bannedAt: { type: GraphQLString },
    deletedAt: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    HRs: { type: new GraphQLList(GraphQLID) },
    jobs: { type: new GraphQLList(GraphQLID) },
  },
});

export const companiesType = new GraphQLList(companyType);
