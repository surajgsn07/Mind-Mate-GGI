import User from "../models/user.js";
import Therapist from "../models/therapist.js";
import Slot from "../models/slots.js";
import Appointment from "../models/appointment.js";
import Payment from "../models/payment.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import asyncHandler from "express-async-handler";
import nodemailer from 'nodemailer';
import sendMail from "../helpers/mail.helper.js";

export const bookAppointment = asyncHandler(async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_API_SECRET,
    });
    const { therapistId, slotId } = req.body;
    console.log(req.body);
    const userId = req.user._id;
    const roomId = crypto.randomBytes(16).toString("hex");
    const therapist = await Therapist.findById(therapistId);
    const amount = therapist.virtualFee;
    if (!userId || !therapistId || !slotId || !amount || !roomId) {
      return res.status(400).json({ status: false, message: "All fields are required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found." });
    }

    if (!therapist) {
      return res.status(404).json({ status: false, message: "Therapist not found." });
    }

    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ status: false, message: "Slot not found." });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay accepts amount in paise
      currency: "INR",
      payment_capture: 1, // Auto-capture payment
    });

    // Create an appointment entry (pending payment verification)
    const appointment = await Appointment.create({
      userId,
      therapistId,
      slotId,
      roomId,
      payment: amount,
      paymentStatus: "Pending",
    });

    // Create a payment record
    const payment = await Payment.create({
      razorpay_order_id: order.id,
      amount,
      userId,
      appointmentId: appointment._id,
      paymentStatus: "Pending",
    });
    
    


    const mail = await sendMail(`New Appointment from ${user.name}`, therapist.email, `A new appointment has been booked by ${user.name}. Join the session at http://localhost:5173/vc/${roomId}.`);
    if(!mail){
      console.log("Mail not sent")
    }

    res.status(201).json({
      status: true,
      message: "Appointment booked, waiting for payment confirmation.",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
});

export const verifyPayment = asyncHandler(async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_API_SECRET,
    });
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ status: false, message: "All payment fields are required." });
    }

    const payment = await Payment.findOne({ razorpay_order_id });
    if (!payment) {
      return res.status(404).json({ status: false, message: "Payment record not found." });
    }

    // Verify payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ status: false, message: "Payment verification failed." });
    }

    // Update payment status
    payment.paymentStatus = "Completed";
    payment.razorpay_payment_id = razorpay_payment_id;
    await payment.save();

    // Update appointment status
    const appointment = await Appointment.findById(payment.appointmentId);
    if (!appointment) {
      return res.status(404).json({ status: false, message: "Appointment not found." });
    }

    appointment.paymentStatus = "Completed";
    await appointment.save();

    res.status(200).json({
      status: true,
      message: "Payment verified, appointment confirmed.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
});


export const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ userId: req.user._id,paymentStatus:"Completed"}).populate('therapistId').populate('slotId');
  if (appointments) {
    return res.status(200).json({ success: true, appointments });
  }
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

export const getTherapistAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ therapistId: req.user._id });
  if (appointments) {
    return res.status(200).json({ success: true, appointments });
  }
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Validate appointmentId
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res
        .status(400)
        .json({ message: "Invalid appointment ID format." });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      req.body,
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res
      .status(200)
      .json({
        message: "Appointment updated successfully!",
        appointment: updatedAppointment,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update appointment", error: error.message });
  }
};

export const removeAppointment = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const appointment = await Appointment.findByIdAndDelete(id);
  if (appointment) {
    return res
      .status(200)
      .json({ success: true, message: "Appointment removed successfully!" });
  }
  res.status(500).json({ success: false, message: "Something went wrong!" });
});
