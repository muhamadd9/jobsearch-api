import mongoose from "mongoose";
import Job from "./jobModel.js";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "companyName is required"],
      unique: true,
    },
    description: {
      type: String,
    },
    industry: {
      type: String,
    },
    address: {
      type: String,
    },
    numberOfEmployees: {
      type: Number,
      min: 11,
      max: 20,
    },
    companyEmail: {
      type: String,
      required: [true, "companyEmail is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    logo: {
      secure_url: String,
      public_id: String,
    },
    coverPic: {
      secure_url: String,
      public_id: String,
    },
    HRs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bannedAt: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },
    legalAttachment: {
      secure_url: String,
      public_id: String,
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// virtual populate 
companySchema.virtual("jobs", {
  ref: "Job",               
  localField: "_id",       
  foreignField: "company",  
});
const Company = mongoose.model("Company", companySchema);

export default Company;
