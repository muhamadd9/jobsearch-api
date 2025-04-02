import User from "../../../DB/model/userModel.js";

const resolvers = {
  Query: {
    getAllUsers: async () => {
      return await User.find();
    },
  },
};

export default resolvers;
