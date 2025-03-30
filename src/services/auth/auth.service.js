import { create, findOne } from "../../DB/dbHelper.js";
import User from "../../DB/model/userModel.js";
import { otpType } from "../../utils/constants/userConstants.js";
import emailEvent from "../../utils/email/emailEvent.js";
import catchAsync from "../../utils/response/catchAsync.js";
import ErrorResponse from "../../utils/response/errorResponse.js";
import { successResponse } from "../../utils/response/successResponse.js";
import { decrypt } from "../../utils/security/encryption.js";

/* Sign Up */
export const signUp = catchAsync(async (req, res, next) => {
  if (await findOne({ model: User, filter: { email: req.body.email } }))
    return next(new ErrorResponse("User already exists. Please log in.", 400));

  emailEvent.emit("sendConfirmEmail", { email: req.body.email });
  const user = await create({ model: User, data: req.body });

  return successResponse({ res, data: user });
});
/* Confirm Email */
export const confirmEmail = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await findOne({
    model: User,
    filter: {
      email,
      isConfirmed: false,
    },
  });

  if (!user) return next(new ErrorResponse("User not found. Access denied.", 401));
  const otpEntry = user.OTP.find((entry) => entry.otptype === otpType.confirmEmail);

  if (!otpEntry) return next(new ErrorResponse("Invalid OTP. Please try again.", 401));

  if (otpEntry.expiresIn < Date.now())
    return next(new ErrorResponse("OTP has expired. Please request a new one.", 401));

  if (decrypt({ ciphertext: otpEntry.code }) !== otp)
    return next(new ErrorResponse("Invalid OTP. Please try again.", 401));

  user.isConfirmed = true;
  user.OTP = [];
  await user.save();
  return successResponse({
    res,
    data: {
      message: "Email confirmed successfully.",
    },
  });
});
/* Login */
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await findOne({
    model: User,
    filter: {
      email,
      isConfirmed: true,
    },
    select: "+password",
  });

  if (!user) return next(new ErrorResponse("User not found. Access denied.", 401));

  if (!user.comparePassword(password)) return next(new ErrorResponse("Incorrect password. Please try again.", 401));

  const accessToken = user.getSignedJwtToken();
  const refreshToken = user.getSignedRefreshToken();

  return successResponse({
    res,
    data: {
      message: "Login successful.",
      accessToken,
      refreshToken,
    },
  });
});
/* Forget Password  */
export const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await findOne({
    model: User,
    filter: {
      email,
      isConfirmed: true,
    },
  });

  if (!user) return next(new ErrorResponse("User not found. Access denied.", 401));

  emailEvent.emit("sendForgetPassword", { email });
  return successResponse({
    res,
    data: {
      message: "Email sent successfully.",
    },
  });
});
/* Reset Password  */
export const resetPassword = catchAsync(async (req, res, next) => {
  const { email, otp, password } = req.body;
  const user = await findOne({
    model: User,
    filter: {
      email,
      isConfirmed: true,
    },
  });

  if (!user) return next(new ErrorResponse("User not found. Access denied.", 404));

  const otpEntry = [...user.OTP].reverse().find((entry) => entry.otptype === otpType.forgetPassword);

  if (!otpEntry) return next(new ErrorResponse("Invalid OTP. Please try again.", 401));

  if (otpEntry.expiresIn < Date.now())
    return next(new ErrorResponse("OTP has expired. Please request a new one.", 401));

  if (decrypt({ ciphertext: otpEntry.code }) !== otp)
    return next(new ErrorResponse("Invalid OTP. Please try again.", 401));

  user.password = password;
  user.changeCredentialTime = new Date(Date.now());
  user.OTP = [];

  await user.save();
  return successResponse({
    res,
    data: {
      message: "Password reset successfully.",
    },
  });
});
