import { Router } from "express";
import { addJob, deleteJob, updateJob, getAllCompanyJobs, getJob, getAllJobs } from "./job.service.js";
import authenticate from "../../middleware/auth.js";
import validate from "../../middleware/validation.js";
import {
  addJobSchema,
  deleteJobSchema,
  updateJobSchema,
  getAllCompanyJobsSchema,
  getJobSchema,
  getAllJobsSchema,
} from "./job.validation.js";
import applicationRouter from "../application/application.controller.js";
const router = Router({ mergeParams: true });
// get all jobs
router.get("/all", authenticate, validate(getAllJobsSchema), getAllJobs);
// get all jobs for specific company
router.get("/", authenticate, validate(getAllCompanyJobsSchema), getAllCompanyJobs);
// get specific job
router.get("/:id", authenticate, validate(getJobSchema), getJob);
// add job (add company id)
router.post("/:id", authenticate, validate(addJobSchema), addJob);
// update job (job id)
router.patch("/:id", authenticate, validate(updateJobSchema), updateJob);
// delete job (job id)
router.delete("/:id", authenticate, validate(deleteJobSchema), deleteJob);
// get all applications to specific job
router.use("/:jobId/application", applicationRouter);
export default router;
