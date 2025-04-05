import { Router } from "express";
import { applyToJob, acceptAndRejectApplication, getApplicationsToJob } from "./application.service.js";
import authenticate from "../../middleware/auth.js";
import authorize from "../../middleware/authorize.js";
import { roles } from "../../utils/constants/userConstants.js";
import { fileValidations, uploadFile } from "../../utils/multer/multer.js";
import validate from "../../middleware/validation.js";
import {
  applyToJobSchema,
  acceptAndRejectApplicationSchema,
  getApplicationsToJobSchema,
} from "./application.validation.js";

const router = Router({ mergeParams: true });

router.use(authenticate);

// get all applications to specific job
router.get("/", validate(getApplicationsToJobSchema), getApplicationsToJob);

// apply to job (job id)
router.post(
  "/:id/apply",
  authorize(roles.user),
  uploadFile({ fileValidation: fileValidations.pdf }).single("resume"),
  validate(applyToJobSchema),
  applyToJob
);
// Accept or reject application (application id)
router.patch("/:id", validate(acceptAndRejectApplicationSchema), acceptAndRejectApplication);

export default router;
