import catchAsync from "../utils/response/catchAsync.js";
import ErrorResponse from "../utils/response/errorResponse.js";
import { verifyToken } from "../utils/security/jwt.js";
import { findById } from "../DB/services/userService.js";
import userModel from "../DB/model/userModel.js";
const authenticate = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Unauthorized to access this route", 401));
  }

  try {
    const decoded = verifyToken({ token });
    const user = await findById({ model: userModel, id: decoded.id });

    if (!user) {
      return next(new ErrorResponse("User not found. Access denied.", 401));
    }
    if (user.bannedAt || user.deletedAt || user.deletedAt)
      return next(new ErrorResponse("Your account has been deleted or banned. Please contact support.", 401));

    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorResponse("Invalid or expired token. Please log in again.", 401));
  }
});

export default authenticate;
