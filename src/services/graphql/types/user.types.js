import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLList } from "graphql";
import { imgType } from "./globalTypes.js";

export const userType = new GraphQLObjectType({
  name: "User",
  fields: {
    _id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    mobileNumber: { type: GraphQLString },
    profilePic: { type: imgType },
    coverPic: { type: imgType },
    isConfirmed: { type: GraphQLBoolean },
    role: { type: GraphQLString },
    provider: { type: GraphQLString },
    bannedAt: { type: GraphQLString },
    deletedAt: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

export const usersType = new GraphQLList(userType);
