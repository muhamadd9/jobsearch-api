import { Router } from "express";
import {
  getProfile,
  getUserProfile,
  updateProfile,
  deleteAccount,
  updatePassword,
  updateProfilePic,
  updateProfileCover,
  deleteProfilePic,
  deleteProfileCover,
} from "./user.service.js";
import authenticate from "../../middleware/auth.js";
import validate from "../../middleware/validation.js";
import {
  updateProfileSchema,
  getUserProfileSchema,
  updatePasswordSchema,
  updateProfilePicSchema,
  updateProfileCoverSchema,
} from "./user.validation.js";
import { fileValidations, uploadFile } from "../../utils/multer/multer.js";
import uploadFileCloudinary from "../../utils/cloudinary/user.cloud.js";

const router = Router();
router.use("/", authenticate);

router.patch("/", validate(updateProfileSchema), updateProfile);
router.get("/", getProfile);
router.get("/:id", validate(getUserProfileSchema), getUserProfile);
router.patch("/update-password", validate(updatePasswordSchema), updatePassword);
router.patch(
  "/update-profile-pic",
  uploadFile({ fileValidation: fileValidations.image }).single("profilePic"),
  validate(updateProfilePicSchema),
  uploadFileCloudinary(),
  updateProfilePic
);
router.patch(
  "/update-profile-cover",
  uploadFile({ fileValidation: fileValidations.image }).single("coverPic"),
  validate(updateProfileCoverSchema),
  uploadFileCloudinary(),
  updateProfileCover
);
router.delete("/delete-profile-pic", deleteProfilePic);
router.delete("/delete-profile-cover", deleteProfileCover);
router.delete("/", deleteAccount);

export default router;
