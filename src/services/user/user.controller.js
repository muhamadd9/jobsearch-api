import { Router } from "express";
import { getProfile, getUserProfile, updateProfile, deleteAccount, updatePassword } from "./user.service.js";
import authenticate from "../../middleware/auth.js";
import validate from "../../middleware/validation.js";
import { updateProfileSchema, getUserProfileSchema, updatePasswordSchema } from "./user.validation.js";

const router = Router();
router.use("/", authenticate);

router.patch("/", validate(updateProfileSchema), updateProfile);
router.get("/", getProfile);
router.get("/:id", validate(getUserProfileSchema), getUserProfile);
router.patch("/update-password", validate(updatePasswordSchema), updatePassword);
router.delete("/", deleteAccount);

export default router;
