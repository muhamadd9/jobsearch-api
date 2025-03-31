import Joi from "joi";

export const validationGeneraFields = {
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string(),
  password: Joi.string(),
  confirmPassword: Joi.string().valid(Joi.ref("password")),
};
