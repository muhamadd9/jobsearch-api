import Joi from "joi";
import { validationGeneraFields } from "../../utils/constants/validationGeneraFields.js";

export const signUpSchema = Joi.object({
  firstName: validationGeneraFields.firstName,
  lastName: validationGeneraFields.lastName,
  email: validationGeneraFields.email,
  password: validationGeneraFields.password,
  confirmPassword: validationGeneraFields.confirmPassword,
}).required();

export const confirmEmailSchema = Joi.object({
  email: validationGeneraFields.email,
  otp: Joi.string().required(),
}).required();

export const loginSchema = Joi.object({
  email: validationGeneraFields.email,
  password: validationGeneraFields.password,
});

export const forgetPasswordSchema = Joi.object({
  email: validationGeneraFields.email,
});

export const resetPasswordSchema = Joi.object({
  email: validationGeneraFields.email,
  otp: Joi.string().required().min(4).max(4),
  password: validationGeneraFields.password,
});
