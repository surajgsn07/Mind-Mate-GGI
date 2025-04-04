import Therapist from "../models/therapist.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const getToken = (user, exp = null) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: exp ? exp : "100d",
    }
  );
};

export const userSignup = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    virtualFee,
    specialization,
    experience,
    gender,
  } = req.body;
  if (!name || !email || !phone || !password || !virtualFee || !specialization || !experience || !gender) {
    return res
      .status(400)
      .json({ status: false, message: "All fields are required" });
  }
  const isTherapistExist = await Therapist.findOne({
    $or: [{ email }, { phone }],
  });
  if (isTherapistExist) {
    return res
      .status(400)
      .json({ status: false, message: "Therapist Already Exists" });
  }
  const user = await Therapist.create({
    name,
    email,
    phone,
    password,
    virtualFee,
    specialization,
    experience,
    gender,
  });

  const token = getToken(user);

  res.status(200).json({
    status: true,
    message: "Signup successful!",
    token,
  });
});

export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await Therapist.findOne({ email });
  if (!user)
    return res
      .status(404)
      .json({ status: false, message: "Therapist Not Found" });
  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch)
    return res
      .status(400)
      .json({ status: false, message: "Invalid Credentials" });
  user.otp = null;
  await user.save();
  const token = getToken(user);
  res.status(200).json({ status: true, message: "Login successful!", token });
});

export const google_login = asyncHandler(async (req, res) => {
  const { email, google_id } = req.body;
  try {
    let user = await Therapist.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Account Not Found" });
    } else {
      if (user.google_id && user.google_id !== google_id) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid Google ID" });
      }
      user.google_id = google_id;
      await user.save();
    }

    user.otp = null;
    await user.save();
    const token = getToken(user);
 
    return res
      .status(200)
      .json({ status: true, message: "Login successful!", token });
  } catch (error) {
    console.error("Google Login Error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});



export const getTherapist = asyncHandler(async (req, res) => {
  const therapist = await Therapist.findById(req.params.id);
  if (!therapist) {
    return res.status(404).json({ status: false, message: "Therapist Not Found" });
  }
  res.status(200).json({ status: true, therapist });
});

export const getAllTherapists = asyncHandler(async (req, res) => {
  const therapists = await Therapist.find({});
  
  if (!therapists) {
    return res.status(400).json({ status: false, message: "Therapists Not Found" });
  }
  res.status(200).json({ status: true, therapists });
});