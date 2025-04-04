// models/Slot.js
import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Therapist",
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Slot = mongoose.model("Slot", slotSchema);
export default Slot;
