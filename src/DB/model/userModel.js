import mongoose from "mongoose";
import { compareHash, generateHash } from "../../utils/security/hash.js";
import { generateToken } from "../../utils/security/jwt.js";
import { roles, providers, genders, otpType } from "../../utils/constants/userConstants.js";
import { isOver18, isPastDate } from "../validators/userValidators.js";
import { decrypt, encrypt } from "../../utils/security/encryption.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required"],
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // to exclude password from response as default
    },
    provider: {
      type: String,
      enum: Object.values(providers),
      default: providers.system,
    },
    gender: {
      type: String,
      enum: Object.values(genders),
      default: "male",
    },
    DOB: {
      type: Date,
      validate: [
        {
          validator: isOver18,
          message: "You must be 18 years or older to register.",
        },
        {
          validator: isPastDate,
          message: "Date of birth must be in the past.",
        },
      ],
    },
    mobileNumber: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: "user",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    bannedAt: {
      type: Date,
    },
    updateBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    changeCredentialTime: {
      type: Date,
    },
    profilePic: {
      secure_url: String,
      public_id: String,
    },
    coverPic: {
      secure_url: String,
      public_id: String,
    },
    OTP: [
      {
        code: String,
        otptype: {
          type: String,
          enum: Object.values(otpType),
        },
        expiresIn: Date,
      },
    ],
  },
  { timestamps: true, toObject: { virtuals: true } }
);

userSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    if (ret.mobileNumber) ret.mobileNumber = decrypt({ ciphertext: ret.mobileNumber });
    return ret;
  },
});

// virtual userName field
userSchema.virtual("userName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// **Hash password before saving**
userSchema.pre("save", async function (next) {
  // check if password is not modified => no need to re-hash it again
  if (!this.isModified("password")) return next();
  this.password = generateHash({ plaintext: this.password });
  next();
});

// **Compare entered password with hashed password**
userSchema.methods.comparePassword = function (enteredPassword) {
  return compareHash({ plaintext: enteredPassword, hashedText: this.password });
};

/* Generate JWT Token */
userSchema.methods.getSignedJwtToken = function () {
  return generateToken({ payload: { id: this._id, role: this.role }, options: { expiresIn: "1d" } });
};

/* Generate Refresh Token */
userSchema.methods.getSignedRefreshToken = function () {
  return generateToken({ payload: { id: this._id, role: this.role }, options: { expiresIn: "7d" } });
};

/* Socket connection map */
export const socketConnections = new Map();

const User = mongoose.model("User", userSchema);

export default User;
