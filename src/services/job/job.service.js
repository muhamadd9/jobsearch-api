import { create, find, findById, findByIdAndDelete, findOneAndUpdate } from "../../DB/dbHelper.js";
import Company from "../../DB/model/companyModel.js";
import Job from "../../DB/model/jobModel.js";
import { roles } from "../../utils/constants/userConstants.js";
import catchAsync from "../../utils/response/catchAsync.js";
import ErrorResponse from "../../utils/response/errorResponse.js";
import { successResponse } from "../../utils/response/successResponse.js";

/* Add Job */
export const addJob = catchAsync(async (req, res, next) => {
  const { id: companyId } = req.params;
  const company = await findById({ model: Company, id: companyId });
  if (!company) return next(new ErrorResponse("Company not found.", 404));
  if (!company.approvedByAdmin) return next(new ErrorResponse("Company not approved.", 400));

  // check if user is owner or HR
  if (!company.createdBy.equals(req.user._id) && !company.HRs.includes(req.user._id)) {
    return next(new ErrorResponse("You are not authorized to add job to this company.", 401));
  }

  const job = await create({ model: Job, data: { ...req.body, company: company._id, addedBy: req.user._id } });

  return successResponse({ res, data: { message: "Job added successfully.", job } });
});
/* Update Job */
export const updateJob = catchAsync(async (req, res, next) => {
  const { id: jobId } = req.params;
  const job = await findById({ model: Job, id: jobId });
  if (!job) return next(new ErrorResponse("Job not found.", 404));

  // check if user is authorized to update this job
  if (!job.addedBy.equals(req.user._id)) return next(new ErrorResponse("Only Job owner can update this job.", 401));

  const updatedJob = await findOneAndUpdate({ model: Job, id: jobId, data: req.body });

  return successResponse({ res, data: { message: "Job updated successfully.", job: updatedJob } });
});
/* Delete Job */
export const deleteJob = catchAsync(async (req, res, next) => {
  const { id: jobId } = req.params;
  const job = await findById({ model: Job, id: jobId });
  if (!job) return next(new ErrorResponse("Job not found.", 404));

  // check if user is authorized to delete this job (admin or job owner)
  if (!job.addedBy.equals(req.user._id) || req.user.role !== roles.admin)
    return next(new ErrorResponse("Only Job owner can delete this job.", 401));

  await findByIdAndDelete({ model: Job, id: jobId });
  return successResponse({ res, data: { message: "Job deleted successfully." } });
});
/* get all jobs for company */
export const getAllCompanyJobs = catchAsync(async (req, res, next) => {
  const { companyId } = req.params;
  const { page, pageSize, name, sortField } = req.query;
  // handle the filtration and sorting
  const filter = name ? { company: companyId, jobTitle: { $regex: name, $options: "i" } } : { company: companyId };
  const sort = sortField ? { [sortField]: 1 } : { createdAt: -1 };
  const jobs = await find({
    model: Job,
    filter,
    page,
    pageSize,
    sort,
  });

  return successResponse({ res, data: { jobs } });
});
/* get job by id */
export const getJob = catchAsync(async (req, res, next) => {
  const { id: jobId } = req.params;
  const job = await findById({ model: Job, id: jobId });
  if (!job) return next(new ErrorResponse("Job not found.", 404));

  return successResponse({ res, data: { message: "Job found successfully.", job } });
});
/* get all jobs */
export const getAllJobs = catchAsync(async (req, res, next) => {
  const { page, pageSize, workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills, sortField } = req.query;

  // handle the filtration and sorting
  const filter = {};

  if (workingTime) filter.workingTime = workingTime;
  if (jobLocation) filter.jobLocation = jobLocation;
  if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
  if (jobTitle) filter.jobTitle = { $regex: jobTitle, $options: "i" };
  if (technicalSkills) filter.technicalSkills = { $in: skillsArray };

  const sort = sortField ? { [sortField]: 1 } : { createdAt: -1 };

  const jobs = await find({ model: Job, filter, page, pageSize, populate: [{ path: "company" }], sort });

  return successResponse({ res, data: { jobs } });
});
