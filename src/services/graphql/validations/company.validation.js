import Joi from "joi";

export const banOrUnbanCompanySchema = Joi.object({
  id: Joi.string().required(),
  action: Joi.string().valid("ban", "unban").required(),
  authorization: Joi.string().required(),
}).required();

export const approveCompanySchema = Joi.object({
  id: Joi.string().required(),
  authorization: Joi.string().required(),
}).required();
