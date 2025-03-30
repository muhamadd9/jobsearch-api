import { Router } from "express";
import { signUp, confirmEmail, login, forgetPassword, resetPassword } from "./auth.service.js";
import validate from "../../middleware/validation.js";
import {
  signUpSchema,
  confirmEmailSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation.js";

const router = Router();

router.post("/signup", validate(signUpSchema), signUp);
router.post("/confirm-email", validate(confirmEmailSchema), confirmEmail);
router.post("/login", validate(loginSchema), login);
router.post("/forget-password", validate(forgetPasswordSchema), forgetPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
