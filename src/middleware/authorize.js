import ErrorResponse from "../utils/response/errorResponse.js";

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse("Unauthorized to access this route", 403));
    }
    next();
  };

export default authorize;
