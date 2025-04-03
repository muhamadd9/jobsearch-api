import ErrorResponse from "../../utils/response/errorResponse.js";

const validate = (schema, args) => {
  const { error } = schema.validate(args, { abortEarly: false });

  if (error) {
    // throw validation errors
    const errors = error.details.map((detail) => `${detail.message.split('"').join("")}`).join(" | ");
    throw new ErrorResponse(errors, 400);
  }

  return true;
};

export default validate;
