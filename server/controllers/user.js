import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import sendMail from "../helpers/mail.helper.js";

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


let otpMap = new Map();

export const userSignup = asyncHandler(async (req, res) => {
  const { name, email, phone, password, type, dob, gender } = req.body;
  const isUserExist = await User.findOne({
    $or: [{ email }, { phone }],
  });
  if (isUserExist) {
    return res
      .status(400)
      .json({ status: false, message: "User Already Exists" });
  
    }

    const otp = Math.floor(Math.random() * 900000) + 100000;
    const otpMessage = `Your OTP is ${otp}.`;
    const otpHtml = `<h2>Your OTP is ${otp}.</h2>`;
    await sendMail("OTP Verification", email, otpMessage, otpHtml);

    const user = await User.create({
      name,
      email,
      phone,
      password,
      type,
      dob: new Date(dob),
      gender,
      otp
    });

    
  res.status(200).json({
    status: true,
    message: "Signup successful!"
  });
});

export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email , isVerified : true });
  if (!user)
    return res.status(404).json({ status: false, message: "User Not Found" });
  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch)
    return res
      .status(400)
      .json({ status: false, message: "Invalid Credentials" });
  user.otp = null;
  await user.save();
  const token = getToken(user);
  res.status(200).json({ status: true, message: "Login successful!", token,user });
});

export const google_login = asyncHandler(async (req, res) => {
  const { email, google_id, name } = req.body;
  try {
    let user = await User.findOne({ email });
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


export const getUser = asyncHandler(async (req, res) => {
  try {
      const user=req.user;
      if (!user) return res.status(404).json({ status: false, message: 'User Not Found' });
      return res.status(200).json({ status: true, message: "User Fetched", user });
  } catch (error) {
      res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
});

export const verifyOtp = asyncHandler(async(req,res)=>{
  const {otp , email} = req.body;

  console.log({otp , email})

  if(!otp){
    return res.status(400).json({message : "Otp not found"});
  }

  const user = await User.findOne({email});
  if(!user){
    return res.status(400).json({message : "user not found"});
  }

  if(user.otp != otp){
    return res.status(400).json({message : "Wrong OTP"});
  }

  user.isVerified = true;

  await user.save();

  const token = getToken(user);

  return res.status(200).json({
    message : "OTP verified",
    user,
    token
  })
})