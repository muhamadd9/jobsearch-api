import Joi from "joi";
import { fileSchema, validationGeneraFields } from "../../utils/constants/validationGeneraFields.js";

export const addCompanySchema = Joi.object({
  companyName: validationGeneraFields.companyName.required(),
  companyEmail: validationGeneraFields.companyEmail.required(),
  description: validationGeneraFields.description.required(),
  industry: validationGeneraFields.industry.required(),
  address: validationGeneraFields.address.required(),
  numberOfEmployees: validationGeneraFields.numberOfEmployees,
  HRs: Joi.array().items(validationGeneraFields.HR),
  legalAttachment: Joi.object(fileSchema).required(),
}).required();

export const approveCompanySchema = Joi.object({
  id: Joi.string().required(),
}).required();

export const updateCompanySchema = Joi.object({
  id: Joi.string().required(),
  companyName: validationGeneraFields.companyName,
  companyEmail: validationGeneraFields.companyEmail,
  description: validationGeneraFields.description,
  industry: validationGeneraFields.industry,
  address: validationGeneraFields.address,
  numberOfEmployees: validationGeneraFields.numberOfEmployees,
  HRs: Joi.array().items(validationGeneraFields.HR),
}).required();

export const deleteCompanySchema = Joi.object({
  id: Joi.string().required(),
});

export const getCompanySchema = deleteCompanySchema;

export const restoreCompanySchema = deleteCompanySchema;

export const getCompanyByNameSchema = Joi.object({
  companyName: validationGeneraFields.companyName.required(),
});

export const uploadLogoSchema = Joi.object({
  id: Joi.string().required(),
  logo: Joi.object(fileSchema).required(),
});
export const uploadCoverSchema = Joi.object({
  id: Joi.string().required(),
  coverPic: Joi.object(fileSchema).required(),
});
