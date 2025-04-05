import { Router } from "express";
import {
  signUp,
  confirmEmail,
  login,
  forgetPassword,
  resetPassword,
  loginWithGoogle,
  newAcccessToken,
} from "./auth.service.js";
import validate from "../../middleware/validation.js";
import {
  signUpSchema,
  confirmEmailSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  loginWithGoogleSchema,
  newAcccessTokenSchema,
} from "./auth.validation.js";

const router = Router();

router.post("/signup", validate(signUpSchema), signUp);
router.post("/confirm-email", validate(confirmEmailSchema), confirmEmail);
router.post("/login", validate(loginSchema), login);
router.post("/forget-password", validate(forgetPasswordSchema), forgetPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/login-with-google", validate(loginWithGoogleSchema), loginWithGoogle);
router.post("/new-access-token", validate(newAcccessTokenSchema), newAcccessToken);

export default router;
