import bcrypt from "bcrypt";

export const generateHash = ({ plaintext = "", salt = Number(process.env.SALT) || 10 }) => {
  return bcrypt.hashSync(plaintext, salt);
};

export const compareHash = ({ hashedText = "", plaintext = "" }) => {
  return bcrypt.compareSync(plaintext, hashedText);
};
