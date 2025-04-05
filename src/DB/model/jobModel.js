import mongoose from "mongoose";
import { jobLocations, workingTimes, seniorityLevels } from "../../utils/constants/jobConstants.js";
import { deleteMany } from "../dbHelper.js";
import Application from "./applicationModel.js";

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: [true, "jobTitle is required"],
    },
    jobLocation: {
      type: String,
      enum: Object.values(jobLocations),
      required: [true, "jobLocation is required"],
    },
    workingTime: {
      type: String,
      enum: Object.values(workingTimes),
      required: [true, "workingTime is required"],
    },
    seniorityLevel: {
      type: String,
      enum: Object.values(seniorityLevels),
      required: [true, "seniorityLevel is required"],
    },
    jobDescription: {
      type: String,
    },
    technicalSkills: {
      type: [String],
    },
    softSkills: {
      type: [String],
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    closed: {
      type: Boolean,
      default: false,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "job",
});

// delete applications when job is deleted
jobSchema.pre("deleteOne", { document: false, query: true }, async function (next) {
  await deleteMany({ model: Application, filter: { job: this._id } });
  next();
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
