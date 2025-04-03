import Joi from "joi";
import { fileSchema } from "../../utils/constants/validationGeneraFields.js";

export const applyToJobSchema = Joi.object({
  id: Joi.string().required(),
  resume: Joi.object(fileSchema),
});

export const acceptAndRejectApplicationSchema = Joi.object({
  id: Joi.string().required(),
  action: Joi.string().valid("accept", "reject").required(),
});

export const getApplicationsToJobSchema = Joi.object({
  jobId: Joi.string().required(),
  page: Joi.number(),
  pageSize: Joi.number(),
  sort: Joi.string(),
});
