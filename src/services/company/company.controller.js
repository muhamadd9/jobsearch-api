import { Router } from "express";
import {
  addCompany,
  approveCompany,
  deleteCompany,
  deleteCompanyCover,
  deleteCompanyLogo,
  getCompanyByName,
  getCompany,
  restoreCompany,
  updateCompany,
  uploadCompanyLogo,
} from "./company.service.js";
import authenticate from "../../middleware/auth.js";
import validate from "../../middleware/validation.js";
import {
  addCompanySchema,
  approveCompanySchema,
  updateCompanySchema,
  deleteCompanySchema,
  restoreCompanySchema,
  getCompanyByNameSchema,
  uploadLogoSchema,
  uploadCoverSchema,
  getCompanySchema,
} from "./company.validation.js";
import authorize from "../../middleware/authorize.js";
import { roles } from "../../utils/constants/userConstants.js";
import { fileValidations, uploadFile } from "../../utils/multer/multer.js";
import uploadFileCloudinary from "../../utils/cloudinary/company.cloud.js";
import jobRouter from "../job/job.controller.js";
const router = Router();
router.use(authenticate);

// Add Company
router.post(
  "/",
  uploadFile({ fileValidation: [...fileValidations.pdf, ...fileValidations.image] }).single("legalAttachment"),
  validate(addCompanySchema),
  addCompany
);
// Approve Company
router.post("/approve/:id", authorize(roles.admin), validate(approveCompanySchema), approveCompany);
// Update Company
router.patch("/:id", validate(updateCompanySchema), updateCompany);
// Delete Company
router.delete("/:id", validate(deleteCompanySchema), deleteCompany);
// Search Company by name
router.get("/search", validate(getCompanyByNameSchema), getCompanyByName);
// get Specific Company
router.get("/:id", validate(getCompanySchema), getCompany);
// Restore Company
router.post("/restore/:id", validate(restoreCompanySchema), restoreCompany);
// Upload Company Logo
router.patch(
  "/upload-logo/:id",
  uploadFile({ fileValidation: fileValidations.image }).single("logo"),
  validate(uploadLogoSchema),
  uploadFileCloudinary(),
  uploadCompanyLogo
);
// Upload Company Cover
router.patch(
  "/upload-cover/:id",
  uploadFile({ fileValidation: fileValidations.image }).single("coverPic"),
  validate(uploadCoverSchema),
  uploadFileCloudinary(),
  uploadCompanyLogo
);
// Delete Company Logo
router.delete("/delete-logo/:id", deleteCompanyLogo);
// Delete Company Cover
router.delete("/delete-cover/:id", deleteCompanyCover);
// get all jobs for company
router.use("/:companyId/job", jobRouter);

export default router;
