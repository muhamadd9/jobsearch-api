import mongoose from "mongoose";
import roles from "../../utils/constants/roles.js";
import { compareHash, generateHash } from "../../utils/security/hash.js";
import { generateToken } from "../../utils/security/jwt.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
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
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: "user",
    },
  },
  { timestamps: true }
);

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
  return generateToken({ payload: { id: this._id, role: this.role } });
};

/* Generate Refresh Token */
userSchema.methods.getSignedRefreshToken = function () {
  return generateToken({ payload: { id: this._id, role: this.role }, options: { expiresIn: "7d" } });
};

export default mongoose.model("User", userSchema);
