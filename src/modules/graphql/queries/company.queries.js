import companyResolvers from "../resolvers/company.resolver.js";
import { companiesType } from "../types/company.types.js";

export const companyQueries = {
  getAllCompanies: {
    type: companiesType,
    resolve: companyResolvers.Query.getAllCompanies,
  },
};
