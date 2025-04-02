import ErrorResponse from "../response/errorResponse.js";
import catchAsync from "../response/catchAsync.js";
import { findById, findByIdAndUpdate } from "../../DB/dbHelper.js";
import User from "../../DB/model/userModel.js";
import { cloud } from "./cloud.config.js";

const uploadFileCloudinary = () =>
  catchAsync(async (req, res, next) => {
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

export default uploadFileCloudinary;
