import { create, find, findById } from "../../DB/dbHelper.js";
import Application from "../../DB/model/applicationModel.js";
import Company from "../../DB/model/companyModel.js";
import Job from "../../DB/model/jobModel.js";
import { socketConnections } from "../../DB/model/userModel.js";
import { cloud } from "../../utils/cloudinary/cloud.config.js";
import { applicationStatus } from "../../utils/constants/applicationConstants.js";
import emailEvent from "../../utils/email/emailEvent.js";
import catchAsync from "../../utils/response/catchAsync.js";
import ErrorResponse from "../../utils/response/errorResponse.js";
import { successResponse } from "../../utils/response/successResponse.js";
import { io } from "../socket/socket.controller.js";
/* Apply to Job */
export const applyToJob = catchAsync(async (req, res, next) => {
  const { id: jobId } = req.params;

  // check if job exists
  const job = await findById({ model: Job, id: jobId });
  if (!job) return next(new ErrorResponse("Job not found.", 404));

  let resume = null;
  if (req.file) {
    const { secure_url, public_id } = await cloud.uploader.upload(req.file.path, {
      folder: `searchJob/jobs/${jobId}/applications`,
    });
    resume = { secure_url, public_id };
  }

  const data = resume ? { job: jobId, user: req.user._id, resume } : { job: jobId, user: req.user._id };
  const application = await create({ model: Application, data });

  // get the hrs of the company
  const company = await findById({ model: Company, id: job.company });
  if (!company) return next(new ErrorResponse("Company not found.", 404));
  const HRs = company.HRs || [];

  // send notification to all HRs of the company using socket
  HRs.forEach((hr) => {
    const socketId = socketConnections.get(hr._id.toString());
    if (socketId) {
      io.to(socketId).emit("newApplication", {
        message: "New application received",
        application,
      });
    }
  });

  // send notification to job owner emit socket

  return successResponse({ res, data: { message: "Application sent successfully.", application } });
});

/* Accept or reject application */
export const acceptAndRejectApplication = catchAsync(async (req, res, next) => {
  const { id: applicationId } = req.params;
  const { action } = req.query;

  const application = await findById({ model: Application, id: applicationId, populate: ["job", "user"] });
  if (!application) return next(new ErrorResponse("Application not found.", 404));

  // check if user is authorized to accept or reject this application
  const job = await findById({ model: Job, id: application.job._id, populate: ["company"] });
  if (!job) return next(new ErrorResponse("Job not found.", 404));
  if (job.closed) return next(new ErrorResponse("Job is closed.", 400));
  if (
    !job.addedBy.equals(req.user._id) &&
    !job.company.createdBy.equals(req.user._id) &&
    !job.company.HRs.includes(req.user._id)
  )
    return next(new ErrorResponse("Only Job owner, company owner or HR can update applications.", 401));

  // check if application is already accepted or rejected
  if (application.status != applicationStatus.pending)
    return next(new ErrorResponse(`Application already ${application.status}.`, 400));

  if (action === "accept") {
    application.status = applicationStatus.accepted;
  } else if (action === "reject") {
    application.status = applicationStatus.rejected;
  }
  // send email to notify user
  emailEvent.emit("sendApplicationStatus", {
    email: application.user.email,
    status: application.status,
    jobTitle: application.job.jobTitle,
  });

  await application.save();

  return successResponse({ res, data: { message: `Application ${action}ed successfully.`, application } });
});

/* Get all applications to specific job */
export const getApplicationsToJob = catchAsync(async (req, res, next) => {
  const { jobId } = req.params;
  const { page, pageSize, sort } = req.query;
  const job = await findById({ model: Job, id: jobId, populate: ["company"] });

  if (!job) return next(new ErrorResponse("Job not found.", 404));
  if (job.closed) return next(new ErrorResponse("Job is closed.", 400));
  if (
    !job.addedBy.equals(req.user._id) &&
    !job.company.createdBy.equals(req.user._id) &&
    !job.company.HRs.includes(req.user._id)
  )
    return next(new ErrorResponse("Only Job owner, company owner or HR can view applications.", 401));

  const applications = await find({
    model: Application,
    filter: { job: jobId },
    populate: ["user"],
    page,
    pageSize,
    sort,
  });

  return successResponse({ res, data: { applications } });
});
