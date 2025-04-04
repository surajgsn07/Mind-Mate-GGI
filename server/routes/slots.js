import express  from "express";
import { getSlotsByDoctorId } from "../controllers/slots.js";
const slotsRouter = express.Router();

slotsRouter.get("/:id",getSlotsByDoctorId);

export default slotsRouter;