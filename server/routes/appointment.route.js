import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.js";
import {
  bookAppointment,
  verifyPayment,
  getAppointments,
  getTherapistAppointments,
  updateAppointmentStatus,
  removeAppointment,
} from "../controllers/appointment.js";

const router = Router();

// Route to book an appointment (protected)
router.post("/book", verifyAuth, bookAppointment);

// Route to verify payment after booking (protected)
router.post("/verify-payment", verifyAuth, verifyPayment);

// Route to get all user appointments (protected)
router.get("/my-appointments", verifyAuth, getAppointments);

// Route to get all therapist's appointments (protected)
router.get("/therapist-appointments", verifyAuth, getTherapistAppointments);

// Route to update appointment status (protected)
router.put("/update/:appointmentId", verifyAuth, updateAppointmentStatus);

// Route to remove an appointment (protected)
router.delete("/remove", verifyAuth, removeAppointment);

export default router;
