import { findById, findByIdAndUpdate, findOne } from "../../DB/dbHelper.js";
import User from "../../DB/model/userModel.js";
import { cloud } from "../../utils/multer/multer.js";
import catchAsync from "../../utils/response/catchAsync.js";
import ErrorResponse from "../../utils/response/errorResponse.js";
import { successResponse } from "../../utils/response/successResponse.js";
import { encrypt } from "../../utils/security/encryption.js";

/* Update Profile */
export const updateProfile = catchAsync(async (req, res, next) => {
  // encrypt mobile number
  if (req.body.mobileNumber) {
    req.body.mobileNumber = encrypt({ plaintext: req.body.mobileNumber });
  }
  const user = await findByIdAndUpdate({ model: User, id: req.user._id, data: req.body });

  return successResponse({ res, data: user });
});
/* Get Profile */
export const getProfile = catchAsync(async (req, res, next) => {
  const user = await findById({ model: User, id: req.user._id });

  return successResponse({ res, data: user });
});
/* Get User Profile */
export const getUserProfile = catchAsync(async (req, res, next) => {
  const user = await findById({
    model: User,
    id: req.params.id,
    select: "firstName lastName userName mobileNumber profilePic coverPic",
  });
  if (!user) return next(new ErrorResponse("User not found. Access denied.", 401));

  const { userName, mobileNumber, profilePic, coverPic } = user;
  return successResponse({ res, data: { userName, mobileNumber, profilePic, coverPic } });
});
/* Soft Delete Account - To restore account => Login Again */
export const deleteAccount = catchAsync(async (req, res, next) => {
  const user = await findByIdAndUpdate({ model: User, id: req.user._id, data: { deletedAt: Date.now() } });

  return successResponse({ res, data: { message: "Account deleted successfully." } });
});
/* Update Password */
export const updatePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await findById({ model: User, id: req.user._id, select: "+password" });
  if (!user.comparePassword(oldPassword)) return next(new ErrorResponse("Incorrect password. Please try again.", 401));
  user.password = newPassword;
  user.changeCredentialTime = new Date(Date.now());
  await user.save();
  return successResponse({ res, data: { message: "Password updated successfully." } });
});
/* Update Profile Pic */
export const updateProfilePic = catchAsync(async (req, res, next) => {
  return successResponse({ res, data: { message: "Profile Picture updated successfully.", user: req.user } });
});

/* Update Profile Cover */
export const updateProfileCover = catchAsync(async (req, res, next) => {
  return successResponse({ res, data: { message: "Profile Cover updated successfully.", user: req.user } });
});

/* Delete Profile Pic */
export const deleteProfilePic = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (!user.profilePic || !user.profilePic.public_id)
    return next(new ErrorResponse("Profile Picture not found. Access denied.", 401));
  await cloud.uploader.destroy(user.profilePic.public_id);
  const updatedUser = await findByIdAndUpdate({ model: User, id: req.user._id, data: { $unset: { profilePic: 1 } } });
  await user.save();
  return successResponse({ res, data: { message: "Profile Picture deleted successfully.", user: updatedUser } });
});

/* Delete Profile Cover */
export const deleteProfileCover = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (!user.coverPic || !user.coverPic.public_id)
    return next(new ErrorResponse("Profile Cover not found. Access denied.", 401));
  await cloud.uploader.destroy(user.coverPic.public_id);
  const updatedUser = await findByIdAndUpdate({ model: User, id: req.user._id, data: { $unset: { coverPic: 1 } } });
  await user.save();
  return successResponse({ res, data: { message: "Profile Cover deleted successfully.", user: updatedUser } });
});
