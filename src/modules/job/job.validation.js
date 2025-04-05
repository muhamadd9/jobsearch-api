import Joi from "joi";
import { jobLocations, seniorityLevels, workingTimes } from "../../utils/constants/jobConstants.js";

const jobGeneralFields = {
  jobTitle: Joi.string(),
  jobLocation: Joi.string().valid(...Object.values(jobLocations)),
  workingTime: Joi.string().valid(...Object.values(workingTimes)),
  seniorityLevel: Joi.string().valid(...Object.values(seniorityLevels)),
  jobDescription: Joi.string(),
  technicalSkills: Joi.array().items(Joi.string()),
  softSkills: Joi.array().items(Joi.string()),
  addedBy: Joi.string(),
  updatedBy: Joi.string(),
  closed: Joi.boolean(),
  company: Joi.string,
};

export const addJobSchema = Joi.object({
  ...jobGeneralFields,
  // the required fields
  id: Joi.string().required(),
  jobTitle: jobGeneralFields.jobTitle.required(),
  jobLocation: jobGeneralFields.jobLocation.required(),
  workingTime: jobGeneralFields.workingTime.required(),
  seniorityLevel: jobGeneralFields.seniorityLevel.required(),
}).required();

export const updateJobSchema = Joi.object({
  ...jobGeneralFields,
  id: Joi.string().required(),
});

export const deleteJobSchema = Joi.object({
  id: Joi.string().required(),
});

export const getAllCompanyJobsSchema = Joi.object({
  companyId: Joi.string().required(),
  page: Joi.number(),
  pageSize: Joi.number(),
  name: Joi.string(),
  sortField: Joi.string(),
});
export const getAllJobsSchema = Joi.object({
  page: Joi.number(),
  pageSize: Joi.number(),
  jobTitle: jobGeneralFields.jobTitle,
  workingTime: jobGeneralFields.workingTime,
  jobLocation: jobGeneralFields.jobLocation,
  seniorityLevel: jobGeneralFields.seniorityLevel,
  technicalSkills: jobGeneralFields.technicalSkills,
  sortField: Joi.string(),
});

export const getJobSchema = deleteJobSchema;
