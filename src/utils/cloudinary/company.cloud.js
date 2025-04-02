import { findById } from "../../DB/dbHelper.js";
import Company from "../../DB/model/companyModel.js";
import { roles } from "../constants/userConstants.js";
import catchAsync from "../response/catchAsync.js";
import ErrorResponse from "../response/errorResponse.js";
import { cloud } from "./cloud.config.js";

const uploadFileCloudinary = () =>
  catchAsync(async (req, res, next) => {
    const file = req.file;
    if (!file) {
      return next(new ErrorResponse("Please upload a file", 400));
    }
    const company = await findById({ model: Company, id: req.params.id });
    if (!company) return next(new ErrorResponse("Company not found.", 404));
    if (!company.createdBy.equals(req.user._id))
      return next(new ErrorResponse("You are not authorized to update this company.", 401));
    if (!company.approvedByAdmin) return next(new ErrorResponse("Company not approved.", 400));
    // fieldname to get the name of the file like logo or coverPic
    const fieldName = file.fieldname;
    const result = await cloud.uploader.upload(file.path, {
      folder: `searchJob/uploads/companies/${company._id}/${fieldName}`,
    });
    if (company[fieldName]?.public_id) {
      await cloud.uploader.destroy(company[fieldName].public_id);
    }

    company[fieldName].secure_url = result.secure_url;
    company[fieldName].public_id = result.public_id;

    await company.save();
    req.company = company;
    return next();
  });

export default uploadFileCloudinary;
