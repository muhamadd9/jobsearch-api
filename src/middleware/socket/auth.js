import ErrorResponse from "../../utils/response/errorResponse.js";
import { verifyToken } from "../../utils/security/jwt.js";
import { findById } from "../../DB/dbHelper.js";
import userModel from "../../DB/model/userModel.js";
import catchAsync from "../../utils/response/catchAsync.js";

// Socket authentication and authorization
const authenticate = catchAsync(async ({ accessRoles = [], socket = {} }) => {
  const token = socket.handshake.auth.authorization.split(" ")[1];
  if (!token) {
    return { success: false, data: { message: "Unauthorized to access this route", status: 401 } };
  }
  try {
    const decoded = verifyToken({ token });
    const user = await findById({ model: userModel, id: decoded.id });

    if (!user) {
      return { success: false, data: { message: "User not found. Access denied.", status: 401 } };
    }
    if (user.bannedAt || user.deletedAtuser)
      return {
        success: false,
        data: { message: "Your account has been deleted or banned. Please contact support.", status: 401 },
      };

    if (user.changeCredentialTime?.getTime() > decoded.iat * 1000) {
      return { success: false, data: { message: "Session expired. Please log in again.", status: 401 } };
    }
    if (!accessRoles.includes(user.role)) {
      return { success: false, data: { message: "Unauthorized to access this route", status: 403 } };
    }

    return { success: true, data: { message: "Done", user, valid: true } };
  } catch (error) {
    throw error;
  }
});

export default authenticate;
