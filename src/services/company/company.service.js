import { create, findById, findOne, findOneAndUpdate } from "../../DB/dbHelper.js";
import Company from "../../DB/model/companyModel.js";
import { cloud } from "../../utils/cloudinary/cloud.config.js";
import { roles } from "../../utils/constants/userConstants.js";
import catchAsync from "../../utils/response/catchAsync.js";
import ErrorResponse from "../../utils/response/errorResponse.js";
import { successResponse } from "../../utils/response/successResponse.js";

/* Add Company */
export const addCompany = catchAsync(async (req, res, next) => {
  // check if company name or email already exists
  if (
    await findOne({
      model: Company,
      filter: {
        $or: [
          {
            companyName: req.body.companyName,
          },
          {
            companyEmail: req.body.companyEmail,
          },
        ],
      },
    })
  ) {
    return next(new ErrorResponse("Company already exists. Please try again.", 400));
  }
  // upload legalAttachment to cloudinary
  if (req.file) {
    const result = await cloud.uploader.upload(req.file.path, {
      folder: `searchJob/uploads/companies/legalAttachments`,
    });
    req.body.legalAttachment = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  await create({ model: Company, data: { ...req.body, createdBy: req.user._id } });
  return successResponse({ res, data: { message: "Company added successfully." } });
});
/* Approve Company */
export const approveCompany = catchAsync(async (req, res, next) => {
  const company = await findById({ model: Company, id: req.params.id });
  if (!company) return next(new ErrorResponse("Company not found.", 404));
  if (company.approvedByAdmin) return next(new ErrorResponse("Company already approved.", 400));
  company.approvedByAdmin = true;
  await company.save();
  return successResponse({ res, data: { message: "Company approved successfully." } });
});
/* Update Company */
export const updateCompany = catchAsync(async (req, res, next) => {
  const { id: companyId } = req.params;
  const company = await findById({ model: Company, id: companyId });
  if (!company) return next(new ErrorResponse("Company not found.", 404));
  // check if user is authorized to update this company
  if (!company.createdBy.equals(req.user._id))
    return next(new ErrorResponse("You are not authorized to update this company.", 401));
  if (!company.approvedByAdmin) return next(new ErrorResponse("Company not approved.", 400));

  await findOneAndUpdate({ model: Company, id: companyId, data: req.body });
  return successResponse({ res, data: { message: "Company updated successfully." } });
});
/* Delete Company */
export const deleteCompany = catchAsync(async (req, res, next) => {
  const { id: companyId } = req.params;
  const company = await findById({ model: Company, id: companyId });
  if (!company) return next(new ErrorResponse("Company not found.", 404));
  if (!company.approvedByAdmin) return next(new ErrorResponse("Company not approved.", 400));
  if (company.deletedAt) return next(new ErrorResponse("Company already deleted.", 400));

  // check if user is authorized to delete this company
  if ((req.user.role = roles.user)) {
    if (!company.createdBy.equals(req.user._id))
      return next(new ErrorResponse("You are not authorized to delete this company.", 401));
  }
  await findOneAndUpdate({ model: Company, id: companyId, data: { deletedAt: Date.now() } });
  return successResponse({ res, data: { message: "Company deleted successfully." } });
});
/* Restore Company */
export const restoreCompany = catchAsync(async (req, res, next) => {
  const { id: companyId } = req.params;
  const company = await findById({ model: Company, id: companyId });
  if (!company) return next(new ErrorResponse("Company not found.", 404));
  if (!company.deletedAt) {
    return next(new ErrorResponse("Company not deleted.", 400));
  }
  // check if user is authorized to delete this company
  if ((req.user.role = roles.user)) {
    if (!company.createdBy.equals(req.user._id))
      return next(new ErrorResponse("You are not authorized to restore this company.", 401));
  }

  await findOneAndUpdate({ model: Company, id: companyId, data: { $unset: { deletedAt: 1 } } });

  return successResponse({ res, data: { message: "Company restored successfully." } });
});
export const getCompany = catchAsync(async (req, res, next) => {
  const company = await findById({ model: Company, id: req.params.id, populate: "jobs" });
  if (!company) return next(new ErrorResponse("Company not found.", 404));

  return successResponse({ res, data: { company } });
});
/* Search Company by name */
export const getCompanyByName = catchAsync(async (req, res, next) => {
  const company = await findOne({
    model: Company,
    filter: {
      companyName: { $regex: req.query.companyName, $options: "i" },
    },
  });

  if (!company) return next(new ErrorResponse("Company not found.", 404));

  return successResponse({ res, data: { company } });
});
/* Upload Company Logo  */
export const uploadCompanyLogo = catchAsync(async (req, res, next) => {
  return successResponse({ res, data: { message: "Company logo uploaded successfully.", company: req.company } });
});
/* Upload Company Cover  */
export const uploadCompanyCover = catchAsync(async (req, res, next) => {
  return successResponse({ res, data: { message: "Company logo uploaded successfully.", company: req.company } });
});
/* Delete Company Logo  */
export const deleteCompanyLogo = catchAsync(async (req, res, next) => {
  const company = await findById({ model: Company, id: req.params.id });
  if (!company) return next(new ErrorResponse("Company not found.", 404));

  if (!company.createdBy.equals(req.user._id))
    return next(new ErrorResponse("You are not authorized to update this company.", 401));
  if (!company.approvedByAdmin) return next(new ErrorResponse("Company not approved.", 400));

  if (!company.logo?.public_id) return next(new ErrorResponse("Company logo not found.", 404));

  await cloud.uploader.destroy(company.logo.public_id);

  company.logo = null;
  await company.save();

  return successResponse({ res, data: { message: "Company logo deleted successfully.", company } });
});
/* Delete Company Cover  */
export const deleteCompanyCover = catchAsync(async (req, res, next) => {
  const company = await findById({ model: Company, id: req.params.id });
  if (!company) return next(new ErrorResponse("Company not found.", 404));

  if (!company.createdBy.equals(req.user._id))
    return next(new ErrorResponse("You are not authorized to update this company.", 401));
  if (!company.approvedByAdmin) return next(new ErrorResponse("Company not approved.", 400));

  if (!company.coverPic?.public_id) return next(new ErrorResponse("Company cover not found.", 404));

  await cloud.uploader.destroy(company.coverPic.public_id);

  company.coverPic = null;
  await company.save();

  return successResponse({ res, data: { message: "Company cover deleted successfully.", company } });
});
