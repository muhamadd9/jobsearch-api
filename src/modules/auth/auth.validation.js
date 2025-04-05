import Joi from "joi";
import { validationGeneraFields } from "../../utils/constants/validationGeneraFields.js";

export const signUpSchema = Joi.object({
  firstName: validationGeneraFields.firstName.required(),
  lastName: validationGeneraFields.lastName.required(),
  email: validationGeneraFields.email.required(),
  password: validationGeneraFields.password.required(),
  confirmPassword: validationGeneraFields.confirmPassword.required(),
}).required();

export const confirmEmailSchema = Joi.object({
  email: validationGeneraFields.email.required(),
  otp: Joi.string().required(),
}).required();

export const loginSchema = Joi.object({
  email: validationGeneraFields.email.required(),
  password: validationGeneraFields.password.required(),
});

export const forgetPasswordSchema = Joi.object({
  email: validationGeneraFields.email.required(),
});

export const resetPasswordSchema = Joi.object({
  email: validationGeneraFields.email.required(),
  otp: Joi.string().required().min(4).max(4),
  password: validationGeneraFields.password.required(),
});

export const loginWithGoogleSchema = Joi.object({
  idToken: Joi.string().required(),
});

export const newAcccessTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
