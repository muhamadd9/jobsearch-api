import { findById, findOneAndUpdate } from "../../../DB/dbHelper.js";
import Company from "../../../DB/model/companyModel.js";
import authenticate from "../../../middleware/graphql/auth.js";
import validate from "../../../middleware/graphql/validation.js";
import { roles } from "../../../utils/constants/userConstants.js";
import { approveCompanySchema, banOrUnbanCompanySchema } from "../validations/company.validation.js";

const resolvers = {
  Query: {
    getAllCompanies: async () => {
      return await Company.find();
    },
  },
  Mutation: {
    banOrUnBanCompany: async (parent, args) => {
      const { id: companyId, action, authorization } = args;
      const valid = validate(banOrUnbanCompanySchema, args);
      if(!valid) return next(new ErrorResponse("Invalid input", 400));
      const user = await authenticate({ authorization, accessRoles: [roles.admin] });

      let company = await findById({ model: Company, id: companyId });
      if (!company) return next(new ErrorResponse("Company not found.", 404));
      if (action === "ban") {
        company.bannedAt = new Date(Date.now());
        await company.save();
      } else if (action === "unban") {
        company = await findOneAndUpdate({ model: Company, id: companyId, data: { $unset: { bannedAt: 1 } } });
      }
      return company;
    },

    approveCompany: async (parent, args) => {
      const { id: companyId, authorization } = args;
      validate(approveCompanySchema, args);

      const user = await authenticate({ authorization, accessRoles: [roles.admin] });
      const company = await findById({ model: Company, id: companyId });
      if (!company) return next(new ErrorResponse("Company not found.", 404));
      company.approvedByAdmin = true;
      await company.save();
      return company;
    },
  },
};

export default resolvers;
