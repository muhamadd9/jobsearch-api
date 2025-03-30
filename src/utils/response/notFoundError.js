import ErrorResponse from "./errorResponse.js";

const notFoundError = (req, res, next) => {
  next(new ErrorResponse(`Route '${req.originalUrl}' not found`, 404));
};
export default notFoundError;
