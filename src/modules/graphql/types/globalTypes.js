import { GraphQLObjectType, GraphQLString } from "graphql";

export const imgType = new GraphQLObjectType({
  name: "Image",
  fields: {
    public_id: { type: GraphQLString },
    url: { type: GraphQLString },
  },
});
