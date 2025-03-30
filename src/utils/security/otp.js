import { customAlphabet } from "nanoid";

export const generateOTP = () => {
  return customAlphabet("0123456789", 4)();
};
