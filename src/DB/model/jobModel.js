import mongoose from "mongoose";
import { jobLocations, workingTimes, seniorityLevels } from "../../utils/constants/jobConstants.js";

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: [true, "jobTitle is required"],
    },
    jobLocation: {
      type: String,
      enum: Object.values(jobLocations),
    },
    workingTime: {
      type: String,
      enum: Object.values(workingTimes),
    },
    seniorityLevel: {
      type: String,
      enum: Object.values(seniorityLevels),
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

const Job = mongoose.model("Job", jobSchema);

export default Job;
