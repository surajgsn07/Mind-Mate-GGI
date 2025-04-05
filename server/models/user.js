import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    notificationToken: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer not to say"],
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
      match: [/^\d{10,15}$/, "Please enter a valid phone number"],
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    dob: {
      type: Date,
    },
    type: {
      type: String,
      enum: ["student", "professional", "retired", "unemployed", "other"],
      required: true,
    },
    google_id: {
      type: String,
    },
    hobby: [{ type: String }],
    intrests: [{ type: String }],
    otp:{
      type:String
    },
    isVerified : {
      type : Boolean,
      default : false
    }

  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
