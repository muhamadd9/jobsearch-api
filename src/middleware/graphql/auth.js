import ErrorResponse from "../../utils/response/errorResponse.js";
import { verifyToken } from "../../utils/security/jwt.js";
import { findById } from "../../DB/dbHelper.js";
import userModel from "../../DB/model/userModel.js";
import catchAsync from "../../utils/response/catchAsync.js";

// Graphql authentication and authorization
const authenticate = catchAsync(async ({ authorization = "", accessRoles = [] }) => {
  const token = authorization.split(" ")[1];
  console.log(token);
  if (!token) {
    throw new ErrorResponse("Unauthorized to access this route", 401);
  }

  try {
    const decoded = verifyToken({ token });
    const user = await findById({ model: userModel, id: decoded.id });

    if (!user) {
      throw new ErrorResponse("User not found. Access denied.", 401);
    }
    if (user.bannedAt || user.deletedAtuser)
      throw new ErrorResponse("Your account has been deleted or banned. Please contact support.", 401);

    if (user.changeCredentialTime?.getTime() > decoded.iat * 1000) {
      throw new ErrorResponse("Session expired. Please log in again.", 401);
    }
    if (!accessRoles.includes(user.role)) {
      throw new ErrorResponse("Unauthorized to access this route", 401);
    }

    return user;
  } catch (error) {
    throw error;
  }
});

export default authenticate;
