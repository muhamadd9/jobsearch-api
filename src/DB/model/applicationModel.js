import mongoose from "mongoose";
import { applicationStatus } from "../../utils/constants/applicationConstants.js";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    resume: {
      secure_url: String,
      public_id: String,
    },
    status: {
      type: String,
      enum: Object.values(applicationStatus),
      default: applicationStatus.pending,
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.models.Application || mongoose.model("Application", applicationSchema);

export default Application;
