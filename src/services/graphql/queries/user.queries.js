import userResolvers from "../resolvers/user.resolver.js";
import { usersType } from "../types/user.types.js";

export const userQueries = {
  getAllUsers: {
    type: usersType,
    resolve: userResolvers.Query.getAllUsers,
  },
};
