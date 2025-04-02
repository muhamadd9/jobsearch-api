import Joi from "joi";

export const validationGeneraFields = {
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string(),
  password: Joi.string(),
  confirmPassword: Joi.string().valid(Joi.ref("password")),
  companyName: Joi.string(),
  companyEmail: Joi.string(),
  description: Joi.string(),
  industry: Joi.string(),
  address: Joi.string(),
  numberOfEmployees: Joi.number().min(11).max(20),
  HR: Joi.object(),
};

export const fileSchema = {
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  encoding: Joi.string().required(),
  mimetype: Joi.string().required(),
  destination: Joi.string().required(),
  filename: Joi.string().required(),
  path: Joi.string().required(),
  size: Joi.number().required(),
};
