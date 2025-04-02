import ErrorResponse from "../utils/response/errorResponse.js";

const validate = (schema) => (req, res, next) => {
  const data = { ...req.body, ...req.params, ...req.query };
  if (req.file || req.files?.length) {
    data[req.file.fieldname] = req.file || req.files;
  }
  const { error } = schema.validate(data, { abortEarly: false });

  if (error) {
    // Return validation errors
    const errors = error.details.map((detail) => `${detail.message.split('"').join("")}`).join(" | ");
    return next(new ErrorResponse(errors, 400));
  }

  next();
};

export default validate;
