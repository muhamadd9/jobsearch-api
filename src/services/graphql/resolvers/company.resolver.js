import { findById } from "../../../DB/dbHelper.js";
import Company from "../../../DB/model/companyModel.js";

const resolvers = {
  Query: {
    getAllCompanies: async () => {
      return await Company.find();
    },
  },
  Mutation: {
    banOrUnBanCompany: async (parent, args) => {
      const { id: companyId, action } = args;
      console.log({ id: companyId, action });
      const company = await findById({ model: Company, id: companyId });
      if (!company) return next(new ErrorResponse("Company not found.", 404));
      if (action === "ban") {
        company.bannedAt = new Date(Date.now());
      } else if (action === "unban") {
        company.bannedAt = null;
      }
      await company.save();
      return company;
    },
    approveCompany: async (parent, args) => {
      const { id: companyId } = args;
      const company = await findById({ model: Company, id: companyId });
      if (!company) return next(new ErrorResponse("Company not found.", 404));
      company.approvedByAdmin = true;
      await company.save();
      return company;
    },
  },
};

export default resolvers;
