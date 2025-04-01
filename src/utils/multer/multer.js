import multer from "multer";
import catchAsync from "../response/catchAsync.js";
import { findById, findByIdAndUpdate } from "../../DB/dbHelper.js";
import User from "../../DB/model/userModel.js";
import cloudinary from "cloudinary";
import * as dotenv from "dotenv";
import path from "node:path";
import ErrorResponse from "../response/errorResponse.js";
dotenv.config({ path: path.resolve("./src/config/.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
export const cloud = cloudinary.v2;

export const fileValidations = {
  image: ["image/png", "image/jpeg", "image/jpg", "image/gif"],
  pdf: ["application/pdf"],
  video: ["video/mp4"],
};
export const uploadFile = ({ fileValidation = [] }) => {
  const storage = multer.diskStorage({});
  const fileFilter = (req, file, cb) => {
    if (fileValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  };

  return multer({
    storage,
    fileFilter,
  });
};

export const uploadFileCloudinary = catchAsync(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new ErrorResponse("Please upload a file", 400));
  }
  // fieldname to get the name of the file like profilePic or coverPic
  const fieldName = file.fieldname;
  const result = await cloud.uploader.upload(file.path, {
    folder: `searchJob/uploads/users/${req.user._id}/${fieldName}`,
  });

  const user = await findById({ model: User, id: req.user._id });
  if (user.profilePic?.public_id) {
    await cloud.uploader.destroy(user.profilePic.public_id);
  }

  const updatedUser = await findByIdAndUpdate({
    model: User,
    id: req.user._id,
    data: {
      [fieldName]: {
        public_id: result.public_id,
        secure_url: result.secure_url,
      },
    },
  });
  req.user = updatedUser;
  next();
});
