import jwt from "jsonwebtoken";

export const generateToken = ({ payload = {}, secret_key = process.env.SECRET_KEY, options = { expiresIn: "1d" } }) => {
  return jwt.sign(payload, secret_key, options);
};

export const verifyToken = ({ token = "", secret_key = process.env.SECRET_KEY }) => {
  return jwt.verify(token, secret_key);
};
