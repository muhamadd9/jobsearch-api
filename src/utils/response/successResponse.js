export const successResponse = ({ res, status = 200, message = "Success", data = {} }) => {
  return res.status(status).json({ message, data });
};
