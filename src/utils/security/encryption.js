import CryptoJS from "crypto-js";

export const encrypt = ({ plaintext = "", key = process.env.ENCRYPTION_KEY }) => {
  return CryptoJS.AES.encrypt(plaintext, key).toString();
};

export const decrypt = ({ ciphertext = "", key = process.env.ENCRYPTION_KEY }) => {
  return CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
};
