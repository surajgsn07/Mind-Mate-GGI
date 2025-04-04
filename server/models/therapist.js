import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const therapistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
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
      // match: [/^\d{10,15}$/, "Please enter a valid phone number"],
    },
    virtualFee: { type: Number, required: true },
    specialization: {
      type: [String],
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

therapistSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    next();
  } catch (error) {
    next(error);
  }
});

therapistSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Therapist = mongoose.model("Therapist", therapistSchema);

export default Therapist;
