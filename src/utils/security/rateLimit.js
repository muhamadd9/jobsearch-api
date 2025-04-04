import { rateLimit } from "express-rate-limit";
import ErrorResponse from "../response/errorResponse.js";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false, 
  handler: (req, res, next) => {
    return next(new ErrorResponse("Too many requests, please try again later.", 429));
  },
});

export default limiter;
