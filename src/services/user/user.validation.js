import Joi from "joi";
import { validationGeneraFields } from "../../utils/constants/validationGeneraFields.js";
import { genders } from "../../utils/constants/userConstants.js";

export const updateProfileSchema = Joi.object({
  firstName: validationGeneraFields.firstName,
  lastName: validationGeneraFields.lastName,
  mobileNumber: Joi.string(),
  DOB: Joi.date(),
  gender: Joi.string().valid(...Object.values(genders)),
});

export const getUserProfileSchema = Joi.object({
  id: Joi.string().required(),
});

export const updatePasswordSchema = Joi.object({
  oldPassword: validationGeneraFields.password.required(),
  newPassword: validationGeneraFields.password.required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});
