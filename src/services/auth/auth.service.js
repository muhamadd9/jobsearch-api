import { create, findById, findOne, findOneAndUpdate } from "../../DB/dbHelper.js";
import User from "../../DB/model/userModel.js";
import { otpType } from "../../utils/constants/userConstants.js";
import emailEvent from "../../utils/email/emailEvent.js";
import catchAsync from "../../utils/response/catchAsync.js";
import ErrorResponse from "../../utils/response/errorResponse.js";
import { successResponse } from "../../utils/response/successResponse.js";
import { decrypt } from "../../utils/security/encryption.js";
import { OAuth2Client } from "google-auth-library";
import { verifyToken } from "../../utils/security/jwt.js";

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

  if (user.deletedAt) {
    await findOneAndUpdate({
      model: User,
      filter: {
        email,
        isConfirmed: true,
      },
      data: {
        $unset: { deletedAt: 1 },
      },
    });
  }
  if (user.bannedAt) return next(new ErrorResponse("Your account has been banned. Please contact support.", 401));

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
/* Login and Signup With Google in one endpoint */
export const loginWithGoogle = catchAsync(async (req, res, next) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  async function verify() {
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID,
      });
      return ticket.getPayload();
    } catch (error) {
      return next(new ErrorResponse("Invalid idtoken or audience mismatch", 401));
    }
  }
  const payload = await verify();
  if (!payload) return next(new ErrorResponse("Invalid idtoken or audience mismatch", 401));
  const { email_verified, email, name, picture } = payload;
  if (!email_verified) return next(new CustomError("Email is not verified", 400));

  let user = await findOne({
    model: User,
    filter: {
      email,
      isConfirmed: true,
    },
  });

  if (!user) {
    user = await create({
      model: User,
      data: { email, firstName: name.split(" ")[0], lastName: name.split(" ").slice(1), picture },
    });
  }

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
/* Refresh Token */
export const newAcccessToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;
  const payload = verifyToken({ token: refreshToken });

  const user = await findById({ model: User, id: payload.id });

  if (!user) return next(new ErrorResponse("User not found. Access denied.", 401));

  if (user.changeCredentialTime?.getTime() > payload.iat * 1000) {
    return next(new ErrorResponse("Session expired. Please log in again.", 401));
  }
  if (user.bannedAt || user.deletedAt)
    return next(new ErrorResponse("Your account has been deleted or banned. Please contact support.", 401));

  const accessToken = user.getSignedJwtToken();

  return successResponse({
    res,
    data: {
      accessToken,
    },
  });
});
